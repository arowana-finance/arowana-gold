// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ECDSA } from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import { MessageHashUtils } from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import { IGoldMinter } from "../interfaces/IGoldMinter.sol";
import { IERC20Exp } from "../interfaces/IERC20.sol";
import { SigLib } from "./SigLib.sol";
import { Errors } from "./Errors.sol";

/// @title GoldMinterLib
/// @notice **stateless** logic to free up EIP-170 code size in GoldMinter:
///         KYC EIP-712 signer recovery + permit preprocessing.
/// @dev As an external library, GoldMinter runs it via delegatecall, but this library
///      never reads or writes caller storage at all (args → return value + external
///      token calls only). On the GoldMinter side an `@custom:oz-upgrades-unsafe-allow external-library-linking`
///      approval is applied — being stateless, it has no effect on upgrade safety.
library GoldMinterLib {
    using SigLib for bytes;

    /// @dev Must match GoldMinter.KYC_MINT_REQUEST_TYPEHASH. The EIP-712 type string is a
    ///      compatibility contract with off-chain signers, so it is frozen — update both
    ///      sides together if it changes.
    bytes32 internal constant KYC_MINT_REQUEST_TYPEHASH = keccak256(
        "KYCMintRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 usdAmount,uint256 minGoldAmount)"
    );

    /// @dev Must match GoldMinter.KYC_BURN_REQUEST_TYPEHASH (same freeze rule as above).
    bytes32 internal constant KYC_BURN_REQUEST_TYPEHASH = keccak256(
        "KYCBurnRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 goldAmount,uint256 minUsdAmount)"
    );

    /// @dev Must match GoldMinter.TRADE_WINDOW_TYPEHASH (same freeze rule as above).
    ///      Business-hours gate: field order is frozen as a contract with off-chain signers.
    bytes32 internal constant TRADE_WINDOW_TYPEHASH =
        keccak256("TradeWindow(address user,uint64 validAfter,uint64 validBefore,uint256 nonce)");

    /// @notice Recover the EIP-712 signer of a KYC mint request (role checks are GoldMinter's responsibility).
    function recoverMintSigner(
        bytes32 domainSeparator,
        IGoldMinter.KYCMintRequest memory request,
        bytes memory signature
    ) external pure returns (address) {
        bytes32 structHash = keccak256(
            abi.encode(
                KYC_MINT_REQUEST_TYPEHASH,
                request.user,
                request.kycLevel,
                request.nonce,
                request.deadline,
                request.usdToken,
                request.usdAmount,
                request.minGoldAmount
            )
        );
        return ECDSA.recover(MessageHashUtils.toTypedDataHash(domainSeparator, structHash), signature);
    }

    /// @notice Recover the EIP-712 signer of a KYC burn request (role checks are GoldMinter's responsibility).
    function recoverBurnSigner(
        bytes32 domainSeparator,
        IGoldMinter.KYCBurnRequest memory request,
        bytes memory signature
    ) external pure returns (address) {
        bytes32 structHash = keccak256(
            abi.encode(
                KYC_BURN_REQUEST_TYPEHASH,
                request.user,
                request.kycLevel,
                request.nonce,
                request.deadline,
                request.usdToken,
                request.goldAmount,
                request.minUsdAmount
            )
        );
        return ECDSA.recover(MessageHashUtils.toTypedDataHash(domainSeparator, structHash), signature);
    }

    /// @notice Recover the EIP-712 signer of a trade window (role/time/nonce checks are GoldMinter's responsibility).
    function recoverTradeWindowSigner(
        bytes32 domainSeparator,
        IGoldMinter.TradeWindow memory window,
        bytes memory signature
    ) external pure returns (address) {
        bytes32 structHash = keccak256(
            abi.encode(TRADE_WINDOW_TYPEHASH, window.user, window.validAfter, window.validBefore, window.nonce)
        );
        return ECDSA.recover(MessageHashUtils.toTypedDataHash(domainSeparator, structHash), signature);
    }

    /// @notice permit preprocessing — front-running resistant.
    /// @dev permit()'s nonce may already have been consumed by a mempool front-run, so the
    ///      failure is ignored and the final decision is made from allowance. If already
    ///      approved, proceed; otherwise, an explicit error.
    function ensurePermit(
        address token,
        address owner,
        address spender,
        uint256 amount,
        uint256 deadline,
        bytes memory permitSignature
    ) external {
        (uint8 v, bytes32 r, bytes32 s) = permitSignature.toVRS();
        try IERC20Exp(token).permit(owner, spender, amount, deadline, v, r, s) { } catch { }
        if (IERC20Exp(token).allowance(owner, spender) < amount) revert Errors.InsufficientAllowance();
    }
}
