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

/// @dev Minimal gold token: open mint, burn from holder, no blacklist oracle.
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

contract GoldMinterStreamsTest is Test {
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

    // KYC_MANAGER signer with a known private key, used to sign business-hours trade windows.
    address twSigner;
    uint256 twSignerPk;
    uint256 internal _twNonce;

    // real XAU/USD v8 feedId (prefix 0x0008 => schema v8)
    bytes32 constant FEED_ID = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;
    uint256 constant PRICE8 = 2000e8; // $2000/oz

    function setUp() public {
        vm.warp(1_000_000);

        gold = new MockGoldToken();
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);
        link = new ERC20Mock("Chainlink", "LINK", 18, 0);

        // Verifier behind proxy
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

        // Minter behind proxy
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

        // roles
        minter.grantRole(minter.PARAMETER_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), address(this));
        (twSigner, twSignerPk) = makeAddrAndKey("twSigner");
        minter.grantRole(minter.KYC_MANAGER_ROLE(), twSigner);
        // minGoldFee must stay below the min amounts (FeeExceedsMinimum guard),
        // so drop it to 0 before lowering the minimums for test convenience.
        minter.updateMinGoldFee(0);
        minter.updateMinMintAmount(1);
        minter.updateMinRedeemAmount(1);
        minter.setLevel(user, IGoldMinter.Levels.APPROVED);

        // usdRecipient funds payouts
        usdt.mint(usdRecipient, 1_000_000e6);
        vm.prank(usdRecipient);
        usdt.approve(address(minter), type(uint256).max);
    }

    // ---- report helpers ----

    function _freshReport(int192 midPrice, uint32 marketStatus) internal returns (bytes memory unverified) {
        // Advance the clock a few seconds each call so observationsTimestamp is
        // current (within maxReportAge), not in the future, and strictly increasing.
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

    // ---- trade-window helpers ----

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

    /// @dev Mint a valid, single-use business-hours window signed by the KYC_MANAGER (twSigner).
    ///      validAfter=0 / validBefore=max so the gate's time check always passes; the gate only
    ///      accepts a window whose recovered EIP-712 signer holds KYC_MANAGER_ROLE. Every entry-point
    ///      call — success or expectRevert — must pass one, since the gate runs first.
    function _mintTW(address user_) internal returns (IGoldMinter.TradeWindow memory tw, bytes memory sig) {
        tw = IGoldMinter.TradeWindow({ user: user_, validAfter: 0, validBefore: type(uint64).max, nonce: _twNonce++ });
        bytes32 structHash =
            keccak256(abi.encode(minter.TRADE_WINDOW_TYPEHASH(), tw.user, tw.validAfter, tw.validBefore, tw.nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(twSignerPk, digest);
        sig = abi.encodePacked(r, s, v);
    }

    // ---- mint ----

    function test_mint_locksPriceFromReport_andAutoSettles() public {
        uint256 usdAmount = 100_000e6;
        usdt.mint(user, usdAmount);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);

        // derive expected at the same locked price
        uint256 grossGold = minter.quoteGoldAmount(address(usdt), usdAmount, PRICE8);
        uint256 fee = minter.calculateGoldFee(grossGold, true);
        uint256 net = grossGold - fee;

        uint256 recipBefore = usdt.balanceOf(usdRecipient);
        bytes memory report = _freshReport(2000e18, 2); // 2000e18 / 1e10 = 2000e8

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, _tw, _twSig);

        assertEq(gold.balanceOf(user), net, "buyer receives net gold");
        assertEq(gold.balanceOf(feeRecipient), fee, "fee minted to feeRecipient");
        assertEq(usdt.balanceOf(usdRecipient) - recipBefore, usdAmount, "usd routed to recipient");
        assertEq(usdt.balanceOf(user), 0);
    }

    function test_mint_revert_priceOutOfRange_belowMin() public {
        uint256 usdAmount = 100_000e6;
        usdt.mint(user, usdAmount);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);

        // 100e18 -> price8 = 100e8 < minGoldPrice(500e8)
        bytes memory report = _freshReport(100e18, 2);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.PriceOutOfRange.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, _tw, _twSig);
    }

    function test_mint_revert_marketClosed_bubblesFromVerifier() public {
        uint256 usdAmount = 100_000e6;
        usdt.mint(user, usdAmount);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);

        bytes memory report = _freshReport(2000e18, 1); // Closed

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.MarketClosed.selector);
        minter.requestMint(address(usdt), usdAmount, 0, report, _tw, _twSig);
    }

    // ---- burn ----

    function test_burn_locksPriceFromReport_andAutoSettles() public {
        uint256 startGold = 1000e18;
        gold.mint(user, startGold);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);

        uint256 goldAmount = 500e18;
        uint256 fee = minter.calculateGoldFee(goldAmount, false);
        uint256 net = goldAmount - fee;
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);

        bytes memory report = _freshReport(2000e18, 2);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), goldAmount, expectedUsd, report, _tw, _twSig);

        assertEq(gold.balanceOf(user), startGold - goldAmount, "gold pulled from seller");
        assertEq(gold.balanceOf(feeRecipient), fee, "gold fee to feeRecipient");
        assertEq(usdt.balanceOf(user), expectedUsd, "seller paid usd");
    }

    // ---- fresh report re-use across requests ----

    // No global replay watermark: re-using a still-fresh report across two
    // requests is allowed and harmless — each request deposits its own USD and
    // pays its own fee, and the price is fresh. (Staleness is bounded by
    // maxReportAge; a too-old report is rejected by ReportTooOld instead.)
    function test_freshReport_reusableAcrossRequests() public {
        uint256 usdAmount = 50_000e6;
        usdt.mint(user, usdAmount * 2);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);

        // build a single fresh report and reuse it (obs = now)
        uint32 obs = uint32(block.timestamp);
        ReportV8 memory r =
            ReportV8(FEED_ID, obs, obs, 0, 0, uint32(block.timestamp + 1 hours), uint64(obs), 2000e18, 2);
        bytes memory verified = abi.encode(r);
        bytes32[3] memory ctx;
        bytes memory report = abi.encode(ctx, verified);
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.s_feeManager.selector), abi.encode(address(0)));
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.verify.selector), abi.encode(verified));

        uint256 gross = minter.quoteGoldAmount(address(usdt), usdAmount, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);

        (IGoldMinter.TradeWindow memory _tw1, bytes memory _twSig1) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, _tw1, _twSig1);

        // same fresh report again -> succeeds (no watermark), buyer gets 2x net
        (IGoldMinter.TradeWindow memory _tw2, bytes memory _twSig2) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, _tw2, _twSig2);

        assertEq(gold.balanceOf(user), net * 2, "both fresh-report mints settled");
    }

    // ---- pendingCount accounting across autoSettle toggle ----

    /// @dev Regression: an autoSettle request must not corrupt the pending count
    ///      of earlier manual-mode orders. Pre-fix, autoSettle decremented the
    ///      count without a matching increment, under-reporting real pending work.
    function test_pendingMintCount_consistentAcrossAutoSettleToggle() public {
        uint256 usdAmount = 100_000e6;
        usdt.mint(user, 3 * usdAmount);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);

        uint256 gross = minter.quoteGoldAmount(address(usdt), usdAmount, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);

        // autoSettle defaults true -> turn OFF (manual settlement mode)
        minter.updateAutoSettle();

        // Two manual-mode requests queue up as pending.
        (IGoldMinter.TradeWindow memory _tw1, bytes memory _twSig1) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, _freshReport(2000e18, 2), _tw1, _twSig1);
        (IGoldMinter.TradeWindow memory _tw2, bytes memory _twSig2) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, _freshReport(2000e18, 2), _tw2, _twSig2);
        assertEq(minter.getUserPendingMintCount(user), 2, "two pending in manual mode");

        // Turn autoSettle back ON, then request a third order that auto-settles.
        minter.updateAutoSettle();
        (IGoldMinter.TradeWindow memory _tw3, bytes memory _twSig3) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, _freshReport(2000e18, 2), _tw3, _twSig3);

        // The auto-settled order nets to zero (count++ then settle count--);
        // the two still-unsettled manual orders must remain counted.
        assertEq(minter.getUserPendingMintCount(user), 2, "autoSettle order must not corrupt pending count");
    }

    /// @dev Same invariant on the burn side.
    function test_pendingBurnCount_consistentAcrossAutoSettleToggle() public {
        uint256 startGold = 3000e18;
        gold.mint(user, startGold);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);

        uint256 goldAmount = 500e18;
        uint256 net = goldAmount - minter.calculateGoldFee(goldAmount, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);

        // autoSettle defaults true -> turn OFF
        minter.updateAutoSettle();

        (IGoldMinter.TradeWindow memory _tw1, bytes memory _twSig1) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), goldAmount, expectedUsd, _freshReport(2000e18, 2), _tw1, _twSig1);
        (IGoldMinter.TradeWindow memory _tw2, bytes memory _twSig2) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), goldAmount, expectedUsd, _freshReport(2000e18, 2), _tw2, _twSig2);
        assertEq(minter.getUserPendingBurnCount(user), 2, "two pending burns in manual mode");

        // autoSettle back ON; third burn auto-settles (usdRecipient is funded -> canBurn true)
        minter.updateAutoSettle();
        (IGoldMinter.TradeWindow memory _tw3, bytes memory _twSig3) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), goldAmount, expectedUsd, _freshReport(2000e18, 2), _tw3, _twSig3);

        assertEq(minter.getUserPendingBurnCount(user), 2, "autoSettle burn must not corrupt pending count");
    }

    // ---- pure quote sanity ----

    function test_quote_usesSuppliedPrice_monotonic() public view {
        uint256 a = minter.quoteGoldAmount(address(usdt), 1000e6, 2000e8);
        uint256 b = minter.quoteGoldAmount(address(usdt), 1000e6, 4000e8);
        assertGt(a, b, "higher price -> less gold for same USD");
    }
}
