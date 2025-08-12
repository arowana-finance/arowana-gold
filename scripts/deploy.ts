/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    MaxUint256,
    parseUnits,
    BaseContract,
    ContractTransactionResponse,
    formatUnits,
    formatEther,
    parseEther,
} from 'ethers';
import { permit, type SignerWithAddress } from 'ethers-opt';
import { getSigners } from 'ethers-opt/hardhat/fixtures';
import { Logger } from 'logger-chain';
import {
    DataFeed,
    DataFeed__factory,
    ERC20Mock,
    ERC20Mock__factory,
    GoldMinter,
    GoldMinter__factory,
    GoldToken,
    GoldToken__factory,
    InitializableProxy__factory,
} from '../typechain-types/index.js';
import { calculateSwap, getGoldStats } from '../src/gold.js';
import { getGoldPrice } from './goldPrice.js';

const AGT_NAME = 'Arowana Gold Token';
const AGT_SYMBOL = 'AGT';
const USD_TOKEN_DECIMALS = 6;
const ORACLE_DECIMALS = 8;

const GOLD_RESERVE = parseUnits('10000', ORACLE_DECIMALS);

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

async function deployTokens(owner: SignerWithAddress, buyer: SignerWithAddress) {
    const USDT = await new ERC20Mock__factory(owner).deploy(
        'Tether USD',
        'USDT',
        USD_TOKEN_DECIMALS,
        parseUnits('1000000', USD_TOKEN_DECIMALS),
    );
    await logDeploy('USDT', USDT);

    const USDC = await new ERC20Mock__factory(owner).deploy(
        'USD Coin',
        'USDC',
        USD_TOKEN_DECIMALS,
        parseUnits('1000000', USD_TOKEN_DECIMALS),
    );
    await logDeploy('USDC', USDC);

    await logTx('Sending USDT to Buyer', USDT.transfer(buyer.address, parseUnits('200', USD_TOKEN_DECIMALS)));
    await logTx('Sending USDC to Buyer', USDC.transfer(buyer.address, parseUnits('200', USD_TOKEN_DECIMALS)));

    return { USDT, USDC };
}

async function deployGoldToken(owner: SignerWithAddress) {
    const goldTokenImplementation = await new GoldToken__factory(owner).deploy();
    await logDeploy('GoldTokenImplementation', goldTokenImplementation);

    const goldTokenProxy = await new InitializableProxy__factory(owner).deploy();
    await logDeploy('GoldTokenProxy', goldTokenProxy);

    await logTx(
        'Init GoldToken',
        goldTokenProxy.initializeProxy(
            AGT_NAME,
            owner.address,
            goldTokenImplementation.target,
            (await goldTokenImplementation.initializeGoldToken.populateTransaction(owner.address)).data,
        ),
    );

    return {
        goldToken: GoldToken__factory.connect(goldTokenProxy.target as string, owner),
        goldTokenImplementation,
    };
}

async function deployGoldOracle(owner: SignerWithAddress, goldToken: GoldToken) {
    const goldPrice = String(await getGoldPrice());

    const goldPriceFeed = await new DataFeed__factory(owner).deploy();
    await logDeploy('GoldPriceFeed', goldPriceFeed);

    await logTx(
        'Init GoldPriceFeed',
        goldPriceFeed.initializeFeed(owner.address, goldToken.target, `${AGT_SYMBOL} / USD`),
    );

    const goldReserveFeed = await new DataFeed__factory(owner).deploy();
    await logDeploy('GoldReserveFeed', goldReserveFeed);

    await logTx(
        'Init GoldReserveFeed',
        goldReserveFeed.initializeFeed(owner.address, goldToken.target, `${AGT_SYMBOL} PoR`),
    );

    await logTx('Set Gold Oracle Price', goldPriceFeed.updateAnswer(parseUnits(goldPrice, ORACLE_DECIMALS)));
    await logTx('Set Gold Reserve Oracle Answer', goldReserveFeed.updateAnswer(GOLD_RESERVE));

    return { goldPriceFeed, goldReserveFeed };
}

async function getTokens(owner: SignerWithAddress, buyer: SignerWithAddress) {
    const { USDT, USDC } = await deployTokens(owner, buyer);

    const goldPriceFeed = DataFeed__factory.connect('0xBB7D041d5E2828569f4Bd667509AE15c3862298C', owner);

    const goldReserveFeed = DataFeed__factory.connect('0xa94fCB087C9E5D8480C04049D97e2fE2F3b306a0', owner);

    logger.debug(
        `Gold Price: $${formatUnits(await goldPriceFeed.latestAnswer(), ORACLE_DECIMALS)}/oz, ` +
            `Gold Reserve: ${formatUnits(await goldReserveFeed.latestAnswer(), ORACLE_DECIMALS)} oz, `,
    );

    return { USDT, USDC, goldPriceFeed, goldReserveFeed };
}

async function deployGoldMinter(
    owner: SignerWithAddress,
    USDT: ERC20Mock,
    USDC: ERC20Mock,
    goldToken: GoldToken,
    goldPriceFeed: DataFeed,
    goldReserveFeed: DataFeed,
) {
    const goldMinterImplementation = await new GoldMinter__factory(owner).deploy();
    await logDeploy('GoldMinterImplementation', goldMinterImplementation);

    const goldMinterProxy = await new InitializableProxy__factory(owner).deploy();
    await logDeploy('GoldMinterProxy', goldMinterProxy);

    const goldMinter = GoldMinter__factory.connect(goldMinterProxy.target as string, owner);

    await logTx(
        'GoldMinter: Initialize',
        goldMinterProxy.initializeProxy(
            `${AGT_NAME} Minter`,
            owner.address,
            goldMinterImplementation.target,
            (
                await goldMinter.initializeGoldMinter.populateTransaction(
                    goldToken.target,
                    USDT.target,
                    USDC.target,
                    goldPriceFeed.target,
                    goldReserveFeed.target,
                    owner.address,
                    owner.address,
                    true,
                )
            ).data,
        ),
    );

    await logTx('GoldToken: AddMinter', goldToken.addMinter(goldMinter.target));

    await logTx('USDT: Approving GoldMinter for burning', USDT.approve(goldMinter.target, MaxUint256));
    await logTx('USDC: Approving GoldMinter for burning', USDC.approve(goldMinter.target, MaxUint256));

    return {
        goldMinter,
        goldMinterImplementation,
    };
}

async function requestMint(
    buyer: SignerWithAddress,
    USDT: ERC20Mock,
    goldToken: GoldToken,
    goldPriceFeed: DataFeed,
    goldReserveFeed: DataFeed,
    goldMinter: GoldMinter,
) {
    // 1. Set buyer level to approved
    await logTx('RequestMint: SetLevel', goldMinter.setLevel(buyer.address, 2));

    const goldStatus = await getGoldStats({
        goldToken,
        goldPriceFeed,
        goldReserveFeed,
        goldMinter,
    });

    const inputAmount = 200;

    const { outputAmount, outputOnSlippage } = calculateSwap({
        inputAmount,
        isBuy: true,
        ...goldStatus,
    });

    const usdAmount = parseUnits(String(inputAmount), USD_TOKEN_DECIMALS);

    //const goldAmount = parseEther(String(outputAmount));

    const goldAmountOnSlippage = parseEther(String(outputOnSlippage));

    logger.debug(
        `RequestMint: Getting ${outputAmount} (expected: ${outputOnSlippage}) oz for $${inputAmount}`,
    );

    // 2. Approve and order gold
    await logTx(
        'RequestMint: Mint',
        goldMinter
            .connect(buyer)
            .requestMintPermit(
                USDT.target,
                usdAmount,
                goldAmountOnSlippage,
                MaxUint256,
                (await permit(USDT.connect(buyer), goldMinter, usdAmount, MaxUint256)).serialized,
            ),
    );

    // 3. Settle order
    //await logTx('RequestMint: Settle Mint', goldMinter.settleMint(0, goldAmount));

    logger.debug(`RequestMint: Got ${formatEther(await goldToken.balanceOf(buyer.address))} oz`);
}

async function requestBurn(
    buyer: SignerWithAddress,
    USDT: ERC20Mock,
    goldToken: GoldToken,
    goldPriceFeed: DataFeed,
    goldReserveFeed: DataFeed,
    goldMinter: GoldMinter,
) {
    const goldStatus = await getGoldStats({
        goldToken,
        goldPriceFeed,
        goldReserveFeed,
        goldMinter,
    });

    const goldAmount = await goldToken.balanceOf(buyer.address);

    const inputAmount = Number(formatEther(goldAmount));

    const { outputAmount, outputOnSlippage } = calculateSwap({
        inputAmount,
        isBuy: false,
        ...goldStatus,
    });

    //const usdAmount = parseUnits(String(outputAmount), USD_TOKEN_DECIMALS);

    const usdAmountOnSlippage = parseUnits(String(outputOnSlippage), USD_TOKEN_DECIMALS);

    logger.debug(
        `RequestBurn: Getting $${outputAmount} (expected: $${outputOnSlippage}) for ${inputAmount} oz`,
    );

    // 2. Approve and submit sell order
    await logTx(
        'RequestBurn: Burn',
        goldMinter
            .connect(buyer)
            .requestBurnPermit(
                USDT.target,
                goldAmount,
                usdAmountOnSlippage,
                MaxUint256,
                (await permit(goldToken.connect(buyer), goldMinter, goldAmount, MaxUint256)).serialized,
            ),
    );

    // 3. Settle order
    //await logTx('RequestBurn: Settle Burn', goldMinter.settleBurn(0, usdAmount));

    logger.debug(`RequestBurn: Got $${formatUnits(await USDT.balanceOf(buyer.address), USD_TOKEN_DECIMALS)}`);
}

async function deploy() {
    const [owner, buyer] = await getSigners();

    //const { USDT, USDC, goldPriceFeed, goldReserveFeed } = await getTokens(owner, buyer);

    const { USDT, USDC } = await deployTokens(owner, buyer);

    const { goldToken, goldTokenImplementation } = await deployGoldToken(owner);

    const { goldPriceFeed, goldReserveFeed } = await deployGoldOracle(owner, goldToken);

    const { goldMinter, goldMinterImplementation } = await deployGoldMinter(
        owner,
        USDT,
        USDC,
        goldToken,
        goldPriceFeed,
        goldReserveFeed,
    );

    await requestMint(buyer, USDT, goldToken, goldPriceFeed, goldReserveFeed, goldMinter);

    await requestBurn(buyer, USDT, goldToken, goldPriceFeed, goldReserveFeed, goldMinter);

    console.log({
        USDT: USDT.target,
        USDC: USDC.target,
        goldToken: goldToken.target,
        goldTokenImplementation: goldTokenImplementation.target,
        goldPriceFeed: goldPriceFeed.target,
        goldReserveFeed: goldReserveFeed.target,
        goldMinter: goldMinter.target,
        goldMinterImplementation: goldMinterImplementation.target,
    });
}

deploy();
