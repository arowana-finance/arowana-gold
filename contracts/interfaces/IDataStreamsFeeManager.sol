// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Asset } from "./DataStreamsReports.sol";

/// @notice Minimal Chainlink Data Streams FeeManager interface.
/// @dev Declared locally because the upstream llo-feeds source pins an exact
///      solc 0.8.19 pragma incompatible with this project's 0.8.28.
interface IDataStreamsFeeManager {
    function getFeeAndReward(address subscriber, bytes memory report, address quoteAddress)
        external
        returns (Asset memory fee, Asset memory reward, uint256 totalDiscount);

    function i_linkAddress() external view returns (address);

    function i_rewardManager() external view returns (address);
}
