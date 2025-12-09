// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Errors
 * @dev Centralized error definitions for the Gold Minter system
 */
library Errors {
    // ============ Initialization Errors ============
    error ZeroGoldToken();
    error ZeroUSDT();
    error ZeroUSDC();
    error ZeroPriceFeed();
    error ZeroRecipient();
    error ZeroOwner();
    error ZeroUSDRecipient();

    // ============ Trading Errors ============
    error Underpriced();
    error SmallAmount();
    error Underlevel();
    error AMLBlocked();

    // ============ Order Management Errors ============
    error InvalidNonce();
    error AlreadySettled();

    // ============ Parameter Validation Errors ============
    error Overflow();

    // ============ Access Control Errors ============
    // Note: onlyOwner, onlySettlers errors are handled by OpenZeppelin's Ownable/AccessControl

    // ============ Signature Errors ============
    error InvalidSignature();
    error ExpiredSignature();
    error InvalidNonceSignature();
	error ZeroSignature();

    // ============ Oracle Errors ============
    error InvalidPrice();
    error PriceOutOfRange();
    error StalePrice();
	error InvalidPriceAge();

    // ============ Token Errors ============
    error InvalidUSDToken();
}
