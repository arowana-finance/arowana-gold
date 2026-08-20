// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { GoldMinter } from "../GoldMinter.sol";
import { IGoldMinter } from "../interfaces/IGoldMinter.sol";
import { IERC20Exp, IERC20Mintable } from "../interfaces/IERC20.sol";
import { MinterShared } from "./MinterShared.sol";
import { Errors } from "./Errors.sol";

/// @title MintLogic
/// @notice GoldMinter mint-side core logic (storage-pointer library, delegatecalled).
///         storage-pointer external library — same conventions as BurnLogic (storage
///         lives in the proxy, guards are on the GoldMinter entry points, events are
///         `emit GoldMinter.X`).
/// @dev Includes the mint-side implementation of order TTL + self-cancel.
library MintLogic {
    using SafeERC20 for IERC20Exp;
    using SafeERC20 for IERC20Mintable;

    /// @dev Handle a mint request (records requestTime).
    ///      tradeUnit > 0 (unit mode): _minGoldAmount = gross gold (tradeUnit multiple),
    ///      _usdAmount = maximum USD willing to pay. tradeUnit == 0 (free mode): prior behavior.
    function requestMint(
        GoldMinter.GoldMinterStorage storage $,
        address _usdToken,
        uint256 _usdAmount,
        uint256 _minGoldAmount,
        bytes calldata report
    ) external {
        // Eligibility gate FIRST — fail fast with the explicit AMLBlocked/
        // Underlevel error before the expensive verifier call. This is gas/error
        // hygiene, NOT LINK protection: a reverting request rolls back the LINK
        // fee transfer too (EVM atomicity). LINK drain is prevented by the
        // verifier's onlyGoldMinter gate and the minimum order sizes.
        MinterShared.validateUserPermissions($, $.tradeLevel);

        // Lock the gold price at request time from a verified Data Streams report.
        uint256 price8 = MinterShared.priceFromReportOunce($, report);

        uint256 tradeUnit_ = $.tradeUnit;

        uint256 expectedOutput;
        uint256 feeAmount;
        uint256 actualUsdAmount;

        if (tradeUnit_ > 0) {
            // ── TradeUnit mode: gross gold is fixed to _minGoldAmount (must be tradeUnit multiple) ──
            MinterShared.validateTradeUnit(_minGoldAmount, tradeUnit_);

            expectedOutput = _minGoldAmount; // gross gold = exact tradeUnit multiple
            feeAmount = MinterShared.calculateGoldFee($, expectedOutput, true);

            MinterShared.validateMinimumAmount(expectedOutput, $.minMintAmount);

            // Calculate required USD (inverse of quoteGoldAmount, with ceiling)
            actualUsdAmount = MinterShared.quoteRequiredUsd($, _usdToken, expectedOutput, price8);
            if (actualUsdAmount > _usdAmount) revert Errors.InsufficientUsdAmount();
        } else {
            // ── Free mode ──
            uint16 slippage_ = $.slippage;

            expectedOutput = MinterShared.quoteGoldAmount($, _usdToken, _usdAmount, price8);
            feeAmount = MinterShared.calculateGoldFee($, expectedOutput, true);

            // Validate size BEFORE subtracting the fee (explicit SmallAmount, not Panic 0x11).
            MinterShared.validateMinimumAmount(expectedOutput, $.minMintAmount);
            if (feeAmount > expectedOutput) revert Errors.SmallAmount();
            MinterShared.validateSlippage(expectedOutput - feeAmount, _minGoldAmount, slippage_);

            actualUsdAmount = _usdAmount;
        }

        IERC20Exp usdToken = MinterShared.getUSDToken($, _usdToken);

        uint256 mintNonce = $.mintOrders.length;

        uint256 storedMinGoldAmount = tradeUnit_ > 0 ? expectedOutput - feeAmount : _minGoldAmount;

        $.mintOrders
            .push(
                IGoldMinter.MintOrder({
                    buyer: msg.sender,
                    usdToken: address(usdToken),
                    usdAmount: actualUsdAmount,
                    minGoldAmount: storedMinGoldAmount,
                    goldAmount: expectedOutput,
                    feeAmount: feeAmount,
                    success: false,
                    isSettled: false
                })
            );

        $.userMintNonces[msg.sender].push(mintNonce);
        // Always count the order as pending here; settle (CEI) decrements it.
        $.userPendingMintCount[msg.sender]++;
        // Record request time for the TTL escape hatch.
        $.mintRequestTime[mintNonce] = uint64(block.timestamp);

        emit GoldMinter.RequestMint(mintNonce, msg.sender, address(usdToken), actualUsdAmount, storedMinGoldAmount);

        // Escrow the buyer's USD in THIS contract until settlement (refunds/resolves
        // never depend on a standing usdRecipient approval).
        // USD accounting assumes a zero fee-on-transfer token.
        usdToken.safeTransferFrom(msg.sender, address(this), actualUsdAmount);

        if ($.autoSettle) {
            _settle($, mintNonce, expectedOutput);
        }
    }

    /// @dev Settle the stored, finalized amount.
    function settleMint(GoldMinter.GoldMinterStorage storage $, uint256 mintNonce) external {
        if (mintNonce >= $.mintOrders.length) revert Errors.InvalidNonce();

        // Use gold amount calculated at request time
        uint256 goldAmount = $.mintOrders[mintNonce].goldAmount;
        _settle($, mintNonce, goldAmount);
    }

    /// @dev mint settlement core — the refund branch is kept intact as the
    ///      dead-branch defense line for the settlement invariant.
    function _settle(GoldMinter.GoldMinterStorage storage $, uint256 mintNonce, uint256 goldAmount) private {
        if (mintNonce >= $.mintOrders.length) revert Errors.InvalidNonce();
        if ($.mintOrders[mintNonce].isSettled) revert Errors.AlreadySettled();
        address buyer_ = $.mintOrders[mintNonce].buyer;
        MinterShared.validateSettlementPermissions($, buyer_);

        uint256 feeAmount = $.mintOrders[mintNonce].feeAmount;
        uint256 netGoldAmount = goldAmount - feeAmount;
        bool success = netGoldAmount >= $.mintOrders[mintNonce].minGoldAmount;

        // The buyer's USD is escrowed in this contract (see requestMint).
        (IERC20Exp usdToken, uint256 usdAmount) =
            (IERC20Exp($.mintOrders[mintNonce].usdToken), $.mintOrders[mintNonce].usdAmount);

        $.mintOrders[mintNonce].success = success;
        $.mintOrders[mintNonce].isSettled = true;
        if (success) {
            $.mintOrders[mintNonce].goldAmount = goldAmount;
        }
        if ($.userPendingMintCount[buyer_] > 0) {
            $.userPendingMintCount[buyer_]--;
        }

        // Both paths move USD from THIS contract's escrow balance.
        if (!success) {
            // Refund the escrowed USD to the buyer.
            usdToken.safeTransfer(buyer_, usdAmount);
        } else {
            // Mint gold, then forward the escrowed USD on to the treasury.
            $.goldToken.mint($.feeRecipient, feeAmount);
            $.goldToken.mint(buyer_, netGoldAmount);
            usdToken.safeTransfer($.usdRecipient, usdAmount);
        }

        emit GoldMinter.SettleMint(mintNonce, goldAmount, feeAmount, success);
    }

    /// @dev Compliance policy is enforced in code (not settler discretion):
    ///      under-level (innocent) -> refund, sanctioned -> retained by treasury.
    function resolveBlockedMint(GoldMinter.GoldMinterStorage storage $, uint256 mintNonce) external {
        if (mintNonce >= $.mintOrders.length) revert Errors.InvalidNonce();
        IGoldMinter.MintOrder storage order = $.mintOrders[mintNonce];
        if (order.isSettled) revert Errors.AlreadySettled();
        address buyer_ = order.buyer;
        // Only genuinely-trapped orders may be resolved (settler cannot touch a healthy order).
        if (!MinterShared.settlementBlocked($, buyer_)) revert Errors.NotBlocked();
        // Policy enforced in code: under-level -> refund, sanctioned -> retain.
        bool refund = !MinterShared.isAmlBlocked($, buyer_);

        (IERC20Exp usdToken, uint256 usdAmount) = (IERC20Exp(order.usdToken), order.usdAmount);
        order.success = false;
        order.isSettled = true;
        if ($.userPendingMintCount[buyer_] > 0) {
            $.userPendingMintCount[buyer_]--;
        }

        // USD is escrowed in this contract, so both outcomes move from this balance.
        if (refund) {
            usdToken.safeTransfer(buyer_, usdAmount);
        } else {
            usdToken.safeTransfer($.usdRecipient, usdAmount);
        }

        emit GoldMinter.ResolveMint(mintNonce, buyer_, refund, refund ? usdAmount : 0);
    }

    /// @dev Owner self-cancel of an unsettled mint order whose TTL has elapsed.
    ///      Effect is identical to a failed settlement (refund of the escrowed USD).
    ///      Blocked users may use the resolve path only.
    function cancelExpiredMint(GoldMinter.GoldMinterStorage storage $, uint256 mintNonce) external {
        if (mintNonce >= $.mintOrders.length) revert Errors.InvalidNonce();
        IGoldMinter.MintOrder storage order = $.mintOrders[mintNonce];
        if (order.isSettled) revert Errors.AlreadySettled();
        address buyer_ = order.buyer;
        if (msg.sender != buyer_) revert Errors.NotOrderOwner();
        MinterShared.validateSettlementPermissions($, buyer_);
        MinterShared.validateCancelWindow($, $.mintRequestTime[mintNonce]);

        (IERC20Exp usdToken, uint256 usdAmount) = (IERC20Exp(order.usdToken), order.usdAmount);
        order.success = false;
        order.isSettled = true;
        if ($.userPendingMintCount[buyer_] > 0) {
            $.userPendingMintCount[buyer_]--;
        }

        usdToken.safeTransfer(buyer_, usdAmount);

        emit GoldMinter.CancelMint(mintNonce, buyer_, usdAmount);
    }
}
