// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { GoldMinter } from "../GoldMinter.sol";
import { IGoldMinter } from "../interfaces/IGoldMinter.sol";
import { IERC20Exp } from "../interfaces/IERC20.sol";
import { IBlacklistOracle } from "../interfaces/IBlacklistOracle.sol";
import { Errors } from "./Errors.sol";

/// @title MinterShared
/// @notice Helper shared by MintLogic/BurnLogic/GoldMinter.
///         An **internal library**, so it is inlined into each consumer without a
///         separate deployment (single source of truth; bytecode is duplicated per
///         consumer — harmless, since each has its own 24KB limit).
/// @dev Every function operates on GoldMinter's EIP-7201 storage pointer.
library MinterShared {
    // Unit conversion constants (8 decimals matches Oracle precision).
    // GoldMinter's public constant re-exposes this value — single source of truth.
    uint256 internal constant GRAMS_PER_OUNCE = 3110347680; // 31.1034768 * 1e8
    uint256 internal constant CONVERSION_PRECISION = 1e8;

    // Oracle sanity band — a second line of defense if the verifier is compromised.
    // Promoted from a storage value (no setter) to a compile-time constant → raising the
    // value now ships as an upgrade (the old field is a dead slot), and dropping the
    // SLOAD also shrinks code size.
    // Ceiling raised 10,000 → 20,000 /oz to recover the headroom eroded by rising gold prices.
    uint256 internal constant MIN_GOLD_PRICE = 500e8; // $500/oz
    uint256 internal constant MAX_GOLD_PRICE = 20_000e8; // $20,000/oz

    // ============ Eligibility / settlement gates ============

    function validateUserPermissions(GoldMinter.GoldMinterStorage storage $, IGoldMinter.Levels requiredLevel)
        internal
        view
    {
        if ($.levels[msg.sender] < uint256(requiredLevel)) revert Errors.Underlevel();
        if ($.amlBlacklist[msg.sender]) revert Errors.AMLBlocked();
        IBlacklistOracle oracle = $.goldToken.blacklistOracle();
        if (address(oracle) != address(0) && oracle.isBlacklisted(msg.sender)) revert Errors.AMLBlocked();
    }

    function isAmlBlocked(GoldMinter.GoldMinterStorage storage $, address user) internal view returns (bool) {
        if ($.amlBlacklist[user]) return true;
        IBlacklistOracle oracle = $.goldToken.blacklistOracle();
        return address(oracle) != address(0) && oracle.isBlacklisted(user);
    }

    function settlementBlocked(GoldMinter.GoldMinterStorage storage $, address user) internal view returns (bool) {
        if (isAmlBlocked($, user)) return true;
        return uint8($.tradeLevel) > 0 && $.levels[user] < uint8($.tradeLevel);
    }

    function validateSettlementPermissions(GoldMinter.GoldMinterStorage storage $, address user) internal view {
        if (isAmlBlocked($, user)) revert Errors.AMLBlocked();
        if (uint8($.tradeLevel) > 0 && $.levels[user] < uint8($.tradeLevel)) revert Errors.Underlevel();
    }

    // ============ Oracle ============

    /// @dev Verify a Data Streams report and return the validated 8-decimal ounce price.
    ///      State-changing (the verifier pays the LINK fee). Freshness/market-open are
    ///      enforced inside the verifier; ounce sanity bounds are applied here.
    ///      Called via delegatecall from logic libraries, so address(this) is the
    ///      GoldMinter proxy — the verifier's onlyGoldMinter gate is unaffected.
    function priceFromReportOunce(GoldMinter.GoldMinterStorage storage $, bytes calldata report)
        internal
        returns (uint256 price8)
    {
        (price8,,,) = $.goldStreamVerifier.verifyAndGetPrice(report);

        if (price8 == 0) revert Errors.InvalidPrice();
        if (price8 < MIN_GOLD_PRICE || price8 > MAX_GOLD_PRICE) {
            revert Errors.PriceOutOfRange();
        }
    }

    // ============ Validation ============

    function validateSlippage(uint256 expectedOutput, uint256 minAmount, uint16 slippage_) internal pure {
        if (!(expectedOutput >= minAmount && minAmount >= ((expectedOutput * (10000 - slippage_)) / 10000))) {
            revert Errors.Underpriced();
        }
    }

    function validateMinimumAmount(uint256 amount, uint256 minRequired) internal pure {
        if (amount < minRequired) revert Errors.SmallAmount();
    }

    function validateTradeUnit(uint256 amount, uint256 tradeUnit_) internal pure {
        if (amount == 0 || amount % tradeUnit_ != 0) revert Errors.NotTradeUnitMultiple();
    }

    function getUSDToken(GoldMinter.GoldMinterStorage storage $, address usdToken) internal view returns (IERC20Exp) {
        if (usdToken == address($.USDT)) return $.USDT;
        if (usdToken == address($.USDC)) return $.USDC;
        revert Errors.InvalidUSDToken();
    }

    // ============ Math (ounce-based 8-dec convention) ============

    function convertOunceToGramPrice(uint256 ouncePrice) internal pure returns (uint256) {
        return (ouncePrice * CONVERSION_PRECISION) / GRAMS_PER_OUNCE;
    }

    /// @dev Oracle decimals fixed at 8 (Data Streams price scaled by the verifier).
    function getTokenDecimals(GoldMinter.GoldMinterStorage storage $)
        internal
        view
        returns (uint8 goldDecimals, uint8 usdtDecimals, uint8 usdcDecimals, uint8 oracleDecimals)
    {
        return ($.goldToken.decimals(), $.USDT.decimals(), $.USDC.decimals(), 8);
    }

    function mintCalc(GoldMinter.GoldMinterStorage storage $, address usdToken, uint256 price8)
        internal
        view
        returns (uint256 spreadAdjustedPrice, uint256 decimalFactor)
    {
        uint256 gramPrice = convertOunceToGramPrice(price8);
        (uint8 goldDecimals,,, uint8 oracleDecimals) = getTokenDecimals($);
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();
        spreadAdjustedPrice = (gramPrice * (10000 + $.mintSpread)) / 10000;
        decimalFactor = 10 ** (oracleDecimals + goldDecimals - usdDecimals);
    }

    function quoteGoldAmount(
        GoldMinter.GoldMinterStorage storage $,
        address usdToken,
        uint256 usdAmount,
        uint256 price8
    ) internal view returns (uint256) {
        (uint256 spreadAdjustedPrice, uint256 decimalFactor) = mintCalc($, usdToken, price8);
        return (usdAmount * decimalFactor) / spreadAdjustedPrice;
    }

    function quoteRequiredUsd(
        GoldMinter.GoldMinterStorage storage $,
        address usdToken,
        uint256 goldAmount,
        uint256 price8
    ) internal view returns (uint256) {
        (uint256 spreadAdjustedPrice, uint256 decimalFactor) = mintCalc($, usdToken, price8);
        // Ceiling division: ensures enough USD to cover goldAmount
        return (goldAmount * spreadAdjustedPrice + decimalFactor - 1) / decimalFactor;
    }

    function quoteUsdAmount(
        GoldMinter.GoldMinterStorage storage $,
        address usdToken,
        uint256 goldAmount,
        uint256 price8
    ) internal view returns (uint256) {
        uint256 gramPrice = convertOunceToGramPrice(price8);
        (uint8 goldDecimals,,, uint8 oracleDecimals) = getTokenDecimals($);
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();

        // Apply redeemSpread: price decreases by redeemSpread% (user gets less USD)
        uint256 spreadAdjustedPrice = (gramPrice * (10000 - $.redeemSpread)) / 10000;

        return (goldAmount * spreadAdjustedPrice) / 10 ** (oracleDecimals + goldDecimals - usdDecimals);
    }

    function calculateGoldFee(GoldMinter.GoldMinterStorage storage $, uint256 _goldAmount, bool isMint)
        internal
        view
        returns (uint256)
    {
        uint256 minGoldFeeAmount_ = $.minGoldFeeAmount;
        uint256 minGoldFee_ = $.minGoldFee;
        uint16 fee = isMint ? $.mintFee : $.redeemFee;

        if (_goldAmount < minGoldFeeAmount_) {
            return minGoldFee_;
        }
        return (_goldAmount * fee) / 10000;
    }

    function canBurn(GoldMinter.GoldMinterStorage storage $, IERC20Exp usdToken, uint256 usdAmount)
        internal
        view
        returns (bool)
    {
        return usdToken.balanceOf($.usdRecipient) >= usdAmount
            && usdToken.allowance($.usdRecipient, address(this)) >= usdAmount;
    }

    // ============ cancel gate ============

    /// @dev Shared gate for cancelExpired*: TTL active (0 forbidden — blocks the mishap of
    ///      orders being cancelled immediately while unset right after an upgrade) + no
    ///      retroactive cancel of legacy orders (requestTime==0) + TTL elapsed.
    function validateCancelWindow(GoldMinter.GoldMinterStorage storage $, uint64 requestTime) internal view {
        uint64 ttl = $.orderTTL;
        if (ttl == 0 || requestTime == 0) revert Errors.NotExpired();
        if (block.timestamp <= uint256(requestTime) + ttl) revert Errors.NotExpired();
    }
}
