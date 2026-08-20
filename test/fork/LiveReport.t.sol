// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test, console2 } from "forge-std/Test.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { IVerifierProxy } from "../../contracts/interfaces/IVerifierProxy.sol";
import { GoldStreamVerifier } from "../../contracts/oracles/GoldStreamVerifier.sol";
import { ReportV8 } from "../../contracts/interfaces/DataStreamsReports.sol";
import { Errors } from "../../contracts/libraries/Errors.sol";

/// @dev One-shot end-to-end proof: a report fetched with LIVE Data Streams credentials
///      (saved to test/fixtures/xau/live_fetched.hex, gitignored) is run through the REAL
///      Arbitrum One VerifierProxy via our GoldStreamVerifier. Confirms the full pipeline
///      (live fetch → on-chain verify → price band) works with production credentials.
///      Skips cleanly if the live fixture is absent (e.g. CI without credentials).
contract LiveReportTest is Test {
    address constant VERIFIER_PROXY = 0x478Aa2aC9F6D65F84e09D9185d126c3a17c2a93C;
    address constant LINK = 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4;
    bytes32 constant XAU = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;
    string constant FIXTURE = "test/fixtures/xau/live_fetched.hex";

    GoldStreamVerifier verifier;

    function setUp() public {
        if (VERIFIER_PROXY.code.length == 0) return; // not on a fork
        GoldStreamVerifier impl = new GoldStreamVerifier();
        verifier = GoldStreamVerifier(
            address(
                new ERC1967Proxy(
                    address(impl),
                    abi.encodeCall(GoldStreamVerifier.initialize, (address(this), VERIFIER_PROXY, LINK, XAU))
                )
            )
        );
        verifier.setGoldMinter(address(this)); // let this test consume reports
        deal(LINK, address(verifier), 1000e18); // fund LINK for the verify() fee
    }

    function test_liveReport_verifiesThroughRealProxy() public {
        if (VERIFIER_PROXY.code.length == 0) return;
        if (!vm.exists(FIXTURE)) {
            console2.log("SKIP: no live fixture at", FIXTURE);
            return;
        }

        // Is a FeeManager configured on the live proxy? (address(0) => verify() is free)
        address fm = IVerifierProxy(VERIFIER_PROXY).s_feeManager();
        console2.log("VerifierProxy.s_feeManager():", fm);

        bytes memory report = vm.parseBytes(vm.readFile(FIXTURE));

        // Decode the report body BEFORE verify to inspect its fields and pin the clock.
        (, bytes memory rd) = abi.decode(report, (bytes32[3], bytes));
        ReportV8 memory h = abi.decode(rd, (ReportV8));
        console2.log("feedId matches XAU :", h.feedId == XAU);
        console2.log("midPrice (18-dec)  :", uint256(int256(h.midPrice)));
        console2.log("marketStatus       :", h.marketStatus);
        console2.log("observationsTs     :", h.observationsTimestamp);
        console2.log("expiresAt          :", h.expiresAt);

        // Pin block time just after observation so maxReportAge(90s) passes.
        vm.warp(uint256(h.observationsTimestamp) + 1);

        if (h.marketStatus == 2) {
            uint256 linkBefore = IERC20(LINK).balanceOf(address(verifier));
            (uint256 price8,,,) = verifier.verifyAndGetPrice(report);
            uint256 linkSpent = linkBefore - IERC20(LINK).balanceOf(address(verifier));
            console2.log("LINK fee spent (wei) :", linkSpent);
            console2.log("MARKET OPEN -> verified price8 (8-dec):", price8);
            // ounce price in USD (integer part) for a human sanity check
            console2.log("            -> ~USD/oz:", price8 / 1e8);
            assertGt(price8, 500e8, "below sanity floor");
            assertLt(price8, 20_000e8, "above sanity ceiling");
        } else {
            // Weekend / holiday: our verifier must reject a non-Open report.
            console2.log("MARKET CLOSED (status != 2) -> expecting MarketClosed revert");
            vm.expectRevert(Errors.MarketClosed.selector);
            verifier.verifyAndGetPrice(report);
        }
    }
}
