import hre from 'hardhat';
import { Logger } from 'logger-chain';
import { zeroAddress, parseGwei, encodeFunctionData, type Address, type Hex, type WalletClient } from 'viem';

const AGT_SYMBOL = 'AGT';
const AGT_ADDRESS: Address = zeroAddress;

const CHAINLINK_ROUTER = '0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C' as Address;
const UPKEEP_INTERVAL = 60;
const UPKEEP_RATE_INTERVAL = 3600;
const UPKEEP_RATE_CAP = 2;
const MAX_BASE_GAS_PRICE = parseGwei('1'); // 1 gwei
const UPDATE_INTERVAL = 3600;

const logger = new Logger();

/** tx logging helper (viem write는 tx hash 반환) */
async function logTx(name: string, txHashPromise: Promise<Hex>) {
    const publicClient = await hre.viem.getPublicClient();
    const hash = await txHashPromise;
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    logger.debug('Tx', `${name} (hash: ${receipt.transactionHash})`);
}

/** 배포 logging helper */
async function logDeploy(name: string, address: Address) {
    logger.debug('Deploy', `${name}: ${address}`);
}

async function deployReserveFeed(owner: WalletClient) {
    // 1) Implementation 배포
    const agtReserveFeedImplementation = await hre.viem.deployContract('AGTReserveFeed', []);
    await logDeploy('AGTReserveFeedImplementation', agtReserveFeedImplementation.address);

    // 2) Proxy 배포
    const agtReserveFeedProxy = await hre.viem.deployContract('InitializableProxy', []);
    await logDeploy('AGTReserveFeedProxy', agtReserveFeedProxy.address);

    const initData = encodeFunctionData({
        abi: agtReserveFeedImplementation.abi,
        functionName: 'initializeAGTReserveFeed',
        args: [
            owner.account!.address,
            AGT_ADDRESS,
            `${AGT_SYMBOL} PoR`,
            CHAINLINK_ROUTER,
            zeroAddress,
            BigInt(UPKEEP_INTERVAL),
            BigInt(UPKEEP_RATE_INTERVAL),
            BigInt(UPKEEP_RATE_CAP),
            MAX_BASE_GAS_PRICE,
            BigInt(UPDATE_INTERVAL),
        ],
    });

    // 4) Proxy 초기화
    await logTx(
        'Initialize Reserve Feed',
        agtReserveFeedProxy.write.initializeProxy(
            [
                `${AGT_SYMBOL} Reserve Feed`,
                owner.account!.address,
                agtReserveFeedImplementation.address,
                initData,
            ],
            { account: owner.account },
        ),
    );

    // 프록시 주소에 실제 구현 ABI로 붙기
    const agtReserveFeed = await hre.viem.getContractAt('AGTReserveFeed', agtReserveFeedProxy.address);

    return {
        agtReserveFeed,
        agtReserveFeedImplementation,
    };
}

async function deploy() {
    const [owner] = await hre.viem.getWalletClients();

    const { agtReserveFeed, agtReserveFeedImplementation } = await deployReserveFeed(owner);

    console.log({
        agtReserveFeed: agtReserveFeed.address,
        agtReserveFeedImplementation: agtReserveFeedImplementation.address,
    });
}

deploy().catch((e) => {
    console.error(e);
    process.exit(1);
});
