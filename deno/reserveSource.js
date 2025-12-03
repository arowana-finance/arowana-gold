const viem = await import('npm:viem@2.21.44');

const RESERVE_API = 'https://gold-reserve.arowana.finance';
const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';
const CONTRACT_ADDRESS = '0xa94fcb087c9e5d8480c04049d97e2fe2f3b306a0';
const ORACLE_DECIMALS = 8;
const oracleInterval = 3600;

const DATA_FEED_ABI = [
    {
        type: 'function',
        name: 'latestRoundData',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            { name: 'roundId', type: 'uint80' },
            { name: 'answer', type: 'int256' },
            { name: 'startedAt', type: 'uint256' },
            { name: 'updatedAt', type: 'uint256' },
            { name: 'answeredInRound', type: 'uint80' },
        ],
    },
];

const client = viem.createPublicClient({
    transport: viem.http(RPC_URL),
});

async function getDataFeedRound() {
    try {
        const [roundId, answer, , updatedAt] = await client.readContract({
            address: CONTRACT_ADDRESS,
            abi: DATA_FEED_ABI,
            functionName: 'latestRoundData',
        });

        return {
            roundId: Number(roundId),
            answer: Number(viem.formatUnits(answer, ORACLE_DECIMALS)),
            updatedAt: Number(updatedAt),
        };
    } catch (error) {
        console.log('DataFeed error:', error.message);
        return { roundId: 0, answer: 0, updatedAt: 0 };
    }
}

async function getApi() {
    try {
        const resp = await fetch(RESERVE_API);
        if (!resp.ok) return 0;
        const { reserve } = await resp.json();
        return Number(reserve);
    } catch (error) {
        console.log('API fetch error:', error.message);
        return 0;
    }
}

function toUint64(n) {
    const U64_MAX = (1n << 64n) - 1n;
    const bi = BigInt(n);
    return bi & U64_MAX;
}

async function processSource() {
    console.log('Starting reserve processSource...');
    const [dataFeedResult, reserve] = await Promise.all([getDataFeedRound(), getApi()]);

    console.log('DataFeed result:', dataFeedResult);
    console.log('Reserve from API:', reserve);

    const { updatedAt } = dataFeedResult;
    const currentTimestamp = Math.floor(Date.now() / 1000 / oracleInterval) * oracleInterval;

    console.log('updatedAt:', updatedAt, 'currentTimestamp:', currentTimestamp);

    if (!reserve || updatedAt > currentTimestamp) {
        console.log('Returning 0x01 - reserve:', reserve, 'condition:', updatedAt > currentTimestamp);
        return viem.toBytes('0x01');
    }

    const reserveBN = viem.parseUnits(String(reserve), ORACLE_DECIMALS);

    const packedHex = viem.encodePacked(['uint64', 'uint64'], [reserveBN, BigInt(currentTimestamp)]);

    return viem.toBytes(packedHex);
}

return await processSource();
