// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { DataFeed } from './DataFeed.sol';
import { BaseFunctionsConsumer } from './BaseFunctionsConsumer.sol';

/**
 * AGT Reserve Oracle powered by Chainlink Functions
 */
contract AGTReserveFeed is DataFeed, BaseFunctionsConsumer {
    uint64 public updateInterval;

    /**
     * @dev For custom chainlink interval updates
     */
    function _checkUpkeepCondition() internal view override returns (bool) {
        // Apply rate limits from chainlink
        if (!super._checkUpkeepCondition()) {
            return false;
        }

        if (block.timestamp < (latestTimestamp + uint256(updateInterval))) {
            return false;
        }

        return true;
    }

    function initializeAGTReserveFeed(
        address _initOwner,
        address _asset,
        string memory _description,
        address _router,
        address _upkeepContract,
        uint64 _upkeepInterval,
        uint64 _upkeepRateInterval,
        uint64 _upkeepRateCap,
        uint64 _maxBaseGasPrice,
        uint64 _updateInterval
    ) public virtual initializer {
        setInterval(_updateInterval);
        setUpkeep(_upkeepContract, _upkeepInterval, _upkeepRateInterval, _upkeepRateCap, _maxBaseGasPrice);
        _initializeConsumer(address(0), _router);
        _initializeFeed(_initOwner, _asset, _description);
    }

    function setInterval(uint64 _updateInterval) public onlyOwner {
        updateInterval = _updateInterval;
    }

    function handleResponse(bytes memory response) internal override {
        uint64[] memory nums = splitBytes(response);
        uint arrayLen = nums.length / 2;

        for (uint i; i < arrayLen; ++i) {
            uint64 answer = nums[i * 2];
            uint64 timestamp = nums[i * 2 + 1];
            int256 answerEncoded = int256(uint256(answer));

            if (getTimestampAnswer[uint256(timestamp)] == answerEncoded) {
                continue;
            }

            _updateAnswer(answerEncoded, latestRound + 1, uint256(timestamp));
        }
    }

    function splitBytes(bytes memory data) internal pure returns (uint64[] memory) {
        require(data.length % 8 == 0, 'Data length must be divisible by chunk size');

        uint256 numChunks = data.length / 8;
        uint64[] memory result = new uint64[](numChunks);

        for (uint256 i = 0; i < numChunks; i++) {
            bytes memory chunk = new bytes(8);
            for (uint256 j = 0; j < 8; j++) {
                chunk[j] = data[i * 8 + j];
            }
            result[i] = uint64(bytes8(chunk));
        }
        return result;
    }
}
