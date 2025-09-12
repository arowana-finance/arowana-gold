import { createPublicClient, http, formatUnits } from 'viem';

import { mainnet } from 'viem/chains';

const ETH_RPC = 'https://rpc.mevblocker.io';

const CHAINLINK_XAU_USD_FEED = '0x214eD9Da11D2fbe465a6fc601a91E62EbEc1a0D6' as const;

const aggregatorV3InterfaceABI = [
    {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
            { name: 'roundId', type: 'uint80' },
            { name: 'answer', type: 'int256' },
            { name: 'startedAt', type: 'uint256' },
            { name: 'updatedAt', type: 'uint256' },
            { name: 'answeredInRound', type: 'uint80' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export async function getGoldPrice(): Promise<number> {
    const client = createPublicClient({
        chain: mainnet,
        transport: http(ETH_RPC),
    });

    // Chainlink Aggregator 최신 데이터 읽기
    const [roundId, answer] = (await client.readContract({
        address: CHAINLINK_XAU_USD_FEED,
        abi: aggregatorV3InterfaceABI,
        functionName: 'latestRoundData',
    })) as [bigint, bigint, bigint, bigint, bigint];

    // Chainlink XAU/USD 피드는 8 decimals
    return Number(formatUnits(answer, 8));
}
