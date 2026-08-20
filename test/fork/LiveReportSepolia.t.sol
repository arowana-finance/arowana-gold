// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test, console2 } from "forge-std/Test.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { IVerifierProxy } from "../../contracts/interfaces/IVerifierProxy.sol";
import { GoldStreamVerifier } from "../../contracts/oracles/GoldStreamVerifier.sol";
import { ReportV8 } from "../../contracts/interfaces/DataStreamsReports.sol";
import { Errors } from "../../contracts/libraries/Errors.sol";

/// @dev testnet twin of LiveReport: a report fetched with LIVE Arbitrum Sepolia credentials
///      (test/fixtures/xau/live_sepolia.hex, gitignored) run through the REAL Sepolia
///      VerifierProxy via GoldStreamVerifier. Confirms the testnet pipeline end-to-end.
///      Run:  forge test --match-path test/fork/LiveReportSepolia.t.sol \
///              --fork-url https://sepolia-rollup.arbitrum.io/rpc --evm-version prague -vv
contract LiveReportSepoliaTest is Test {
    address constant VERIFIER_PROXY = 0x2ff010DEbC1297f19579B4246cad07bd24F2488A; // Arbitrum Sepolia
    address constant LINK = 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E; // Sepolia LINK (unused if fee==0)
    bytes32 constant XAU = 0x0008dc605e8fc3cd2e609da016af59e6e8aad20b672264949c5b99e1ca3b90fd; // testnet XAU/USD v8
    string constant FIXTURE = "test/fixtures/xau/live_sepolia.hex";

    GoldStreamVerifier verifier;

    function setUp() public {
        if (VERIFIER_PROXY.code.length == 0) return;
        GoldStreamVerifier impl = new GoldStreamVerifier();
        verifier = GoldStreamVerifier(
            address(
                new ERC1967Proxy(
                    address(impl),
                    abi.encodeCall(GoldStreamVerifier.initialize, (address(this), VERIFIER_PROXY, LINK, XAU))
                )
            )
        );
        verifier.setGoldMinter(address(this));
    }

    function test_liveSepoliaReport_verifiesThroughRealProxy() public {
        if (VERIFIER_PROXY.code.length == 0) return;
        if (!vm.exists(FIXTURE)) {
            console2.log("SKIP: no sepolia fixture at", FIXTURE);
            return;
        }

        bytes memory report = vm.parseBytes(vm.readFile(FIXTURE));

        // FeeManager check (0 fee expected, as on mainnet)
        console2.log("VerifierProxy.s_feeManager():", IVerifierProxy(VERIFIER_PROXY).s_feeManager());

        (, bytes memory rd) = abi.decode(report, (bytes32[3], bytes));
        ReportV8 memory h = abi.decode(rd, (ReportV8));
        console2.log("feedId matches testnet XAU:", h.feedId == XAU);
        console2.log("midPrice (18-dec)         :", uint256(int256(h.midPrice)));
        console2.log("marketStatus              :", h.marketStatus);
        console2.log("observationsTs            :", h.observationsTimestamp);

        vm.warp(uint256(h.observationsTimestamp) + 1);

        // Fund LINK generously in case testnet charges a fee (harmless if fee==0).
        deal(LINK, address(verifier), 1000e18);
        uint256 linkBefore = IERC20(LINK).balanceOf(address(verifier));

        if (h.marketStatus == 2) {
            (uint256 price8,,,) = verifier.verifyAndGetPrice(report);
            console2.log("LINK fee spent (wei)      :", linkBefore - IERC20(LINK).balanceOf(address(verifier)));
            console2.log("MARKET OPEN -> price8      :", price8);
            console2.log("            -> ~USD/oz     :", price8 / 1e8);
            assertGt(price8, 500e8, "below sanity floor");
            assertLt(price8, 20_000e8, "above sanity ceiling");
        } else {
            console2.log("MARKET CLOSED (status != 2) -> expecting MarketClosed revert");
            vm.expectRevert(Errors.MarketClosed.selector);
            verifier.verifyAndGetPrice(report);
        }
    }
}
