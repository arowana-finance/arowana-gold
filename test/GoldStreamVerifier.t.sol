// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { ERC20Mock } from "../contracts/tokens/ERC20Mock.sol";
import { Errors } from "../contracts/libraries/Errors.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { Asset, ReportV8, ReportV3 } from "../contracts/interfaces/DataStreamsReports.sol";
import { IVerifierProxy } from "../contracts/interfaces/IVerifierProxy.sol";
import { IDataStreamsFeeManager } from "../contracts/interfaces/IDataStreamsFeeManager.sol";

contract GoldStreamVerifierTest is Test {
    GoldStreamVerifier verifier;

    address owner = address(this); // test contract is owner + goldMinter
    address verifierProxy = makeAddr("verifierProxy");
    address feeManager = makeAddr("feeManager");
    address rewardManager = makeAddr("rewardManager");
    address stranger = makeAddr("stranger");

    // real XAU/USD v8 feedId (prefix 0x0008 => schema v8)
    bytes32 constant FEED_ID = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;
    // a different v8 feed (for the wrong-feed test): same version prefix (0x0008), different body
    bytes32 constant WRONG_FEED = bytes32((uint256(0x0008) << 240) | 0xbad);
    // ETH/USD v3 feedId (prefix 0x0003 => schema v3)
    bytes32 constant ETH_USD_V3 = 0x000359843a543ee2fe414dc14c7e7920ef10f4372990b79d6361cdc0dd1ba782;

    function setUp() public {
        vm.warp(1_000_000); // give room for expiry math

        ERC20Mock link = new ERC20Mock("Chainlink", "LINK", 18, 1_000_000e18);

        GoldStreamVerifier impl = new GoldStreamVerifier();
        bytes memory initData =
            abi.encodeCall(GoldStreamVerifier.initialize, (owner, verifierProxy, address(link), FEED_ID));
        verifier = GoldStreamVerifier(address(new ERC1967Proxy(address(impl), initData)));
        verifier.setGoldMinter(owner);

        // fund verifier with LINK for the fee path
        link.mint(address(verifier), 10_000e18);
    }

    // ---- helpers ----

    function _report(
        bytes32 feedId,
        int192 midPrice,
        uint32 marketStatus,
        uint32 observationsTimestamp,
        uint32 expiresAt
    ) internal pure returns (bytes memory unverified, bytes memory verified) {
        ReportV8 memory r = ReportV8({
            feedId: feedId,
            validFromTimestamp: observationsTimestamp,
            observationsTimestamp: observationsTimestamp,
            nativeFee: 0,
            linkFee: 0,
            expiresAt: expiresAt,
            lastUpdateTimestamp: uint64(observationsTimestamp),
            midPrice: midPrice,
            marketStatus: marketStatus
        });
        verified = abi.encode(r);

        bytes32[3] memory ctx;
        unverified = abi.encode(ctx, verified);
    }

    function _mockNoFee(bytes memory verified) internal {
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.s_feeManager.selector), abi.encode(address(0)));
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.verify.selector), abi.encode(verified));
    }

    // ---- happy path ----

    function test_verifyAndGetPrice_noFee_openMarket() public {
        uint32 obs = uint32(block.timestamp);
        uint32 exp = uint32(block.timestamp + 1 hours);
        (bytes memory unverified, bytes memory verified) = _report(FEED_ID, 2000e18, 2, obs, exp);
        _mockNoFee(verified);

        (uint256 price8, uint32 obsTs, uint32 marketStatus, uint32 expiresAt) = verifier.verifyAndGetPrice(unverified);

        assertEq(price8, 2000e8, "18->8 scaling");
        assertEq(obsTs, obs);
        assertEq(marketStatus, 2);
        assertEq(expiresAt, exp);

        (,,,,, uint32 maxAge) = verifier.config();
        assertEq(maxAge, 90 seconds, "default maxReportAge");
    }

    function test_scaling_reportDecimals8_identity() public {
        verifier.setReportDecimals(8);
        uint32 obs = uint32(block.timestamp);
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, 2000e8, 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        (uint256 price8,,,) = verifier.verifyAndGetPrice(unverified);
        assertEq(price8, 2000e8, "8-dec passthrough");
    }

    // ---- report-specific checks ----

    function test_revert_marketClosed() public {
        uint32 obs = uint32(block.timestamp);
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, 2000e18, 1, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        vm.expectRevert(Errors.MarketClosed.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    function test_revert_expired() public {
        uint32 obs = uint32(block.timestamp - 2 hours);
        uint32 exp = uint32(block.timestamp - 1 hours); // already expired
        (bytes memory unverified, bytes memory verified) = _report(FEED_ID, 2000e18, 2, obs, exp);
        _mockNoFee(verified);

        vm.expectRevert(Errors.ReportExpired.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    function test_revert_wrongFeed() public {
        uint32 obs = uint32(block.timestamp);
        (bytes memory unverified, bytes memory verified) =
            _report(WRONG_FEED, 2000e18, 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        vm.expectRevert(Errors.InvalidReportFeed.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    // ---- v3 (crypto) schema support ----

    function test_v3_cryptoReport_decodesAndReturnsPrice() public {
        verifier.setAllowV3(true); // v3 is opt-in (default false) — security review #2
        // point the verifier at the ETH/USD v3 feed
        verifier.setFeedId(ETH_USD_V3);

        uint32 obs = uint32(block.timestamp);
        ReportV3 memory r = ReportV3({
            feedId: ETH_USD_V3,
            validFromTimestamp: obs,
            observationsTimestamp: obs,
            nativeFee: 0,
            linkFee: 0,
            expiresAt: uint32(block.timestamp + 1 hours),
            price: 3000e18,
            bid: 2999e18,
            ask: 3001e18
        });
        bytes memory verified = abi.encode(r);
        bytes32[3] memory ctx;
        bytes memory unverified = abi.encode(ctx, verified);
        _mockNoFee(verified);

        (uint256 price8,, uint32 marketStatus,) = verifier.verifyAndGetPrice(unverified);
        assertEq(price8, 3000e8, "v3 price scaled 18->8");
        assertEq(marketStatus, 2, "crypto treated as open");
    }

    function test_revert_unsupportedVersion() public {
        // feedId prefix 0x0009 => unsupported schema
        bytes32 v9feed = bytes32((uint256(0x0009) << 240) | 0xabc);
        verifier.setFeedId(v9feed);
        uint32 obs = uint32(block.timestamp);
        (bytes memory unverified, bytes memory verified) =
            _report(v9feed, 2000e18, 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        vm.expectRevert(Errors.InvalidReportVersion.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    function test_revert_nonPositivePrice() public {
        uint32 obs = uint32(block.timestamp);
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, int192(0), 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        vm.expectRevert(Errors.InvalidPrice.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    // No global replay watermark: re-using a STILL-FRESH report is allowed and
    // harmless (each call independently pays its fee; the price is fresh). This
    // is intentional — a shared watermark would let anyone front-run/grief.
    function test_freshReportReplay_allowed() public {
        uint32 obs = uint32(block.timestamp);
        uint32 exp = uint32(block.timestamp + 1 hours);
        (bytes memory unverified, bytes memory verified) = _report(FEED_ID, 2000e18, 2, obs, exp);
        _mockNoFee(verified);

        (uint256 p1,,,) = verifier.verifyAndGetPrice(unverified); // first consume
        (uint256 p2,,,) = verifier.verifyAndGetPrice(unverified); // same report again -> still ok

        assertEq(p1, 2000e8);
        assertEq(p2, p1, "fresh report re-use returns the same price, no revert");
    }

    function test_replay_newerReportAccepted() public {
        // both in the recent past so neither is "not yet valid" nor "too old"
        uint32 obs1 = uint32(block.timestamp - 2);
        (bytes memory u1, bytes memory v1) = _report(FEED_ID, 2000e18, 2, obs1, uint32(block.timestamp + 1 hours));
        _mockNoFee(v1);
        verifier.verifyAndGetPrice(u1);

        // newer observationsTimestamp -> accepted
        uint32 obs2 = obs1 + 1;
        (bytes memory u2, bytes memory v2) = _report(FEED_ID, 2100e18, 2, obs2, uint32(block.timestamp + 1 hours));
        _mockNoFee(v2);
        (uint256 price8,,,) = verifier.verifyAndGetPrice(u2);
        assertEq(price8, 2100e8);
    }

    // ---- consumer-side freshness (max age) & validFrom ----

    function test_revert_reportTooOld() public {
        // not expired, but observed > maxReportAge (90s default) ago
        uint32 obs = uint32(block.timestamp - 16 minutes);
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, 2000e18, 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        vm.expectRevert(Errors.ReportTooOld.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    function test_revert_notYetValid() public {
        // validFromTimestamp (== observationsTimestamp here) in the future
        uint32 obs = uint32(block.timestamp + 100);
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, 2000e18, 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        vm.expectRevert(Errors.ReportNotYetValid.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    function test_setMaxReportAge_widensWindow() public {
        verifier.setMaxReportAge(2 minutes); // ceiling
        uint32 obs = uint32(block.timestamp - 100 seconds); // outside 90s default, within widened 2m window
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, 2000e18, 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        (uint256 price8,,,) = verifier.verifyAndGetPrice(unverified);
        assertEq(price8, 2000e8);
    }

    // ---- setter guards ----

    function test_revert_setMaxReportAge_outOfBounds() public {
        vm.expectRevert(Errors.InvalidPriceAge.selector);
        verifier.setMaxReportAge(30); // < 1 minute
        vm.expectRevert(Errors.InvalidPriceAge.selector);
        verifier.setMaxReportAge(2 minutes + 1); // > 2 minutes (ceiling)
    }

    function test_revert_setReportDecimals_outOfBounds() public {
        vm.expectRevert(Errors.InvalidReportDecimals.selector);
        verifier.setReportDecimals(0);
        vm.expectRevert(Errors.InvalidReportDecimals.selector);
        verifier.setReportDecimals(37);
    }

    /// @dev Security review #1 regression: reportDecimals is bounded to [8, 18].
    ///      19 (one above the 18-dec source) would over-divide the price by 10x,
    ///      silently passing GoldMinter's bound at high gold prices → under-
    ///      collateralization. It must be rejected. 7 (below the 8-dec output
    ///      floor) is rejected too; the confirmed source precision 18 is accepted.
    function test_revert_setReportDecimals_aboveSourcePrecision() public {
        vm.expectRevert(Errors.InvalidReportDecimals.selector);
        verifier.setReportDecimals(19); // the exploit value — now rejected
        vm.expectRevert(Errors.InvalidReportDecimals.selector);
        verifier.setReportDecimals(7); // below the 8-dec output floor
        verifier.setReportDecimals(18); // confirmed source precision — accepted
        (,,,, uint8 rd,) = verifier.config();
        assertEq(rd, 18, "reportDecimals set to 18");
    }

    /// @dev Security review #2 regression: v3 (crypto) reports are rejected by
    ///      default. v3 has no market status (forced Open), so a gold deployment
    ///      must not silently accept one. Enabling requires an explicit setAllowV3.
    function test_revert_v3_notAllowedByDefault() public {
        assertEq(verifier.allowV3(), false, "v3 disabled by default");
        verifier.setFeedId(ETH_USD_V3);
        uint32 obs = uint32(block.timestamp);
        ReportV3 memory r = ReportV3({
            feedId: ETH_USD_V3,
            validFromTimestamp: obs,
            observationsTimestamp: obs,
            nativeFee: 0,
            linkFee: 0,
            expiresAt: uint32(block.timestamp + 1 hours),
            price: 3000e18,
            bid: 2999e18,
            ask: 3001e18
        });
        bytes memory verified = abi.encode(r);
        bytes32[3] memory ctx;
        bytes memory unverified = abi.encode(ctx, verified);
        _mockNoFee(verified);

        vm.expectRevert(Errors.InvalidReportVersion.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    function test_revert_zeroAddressSetters() public {
        vm.expectRevert(Errors.ZeroGoldMinter.selector);
        verifier.setGoldMinter(address(0));
        vm.expectRevert(Errors.ZeroLinkToken.selector);
        verifier.setLinkToken(address(0));
        vm.expectRevert(Errors.ZeroFeedId.selector);
        verifier.setFeedId(bytes32(0));
        vm.expectRevert(Errors.ZeroVerifier.selector);
        verifier.setVerifierProxy(address(0));
        vm.expectRevert(Errors.ZeroRecipient.selector);
        verifier.withdrawLink(address(0), 1);
    }

    // ---- access control ----

    function test_revert_notGoldMinter() public {
        uint32 obs = uint32(block.timestamp);
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, 2000e18, 2, obs, uint32(block.timestamp + 1 hours));
        _mockNoFee(verified);

        vm.prank(stranger);
        vm.expectRevert(Errors.NotGoldMinter.selector);
        verifier.verifyAndGetPrice(unverified);
    }

    // ---- fee path ----

    function test_feePath_approvesRewardManager() public {
        (, address link,,,,) = verifier.config();
        uint256 fee = 1e16;

        uint32 obs = uint32(block.timestamp);
        (bytes memory unverified, bytes memory verified) =
            _report(FEED_ID, 2000e18, 2, obs, uint32(block.timestamp + 1 hours));

        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.s_feeManager.selector), abi.encode(feeManager));
        vm.mockCall(
            feeManager,
            abi.encodeWithSelector(IDataStreamsFeeManager.getFeeAndReward.selector),
            abi.encode(Asset(link, fee), Asset(link, 0), uint256(0))
        );
        vm.mockCall(
            feeManager,
            abi.encodeWithSelector(IDataStreamsFeeManager.i_rewardManager.selector),
            abi.encode(rewardManager)
        );
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.verify.selector), abi.encode(verified));

        // the fee approval to the reward manager must happen during verify
        vm.expectCall(link, abi.encodeWithSignature("approve(address,uint256)", rewardManager, fee));
        (uint256 price8,,,) = verifier.verifyAndGetPrice(unverified);

        assertEq(price8, 2000e8);
        // residual allowance is cleared after verify (defense-in-depth)
        assertEq(ERC20Mock(link).allowance(address(verifier), rewardManager), 0, "residual allowance cleared");
    }

    // ---- owner setters ----

    function test_revert_setGoldMinter_notOwner() public {
        vm.prank(stranger);
        vm.expectRevert();
        verifier.setGoldMinter(stranger);
    }
}
