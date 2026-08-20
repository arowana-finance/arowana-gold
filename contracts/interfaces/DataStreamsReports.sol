// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Asset {
    address assetAddress;
    uint256 amount;
}

/// @dev RWA Standard report schema (v8, feedId prefix 0x0008). The gold (XAU/USD)
///      stream uses this. midPrice/marketStatus are authoritative.
struct ReportV8 {
    bytes32 feedId;
    uint32 validFromTimestamp;
    uint32 observationsTimestamp;
    uint192 nativeFee;
    uint192 linkFee;
    uint32 expiresAt;
    uint64 lastUpdateTimestamp;
    int192 midPrice;
    uint32 marketStatus;
}

/// @dev Crypto report schema (v3, feedId prefix 0x0003). No market status — crypto
///      trades 24/7. Supported so the SAME contract can be fork-tested on Sepolia
///      against a real crypto stream (e.g. ETH/USD) before the gold v8 stream is
///      provisioned, and as a fallback for crypto-collateral deployments.
struct ReportV3 {
    bytes32 feedId;
    uint32 validFromTimestamp;
    uint32 observationsTimestamp;
    uint192 nativeFee;
    uint192 linkFee;
    uint32 expiresAt;
    int192 price;
    int192 bid;
    int192 ask;
}
