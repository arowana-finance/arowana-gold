import hre, { network } from 'hardhat';
import { Logger } from 'logger-chain';
import {
    parseUnits,
    parseEther,
    formatUnits,
    formatEther,
    maxUint256,
    encodeFunctionData,
    type Hex,
    type Address,
    WalletClient,
} from 'viem';

import { calculateSwap, getGoldStats } from '../src/gold.js';
import { getGoldPrice } from './goldPrice.js';
import { ContractTypesMap } from 'hardhat/types/artifacts';

const { viem } = await network.connect();

const AGT_NAME = 'Arowana Gold Token';
const AGT_SYMBOL = 'AGT';
const USD_TOKEN_DECIMALS = 6;
const ORACLE_DECIMALS = 8;

const GOLD_RESERVE = parseUnits('10000', ORACLE_DECIMALS);
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

/** EIP-2612 permit signature (using viem signTypedData) */
async function signPermitERC2612(params: {
    token: ContractTypesMap['GoldToken'] | ContractTypesMap['ERC20Mock']; // ERC20Mock | GoldToken
    owner: Address;
    spender: Address;
    value: bigint;
    deadline: bigint;
}) {
    const { token, owner, spender, value, deadline } = params;

    const publicClient = await viem.getPublicClient();
    const [chainId, name, nonce] = await Promise.all([
        publicClient.getChainId(),
        token.read.name(),
        token.read.nonces([owner]),
    ]);

    let version = '1';
    try {
        const v = await (token.read as any).version?.();
        if (typeof v === 'string') version = v;
    } catch {}

    const domain = {
        name,
        version,
        chainId,
        verifyingContract: token.address,
    } as const;

    const types = {
        Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ],
    } as const;

    const message = { owner, spender, value, nonce, deadline } as const;

    const [wallet] = await viem.getWalletClients();
    const signature = await wallet.signTypedData({
        account: owner,
        domain: domain,
        types,
        primaryType: 'Permit',
        message,
    });

    return signature as Hex;
}

/** fetch wallets */
async function getActors() {
    const [owner, buyer] = await viem.getWalletClients();
    return { owner, buyer };
}

/** deploy tokens (USDT/USDC) + initial distribution */
async function deployTokens(owner: WalletClient, buyer: WalletClient) {
    const USDT = await viem.deployContract('ERC20Mock', [
        'Tether USD',
        'USDT',
        USD_TOKEN_DECIMALS,
        parseUnits('1000000', USD_TOKEN_DECIMALS),
    ]);
    await logDeploy('USDT', USDT.address);

    const USDC = await viem.deployContract('ERC20Mock', [
        'USD Coin',
        'USDC',
        USD_TOKEN_DECIMALS,
        parseUnits('1000000', USD_TOKEN_DECIMALS),
    ]);
    await logDeploy('USDC', USDC.address);

    await logTx(
        'Sending USDT to Buyer',
        USDT.write.transfer([buyer.account!.address, parseUnits('200', USD_TOKEN_DECIMALS)], {
            account: owner.account,
        }),
    );
    await logTx(
        'Sending USDC to Buyer',
        USDC.write.transfer([buyer.account!.address, parseUnits('200', USD_TOKEN_DECIMALS)], {
            account: owner.account,
        }),
    );

    return { USDT, USDC };
}

/** GoldToken (upgradeable: Impl + Proxy + initialize) */
async function deployGoldToken(owner: WalletClient) {
    const goldTokenImplementation = await viem.deployContract('GoldToken', []);
    await logDeploy('GoldTokenImplementation', goldTokenImplementation.address);

    const goldTokenProxy = await viem.deployContract('InitializableProxy', []);
    await logDeploy('GoldTokenProxy', goldTokenProxy.address);

    const initData = encodeFunctionData({
        abi: goldTokenImplementation.abi,
        functionName: 'initializeGoldToken',
        args: [owner.account!.address],
    });

    await logTx(
        'Init GoldToken',
        goldTokenProxy.write.initializeProxy(
            [AGT_NAME, owner.account!.address, goldTokenImplementation.address, initData],
            { account: owner.account },
        ),
    );

    const goldToken = await viem.getContractAt('GoldToken', goldTokenProxy.address);
    return { goldToken, goldTokenImplementation, goldTokenProxy };
}

/** deploy and initialize oracles (price/reserve) */
async function deployGoldOracle(owner: WalletClient, goldToken: ContractTypesMap['GoldToken']) {
    const goldPrice = String(await getGoldPrice());

    const goldPriceFeed = await viem.deployContract('DataFeed', []);
    await logDeploy('GoldPriceFeed', goldPriceFeed.address);

    await logTx(
        'Init GoldPriceFeed',
        goldPriceFeed.write.initializeFeed(
            [owner.account!.address, goldToken.address, `${AGT_SYMBOL} / USD`],
            {
                account: owner.account,
            },
        ),
    );

    const goldReserveFeed = await viem.deployContract('DataFeed', []);
    await logDeploy('GoldReserveFeed', goldReserveFeed.address);

    await logTx(
        'Init GoldReserveFeed',
        goldReserveFeed.write.initializeFeed(
            [owner.account!.address, goldToken.address, `${AGT_SYMBOL} PoR`],
            {
                account: owner.account,
            },
        ),
    );

    await logTx(
        'Set Gold Oracle Price',
        goldPriceFeed.write.updateAnswer([parseUnits(goldPrice, ORACLE_DECIMALS)], {
            account: owner.account,
        }),
    );
    await logTx(
        'Set Gold Reserve Oracle Answer',
        goldReserveFeed.write.updateAnswer([GOLD_RESERVE], {
            account: owner.account,
        }),
    );

    return { goldPriceFeed, goldReserveFeed };
}

/** attach to an already deployed feed (hardcoded address) */
async function getTokens(owner: WalletClient, buyer: WalletClient) {
    const { USDT, USDC } = await deployTokens(owner, buyer);

    const goldPriceFeed = await viem.getContractAt('DataFeed', '0xBB7D041d5E2828569f4Bd667509AE15c3862298C');
    const goldReserveFeed = await viem.getContractAt(
        'DataFeed',
        '0xa94fCB087C9E5D8480C04049D97e2fE2F3b306a0',
    );

    logger.debug(
        `Gold Price: $${formatUnits(
            (await goldPriceFeed.read.latestAnswer()) as bigint,
            ORACLE_DECIMALS,
        )}/oz, ` +
            `Gold Reserve: ${formatUnits(
                (await goldReserveFeed.read.latestAnswer()) as bigint,
                ORACLE_DECIMALS,
            )} oz, `,
    );

    return { USDT, USDC, goldPriceFeed, goldReserveFeed };
}

/** GoldMinter (upgradeable: Impl + Proxy + initialize) */
async function deployGoldMinter(
    owner: WalletClient,
    USDT: ContractTypesMap['ERC20Mock'],
    USDC: ContractTypesMap['ERC20Mock'],
    goldToken: ContractTypesMap['GoldToken'],
    goldPriceFeed: ContractTypesMap['DataFeed'],
    goldReserveFeed: ContractTypesMap['DataFeed'],
) {
    const goldMinterImplementation = await viem.deployContract('GoldMinter', []);
    await logDeploy('GoldMinterImplementation', goldMinterImplementation.address);

    const goldMinterProxy = await viem.deployContract('InitializableProxy', []);
    await logDeploy('GoldMinterProxy', goldMinterProxy.address);

    const initData = encodeFunctionData({
        abi: goldMinterImplementation.abi,
        functionName: 'initializeGoldMinter',
        args: [
            goldToken.address,
            USDT.address,
            USDC.address,
            goldPriceFeed.address,
            goldReserveFeed.address,
            owner.account!.address,
            owner.account!.address,
            true,
        ],
    });

    await logTx(
        'GoldMinter: Initialize',
        goldMinterProxy.write.initializeProxy(
            [`${AGT_NAME} Minter`, owner.account!.address, goldMinterImplementation.address, initData],
            { account: owner.account },
        ),
    );

    const goldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

    await logTx(
        'GoldToken: AddMinter',
        goldToken.write.addMinter([goldMinter.address], { account: owner.account }),
    );

    await logTx(
        'USDT: Approving GoldMinter for burning',
        USDT.write.approve([goldMinter.address, maxUint256], {
            account: owner.account,
        }),
    );
    await logTx(
        'USDC: Approving GoldMinter for burning',
        USDC.write.approve([goldMinter.address, maxUint256], {
            account: owner.account,
        }),
    );

    return { goldMinter, goldMinterImplementation, goldMinterProxy };
}

/** Mint request (using Permit) */
async function requestMint(
    buyer: WalletClient,
    USDT: ContractTypesMap['ERC20Mock'],
    goldToken: ContractTypesMap['GoldToken'],
    goldPriceFeed: ContractTypesMap['DataFeed'],
    goldReserveFeed: ContractTypesMap['DataFeed'],
    goldMinter: ContractTypesMap['GoldMinter'],
) {
    await logTx(
        'RequestMint: SetLevel',
        goldMinter.write.setLevel([buyer.account!.address, 2], {
            account: (await viem.getWalletClients())[0].account,
        }),
    );

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
    const goldAmountOnSlippage = parseEther(String(outputOnSlippage));

    logger.debug(
        `RequestMint: Getting ${outputAmount} (expected: ${outputOnSlippage}) oz for $${inputAmount}`,
    );

    const signature = await signPermitERC2612({
        token: USDT,
        owner: buyer.account!.address,
        spender: goldMinter.address,
        value: usdAmount,
        deadline: maxUint256,
    });

    await logTx(
        'RequestMint: Mint',
        goldMinter.write.requestMintPermit(
            [USDT.address, usdAmount, goldAmountOnSlippage, maxUint256, signature],
            {
                account: buyer.account,
            },
        ),
    );

    logger.debug(
        `RequestMint: Got ${formatEther(
            (await goldToken.read.balanceOf([buyer.account!.address])) as bigint,
        )} oz`,
    );
}

/** Burn request (using Permit) */
async function requestBurn(
    buyer: WalletClient,
    USDT: ContractTypesMap['ERC20Mock'],
    goldToken: ContractTypesMap['GoldToken'],
    goldPriceFeed: ContractTypesMap['DataFeed'],
    goldReserveFeed: ContractTypesMap['DataFeed'],
    goldMinter: ContractTypesMap['GoldMinter'],
) {
    const goldStatus = await getGoldStats({
        goldToken,
        goldPriceFeed,
        goldReserveFeed,
        goldMinter,
    });

    const goldAmount = await goldToken.read.balanceOf([buyer.account!.address]);
    const inputAmount = Number(formatEther(goldAmount));

    const { outputAmount, outputOnSlippage } = calculateSwap({
        inputAmount,
        isBuy: false,
        ...goldStatus,
    });

    const usdAmountOnSlippage = parseUnits(String(outputOnSlippage), USD_TOKEN_DECIMALS);

    logger.debug(
        `RequestBurn: Getting $${outputAmount} (expected: $${outputOnSlippage}) for ${inputAmount} oz`,
    );

    const signature = await signPermitERC2612({
        token: goldToken,
        owner: buyer.account!.address,
        spender: goldMinter.address,
        value: goldAmount,
        deadline: maxUint256,
    });

    await logTx(
        'RequestBurn: Burn',
        goldMinter.write.requestBurnPermit(
            [USDT.address, goldAmount, usdAmountOnSlippage, maxUint256, signature],
            {
                account: buyer.account,
            },
        ),
    );

    logger.debug(
        `RequestBurn: Got $${formatUnits(
            (await USDT.read.balanceOf([buyer.account!.address])) as bigint,
            USD_TOKEN_DECIMALS,
        )}`,
    );
}

async function deploy() {
    const { owner, buyer } = await getActors();
    logger.debug('Owner', `${owner.account.address}`);
    logger.debug('Buyer', `${buyer.account.address}`);
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
        USDT: USDT.address,
        USDC: USDC.address,
        goldToken: goldToken.address,
        goldTokenImplementation: goldTokenImplementation.address,
        goldPriceFeed: goldPriceFeed.address,
        goldReserveFeed: goldReserveFeed.address,
        goldMinter: goldMinter.address,
        goldMinterImplementation: goldMinterImplementation.address,
    });
}

deploy().catch((e) => {
    console.error(e);
    process.exit(1);
});
