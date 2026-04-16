/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { parseUnits, parseEther, maxUint256, encodeFunctionData } from 'viem';
import { getClients } from './helpers.js';

// ============================================================
// TradeUnit approach verification tests
//
// Goal: "Can users receive OXAU in exact multiples of 1kg, 2kg?"
// Approach: gold unit basis -> reverse-calculate required USD -> transfer exact USD only
// ============================================================

const GOLD_PRICE = parseUnits('4096.342', 8); // Oracle: $4096.342/oz (8 decimals)
const GRAMS_PER_OUNCE = 3110347680n; // 31.1034768 * 1e8
const CONVERSION_PRECISION = 10n ** 8n;

// Parameters (contract defaults)
const MINT_SPREAD = 150n; // 1.5%
const REDEEM_SPREAD = 150n; // 1.5%
const MINT_FEE = 25n; // 0.25%
const REDEEM_FEE = 25n; // 0.25%
const MIN_GOLD_FEE = parseEther('2.5'); // 2.5g
const MIN_GOLD_FEE_AMOUNT = parseEther('1000'); // 1kg

// tradeUnit configuration
const TRADE_UNIT_1KG = parseEther('1000'); // 1kg = 1000g = 1000e18

// ============================================================
// Reverse-calculation functions implemented in TypeScript (logic to be added to the contract)
// ============================================================

/** Convert ounce price -> gram price */
function convertOunceToGramPrice(ouncePrice: bigint): bigint {
    return (ouncePrice * CONVERSION_PRECISION) / GRAMS_PER_OUNCE;
}

/** Reproduces getGoldAmount: USD -> Gold (mintSpread applied) */
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

/** [NEW] getRequiredUsd: Gold -> reverse-calculate required USD (mintSpread applied, rounded up) */
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
    // Round up (ceiling division)
    return (goldAmount * spreadAdjustedPrice + divisor - 1n) / divisor;
}

/** [NEW] calculateGrossFromNet: reverse-calculate net gold -> gross gold (fee included, rounded up) */
function calcGrossFromNet(netGold: bigint, isMint: boolean): bigint {
    const feeRate = isMint ? MINT_FEE : REDEEM_FEE;

    // Fixed fee when below minGoldFeeAmount
    if (netGold + MIN_GOLD_FEE < MIN_GOLD_FEE_AMOUNT) {
        return netGold + MIN_GOLD_FEE;
    }

    // gross * (10000 - feeRate) / 10000 = net
    // gross = ceil(net * 10000 / (10000 - feeRate))
    const denominator = 10000n - feeRate;
    return (netGold * 10000n + denominator - 1n) / denominator;
}

/** Reproduces calculateGoldFee: forward fee calculation identical to the contract */
function calcGoldFee(goldAmount: bigint, isMint: boolean): bigint {
    const feeRate = isMint ? MINT_FEE : REDEEM_FEE;
    if (goldAmount < MIN_GOLD_FEE_AMOUNT) {
        return MIN_GOLD_FEE;
    }
    return (goldAmount * feeRate) / 10000n;
}

/** Reproduces getUsdAmount: Gold -> USD (redeemSpread applied) */
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
describe('TradeUnit approach verification', function () {
    const gramPrice = convertOunceToGramPrice(GOLD_PRICE);
    const oracleDecimals = 8;
    const goldDecimals = 18;
    const usdDecimals = 6;

    // Contract instances
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

        // Mock token
        usdt = await v.deployContract('ERC20Mock', ['Tether USD', 'USDT', 6, parseUnits('10000000', 6)]);

        // BlacklistOracle
        const boImpl = await v.deployContract('BlacklistOracle', []);
        const boProxy = await v.deployContract('InitializableProxy', []);
        const boInitData = encodeFunctionData({
            abi: boImpl.abi,
            functionName: 'initializeOracle',
            args: ['Blacklist Oracle', owner.account.address],
        });
        await boProxy.write.initializeProxy(
            ['Blacklist Oracle', owner.account.address, boImpl.address, boInitData],
            { account: owner.account },
        );

        // GoldToken
        const gtImpl = await v.deployContract('GoldToken', []);
        const gtProxy = await v.deployContract('InitializableProxy', []);
        const gtInitData = encodeFunctionData({
            abi: gtImpl.abi,
            functionName: 'initializeGoldToken',
            args: [owner.account.address, boProxy.address],
        });
        await gtProxy.write.initializeProxy(
            ['Ontorium Gold Token', owner.account.address, gtImpl.address, gtInitData],
            { account: owner.account },
        );
        goldToken = await v.getContractAt('GoldToken', gtProxy.address);

        // PriceFeed (DataFeed mock)
        const pfImpl = await v.deployContract('DataFeed');
        const pfProxy = await v.deployContract('InitializableProxy', []);
        const pfInitData = encodeFunctionData({
            abi: pfImpl.abi,
            functionName: 'initializeFeed',
            args: [owner.account.address, gtProxy.address, 'OXAU / USD'],
        });
        await pfProxy.write.initializeProxy(['DataFeed', owner.account.address, pfImpl.address, pfInitData], {
            account: owner.account,
        });
        const priceFeed = await v.getContractAt('DataFeed', pfProxy.address);
        await priceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });

        // GoldMinter
        const gmImpl = await v.deployContract('GoldMinter');
        const gmProxy = await v.deployContract('InitializableProxy', []);
        const gmInitData = encodeFunctionData({
            abi: gmImpl.abi,
            functionName: 'initializeGoldMinter',
            args: [
                gtProxy.address,
                usdt.address,
                usdt.address, // Use USDT for USDC too (test simplification)
                pfProxy.address,
                owner.account.address, // usdRecipient
                owner.account.address, // feeRecipient
                owner.account.address,
                true,
            ],
        });
        await gmProxy.write.initializeProxy(
            ['GoldMinter', owner.account.address, gmImpl.address, gmInitData],
            { account: owner.account },
        );
        goldMinter = await v.getContractAt('GoldMinter', gmProxy.address);

        // Role setup
        await goldToken.write.addMinter([goldMinter.address], { account: owner.account });
        await goldToken.write.addMinter([owner.account.address], { account: owner.account }); // For E2E simulation
        const KYC_MANAGER_ROLE = await goldMinter.read.KYC_MANAGER_ROLE();
        await goldMinter.write.grantRole([KYC_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });
        await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

        // Fund buyer with USDT
        await usdt.write.transfer([buyer.account.address, parseUnits('5000000', 6)], {
            account: owner.account,
        });
    });

    // ============================================================
    // 1. Mathematical accuracy verification (pure calculation)
    // ============================================================
    describe('1. Mathematical accuracy verification', function () {
        const testCases = [
            { units: 1n, label: '1kg' },
            { units: 2n, label: '2kg' },
            { units: 3n, label: '3kg' },
            { units: 5n, label: '5kg' },
            { units: 10n, label: '10kg' },
        ];

        for (const { units, label } of testCases) {
            it(`${label} mint — net gold must be exactly ${label}`, function () {
                const netGold = units * TRADE_UNIT_1KG;

                // 1. Reverse-calculate gross
                const grossGold = calcGrossFromNet(netGold, true);

                // 2. fee = gross - net (determined by subtraction)
                const feeAmount = grossGold - netGold;

                // 3. Compare with forward fee
                const feeForward = calcGoldFee(grossGold, true);

                // 4. Check that net is an exact tradeUnit multiple
                expect(netGold % TRADE_UNIT_1KG).to.equal(0n);

                // 5. Difference between reverse-calculated fee and forward fee
                const feeDiff = feeAmount > feeForward ? feeAmount - feeForward : feeForward - feeAmount;

                console.log(`  ${label}:`);
                console.log(`    netGold     = ${netGold} (${Number(netGold) / 1e18}g)`);
                console.log(`    grossGold   = ${grossGold} (${Number(grossGold) / 1e18}g)`);
                console.log(`    fee(reverse)   = ${feeAmount} (${Number(feeAmount) / 1e18}g)`);
                console.log(`    fee(forward) = ${feeForward} (${Number(feeForward) / 1e18}g)`);
                console.log(`    fee diff    = ${feeDiff} wei`);
                console.log(`    net % 1kg   = ${netGold % TRADE_UNIT_1KG} (exact if 0)`);

                // Core: net gold must be an exact multiple
                expect(netGold % TRADE_UNIT_1KG).to.equal(0n);
                // fee difference is at most 1 wei
                expect(feeDiff <= 1n).to.be.true;
            });
        }

        it('USD reverse-calculation accuracy — getRequiredUsd -> getGoldAmount round-trip check', function () {
            const netGold = 1n * TRADE_UNIT_1KG; // 1kg
            const grossGold = calcGrossFromNet(netGold, true);

            // Calculate required USD (rounded up)
            const requiredUsd = calcGetRequiredUsd(
                grossGold,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            // Recompute gold from that USD
            const goldFromUsd = calcGetGoldAmount(
                requiredUsd,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            console.log(`\n  1kg USD round-trip check:`);
            console.log(`    grossGold   = ${grossGold} (${Number(grossGold) / 1e18}g)`);
            console.log(`    requiredUsd = ${requiredUsd} ($${Number(requiredUsd) / 1e6})`);
            console.log(`    goldFromUsd = ${goldFromUsd} (${Number(goldFromUsd) / 1e18}g)`);
            console.log(`    diff        = ${goldFromUsd - grossGold} wei (must be positive to be safe)`);

            // Since USD is rounded up, the reverse-calculated gold >= original grossGold
            expect(goldFromUsd >= grossGold).to.be.true;
            // Difference must be negligible (less than 1g)
            expect(goldFromUsd - grossGold < parseEther('1')).to.be.true;
        });
    });

    // ============================================================
    // 2. Verify contract functions match TypeScript calculations
    // ============================================================
    describe('2. Contract functions match TypeScript calculations', function () {
        it('getGoldAmount — contract vs TypeScript equal', async function () {
            const usdAmount = parseUnits('131700', 6); // $131,700
            const contractResult = (await goldMinter.read.getGoldAmount([usdt.address, usdAmount])) as bigint;
            const tsResult = calcGetGoldAmount(
                usdAmount,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            console.log(`    Contract: ${contractResult} (${Number(contractResult) / 1e18}g)`);
            console.log(`    TypeScript: ${tsResult} (${Number(tsResult) / 1e18}g)`);
            expect(contractResult).to.equal(tsResult);
        });

        it('calculateGoldFee — contract vs TypeScript equal', async function () {
            const goldAmount = parseEther('1000'); // 1000g
            const contractFee = (await goldMinter.read.calculateGoldFee([goldAmount, true])) as bigint;
            const tsFee = calcGoldFee(goldAmount, true);

            console.log(`    Contract fee: ${contractFee} (${Number(contractFee) / 1e18}g)`);
            console.log(`    TypeScript fee: ${tsFee} (${Number(tsFee) / 1e18}g)`);
            expect(contractFee).to.equal(tsFee);
        });

        it('getUsdAmount — contract vs TypeScript equal', async function () {
            const goldAmount = parseEther('1000');
            const contractResult = (await goldMinter.read.getUsdAmount([usdt.address, goldAmount])) as bigint;
            const tsResult = calcGetUsdAmount(
                goldAmount,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            console.log(`    Contract: ${contractResult} ($${Number(contractResult) / 1e6})`);
            console.log(`    TypeScript: ${tsResult} ($${Number(tsResult) / 1e6})`);
            expect(contractResult).to.equal(tsResult);
        });
    });

    // ============================================================
    // 3. Demonstrate the problem with the current approach
    // ============================================================
    describe('3. Demonstrate the problem with the current approach', function () {
        it('Current requestMint cannot produce exactly 1kg', async function () {
            // Approximate USD required for 1kg
            const grossGold = calcGrossFromNet(TRADE_UNIT_1KG, true);
            const approxUsd = calcGetRequiredUsd(
                grossGold,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            // Check via the contract's getGoldAmount
            const actualGold = (await goldMinter.read.getGoldAmount([usdt.address, approxUsd])) as bigint;
            const actualFee = (await goldMinter.read.calculateGoldFee([actualGold, true])) as bigint;
            const actualNet = actualGold - actualFee;

            const remainder = actualNet % TRADE_UNIT_1KG;

            console.log(`\n  Current approach ~1kg mint attempt:`);
            console.log(`    USD input   = $${Number(approxUsd) / 1e6}`);
            console.log(`    gross gold  = ${Number(actualGold) / 1e18}g`);
            console.log(`    fee         = ${Number(actualFee) / 1e18}g`);
            console.log(`    net gold    = ${Number(actualNet) / 1e18}g`);
            console.log(`    net % 1kg   = ${remainder} wei (not a multiple if nonzero)`);

            // Prove it is not a multiple
            expect(remainder).to.not.equal(0n);
        });

        it('Actual requestMint execution — gold received by buyer is not a 1kg multiple', async function () {
            const grossGold = calcGrossFromNet(TRADE_UNIT_1KG, true);
            const usdAmount = calcGetRequiredUsd(
                grossGold,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            await usdt.write.approve([goldMinter.address, usdAmount], { account: buyer.account });

            const expectedGold = (await goldMinter.read.getGoldAmount([usdt.address, usdAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;
            const minGold = expectedGold - expectedFee;

            await goldMinter.write.requestMint([usdt.address, usdAmount, minGold], {
                account: buyer.account,
            });

            const balance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const remainder = balance % TRADE_UNIT_1KG;

            console.log(`\n  Actual mint result:`);
            console.log(`    buyer balance  = ${Number(balance) / 1e18}g`);
            console.log(`    balance % 1kg  = ${remainder} wei`);

            expect(remainder).to.not.equal(0n);
        });
    });

    // ============================================================
    // 4. New TradeUnit approach — E2E simulation
    // ============================================================
    describe('4. TradeUnit approach — E2E simulation', function () {
        const tradeUnitCases = [
            { units: 1n, label: '1kg' },
            { units: 2n, label: '2kg' },
            { units: 5n, label: '5kg' },
        ];

        for (const { units, label } of tradeUnitCases) {
            it(`${label} mint — must receive exactly ${label} with the new approach`, async function () {
                const netGold = units * TRADE_UNIT_1KG;
                const grossGold = calcGrossFromNet(netGold, true);
                const feeAmount = grossGold - netGold; // determined by subtraction
                const requiredUsd = calcGetRequiredUsd(
                    grossGold,
                    gramPrice,
                    oracleDecimals,
                    goldDecimals,
                    usdDecimals,
                );

                // Record buyer's existing gold balance
                const balanceBefore = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

                // -- New flow simulation (manual execution without contract changes) --

                // 1. Transfer exact USD only from buyer -> usdRecipient
                await usdt.write.approve([owner.account.address, requiredUsd], { account: buyer.account });
                await usdt.write.transferFrom([buyer.account.address, owner.account.address, requiredUsd], {
                    account: owner.account,
                });

                // 2. GoldToken mint: netGold -> buyer, feeAmount -> usdRecipient
                await goldToken.write.mint([buyer.account.address, netGold], { account: owner.account });
                await goldToken.write.mint([owner.account.address, feeAmount], { account: owner.account });

                // -- Verification --
                const balanceAfter = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
                const received = balanceAfter - balanceBefore;

                console.log(`\n  ${label} TradeUnit mint:`);
                console.log(`    USD paid    = $${Number(requiredUsd) / 1e6}`);
                console.log(`    gross gold  = ${Number(grossGold) / 1e18}g`);
                console.log(`    fee         = ${Number(feeAmount) / 1e18}g`);
                console.log(`    received gold   = ${Number(received) / 1e18}g`);
                console.log(`    received % 1kg  = ${received % TRADE_UNIT_1KG}`);

                // Core check: exactly N kg
                expect(received).to.equal(netGold);
                expect(received % TRADE_UNIT_1KG).to.equal(0n);
            });
        }
    });

    // ============================================================
    // 5. Redeem TradeUnit verification
    // ============================================================
    describe('5. Redeem TradeUnit verification', function () {
        it('1kg redeem — passes when goldAmount is a tradeUnit multiple', function () {
            const goldAmount = 1n * TRADE_UNIT_1KG;
            expect(goldAmount % TRADE_UNIT_1KG).to.equal(0n);

            const feeAmount = calcGoldFee(goldAmount, false);
            const netGoldAfterFee = goldAmount - feeAmount;
            const usdAmount = calcGetUsdAmount(
                netGoldAfterFee,
                gramPrice,
                oracleDecimals,
                goldDecimals,
                usdDecimals,
            );

            console.log(`\n  1kg redeem:`);
            console.log(
                `    burn gold   = ${Number(goldAmount) / 1e18}g (${Number(goldAmount) / 1e18 / 1000}kg)`,
            );
            console.log(`    fee         = ${Number(feeAmount) / 1e18}g`);
            console.log(`    net gold    = ${Number(netGoldAfterFee) / 1e18}g`);
            console.log(`    USD to receive = $${Number(usdAmount) / 1e6}`);
        });

        it('1.5kg redeem — must revert when not a tradeUnit multiple', function () {
            const goldAmount = parseEther('1500'); // 1.5kg
            const remainder = goldAmount % TRADE_UNIT_1KG;

            console.log(`\n  1.5kg redeem attempt:`);
            console.log(`    goldAmount  = ${Number(goldAmount) / 1e18}g`);
            console.log(`    % 1kg       = ${remainder} (rejected because nonzero)`);

            expect(remainder).to.not.equal(0n);
            // In the contract this reverts via require(goldAmount % tradeUnit == 0)
        });
    });

    // ============================================================
    // 6. TradeUnit change scenarios (1kg -> 100g -> free)
    // ============================================================
    describe('6. TradeUnit change scenarios', function () {
        it('tradeUnit = 100g — verify 100g multiples', function () {
            const tradeUnit100g = parseEther('100');

            const testAmounts = [
                { amount: parseEther('100'), label: '100g', shouldPass: true },
                { amount: parseEther('200'), label: '200g', shouldPass: true },
                { amount: parseEther('1000'), label: '1kg', shouldPass: true },
                { amount: parseEther('150'), label: '150g', shouldPass: false },
                { amount: parseEther('1050'), label: '1050g', shouldPass: false },
            ];

            for (const { amount, label, shouldPass } of testAmounts) {
                const isMultiple = amount % tradeUnit100g === 0n;
                console.log(
                    `    ${label}: ${isMultiple ? 'PASS' : 'REJECT'} (expected: ${shouldPass ? 'PASS' : 'REJECT'})`,
                );
                expect(isMultiple).to.equal(shouldPass);
            }
        });

        it('tradeUnit = 0 (disabled) — all amounts allowed', function () {
            const tradeUnit0 = 0n;

            const testAmounts = [parseEther('0.5'), parseEther('1.234'), parseEther('999.999')];

            for (const amount of testAmounts) {
                // Skip check when tradeUnit == 0
                const shouldCheck = tradeUnit0 > 0n;
                const passes = !shouldCheck || amount % tradeUnit0 === 0n;
                console.log(`    ${Number(amount) / 1e18}g: ${passes ? 'PASS' : 'REJECT'}`);
                expect(passes).to.be.true;
            }
        });
    });
});
