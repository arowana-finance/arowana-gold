import { ZeroAddress, parseUnits, BaseContract, ContractTransactionResponse } from 'ethers';
import { type SignerWithAddress } from 'ethers-opt';
import { getSigners } from 'ethers-opt/hardhat/fixtures';
import { Logger } from 'logger-chain';
import { AGTReserveFeed__factory, InitializableProxy__factory } from '../typechain-types/index.js';

const AGT_SYMBOL = 'AGT';
const AGT_ADDRESS = ZeroAddress;

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

async function deployReserveFeed(owner: SignerWithAddress) {
    const agtReserveFeedImplementation = await new AGTReserveFeed__factory(owner).deploy();
    await logDeploy('AGTReserveFeedImplementation', agtReserveFeedImplementation);

    const agtReserveFeedProxy = await new InitializableProxy__factory(owner).deploy();
    await logDeploy('AGTReserveFeedProxy', agtReserveFeedProxy);

    const agtReserveFeed = AGTReserveFeed__factory.connect(agtReserveFeedProxy.target as string, owner);

    await logTx(
        'Initialize Reserve Feed',
        agtReserveFeedProxy.initializeProxy(
            `${AGT_SYMBOL} Reserve Feed`,
            owner.address,
            agtReserveFeedImplementation.target,
            (
                await agtReserveFeedImplementation.initializeAGTReserveFeed.populateTransaction(
                    owner.address,
                    AGT_ADDRESS,
                    `${AGT_SYMBOL} PoR`,
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
        agtReserveFeed,
        agtReserveFeedImplementation,
    };
}

async function deploy() {
    const [owner] = await getSigners();

    const { agtReserveFeed, agtReserveFeedImplementation } = await deployReserveFeed(owner);

    console.log({
        agtReserveFeed: agtReserveFeed.target,
        agtReserveFeedImplementation: agtReserveFeedImplementation.target,
    });
}

deploy();
