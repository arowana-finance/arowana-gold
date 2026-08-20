// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test, console2 } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";
import { ERC20Mock } from "../../contracts/tokens/ERC20Mock.sol";
import { GoldMinter } from "../../contracts/GoldMinter.sol";
import { IGoldMinter } from "../../contracts/interfaces/IGoldMinter.sol";
import { Errors } from "../../contracts/libraries/Errors.sol";
import { GoldStreamVerifier } from "../../contracts/oracles/GoldStreamVerifier.sol";
import { ReportV8 } from "../../contracts/interfaces/DataStreamsReports.sol";
import { MockGoldToken } from "./E2EGoldMinter.t.sol";

/**
 * @title E2EGoldMinterReverts
 * @notice Exhaustively covers revert/edge cases of the GoldMinter + GoldStreamVerifier
 *         stack on an Arbitrum One fork.
 *
 * Two trigger strategies:
 *   1. Captured real XAU report (report_01.hex) — for GoldMinter-side checks that only
 *      need an in-range price.
 *   2. vm.mockCall on the real VerifierProxy (s_feeManager -> 0, verify -> forged ReportV8)
 *      — for verifier-internal checks impossible with genuinely signed reports
 *      (market closed, wrong feed, wrong version, future/expired/stale timing,
 *      out-of-range price).
 *
 * Run:
 *   forge test --match-contract E2EGoldMinterReverts \
 *     --fork-url https://arb1.arbitrum.io/rpc -vvv
 */
contract E2EGoldMinterReverts is Test {
    address constant VERIFIER_PROXY = 0x478Aa2aC9F6D65F84e09D9185d126c3a17c2a93C;
    address constant LINK = 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4;
    bytes32 constant XAU = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;

    // forged feedId (valid 0x0008 prefix -> decodes as v8, but not the configured XAU)
    bytes32 constant OTHER_V8 = 0x0008000000000000000000000000000000000000000000000000000000000001;
    bytes32 constant BAD_VERSION = 0x0009000000000000000000000000000000000000000000000000000000000001;

    uint256 constant T = 2_000_000_000; // fixed reference time for mock-report tests

    GoldMinter minter;
    GoldStreamVerifier verifier;
    MockGoldToken gold;
    ERC20Mock usdt;
    ERC20Mock usdc;
    ERC20Mock fakeUsd; // 6-decimal token not registered as USDT/USDC

    address usdRecipient = makeAddr("usdRecipient");
    address feeRecipient = makeAddr("feeRecipient");

    address user;
    uint256 userPk;
    address poorUser; // user who never received KYC approval
    address kycManager;
    uint256 kycManagerPk;

    // KYC_MANAGER signer (known private key) — signs business-hours trade windows.
    address twSigner;
    uint256 twSignerPk;
    uint256 internal _twNonce;

    function setUp() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (user, userPk) = makeAddrAndKey("user");
        poorUser = makeAddr("poorUser");
        (kycManager, kycManagerPk) = makeAddrAndKey("kycManager");

        gold = new MockGoldToken();
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);
        fakeUsd = new ERC20Mock("Fake", "FAKE", 6, 0); // token not registered as USDT/USDC

        GoldStreamVerifier vImpl = new GoldStreamVerifier();
        verifier = GoldStreamVerifier(
            address(
                new ERC1967Proxy(
                    address(vImpl),
                    abi.encodeCall(GoldStreamVerifier.initialize, (address(this), VERIFIER_PROXY, LINK, XAU))
                )
            )
        );
        verifier.setMaxReportAge(2 minutes); // ceiling (MAX_MAX_REPORT_AGE)
        deal(LINK, address(verifier), 1000e18);

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
        minter.grantRole(minter.KYC_MANAGER_ROLE(), kycManager);
        (twSigner, twSignerPk) = makeAddrAndKey("twSigner");
        minter.grantRole(minter.KYC_MANAGER_ROLE(), twSigner);
        minter.grantRole(minter.SETTLER_ROLE(), address(this));
        minter.grantRole(minter.INFRA_MANAGER_ROLE(), address(this));
        minter.updateMinGoldFee(0.1 ether);
        minter.updateMinGoldFeeAmount(1 ether);
        minter.updateMinMintAmount(1 ether);
        minter.updateMinRedeemAmount(1 ether);
        minter.setLevel(user, IGoldMinter.Levels.APPROVED);

        usdt.mint(usdRecipient, 100_000_000e6);
        vm.prank(usdRecipient);
        usdt.approve(address(minter), type(uint256).max);
    }

    // ──────────────────────────── helpers ────────────────────────────

    function _price8(bytes memory report) internal pure returns (uint256, uint32) {
        (, bytes memory rd) = abi.decode(report, (bytes32[3], bytes));
        ReportV8 memory h = abi.decode(rd, (ReportV8));
        return (uint256(int256(h.midPrice)) / 1e10, h.observationsTimestamp);
    }

    /// @dev Reads a captured real XAU report and warps inside its freshness window.
    function _realReport() internal returns (bytes memory report, uint256 price8) {
        report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_01.hex"));
        uint32 obs;
        (price8, obs) = _price8(report);
        vm.warp(uint256(obs) + 1);
    }

    /// @dev Forges an arbitrary ReportV8 and mocks VerifierProxy so our real GoldStreamVerifier
    ///      verifies/decodes it. Caller must set block.timestamp (vm.warp) to hit the
    ///      intended timing branch.
    function _mockReport(
        bytes32 feedId,
        uint32 validFrom,
        uint32 obs,
        uint32 expiresAt,
        int192 midPrice,
        uint32 marketStatus
    ) internal returns (bytes memory unverified) {
        ReportV8 memory r = ReportV8({
            feedId: feedId,
            validFromTimestamp: validFrom,
            observationsTimestamp: obs,
            nativeFee: 0,
            linkFee: 0,
            expiresAt: expiresAt,
            lastUpdateTimestamp: uint64(obs),
            midPrice: midPrice,
            marketStatus: marketStatus
        });
        bytes memory verified = abi.encode(r);
        bytes32[3] memory ctx;
        unverified = abi.encode(ctx, verified);

        vm.mockCall(VERIFIER_PROXY, abi.encodeWithSignature("s_feeManager()"), abi.encode(address(0)));
        vm.mockCall(VERIFIER_PROXY, abi.encodeWithSignature("verify(bytes,bytes)"), abi.encode(verified));
    }

    /// @dev Fully valid mock report at reference time T (in-range price, market open, fresh).
    function _mockValid(int192 midPrice) internal returns (bytes memory) {
        vm.warp(T);
        return _mockReport(XAU, uint32(T - 10), uint32(T - 10), uint32(T + 100_000), midPrice, 2);
    }

    function _fund(address who, uint256 usdAmt) internal {
        usdt.mint(who, usdAmt);
        vm.prank(who);
        usdt.approve(address(minter), type(uint256).max);
    }

    // ── trade-window helpers (business-hours gate) ──

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

    /// @dev Single-use business-hours window signed by KYC_MANAGER (twSigner).
    ///      The gate runs first in every request entry point, so every call needs a valid
    ///      window to reach the downstream logic, pass or revert.
    function _mintTW(address user_) internal returns (IGoldMinter.TradeWindow memory tw, bytes memory sig) {
        tw = IGoldMinter.TradeWindow({ user: user_, validAfter: 0, validBefore: type(uint64).max, nonce: _twNonce++ });
        bytes32 structHash =
            keccak256(abi.encode(minter.TRADE_WINDOW_TYPEHASH(), tw.user, tw.validAfter, tw.validBefore, tw.nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(twSignerPk, digest);
        sig = abi.encodePacked(r, s, v);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Group A — verifier-internal reverts (report content forged via mockCall)
    // ══════════════════════════════════════════════════════════════════════════

    function test_revert_InvalidReportVersion() public {
        vm.warp(T);
        bytes memory report = _mockReport(BAD_VERSION, uint32(T - 10), uint32(T - 10), uint32(T + 1000), 4000e18, 2);
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw1, bytes memory _twSig1) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InvalidReportVersion.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw1, _twSig1);
    }

    function test_revert_InvalidReportFeed() public {
        vm.warp(T);
        bytes memory report = _mockReport(OTHER_V8, uint32(T - 10), uint32(T - 10), uint32(T + 1000), 4000e18, 2);
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw2, bytes memory _twSig2) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InvalidReportFeed.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw2, _twSig2);
    }

    function test_revert_InvalidPrice_zeroMid() public {
        vm.warp(T);
        bytes memory report = _mockReport(XAU, uint32(T - 10), uint32(T - 10), uint32(T + 1000), 0, 2);
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw3, bytes memory _twSig3) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InvalidPrice.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw3, _twSig3);
    }

    function test_revert_ReportNotYetValid() public {
        vm.warp(T);
        // validFrom in the future
        bytes memory report = _mockReport(XAU, uint32(T + 1000), uint32(T + 1000), uint32(T + 100_000), 4000e18, 2);
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw4, bytes memory _twSig4) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.ReportNotYetValid.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw4, _twSig4);
    }

    function test_revert_ReportExpired() public {
        vm.warp(T);
        // expiresAt in the past (validFrom also past)
        bytes memory report = _mockReport(XAU, uint32(T - 100), uint32(T - 100), uint32(T - 10), 4000e18, 2);
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw5, bytes memory _twSig5) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.ReportExpired.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw5, _twSig5);
    }

    function test_revert_ReportTooOld() public {
        vm.warp(T);
        // obs older than maxReportAge (2 min) but not yet expired
        bytes memory report = _mockReport(XAU, uint32(T - 3600), uint32(T - 3600), uint32(T + 100_000), 4000e18, 2);
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw6, bytes memory _twSig6) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.ReportTooOld.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw6, _twSig6);
    }

    function test_revert_MarketClosed() public {
        vm.warp(T);
        bytes memory report = _mockReport(XAU, uint32(T - 10), uint32(T - 10), uint32(T + 100_000), 4000e18, 1); // 1 = market closed
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw7, bytes memory _twSig7) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.MarketClosed.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw7, _twSig7);
    }

    // (replay watermark removed — fresh-report reuse is harmless; stale-report rejection
    //  is covered by test_revert_ReportTooOld)

    function test_revert_PriceOutOfRange_low() public {
        bytes memory report = _mockValid(400e18); // $400/oz < minGoldPrice $500
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw8, bytes memory _twSig8) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.PriceOutOfRange.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw8, _twSig8);
    }

    function test_revert_PriceOutOfRange_high() public {
        bytes memory report = _mockValid(21_000e18); // $21,000/oz > MAX_GOLD_PRICE $20,000 (raised per R2/Q3)
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw9, bytes memory _twSig9) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.PriceOutOfRange.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw9, _twSig9);
    }

    function test_revert_NotGoldMinter_directCall() public {
        (bytes memory report,) = _realReport();
        // address(this) owns the verifier but is not the configured goldMinter
        vm.expectRevert(Errors.NotGoldMinter.selector);
        verifier.verifyAndGetPrice(report);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Group B — GoldMinter request-path validation (real in-range price)
    // ══════════════════════════════════════════════════════════════════════════

    function test_revert_Underpriced_zeroMinGold() public {
        (bytes memory report,) = _realReport();
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw10, bytes memory _twSig10) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.Underpriced.selector);
        minter.requestMint(address(usdt), 200e6, 0, report, _tw10, _twSig10); // minGold 0 -> below slippage band
    }

    function test_revert_Underpriced_minGoldTooHigh() public {
        (bytes memory report, uint256 price8) = _realReport();
        _fund(user, 200e6);
        uint256 gross = minter.quoteGoldAmount(address(usdt), 200e6, price8);
        (IGoldMinter.TradeWindow memory _tw11, bytes memory _twSig11) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.Underpriced.selector);
        // asks for more than expectedOutput -> fails expectedOutput >= minAmount
        minter.requestMint(address(usdt), 200e6, gross * 2, report, _tw11, _twSig11);
    }

    function test_revert_SmallAmount_belowMinMint() public {
        (bytes memory report, uint256 price8) = _realReport();
        _fund(user, 100e6); // $100 -> ~0.6 g < minMintAmount (1 g)
        uint256 gross = minter.quoteGoldAmount(address(usdt), 100e6, price8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw12, bytes memory _twSig12) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.SmallAmount.selector);
        minter.requestMint(address(usdt), 100e6, net, report, _tw12, _twSig12);
    }

    function test_revert_Underlevel_unapprovedUser() public {
        (bytes memory report, uint256 price8) = _realReport();
        _fund(poorUser, 200e6); // poorUser has no KYC level (0 < tradeLevel KYCD)
        uint256 gross = minter.quoteGoldAmount(address(usdt), 200e6, price8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw13, bytes memory _twSig13) = _mintTW(poorUser);
        vm.prank(poorUser);
        vm.expectRevert(Errors.Underlevel.selector);
        minter.requestMint(address(usdt), 200e6, net, report, _tw13, _twSig13);
    }

    function test_revert_AMLBlocked() public {
        (bytes memory report, uint256 price8) = _realReport();
        minter.setAMLBlacklist(user, true);
        _fund(user, 200e6);
        uint256 gross = minter.quoteGoldAmount(address(usdt), 200e6, price8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw14, bytes memory _twSig14) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.requestMint(address(usdt), 200e6, net, report, _tw14, _twSig14);
    }

    function test_revert_InvalidUSDToken() public {
        (bytes memory report, uint256 price8) = _realReport();
        fakeUsd.mint(user, 200e6);
        vm.prank(user);
        fakeUsd.approve(address(minter), type(uint256).max);
        uint256 gross = minter.quoteGoldAmount(address(fakeUsd), 200e6, price8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw15, bytes memory _twSig15) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InvalidUSDToken.selector);
        minter.requestMint(address(fakeUsd), 200e6, net, report, _tw15, _twSig15);
    }

    function test_revert_NotTradeUnitMultiple() public {
        (bytes memory report,) = _realReport();
        minter.updateTradeUnit(1 ether); // 1-gram unit
        _fund(user, 200e6);
        (IGoldMinter.TradeWindow memory _tw16, bytes memory _twSig16) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.NotTradeUnitMultiple.selector);
        minter.requestMint(address(usdt), 200e6, 1.5 ether, report, _tw16, _twSig16); // not a multiple of 1 gram
    }

    function test_revert_InsufficientUsdAmount_tradeUnit() public {
        (bytes memory report,) = _realReport();
        minter.updateTradeUnit(1 ether);
        _fund(user, 1e6); // deposit only $1
        (IGoldMinter.TradeWindow memory _tw17, bytes memory _twSig17) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.InsufficientUsdAmount.selector);
        // requests 2 g (a valid multiple) but $1 is not enough
        minter.requestMint(address(usdt), 1e6, 2 ether, report, _tw17, _twSig17);
    }

    // ── KYC wrapper guards ──

    function test_revert_ZeroSignature_kyc() public {
        (bytes memory report,) = _realReport();
        IGoldMinter.KYCMintRequest memory kyc = IGoldMinter.KYCMintRequest({
            user: user,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 2,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            usdAmount: 200e6,
            minGoldAmount: 0
        });
        (IGoldMinter.TradeWindow memory _tw18, bytes memory _twSig18) = _mintTW(user);
        vm.prank(user);
        vm.expectRevert(Errors.ZeroSignature.selector);
        minter.requestMintWithKYC(kyc, "", "", report, _tw18, _twSig18); // empty KYC signature
    }

    function test_revert_InvalidSignature_senderMismatch() public {
        (bytes memory report,) = _realReport();
        IGoldMinter.KYCMintRequest memory kyc = IGoldMinter.KYCMintRequest({
            user: user, // the request names user...
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 2,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            usdAmount: 200e6,
            minGoldAmount: 0
        });
        (IGoldMinter.TradeWindow memory _tw19, bytes memory _twSig19) = _mintTW(poorUser);
        vm.prank(poorUser); // ...but a different account calls
        vm.expectRevert(Errors.InvalidSignature.selector);
        minter.requestMintWithKYC(kyc, hex"01", "", report, _tw19, _twSig19);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Group C — settlement guards (SETTLER_ROLE path)
    // ══════════════════════════════════════════════════════════════════════════

    function test_revert_AlreadySettled() public {
        (bytes memory report, uint256 price8) = _realReport();
        _fund(user, 200e6);
        uint256 gross = minter.quoteGoldAmount(address(usdt), 200e6, price8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        (IGoldMinter.TradeWindow memory _tw20, bytes memory _twSig20) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), 200e6, net, report, _tw20, _twSig20); // autoSettle -> order 0 already settled

        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.settleMint(0);
    }

    function test_revert_InvalidNonce_settle() public {
        vm.expectRevert(Errors.InvalidNonce.selector);
        minter.settleMint(999);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Group D — parameter / config setter guards
    // ══════════════════════════════════════════════════════════════════════════

    function test_revert_Overflow_slippage() public {
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateSlippage(501); // max 500
    }

    function test_revert_Overflow_mintSpread() public {
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateMintSpread(301); // max 300
    }

    function test_revert_Overflow_mintFee() public {
        vm.expectRevert(Errors.Overflow.selector);
        minter.updateMintFee(101); // max 100
    }

    function test_revert_FeeExceedsMinimum() public {
        // minGoldFee must be strictly below minMintAmount (1 ether)
        vm.expectRevert(Errors.FeeExceedsMinimum.selector);
        minter.updateMinGoldFee(1 ether);
    }

    function test_revert_VerifierAlreadySet() public {
        vm.expectRevert(Errors.VerifierAlreadySet.selector);
        minter.setGoldStreamVerifierOnce(address(verifier)); // already set in init
    }

    function test_revert_accessControl_nonManager() public {
        // read role hashes before prank so view calls don't consume it
        bytes32 role = minter.PARAMETER_MANAGER_ROLE();
        vm.prank(poorUser);
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, poorUser, role)
        );
        minter.updateSlippage(100);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Group E — verifier owner setter guards
    // ══════════════════════════════════════════════════════════════════════════

    function test_revert_InvalidPriceAge_tooHigh() public {
        vm.expectRevert(Errors.InvalidPriceAge.selector);
        verifier.setMaxReportAge(6 minutes); // max 2 min
    }

    function test_revert_InvalidPriceAge_tooLow() public {
        vm.expectRevert(Errors.InvalidPriceAge.selector);
        verifier.setMaxReportAge(30 seconds); // min 1 min
    }

    function test_revert_InvalidReportDecimals_zero() public {
        vm.expectRevert(Errors.InvalidReportDecimals.selector);
        verifier.setReportDecimals(0);
    }

    function test_revert_InvalidReportDecimals_tooHigh() public {
        vm.expectRevert(Errors.InvalidReportDecimals.selector);
        verifier.setReportDecimals(37); // > 18 (source-precision ceiling, security review #1)
    }

    function test_revert_ZeroGoldMinter_setter() public {
        vm.expectRevert(Errors.ZeroGoldMinter.selector);
        verifier.setGoldMinter(address(0));
    }

    function test_revert_ZeroFeedId_setter() public {
        vm.expectRevert(Errors.ZeroFeedId.selector);
        verifier.setFeedId(bytes32(0));
    }

    function test_revert_verifierSetter_onlyOwner() public {
        vm.prank(poorUser);
        vm.expectRevert(); // custom Ownable: NotOwner / OwnableUnauthorized
        verifier.setMaxReportAge(10 minutes);
    }
}
