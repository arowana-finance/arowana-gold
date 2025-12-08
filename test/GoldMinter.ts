import { expect } from 'chai';

import { parseUnits, parseEther, maxUint256, getAddress, encodeFunctionData } from 'viem';
import { getClients, signPermitERC2612 } from './helpers.js';

const GOLD_PRICE = parseUnits('3362.61', 8);
const GOLD_PRICE_IN_USD_TOKEN = parseUnits('3362.61', 6);

const fixtureData = {
    USDTMintAmt: 100000,
    USDTTransferAmt: 10000,
    USDCMintAmt: 100000,
    USDCTransferAmt: 10000,
    goldMintAmt: 1,
    goldSellAmt: 1,
};

describe('GoldMinter', function () {
    const fixture = async () => {
        const { owner, buyer, viem } = await getClients();
        const { USDTMintAmt, USDCMintAmt, USDTTransferAmt, USDCTransferAmt } = fixtureData;

        const goldToken = await viem.deployContract('GoldToken');
        await goldToken.write.initializeGoldToken([owner.account.address], {
            account: owner.account,
        });

        const USDT = await viem.deployContract('ERC20Mock', [
            'Tether USD',
            'USDT',
            6,
            parseUnits(String(USDTMintAmt), 6),
        ]);
        const USDC = await viem.deployContract('ERC20Mock', [
            'USD Coin',
            'USDC',
            6,
            parseUnits(String(USDCMintAmt), 6),
        ]);

        await USDT.write.transfer([buyer.account.address, parseUnits(String(USDTTransferAmt), 6)], {
            account: owner.account,
        });
        await USDC.write.transfer([buyer.account.address, parseUnits(String(USDCTransferAmt), 6)], {
            account: owner.account,
        });

        const goldPriceFeed = await viem.deployContract('DataFeed');
        await goldPriceFeed.write.initializeFeed(
            [owner.account.address, goldToken.address, `${await goldToken.read.symbol()} / USD`],
            { account: owner.account },
        );

        await goldPriceFeed.write.updateAnswer([GOLD_PRICE], {
            account: owner.account,
        });

        const goldMinterImpl = await viem.deployContract('GoldMinter');
        const goldMinterProxy = await viem.deployContract('InitializableProxy', []);

        const initData = encodeFunctionData({
            abi: goldMinterImpl.abi,
            functionName: 'initializeGoldMinter',
            args: [
                goldToken.address,
                USDT.address,
                USDC.address,
                goldPriceFeed.address,
                owner.account.address,
                owner.account.address,
                false,
            ],
        });

        await goldMinterProxy.write.initializeProxy(
            ['GoldMinter', owner.account.address, goldMinterImpl.address, initData],
            { account: owner.account },
        );

        const goldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

        await goldToken.write.addMinter([goldMinter.address], {
            account: owner.account,
        });

        return {
            owner,
            buyer,
            goldToken,
            USDT,
            USDC,
            goldPriceFeed,
            goldMinter,
        };
    };

    it('deploy', async function () {
        const { goldToken, USDT, USDC, goldPriceFeed, goldMinter } = await fixture();

        expect(await goldMinter.read.goldToken()).to.equal(getAddress(goldToken.address));
        expect(await goldMinter.read.USDT()).to.equal(getAddress(USDT.address));
        expect(await goldMinter.read.USDC()).to.equal(getAddress(USDC.address));

        expect(await goldPriceFeed.read.latestAnswer()).to.equal(GOLD_PRICE);

        expect(await goldMinter.read.slippage()).to.equal(500);
        expect(await goldMinter.read.fees()).to.equal(40);
    });

    it('getGoldAmount', async function () {
        const { USDT, goldMinter } = await fixture();

        expect(await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN])).to.equal(
            parseEther('1'),
        );

        expect(await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN / 2n])).to.equal(
            parseEther('1') / 2n,
        );
    });

    it('getUsdAmount', async function () {
        const { USDT, goldMinter } = await fixture();

        expect(await goldMinter.read.getUsdAmount([USDT.address, parseEther('1')])).to.equal(
            GOLD_PRICE_IN_USD_TOKEN,
        );

        expect(await goldMinter.read.getUsdAmount([USDT.address, parseEther('1') / 2n])).to.equal(
            GOLD_PRICE_IN_USD_TOKEN / 2n,
        );
    });

    it('requestMint (with permit)', async function () {
        const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();
        const { goldMintAmt } = fixtureData;

        await goldMinter.write.setLevel([buyer.account.address, 2], {
            account: owner.account,
        });

        const signature = await signPermitERC2612({
            token: USDT,
            owner: buyer,
            spender: goldMinter.address,
            value: GOLD_PRICE_IN_USD_TOKEN,
            deadline: maxUint256,
        });

        await goldMinter.write.requestMintPermit(
            [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(goldMintAmt)), maxUint256, signature],
            { account: buyer.account },
        );

        await goldMinter.write.settleMint([0n, parseEther(String(goldMintAmt))], {
            account: owner.account,
        });

        const feeBps = await goldMinter.read.fees();
        const amountExFee = (parseEther(String(goldMintAmt)) * (10000n - BigInt(String(feeBps)))) / 10000n;

        expect(await goldToken.read.balanceOf([buyer.account.address])).to.equal(amountExFee);
    });

    it('requestBurn', async function () {
        const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();
        const { goldSellAmt } = fixtureData;

        await goldMinter.write.setLevel([buyer.account.address, 2], {
            account: owner.account,
        });
        await USDT.write.approve([goldMinter.address, maxUint256], {
            account: buyer.account,
        });
        await goldMinter.write.requestMint(
            [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(goldSellAmt))],
            {
                account: buyer.account,
            },
        );
        await goldMinter.write.settleMint([0n, parseEther(String(goldSellAmt))], {
            account: owner.account,
        });

        const amountExFee = await goldToken.read.balanceOf([buyer.account.address]);

        const expectedOutput = await goldMinter.read.getUsdAmount([USDT.address, amountExFee]);

        await goldToken.write.approve([goldMinter.address, maxUint256], {
            account: buyer.account,
        });

        await goldMinter.write.requestBurn([USDT.address, amountExFee, expectedOutput], {
            account: buyer.account,
        });

        await USDT.write.approve([goldMinter.address, expectedOutput], {
            account: owner.account,
        });

        await goldMinter.write.settleBurn([0n, expectedOutput], {
            account: owner.account,
        });

        expect(await goldToken.read.balanceOf([buyer.account.address])).to.equal(0n);
        expect(await goldToken.read.balanceOf([goldMinter.address])).to.equal(0n);
    });
});
