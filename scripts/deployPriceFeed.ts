import { network } from 'hardhat';
import { Logger } from 'logger-chain';
import { zeroAddress, parseGwei, encodeFunctionData, type Address, type Hex, type WalletClient } from 'viem';

const { viem } = await network.connect();

const AGT_SYMBOL = 'AGT';
const AGT_ADDRESS = zeroAddress;

const REMOTE_CHAIN = 42161;
const REMOTE_CHAIN_ORACLE = '0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c';

const CHAINLINK_ROUTER = '0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C';
const UPKEEP_INTERVAL = 60;
const UPKEEP_RATE_INTERVAL = 3600;
const UPKEEP_RATE_CAP = 2;
const MAX_BASE_GAS_PRICE = parseGwei('1'); // = 1 gwei
const UPDATE_INTERVAL = 3600;

const logger = new Logger();

async function logTx(name: string, txHashPromise: Promise<Hex>) {
    const publicClient = await viem.getPublicClient();
    const hash = await txHashPromise;
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    logger.debug('Tx', `${name} (hash: ${receipt.transactionHash})`);
}

async function logDeploy(name: string, address: Address) {
    logger.debug('Deploy', `${name}: ${address}`);
}

async function deployPriceFeed(owner: WalletClient) {
    // Impl deployment
    const agtPriceFeedImplementation = await viem.deployContract('AGTPriceFeed', []);
    await logDeploy('AGTPriceFeedImplementation', agtPriceFeedImplementation.address);

    // Proxy deployment
    const agtPriceFeedProxy = await viem.deployContract('InitializableProxy', []);
    await logDeploy('AGTPriceFeedProxy', agtPriceFeedProxy.address);

    // initialization calldata encoding (initializeAGTPriceFeed)
    const initData = encodeFunctionData({
        abi: agtPriceFeedImplementation.abi,
        functionName: 'initializeAGTPriceFeed',
        args: [
            owner.account!.address, // admin
            AGT_ADDRESS, // token
            `${AGT_SYMBOL} / USD`,
            BigInt(REMOTE_CHAIN),
            REMOTE_CHAIN_ORACLE,
            CHAINLINK_ROUTER,
            zeroAddress, // feeReceiver (ZeroAddress)
            BigInt(UPKEEP_INTERVAL),
            BigInt(UPKEEP_RATE_INTERVAL),
            BigInt(UPKEEP_RATE_CAP),
            MAX_BASE_GAS_PRICE,
            BigInt(UPDATE_INTERVAL),
        ],
    });

    await logTx(
        'Initialize Price Feed',
        agtPriceFeedProxy.write.initializeProxy(
            [
                `${AGT_SYMBOL} Price Feed`,
                owner.account!.address,
                agtPriceFeedImplementation.address,
                initData,
            ],
            { account: owner.account },
        ),
    );

    // actual contract handle attached to the proxy address
    const agtPriceFeed = await viem.getContractAt('AGTPriceFeed', agtPriceFeedProxy.address);

    return {
        agtPriceFeed,
        agtPriceFeedImplementation,
    };
}

async function deploy() {
    const [owner] = await viem.getWalletClients();

    const { agtPriceFeed, agtPriceFeedImplementation } = await deployPriceFeed(owner);

    console.log({
        agtPriceFeed: agtPriceFeed.address,
        agtPriceFeedImplementation: agtPriceFeedImplementation.address,
    });
}

deploy().catch((e) => {
    console.error(e);
    process.exit(1);
});
