import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers.js';
import { expect } from 'chai';
import { MaxUint256, parseUnits, parseEther } from 'ethers';
import { permit, type SignerWithAddress } from 'ethers-opt';
import hre from 'hardhat';
import {
    DataFeed__factory,
    ERC20Mock__factory,
    GoldToken__factory,
    GoldMinter__factory,
} from '../typechain-types/index.js';

const GOLD_PRICE = parseUnits('3362.61', 8);

const GOLD_PRICE_IN_USD_TOKEN = parseUnits('3362.61', 6);

const GOLD_RESERVE = parseUnits('10000', 8);

const GOLD_RESERVE_IN_TOKEN = parseEther('10000');

async function getSigners() {
    return (await hre.ethers.getSigners()) as unknown as SignerWithAddress[];
}

describe('GoldMinter', function () {
    const minterFixture = async () => {
        const [owner, buyer] = await getSigners();

        const goldToken = await new GoldToken__factory(owner).deploy();
        await goldToken.initializeGoldToken(owner.address);

        const USDT = await new ERC20Mock__factory(owner).deploy(
            'Tether USD',
            'USDT',
            6,
            parseUnits('100000', 6),
        );
        const USDC = await new ERC20Mock__factory(owner).deploy(
            'USD Coin',
            'USDC',
            6,
            parseUnits('100000', 6),
        );

        await USDT.transfer(buyer.address, parseUnits('10000', 6));
        await USDC.transfer(buyer.address, parseUnits('10000', 6));

        const goldPriceFeed = await new DataFeed__factory(owner).deploy();
        await goldPriceFeed.initializeFeed(
            owner.address,
            goldToken.target,
            `${await goldToken.symbol()} / USD`,
        );
        const goldReserveFeed = await new DataFeed__factory(owner).deploy();
        await goldReserveFeed.initializeFeed(
            owner.address,
            goldToken.target,
            `${await goldToken.symbol()} PoR`,
        );

        await goldPriceFeed.updateAnswer(GOLD_PRICE);
        await goldReserveFeed.updateAnswer(GOLD_RESERVE);

        const goldMinter = await new GoldMinter__factory(owner).deploy();
        await goldMinter.initializeGoldMinter(
            goldToken.target,
            USDT.target,
            USDC.target,
            goldPriceFeed.target,
            goldReserveFeed.target,
            owner.address,
            owner.address,
            false,
        );
        await goldToken.addMinter(goldMinter.target);

        return {
            goldToken,
            USDT,
            USDC,
            goldPriceFeed,
            goldReserveFeed,
            goldMinter,
        };
    };

    it('deploy', async function () {
        const { goldToken, USDT, USDC, goldPriceFeed, goldReserveFeed, goldMinter } =
            await loadFixture(minterFixture);

        expect(await goldMinter.goldToken()).to.equal(goldToken.target);
        expect(await goldMinter.USDT()).to.equal(USDT.target);
        expect(await goldMinter.USDC()).to.equal(USDC.target);

        expect(await goldPriceFeed.latestAnswer()).to.equal(GOLD_PRICE);
        expect(await goldReserveFeed.latestAnswer()).to.equal(GOLD_RESERVE);

        expect(await goldMinter.slippage()).to.equal(500);
        expect(await goldMinter.fees()).to.equal(50);
    });

    it('getGoldAmount', async function () {
        const { USDT, goldMinter } = await loadFixture(minterFixture);

        // One Gold worth USD => should equal one gold
        expect(await goldMinter.getGoldAmount(USDT.target, GOLD_PRICE_IN_USD_TOKEN)).to.equal(
            parseEther('1'),
        );

        expect(await goldMinter.getGoldAmount(USDT.target, GOLD_PRICE_IN_USD_TOKEN / 2n)).to.equal(
            parseEther('1') / 2n,
        );
    });

    it('getUsdAmount', async function () {
        const { USDT, goldMinter } = await loadFixture(minterFixture);

        expect(await goldMinter.getUsdAmount(USDT.target, parseEther('1'))).to.equal(GOLD_PRICE_IN_USD_TOKEN);

        expect(await goldMinter.getUsdAmount(USDT.target, parseEther('1') / 2n)).to.equal(
            GOLD_PRICE_IN_USD_TOKEN / 2n,
        );
    });

    it('canMint', async function () {
        const { goldMinter } = await loadFixture(minterFixture);

        expect(await goldMinter.canMint(GOLD_RESERVE_IN_TOKEN)).to.be.true;
        expect(await goldMinter.canMint(GOLD_RESERVE_IN_TOKEN + 1n)).to.be.false;
    });

    // Try buying gold with given Tether
    it('requestMint', async function () {
        const [, buyer] = await getSigners();

        const { USDT, goldToken, goldMinter } = await loadFixture(minterFixture);

        // 1. Set buyer level to approved
        await goldMinter.setLevel(buyer.address, 2);

        // 2. Approve Buyer's USDT to spend
        const { serialized } = await permit(
            USDT.connect(buyer),
            goldMinter,
            GOLD_PRICE_IN_USD_TOKEN,
            MaxUint256,
        );

        // 3. Order Gold using Buyer's USDT (USDT is deposited on the contract)
        await goldMinter
            .connect(buyer)
            .requestMintPermit(USDT.target, GOLD_PRICE_IN_USD_TOKEN, parseEther('1'), MaxUint256, serialized);

        // 4. Settle order
        await goldMinter.settleMint(0n, parseEther('1'));

        // 5. Check balance (excluding 0.5% default fee)
        const amountExFee = (parseEther('1') * (10000n - (await goldMinter.fees()))) / 10000n;

        expect(await goldToken.balanceOf(buyer.address)).equals(amountExFee);
    });

    // Try selling gold
    it('requestBurn', async function () {
        const [, buyer] = await getSigners();

        // 0. Buy gold first
        const { USDT, goldToken, goldMinter } = await loadFixture(minterFixture);
        await goldMinter.setLevel(buyer.address, 2);
        await USDT.connect(buyer).approve(goldMinter.target, MaxUint256);
        await goldMinter.connect(buyer).requestMint(USDT.target, GOLD_PRICE_IN_USD_TOKEN, parseEther('1'));
        await goldMinter.settleMint(0n, parseEther('1'));

        const amountExFee = await goldToken.balanceOf(buyer.address);
        const expectedOutput = await goldMinter.getUsdAmount(USDT.target, amountExFee);

        // 1. Approve Gold to spend
        await goldToken.connect(buyer).approve(goldMinter.target, MaxUint256);

        // 2. Make sell order of bought Gold tokens
        await goldMinter.connect(buyer).requestBurn(USDT.target, amountExFee, expectedOutput);

        // 3. Approve from USD treasury account to pay
        await USDT.approve(goldMinter.target, expectedOutput);

        // 4. Settle order
        await goldMinter.settleBurn(0n, expectedOutput);

        expect(await goldToken.balanceOf(buyer.address)).equals(0n);
        expect(await goldToken.balanceOf(goldMinter.target)).equals(0n);
    });
});
