// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { ERC20Mock } from "../contracts/tokens/ERC20Mock.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";

/// @title QuoteMathProps
/// @notice Quote functions are pure views taking a verified price8, so the whole valid
///         price band can be fuzzed without oracle/report plumbing. Params = initialize defaults
///         (mintSpread/redeemSpread 1.5%, fee 0.25%, minGoldFee 2.5e18 / 1000e18).
contract QuoteMathPropsTest is Test {
    GoldMinter minter;
    ERC20Mock gold;
    ERC20Mock usdt;

    // same fuzz bounds as GoldMinter's ounce sanity band (range a verified report can pass)
    uint256 constant MIN_PRICE = 500e8;
    uint256 constant MAX_PRICE = 20_000e8; // MinterShared.MAX_GOLD_PRICE (R2/Q3)
    // 1 mg ~ 100 kg (valid domain)
    uint256 constant MIN_GOLD = 0.001 ether;
    uint256 constant MAX_GOLD = 100_000 ether;

    function setUp() public {
        gold = new ERC20Mock("Gold", "OXAU", 18, 0);
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        ERC20Mock usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);

        // quote paths never call the verifier, so any non-zero dummy address works
        minter = GoldMinter(
            address(
                new ERC1967Proxy(
                    address(new GoldMinter()),
                    abi.encodeCall(
                        GoldMinter.initializeGoldMinter,
                        (
                            address(gold),
                            address(usdt),
                            address(usdc),
                            address(0xBEEF),
                            makeAddr("usdRecipient"),
                            makeAddr("feeRecipient"),
                            address(this),
                            false
                        )
                    )
                )
            )
        );
    }

    /// P1 — round-trip sufficiency: quoteRequiredUsd is a ceil, so paying the quoted USD
    ///      always yields at least the requested gold.
    function testFuzz_P1_roundTripSufficiency(uint256 g, uint256 p) public view {
        p = bound(p, MIN_PRICE, MAX_PRICE);
        g = bound(g, MIN_GOLD, MAX_GOLD);

        uint256 usdRequired = minter.quoteRequiredUsd(address(usdt), g, p);
        uint256 goldBought = minter.quoteGoldAmount(address(usdt), usdRequired, p);

        assertGe(goldBought, g, "quoted USD must buy at least the requested gold");
    }

    /// P2a — monotonic: at the same price, more USD never yields less gold.
    function testFuzz_P2_monotonicUsd(uint256 u1, uint256 u2, uint256 p) public view {
        p = bound(p, MIN_PRICE, MAX_PRICE);
        u1 = bound(u1, 1e6, 10_000_000e6);
        u2 = bound(u2, u1, 10_000_000e6);

        assertLe(
            minter.quoteGoldAmount(address(usdt), u1, p),
            minter.quoteGoldAmount(address(usdt), u2, p),
            "more USD must never buy less gold"
        );
    }

    /// P2b — monotonic: for the same USD, a higher price never yields more gold.
    function testFuzz_P2_monotonicPrice(uint256 u, uint256 p1, uint256 p2) public view {
        u = bound(u, 1e6, 10_000_000e6);
        p1 = bound(p1, MIN_PRICE, MAX_PRICE);
        p2 = bound(p2, p1, MAX_PRICE);

        assertGe(
            minter.quoteGoldAmount(address(usdt), u, p1),
            minter.quoteGoldAmount(address(usdt), u, p2),
            "higher price must never yield more gold"
        );
    }

    /// P2c — monotonic (redeem): more gold never returns less USD.
    function testFuzz_P2_monotonicRedeem(uint256 g1, uint256 g2, uint256 p) public view {
        p = bound(p, MIN_PRICE, MAX_PRICE);
        g1 = bound(g1, MIN_GOLD, MAX_GOLD);
        g2 = bound(g2, g1, MAX_GOLD);

        assertLe(
            minter.quoteUsdAmount(address(usdt), g1, p),
            minter.quoteUsdAmount(address(usdt), g2, p),
            "more gold must never redeem for less USD"
        );
    }

    /// P3 — fee monotonic (default params): larger amounts never pay less fee.
    ///      Defaults make the boundary continuous (2.5e18 == 1000e18 * 0.25%), so
    ///      monotonicity must hold across the flat->proportional switch.
    function testFuzz_P3_feeMonotone(uint256 a1, uint256 a2) public view {
        a1 = bound(a1, 0, 1_000_000 ether);
        a2 = bound(a2, a1, 1_000_000 ether);

        assertLe(minter.calculateGoldFee(a1, true), minter.calculateGoldFee(a2, true), "mint fee must be monotone");
        assertLe(minter.calculateGoldFee(a1, false), minter.calculateGoldFee(a2, false), "redeem fee must be monotone");
    }

    /// P4 — spread band: redeem payout <= spot <= mint cost.
    ///      The spread never creates negative margin for the treasury in either direction.
    function testFuzz_P4_spreadBand(uint256 g, uint256 p) public view {
        p = bound(p, MIN_PRICE, MAX_PRICE);
        g = bound(g, MIN_GOLD, MAX_GOLD);

        uint256 gramPrice = (p * minter.CONVERSION_PRECISION()) / minter.GRAMS_PER_OUNCE();
        // decimalFactor = 10^(oracle 8 + gold 18 - usd 6) = 1e20
        uint256 spotUsd = (g * gramPrice) / 1e20;

        assertLe(minter.quoteUsdAmount(address(usdt), g, p), spotUsd, "redeem payout must not exceed spot value");
        assertGe(minter.quoteRequiredUsd(address(usdt), g, p), spotUsd, "mint cost must not undercut spot value");
    }
}
