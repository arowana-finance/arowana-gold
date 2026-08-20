// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { GoldMinter } from "../GoldMinter.sol";
import { IGoldMinter } from "../interfaces/IGoldMinter.sol";
import { IERC20Exp, IERC20Mintable } from "../interfaces/IERC20.sol";
import { MinterShared } from "./MinterShared.sol";
import { Errors } from "./Errors.sol";

/// @title BurnLogic
/// @notice GoldMinter burn-side core logic (storage-pointer library, delegatecalled).
///         storage-pointer external library: storage stays in the proxy and only the
///         code lives here. Because it runs via delegatecall, msg.sender/address(this)
///         remain the GoldMinter proxy context, and events too are emitted from the
///         proxy address (`emit GoldMinter.X`).
/// @dev Guards (nonReentrant/whenNotPaused/onlyRole) are held by the GoldMinter entry
///      points. Includes the burn-side implementation of order TTL + self-cancel.
library BurnLogic {
    using SafeERC20 for IERC20Exp;
    using SafeERC20 for IERC20Mintable;

    /// @dev Handle a burn request (records requestTime).
    function requestBurn(
        GoldMinter.GoldMinterStorage storage $,
        address _usdToken,
        uint256 _goldAmount,
        uint256 _minUsdAmount,
        bytes calldata report
    ) external {
        // Eligibility gate FIRST — fail fast before the expensive verifier call
        // (gas/error hygiene, not LINK protection; see MintLogic.requestMint).
        MinterShared.validateUserPermissions($, $.tradeLevel);

        // Lock the gold price at request time from a verified Data Streams report.
        uint256 price8 = MinterShared.priceFromReportOunce($, report);

        // TradeUnit validation: goldAmount must be a multiple of tradeUnit
        uint256 tradeUnit_ = $.tradeUnit;
        if (tradeUnit_ > 0) MinterShared.validateTradeUnit(_goldAmount, tradeUnit_);

        uint16 slippage_ = $.slippage;

        // Calculate expected USD after fee deduction at request time
        uint256 feeAmount = MinterShared.calculateGoldFee($, _goldAmount, false);

        // Validate size BEFORE subtracting the fee (explicit SmallAmount, not Panic 0x11).
        MinterShared.validateMinimumAmount(_goldAmount, $.minRedeemAmount);
        if (feeAmount > _goldAmount) revert Errors.SmallAmount();

        uint256 expectedOutput = MinterShared.quoteUsdAmount($, _usdToken, _goldAmount - feeAmount, price8);

        // Validate slippage on the post-fee USD output
        MinterShared.validateSlippage(expectedOutput, _minUsdAmount, slippage_);

        IERC20Exp usdToken = MinterShared.getUSDToken($, _usdToken);

        uint256 burnNonce = $.burnOrders.length;

        $.burnOrders
            .push(
                IGoldMinter.BurnOrder({
                    seller: msg.sender,
                    usdToken: address(usdToken),
                    goldAmount: _goldAmount,
                    minUsdAmount: _minUsdAmount,
                    usdAmount: expectedOutput,
                    feeAmount: feeAmount,
                    success: false,
                    isSettled: false
                })
            );

        $.userBurnNonces[msg.sender].push(burnNonce);
        // Always count the order as pending here; settle (CEI) decrements it.
        $.userPendingBurnCount[msg.sender]++;
        // Record request time for the TTL escape hatch.
        $.burnRequestTime[burnNonce] = uint64(block.timestamp);

        emit GoldMinter.RequestBurn(burnNonce, msg.sender, address(usdToken), _goldAmount, _minUsdAmount);

        $.goldToken.safeTransferFrom(msg.sender, address(this), _goldAmount);

        if ($.autoSettle && MinterShared.canBurn($, usdToken, expectedOutput)) {
            _settle($, burnNonce, expectedOutput);
        }
    }

    /// @dev Settle the stored, finalized amount.
    function settleBurn(GoldMinter.GoldMinterStorage storage $, uint256 burnNonce) external {
        if (burnNonce >= $.burnOrders.length) revert Errors.InvalidNonce();

        // Use USD amount calculated at request time
        uint256 usdAmount = $.burnOrders[burnNonce].usdAmount;
        _settle($, burnNonce, usdAmount);
    }

    /// @dev burn settlement core.
    function _settle(GoldMinter.GoldMinterStorage storage $, uint256 burnNonce, uint256 usdAmount) private {
        if (burnNonce >= $.burnOrders.length) revert Errors.InvalidNonce();
        if ($.burnOrders[burnNonce].isSettled) revert Errors.AlreadySettled();
        address seller_ = $.burnOrders[burnNonce].seller;
        MinterShared.validateSettlementPermissions($, seller_);

        IERC20Exp usdToken = IERC20Exp($.burnOrders[burnNonce].usdToken);
        uint256 goldAmount = $.burnOrders[burnNonce].goldAmount;

        uint256 feeAmount = $.burnOrders[burnNonce].feeAmount;
        bool success = usdAmount >= $.burnOrders[burnNonce].minUsdAmount && MinterShared.canBurn($, usdToken, usdAmount);

        $.burnOrders[burnNonce].success = success;
        $.burnOrders[burnNonce].isSettled = true;
        if ($.userPendingBurnCount[seller_] > 0) {
            $.userPendingBurnCount[seller_]--;
        }

        if (!success) {
            $.goldToken.safeTransfer(seller_, goldAmount);
        } else {
            $.goldToken.burn(goldAmount - feeAmount);
            $.goldToken.safeTransfer($.feeRecipient, feeAmount);
            usdToken.safeTransferFrom($.usdRecipient, seller_, usdAmount);
        }

        emit GoldMinter.SettleBurn(burnNonce, usdAmount, feeAmount, success);
    }

    /// @dev Compliance policy is enforced in code (not settler discretion).
    function resolveBlockedBurn(GoldMinter.GoldMinterStorage storage $, uint256 burnNonce, address to) external {
        if (burnNonce >= $.burnOrders.length) revert Errors.InvalidNonce();
        if (to == address(0)) revert Errors.ZeroRecipient();
        IGoldMinter.BurnOrder storage order = $.burnOrders[burnNonce];
        if (order.isSettled) revert Errors.AlreadySettled();
        address seller_ = order.seller;
        if (!MinterShared.settlementBlocked($, seller_)) revert Errors.NotBlocked();
        // Policy enforced in code, not left to settler discretion:
        //   - sanctioned (AML) seller  -> gold is seized to a compliance/treasury `to`;
        //   - under-level (non-sanctioned) seller -> gold can ONLY be returned to them.
        if (MinterShared.isAmlBlocked($, seller_)) {
            if (to == seller_) revert Errors.AMLBlocked();
        } else if (to != seller_) {
            revert Errors.MustReturnToOwner();
        }

        uint256 goldAmount = order.goldAmount;
        order.success = false;
        order.isSettled = true;
        if ($.userPendingBurnCount[seller_] > 0) {
            $.userPendingBurnCount[seller_]--;
        }

        $.goldToken.safeTransfer(to, goldAmount);

        emit GoldMinter.ResolveBurn(burnNonce, seller_, to, goldAmount);
    }

    /// @dev Owner self-cancel of an unsettled burn order whose TTL has elapsed.
    ///      Escape hatch when no settler is present: effect is identical to a failed
    ///      settlement (return of the escrowed gold).
    ///      Blocked users (sanctioned/under-level) cannot use it — only the existing
    ///      resolve path (prevents a compliance bypass).
    function cancelExpiredBurn(GoldMinter.GoldMinterStorage storage $, uint256 burnNonce) external {
        if (burnNonce >= $.burnOrders.length) revert Errors.InvalidNonce();
        IGoldMinter.BurnOrder storage order = $.burnOrders[burnNonce];
        if (order.isSettled) revert Errors.AlreadySettled();
        address seller_ = order.seller;
        if (msg.sender != seller_) revert Errors.NotOrderOwner();
        MinterShared.validateSettlementPermissions($, seller_);
        MinterShared.validateCancelWindow($, $.burnRequestTime[burnNonce]);

        uint256 goldAmount = order.goldAmount;
        order.success = false;
        order.isSettled = true;
        if ($.userPendingBurnCount[seller_] > 0) {
            $.userPendingBurnCount[seller_]--;
        }

        $.goldToken.safeTransfer(seller_, goldAmount);

        emit GoldMinter.CancelBurn(burnNonce, seller_, goldAmount);
    }
}
