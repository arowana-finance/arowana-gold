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
import { IERC20Exp } from "../contracts/interfaces/IERC20.sol";
import { SigLib } from "../contracts/libraries/SigLib.sol";

/// @dev Minimal gold token (no permit, no blacklist) used to exercise GoldMinter.
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

/// @dev Broad coverage of GoldMinter admin setters, KYC/permit flows, manual
///      settlement, tradeUnit mode, validation reverts and view getters.
contract GoldMinterAdminTest is Test {
    GoldMinter minter;
    GoldStreamVerifier verifier;
    MockGoldToken gold;
    ERC20Mock usdt;
    ERC20Mock usdc;
    ERC20Mock link;

    address verifierProxy = makeAddr("verifierProxy");
    address usdRecipient = makeAddr("usdRecipient");
    address feeRecipient = makeAddr("feeRecipient");

    address user;
    uint256 userPk;
    address kycUser;
    uint256 kycUserPk;
    address kycManager;
    uint256 kycManagerPk;
    address attacker = makeAddr("attacker");

    bytes32 constant FEED_ID = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;
    uint256 constant PRICE8 = 2000e8;

    function setUp() public {
        vm.warp(1_000_000);
        (user, userPk) = makeAddrAndKey("user");
        (kycUser, kycUserPk) = makeAddrAndKey("kycUser");
        (kycManager, kycManagerPk) = makeAddrAndKey("kycManager");

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
        minter.grantRole(minter.INFRA_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.SETTLER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), kycManager);

        minter.updateMinGoldFee(0);
        minter.updateMinMintAmount(1);
        minter.updateMinRedeemAmount(1);
        minter.setLevel(user, IGoldMinter.Levels.APPROVED);

        usdt.mint(usdRecipient, 10_000_000e6);
        vm.prank(usdRecipient);
        usdt.approve(address(minter), type(uint256).max);
    }

    // ============ helpers ============

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

    function _fundAndApproveUsdt(address who, uint256 amount) internal {
        usdt.mint(who, amount);
        vm.prank(who);
        usdt.approve(address(minter), type(uint256).max);
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

    uint256 internal _twNonce;

    /// @dev Mints a valid business-hours trade window signed by a KYC manager, so every
    ///      request entry point passes the leading trade-window gate and reaches its
    ///      intended logic (or downstream revert). Mirrors the KYC EIP-712 signing above.
    function _mintTW(address user_) internal returns (IGoldMinter.TradeWindow memory tw, bytes memory sig) {
        tw = IGoldMinter.TradeWindow({ user: user_, validAfter: 0, validBefore: type(uint64).max, nonce: _twNonce++ });
        bytes32 structHash =
            keccak256(abi.encode(minter.TRADE_WINDOW_TYPEHASH(), tw.user, tw.validAfter, tw.validBefore, tw.nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(kycManagerPk, digest);
        sig = abi.encodePacked(r, s, v);
    }

    function _signKycBurn(IGoldMinter.KYCBurnRequest memory r, uint256 pk) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(
                minter.KYC_BURN_REQUEST_TYPEHASH(),
                r.user,
                r.kycLevel,
                r.nonce,
                r.deadline,
                r.usdToken,
                r.goldAmount,
                r.minUsdAmount
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 rr, bytes32 ss) = vm.sign(pk, digest);
        return abi.encodePacked(rr, ss, v);
    }

    function _usdPermitSig(uint256 ownerPk, address ownerAddr, uint256 value, uint256 deadline)
        internal
        view
        returns (bytes memory)
    {
        bytes32 structHash = keccak256(
            abi.encode(
                keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
                ownerAddr,
                address(minter),
                value,
                usdt.nonces(ownerAddr),
                deadline
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", usdt.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPk, digest);
        return abi.encodePacked(r, s, v);
    }

    // ============ admin setters ============

    function test_setters_happy() public {
        minter.updateSlippage(300);
        assertEq(minter.slippage(), 300);
        minter.updateMintSpread(200);
        assertEq(minter.mintSpread(), 200);
        minter.updateRedeemSpread(100);
        assertEq(minter.redeemSpread(), 100);
        minter.updateMintFee(50);
        assertEq(minter.mintFee(), 50);
        minter.updateRedeemFee(40);
        assertEq(minter.redeemFee(), 40);
        minter.updateMinMintAmount(5 ether);
        assertEq(minter.minMintAmount(), 5 ether);
        minter.updateMinRedeemAmount(6 ether);
        assertEq(minter.minRedeemAmount(), 6 ether);
        minter.updateMinGoldFeeAmount(2 ether);
        assertEq(minter.minGoldFeeAmount(), 2 ether);
        minter.updateMinGoldFee(1 ether);
        assertEq(minter.minGoldFee(), 1 ether);
        minter.updateTradingLevel(IGoldMinter.Levels.APPROVED);
        assertEq(uint8(minter.tradeLevel()), uint8(IGoldMinter.Levels.APPROVED));
        minter.updateTradeUnit(1000 ether);
        assertEq(minter.tradeUnit(), 1000 ether);
        minter.updateRecipient(address(0xCAFE));
        minter.updateFeeRecipient(address(0xF00D));
        assertEq(minter.feeRecipient(), address(0xF00D));
    }

    function test_revert_setters_bounds() public {
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateSlippage(501);
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateMintSpread(301);
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateRedeemSpread(301);
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateMintFee(101);
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateRedeemFee(101);
    }

    function test_revert_setters_zeroAddress() public {
        vm.expectRevert(Errors.ZeroUSDRecipient.selector);
        minter.updateRecipient(address(0));
        vm.expectRevert(Errors.ZeroRecipient.selector);
        minter.updateFeeRecipient(address(0));
        vm.expectRevert(Errors.ZeroVerifier.selector);
        minter.updateGoldStreamVerifier(address(0));
    }

    function test_revert_setters_onlyRole() public {
        vm.startPrank(attacker);
        vm.expectRevert();
        minter.updateSlippage(100);
        vm.expectRevert();
        minter.updateGoldStreamVerifier(address(0xABCD));
        vm.expectRevert();
        minter.setLevel(user, IGoldMinter.Levels.APPROVED);
        vm.stopPrank();
    }

    function test_updateMinGoldFee_revert_feeExceedsMinimum() public {
        // minMintAmount is 1 (from setUp) -> any fee >= 1 reverts
        vm.expectRevert(Errors.FeeExceedsMinimum.selector);
        minter.updateMinGoldFee(1);
    }

    function test_updateGoldStreamVerifier() public {
        minter.updateGoldStreamVerifier(address(verifier));
        // setGoldStreamVerifierOnce now reverts (already set)
        vm.expectRevert(Errors.VerifierAlreadySet.selector);
        minter.setGoldStreamVerifierOnce(address(verifier));
    }

    function test_setAMLBlacklist() public {
        minter.setAMLBlacklist(user, true);
        assertTrue(minter.isAMLBlacklisted(user));
        minter.setAMLBlacklist(user, false);
        assertFalse(minter.isAMLBlacklisted(user));
    }

    // ============ pause ============

    function test_pause_blocksRequest() public {
        minter.emergencyPause();
        _fundAndApproveUsdt(user, 100_000e6);
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);

        uint256 gross = minter.quoteGoldAmount(address(usdt), 100_000e6, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        vm.prank(user);
        vm.expectRevert(); // EnforcedPause (whenNotPaused fires before body)
        minter.requestMint(address(usdt), 100_000e6, net, report, _tw, _twSig);
        minter.emergencyUnpause();
        // now works
        vm.prank(user);
        minter.requestMint(address(usdt), 100_000e6, net, report, _tw, _twSig);
    }

    function test_revert_pause_onlyAdmin() public {
        vm.prank(attacker);
        vm.expectRevert();
        minter.emergencyPause();
    }

    // ============ request validation reverts ============

    function test_revert_requestMint_underlevel() public {
        _fundAndApproveUsdt(attacker, 100e6);
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(attacker);
        vm.prank(attacker); // attacker has level 0 < KYCD
        vm.expectRevert(Errors.Underlevel.selector);
        minter.requestMint(address(usdt), 100e6, 0, report, _tw, _twSig);
    }

    function test_revert_requestMint_amlBlocked() public {
        minter.setAMLBlacklist(user, true);
        _fundAndApproveUsdt(user, 100e6);
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.requestMint(address(usdt), 100e6, 0, report, _tw, _twSig);
    }

    function test_revert_requestMint_invalidUsdToken() public {
        // hit _getUSDToken via the permit path (before the mint math)
        bytes memory report = _freshReport(2000e18, 2);
        bytes memory dummySig = abi.encodePacked(bytes32(uint256(1)), bytes32(uint256(2)), uint8(27));
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InvalidUSDToken.selector);
        minter.requestMintPermit(address(link), 100e6, 0, block.timestamp + 1 hours, dummySig, report, _tw, _twSig);
    }

    function test_revert_requestMint_smallAmount() public {
        minter.updateMinMintAmount(1000 ether); // raise min
        _fundAndApproveUsdt(user, 1e6); // $1 -> tiny gold < min
        bytes memory report = _freshReport(2000e18, 2);
        uint256 gross = minter.quoteGoldAmount(address(usdt), 1e6, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.SmallAmount.selector);
        minter.requestMint(address(usdt), 1e6, net, report, _tw, _twSig);
    }

    // LOW D regression: when a request's amount is below the flat gold fee, the
    // pre-fix code subtracted the fee BEFORE the minimum-amount check, underflowing
    // with an opaque Panic(0x11). The fix validates size first, so the explicit
    // SmallAmount error surfaces instead.
    function test_requestMint_subFee_revertsSmallAmount_notPanic() public {
        // Raise minimums first (invariant: minGoldFee < minMint/minRedeem), then
        // set a flat gold fee large enough that a $1 request's gross gold < fee.
        minter.updateMinMintAmount(1000 ether);
        minter.updateMinRedeemAmount(1000 ether);
        minter.updateMinGoldFee(100 ether);
        _fundAndApproveUsdt(user, 1e6); // $1 -> gross gold << 100 ether flat fee
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.SmallAmount.selector); // not Panic(0x11)
        minter.requestMint(address(usdt), 1e6, 0, report, _tw, _twSig);
    }

    function test_requestBurn_subFee_revertsSmallAmount_notPanic() public {
        minter.updateMinMintAmount(1000 ether);
        minter.updateMinRedeemAmount(1000 ether);
        minter.updateMinGoldFee(100 ether);
        gold.mint(user, 50 ether); // 50 gram < 100 ether flat fee
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.SmallAmount.selector); // not Panic(0x11)
        minter.requestBurn(address(usdt), 50 ether, 0, _freshReport(2000e18, 2), _tw, _twSig);
    }

    function test_revert_requestMint_underpriced_slippage() public {
        _fundAndApproveUsdt(user, 100e6);
        bytes memory report = _freshReport(2000e18, 2);
        // demand far more gold than possible
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.Underpriced.selector);
        minter.requestMint(address(usdt), 100e6, 1_000_000 ether, report, _tw, _twSig);
    }

    // ============ HIGH: blocked-order resolution ============

    function _pendingBurn() internal returns (uint256 nonce) {
        minter.updateAutoSettle(); // off so the order stays pending
        gold.mint(user, 1000 ether);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        uint256 net = 500 ether - minter.calculateGoldFee(500 ether, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), 500 ether, expectedUsd, report, _tw, _twSig);
        return 0;
    }

    function _pendingMint() internal returns (uint256 nonce) {
        minter.updateAutoSettle(); // off
        _fundAndApproveUsdt(user, 600e6);
        bytes memory report = _freshReport(2000e18, 2);
        uint256 gross = minter.quoteGoldAmount(address(usdt), 600e6, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), 600e6, net, report, _tw, _twSig);
        return 0;
    }

    function test_resolveBlockedBurn_sanctioned_seizesToCompliance() public {
        _pendingBurn();
        assertEq(gold.balanceOf(address(minter)), 500 ether, "gold custodied at request");

        minter.setAMLBlacklist(user, true); // sanction the seller
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.settleBurn(0); // settle path now traps the gold

        address compliance = makeAddr("compliance");
        minter.resolveBlockedBurn(0, compliance);
        assertEq(gold.balanceOf(compliance), 500 ether, "gold seized to compliance wallet");
        assertEq(gold.balanceOf(address(minter)), 0);

        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.resolveBlockedBurn(0, compliance);
    }

    function test_resolveBlockedBurn_underLevel_returnsToSeller() public {
        _pendingBurn();
        minter.setLevel(user, IGoldMinter.Levels.DEFAULT); // under tradeLevel, NOT sanctioned
        vm.expectRevert(Errors.Underlevel.selector);
        minter.settleBurn(0);

        uint256 before = gold.balanceOf(user);
        minter.resolveBlockedBurn(0, user); // return to seller allowed
        assertEq(gold.balanceOf(user), before + 500 ether, "gold returned to seller");
        assertEq(minter.getUserPendingBurnCount(user), 0, "pending count cleared");
    }

    function test_revert_resolveBlockedBurn_notBlocked() public {
        _pendingBurn();
        vm.expectRevert(Errors.NotBlocked.selector);
        minter.resolveBlockedBurn(0, user); // healthy order cannot be resolved
    }

    function test_revert_resolveBlockedBurn_toSanctionedSeller() public {
        _pendingBurn();
        minter.setAMLBlacklist(user, true);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.resolveBlockedBurn(0, user); // cannot return gold to a sanctioned seller
    }

    // A1: a merely under-level (non-sanctioned) seller's gold can ONLY be returned to
    // them — settler cannot seize it to a third party. Seizure requires AML-blacklisting.
    function test_revert_resolveBlockedBurn_underLevel_cannotSeizeElsewhere() public {
        _pendingBurn();
        minter.setLevel(user, IGoldMinter.Levels.DEFAULT); // under-level, NOT sanctioned
        address compliance = makeAddr("compliance");
        vm.expectRevert(Errors.MustReturnToOwner.selector);
        minter.resolveBlockedBurn(0, compliance); // to != seller on a non-sanctioned seller
    }

    function test_revert_resolveBlockedBurn_onlySettler() public {
        vm.prank(attacker);
        vm.expectRevert();
        minter.resolveBlockedBurn(0, attacker);
    }

    function test_resolveBlockedMint_underLevel_refundsBuyer() public {
        _pendingMint();
        assertEq(usdt.balanceOf(user), 0, "USD escrowed in contract at request");
        assertEq(usdt.balanceOf(address(minter)), 600e6, "USD held in escrow");
        uint256 recipBefore = usdt.balanceOf(usdRecipient);

        minter.setLevel(user, IGoldMinter.Levels.DEFAULT); // under-level, not sanctioned
        vm.expectRevert(Errors.Underlevel.selector);
        minter.settleMint(0);

        minter.resolveBlockedMint(0); // under-level -> refund (enforced)
        assertEq(usdt.balanceOf(user), 600e6, "USD refunded to buyer from escrow");
        assertEq(usdt.balanceOf(usdRecipient), recipBefore, "treasury untouched: refund from escrow");
        assertEq(minter.getUserPendingMintCount(user), 0, "pending count cleared");
    }

    function test_resolveBlockedMint_sanctioned_retainsAtTreasury() public {
        _pendingMint();
        uint256 recipBefore = usdt.balanceOf(usdRecipient);

        minter.setAMLBlacklist(user, true);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.settleMint(0);

        minter.resolveBlockedMint(0); // sanctioned -> retain (enforced)
        assertEq(usdt.balanceOf(usdRecipient), recipBefore + 600e6, "USD retained: escrow forwarded to treasury");
        assertEq(usdt.balanceOf(user), 0, "sanctioned buyer gets nothing");

        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.resolveBlockedMint(0);
    }

    function test_revert_resolveBlockedMint_notBlocked() public {
        _pendingMint();
        vm.expectRevert(Errors.NotBlocked.selector);
        minter.resolveBlockedMint(0);
    }

    /// @dev Security review #3 regression: a blocked mint must be refundable even if
    ///      the treasury has revoked its GoldMinter approval. Pre-fix the refund
    ///      pulled from usdRecipient (safeTransferFrom) and would revert, trapping
    ///      the funds. Post-fix the USD is escrowed in the contract and refunded
    ///      from that balance, independent of any usdRecipient approval.
    function test_resolveBlockedMint_refundsDespiteRevokedTreasuryApproval() public {
        _pendingMint(); // autoSettle off -> USD escrowed in the contract
        // Treasury revokes its approval entirely.
        vm.prank(usdRecipient);
        usdt.approve(address(minter), 0);

        minter.setLevel(user, IGoldMinter.Levels.DEFAULT); // under-level -> refund
        minter.resolveBlockedMint(0);

        assertEq(usdt.balanceOf(user), 600e6, "refunded from escrow despite zero treasury approval");
        assertEq(minter.getUserPendingMintCount(user), 0, "pending count cleared");
    }

    // ============ tradeUnit mode ============

    function test_tradeUnit_mint() public {
        minter.updateTradeUnit(1000 ether); // 1kg unit
        _fundAndApproveUsdt(user, 100_000_000e6);
        bytes memory report = _freshReport(2000e18, 2);
        uint256 unit = 1000 ether;
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), 100_000_000e6, unit, report, _tw, _twSig);
        // gross gold == unit, net minted = unit - fee
        uint256 fee = minter.calculateGoldFee(unit, true);
        assertEq(gold.balanceOf(user), unit - fee);
    }

    function test_revert_tradeUnit_notMultiple() public {
        minter.updateTradeUnit(1000 ether);
        _fundAndApproveUsdt(user, 100_000_000e6);
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.NotTradeUnitMultiple.selector);
        minter.requestMint(address(usdt), 100_000_000e6, 1500 ether, report, _tw, _twSig);
    }

    function test_revert_tradeUnit_insufficientUsd() public {
        minter.updateTradeUnit(1000 ether);
        _fundAndApproveUsdt(user, 100e6); // way too little for 1kg
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InsufficientUsdAmount.selector);
        minter.requestMint(address(usdt), 100e6, 1000 ether, report, _tw, _twSig);
    }

    // ============ manual settle ============

    function test_manualSettleMint() public {
        minter.updateAutoSettle(); // off
        _fundAndApproveUsdt(user, 100_000e6);
        uint256 gross = minter.quoteGoldAmount(address(usdt), 100_000e6, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw1, bytes memory _twSig1) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), 100_000e6, net, _freshReport(2000e18, 2), _tw1, _twSig1);
        assertEq(gold.balanceOf(user), 0, "not settled yet");
        assertEq(minter.getUserPendingMintCount(user), 1);

        minter.settleMint(0);
        assertEq(gold.balanceOf(user), net, "settled");
        assertEq(minter.getUserPendingMintCount(user), 0);

        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.settleMint(0);
    }

    function test_revert_settleMint_invalidNonce() public {
        vm.expectRevert(Errors.InvalidNonce.selector);
        minter.settleMint(999);
    }

    function test_revert_settle_onlySettler() public {
        vm.prank(attacker);
        vm.expectRevert();
        minter.settleMint(0);
    }

    function test_manualSettleBurn() public {
        minter.updateAutoSettle(); // off
        gold.mint(user, 1000 ether);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        uint256 net = 500 ether - minter.calculateGoldFee(500 ether, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);
        (IGoldMinter.TradeWindow memory _tw2, bytes memory _twSig2) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), 500 ether, expectedUsd, _freshReport(2000e18, 2), _tw2, _twSig2);
        assertEq(usdt.balanceOf(user), 0, "not settled yet");

        minter.settleBurn(0);
        assertEq(usdt.balanceOf(user), expectedUsd, "paid out");
    }

    function test_settleBurn_failurePath_returnsGold() public {
        minter.updateAutoSettle(); // off
        gold.mint(user, 1000 ether);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        uint256 net = 500 ether - minter.calculateGoldFee(500 ether, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);
        (IGoldMinter.TradeWindow memory _tw3, bytes memory _twSig3) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), 500 ether, expectedUsd, _freshReport(2000e18, 2), _tw3, _twSig3);

        // drain usdRecipient allowance so canBurn() == false -> failure path
        vm.prank(usdRecipient);
        usdt.approve(address(minter), 0);

        minter.settleBurn(0);
        // gold returned to seller, no usd paid
        assertEq(gold.balanceOf(user), 1000 ether, "gold returned");
        assertEq(usdt.balanceOf(user), 0);
    }

    // ============ KYC flows ============

    function test_requestMintWithKYC() public {
        _fundAndApproveUsdt(kycUser, 100_000e6);
        uint256 gross = minter.quoteGoldAmount(address(usdt), 100_000e6, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);

        IGoldMinter.KYCMintRequest memory req = IGoldMinter.KYCMintRequest({
            user: kycUser,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 1,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            usdAmount: 100_000e6,
            minGoldAmount: net
        });
        bytes memory sig = _signKycMint(req, kycManagerPk);
        bytes memory report = _freshReport(2000e18, 2);

        (IGoldMinter.TradeWindow memory _tw4, bytes memory _twSig4) = _mintTW(kycUser);
        vm.prank(kycUser);
        minter.requestMintWithKYC(req, sig, "", report, _tw4, _twSig4);

        assertEq(gold.balanceOf(kycUser), net);
        assertEq(minter.levels(kycUser), uint8(IGoldMinter.Levels.APPROVED));
        assertEq(minter.kycNonces(kycUser), 1);
    }

    function test_revert_requestMintWithKYC_badSigner() public {
        _fundAndApproveUsdt(kycUser, 100_000e6);
        IGoldMinter.KYCMintRequest memory req = IGoldMinter.KYCMintRequest({
            user: kycUser,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 1,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            usdAmount: 100_000e6,
            minGoldAmount: 0
        });
        bytes memory sig = _signKycMint(req, kycUserPk); // not a KYC manager
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw5, bytes memory _twSig5) = _mintTW(kycUser);
        vm.prank(kycUser);
        vm.expectRevert(Errors.InvalidSignature.selector);
        minter.requestMintWithKYC(req, sig, "", report, _tw5, _twSig5);
    }

    function test_revert_requestMintWithKYC_wrongUser() public {
        IGoldMinter.KYCMintRequest memory req;
        req.user = kycUser;
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw6, bytes memory _twSig6) = _mintTW(attacker);
        vm.prank(attacker); // msg.sender != req.user
        vm.expectRevert(Errors.InvalidSignature.selector);
        minter.requestMintWithKYC(req, "deadbeef", "", report, _tw6, _twSig6);
    }

    function test_revert_requestMintWithKYC_zeroSignature() public {
        IGoldMinter.KYCMintRequest memory req;
        req.user = kycUser;
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw7, bytes memory _twSig7) = _mintTW(kycUser);
        vm.prank(kycUser);
        vm.expectRevert(Errors.ZeroSignature.selector);
        minter.requestMintWithKYC(req, "", "", report, _tw7, _twSig7);
    }

    function test_requestBurnWithKYC() public {
        gold.mint(kycUser, 1000 ether);
        vm.prank(kycUser);
        gold.approve(address(minter), type(uint256).max);
        uint256 net = 500 ether - minter.calculateGoldFee(500 ether, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);

        IGoldMinter.KYCBurnRequest memory req = IGoldMinter.KYCBurnRequest({
            user: kycUser,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 1,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            goldAmount: 500 ether,
            minUsdAmount: expectedUsd
        });
        bytes memory sig = _signKycBurn(req, kycManagerPk);
        bytes memory report = _freshReport(2000e18, 2);

        (IGoldMinter.TradeWindow memory _tw8, bytes memory _twSig8) = _mintTW(kycUser);
        vm.prank(kycUser);
        minter.requestBurnWithKYC(req, sig, "", report, _tw8, _twSig8);
        assertEq(usdt.balanceOf(kycUser), expectedUsd);
    }

    // ============ permit flows ============

    function test_requestMintPermit() public {
        usdt.mint(user, 100_000e6); // no pre-approval; permit grants it
        uint256 deadline = block.timestamp + 1 hours;
        bytes memory permitSig = _usdPermitSig(userPk, user, 100_000e6, deadline);
        bytes memory report = _freshReport(2000e18, 2);

        uint256 gross = minter.quoteGoldAmount(address(usdt), 100_000e6, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);

        (IGoldMinter.TradeWindow memory _tw9, bytes memory _twSig9) = _mintTW(user);
        vm.prank(user);
        minter.requestMintPermit(address(usdt), 100_000e6, net, deadline, permitSig, report, _tw9, _twSig9);
        assertEq(gold.balanceOf(user), net);
    }

    function test_requestBurnPermit_goldPermitCatchFallback() public {
        // MockGoldToken has no permit(): the try/catch swallows and the allowance
        // fallback path is exercised. Pre-approve gold so the request proceeds.
        gold.mint(user, 1000 ether);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        uint256 net = 500 ether - minter.calculateGoldFee(500 ether, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);
        bytes memory dummySig = abi.encodePacked(bytes32(uint256(1)), bytes32(uint256(2)), uint8(27));
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw10, bytes memory _twSig10) = _mintTW(user);
        vm.prank(user);
        minter.requestBurnPermit(
            address(usdt), 500 ether, expectedUsd, block.timestamp + 1 hours, dummySig, report, _tw10, _twSig10
        );
        assertEq(usdt.balanceOf(user), expectedUsd);
    }

    function test_revert_permit_invalidSigLength() public {
        // non-65-byte (and non-empty) permit signature -> SigLib.toVRS reverts
        usdt.mint(user, 100e6);
        bytes memory badLen = hex"1234";
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw11, bytes memory _twSig11) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(SigLib.InvalidSignatureLength.selector);
        minter.requestMintPermit(address(usdt), 100e6, 0, block.timestamp + 1 hours, badLen, report, _tw11, _twSig11);
    }

    function test_revert_permit_insufficientAllowance() public {
        // permit signature that does not establish enough allowance and no pre-approval
        usdt.mint(user, 100_000e6);
        uint256 deadline = block.timestamp + 1 hours;
        bytes memory badSig = abi.encodePacked(bytes32(uint256(1)), bytes32(uint256(2)), uint8(27));
        bytes memory report = _freshReport(2000e18, 2);
        (IGoldMinter.TradeWindow memory _tw12, bytes memory _twSig12) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InsufficientAllowance.selector);
        minter.requestMintPermit(address(usdt), 100_000e6, 0, deadline, badSig, report, _tw12, _twSig12);
    }

    // ============ views ============

    function test_views() public {
        _fundAndApproveUsdt(user, 100_000e6);
        minter.updateAutoSettle(); // off so it stays pending/recorded
        uint256 gross = minter.quoteGoldAmount(address(usdt), 100_000e6, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw13, bytes memory _twSig13) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), 100_000e6, net, _freshReport(2000e18, 2), _tw13, _twSig13);

        assertEq(minter.getUserMintCount(user), 1);
        uint256[] memory nonces = minter.getUserMintNonces(user, 0, 10);
        assertEq(nonces.length, 1);
        assertEq(nonces[0], 0);
        assertEq(minter.getUserMintNonces(user, 5, 10).length, 0); // offset >= total

        IGoldMinter.MintOrder[] memory orders = minter.getMintOrdersByNonces(nonces);
        assertEq(orders[0].buyer, user);

        assertEq(minter.goldToken(), address(gold));
        assertEq(minter.USDT(), address(usdt));
        assertEq(minter.USDC(), address(usdc));
        assertEq(minter.levels(user), uint8(IGoldMinter.Levels.APPROVED));
        assertTrue(minter.canBurn(IERC20Exp(address(usdt)), 1e6));
    }

    function test_views_burnSide() public {
        minter.updateAutoSettle(); // off
        gold.mint(user, 1000 ether);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        uint256 net = 500 ether - minter.calculateGoldFee(500 ether, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);
        (IGoldMinter.TradeWindow memory _tw14, bytes memory _twSig14) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), 500 ether, expectedUsd, _freshReport(2000e18, 2), _tw14, _twSig14);

        assertEq(minter.getUserBurnCount(user), 1);
        uint256[] memory bn = minter.getUserBurnNonces(user, 0, 10);
        assertEq(bn.length, 1);
        IGoldMinter.BurnOrder[] memory bo = minter.getBurnOrdersByNonces(bn);
        assertEq(bo[0].seller, user);
        assertEq(minter.getUserBurnNonces(user, 9, 10).length, 0);
    }
}
