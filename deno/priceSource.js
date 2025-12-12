const viem = await import('npm:viem@2.21.44');

const REMOTE_CHAIN = 42161;
const REMOTE_CHAIN_RPC = 'https://arb1.arbitrum.io/rpc';
const REMOTE_CHAIN_ORACLE = '0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c';

const HOME_CHAIN = 421614;
const HOME_CHAIN_RPC = 'https://sepolia-rollup.arbitrum.io/rpc';
const HOME_CHAIN_ORACLE = '0x157a8e9647982c9497268a495752d261b2898f04';

const ORACLE_DECIMALS = 8;
const oracleInterval = 3600;

function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

async function fetchRemote() {
    try {
        const client = viem.createPublicClient({
            transport: viem.http(REMOTE_CHAIN_RPC),
        });
        const currentTimestamp = getTimestamp();

        const [id, [, answer, , updatedAt]] = await Promise.all([
            client.getChainId(),
            client.readContract({
                address: REMOTE_CHAIN_ORACLE,
                abi: [
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
                ],
                functionName: 'latestRoundData',
            }),
        ]);

        if (Number(id) !== REMOTE_CHAIN) {
            throw new Error('Invalid remote chain');
        }

        if (Number(updatedAt) < currentTimestamp - 86400) {
            throw new Error('Data too old');
        }

        return {
            latestAnswer: Number(viem.formatUnits(answer, ORACLE_DECIMALS)),
            updatedAt: Number(updatedAt),
        };
    } catch (error) {
        console.log('Remote fetch error:', error.message);
        return { latestAnswer: 0, updatedAt: 0 };
    }
}

async function fetchHome() {
    try {
        const client = viem.createPublicClient({
            transport: viem.http(HOME_CHAIN_RPC),
        });
        const currentTimestamp = getTimestamp();

        const [, answer, , updatedAt] = await client.readContract({
            address: HOME_CHAIN_ORACLE,
            abi: [
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
            ],
            functionName: 'latestRoundData',
        });

        if (Number(updatedAt) > currentTimestamp) {
            throw new Error('Data too new');
        }

        return {
            latestAnswer: Number(viem.formatUnits(answer, ORACLE_DECIMALS)),
            updatedAt: !updatedAt ? currentTimestamp : Number(updatedAt),
        };
    } catch (error) {
        console.log('Home fetch error:', error.message);
        return { latestAnswer: 0, updatedAt: 0 };
    }
}

async function processSource() {
    const [remoteData, homeData] = await Promise.all([fetchRemote(), fetchHome()]);
    console.log({ remoteData, homeData });
    if (!remoteData.updatedAt || !homeData.updatedAt) {
        return viem.toBytes('0x01');
    }

    const currentTimestamp = Math.floor(getTimestamp() / oracleInterval) * oracleInterval;

    const timestamp = remoteData.updatedAt > currentTimestamp ? remoteData.updatedAt : currentTimestamp;
    const answer = viem.parseUnits(String(remoteData.latestAnswer), ORACLE_DECIMALS);

    return viem.toBytes(viem.encodePacked(['uint64', 'uint64'], [answer, BigInt(timestamp)]));
}

return await processSource();
