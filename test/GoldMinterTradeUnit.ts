/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { parseUnits, parseEther, maxUint256, encodeFunctionData } from 'viem';
import { getClients } from './helpers.js';

const GOLD_PRICE = parseUnits('4096.342', 8);

const TRADE_UNIT_1KG = parseEther('1000');
const TRADE_UNIT_100G = parseEther('100');
const TRADE_UNIT_1G = parseEther('1');

describe('GoldMinter TradeUnit', function () {
    const fixture = async () => {
        const { owner, buyer, bob, viem } = await getClients();

        // Mock tokens
        const USDT = await viem.deployContract('ERC20Mock', [
            'Tether USD',
            'USDT',
            6,
            parseUnits('100000000', 6),
        ]);

        // BlacklistOracle
        const boImpl = await viem.deployContract('BlacklistOracle', []);
        const boProxy = await viem.deployContract('InitializableProxy', []);
        await boProxy.write.initializeProxy(
            [
                'Blacklist Oracle',
                owner.account.address,
                boImpl.address,
                encodeFunctionData({
                    abi: boImpl.abi,
                    functionName: 'initializeOracle',
                    args: ['Blacklist Oracle', owner.account.address],
                }),
            ],
            { account: owner.account },
        );

        // GoldToken
        const gtImpl = await viem.deployContract('GoldToken', []);
        const gtProxy = await viem.deployContract('InitializableProxy', []);
        await gtProxy.write.initializeProxy(
            [
                'Ontorium Gold Token',
                owner.account.address,
                gtImpl.address,
                encodeFunctionData({
                    abi: gtImpl.abi,
                    functionName: 'initializeGoldToken',
                    args: [owner.account.address, boProxy.address],
                }),
            ],
            { account: owner.account },
        );
        const goldToken = await viem.getContractAt('GoldToken', gtProxy.address);

        // PriceFeed
        const pfImpl = await viem.deployContract('DataFeed');
        const pfProxy = await viem.deployContract('InitializableProxy', []);
        await pfProxy.write.initializeProxy(
            [
                'DataFeed',
                owner.account.address,
                pfImpl.address,
                encodeFunctionData({
                    abi: pfImpl.abi,
                    functionName: 'initializeFeed',
                    args: [owner.account.address, gtProxy.address, 'OXAU / USD'],
                }),
            ],
            { account: owner.account },
        );
        const goldPriceFeed = await viem.getContractAt('DataFeed', pfProxy.address);
        await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });

        // GoldMinter (autoSettle=true)
        const gmImpl = await viem.deployContract('GoldMinter');
        const gmProxy = await viem.deployContract('InitializableProxy', []);
        await gmProxy.write.initializeProxy(
            [
                'GoldMinter',
                owner.account.address,
                gmImpl.address,
                encodeFunctionData({
                    abi: gmImpl.abi,
                    functionName: 'initializeGoldMinter',
                    args: [
                        gtProxy.address,
                        USDT.address,
                        USDT.address, // USDC = USDT for simplicity
                        pfProxy.address,
                        owner.account.address, // usdRecipient
                        owner.account.address, // feeRecipient
                        owner.account.address,
                        true, // autoSettle
                    ],
                }),
            ],
            { account: owner.account },
        );
        const goldMinter = await viem.getContractAt('GoldMinter', gmProxy.address);

        // Roles
        await goldToken.write.addMinter([goldMinter.address], { account: owner.account });
        const SETTLER_ROLE = await goldMinter.read.SETTLER_ROLE();
        const PARAMETER_MANAGER_ROLE = await goldMinter.read.PARAMETER_MANAGER_ROLE();
        const KYC_MANAGER_ROLE = await goldMinter.read.KYC_MANAGER_ROLE();
        await goldMinter.write.grantRole([SETTLER_ROLE, owner.account.address], { account: owner.account });
        await goldMinter.write.grantRole([PARAMETER_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });
        await goldMinter.write.grantRole([KYC_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });

        // The contract defaults were changed to 1kg units, but this test verifies various
        // tradeUnit sizes (1g, 100g, 1kg), so revert the minimum values back to 1g basis.
        await goldMinter.write.updateMinMintAmount([parseEther('1')], { account: owner.account });
        await goldMinter.write.updateMinRedeemAmount([parseEther('1')], { account: owner.account });
        await goldMinter.write.updateMinGoldFee([parseEther('0.01')], { account: owner.account });
        await goldMinter.write.updateMinGoldFeeAmount([parseEther('1')], { account: owner.account });

        // KYC + funds for buyer
        await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });
        await USDT.write.transfer([buyer.account.address, parseUnits('10000000', 6)], {
            account: owner.account,
        });
        await USDT.write.approve([goldMinter.address, maxUint256], { account: buyer.account });
        await goldToken.write.approve([goldMinter.address, maxUint256], { account: buyer.account });

        // usdRecipient (owner) approve for redeem settlement
        await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });

        return { owner, buyer, bob, goldToken, USDT, goldPriceFeed, goldMinter, viem };
    };

    describe('Mint — tradeUnit default mode', function () {
        it('1kg mint — gross gold is exactly 1kg, buyer receives net gold', async function () {
            const f = await fixtureWithTradeUnit();
            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;
            const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;

            const goldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            const goldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            const received = goldAfter - goldBefore;

            expect(received).to.equal(grossGold - fee);
            expect(received + fee).to.equal(grossGold);
        });
    });

    // Shared fixture with tradeUnit pre-set
    const fixtureWithTradeUnit = async (tradeUnit: bigint = TRADE_UNIT_1KG) => {
        const f = await fixture();
        await f.goldMinter.write.updateTradeUnit([tradeUnit], { account: f.owner.account });
        return f;
    };

    // Helper: mint gold for user
    async function mintForBuyer(f: any, units: bigint, tradeUnit: bigint = TRADE_UNIT_1KG) {
        const grossGold = units * tradeUnit;
        const requiredUsd = (await f.goldMinter.read.getRequiredUsd([f.USDT.address, grossGold])) as bigint;
        await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
            account: f.buyer.account,
        });
        return grossGold;
    }

    describe('2. Various unit mints', function () {
        for (const units of [1n, 2n, 3n, 5n, 10n]) {
            it(`${units}kg mint success`, async function () {
                const f = await fixtureWithTradeUnit();
                const grossGold = units * TRADE_UNIT_1KG;
                const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                    f.USDT.address,
                    grossGold,
                ])) as bigint;
                const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;

                const goldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

                await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                    account: f.buyer.account,
                });

                const goldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
                expect(goldAfter - goldBefore).to.equal(grossGold - fee);
            });
        }
    });

    describe('3. Non-multiple amounts rejected', function () {
        it('500g mint rejected (tradeUnit=1kg)', async function () {
            const f = await fixtureWithTradeUnit();
            const invalidAmount = parseEther('500');

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestMint([f.USDT.address, parseUnits('1000000', 6), invalidAmount], {
                    account: f.buyer.account,
                }),
                f.goldMinter,
                'NotTradeUnitMultiple',
            );
        });

        it('1500g mint rejected (tradeUnit=1kg)', async function () {
            const f = await fixtureWithTradeUnit();

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestMint(
                    [f.USDT.address, parseUnits('1000000', 6), parseEther('1500')],
                    {
                        account: f.buyer.account,
                    },
                ),
                f.goldMinter,
                'NotTradeUnitMultiple',
            );
        });

        it('0g mint rejected', async function () {
            const f = await fixtureWithTradeUnit();

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestMint([f.USDT.address, parseUnits('1000000', 6), 0n], {
                    account: f.buyer.account,
                }),
                f.goldMinter,
                'NotTradeUnitMultiple',
            );
        });
    });

    // 4. Redeem tradeUnit validation

    describe('4. Redeem tradeUnit validation', function () {
        it('1kg redeem success', async function () {
            const f = await fixtureWithTradeUnit();
            await mintForBuyer(f, 2n);

            const redeemGold = TRADE_UNIT_1KG;
            const fee = (await f.goldMinter.read.calculateGoldFee([redeemGold, false])) as bigint;
            const expectedUsd = (await f.goldMinter.read.getUsdAmount([
                f.USDT.address,
                redeemGold - fee,
            ])) as bigint;
            const minUsd = (expectedUsd * 9500n) / 10000n;

            const goldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            await f.goldMinter.write.requestBurn([f.USDT.address, redeemGold, minUsd], {
                account: f.buyer.account,
            });

            const goldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            // buyer gold should decrease (fee goes to feeRecipient)
            expect(goldBefore - goldAfter).to.be.greaterThan(0);
        });

        it('500g redeem rejected (tradeUnit=1kg)', async function () {
            const f = await fixtureWithTradeUnit();
            await mintForBuyer(f, 1n);

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestBurn([f.USDT.address, parseEther('500'), 0n], {
                    account: f.buyer.account,
                }),
                f.goldMinter,
                'NotTradeUnitMultiple',
            );
        });

        it('0g redeem rejected', async function () {
            const f = await fixtureWithTradeUnit();

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestBurn([f.USDT.address, 0n, 0n], {
                    account: f.buyer.account,
                }),
                f.goldMinter,
                'NotTradeUnitMultiple',
            );
        });
    });

    // 5. USD cap protection (InsufficientUsdAmount)

    describe('5. USD cap protection', function () {
        it('_usdAmount < requiredUsd should revert', async function () {
            const f = await fixtureWithTradeUnit();
            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            // set 1 wei less than required
            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestMint([f.USDT.address, requiredUsd - 1n, grossGold], {
                    account: f.buyer.account,
                }),
                f.goldMinter,
                'InsufficientUsdAmount',
            );
        });

        it('_usdAmount == requiredUsd should succeed', async function () {
            const f = await fixtureWithTradeUnit();
            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            // exactly requiredUsd
            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });
        });

        it('_usdAmount > requiredUsd should succeed (excess not transferred)', async function () {
            const f = await fixtureWithTradeUnit();
            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            const usdBefore = (await f.USDT.read.balanceOf([f.buyer.account.address])) as bigint;

            // set 2x
            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd * 2n, grossGold], {
                account: f.buyer.account,
            });

            const usdAfter = (await f.USDT.read.balanceOf([f.buyer.account.address])) as bigint;
            // actual transfer = requiredUsd (not 2x)
            expect(usdBefore - usdAfter).to.equal(requiredUsd);
        });
    });

    // 6. getRequiredUsd ↔ getGoldAmount consistency

    describe('6. getRequiredUsd ↔ getGoldAmount consistency', function () {
        it('getGoldAmount(getRequiredUsd(G)) >= G', async function () {
            const f = await fixtureWithTradeUnit();

            for (const units of [1n, 2n, 5n, 10n]) {
                const G = units * TRADE_UNIT_1KG;
                const U = (await f.goldMinter.read.getRequiredUsd([f.USDT.address, G])) as bigint;
                const G2 = (await f.goldMinter.read.getGoldAmount([f.USDT.address, U])) as bigint;
                expect(G2 >= G).to.be.true;
            }
        });
    });

    // 7. Fee accuracy

    describe('7. Fee accuracy', function () {
        it('1kg mint fee = 1000g × 0.25% = 2.5g', async function () {
            const f = await fixtureWithTradeUnit();
            const fee = (await f.goldMinter.read.calculateGoldFee([TRADE_UNIT_1KG, true])) as bigint;
            expect(fee).to.equal(parseEther('2.5'));
        });

        it('5kg mint fee = 5000g × 0.25% = 12.5g', async function () {
            const f = await fixtureWithTradeUnit();
            const fee = (await f.goldMinter.read.calculateGoldFee([5n * TRADE_UNIT_1KG, true])) as bigint;
            expect(fee).to.equal(parseEther('12.5'));
        });

        it('gross - fee = gold received by buyer', async function () {
            const f = await fixtureWithTradeUnit();
            const grossGold = TRADE_UNIT_1KG;
            const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            const goldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            const goldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            expect(goldAfter - goldBefore).to.equal(grossGold - fee);
        });
    });

    // 8. Mode switching (tradeUnit → 0 → tradeUnit)

    describe('8. Mode switching', function () {
        it('tradeUnit=1kg → 0 → 1kg switching works correctly in each mode', async function () {
            const f = await fixture();

            // Phase 1: tradeUnit = 1kg
            await f.goldMinter.write.updateTradeUnit([TRADE_UNIT_1KG], { account: f.owner.account });
            expect(await f.goldMinter.read.tradeUnit()).to.equal(TRADE_UNIT_1KG);

            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                TRADE_UNIT_1KG,
            ])) as bigint;
            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, TRADE_UNIT_1KG], {
                account: f.buyer.account,
            });

            // Phase 2: tradeUnit = 0 (free mode)
            await f.goldMinter.write.updateTradeUnit([0n], { account: f.owner.account });
            expect(await f.goldMinter.read.tradeUnit()).to.equal(0n);

            // 500g mint possible in free mode
            const usdFor500g = parseUnits('70000', 6);
            const expectedGold = (await f.goldMinter.read.getGoldAmount([
                f.USDT.address,
                usdFor500g,
            ])) as bigint;
            const expectedFee = (await f.goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, usdFor500g, expectedGold - expectedFee], {
                account: f.buyer.account,
            });

            // Phase 3: tradeUnit = 1kg again
            await f.goldMinter.write.updateTradeUnit([TRADE_UNIT_1KG], { account: f.owner.account });

            // 500g rejected again
            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestMint(
                    [f.USDT.address, parseUnits('1000000', 6), parseEther('500')],
                    {
                        account: f.buyer.account,
                    },
                ),
                f.goldMinter,
                'NotTradeUnitMultiple',
            );

            // 1kg succeeds again
            const requiredUsd2 = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                TRADE_UNIT_1KG,
            ])) as bigint;
            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd2, TRADE_UNIT_1KG], {
                account: f.buyer.account,
            });
        });
    });

    // 9. Manual Settlement + mode switching

    describe('9. Manual Settlement + mode switching', function () {
        it('order at tradeUnit=1kg → change to tradeUnit=0 → existing order settles correctly', async function () {
            const f = await fixture();

            // disable autoSettle
            await f.goldMinter.write.updateAutoSettle([], { account: f.owner.account });
            await f.goldMinter.write.updateTradeUnit([TRADE_UNIT_1KG], { account: f.owner.account });

            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;
            const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;

            const goldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            // create order (tradeUnit=1kg active)
            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            // not yet settled
            expect((await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint).to.equal(
                goldBefore,
            );

            // change tradeUnit to 0
            await f.goldMinter.write.updateTradeUnit([0n], { account: f.owner.account });

            // settle existing order (settler)
            const nonces = (await f.goldMinter.read.getUserMintNonces([
                f.buyer.account.address,
                0n,
                100n,
            ])) as bigint[];
            await f.goldMinter.write.settleMint([nonces[nonces.length - 1]], {
                account: f.owner.account,
            });

            // verify gold received after settlement — settled per request-time conditions (1kg)
            const goldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            expect(goldAfter - goldBefore).to.equal(grossGold - fee);
        });
    });

    // 10. Various tradeUnit sizes

    describe('10. Various tradeUnit sizes', function () {
        it('tradeUnit=100g — 300g mint success', async function () {
            const f = await fixtureWithTradeUnit(TRADE_UNIT_100G);
            const grossGold = 3n * TRADE_UNIT_100G; // 300g
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;
            const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;

            const goldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });
            const goldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            expect(goldAfter - goldBefore).to.equal(grossGold - fee);
        });

        it('tradeUnit=100g — 150g mint rejected', async function () {
            const f = await fixtureWithTradeUnit(TRADE_UNIT_100G);

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestMint(
                    [f.USDT.address, parseUnits('1000000', 6), parseEther('150')],
                    {
                        account: f.buyer.account,
                    },
                ),
                f.goldMinter,
                'NotTradeUnitMultiple',
            );
        });

        it('tradeUnit=1g — 7g mint success', async function () {
            const f = await fixtureWithTradeUnit(TRADE_UNIT_1G);
            const grossGold = 7n * TRADE_UNIT_1G;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });
        });
    });

    // 11. Access control

    describe('11. Access control', function () {
        it('only PARAMETER_MANAGER can call updateTradeUnit', async function () {
            const f = await fixture();

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.updateTradeUnit([TRADE_UNIT_1KG], { account: f.buyer.account }),
                f.goldMinter,
                'AccessControlUnauthorizedAccount',
            );
        });

        it('PARAMETER_MANAGER can updateTradeUnit successfully', async function () {
            const f = await fixture();
            await f.goldMinter.write.updateTradeUnit([TRADE_UNIT_1KG], { account: f.owner.account });
            expect(await f.goldMinter.read.tradeUnit()).to.equal(TRADE_UNIT_1KG);
        });
    });

    // 12. Emergency Pause + tradeUnit

    describe('12. Emergency Pause + tradeUnit', function () {
        it('tradeUnit mint blocked during pause', async function () {
            const f = await fixtureWithTradeUnit();
            await f.goldMinter.write.emergencyPause([], { account: f.owner.account });

            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                    account: f.buyer.account,
                }),
                f.goldMinter,
                'EnforcedPause',
            );

            // succeeds after unpause
            await f.goldMinter.write.emergencyUnpause([], { account: f.owner.account });
            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });
        });
    });

    // 13. Various gold prices

    describe('13. Various gold prices', function () {
        const prices = [
            { price: parseUnits('2500.50', 8), label: '$2500.50/oz' },
            { price: parseUnits('4684.70', 8), label: '$4684.70/oz' },
            { price: parseUnits('5999.999999', 8), label: '$5999.999999/oz' },
        ];

        for (const { price, label } of prices) {
            it(`${label} — 1kg mint exact`, async function () {
                const f = await fixtureWithTradeUnit();

                await f.goldPriceFeed.write.updateAnswer([price], { account: f.owner.account });

                const grossGold = TRADE_UNIT_1KG;
                const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                    f.USDT.address,
                    grossGold,
                ])) as bigint;
                const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;

                const goldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

                await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                    account: f.buyer.account,
                });

                const goldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
                expect(goldAfter - goldBefore).to.equal(grossGold - fee);
            });
        }
    });

    // 14. tradeUnit=0 (free mode) no regression
    describe('14. tradeUnit=0 — free mode no regression', function () {
        it('free mode allows arbitrary amount mint', async function () {
            const f = await fixture(); // tradeUnit default = 0
            expect(await f.goldMinter.read.tradeUnit()).to.equal(0n);

            const usdAmount = parseUnits('500', 6);
            const expectedGold = (await f.goldMinter.read.getGoldAmount([
                f.USDT.address,
                usdAmount,
            ])) as bigint;
            const expectedFee = (await f.goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, usdAmount, expectedGold - expectedFee], {
                account: f.buyer.account,
            });

            const balance = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            expect(balance).to.be.greaterThan(0);
        });

        it('free mode allows non-multiple amounts', async function () {
            const f = await fixture();

            const usdAmount = parseUnits('777.77', 6);
            const expectedGold = (await f.goldMinter.read.getGoldAmount([
                f.USDT.address,
                usdAmount,
            ])) as bigint;
            const expectedFee = (await f.goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, usdAmount, expectedGold - expectedFee], {
                account: f.buyer.account,
            });
        });
    });

    // 15. Double settlement prevention

    describe('15. Double settlement prevention', function () {
        it('manual settle after auto-settle should revert', async function () {
            const f = await fixtureWithTradeUnit();

            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            // already settled via auto-settle. attempt manual settle
            const nonces = (await f.goldMinter.read.getUserMintNonces([
                f.buyer.account.address,
                0n,
                100n,
            ])) as bigint[];

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.settleMint([nonces[0]], { account: f.owner.account }),
                f.goldMinter,
                'AlreadySettled',
            );
        });
    });

    // 16. feeRecipient separation test

    describe('16. feeRecipient separation', function () {
        // bob = feeRecipient, owner = usdRecipient separated fixture
        const fixtureWithSeparateFee = async () => {
            const { owner, buyer, bob, viem } = await getClients();

            const USDT = await viem.deployContract('ERC20Mock', [
                'Tether USD',
                'USDT',
                6,
                parseUnits('100000000', 6),
            ]);

            const boImpl = await viem.deployContract('BlacklistOracle', []);
            const boProxy = await viem.deployContract('InitializableProxy', []);
            await boProxy.write.initializeProxy(
                [
                    'Blacklist Oracle',
                    owner.account.address,
                    boImpl.address,
                    encodeFunctionData({
                        abi: boImpl.abi,
                        functionName: 'initializeOracle',
                        args: ['Blacklist Oracle', owner.account.address],
                    }),
                ],
                { account: owner.account },
            );

            const gtImpl = await viem.deployContract('GoldToken', []);
            const gtProxy = await viem.deployContract('InitializableProxy', []);
            await gtProxy.write.initializeProxy(
                [
                    'Ontorium Gold Token',
                    owner.account.address,
                    gtImpl.address,
                    encodeFunctionData({
                        abi: gtImpl.abi,
                        functionName: 'initializeGoldToken',
                        args: [owner.account.address, boProxy.address],
                    }),
                ],
                { account: owner.account },
            );
            const goldToken = await viem.getContractAt('GoldToken', gtProxy.address);

            const pfImpl = await viem.deployContract('DataFeed');
            const pfProxy = await viem.deployContract('InitializableProxy', []);
            await pfProxy.write.initializeProxy(
                [
                    'DataFeed',
                    owner.account.address,
                    pfImpl.address,
                    encodeFunctionData({
                        abi: pfImpl.abi,
                        functionName: 'initializeFeed',
                        args: [owner.account.address, gtProxy.address, 'OXAU / USD'],
                    }),
                ],
                { account: owner.account },
            );
            const goldPriceFeed = await viem.getContractAt('DataFeed', pfProxy.address);
            await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });

            const gmImpl = await viem.deployContract('GoldMinter');
            const gmProxy = await viem.deployContract('InitializableProxy', []);
            await gmProxy.write.initializeProxy(
                [
                    'GoldMinter',
                    owner.account.address,
                    gmImpl.address,
                    encodeFunctionData({
                        abi: gmImpl.abi,
                        functionName: 'initializeGoldMinter',
                        args: [
                            gtProxy.address,
                            USDT.address,
                            USDT.address,
                            pfProxy.address,
                            owner.account.address, // usdRecipient = owner
                            bob.account.address, // feeRecipient = bob (separated)
                            owner.account.address, // admin
                            true,
                        ],
                    }),
                ],
                { account: owner.account },
            );
            const goldMinter = await viem.getContractAt('GoldMinter', gmProxy.address);

            await goldToken.write.addMinter([goldMinter.address], { account: owner.account });
            const SETTLER_ROLE = await goldMinter.read.SETTLER_ROLE();
            const PARAMETER_MANAGER_ROLE = await goldMinter.read.PARAMETER_MANAGER_ROLE();
            const INFRA_MANAGER_ROLE = await goldMinter.read.INFRA_MANAGER_ROLE();
            const KYC_MANAGER_ROLE = await goldMinter.read.KYC_MANAGER_ROLE();
            await goldMinter.write.grantRole([SETTLER_ROLE, owner.account.address], {
                account: owner.account,
            });
            await goldMinter.write.grantRole([PARAMETER_MANAGER_ROLE, owner.account.address], {
                account: owner.account,
            });
            await goldMinter.write.grantRole([INFRA_MANAGER_ROLE, owner.account.address], {
                account: owner.account,
            });
            await goldMinter.write.grantRole([KYC_MANAGER_ROLE, owner.account.address], {
                account: owner.account,
            });

            // Revert the 1kg unit defaults back to 1g basis (same reason as the fixture above)
            await goldMinter.write.updateMinMintAmount([parseEther('1')], { account: owner.account });
            await goldMinter.write.updateMinRedeemAmount([parseEther('1')], { account: owner.account });
            await goldMinter.write.updateMinGoldFee([parseEther('0.01')], { account: owner.account });
            await goldMinter.write.updateMinGoldFeeAmount([parseEther('1')], { account: owner.account });

            await goldMinter.write.updateTradeUnit([TRADE_UNIT_1KG], { account: owner.account });
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            await USDT.write.transfer([buyer.account.address, parseUnits('10000000', 6)], {
                account: owner.account,
            });
            await USDT.write.approve([goldMinter.address, maxUint256], { account: buyer.account });
            await goldToken.write.approve([goldMinter.address, maxUint256], { account: buyer.account });
            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });

            return { owner, buyer, bob, goldToken, USDT, goldPriceFeed, goldMinter, viem };
        };

        it('Mint — gold fee goes to feeRecipient(bob), USD goes to usdRecipient(owner)', async function () {
            const f = await fixtureWithSeparateFee();
            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;
            const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;

            const bobGoldBefore = (await f.goldToken.read.balanceOf([f.bob.account.address])) as bigint;
            const ownerUsdBefore = (await f.USDT.read.balanceOf([f.owner.account.address])) as bigint;
            const buyerGoldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            const bobGoldAfter = (await f.goldToken.read.balanceOf([f.bob.account.address])) as bigint;
            const ownerUsdAfter = (await f.USDT.read.balanceOf([f.owner.account.address])) as bigint;
            const buyerGoldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            // feeRecipient(bob) receives gold fee
            expect(bobGoldAfter - bobGoldBefore).to.equal(fee);
            // usdRecipient(owner) receives USD
            expect(ownerUsdAfter - ownerUsdBefore).to.equal(requiredUsd);
            // buyer receives net gold
            expect(buyerGoldAfter - buyerGoldBefore).to.equal(grossGold - fee);
            // total gold = fee + net = gross
            expect(bobGoldAfter - bobGoldBefore + (buyerGoldAfter - buyerGoldBefore)).to.equal(grossGold);
        });

        it('Redeem — gold fee goes to feeRecipient(bob), USD paid from usdRecipient(owner)', async function () {
            const f = await fixtureWithSeparateFee();

            // mint 2kg first (secure gold for redeem)
            const mintGold = 2n * TRADE_UNIT_1KG;
            const mintUsd = (await f.goldMinter.read.getRequiredUsd([f.USDT.address, mintGold])) as bigint;
            await f.goldMinter.write.requestMint([f.USDT.address, mintUsd, mintGold], {
                account: f.buyer.account,
            });

            // prepare redeem
            const redeemGold = TRADE_UNIT_1KG;
            const redeemFee = (await f.goldMinter.read.calculateGoldFee([redeemGold, false])) as bigint;
            const expectedUsd = (await f.goldMinter.read.getUsdAmount([
                f.USDT.address,
                redeemGold - redeemFee,
            ])) as bigint;
            const minUsd = (expectedUsd * 9500n) / 10000n;

            const bobGoldBefore = (await f.goldToken.read.balanceOf([f.bob.account.address])) as bigint;
            const ownerUsdBefore = (await f.USDT.read.balanceOf([f.owner.account.address])) as bigint;
            const buyerUsdBefore = (await f.USDT.read.balanceOf([f.buyer.account.address])) as bigint;

            await f.goldMinter.write.requestBurn([f.USDT.address, redeemGold, minUsd], {
                account: f.buyer.account,
            });

            const bobGoldAfter = (await f.goldToken.read.balanceOf([f.bob.account.address])) as bigint;
            const ownerUsdAfter = (await f.USDT.read.balanceOf([f.owner.account.address])) as bigint;
            const buyerUsdAfter = (await f.USDT.read.balanceOf([f.buyer.account.address])) as bigint;

            // feeRecipient(bob) receives gold fee
            expect(bobGoldAfter - bobGoldBefore).to.equal(redeemFee);
            // USD withdrawn from usdRecipient(owner)
            expect(ownerUsdBefore - ownerUsdAfter).to.be.greaterThan(0);
            // buyer receives USD
            expect(buyerUsdAfter - buyerUsdBefore).to.be.greaterThan(0);
        });

        it('usdRecipient gold balance unchanged (fee only goes to feeRecipient)', async function () {
            const f = await fixtureWithSeparateFee();
            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            const ownerGoldBefore = (await f.goldToken.read.balanceOf([f.owner.account.address])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            const ownerGoldAfter = (await f.goldToken.read.balanceOf([f.owner.account.address])) as bigint;

            // usdRecipient(owner) does not receive gold
            expect(ownerGoldAfter).to.equal(ownerGoldBefore);
        });

        it('updateFeeRecipient — only INFRA_MANAGER allowed', async function () {
            const f = await fixtureWithSeparateFee();

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.updateFeeRecipient([f.buyer.account.address], {
                    account: f.buyer.account,
                }),
                f.goldMinter,
                'AccessControlUnauthorizedAccount',
            );
        });

        it('updateFeeRecipient — fee goes to new address after change', async function () {
            const f = await fixtureWithSeparateFee();

            // change feeRecipient to buyer
            await f.goldMinter.write.updateFeeRecipient([f.buyer.account.address], {
                account: f.owner.account,
            });
            const stored = (await f.goldMinter.read.feeRecipient()) as string;
            expect(stored.toLowerCase()).to.equal(f.buyer.account.address.toLowerCase());

            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;

            const buyerGoldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            const buyerGoldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            // buyer receives both net gold + fee gold (buyer = feeRecipient)
            expect(buyerGoldAfter - buyerGoldBefore).to.equal(grossGold);
        });

        it('updateFeeRecipient — address(0) rejected', async function () {
            const f = await fixtureWithSeparateFee();

            await f.viem.assertions.revertWithCustomError(
                f.goldMinter.write.updateFeeRecipient(['0x0000000000000000000000000000000000000000'], {
                    account: f.owner.account,
                }),
                f.goldMinter,
                'ZeroRecipient',
            );
        });

        it('feeRecipient == usdRecipient same address — backward compatible', async function () {
            const f = await fixture(); // default fixture: owner = usdRecipient = feeRecipient
            await f.goldMinter.write.updateTradeUnit([TRADE_UNIT_1KG], { account: f.owner.account });

            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = (await f.goldMinter.read.getRequiredUsd([
                f.USDT.address,
                grossGold,
            ])) as bigint;
            const fee = (await f.goldMinter.read.calculateGoldFee([grossGold, true])) as bigint;

            const buyerGoldBefore = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;

            await f.goldMinter.write.requestMint([f.USDT.address, requiredUsd, grossGold], {
                account: f.buyer.account,
            });

            const buyerGoldAfter = (await f.goldToken.read.balanceOf([f.buyer.account.address])) as bigint;
            expect(buyerGoldAfter - buyerGoldBefore).to.equal(grossGold - fee);
        });
    });
});
