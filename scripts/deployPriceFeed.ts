import { ZeroAddress, parseUnits, BaseContract, ContractTransactionResponse } from 'ethers';
import { type SignerWithAddress } from 'ethers-opt';
import { getSigners } from 'ethers-opt/hardhat/fixtures';
import { Logger } from 'logger-chain';
import { AGTPriceFeed__factory, InitializableProxy__factory } from '../typechain-types/index.js';

const AGT_SYMBOL = 'AGT';
const AGT_ADDRESS = ZeroAddress;

const REMOTE_CHAIN = 42161;
const REMOTE_CHAIN_ORACLE = '0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c';

const CHAINLINK_ROUTER = '0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C';
const UPKEEP_INTERVAL = 60;
const UPKEEP_RATE_INTERVAL = 3600;
const UPKEEP_RATE_CAP = 2;
const MAX_BASE_GAS_PRICE = parseUnits('1', 'gwei');
const UPDATE_INTERVAL = 3600;

const logger = new Logger();

async function logDeploy(contractName: string, contract: BaseContract) {
    logger.debug(
        'Deploy',
        `${contractName}: ${contract.target} (hash: ${(await contract.deploymentTransaction()?.wait())?.hash})`,
    );
}

async function logTx(txName: string, tx: Promise<ContractTransactionResponse>) {
    logger.debug('Tx', `${txName} (hash: ${(await (await tx).wait())?.hash})`);
}

async function deployPriceFeed(owner: SignerWithAddress) {
    const agtPriceFeedImplementation = await new AGTPriceFeed__factory(owner).deploy();
    await logDeploy('AGTPriceFeedImplementation', agtPriceFeedImplementation);

    const agtPriceFeedProxy = await new InitializableProxy__factory(owner).deploy();
    await logDeploy('AGTPriceFeedProxy', agtPriceFeedProxy);

    const agtPriceFeed = AGTPriceFeed__factory.connect(agtPriceFeedProxy.target as string, owner);

    await logTx(
        'Initialize Price Feed',
        agtPriceFeedProxy.initializeProxy(
            `${AGT_SYMBOL} Price Feed`,
            owner.address,
            agtPriceFeedImplementation.target,
            (
                await agtPriceFeedImplementation.initializeAGTPriceFeed.populateTransaction(
                    owner.address,
                    AGT_ADDRESS,
                    `${AGT_SYMBOL} / USD`,
                    REMOTE_CHAIN,
                    REMOTE_CHAIN_ORACLE,
                    CHAINLINK_ROUTER,
                    ZeroAddress,
                    UPKEEP_INTERVAL,
                    UPKEEP_RATE_INTERVAL,
                    UPKEEP_RATE_CAP,
                    MAX_BASE_GAS_PRICE,
                    UPDATE_INTERVAL,
                )
            ).data,
        ),
    );

    return {
        agtPriceFeed,
        agtPriceFeedImplementation,
    };
}

async function deploy() {
    const [owner] = await getSigners();

    const { agtPriceFeed, agtPriceFeedImplementation } = await deployPriceFeed(owner);

    console.log({
        agtPriceFeed: agtPriceFeed.target,
        agtPriceFeedImplementation: agtPriceFeedImplementation.target,
    });
}

deploy();
