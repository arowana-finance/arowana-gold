// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IGoldMinter
 * @dev Interface containing all types and structures used by GoldMinter contracts
 * @notice This interface centralizes all data types for better code organization and reusability
 */
interface IGoldMinter {
    /// @dev Account Level enumeration for KYC status
    enum Levels {
        DEFAULT, // 0 - No KYC verification
        KYCD, // 1 - KYC verified
        APPROVED // 2 - Fully approved for all operations
    }

    /**
     * @dev Structure for mint orders containing all necessary information
     * @param buyer Address of the user requesting gold tokens
     * @param usdToken USDT or USDC token contract address
     * @param usdAmount Amount of USD tokens being exchanged
     * @param minGoldAmount Minimum gold amount the buyer expects to receive
     * @param goldAmount Actual gold amount minted (set after settlement)
     * @param feeAmount Fee amount in gold calculated at request time
     * @param success Whether the order was successfully executed
     * @param isSettled Whether the order has been processed by backend
     */
    struct MintOrder {
        address buyer;
        address usdToken;
        uint256 usdAmount;
        uint256 minGoldAmount;
        uint256 goldAmount;
        uint256 feeAmount;
        bool success;
        bool isSettled;
    }

    /**
     * @dev Structure for burn orders containing all necessary information
     * @param seller Address of the user burning gold tokens
     * @param usdToken USDT or USDC token contract address for payout
     * @param goldAmount Amount of gold tokens being burned
     * @param minUsdAmount Minimum USD amount the seller expects to receive
     * @param usdAmount Actual USD amount paid (set after settlement)
     * @param feeAmount Fee amount in gold calculated at request time
     * @param success Whether the order was successfully executed
     * @param isSettled Whether the order has been processed by backend
     */
    struct BurnOrder {
        address seller;
        address usdToken;
        uint256 goldAmount;
        uint256 minUsdAmount;
        uint256 usdAmount;
        uint256 feeAmount;
        bool success;
        bool isSettled;
    }

    /**
     * @dev EIP-712 structure for KYC mint requests with signature verification
     * @param user Address of the user requesting mint operation
     * @param kycLevel KYC verification level being assigned
     * @param nonce Unique number to prevent replay attacks
     * @param deadline Timestamp after which the signature expires
     * @param usdToken USDT or USDC token contract address
     * @param usdAmount Amount of USD tokens to be exchanged
     * @param minGoldAmount Minimum gold amount expected by user
     */
    struct KYCMintRequest {
        address user;
        uint8 kycLevel;
        uint256 nonce;
        uint256 deadline;
        address usdToken;
        uint256 usdAmount;
        uint256 minGoldAmount;
    }

    /**
     * @dev EIP-712 structure for KYC burn requests with signature verification
     * @param user Address of the user requesting burn operation
     * @param kycLevel KYC verification level being assigned
     * @param nonce Unique number to prevent replay attacks
     * @param deadline Timestamp after which the signature expires
     * @param usdToken USDT or USDC token contract address for payout
     * @param goldAmount Amount of gold tokens to be burned
     * @param minUsdAmount Minimum USD amount expected by user
     */
    struct KYCBurnRequest {
        address user;
        uint8 kycLevel;
        uint256 nonce;
        uint256 deadline;
        address usdToken;
        uint256 goldAmount;
        uint256 minUsdAmount;
    }
}
