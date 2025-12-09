import { expect } from 'chai';

import { parseUnits, parseEther, maxUint256, getAddress, encodeFunctionData } from 'viem';
import { getClients, signPermitERC2612 } from './helpers.js';

const GOLD_PRICE = parseUnits('4198.21', 8); // Oracle price (per ounce)
const GRAMS_PER_OUNCE = parseUnits('31.1034768', 8); // Same as contract constant
// Calculate gram-based price: (Oracle ounce price * 1e8) / grams per ounce / 100 (8 decimals to 6 decimals)
const GOLD_PRICE_IN_USD_TOKEN = (GOLD_PRICE * parseUnits('1', 8)) / GRAMS_PER_OUNCE / 100n;

const fixtureData = {
    USDTMintAmt: 100000,
    USDTTransferAmt: 10000,
    USDCMintAmt: 100000,
    USDCTransferAmt: 10000,
    goldMintAmt: 1,
    goldSellAmt: 1,
};

describe('GoldMinter - Emergency Pause & AML', function () {
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

        await USDT.write.approve([goldMinter.address, maxUint256], {
            account: owner.account,
        });
        await USDC.write.approve([goldMinter.address, maxUint256], {
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
            viem,
        };
    };

    describe('Emergency Pause Functionality', function () {
        it('should allow owner to pause and unpause contract', async function () {
            const { owner, goldMinter } = await fixture();

            expect(await goldMinter.read.paused()).to.be.false;

            await goldMinter.write.emergencyPause({ account: owner.account });
            expect(await goldMinter.read.paused()).to.be.true;

            await goldMinter.write.emergencyUnpause({ account: owner.account });
            expect(await goldMinter.read.paused()).to.be.false;
        });

        it('should prevent mint when paused', async function () {
            const { owner, buyer, USDT, goldMinter, viem } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: owner.account,
            });

            await USDT.write.approve([goldMinter.address, GOLD_PRICE_IN_USD_TOKEN], {
                account: buyer.account,
            });

            await goldMinter.write.emergencyPause({ account: owner.account });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMint(
                    [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
                    { account: buyer.account },
                ),
                goldMinter,
                'EnforcedPause',
            );
        });

        it('should prevent burn when paused', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

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

            const goldBalance = await goldToken.read.balanceOf([buyer.account.address]);
            const expectedOutput = await goldMinter.read.getUsdAmount([USDT.address, goldBalance]);

            await goldToken.write.approve([goldMinter.address, maxUint256], {
                account: buyer.account,
            });

            await goldMinter.write.emergencyPause({ account: owner.account });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, goldBalance, expectedOutput], {
                    account: buyer.account,
                }),
                goldMinter,
                'EnforcedPause',
            );
        });

        it('should allow trading after unpause', async function () {
            const { owner, buyer, USDT, goldMinter } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: owner.account,
            });

            await goldMinter.write.emergencyPause({ account: owner.account });
            await goldMinter.write.emergencyUnpause({ account: owner.account });

            await USDT.write.approve([goldMinter.address, GOLD_PRICE_IN_USD_TOKEN], {
                account: buyer.account,
            });

            await goldMinter.write.requestMint(
                [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
                { account: buyer.account },
            );

            const goldBalance = await goldMinter.read.goldToken();
            expect(goldBalance).to.not.equal(0);
        });

        it('should only allow owner to pause/unpause', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.emergencyPause({ account: buyer.account }),
                goldMinter,
                'OwnableUnauthorizedAccount',
                [getAddress(buyer.account.address)],
            );

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.emergencyPause({ account: buyer.account }),
                goldMinter,
                'OwnableUnauthorizedAccount',
                [getAddress(buyer.account.address)],
            );

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.emergencyUnpause({ account: buyer.account }),
                goldMinter,
                'OwnableUnauthorizedAccount',
                [getAddress(buyer.account.address)],
            );
        });
    });

    describe('AML Blacklist Functionality', function () {
        it('should allow settlers to add/remove users from AML blacklist', async function () {
            const { owner, buyer, goldMinter } = await fixture();

            expect(await goldMinter.read.isAMLBlacklisted([buyer.account.address])).to.be.false;

            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });
            expect(await goldMinter.read.isAMLBlacklisted([buyer.account.address])).to.be.true;

            await goldMinter.write.setAMLBlacklist([buyer.account.address, false], {
                account: owner.account,
            });
            expect(await goldMinter.read.isAMLBlacklisted([buyer.account.address])).to.be.false;
        });

        it('should prevent blacklisted user from minting', async function () {
            const { owner, buyer, USDT, goldMinter, viem } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: owner.account,
            });

            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });

            await USDT.write.approve([goldMinter.address, GOLD_PRICE_IN_USD_TOKEN], {
                account: buyer.account,
            });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMint(
                    [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
                    { account: buyer.account },
                ),
                goldMinter,
                'AMLBlocked',
            );
        });

        it('should prevent blacklisted user from burning', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: owner.account,
            });

            const agtAmt = GOLD_PRICE_IN_USD_TOKEN * 2n;

            // Calculate expected AGT amount before fees
            const expectedAGT = Number(await goldMinter.read.getGoldAmount([USDT.address, agtAmt]));

            // Calculate expected fee
            const expectedFee = await goldMinter.read.calculateGoldFee([expectedAGT]);

            const expectedAGTAfterFee = Number(expectedAGT) - Number(expectedFee);

            await USDT.write.approve([goldMinter.address, agtAmt], {
                account: buyer.account,
            });

            await goldMinter.write.requestMint([USDT.address, agtAmt, expectedAGTAfterFee], {
                // Allow small tolerance
                account: buyer.account,
            });

            const goldBalance = await goldToken.read.balanceOf([buyer.account.address]);

            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });

            await goldToken.write.approve([goldMinter.address, maxUint256], {
                account: buyer.account,
            });

            const expectedOutput = await goldMinter.read.getUsdAmount([USDT.address, goldBalance]);

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, goldBalance, expectedOutput], {
                    account: buyer.account,
                }),
                goldMinter,
                'AMLBlocked',
            );
        });

        it('should allow trading after removing from blacklist', async function () {
            const { owner, buyer, USDT, goldMinter } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: owner.account,
            });

            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });
            await goldMinter.write.setAMLBlacklist([buyer.account.address, false], {
                account: owner.account,
            });

            await USDT.write.approve([goldMinter.address, GOLD_PRICE_IN_USD_TOKEN], {
                account: buyer.account,
            });

            await goldMinter.write.requestMint(
                [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
                { account: buyer.account },
            );

            const goldBalance = await goldMinter.read.goldToken();
            expect(goldBalance).to.not.equal(0);
        });

        it('should prevent permit mint for blacklisted user', async function () {
            const { owner, buyer, USDT, goldMinter, viem } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: owner.account,
            });

            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });

            const signature = await signPermitERC2612({
                token: USDT,
                owner: buyer,
                spender: goldMinter.address,
                value: GOLD_PRICE_IN_USD_TOKEN,
                deadline: maxUint256,
            });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMintPermit(
                    [
                        USDT.address,
                        GOLD_PRICE_IN_USD_TOKEN,
                        parseEther(String(fixtureData.goldMintAmt)),
                        maxUint256,
                        signature,
                    ],
                    { account: buyer.account },
                ),
                goldMinter,
                'AMLBlocked',
            );
        });

        it('should only allow settlers to manage AML blacklist', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            await viem.assertions.revertWith(
                goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                    account: buyer.account,
                }),
                'NOT_SETTLER',
            );
        });
    });

    describe('Combined Emergency and AML', function () {
        it('should work correctly when both paused and blacklisted', async function () {
            const { owner, buyer, USDT, goldMinter, viem } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: owner.account,
            });

            await goldMinter.write.emergencyPause({ account: owner.account });
            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });

            await USDT.write.approve([goldMinter.address, GOLD_PRICE_IN_USD_TOKEN], {
                account: buyer.account,
            });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMint(
                    [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
                    { account: buyer.account },
                ),
                goldMinter,
                'EnforcedPause',
            );

            await goldMinter.write.emergencyUnpause({ account: owner.account });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMint(
                    [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
                    { account: buyer.account },
                ),
                goldMinter,
                'AMLBlocked',
            );

            await goldMinter.write.setAMLBlacklist([buyer.account.address, false], {
                account: owner.account,
            });

            await goldMinter.write.requestMint(
                [USDT.address, GOLD_PRICE_IN_USD_TOKEN, parseEther(String(fixtureData.goldMintAmt))],
                { account: buyer.account },
            );

            const goldBalance = await goldMinter.read.goldToken();
            expect(goldBalance).to.not.equal(0);
        });
    });
});
