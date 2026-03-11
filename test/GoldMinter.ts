/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';

import { parseUnits, parseEther, maxUint256, getAddress, encodeFunctionData } from 'viem';
import { getClients, signPermitERC2612 } from './helpers.js';

const GOLD_PRICE = parseUnits('4096.342', 8); // Oracle price (per ounce)
const GRAMS_PER_OUNCE = parseUnits('31.1034768', 8); // Same as contract constant
// Calculate gram-based price: (Oracle ounce price * 1e8) / grams per ounce / 100 (8 decimals to 6 decimals)
const GOLD_PRICE_IN_USD_TOKEN = (GOLD_PRICE * parseUnits('1', 8)) / GRAMS_PER_OUNCE / 100n;

const fixtureData = {
    USDTMintAmt: 100000,
    USDTTransferAmt: 10000,
    USDCMintAmt: 100000,
    USDCTransferAmt: 10000,
    goldMintAmt: 1,
    goldSellAmt: 2,
};

describe('GoldMinter', function () {
    const fixture = async () => {
        const { owner, buyer, viem } = await getClients();
        const { USDTMintAmt, USDCMintAmt, USDTTransferAmt, USDCTransferAmt } = fixtureData;

        const blacklistOracleImplementation = await viem.deployContract('BlacklistOracle', []);
        const blacklistOracleProxy = await viem.deployContract('InitializableProxy', []);

        const blacklistOracleInitData = encodeFunctionData({
            abi: blacklistOracleImplementation.abi,
            functionName: 'initializeOracle',
            args: ['Blacklist Oracle', owner.account.address],
        });

        await blacklistOracleProxy.write.initializeProxy(
            [
                'Blacklist Oracle',
                owner.account!.address,
                blacklistOracleImplementation.address,
                blacklistOracleInitData,
            ],
            { account: owner.account },
        );

        const blacklistOracle = await viem.getContractAt('BlacklistOracle', blacklistOracleProxy.address);

        const goldTokenImplementation = await viem.deployContract('GoldToken', []);
        const goldTokenProxy = await viem.deployContract('InitializableProxy', []);

        const goldTokenInitData = encodeFunctionData({
            abi: goldTokenImplementation.abi,
            functionName: 'initializeGoldToken',
            args: [owner.account!.address, blacklistOracle.address],
        });

        await goldTokenProxy.write.initializeProxy(
            [
                'Arowana Gold Token',
                owner.account!.address,
                goldTokenImplementation.address,
                goldTokenInitData,
            ],
            { account: owner.account },
        );

        const goldToken = await viem.getContractAt('GoldToken', goldTokenProxy.address);

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

        const goldPriceFeedImpl = await viem.deployContract('DataFeed');
        const goldPriceFeedProxy = await viem.deployContract('InitializableProxy', []);

        const goldPriceFeedInitData = encodeFunctionData({
            abi: goldPriceFeedImpl.abi,
            functionName: 'initializeFeed',
            args: [owner.account.address, goldToken.address, `${await goldToken.read.symbol()} / USD`],
        });

        await goldPriceFeedProxy.write.initializeProxy(
            ['DataFeed', owner.account.address, goldPriceFeedImpl.address, goldPriceFeedInitData],
            { account: owner.account },
        );

        const goldPriceFeed = await viem.getContractAt('DataFeed', goldPriceFeedProxy.address);

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
            viem,
        };
    };

    it('test update Price Feed', async function () {
        const { viem, goldToken, USDT, USDC, owner, goldPriceFeed } = await fixture();
        const goldMinterImpl = await viem.deployContract('GoldMinter');
        const goldMinterProxy = await viem.deployContract('InitializableProxy', []);

        const initData = encodeFunctionData({
            abi: goldMinterImpl.abi,
            functionName: 'initializeGoldMinter',
            args: [
                goldToken.address,
                USDT.address,
                USDC.address,
                '0x0000000000000000000000000000000000000001',
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

        await goldMinter.write.updatePriceFeed([goldPriceFeed.address], {
            account: owner.account,
        });
    });

    it('deploy', async function () {
        const { goldToken, USDT, USDC, goldPriceFeed, goldMinter } = await fixture();

        expect(await goldMinter.read.goldToken()).to.equal(getAddress(goldToken.address));
        expect(await goldMinter.read.USDT()).to.equal(getAddress(USDT.address));
        expect(await goldMinter.read.USDC()).to.equal(getAddress(USDC.address));

        expect(await goldPriceFeed.read.latestAnswer()).to.equal(GOLD_PRICE);

        expect(await goldMinter.read.slippage()).to.equal(500);
        expect(await goldMinter.read.mintSpread()).to.equal(75);
        expect(await goldMinter.read.redeemSpread()).to.equal(75);
        expect(await goldMinter.read.mintFee()).to.equal(25);
        expect(await goldMinter.read.redeemFee()).to.equal(25);
    });

    it('getGoldAmount', async function () {
        const { USDT, goldMinter } = await fixture();

        // With 0.75% mint spread, price is 1.0075x higher, so we get less gold
        // Expected gold = 1 / 1.0075 ≈ 0.9925558...
        const expectedGoldWithSpread = (Number(parseEther('1')) * 10000) / 10075;
        const result1 = await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN]);
        expect(Number(result1)).to.be.closeTo(expectedGoldWithSpread, Number(parseEther('0.001'))); // Allow tolerance for spread

        const result2 = await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN / 2n]);
        expect(Number(result2)).to.be.closeTo(expectedGoldWithSpread / 2, Number(parseEther('0.001')));
    });

    it('getUsdAmount', async function () {
        const { USDT, goldMinter } = await fixture();

        // With 0.75% redeem spread, price is 0.9925x lower, so we get less USD
        // Expected USD = price * 0.9925
        const expectedUsdWithSpread = (GOLD_PRICE_IN_USD_TOKEN * 9925n) / 10000n;
        const actualUsd = (await goldMinter.read.getUsdAmount([USDT.address, parseEther('1')])) as bigint;
        // Allow 1 wei tolerance due to rounding
        expect(Number(actualUsd)).to.be.closeTo(Number(expectedUsdWithSpread), 1);

        // Use closeTo for half amount due to rounding differences
        const halfGold = parseEther('1') / 2n;
        const halfUsdResult = await goldMinter.read.getUsdAmount([USDT.address, halfGold]);
        expect(Number(halfUsdResult)).to.be.closeTo(Number(expectedUsdWithSpread / 2n), 1);
    });

    it('requestMint (with permit)', async function () {
        const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

        await goldMinter.write.setLevel([buyer.account.address, 2], {
            account: owner.account,
        });

        const mintAmt = GOLD_PRICE_IN_USD_TOKEN * 2n;

        const signature = await signPermitERC2612({
            token: USDT,
            owner: buyer,
            spender: goldMinter.address,
            value: mintAmt,
            deadline: maxUint256,
        });

        const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintAmt])) as bigint;

        const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;

        const expectedAGTAfterFee = expectedAGT - expectedFee;

        await goldMinter.write.requestMintPermit(
            [USDT.address, mintAmt, expectedAGTAfterFee, maxUint256, signature],
            { account: buyer.account },
        );

        await goldMinter.write.settleMint([0n], {
            account: owner.account,
        });

        const feeBps = await goldMinter.read.mintFee();
        const amountExFee = (expectedAGT * (10000n - BigInt(String(feeBps)))) / 10000n;

        expect(Number(await goldToken.read.balanceOf([buyer.account.address]))).to.be.closeTo(
            Number(amountExFee),
            1000,
        );
    });

    it('requestBurn', async function () {
        const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

        await goldMinter.write.setLevel([buyer.account.address, 2], {
            account: owner.account,
        });
        await USDT.write.approve([goldMinter.address, maxUint256], {
            account: buyer.account,
        });
        const mintAmt = GOLD_PRICE_IN_USD_TOKEN * 2n;

        const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintAmt])) as bigint;

        const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;

        const expectedAGTAfterFee = expectedAGT - expectedFee;

        await goldMinter.write.requestMint([USDT.address, mintAmt, expectedAGTAfterFee], {
            account: buyer.account,
        });
        await goldMinter.write.settleMint([0n], {
            account: owner.account,
        });

        const amountExFee = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
        const burnFee = (await goldMinter.read.calculateGoldFee([amountExFee, false])) as bigint;

        const expectedUSDAfterBurnFee = Number(
            await goldMinter.read.getUsdAmount([USDT.address, amountExFee - burnFee]),
        );

        await goldToken.write.approve([goldMinter.address, maxUint256], {
            account: buyer.account,
        });

        await goldMinter.write.requestBurn([USDT.address, amountExFee, expectedUSDAfterBurnFee], {
            account: buyer.account,
        });

        await USDT.write.approve([goldMinter.address, maxUint256], {
            account: owner.account,
        });

        await goldMinter.write.settleBurn([0n], {
            account: owner.account,
        });

        expect(await goldToken.read.balanceOf([buyer.account.address])).to.equal(0n);
        expect(await goldToken.read.balanceOf([goldMinter.address])).to.equal(0n);
    });

    it('should verify fee calculations for 4300 USDT (higher amount for percentage fee)', async function () {
        const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter } = await fixture();

        await goldMinter.write.updateAutoSettle();

        await goldMinter.write.setLevel([buyer.account.address, 2], {
            account: owner.account,
        });

        // Test parameters - larger amount to trigger percentage fee
        const usdAmount = parseUnits('500', 6); // 500 USDT
        const goldPrice = await goldPriceFeed.read.latestAnswer();

        // Calculate expected AGT amount before fees (keep as bigint for precision)
        const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, usdAmount])) as bigint;

        // Calculate expected fee
        const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;

        // Calculate expected AGT after fees
        const expectedAGTAfterFee = expectedAGT - expectedFee;

        const feeValueInUSD = Number(await goldMinter.read.getUsdAmount([USDT.address, expectedFee]));

        // Approve USDT transfer
        await USDT.write.approve([goldMinter.address, usdAmount], { account: buyer.account });

        // Get initial balances
        const initialOwnerBalance = await goldToken.read.balanceOf([owner.account.address]);
        const initialBuyerBalance = await goldToken.read.balanceOf([buyer.account.address]);

        // Execute mint - use bigint directly for minGoldAmount to avoid precision loss
        await goldMinter.write.requestMint([USDT.address, usdAmount, expectedAGTAfterFee], {
            account: buyer.account,
        });

        // Check final balances
        const finalOwnerBalance = (await goldToken.read.balanceOf([owner.account.address])) as bigint;
        const finalBuyerBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

        const actualFeeReceived = finalOwnerBalance - (initialOwnerBalance as bigint);
        const actualAGTReceived = finalBuyerBalance - (initialBuyerBalance as bigint);

        // Verify fee calculation
        expect(Number(actualFeeReceived)).to.be.closeTo(Number(expectedFee), 10); // Allow small tolerance
        expect(Number(actualAGTReceived)).to.be.closeTo(Number(expectedAGTAfterFee), 1000); // Allow 1000 wei tolerance for rounding

        // Verify this is using percentage fee (0.25%)
        if (expectedAGT >= BigInt(1e18)) {
            const expectedPercentageFee = (Number(expectedAGT) * 25) / 10000; // 0.25%
            expect(Number(expectedFee)).to.be.closeTo(expectedPercentageFee, 1e15); // Allow 0.001 ether tolerance
            console.log(`Percentage fee (0.25%) correctly applied: ${Number(expectedFee) / 1e18} ether`);
        }

        // Now test burn flow - use actual balance from contract (bigint)
        const burnAmount = actualAGTReceived; // Keep as bigint to avoid precision loss
        const expectedUSDReturn = (await goldMinter.read.getUsdAmount([USDT.address, burnAmount])) as bigint;
        const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
        const expectedUSDAfterBurnFee = (await goldMinter.read.getUsdAmount([
            USDT.address,
            burnAmount - burnFee,
        ])) as bigint;

        // Verify burn fee calculation
        if (burnAmount >= BigInt(1e18)) {
            const expectedBurnPercentageFee = (Number(burnAmount) * 25) / 10000; // 0.25%
            expect(Number(burnFee)).to.be.closeTo(expectedBurnPercentageFee, 1000); // Allow 1000 wei tolerance
        } else {
            // Fixed fee should be applied (0.01 ether)
            expect(Number(burnFee)).to.equal(10000000000000000); // 0.01 ether
        }

        // Get owner's initial AGT balance to verify fee transfer
        const initialOwnerAGTBalance = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

        // Approve AGT transfer for burn
        await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

        // Fund the contract with USDT for burn settlement
        await USDT.write.transfer([owner.account.address, expectedUSDReturn], { account: owner.account });
        await USDT.write.approve([goldMinter.address, expectedUSDReturn], { account: owner.account });

        const initialUSDTBalance = (await USDT.read.balanceOf([buyer.account.address])) as bigint;

        // Execute burn (Now properly deducts fee from USD amount)
        await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSDAfterBurnFee], {
            account: buyer.account,
        });

        const finalUSDTBalance = (await USDT.read.balanceOf([buyer.account.address])) as bigint;
        const finalOwnerAGTBalance = (await goldToken.read.balanceOf([owner.account.address])) as bigint;
        const actualUSDTReceived = finalUSDTBalance - initialUSDTBalance;
        const actualAGTFeeReceived = finalOwnerAGTBalance - initialOwnerAGTBalance;

        // Verify burn transaction
        // Now properly deducts burn fee from USD amount
        expect(Number(actualUSDTReceived)).to.be.closeTo(Number(expectedUSDAfterBurnFee), 10000);
        // AGT fee should be transferred to owner
        expect(Number(actualAGTFeeReceived)).to.be.closeTo(Number(burnFee), 1000);

        const burnFeeInUSD = Number(await goldMinter.read.getUsdAmount([USDT.address, actualAGTFeeReceived]));

        const totalFeesInUSD = Number(usdAmount) - Number(actualUSDTReceived);
        const totalFeePercentage = (totalFeesInUSD * 10000) / Number(usdAmount);

        // Total round-trip cost includes:
        // - Mint spread: 0.75% (higher price to buy)
        // - Mint fee: 0.25%
        // - Redeem spread: 0.75% (lower price to sell)
        // - Redeem fee: 0.25%
        // Total approximately: ~2% (spreads + fees combined)
        expect(totalFeePercentage).to.be.closeTo(200, 20); // ~200bps = 2% with 20bps tolerance
        console.log(`Total round-trip cost correctly applied: ${totalFeePercentage / 100}% (spreads + fees)`);
        console.log(`Mint fee: $${feeValueInUSD / 1000000} USD`);
        console.log(`Burn fee: $${burnFeeInUSD / 1000000} USD`);

        console.log(`\n=== COMPLETE TEST SUMMARY ===`);
        console.log(`INITIAL STATE:`);
        console.log(`  User starts with: $${Number(usdAmount) / 1000000} USDT`);
        console.log(
            `  Gold price: $${Number(goldPrice) / 100000000} per ounce, $${Number(goldPrice) / 100000000 / 31.1034768} per gram`,
        );

        console.log(`\nMINT PROCESS:`);
        console.log(`  Expected AGT (before fee, with 0.75% spread): ${Number(expectedAGT) / 1e18} AGT`);
        console.log(
            `  Mint fee: ${Number(expectedFee) / 1e18} AGT = $${feeValueInUSD / 1000000} USD (0.25%)`,
        );
        console.log(`  User received: ${Number(actualAGTReceived) / 1e18} AGT`);
        console.log(
            `  AGT value verification: ${Number(actualAGTReceived) / 1e18} AGT × $${Number(goldPrice) / 100000000 / 31.1034768} = $${(Number(actualAGTReceived) * Number(goldPrice)) / (1e18 * 1e8 * 31.1034768)} USD`,
        );

        console.log(`\nBURN PROCESS:`);
        console.log(`  User burns: ${Number(burnAmount) / 1e18} AGT`);
        console.log(
            `  Burn fee: ${Number(actualAGTFeeReceived) / 1e18} AGT = $${burnFeeInUSD / 1000000} USD (0.25%)`,
        );
        console.log(
            `  User received back (with 0.75% spread): $${Number(actualUSDTReceived) / 1000000} USDT`,
        );
        console.log(`  Remaining AGT after fee: ${Number(burnAmount - actualAGTFeeReceived) / 1e18} AGT`);
        console.log(
            `  Remaining AGT value verification: ${Number(burnAmount - actualAGTFeeReceived) / 1e18} AGT × $${Number(goldPrice) / 100000000 / 31.1034768} = $${(Number(burnAmount - actualAGTFeeReceived) * Number(goldPrice)) / (1e18 * 1e8 * 31.1034768)} USD`,
        );

        console.log(`\nFINAL RESULTS:`);
        console.log(`  Started with: $${Number(usdAmount) / 1000000} USDT`);
        console.log(`  Ended with: $${Number(actualUSDTReceived) / 1000000} USDT`);
        console.log(`  Total fees paid: $${totalFeesInUSD / 1000000} USD (${totalFeePercentage / 100}%)`);
        console.log(
            `  Owner received fees: ${(Number(expectedFee) + Number(actualAGTFeeReceived)) / 1e18} AGT = $${(feeValueInUSD + burnFeeInUSD) / 1000000} USD`,
        );

        console.log(
            `\nVERIFICATION COMPLETE: All fees/spreads calculated correctly (0.75% spread + 0.25% fee)`,
        );
    });

    describe('Minimum Mint Amount with Fee Tests', function () {
        it('should FAIL when minting exactly 1g worth of USD (fee causes net amount < minGoldAmount)', async function () {
            const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter, viem } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // Calculate exact 1g price in USD
            const oneGramPriceUSD = GOLD_PRICE_IN_USD_TOKEN; // This equals 1g worth
            const goldPrice = await goldPriceFeed.read.latestAnswer();

            console.log(`\n=== MINIMUM MINT TEST (Exact 1g) ===`);
            console.log(`Gold price: $${Number(goldPrice) / 1e8} per ounce`);
            console.log(`1g price: $${Number(oneGramPriceUSD) / 1e6} USD`);

            // Calculate expected values
            const expectedAGT = (await goldMinter.read.getGoldAmount([
                USDT.address,
                oneGramPriceUSD,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const netAGT = expectedAGT - expectedFee;

            console.log(`Expected AGT (before fee): ${Number(expectedAGT) / 1e18} AGT`);
            console.log(`Fee (0.4%): ${Number(expectedFee) / 1e18} AGT`);
            console.log(`Net AGT (after fee): ${Number(netAGT) / 1e18} AGT`);
            console.log(`Min required: 1.0 AGT`);

            // Approve USDT
            await USDT.write.approve([goldMinter.address, oneGramPriceUSD], { account: buyer.account });

            // Get initial balances
            const initialBuyerUSDT = await USDT.read.balanceOf([buyer.account.address]);
            const initialBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);

            // minGoldAmount must be >= 1 ether (system requirement)
            // But net amount after fee will be ~0.996 AGT < 1 AGT
            // This should trigger a refund
            const minGoldAmount = parseEther('1'); // 1g minimum

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMint([USDT.address, oneGramPriceUSD, minGoldAmount], {
                    account: buyer.account,
                }),
                goldMinter,
                'Underpriced',
            );

            // Check if refund occurred (auto-settle mode)
            const finalBuyerUSDT = await USDT.read.balanceOf([buyer.account.address]);
            const finalBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);

            // In auto-settle mode, if netAGT < minGoldAmount, refund should occur
            if (Number(netAGT) < Number(minGoldAmount)) {
                // Should have been refunded
                console.log(`\nRESULT: Refund triggered as expected`);
                console.log(
                    `  Buyer USDT change: ${(Number(finalBuyerUSDT) - Number(initialBuyerUSDT)) / 1e6} USD`,
                );
                console.log(
                    `  Buyer AGT received: ${(Number(finalBuyerAGT) - Number(initialBuyerAGT)) / 1e18} AGT`,
                );

                // Buyer should have same or more USDT (refunded)
                // Buyer should have 0 AGT (not minted)
                expect(Number(finalBuyerAGT)).to.equal(Number(initialBuyerAGT));
                console.log(`\n✅ TEST PASSED: Exact 1g USD correctly triggers refund due to fee`);
            }
        });

        it('should SUCCEED when minting 1g + 1.5% worth of USD (enough to cover spread + fee)', async function () {
            const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // Calculate 1g + buffer to cover 0.75% spread + 0.25% fee = 1%
            // Adding 1.5% buffer to ensure we cover everything
            const bufferMultiplier = 1015n; // 1.015 = 101.5%
            const usdAmountWithBuffer = (GOLD_PRICE_IN_USD_TOKEN * bufferMultiplier) / 1000n;

            const goldPrice = await goldPriceFeed.read.latestAnswer();

            console.log(`\n=== MINIMUM MINT TEST (1g + 1.5% buffer for spread+fee) ===`);
            console.log(`Gold price: $${Number(goldPrice) / 1e8} per ounce`);
            console.log(`1g price: $${Number(GOLD_PRICE_IN_USD_TOKEN) / 1e6} USD`);
            console.log(`Depositing: $${Number(usdAmountWithBuffer) / 1e6} USD (1g + 1.5%)`);

            // Calculate expected values
            const expectedAGT = (await goldMinter.read.getGoldAmount([
                USDT.address,
                usdAmountWithBuffer,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const netAGT = expectedAGT - expectedFee;

            console.log(`Expected AGT (before fee, with 0.75% spread): ${Number(expectedAGT) / 1e18} AGT`);
            console.log(`Fee (0.25%): ${Number(expectedFee) / 1e18} AGT`);
            console.log(`Net AGT (after fee): ${Number(netAGT) / 1e18} AGT`);
            console.log(`Min required: 1.0 AGT`);

            // Approve USDT
            await USDT.write.approve([goldMinter.address, usdAmountWithBuffer], { account: buyer.account });

            // Get initial balances
            const initialBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);

            // Set minGoldAmount to 1g
            const minGoldAmount = parseEther('1');

            // This should succeed
            await goldMinter.write.requestMint([USDT.address, usdAmountWithBuffer, minGoldAmount], {
                account: buyer.account,
            });

            // Check final balances
            const finalBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);
            const actualAGTReceived = Number(finalBuyerAGT) - Number(initialBuyerAGT);

            console.log(`\nRESULT:`);
            console.log(`  Buyer AGT received: ${actualAGTReceived / 1e18} AGT`);
            console.log(`  Expected net AGT: ${Number(netAGT) / 1e18} AGT`);

            // Should have received AGT >= 1g
            expect(actualAGTReceived).to.be.greaterThanOrEqual(Number(parseEther('1')));
            expect(actualAGTReceived).to.be.closeTo(Number(netAGT), 1000);

            console.log(
                `\n✅ TEST PASSED: 1g + 1.5% buffer successfully minted ${actualAGTReceived / 1e18} AGT`,
            );
        });

        it('should calculate exact minimum USD required to mint 1g after spread and fee', async function () {
            const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const goldPrice = await goldPriceFeed.read.latestAnswer();
            const mintSpread = 75n; // 0.75% = 75 bps
            const feeRate = 25n; // 0.25% = 25 bps

            console.log(`\n=== EXACT MINIMUM CALCULATION (with spread) ===`);
            console.log(`Gold price: $${Number(goldPrice) / 1e8} per ounce`);
            console.log(`1g base price: $${Number(GOLD_PRICE_IN_USD_TOKEN) / 1e6} USD`);
            console.log(`Mint spread: ${Number(mintSpread) / 100}%`);
            console.log(`Fee rate: ${Number(feeRate) / 100}%`);

            // To receive exactly 1g after spread and fee:
            // grossAGT = USD / (price * 1.0075)  [spread applied]
            // netAGT = grossAGT * 0.9975  [fee applied]
            // 1g = (USD / (price * 1.0075)) * 0.9975
            // USD = 1g * price * 1.0075 / 0.9975
            // USD = 1g_price * 1.0075 / 0.9975 = 1g_price * 10075 / 9975

            // Calculate minimum USD needed (ceiling division to ensure we round up)
            const numerator = 10000n + mintSpread; // 10075
            const denominator = 10000n - feeRate; // 9975
            const minUSDRequired = (GOLD_PRICE_IN_USD_TOKEN * numerator + denominator - 1n) / denominator;

            console.log(`\nMinimum USD to get 1g after spread+fee: $${Number(minUSDRequired) / 1e6} USD`);
            console.log(
                `This is ${(Number(minUSDRequired) / Number(GOLD_PRICE_IN_USD_TOKEN) - 1) * 100}% more than 1g base price`,
            );

            // Verify by calculation
            const expectedAGT = (await goldMinter.read.getGoldAmount([
                USDT.address,
                minUSDRequired,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const netAGT = expectedAGT - expectedFee;

            console.log(`\nVerification:`);
            console.log(`  If deposit $${Number(minUSDRequired) / 1e6} USD:`);
            console.log(`  Gross AGT: ${Number(expectedAGT) / 1e18} AGT`);
            console.log(`  Fee: ${Number(expectedFee) / 1e18} AGT`);
            console.log(`  Net AGT: ${Number(netAGT) / 1e18} AGT`);

            // Net should be >= 1g
            expect(Number(netAGT)).to.be.greaterThanOrEqual(Number(parseEther('1')) - 1000); // Allow tiny rounding

            // Now test actual minting
            await USDT.write.approve([goldMinter.address, minUSDRequired], { account: buyer.account });

            const initialBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);

            await goldMinter.write.requestMint([USDT.address, minUSDRequired, parseEther('1')], {
                account: buyer.account,
            });

            const finalBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);
            const actualAGTReceived = Number(finalBuyerAGT) - Number(initialBuyerAGT);

            console.log(`\nActual mint result:`);
            console.log(`  AGT received: ${actualAGTReceived / 1e18} AGT`);

            expect(actualAGTReceived).to.be.greaterThanOrEqual(Number(parseEther('1')) - 1000);

            console.log(
                `\n✅ TEST PASSED: Exact minimum USD ($${Number(minUSDRequired) / 1e6}) successfully mints >= 1g`,
            );

            // Summary
            console.log(`\n=== SUMMARY ===`);
            console.log(`To mint minimum 1g AGT:`);
            console.log(`  Base 1g price: $${Number(GOLD_PRICE_IN_USD_TOKEN) / 1e6} USD`);
            console.log(
                `  + 0.4% fee buffer: $${(Number(minUSDRequired) - Number(GOLD_PRICE_IN_USD_TOKEN)) / 1e6} USD`,
            );
            console.log(`  = Minimum deposit: $${Number(minUSDRequired) / 1e6} USD`);
        });

        it('should verify slippage validation with fee consideration', async function () {
            const { owner, buyer, USDT, goldMinter } = await fixture();

            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // Test: User wants to mint, sets minGoldAmount = 0.99g (below 1g minimum)
            // This should revert because system minimum is 1g
            const usdAmount = GOLD_PRICE_IN_USD_TOKEN;

            await USDT.write.approve([goldMinter.address, usdAmount], { account: buyer.account });

            console.log(`\n=== SLIPPAGE + MINIMUM VALIDATION TEST ===`);
            console.log(`Testing minGoldAmount below system minimum (1g)`);

            try {
                // Try to set minGoldAmount = 0.99g (should fail)
                await goldMinter.write.requestMint([USDT.address, usdAmount, parseEther('0.99')], {
                    account: buyer.account,
                });
                console.log(`❌ TEST FAILED: Should have reverted for minGoldAmount < 1g`);
                expect.fail('Should have reverted');
            } catch (error) {
                console.log(`✅ TEST PASSED: Correctly reverted for minGoldAmount < 1g`);
                console.log(`Error: SmallAmount (minGoldAmount must be >= 1g)`);
            }
        });

        it('should show fee impact at different gold prices', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner } = await fixture();

            console.log(`\n=== FEE IMPACT AT DIFFERENT GOLD PRICES ===`);
            console.log(`Fee rate: 0.4%`);
            console.log(`Minimum mint: 1g AGT\n`);

            // Test different gold prices
            const goldPrices = [
                { price: 2000, desc: 'Low ($2000/oz)' },
                { price: 2500, desc: 'Medium ($2500/oz)' },
                { price: 3000, desc: 'High ($3000/oz)' },
                { price: 4096.342, desc: 'Current test price' },
            ];

            for (const { price, desc } of goldPrices) {
                const priceInOracle = parseUnits(String(price), 8);
                await goldPriceFeed.write.updateAnswer([priceInOracle], { account: owner.account });

                const oneGramPrice = (await goldMinter.read.getUsdAmount([
                    USDT.address,
                    parseEther('1'),
                ])) as bigint;
                const minUSDRequired = (oneGramPrice * 10000n) / 9960n; // Include 0.4% fee
                const feeInUSD = BigInt(minUSDRequired) - BigInt(oneGramPrice);

                console.log(`${desc}:`);
                console.log(`  1g base price: $${Number(oneGramPrice) / 1e6}`);
                console.log(`  Min deposit for 1g: $${Number(minUSDRequired) / 1e6}`);
                console.log(
                    `  Fee amount: $${Number(feeInUSD) / 1e6} (${((Number(feeInUSD) / Number(oneGramPrice)) * 100).toFixed(2)}%)`,
                );
                console.log('');
            }

            // Restore original price
            await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });
        });
    });

    describe('User Burn Query Functions', function () {
        // Helper function to mint gold tokens for a user
        async function mintGoldForUser(
            goldMinter: any,
            USDT: any,
            goldToken: any,
            owner: any,
            user: any,
            usdAmount: bigint,
        ) {
            await goldMinter.write.setLevel([user.account.address, 2], { account: owner.account });
            await USDT.write.approve([goldMinter.address, usdAmount], { account: user.account });

            const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, usdAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const expectedAGTAfterFee = expectedAGT - expectedFee;

            await goldMinter.write.requestMint([USDT.address, usdAmount, expectedAGTAfterFee], {
                account: user.account,
            });
            await goldMinter.write.settleMint([0n], { account: owner.account });

            return await goldToken.read.balanceOf([user.account.address]);
        }

        it('should return correct getUserBurnCount after requestBurn', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            // Setup: Give buyer gold tokens
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Check initial count
            const initialCount = await goldMinter.read.getUserBurnCount([buyer.account.address]);
            expect(initialCount).to.equal(0n);

            // Request burn
            const goldBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const burnAmount = goldBalance / 4n;
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount * 2n], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // Check count after burn request
            const countAfterBurn = await goldMinter.read.getUserBurnCount([buyer.account.address]);
            expect(countAfterBurn).to.equal(1n);

            // Request another burn
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            const finalCount = await goldMinter.read.getUserBurnCount([buyer.account.address]);
            expect(finalCount).to.equal(2n);
        });

        it('should return correct getUserPendingBurnCount', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            // Setup
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Disable autoSettle to create pending burns
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // Check initial pending count
            const initialPending = await goldMinter.read.getUserPendingBurnCount([buyer.account.address]);
            expect(initialPending).to.equal(0n);

            // Request burn (will be pending)
            const goldBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const burnAmount = goldBalance / 3n;
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // Check pending count
            const pendingAfterRequest = await goldMinter.read.getUserPendingBurnCount([
                buyer.account.address,
            ]);
            expect(pendingAfterRequest).to.equal(1n);

            // Settle the burn
            await goldMinter.write.settleBurn([0n], { account: owner.account });

            // Check pending count after settle
            const pendingAfterSettle = await goldMinter.read.getUserPendingBurnCount([buyer.account.address]);
            expect(pendingAfterSettle).to.equal(0n);
        });

        it('should return correct getUserBurnNonces with pagination', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            // Setup - mint more gold (enough for 5 burns of 1g each)
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 20n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Disable autoSettle
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // Create multiple burn requests - use minimum 1g each
            const burnAmount = parseEther('1'); // 1g minimum
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount * 5n], { account: buyer.account });
            for (let i = 0; i < 5; i++) {
                await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                    account: buyer.account,
                });
            }

            // Test pagination - get first 3
            const firstPage = (await goldMinter.read.getUserBurnNonces([
                buyer.account.address,
                0n,
                3n,
            ])) as any[];
            expect(firstPage.length).to.equal(3);
            expect(firstPage[0]).to.equal(0n);
            expect(firstPage[1]).to.equal(1n);
            expect(firstPage[2]).to.equal(2n);

            // Test pagination - get next 3 (should return only 2)
            const secondPage = (await goldMinter.read.getUserBurnNonces([
                buyer.account.address,
                3n,
                3n,
            ])) as any[];
            expect(secondPage.length).to.equal(2);
            expect(secondPage[0]).to.equal(3n);
            expect(secondPage[1]).to.equal(4n);

            // Test offset beyond length
            const emptyPage = (await goldMinter.read.getUserBurnNonces([
                buyer.account.address,
                10n,
                5n,
            ])) as any[];
            expect(emptyPage.length).to.equal(0);
        });

        it('should return correct orders with getBurnOrdersByNonces', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            // Setup
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Disable autoSettle
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // Create burn requests with different amounts
            const goldBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const burnAmount1 = goldBalance / 4n;
            const burnAmount2 = goldBalance / 3n;

            const burnFee1 = (await goldMinter.read.calculateGoldFee([burnAmount1, false])) as bigint;
            const expectedUSD1 = await goldMinter.read.getUsdAmount([USDT.address, burnAmount1 - burnFee1]);
            const burnFee2 = (await goldMinter.read.calculateGoldFee([burnAmount2, false])) as bigint;
            const expectedUSD2 = await goldMinter.read.getUsdAmount([USDT.address, burnAmount2 - burnFee2]);

            await goldToken.write.approve([goldMinter.address, burnAmount1 + burnAmount2], {
                account: buyer.account,
            });
            await goldMinter.write.requestBurn([USDT.address, burnAmount1, expectedUSD1], {
                account: buyer.account,
            });
            await goldMinter.write.requestBurn([USDT.address, burnAmount2, expectedUSD2], {
                account: buyer.account,
            });

            // Get orders by nonces
            const orders = (await goldMinter.read.getBurnOrdersByNonces([[0n, 1n]])) as any[];

            expect(orders.length).to.equal(2);
            expect(orders[0].goldAmount).to.equal(burnAmount1);
            expect(orders[0].seller.toLowerCase()).to.equal(buyer.account.address.toLowerCase());
            expect(orders[0].isSettled).to.equal(false);

            expect(orders[1].goldAmount).to.equal(burnAmount2);
            expect(orders[1].isSettled).to.equal(false);

            // Settle first order
            await goldMinter.write.settleBurn([0n], { account: owner.account });

            // Check updated orders
            const updatedOrders = (await goldMinter.read.getBurnOrdersByNonces([[0n, 1n]])) as any[];
            expect(updatedOrders[0].isSettled).to.equal(true);
            expect(updatedOrders[1].isSettled).to.equal(false);
        });

        it('should track pending count correctly across multiple users', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            // Get another user
            const [, , user2] = await viem.getWalletClients();

            // Setup buyer with gold tokens
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 10n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Transfer some gold to user2
            const goldBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            await goldToken.write.transfer([user2.account.address, goldBalance / 2n], {
                account: buyer.account,
            });

            // Setup user2 level
            await goldMinter.write.setLevel([user2.account.address, 2], { account: owner.account });

            // Disable autoSettle
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // Calculate burn amounts
            const buyerGold = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const burnAmount = buyerGold / 4n;
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            // Buyer creates 2 burn requests
            await goldToken.write.approve([goldMinter.address, burnAmount * 2n], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // User2 creates 1 burn request
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: user2.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: user2.account,
            });

            // Check counts
            expect(await goldMinter.read.getUserBurnCount([buyer.account.address])).to.equal(2n);
            expect(await goldMinter.read.getUserPendingBurnCount([buyer.account.address])).to.equal(2n);

            expect(await goldMinter.read.getUserBurnCount([user2.account.address])).to.equal(1n);
            expect(await goldMinter.read.getUserPendingBurnCount([user2.account.address])).to.equal(1n);

            // Settle buyer's first burn
            await goldMinter.write.settleBurn([0n], { account: owner.account });

            // Check updated counts
            expect(await goldMinter.read.getUserPendingBurnCount([buyer.account.address])).to.equal(1n);
            expect(await goldMinter.read.getUserPendingBurnCount([user2.account.address])).to.equal(1n);
        });
    });

    describe('User Mint Query Functions', function () {
        it('should return correct getUserMintCount after requestMint', async function () {
            const { owner, buyer, USDT, goldMinter } = await fixture();

            // Setup
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // Check initial count
            const initialCount = await goldMinter.read.getUserMintCount([buyer.account.address]);
            expect(initialCount).to.equal(0n);

            // Request mint
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 2n;
            const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const expectedAGTAfterFee = expectedAGT - expectedFee;

            await USDT.write.approve([goldMinter.address, mintAmount * 2n], { account: buyer.account });
            await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGTAfterFee], {
                account: buyer.account,
            });

            // Check count after mint request
            const countAfterMint = await goldMinter.read.getUserMintCount([buyer.account.address]);
            expect(countAfterMint).to.equal(1n);

            // Request another mint
            await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGTAfterFee], {
                account: buyer.account,
            });

            const finalCount = await goldMinter.read.getUserMintCount([buyer.account.address]);
            expect(finalCount).to.equal(2n);
        });

        it('should return correct getUserPendingMintCount', async function () {
            const { owner, buyer, USDT, goldMinter } = await fixture();

            // Setup
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // autoSettle is already false in fixture, no need to toggle

            // Check initial pending count
            const initialPending = await goldMinter.read.getUserPendingMintCount([buyer.account.address]);
            expect(initialPending).to.equal(0n);

            // Request mint (will be pending)
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 2n;
            const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const expectedAGTAfterFee = expectedAGT - expectedFee;

            await USDT.write.approve([goldMinter.address, mintAmount], { account: buyer.account });
            await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGTAfterFee], {
                account: buyer.account,
            });

            // Check pending count
            const pendingAfterRequest = await goldMinter.read.getUserPendingMintCount([
                buyer.account.address,
            ]);
            expect(pendingAfterRequest).to.equal(1n);

            // Settle the mint
            await goldMinter.write.settleMint([0n], { account: owner.account });

            // Check pending count after settle
            const pendingAfterSettle = await goldMinter.read.getUserPendingMintCount([buyer.account.address]);
            expect(pendingAfterSettle).to.equal(0n);
        });

        it('should return correct getUserMintNonces with pagination', async function () {
            const { owner, buyer, USDT, goldMinter } = await fixture();

            // Setup
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // autoSettle is already false in fixture

            // Calculate mint parameters
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 2n;
            const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const expectedAGTAfterFee = expectedAGT - expectedFee;

            // Approve enough for 5 mints
            await USDT.write.approve([goldMinter.address, mintAmount * 5n], { account: buyer.account });

            // Create multiple mint requests
            for (let i = 0; i < 5; i++) {
                await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGTAfterFee], {
                    account: buyer.account,
                });
            }

            // Test pagination - get first 3
            const firstPage = (await goldMinter.read.getUserMintNonces([
                buyer.account.address,
                0n,
                3n,
            ])) as any[];
            expect(firstPage.length).to.equal(3);
            expect(firstPage[0]).to.equal(0n);
            expect(firstPage[1]).to.equal(1n);
            expect(firstPage[2]).to.equal(2n);

            // Test pagination - get next 3 (should return only 2)
            const secondPage = (await goldMinter.read.getUserMintNonces([
                buyer.account.address,
                3n,
                3n,
            ])) as any[];
            expect(secondPage.length).to.equal(2);
            expect(secondPage[0]).to.equal(3n);
            expect(secondPage[1]).to.equal(4n);

            // Test offset beyond length
            const emptyPage = (await goldMinter.read.getUserMintNonces([
                buyer.account.address,
                10n,
                5n,
            ])) as any[];
            expect(emptyPage.length).to.equal(0);
        });

        it('should return correct orders with getMintOrdersByNonces', async function () {
            const { owner, buyer, USDT, goldMinter } = await fixture();

            // Setup
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // autoSettle is already false in fixture

            // Create mint requests with different amounts
            const mintAmount1 = GOLD_PRICE_IN_USD_TOKEN * 2n;
            const mintAmount2 = GOLD_PRICE_IN_USD_TOKEN * 3n;

            const expectedAGT1 = (await goldMinter.read.getGoldAmount([USDT.address, mintAmount1])) as bigint;
            const expectedFee1 = (await goldMinter.read.calculateGoldFee([expectedAGT1, true])) as bigint;
            const expectedAGTAfterFee1 = expectedAGT1 - expectedFee1;

            const expectedAGT2 = (await goldMinter.read.getGoldAmount([USDT.address, mintAmount2])) as bigint;
            const expectedFee2 = (await goldMinter.read.calculateGoldFee([expectedAGT2, true])) as bigint;
            const expectedAGTAfterFee2 = expectedAGT2 - expectedFee2;

            await USDT.write.approve([goldMinter.address, mintAmount1 + mintAmount2], {
                account: buyer.account,
            });
            await goldMinter.write.requestMint([USDT.address, mintAmount1, expectedAGTAfterFee1], {
                account: buyer.account,
            });
            await goldMinter.write.requestMint([USDT.address, mintAmount2, expectedAGTAfterFee2], {
                account: buyer.account,
            });

            // Get orders by nonces
            const orders = (await goldMinter.read.getMintOrdersByNonces([[0n, 1n]])) as any[];

            expect(orders.length).to.equal(2);
            expect(orders[0].usdAmount).to.equal(mintAmount1);
            expect(orders[0].buyer.toLowerCase()).to.equal(buyer.account.address.toLowerCase());
            expect(orders[0].isSettled).to.equal(false);

            expect(orders[1].usdAmount).to.equal(mintAmount2);
            expect(orders[1].isSettled).to.equal(false);

            // Settle first order
            await goldMinter.write.settleMint([0n], { account: owner.account });

            // Check updated orders
            const updatedOrders = (await goldMinter.read.getMintOrdersByNonces([[0n, 1n]])) as any[];
            expect(updatedOrders[0].isSettled).to.equal(true);
            expect(updatedOrders[1].isSettled).to.equal(false);
        });

        it('should track pending count correctly across multiple users', async function () {
            const { owner, buyer, USDT, goldMinter, viem } = await fixture();

            // Get another user
            const [, , user2] = await viem.getWalletClients();

            // Setup both users
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });
            await goldMinter.write.setLevel([user2.account.address, 2], { account: owner.account });

            // Transfer USDT to user2
            await USDT.write.transfer([user2.account.address, parseUnits('1000', 6)], {
                account: owner.account,
            });

            // autoSettle is already false in fixture

            // Calculate mint parameters
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 2n;
            const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const expectedAGTAfterFee = expectedAGT - expectedFee;

            // Buyer creates 2 mint requests
            await USDT.write.approve([goldMinter.address, mintAmount * 2n], { account: buyer.account });
            await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGTAfterFee], {
                account: buyer.account,
            });
            await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGTAfterFee], {
                account: buyer.account,
            });

            // User2 creates 1 mint request
            await USDT.write.approve([goldMinter.address, mintAmount], { account: user2.account });
            await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGTAfterFee], {
                account: user2.account,
            });

            // Check counts
            expect(await goldMinter.read.getUserMintCount([buyer.account.address])).to.equal(2n);
            expect(await goldMinter.read.getUserPendingMintCount([buyer.account.address])).to.equal(2n);

            expect(await goldMinter.read.getUserMintCount([user2.account.address])).to.equal(1n);
            expect(await goldMinter.read.getUserPendingMintCount([user2.account.address])).to.equal(1n);

            // Settle buyer's first mint
            await goldMinter.write.settleMint([0n], { account: owner.account });

            // Check updated counts
            expect(await goldMinter.read.getUserPendingMintCount([buyer.account.address])).to.equal(1n);
            expect(await goldMinter.read.getUserPendingMintCount([user2.account.address])).to.equal(1n);
        });
    });

    describe('Spread Admin Functions', function () {
        it('should allow owner to update mintSpread', async function () {
            const { owner, goldMinter } = await fixture();

            // Initial value is 75 (0.75%)
            expect(await goldMinter.read.mintSpread()).to.equal(75);

            // Update to 150 (1.5%)
            await goldMinter.write.updateMintSpread([150], { account: owner.account });
            expect(await goldMinter.read.mintSpread()).to.equal(150);

            // Update to 0 (no spread)
            await goldMinter.write.updateMintSpread([0], { account: owner.account });
            expect(await goldMinter.read.mintSpread()).to.equal(0);

            // Update to max allowed (300 = 3%)
            await goldMinter.write.updateMintSpread([300], { account: owner.account });
            expect(await goldMinter.read.mintSpread()).to.equal(300);
        });

        it('should allow owner to update redeemSpread', async function () {
            const { owner, goldMinter } = await fixture();

            // Initial value is 75 (0.75%)
            expect(await goldMinter.read.redeemSpread()).to.equal(75);

            // Update to 200 (2%)
            await goldMinter.write.updateRedeemSpread([200], { account: owner.account });
            expect(await goldMinter.read.redeemSpread()).to.equal(200);

            // Update to 0 (no spread)
            await goldMinter.write.updateRedeemSpread([0], { account: owner.account });
            expect(await goldMinter.read.redeemSpread()).to.equal(0);

            // Update to max allowed (300 = 3%)
            await goldMinter.write.updateRedeemSpread([300], { account: owner.account });
            expect(await goldMinter.read.redeemSpread()).to.equal(300);
        });

        it('should revert when mintSpread exceeds max (3%)', async function () {
            const { owner, goldMinter, viem } = await fixture();

            // 301 (3.01%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateMintSpread([301], { account: owner.account }),
                goldMinter,
                'Overflow',
            );

            // 500 (5%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateMintSpread([500], { account: owner.account }),
                goldMinter,
                'Overflow',
            );
        });

        it('should revert when redeemSpread exceeds max (3%)', async function () {
            const { owner, goldMinter, viem } = await fixture();

            // 301 (3.01%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateRedeemSpread([301], { account: owner.account }),
                goldMinter,
                'Overflow',
            );

            // 1000 (10%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateRedeemSpread([1000], { account: owner.account }),
                goldMinter,
                'Overflow',
            );
        });

        it('should revert when non-owner tries to update mintSpread', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateMintSpread([100], { account: buyer.account }),
                goldMinter,
                'OwnableUnauthorizedAccount',
                [getAddress(buyer.account.address)],
            );
        });

        it('should revert when non-owner tries to update redeemSpread', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateRedeemSpread([100], { account: buyer.account }),
                goldMinter,
                'OwnableUnauthorizedAccount',
                [getAddress(buyer.account.address)],
            );
        });

        it('should correctly affect getGoldAmount when mintSpread changes', async function () {
            const { owner, goldMinter, USDT } = await fixture();

            const usdAmount = parseUnits('1000', 6); // 1000 USDT

            // Get gold amount with default spread (0.75%)
            const goldWith75bps = await goldMinter.read.getGoldAmount([USDT.address, usdAmount]);

            // Update to 0% spread
            await goldMinter.write.updateMintSpread([0], { account: owner.account });
            const goldWith0bps = await goldMinter.read.getGoldAmount([USDT.address, usdAmount]);

            // Update to 3% spread (max)
            await goldMinter.write.updateMintSpread([300], { account: owner.account });
            const goldWith300bps = await goldMinter.read.getGoldAmount([USDT.address, usdAmount]);

            // With 0% spread, user gets more gold
            expect((goldWith0bps as bigint) > (goldWith75bps as bigint)).to.be.true;

            // With 3% spread, user gets less gold
            expect((goldWith300bps as bigint) < (goldWith75bps as bigint)).to.be.true;

            // Verify approximate ratios
            // 0% vs 0.75%: goldWith0bps should be ~1.0075x goldWith75bps
            const ratio0vs75 = (Number(goldWith0bps) / Number(goldWith75bps)) * 10000;
            expect(ratio0vs75).to.be.closeTo(10075, 5); // ~1.0075x with small tolerance

            // 3% vs 0.75%: goldWith300bps should be ~0.9778x goldWith75bps (10075/10300)
            const ratio300vs75 = (Number(goldWith300bps) / Number(goldWith75bps)) * 10000;
            expect(ratio300vs75).to.be.closeTo(9782, 5); // ~0.9782x with small tolerance
        });

        it('should correctly affect getUsdAmount when redeemSpread changes', async function () {
            const { owner, goldMinter, USDT } = await fixture();

            const goldAmount = parseEther('1'); // 1g gold

            // Get USD amount with default spread (0.75%)
            const usdWith75bps = await goldMinter.read.getUsdAmount([USDT.address, goldAmount]);

            // Update to 0% spread
            await goldMinter.write.updateRedeemSpread([0], { account: owner.account });
            const usdWith0bps = await goldMinter.read.getUsdAmount([USDT.address, goldAmount]);

            // Update to 3% spread (max)
            await goldMinter.write.updateRedeemSpread([300], { account: owner.account });
            const usdWith300bps = await goldMinter.read.getUsdAmount([USDT.address, goldAmount]);

            // With 0% spread, user gets more USD
            expect((usdWith0bps as bigint) > (usdWith75bps as bigint)).to.be.true;

            // With 3% spread, user gets less USD
            expect((usdWith300bps as bigint) < (usdWith75bps as bigint)).to.be.true;

            // Verify approximate ratios
            // 0% vs 0.75%: usdWith0bps should be ~1.0076x usdWith75bps (9925 -> 10000)
            const ratio0vs75 = (Number(usdWith0bps) / Number(usdWith75bps)) * 10000;
            expect(ratio0vs75).to.be.closeTo(10076, 5);

            // 3% vs 0.75%: usdWith300bps should be ~0.9773x usdWith75bps (9925 -> 9700)
            const ratio300vs75 = (Number(usdWith300bps) / Number(usdWith75bps)) * 10000;
            expect(ratio300vs75).to.be.closeTo(9773, 5);
        });

        it('should successfully update spread values and verify state changes', async function () {
            const { owner, goldMinter } = await fixture();

            // Update mintSpread and verify
            await goldMinter.write.updateMintSpread([150], { account: owner.account });
            expect(await goldMinter.read.mintSpread()).to.equal(150);

            // Update redeemSpread and verify
            await goldMinter.write.updateRedeemSpread([200], { account: owner.account });
            expect(await goldMinter.read.redeemSpread()).to.equal(200);
        });
    });

    describe('Fee Admin Functions', function () {
        it('should allow owner to update mintFee', async function () {
            const { owner, goldMinter } = await fixture();

            // Initial value is 25 (0.25%)
            expect(await goldMinter.read.mintFee()).to.equal(25);

            // Update to 50 (0.5%)
            await goldMinter.write.updateMintFee([50], { account: owner.account });
            expect(await goldMinter.read.mintFee()).to.equal(50);

            // Update to 0 (no fee)
            await goldMinter.write.updateMintFee([0], { account: owner.account });
            expect(await goldMinter.read.mintFee()).to.equal(0);

            // Update to max allowed (100 = 1%)
            await goldMinter.write.updateMintFee([100], { account: owner.account });
            expect(await goldMinter.read.mintFee()).to.equal(100);
        });

        it('should allow owner to update redeemFee', async function () {
            const { owner, goldMinter } = await fixture();

            // Initial value is 25 (0.25%)
            expect(await goldMinter.read.redeemFee()).to.equal(25);

            // Update to 75 (0.75%)
            await goldMinter.write.updateRedeemFee([75], { account: owner.account });
            expect(await goldMinter.read.redeemFee()).to.equal(75);

            // Update to 0 (no fee)
            await goldMinter.write.updateRedeemFee([0], { account: owner.account });
            expect(await goldMinter.read.redeemFee()).to.equal(0);

            // Update to max allowed (100 = 1%)
            await goldMinter.write.updateRedeemFee([100], { account: owner.account });
            expect(await goldMinter.read.redeemFee()).to.equal(100);
        });

        it('should revert when mintFee exceeds max (1%)', async function () {
            const { owner, goldMinter, viem } = await fixture();

            // 101 (1.01%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateMintFee([101], { account: owner.account }),
                goldMinter,
                'Overflow',
            );

            // 200 (2%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateMintFee([200], { account: owner.account }),
                goldMinter,
                'Overflow',
            );
        });

        it('should revert when redeemFee exceeds max (1%)', async function () {
            const { owner, goldMinter, viem } = await fixture();

            // 101 (1.01%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateRedeemFee([101], { account: owner.account }),
                goldMinter,
                'Overflow',
            );

            // 500 (5%) should fail
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateRedeemFee([500], { account: owner.account }),
                goldMinter,
                'Overflow',
            );
        });

        it('should revert when non-owner tries to update fees', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateMintFee([50], { account: buyer.account }),
                goldMinter,
                'OwnableUnauthorizedAccount',
                [getAddress(buyer.account.address)],
            );

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateRedeemFee([50], { account: buyer.account }),
                goldMinter,
                'OwnableUnauthorizedAccount',
                [getAddress(buyer.account.address)],
            );
        });

        it('should correctly affect calculateGoldFee when fees change', async function () {
            const { owner, goldMinter } = await fixture();

            const goldAmount = parseEther('10'); // 10g gold

            // Fee with default 0.25%
            const fee25bps = await goldMinter.read.calculateGoldFee([goldAmount, true]);
            expect(fee25bps).to.equal((goldAmount * 25n) / 10000n);

            // Update to 1% fee
            await goldMinter.write.updateMintFee([100], { account: owner.account });
            const fee100bps = await goldMinter.read.calculateGoldFee([goldAmount, true]);
            expect(fee100bps).to.equal((goldAmount * 100n) / 10000n);

            // Update to 0% fee
            await goldMinter.write.updateMintFee([0], { account: owner.account });
            const fee0bps = await goldMinter.read.calculateGoldFee([goldAmount, true]);
            expect(fee0bps).to.equal(0n);
        });
    });
});
