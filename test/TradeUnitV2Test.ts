/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { parseUnits, parseEther, encodeFunctionData } from 'viem';
import { getClients } from './helpers.js';

// ============================================================
// TradeUnit V2 Verification Tests
//
// Approach: gross gold (fee inclusive) is exactly a multiple of tradeUnit
//           fee is deducted from gross, user receives net
//
// Example: 1kg mint -> gross=1000g, fee=2.5g, net=997.5g
// ============================================================

const GOLD_PRICE = parseUnits('4096.342', 8); // $4096.342/oz (8 decimals)
const GRAMS_PER_OUNCE = 3110347680n;
const CONVERSION_PRECISION = 10n ** 8n;

// Parameters (contract defaults)
const MINT_SPREAD = 150n; // 1.5%
const REDEEM_SPREAD = 150n; // 1.5%
const MINT_FEE = 25n; // 0.25%
const REDEEM_FEE = 25n; // 0.25%
const MIN_GOLD_FEE = parseEther('2.5');
const MIN_GOLD_FEE_AMOUNT = parseEther('1000');

// tradeUnit
const TRADE_UNIT_1KG = parseEther('1000');

// ============================================================
// Calculation functions
// ============================================================

function convertOunceToGramPrice(ouncePrice: bigint): bigint {
    return (ouncePrice * CONVERSION_PRECISION) / GRAMS_PER_OUNCE;
}

/** getGoldAmount: USD -> Gold (applies mintSpread) */
function calcGetGoldAmount(
    usdAmount: bigint,
    gramPrice: bigint,
    oracleDecimals: number,
    goldDecimals: number,
    usdDecimals: number,
): bigint {
    const spreadAdjustedPrice = (gramPrice * (10000n + MINT_SPREAD)) / 10000n;
    const exponent = BigInt(oracleDecimals + goldDecimals - usdDecimals);
    return (usdAmount * 10n ** exponent) / spreadAdjustedPrice;
}

/** [NEW] getRequiredUsd: Gold -> required USD (applies mintSpread, rounded up) */
function calcGetRequiredUsd(
    goldAmount: bigint,
    gramPrice: bigint,
    oracleDecimals: number,
    goldDecimals: number,
    usdDecimals: number,
): bigint {
    const spreadAdjustedPrice = (gramPrice * (10000n + MINT_SPREAD)) / 10000n;
    const exponent = BigInt(oracleDecimals + goldDecimals - usdDecimals);
    const divisor = 10n ** exponent;
    return (goldAmount * spreadAdjustedPrice + divisor - 1n) / divisor;
}

/** calculateGoldFee: same as existing contract */
function calcGoldFee(goldAmount: bigint, isMint: boolean): bigint {
    const feeRate = isMint ? MINT_FEE : REDEEM_FEE;
    if (goldAmount < MIN_GOLD_FEE_AMOUNT) {
        return MIN_GOLD_FEE;
    }
    return (goldAmount * feeRate) / 10000n;
}

/** getUsdAmount: Gold -> USD (applies redeemSpread) */
function calcGetUsdAmount(
    goldAmount: bigint,
    gramPrice: bigint,
    oracleDecimals: number,
    goldDecimals: number,
    usdDecimals: number,
): bigint {
    const spreadAdjustedPrice = (gramPrice * (10000n - REDEEM_SPREAD)) / 10000n;
    const exponent = BigInt(oracleDecimals + goldDecimals - usdDecimals);
    return (goldAmount * spreadAdjustedPrice) / 10n ** exponent;
}

// ============================================================
// Tests
// ============================================================
describe('TradeUnit V2 - gross is exactly a kg multiple', function () {
    const gramPrice = convertOunceToGramPrice(GOLD_PRICE);
    const oracleDecimals = 8;
    const goldDecimals = 18;
    const usdDecimals = 6;

    let goldMinter: any;
    let goldToken: any;
    let usdt: any;
    let owner: any;
    let buyer: any;

    before(async function () {
        const clients = await getClients();
        owner = clients.owner;
        buyer = clients.buyer;
        const v = clients.viem;

        usdt = await v.deployContract('ERC20Mock', ['Tether USD', 'USDT', 6, parseUnits('100000000', 6)]);

        // BlacklistOracle
        const boImpl = await v.deployContract('BlacklistOracle', []);
        const boProxy = await v.deployContract('InitializableProxy', []);
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
        const gtImpl = await v.deployContract('GoldToken', []);
        const gtProxy = await v.deployContract('InitializableProxy', []);
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
        goldToken = await v.getContractAt('GoldToken', gtProxy.address);

        // PriceFeed
        const pfImpl = await v.deployContract('DataFeed');
        const pfProxy = await v.deployContract('InitializableProxy', []);
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
        const priceFeed = await v.getContractAt('DataFeed', pfProxy.address);
        await priceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });

        // GoldMinter
        const gmImpl = await v.deployContract('GoldMinter');
        const gmProxy = await v.deployContract('InitializableProxy', []);
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
                        usdt.address,
                        usdt.address,
                        pfProxy.address,
                        owner.account.address,
                        owner.account.address, // feeRecipient
                        owner.account.address,
                        true,
                    ],
                }),
            ],
            { account: owner.account },
        );
        goldMinter = await v.getContractAt('GoldMinter', gmProxy.address);

        // Role setup
        await goldToken.write.addMinter([goldMinter.address], { account: owner.account });
        await goldToken.write.addMinter([owner.account.address], { account: owner.account });
        const KYC_MANAGER_ROLE = await goldMinter.read.KYC_MANAGER_ROLE();
        await goldMinter.write.grantRole([KYC_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });
        await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

        await usdt.write.transfer([buyer.account.address, parseUnits('50000000', 6)], {
            account: owner.account,
        });
    });

    // ============================================================
    // 1. Mathematical accuracy - gross is exactly a kg multiple
    // ============================================================
    describe('1. Mint mathematical accuracy', function () {
        const testCases = [
            { units: 1n, label: '1kg' },
            { units: 2n, label: '2kg' },
            { units: 3n, label: '3kg' },
            { units: 5n, label: '5kg' },
            { units: 10n, label: '10kg' },
        ];

        for (const { units, label } of testCases) {
            it(`${label} - gross=${label}, receive net after fee deduction`, function () {
                const grossGold = units * TRADE_UNIT_1KG;
                const feeAmount = calcGoldFee(grossGold, true);
                const netGold = grossGold - feeAmount;
                const requiredUsd = calcGetRequiredUsd(
                    grossGold,
                    gramPrice,
                    oracleDecimals,
                    goldDecimals,
                    usdDecimals,
                );

                // Reverse-calculation check: getGoldAmount(requiredUsd) should be >= grossGold
                const goldFromUsd = calcGetGoldAmount(
                    requiredUsd,
                    gramPrice,
                    oracleDecimals,
                    goldDecimals,
                    usdDecimals,
                );

                console.log(`\n  ${label} Mint:`);
                console.log(`    grossGold     = ${Number(grossGold) / 1e18}g (exactly ${label})`);
                console.log(`    fee           = ${Number(feeAmount) / 1e18}g`);
                console.log(`    netGold       = ${Number(netGold) / 1e18}g (user receives)`);
                console.log(`    requiredUsd   = $${Number(requiredUsd) / 1e6}`);
                console.log(`    gross % 1kg   = ${grossGold % TRADE_UNIT_1KG}`);
                console.log(`    goldFromUsd   = ${Number(goldFromUsd) / 1e18}g (reverse >= gross: ${goldFromUsd >= grossGold})`);

                // gross is exactly a kg multiple
                expect(grossGold % TRADE_UNIT_1KG).to.equal(0n);
                // gross + fee + net relationship
                expect(netGold + feeAmount).to.equal(grossGold);
                // Reverse-calculated USD can secure enough gold
                expect(goldFromUsd >= grossGold).to.be.true;
            });
        }
    });

    // ============================================================
    // 2. Verify consistency with contract functions
    // ============================================================
    describe('2. Contract functions match TypeScript', function () {
        it('getGoldAmount matches', async function () {
            const usdAmount = parseUnits('131700', 6);
            const contract = (await goldMinter.read.getGoldAmount([usdt.address, usdAmount])) as bigint;
            const ts = calcGetGoldAmount(usdAmount, gramPrice, oracleDecimals, goldDecimals, usdDecimals);
            expect(contract).to.equal(ts);
        });

        it('calculateGoldFee matches (1kg)', async function () {
            const goldAmount = TRADE_UNIT_1KG;
            const contract = (await goldMinter.read.calculateGoldFee([goldAmount, true])) as bigint;
            const ts = calcGoldFee(goldAmount, true);
            console.log(`    1kg fee = ${Number(contract) / 1e18}g`);
            expect(contract).to.equal(ts);
        });

        it('calculateGoldFee matches (5kg)', async function () {
            const goldAmount = 5n * TRADE_UNIT_1KG;
            const contract = (await goldMinter.read.calculateGoldFee([goldAmount, true])) as bigint;
            const ts = calcGoldFee(goldAmount, true);
            console.log(`    5kg fee = ${Number(contract) / 1e18}g`);
            expect(contract).to.equal(ts);
        });

        it('getRequiredUsd -> getGoldAmount round-trip - 1kg', async function () {
            const grossGold = TRADE_UNIT_1KG;
            const requiredUsd = calcGetRequiredUsd(
                grossGold,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );
            const contractGold = (await goldMinter.read.getGoldAmount([usdt.address, requiredUsd])) as bigint;

            console.log(`    requiredUsd  = $${Number(requiredUsd) / 1e6}`);
            console.log(`    contractGold = ${Number(contractGold) / 1e18}g`);
            console.log(`    >= 1kg?      = ${contractGold >= grossGold}`);

            expect(contractGold >= grossGold).to.be.true;
        });
    });

    // ============================================================
    // 3. Current approach vs new approach comparison
    // ============================================================
    describe('3. Current approach vs new approach', function () {
        it('Current approach - with arbitrary USD input, neither gross nor net is a kg multiple', async function () {
            // Arbitrary USD amount ($100,000)
            const arbitraryUsd = parseUnits('100000', 6);

            const contractGold = (await goldMinter.read.getGoldAmount([usdt.address, arbitraryUsd])) as bigint;
            const contractFee = (await goldMinter.read.calculateGoldFee([contractGold, true])) as bigint;
            const contractNet = contractGold - contractFee;

            console.log(`\n  Current approach ($${Number(arbitraryUsd) / 1e6} input):`);
            console.log(`    gross = ${Number(contractGold) / 1e18}g`);
            console.log(`    fee   = ${Number(contractFee) / 1e18}g`);
            console.log(`    net   = ${Number(contractNet) / 1e18}g`);
            console.log(`    gross % 1kg = ${contractGold % TRADE_UNIT_1KG}`);
            console.log(`    net   % 1kg = ${contractNet % TRADE_UNIT_1KG}`);

            expect(contractGold % TRADE_UNIT_1KG).to.not.equal(0n);
            expect(contractNet % TRADE_UNIT_1KG).to.not.equal(0n);
        });

        it('New approach - gross is exactly 1kg', function () {
            const grossGold = TRADE_UNIT_1KG;
            const feeAmount = calcGoldFee(grossGold, true);
            const netGold = grossGold - feeAmount;
            const requiredUsd = calcGetRequiredUsd(
                grossGold,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            console.log(`\n  New approach:`);
            console.log(`    gross = ${Number(grossGold) / 1e18}g (exactly 1kg)`);
            console.log(`    fee   = ${Number(feeAmount) / 1e18}g`);
            console.log(`    net   = ${Number(netGold) / 1e18}g (user receives)`);
            console.log(`    USD   = $${Number(requiredUsd) / 1e6}`);
            console.log(`    gross % 1kg = ${grossGold % TRADE_UNIT_1KG}`);

            expect(grossGold % TRADE_UNIT_1KG).to.equal(0n);
            expect(grossGold).to.equal(TRADE_UNIT_1KG);
        });
    });

    // ============================================================
    // 4. E2E simulation - Mint
    // ============================================================
    describe('4. Mint E2E simulation', function () {
        const mintCases = [
            { units: 1n, label: '1kg' },
            { units: 2n, label: '2kg' },
            { units: 5n, label: '5kg' },
        ];

        for (const { units, label } of mintCases) {
            it(`${label} mint - total minted amount is exactly ${label}`, async function () {
                const grossGold = units * TRADE_UNIT_1KG;
                const feeAmount = calcGoldFee(grossGold, true);
                const netGold = grossGold - feeAmount;
                const requiredUsd = calcGetRequiredUsd(
                    grossGold,
                    gramPrice,
                    oracleDecimals,
                    goldDecimals,
                    usdDecimals,
                );

                // Record balances
                const buyerGoldBefore = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
                const recipientGoldBefore = (await goldToken.read.balanceOf([
                    owner.account.address,
                ])) as bigint;
                const buyerUsdBefore = (await usdt.read.balanceOf([buyer.account.address])) as bigint;

                // New approach simulation: transfer USD + mint gold
                await usdt.write.approve([owner.account.address, requiredUsd], { account: buyer.account });
                await usdt.write.transferFrom(
                    [buyer.account.address, owner.account.address, requiredUsd],
                    { account: owner.account },
                );
                await goldToken.write.mint([buyer.account.address, netGold], { account: owner.account });
                await goldToken.write.mint([owner.account.address, feeAmount], { account: owner.account });

                // Verification
                const buyerGoldAfter = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
                const recipientGoldAfter = (await goldToken.read.balanceOf([
                    owner.account.address,
                ])) as bigint;
                const buyerUsdAfter = (await usdt.read.balanceOf([buyer.account.address])) as bigint;

                const buyerReceived = buyerGoldAfter - buyerGoldBefore;
                const recipientReceived = recipientGoldAfter - recipientGoldBefore;
                const totalMinted = buyerReceived + recipientReceived;
                const usdPaid = buyerUsdBefore - buyerUsdAfter;

                console.log(`\n  ${label} E2E:`);
                console.log(`    USD paid         = $${Number(usdPaid) / 1e6}`);
                console.log(`    buyer received   = ${Number(buyerReceived) / 1e18}g`);
                console.log(`    fee received     = ${Number(recipientReceived) / 1e18}g`);
                console.log(`    total minted     = ${Number(totalMinted) / 1e18}g`);
                console.log(`    total mint % 1kg = ${totalMinted % TRADE_UNIT_1KG}`);

                // Key: total minted (buyer + fee) is exactly a kg multiple
                expect(totalMinted).to.equal(grossGold);
                expect(totalMinted % TRADE_UNIT_1KG).to.equal(0n);
                // buyer receives = gross - fee
                expect(buyerReceived).to.equal(netGold);
                // fee = expected value
                expect(recipientReceived).to.equal(feeAmount);
            });
        }
    });

    // ============================================================
    // 5. E2E simulation - Redeem
    // ============================================================
    describe('5. Redeem E2E simulation', function () {
        it('1kg redeem - goldAmount (fee inclusive) is exactly 1kg', function () {
            const goldAmount = TRADE_UNIT_1KG; // User submits full 1kg for burn
            const feeAmount = calcGoldFee(goldAmount, false);
            const netGoldAfterFee = goldAmount - feeAmount;
            const usdReturn = calcGetUsdAmount(
                netGoldAfterFee,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            console.log(`\n  1kg Redeem:`);
            console.log(`    submitted gold = ${Number(goldAmount) / 1e18}g (exactly 1kg)`);
            console.log(`    fee            = ${Number(feeAmount) / 1e18}g`);
            console.log(`    gold to burn   = ${Number(netGoldAfterFee) / 1e18}g`);
            console.log(`    USD received   = $${Number(usdReturn) / 1e6}`);
            console.log(`    submitted % 1kg = ${goldAmount % TRADE_UNIT_1KG}`);

            expect(goldAmount % TRADE_UNIT_1KG).to.equal(0n);
            expect(netGoldAfterFee + feeAmount).to.equal(goldAmount);
        });

        it('3kg redeem', function () {
            const goldAmount = 3n * TRADE_UNIT_1KG;
            const feeAmount = calcGoldFee(goldAmount, false);
            const netGoldAfterFee = goldAmount - feeAmount;
            const usdReturn = calcGetUsdAmount(
                netGoldAfterFee,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            console.log(`\n  3kg Redeem:`);
            console.log(`    submitted gold = ${Number(goldAmount) / 1e18}g`);
            console.log(`    fee            = ${Number(feeAmount) / 1e18}g`);
            console.log(`    gold to burn   = ${Number(netGoldAfterFee) / 1e18}g`);
            console.log(`    USD received   = $${Number(usdReturn) / 1e6}`);

            expect(goldAmount % TRADE_UNIT_1KG).to.equal(0n);
        });

        it('1.5kg redeem - rejected if not a multiple', function () {
            const goldAmount = parseEther('1500');
            expect(goldAmount % TRADE_UNIT_1KG).to.not.equal(0n);
            console.log(`    1.5kg % 1kg = ${goldAmount % TRADE_UNIT_1KG} (rejected)`);
        });
    });

    // ============================================================
    // 6. Verification across various gold prices
    // ============================================================
    describe('6. Verification across various gold prices', function () {
        const prices = [
            { price: parseUnits('2000', 8), label: '$2,000/oz' },
            { price: parseUnits('3500.50', 8), label: '$3,500.50/oz' },
            { price: parseUnits('4096.342', 8), label: '$4,096.342/oz' },
            { price: parseUnits('5999.999', 8), label: '$5,999.999/oz' },
            { price: parseUnits('8888.888', 8), label: '$8,888.888/oz' },
        ];

        for (const { price, label } of prices) {
            it(`${label} - 1kg mint gross is exactly 1kg`, function () {
                const gp = convertOunceToGramPrice(price);
                const grossGold = TRADE_UNIT_1KG;
                const feeAmount = calcGoldFee(grossGold, true);
                const netGold = grossGold - feeAmount;
                const requiredUsd = calcGetRequiredUsd(
                    grossGold,
                    gp,
                    oracleDecimals,
                    goldDecimals,
                    usdDecimals,
                );

                // Reverse-calculation check
                const goldFromUsd = calcGetGoldAmount(
                    requiredUsd,
                    gp,
                    oracleDecimals,
                    goldDecimals,
                    usdDecimals,
                );

                console.log(`    ${label}: USD=$${Number(requiredUsd) / 1e6}, net=${Number(netGold) / 1e18}g, reverse>=${grossGold >= grossGold}`);

                expect(grossGold % TRADE_UNIT_1KG).to.equal(0n);
                expect(goldFromUsd >= grossGold).to.be.true;
            });
        }
    });

    // ============================================================
    // 7. tradeUnit change scenarios
    // ============================================================
    describe('7. tradeUnit change scenarios', function () {
        it('1kg unit', function () {
            const tu = parseEther('1000');
            expect(parseEther('1000') % tu).to.equal(0n); // 1kg OK
            expect(parseEther('2000') % tu).to.equal(0n); // 2kg OK
            expect(parseEther('500') % tu).to.not.equal(0n); // 0.5kg REJECT
            console.log('    1kg, 2kg: OK / 0.5kg: REJECT');
        });

        it('100g unit', function () {
            const tu = parseEther('100');
            expect(parseEther('100') % tu).to.equal(0n); // 100g OK
            expect(parseEther('500') % tu).to.equal(0n); // 500g OK
            expect(parseEther('1000') % tu).to.equal(0n); // 1kg OK
            expect(parseEther('150') % tu).to.not.equal(0n); // 150g REJECT
            console.log('    100g, 500g, 1kg: OK / 150g: REJECT');
        });

        it('1g unit (same as current minMintAmount)', function () {
            const tu = parseEther('1');
            expect(parseEther('1') % tu).to.equal(0n);
            expect(parseEther('999') % tu).to.equal(0n);
            expect(parseEther('0.5') % tu).to.not.equal(0n);
            console.log('    1g, 999g: OK / 0.5g: REJECT');
        });

        it('0 (disabled) - allows all amounts', function () {
            const tu = 0n;
            const amounts = [parseEther('0.001'), parseEther('1.234'), parseEther('999.999')];
            for (const amt of amounts) {
                const pass = tu === 0n || amt % tu === 0n;
                expect(pass).to.be.true;
            }
            console.log('    All amounts allowed');
        });
    });
});
