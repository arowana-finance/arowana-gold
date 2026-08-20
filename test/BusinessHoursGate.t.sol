// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Mock } from "../contracts/tokens/ERC20Mock.sol";
import { Errors } from "../contracts/libraries/Errors.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";
import { IGoldMinter } from "../contracts/interfaces/IGoldMinter.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { ReportV8 } from "../contracts/interfaces/DataStreamsReports.sol";
import { IVerifierProxy } from "../contracts/interfaces/IVerifierProxy.sol";

/// @dev Minimal gold token (open mint/burn, no blacklist oracle). Kept local so this
///      gate suite is self-contained and compiles independently of the other suites.
contract MockGoldToken is ERC20 {
    constructor() ERC20("Ontorium Gold", "OXAU") { }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(uint256 value) external {
        _burn(msg.sender, value);
    }

    function burnFrom(address account, uint256 value) external {
        _spendAllowance(account, msg.sender, value);
        _burn(account, value);
    }

    function blacklistOracle() external pure returns (address) {
        return address(0);
    }
}

/// @title BusinessHoursGate
/// @notice Focused tests for the R8 business-hours trade-window gate (docs/설계.md R8).
///         The gate (`GoldMinter._consumeTradeWindow`) runs FIRST inside both request
///         funnels and admits a request only when a KYC_MANAGER-signed EIP-712 TradeWindow
///         is: bound to msg.sender, inside [validAfter, validBefore], and carries an unused
///         Permit2-style unordered nonce. No dates/holidays live on-chain — the backend
///         issues (or withholds) a window off-chain from Hong Kong hours. Because the report
///         is public, the SIGNATURE (not report custody) is what enforces the window.
contract BusinessHoursGate is Test {
    GoldMinter minter;
    GoldStreamVerifier verifier;
    MockGoldToken gold;
    ERC20Mock usdt;
    ERC20Mock usdc;
    ERC20Mock link;

    address verifierProxy = makeAddr("verifierProxy");
    address usdRecipient = makeAddr("usdRecipient");
    address feeRecipient = makeAddr("feeRecipient");
    address user = makeAddr("user");

    // Backend signer: holds KYC_MANAGER_ROLE (the role that signs KYC AND issues windows).
    address twSigner;
    uint256 twSignerPk;
    // An address WITHOUT the role, to prove non-manager windows are rejected.
    address outsider;
    uint256 outsiderPk;

    bytes32 constant FEED_ID = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;
    uint256 constant PRICE8 = 2000e8; // $2000/oz

    function setUp() public {
        vm.warp(1_000_000);

        gold = new MockGoldToken();
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);
        link = new ERC20Mock("Chainlink", "LINK", 18, 0);

        GoldStreamVerifier vImpl = new GoldStreamVerifier();
        verifier = GoldStreamVerifier(
            address(
                new ERC1967Proxy(
                    address(vImpl),
                    abi.encodeCall(
                        GoldStreamVerifier.initialize, (address(this), verifierProxy, address(link), FEED_ID)
                    )
                )
            )
        );

        GoldMinter mImpl = new GoldMinter();
        minter = GoldMinter(
            address(
                new ERC1967Proxy(
                    address(mImpl),
                    abi.encodeCall(
                        GoldMinter.initializeGoldMinter,
                        (
                            address(gold),
                            address(usdt),
                            address(usdc),
                            address(verifier),
                            usdRecipient,
                            feeRecipient,
                            address(this),
                            true
                        )
                    )
                )
            )
        );

        verifier.setGoldMinter(address(minter));

        minter.grantRole(minter.PARAMETER_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), address(this));
        (twSigner, twSignerPk) = makeAddrAndKey("twSigner");
        (outsider, outsiderPk) = makeAddrAndKey("outsider");
        minter.grantRole(minter.KYC_MANAGER_ROLE(), twSigner);
        // `outsider` is intentionally NOT granted the role.

        // Loosen size guards for convenience (fee must stay below the minimums).
        minter.updateMinGoldFee(0);
        minter.updateMinMintAmount(1);
        minter.updateMinRedeemAmount(1);
        minter.setLevel(user, IGoldMinter.Levels.APPROVED);

        usdt.mint(usdRecipient, 1_000_000e6);
        vm.prank(usdRecipient);
        usdt.approve(address(minter), type(uint256).max);
    }

    // ----- helpers -----

    function _freshReport(int192 midPrice, uint32 marketStatus) internal returns (bytes memory unverified) {
        vm.warp(block.timestamp + 12);
        uint32 obs = uint32(block.timestamp);
        ReportV8 memory r = ReportV8({
            feedId: FEED_ID,
            validFromTimestamp: obs,
            observationsTimestamp: obs,
            nativeFee: 0,
            linkFee: 0,
            expiresAt: uint32(block.timestamp + 1 hours),
            lastUpdateTimestamp: uint64(obs),
            midPrice: midPrice,
            marketStatus: marketStatus
        });
        bytes memory verified = abi.encode(r);
        bytes32[3] memory ctx;
        unverified = abi.encode(ctx, verified);
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.s_feeManager.selector), abi.encode(address(0)));
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.verify.selector), abi.encode(verified));
    }

    function _domainSeparator() internal view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("GoldMinter")),
                keccak256(bytes("1")),
                block.chainid,
                address(minter)
            )
        );
    }

    /// @dev Sign an arbitrary window with an arbitrary key (covers valid AND invalid cases).
    function _sign(IGoldMinter.TradeWindow memory tw, uint256 pk) internal view returns (bytes memory sig) {
        bytes32 structHash =
            keccak256(abi.encode(minter.TRADE_WINDOW_TYPEHASH(), tw.user, tw.validAfter, tw.validBefore, tw.nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);
        sig = abi.encodePacked(r, s, v);
    }

    /// @dev A valid always-open window signed by the KYC_MANAGER, for `user_` at `nonce`.
    function _win(address user_, uint256 nonce)
        internal
        view
        returns (IGoldMinter.TradeWindow memory tw, bytes memory sig)
    {
        tw = IGoldMinter.TradeWindow(user_, 0, type(uint64).max, nonce);
        sig = _sign(tw, twSignerPk);
    }

    function _fund(address who, uint256 usdAmount) internal {
        usdt.mint(who, usdAmount);
        vm.prank(who);
        usdt.approve(address(minter), type(uint256).max);
    }

    function _net(uint256 usdAmount) internal view returns (uint256) {
        uint256 gross = minter.quoteGoldAmount(address(usdt), usdAmount, PRICE8);
        return gross - minter.calculateGoldFee(gross, true);
    }

    function _signKycMint(IGoldMinter.KYCMintRequest memory r, uint256 pk) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(
                minter.KYC_MINT_REQUEST_TYPEHASH(),
                r.user,
                r.kycLevel,
                r.nonce,
                r.deadline,
                r.usdToken,
                r.usdAmount,
                r.minGoldAmount
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 rr, bytes32 ss) = vm.sign(pk, digest);
        return abi.encodePacked(rr, ss, v);
    }

    // ========================================================================
    // Happy path: a valid in-hours window admits the request
    // ========================================================================

    function test_validWindow_admitsMint() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory tw, bytes memory sig) = _win(user, 0);

        uint256 net = _net(usdAmount);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, tw, sig);

        assertEq(gold.balanceOf(user), net, "valid window admitted the mint");
        assertTrue(minter.isTradeWindowNonceUsed(user, 0), "nonce consumed on success");
    }

    // ========================================================================
    // Time window: outside [validAfter, validBefore] rejected; boundaries inclusive
    // ========================================================================

    function test_revert_beforeValidAfter() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        // window opens 1h in the future
        IGoldMinter.TradeWindow memory tw =
            IGoldMinter.TradeWindow(user, uint64(block.timestamp + 1 hours), type(uint64).max, 0);
        bytes memory sig = _sign(tw, twSignerPk);

        vm.prank(user);
        vm.expectRevert(Errors.TradeWindowClosed.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, tw, sig);
    }

    function test_revert_afterValidBefore() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        // window closed 1s ago
        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(user, 0, uint64(block.timestamp - 1), 0);
        bytes memory sig = _sign(tw, twSignerPk);

        vm.prank(user);
        vm.expectRevert(Errors.TradeWindowClosed.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, tw, sig);
    }

    function test_boundary_validAfterEqualsNow_passes() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(user, uint64(block.timestamp), type(uint64).max, 0);
        bytes memory sig = _sign(tw, twSignerPk);

        uint256 net = _net(usdAmount);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, tw, sig);
        assertEq(gold.balanceOf(user), net, "now == validAfter is inclusive");
    }

    function test_boundary_validBeforeEqualsNow_passes() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(user, 0, uint64(block.timestamp), 0);
        bytes memory sig = _sign(tw, twSignerPk);

        uint256 net = _net(usdAmount);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, tw, sig);
        assertEq(gold.balanceOf(user), net, "now == validBefore is inclusive");
    }

    // ========================================================================
    // Signer authority: only a live KYC_MANAGER window is accepted
    // ========================================================================

    function test_revert_nonManagerSigner() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(user, 0, type(uint64).max, 0);
        bytes memory sig = _sign(tw, outsiderPk); // not a KYC_MANAGER

        vm.prank(user);
        vm.expectRevert(Errors.InvalidTradeWindowSigner.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, tw, sig);
    }

    function test_revert_revokedSigner() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        // twSigner had the role; revoke it -> its previously-valid windows now fail.
        minter.revokeRole(minter.KYC_MANAGER_ROLE(), twSigner);

        (IGoldMinter.TradeWindow memory tw, bytes memory sig) = _win(user, 0);
        vm.prank(user);
        vm.expectRevert(Errors.InvalidTradeWindowSigner.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, tw, sig);
    }

    // ========================================================================
    // Binding to msg.sender + non-empty signature
    // ========================================================================

    function test_revert_userMismatch() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        // window authorizes `outsider`, but `user` submits it (correctly signed for outsider).
        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(outsider, 0, type(uint64).max, 0);
        bytes memory sig = _sign(tw, twSignerPk);

        vm.prank(user);
        vm.expectRevert(Errors.InvalidSignature.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, tw, sig);
    }

    function test_revert_emptySignature() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(user, 0, type(uint64).max, 0);

        vm.prank(user);
        vm.expectRevert(Errors.ZeroSignature.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, tw, "");
    }

    // ========================================================================
    // Nonce: single-use, unordered (Permit2), per-user
    // ========================================================================

    function test_revert_nonceReuse() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount * 2);
        uint256 net = _net(usdAmount);

        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory tw, bytes memory sig) = _win(user, 0);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, tw, sig);

        // Re-submit the SAME window (nonce 0) -> rejected at the gate, even with a fresh report.
        bytes memory report2 = _freshReport(2000e18, 2);
        vm.prank(user);
        vm.expectRevert(Errors.TradeWindowNonceUsed.selector);
        minter.requestMint(address(usdt), usdAmount, net, report2, tw, sig);
    }

    function test_unorderedNonce_outOfOrderOk() public {
        uint256 usdAmount = 10_000e6;
        _fund(user, usdAmount * 2);
        uint256 net = _net(usdAmount);

        // Consume nonce 5 first...
        bytes memory report1 = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory tw5, bytes memory sig5) = _win(user, 5);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report1, tw5, sig5);

        // ...then a LOWER nonce 3 — an unordered bitmap allows out-of-order use.
        bytes memory report2 = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory tw3, bytes memory sig3) = _win(user, 3);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report2, tw3, sig3);

        assertTrue(minter.isTradeWindowNonceUsed(user, 5));
        assertTrue(minter.isTradeWindowNonceUsed(user, 3));
        assertFalse(minter.isTradeWindowNonceUsed(user, 4), "untouched nonce stays free");
    }

    function test_nonce_perUserIndependent() public {
        address userB = makeAddr("userB");
        minter.setLevel(userB, IGoldMinter.Levels.APPROVED);

        uint256 usdAmount = 10_000e6;
        _fund(user, usdAmount);
        _fund(userB, usdAmount);
        uint256 net = _net(usdAmount);

        // Both use nonce 0 — per-user bitmaps are independent, so both succeed.
        bytes memory reportA = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory twA, bytes memory sigA) = _win(user, 0);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, reportA, twA, sigA);

        bytes memory reportB = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory twB, bytes memory sigB) = _win(userB, 0);
        vm.prank(userB);
        minter.requestMint(address(usdt), usdAmount, net, reportB, twB, sigB);

        assertTrue(minter.isTradeWindowNonceUsed(user, 0));
        assertTrue(minter.isTradeWindowNonceUsed(userB, 0));
    }

    function test_view_nonceUnusedByDefault() public view {
        assertFalse(minter.isTradeWindowNonceUsed(user, 0));
        assertFalse(minter.isTradeWindowNonceUsed(user, 999));
    }

    // ========================================================================
    // Gate is enforced on every funnel: burn + the KYC wrapper
    // ========================================================================

    function test_gate_enforcedOnBurn() public {
        gold.mint(user, 1000e18);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        bytes memory report = _freshReport(2000e18, 2);

        // invalid (non-manager) window on the burn funnel -> rejected before any gold moves.
        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(user, 0, type(uint64).max, 0);
        bytes memory sig = _sign(tw, outsiderPk);

        vm.prank(user);
        vm.expectRevert(Errors.InvalidTradeWindowSigner.selector);
        minter.requestBurn(address(usdt), 500e18, 0, report, tw, sig);

        assertEq(gold.balanceOf(user), 1000e18, "gold untouched - gate rejected before custody");
    }

    function test_gate_enforcedOnKycWrapper() public {
        uint256 usdAmount = 100_000e6;
        _fund(user, usdAmount);
        bytes memory report = _freshReport(2000e18, 2);

        // A VALID KYC signature (so KYC passes and we actually REACH the gate)...
        IGoldMinter.KYCMintRequest memory kyc = IGoldMinter.KYCMintRequest({
            user: user,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: minter.kycNonces(user) + 1,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            usdAmount: usdAmount,
            minGoldAmount: 0
        });
        bytes memory kycSig = _signKycMint(kyc, twSignerPk);

        // ...paired with an INVALID trade window -> the gate still rejects (proving the KYC
        // wrapper funnels through the same gate, not just the bare requestMint).
        IGoldMinter.TradeWindow memory tw = IGoldMinter.TradeWindow(user, 0, type(uint64).max, 0);
        bytes memory twSig = _sign(tw, outsiderPk);

        vm.prank(user);
        vm.expectRevert(Errors.InvalidTradeWindowSigner.selector);
        minter.requestMintWithKYC(kyc, kycSig, "", report, tw, twSig);
    }
}
