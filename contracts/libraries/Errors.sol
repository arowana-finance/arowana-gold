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
    error NotTradeUnitMultiple();
    error InsufficientUsdAmount();

    // ============ Order Management Errors ============
    error InvalidNonce();
    error AlreadySettled();
    error NotBlocked();
    error MustReturnToOwner();
    error NotExpired();
    error NotOrderOwner();
    error InvalidOrderTTL();

    // ============ Parameter Validation Errors ============
    error Overflow();
    error FeeExceedsMinimum();

    // ============ Access Control Errors ============
    // onlyOwner, onlySettlers errors come from OpenZeppelin's Ownable/AccessControl
    error RenounceDisabled();
    error NotProxyAdmin();

    // ============ Signature Errors ============
    error InvalidSignature();
    error ExpiredSignature();
    error InvalidNonceSignature();
    error ZeroSignature();
    error InsufficientAllowance();

    // ============ Trade Window (business-hours gate) Errors ============
    error TradeWindowClosed(); // block.timestamp outside [validAfter, validBefore]
    error InvalidTradeWindowSigner(); // recovered signer lacks KYC_MANAGER_ROLE
    error TradeWindowNonceUsed(); // unordered nonce already consumed

    // ============ Oracle Errors ============
    error InvalidPrice();
    error PriceOutOfRange();
    error StalePrice();
    error InvalidPriceAge();
    error InvalidOraclePrice();
    error OracleTooStale();
    error PriceChangeTooLarge();

    // ============ Data Streams Errors ============
    error ReportExpired();
    error ReportTooOld();
    error ReportNotYetValid();
    error MarketClosed();
    error StaleReport();
    error InvalidReportFeed();
    error InvalidReportVersion();
    error InvalidReportDecimals();
    error NotGoldMinter();
    error ZeroVerifier();
    error ZeroLinkToken();
    error ZeroFeedId();
    error ZeroGoldMinter();
    error VerifierAlreadySet();

    // ============ Token Errors ============
    error InvalidUSDToken();
}
