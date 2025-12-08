import { expect } from 'chai';

import { parseUnits, parseEther, getAddress, encodeFunctionData } from 'viem';
import { getClients } from './helpers.js';

const GOLD_PRICE = parseUnits('3362.61', 8);
const GOLD_PRICE_IN_USD_TOKEN = parseUnits('3362.61', 6);

const fixtureData = {
    USDTMintAmt: 100000,
    USDTTransferAmt: 10000,
    USDCMintAmt: 100000,
    USDCTransferAmt: 10000,
    goldMintAmt: 1,
};

describe('GoldMinter - Upgrade Tests', function () {
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

        // Deploy initial implementation
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
                true,
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
            goldMinterProxy,
            goldMinterImpl,
            viem,
        };
    };

    it('should preserve state during upgrade', async function () {
        const { owner, buyer, goldMinter, goldMinterProxy, viem } = await fixture();

        // Set some state in the original contract
        await goldMinter.write.setLevel([buyer.account.address, 2], {
            account: owner.account,
        });

        await goldMinter.write.updateSlippage([300], {
            account: owner.account,
        });

        await goldMinter.write.updateFees([75], {
            account: owner.account,
        });

        await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
            account: owner.account,
        });

        // Store initial state values
        const initialSlippage = await goldMinter.read.slippage();
        const initialFees = await goldMinter.read.fees();
        const initialAMLStatus = await goldMinter.read.isAMLBlacklisted([buyer.account.address]);

        expect(initialSlippage).to.equal(300);
        expect(initialFees).to.equal(75);
        expect(initialAMLStatus).to.be.true;

        // Deploy new implementation
        const newGoldMinterImpl = await viem.deployContract('GoldMinter');

        // Upgrade the proxy to new implementation
        await goldMinterProxy.write.upgradeToAndCall([newGoldMinterImpl.address, '0x'], {
            account: owner.account,
        });

        // Verify contract is still accessible with same interface
        const upgradedGoldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

        // Check that state was preserved
        const preservedSlippage = await upgradedGoldMinter.read.slippage();
        const preservedFees = await upgradedGoldMinter.read.fees();
        const preservedAMLStatus = await upgradedGoldMinter.read.isAMLBlacklisted([buyer.account.address]);

        expect(preservedSlippage).to.equal(initialSlippage);
        expect(preservedFees).to.equal(initialFees);
        expect(preservedAMLStatus).to.equal(initialAMLStatus);

        // Verify functionality still works
        await upgradedGoldMinter.write.updateSlippage([250], {
            account: owner.account,
        });

        expect(await upgradedGoldMinter.read.slippage()).to.equal(250);
    });

    it('should allow owner to upgrade implementation', async function () {
        const { owner, goldMinterProxy, viem } = await fixture();

        const initialImpl = await goldMinterProxy.read.implementation();

        // Deploy new implementation
        const newGoldMinterImpl = await viem.deployContract('GoldMinter');

        // Upgrade should succeed for owner
        await goldMinterProxy.write.upgradeToAndCall([newGoldMinterImpl.address, '0x'], {
            account: owner.account,
        });

        const newImpl = await goldMinterProxy.read.implementation();
        expect(newImpl).to.not.equal(initialImpl);
        expect(newImpl).to.equal(getAddress(newGoldMinterImpl.address));
    });

    it('should prevent non-owner from upgrading', async function () {
        const { buyer, goldMinterProxy, viem } = await fixture();

        // Deploy new implementation
        const newGoldMinterImpl = await viem.deployContract('GoldMinter');

        // Non-owner upgrade should fail
        await viem.assertions.revertWith(
            goldMinterProxy.write.upgradeToAndCall([newGoldMinterImpl.address, '0x'], {
                account: buyer.account,
            }),
            'NOT_ADMIN',
        );
    });

    it('should maintain functionality after upgrade', async function () {
        const { owner, buyer, USDT, goldToken, goldMinter, goldMinterProxy, viem } = await fixture();

        // Perform a mint operation before upgrade
        await goldMinter.write.setLevel([buyer.account.address, 2], {
            account: owner.account,
        });

        await USDT.write.approve([goldMinter.address, GOLD_PRICE_IN_USD_TOKEN], {
            account: buyer.account,
        });

        await goldMinter.write.requestMint(
            [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
            { account: buyer.account },
        );

        const balanceBeforeUpgrade = await goldToken.read.balanceOf([buyer.account.address]);

        // Deploy and upgrade to new implementation
        const newGoldMinterImpl = await viem.deployContract('GoldMinter');

        await goldMinterProxy.write.upgradeToAndCall([newGoldMinterImpl.address, '0x'], {
            account: owner.account,
        });

        const upgradedGoldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

        // Verify balance is preserved
        const balanceAfterUpgrade = await goldToken.read.balanceOf([buyer.account.address]);
        expect(balanceAfterUpgrade).to.equal(balanceBeforeUpgrade);

        // Perform another mint operation after upgrade
        await USDT.write.approve([upgradedGoldMinter.address, GOLD_PRICE_IN_USD_TOKEN], {
            account: buyer.account,
        });

        await upgradedGoldMinter.write.requestMint(
            [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
            { account: buyer.account },
        );

        // Verify new mint worked
        const finalBalance = await goldToken.read.balanceOf([buyer.account.address]);
        expect(finalBalance).to.be.greaterThan(Number(balanceAfterUpgrade));
    });

    it('should preserve storage layout compatibility', async function () {
        const { owner, buyer, goldMinter, goldMinterProxy, viem } = await fixture();

        // Set complex state across different storage variables
        await goldMinter.write.setLevel([buyer.account.address, 1], {
            account: owner.account,
        });

        await goldMinter.write.updateMinGold([parseEther('0.05')], {
            account: owner.account,
        });

        await goldMinter.write.updateMinGoldFee([parseEther('0.02')], {
            account: owner.account,
        });

        // Store all state values
        const preUpgradeState = {
            goldToken: await goldMinter.read.goldToken(),
            USDT: await goldMinter.read.USDT(),
            USDC: await goldMinter.read.USDC(),
            slippage: await goldMinter.read.slippage(),
            fees: await goldMinter.read.fees(),
        };

        // Upgrade implementation
        const newGoldMinterImpl = await viem.deployContract('GoldMinter');
        await goldMinterProxy.write.upgradeToAndCall([newGoldMinterImpl.address, '0x'], {
            account: owner.account,
        });

        const upgradedGoldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

        // Verify all state is preserved exactly
        const postUpgradeState = {
            goldToken: await upgradedGoldMinter.read.goldToken(),
            USDT: await upgradedGoldMinter.read.USDT(),
            USDC: await upgradedGoldMinter.read.USDC(),
            slippage: await upgradedGoldMinter.read.slippage(),
            fees: await upgradedGoldMinter.read.fees(),
        };

        expect(postUpgradeState.goldToken).to.equal(preUpgradeState.goldToken);
        expect(postUpgradeState.USDT).to.equal(preUpgradeState.USDT);
        expect(postUpgradeState.USDC).to.equal(preUpgradeState.USDC);
        expect(postUpgradeState.slippage).to.equal(preUpgradeState.slippage);
        expect(postUpgradeState.fees).to.equal(preUpgradeState.fees);
    });

    it('should successfully upgrade multiple times', async function () {
        const { owner, goldMinterProxy, viem } = await fixture();

        const originalImpl = await goldMinterProxy.read.implementation();

        // First upgrade
        const newGoldMinterImpl1 = await viem.deployContract('GoldMinter');
        await goldMinterProxy.write.upgradeToAndCall([newGoldMinterImpl1.address, '0x'], {
            account: owner.account,
        });

        const firstUpgradeImpl = await goldMinterProxy.read.implementation();
        expect(firstUpgradeImpl).to.not.equal(originalImpl);
        expect(firstUpgradeImpl).to.equal(getAddress(newGoldMinterImpl1.address));

        // Second upgrade
        const newGoldMinterImpl2 = await viem.deployContract('GoldMinter');
        await goldMinterProxy.write.upgradeToAndCall([newGoldMinterImpl2.address, '0x'], {
            account: owner.account,
        });

        const secondUpgradeImpl = await goldMinterProxy.read.implementation();
        expect(secondUpgradeImpl).to.not.equal(firstUpgradeImpl);
        expect(secondUpgradeImpl).to.equal(getAddress(newGoldMinterImpl2.address));

        // Verify functionality still works after multiple upgrades
        const finalGoldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

        // Test a simple state change
        await finalGoldMinter.write.updateSlippage([400], {
            account: owner.account,
        });

        expect(await finalGoldMinter.read.slippage()).to.equal(400);
    });
});
