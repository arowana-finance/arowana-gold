// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { AGTReserveFeed } from './AGTReserveFeed.sol';

/**
 * @dev AGT Price Oracle powered by Chainlink Functions
 *
 * ( Only for Arbitrum Sepolia as it doesn't have native XAU / USD price feed so we mirror mainnet price feed )
 * ( For Arbitrum mainnet should use something like PriceCapAdapterStable at front of XAU / USD price feed )
 */
contract AGTPriceFeed is AGTReserveFeed {
    address public remoteChainOracle;
    uint64 public remoteChain;
	struct InitParams {
          address initOwner;
          address asset;
          string description;
          uint64 remoteChain;
          address remoteChainOracle;
          address router;
          address upkeepContract;
          uint64 upkeepInterval;
          uint64 upkeepRateInterval;
          uint64 upkeepRateCap;
          uint64 maxBaseGasPrice;
          uint64 updateInterval;
      }

    function initializeAGTPriceFeed(
        InitParams calldata params
    ) public initializer { 
		_initializeFeed(params.initOwner, params.asset, params.description);

		remoteChain = params.remoteChain;
		remoteChainOracle = params.remoteChainOracle;

		setInterval(params.updateInterval);
		setUpkeep(params.upkeepContract, params.upkeepInterval, params.upkeepRateInterval, params.upkeepRateCap, params.maxBaseGasPrice);
		_initializeConsumer(address(0), params.router);
    }
}
