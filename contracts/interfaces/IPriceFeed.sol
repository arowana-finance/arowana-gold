// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPriceFeed {
    function latestRound() external view returns (uint256);

    function latestAnswer() external view returns (int256);

    function getTokenType() external pure returns (uint256);

    function decimals() external pure returns (uint8);
}
