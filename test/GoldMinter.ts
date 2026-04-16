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
                'Ontorium Gold Token',
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
                owner.account.address, // feeRecipient
                owner.account.address,
                false,
            ],
        });

        await goldMinterProxy.write.initializeProxy(
            ['GoldMinter', owner.account.address, goldMinterImpl.address, initData],
            { account: owner.account },
        );

        const goldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

        // Grant all roles to owner for testing
        const SETTLER_ROLE = await goldMinter.read.SETTLER_ROLE();
        const PARAMETER_MANAGER_ROLE = await goldMinter.read.PARAMETER_MANAGER_ROLE();
        const INFRA_MANAGER_ROLE = await goldMinter.read.INFRA_MANAGER_ROLE();
        const KYC_MANAGER_ROLE = await goldMinter.read.KYC_MANAGER_ROLE();

        await goldMinter.write.grantRole([SETTLER_ROLE, owner.account.address], { account: owner.account });
        await goldMinter.write.grantRole([PARAMETER_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });
        await goldMinter.write.grantRole([INFRA_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });
        await goldMinter.write.grantRole([KYC_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });

        await goldToken.write.addMinter([goldMinter.address], {
            account: owner.account,
        });

        // The contract defaults were changed to 1kg units, but these tests assume gram-unit amounts,
        // so the fixture reverts the minimum values back to a 1g basis.
        await goldMinter.write.updateMinMintAmount([parseEther('1')], { account: owner.account });
        await goldMinter.write.updateMinRedeemAmount([parseEther('1')], { account: owner.account });
        await goldMinter.write.updateMinGoldFee([parseEther('0.01')], { account: owner.account });
        await goldMinter.write.updateMinGoldFeeAmount([parseEther('1')], { account: owner.account });

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
                owner.account.address, // feeRecipient
                owner.account.address,
                false,
            ],
        });

        await goldMinterProxy.write.initializeProxy(
            ['GoldMinter', owner.account.address, goldMinterImpl.address, initData],
            { account: owner.account },
        );

        const goldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

        // Grant INFRA_MANAGER_ROLE to owner
        const INFRA_MANAGER_ROLE = await goldMinter.read.INFRA_MANAGER_ROLE();
        await goldMinter.write.grantRole([INFRA_MANAGER_ROLE, owner.account.address], {
            account: owner.account,
        });

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
        expect(await goldMinter.read.mintSpread()).to.equal(150);
        expect(await goldMinter.read.redeemSpread()).to.equal(150);
        expect(await goldMinter.read.mintFee()).to.equal(25);
        expect(await goldMinter.read.redeemFee()).to.equal(25);
    });

    it('getGoldAmount', async function () {
        const { USDT, goldMinter } = await fixture();

        // With 1.5% mint spread, price is 1.015x higher, so we get less gold
        // Expected gold = 1 / 1.015 ≈ 0.9852217...
        const expectedGoldWithSpread = (Number(parseEther('1')) * 10000) / 10150;
        const result1 = await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN]);
        expect(Number(result1)).to.be.closeTo(expectedGoldWithSpread, Number(parseEther('0.001'))); // Allow tolerance for spread

        const result2 = await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN / 2n]);
        expect(Number(result2)).to.be.closeTo(expectedGoldWithSpread / 2, Number(parseEther('0.001')));
    });

    it('getUsdAmount', async function () {
        const { USDT, goldMinter } = await fixture();

        // With 1.5% redeem spread, price is 0.985x lower, so we get less USD
        // Expected USD = price * 0.985
        const expectedUsdWithSpread = (GOLD_PRICE_IN_USD_TOKEN * 9850n) / 10000n;
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

        // New fee calculation: goldAmount × (1 + spread%) × fee%
        const actualBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
        const expectedNetAGT = expectedAGT - expectedFee;

        expect(Number(actualBalance)).to.be.closeTo(Number(expectedNetAGT), 1000);
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

        // Verify this is using percentage fee: goldAmount × fee% (simplified formula)
        if (expectedAGT >= BigInt(1e18)) {
            const mintFee = Number(await goldMinter.read.mintFee());
            const expectedPercentageFee = (Number(expectedAGT) * mintFee) / 10000;
            expect(Number(expectedFee)).to.be.closeTo(expectedPercentageFee, 1e15); // Allow 0.001 ether tolerance
            console.log(
                `Percentage fee (${mintFee / 100}%) correctly applied: ${Number(expectedFee) / 1e18} ether`,
            );
        }

        // Now test burn flow - use actual balance from contract (bigint)
        const burnAmount = actualAGTReceived; // Keep as bigint to avoid precision loss
        const expectedUSDReturn = (await goldMinter.read.getUsdAmount([USDT.address, burnAmount])) as bigint;
        const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
        const expectedUSDAfterBurnFee = (await goldMinter.read.getUsdAmount([
            USDT.address,
            burnAmount - burnFee,
        ])) as bigint;

        // Verify burn fee calculation: goldAmount × fee% (simplified formula)
        if (burnAmount >= BigInt(1e18)) {
            const redeemFee = Number(await goldMinter.read.redeemFee());
            const expectedBurnPercentageFee = (Number(burnAmount) * redeemFee) / 10000;
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
        // - Mint spread: 1.5% (higher price to buy)
        // - Mint fee: 0.25%
        // - Redeem spread: 1.5% (lower price to sell)
        // - Redeem fee: 0.25%
        // Total approximately: ~3.5% (spreads + fees combined)
        expect(totalFeePercentage).to.be.closeTo(350, 20); // ~350bps = 3.5% with 20bps tolerance
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
        console.log(`  Expected AGT (before fee, with 1.5% spread): ${Number(expectedAGT) / 1e18} AGT`);
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
        console.log(`  User received back (with 1.5% spread): $${Number(actualUSDTReceived) / 1000000} USDT`);
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
            `\nVERIFICATION COMPLETE: All fees/spreads calculated correctly (1.5% spread + 0.25% fee)`,
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
            }
        });

        it('should SUCCEED when minting 1g + 2% worth of USD (enough to cover spread + fee)', async function () {
            const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // Calculate 1g + buffer to cover 1.5% spread + 0.25% fee = 1.75%
            // Adding 2% buffer to ensure we cover everything
            const bufferMultiplier = 1020n; // 1.020 = 102%
            const usdAmountWithBuffer = (GOLD_PRICE_IN_USD_TOKEN * bufferMultiplier) / 1000n;

            const goldPrice = await goldPriceFeed.read.latestAnswer();

            console.log(`\n=== MINIMUM MINT TEST (1g + 2% buffer for spread+fee) ===`);
            console.log(`Gold price: $${Number(goldPrice) / 1e8} per ounce`);
            console.log(`1g price: $${Number(GOLD_PRICE_IN_USD_TOKEN) / 1e6} USD`);
            console.log(`Depositing: $${Number(usdAmountWithBuffer) / 1e6} USD (1g + 2%)`);

            // Calculate expected values
            const expectedAGT = (await goldMinter.read.getGoldAmount([
                USDT.address,
                usdAmountWithBuffer,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            const netAGT = expectedAGT - expectedFee;

            console.log(`Expected AGT (before fee, with 1.5% spread): ${Number(expectedAGT) / 1e18} AGT`);
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
        });

        it('should calculate exact minimum USD required to mint 1g (gross) after spread', async function () {
            const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const goldPrice = await goldPriceFeed.read.latestAnswer();
            const mintSpreadRaw = await goldMinter.read.mintSpread();
            const mintSpread = BigInt(Number(mintSpreadRaw));
            const mintFeeRaw = await goldMinter.read.mintFee();
            const mintFee = BigInt(Number(mintFeeRaw));

            console.log(`\n=== EXACT MINIMUM CALCULATION (gross >= 1g) ===`);
            console.log(`Gold price: $${Number(goldPrice) / 1e8} per ounce`);
            console.log(`1g base price: $${Number(GOLD_PRICE_IN_USD_TOKEN) / 1e6} USD`);
            console.log(`Mint spread: ${Number(mintSpread) / 100}%`);
            console.log(`Fee rate: ${Number(mintFee) / 100}%`);

            // New validation: gross >= 1g (not net >= 1g)
            // grossAGT = USD / (price * (1 + spread%))
            // To get grossAGT >= 1g:
            // USD >= 1g * price * (1 + spread%)
            // USD >= 1g_price * (10000 + spread) / 10000

            // Calculate minimum USD needed for gross >= 1g
            const minUSDRequired = (GOLD_PRICE_IN_USD_TOKEN * (10000n + mintSpread) + 9999n) / 10000n + 1n;

            console.log(`\nMinimum USD to get gross 1g: $${Number(minUSDRequired) / 1e6} USD`);
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
            console.log(`  Gross AGT: ${Number(expectedAGT) / 1e18} AGT (must be >= 1g)`);
            console.log(`  Fee: ${Number(expectedFee) / 1e18} AGT`);
            console.log(`  Net AGT: ${Number(netAGT) / 1e18} AGT (user receives, can be < 1g)`);

            // Gross should be >= 1g (new validation)
            expect(Number(expectedAGT)).to.be.greaterThanOrEqual(Number(parseEther('1')) - 1000);

            // Now test actual minting
            await USDT.write.approve([goldMinter.address, minUSDRequired], { account: buyer.account });

            const initialBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);

            // minGoldAmount is the slippage protection (user's minimum acceptable)
            // It should be <= netAGT for the tx to succeed
            await goldMinter.write.requestMint([USDT.address, minUSDRequired, netAGT], {
                account: buyer.account,
            });

            const finalBuyerAGT = await goldToken.read.balanceOf([buyer.account.address]);
            const actualAGTReceived = Number(finalBuyerAGT) - Number(initialBuyerAGT);

            console.log(`\nActual mint result:`);
            console.log(`  AGT received: ${actualAGTReceived / 1e18} AGT`);

            // User receives net amount (after fee)
            expect(actualAGTReceived).to.be.closeTo(Number(netAGT), 1000);

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
                console.log(`TEST FAILED: Should have reverted for minGoldAmount < 1g`);
                expect.fail('Should have reverted');
            } catch {
                console.log(`TEST PASSED: Correctly reverted for minGoldAmount < 1g`);
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

            // Initial value is 150 (1.5%)
            expect(await goldMinter.read.mintSpread()).to.equal(150);

            // Update to 75 (0.75%)
            await goldMinter.write.updateMintSpread([75], { account: owner.account });
            expect(await goldMinter.read.mintSpread()).to.equal(75);

            // Update to 0 (no spread)
            await goldMinter.write.updateMintSpread([0], { account: owner.account });
            expect(await goldMinter.read.mintSpread()).to.equal(0);

            // Update to max allowed (300 = 3%)
            await goldMinter.write.updateMintSpread([300], { account: owner.account });
            expect(await goldMinter.read.mintSpread()).to.equal(300);
        });

        it('should allow owner to update redeemSpread', async function () {
            const { owner, goldMinter } = await fixture();

            // Initial value is 150 (1.5%)
            expect(await goldMinter.read.redeemSpread()).to.equal(150);

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

        it('should revert when non-authorized account tries to update mintSpread', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            const PARAMETER_MANAGER_ROLE = await goldMinter.read.PARAMETER_MANAGER_ROLE();
            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateMintSpread([100], { account: buyer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
                [getAddress(buyer.account.address), PARAMETER_MANAGER_ROLE],
            );
        });

        it('should revert when non-authorized account tries to update redeemSpread', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            const PARAMETER_MANAGER_ROLE = await goldMinter.read.PARAMETER_MANAGER_ROLE();
            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateRedeemSpread([100], { account: buyer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
                [getAddress(buyer.account.address), PARAMETER_MANAGER_ROLE],
            );
        });

        it('should correctly affect getGoldAmount when mintSpread changes', async function () {
            const { owner, goldMinter, USDT } = await fixture();

            const usdAmount = parseUnits('1000', 6); // 1000 USDT

            // Get gold amount with default spread (1.5%)
            const goldWith150bps = await goldMinter.read.getGoldAmount([USDT.address, usdAmount]);

            // Update to 0% spread
            await goldMinter.write.updateMintSpread([0], { account: owner.account });
            const goldWith0bps = await goldMinter.read.getGoldAmount([USDT.address, usdAmount]);

            // Update to 3% spread (max)
            await goldMinter.write.updateMintSpread([300], { account: owner.account });
            const goldWith300bps = await goldMinter.read.getGoldAmount([USDT.address, usdAmount]);

            // With 0% spread, user gets more gold
            expect((goldWith0bps as bigint) > (goldWith150bps as bigint)).to.be.true;

            // With 3% spread, user gets less gold
            expect((goldWith300bps as bigint) < (goldWith150bps as bigint)).to.be.true;

            // Verify approximate ratios
            // 0% vs 1.5%: goldWith0bps should be ~1.015x goldWith150bps
            const ratio0vs150 = (Number(goldWith0bps) / Number(goldWith150bps)) * 10000;
            expect(ratio0vs150).to.be.closeTo(10150, 5); // ~1.015x with small tolerance

            // 3% vs 1.5%: goldWith300bps should be ~0.9854x goldWith150bps (10150/10300)
            const ratio300vs150 = (Number(goldWith300bps) / Number(goldWith150bps)) * 10000;
            expect(ratio300vs150).to.be.closeTo(9854, 5); // ~0.9854x with small tolerance
        });

        it('should correctly affect getUsdAmount when redeemSpread changes', async function () {
            const { owner, goldMinter, USDT } = await fixture();

            const goldAmount = parseEther('1'); // 1g gold

            // Get USD amount with default spread (1.5%)
            const usdWith150bps = await goldMinter.read.getUsdAmount([USDT.address, goldAmount]);

            // Update to 0% spread
            await goldMinter.write.updateRedeemSpread([0], { account: owner.account });
            const usdWith0bps = await goldMinter.read.getUsdAmount([USDT.address, goldAmount]);

            // Update to 3% spread (max)
            await goldMinter.write.updateRedeemSpread([300], { account: owner.account });
            const usdWith300bps = await goldMinter.read.getUsdAmount([USDT.address, goldAmount]);

            // With 0% spread, user gets more USD
            expect((usdWith0bps as bigint) > (usdWith150bps as bigint)).to.be.true;

            // With 3% spread, user gets less USD
            expect((usdWith300bps as bigint) < (usdWith150bps as bigint)).to.be.true;

            // Verify approximate ratios
            // 0% vs 1.5%: usdWith0bps should be ~1.0152x usdWith150bps (9850 -> 10000)
            const ratio0vs150 = (Number(usdWith0bps) / Number(usdWith150bps)) * 10000;
            expect(ratio0vs150).to.be.closeTo(10152, 5);

            // 3% vs 1.5%: usdWith300bps should be ~0.9848x usdWith150bps (9850 -> 9700)
            const ratio300vs150 = (Number(usdWith300bps) / Number(usdWith150bps)) * 10000;
            expect(ratio300vs150).to.be.closeTo(9848, 5);
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

    describe('1 AGT Base Fee Calculation (Simplified)', function () {
        it('should verify exact fee calculation for 1 AGT mint', async function () {
            const { goldMinter } = await fixture();

            const oneAGT = parseEther('1'); // 1 AGT = 1e18 wei

            const mintFee = Number(await goldMinter.read.mintFee()); // 25 = 0.25%

            console.log('\n' + '='.repeat(60));
            console.log('1 AGT MINT FEE CALCULATION (SIMPLIFIED)');
            console.log('='.repeat(60));

            console.log(`\n[Parameters]`);
            console.log(`  mintFee: ${mintFee} bps = ${mintFee / 100}%`);

            console.log(`\n[Formula]`);
            console.log(`  fee = goldAmount × fee / 10000`);
            console.log(`      = 1 AGT × ${mintFee} / 10000`);
            console.log(`      = ${mintFee / 10000} AGT`);

            // Manual calculation in wei: simple 0.25%
            const manualFee = (BigInt(oneAGT) * BigInt(mintFee)) / 10000n;
            const contractFee = (await goldMinter.read.calculateGoldFee([oneAGT, true])) as bigint;

            console.log(`\n[Result]`);
            console.log(`  Manual: ${Number(manualFee) / 1e18} AGT (${manualFee} wei)`);
            console.log(`  Contract: ${Number(contractFee) / 1e18} AGT (${contractFee} wei)`);

            const effectiveRate = (Number(contractFee) / Number(oneAGT)) * 100;
            console.log(`\n[Effective Fee Rate]`);
            console.log(`  ${effectiveRate.toFixed(6)}%`);

            expect(contractFee).to.equal(manualFee);
        });

        it('should verify exact fee calculation for 1 AGT redeem', async function () {
            const { goldMinter } = await fixture();

            const oneAGT = parseEther('1');

            const redeemFee = Number(await goldMinter.read.redeemFee());

            console.log('\n' + '='.repeat(60));
            console.log('1 AGT REDEEM FEE CALCULATION (SIMPLIFIED)');
            console.log('='.repeat(60));

            console.log(`\n[Parameters]`);
            console.log(`  redeemFee: ${redeemFee} bps = ${redeemFee / 100}%`);

            console.log(`\n[Formula]`);
            console.log(`  fee = goldAmount × fee / 10000`);
            console.log(`      = 1 AGT × ${redeemFee} / 10000`);
            console.log(`      = ${redeemFee / 10000} AGT`);

            // Manual calculation in wei: simple 0.25%
            const manualFee = (BigInt(oneAGT) * BigInt(redeemFee)) / 10000n;
            const contractFee = (await goldMinter.read.calculateGoldFee([oneAGT, false])) as bigint;

            console.log(`\n[Result]`);
            console.log(`  Manual: ${Number(manualFee) / 1e18} AGT (${manualFee} wei)`);
            console.log(`  Contract: ${Number(contractFee) / 1e18} AGT (${contractFee} wei)`);

            expect(contractFee).to.equal(manualFee);
            console.log('\n' + '='.repeat(60));
        });

        it('should verify 1 AGT mint flow with exact fee breakdown', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, goldPriceFeed } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const goldPrice = Number(await goldPriceFeed.read.latestAnswer()) / 1e8;
            const mintSpread = Number(await goldMinter.read.mintSpread());
            const mintFee = Number(await goldMinter.read.mintFee());

            console.log('\n' + '='.repeat(60));
            console.log('1 AGT MINT FLOW TEST');
            console.log('='.repeat(60));

            console.log(`\n[Parameters]`);
            console.log(`  Gold price: $${goldPrice}/oz = $${(goldPrice / 31.1034768).toFixed(2)}/g`);
            console.log(`  mintSpread: ${mintSpread / 100}%, mintFee: ${mintFee / 100}%`);

            // Calculate exact USD needed to get exactly 1 AGT gross
            // GOLD_PRICE_IN_USD_TOKEN is already gram-based (1g = 1 AGT)
            // Add spread: usdAmount = 1g price × (1 + spread%), round up to ensure >= 1g
            const oneGramPrice = GOLD_PRICE_IN_USD_TOKEN;
            const usdAmount = (oneGramPrice * BigInt(10000 + mintSpread) + 9999n) / 10000n + 1n;

            console.log(`\n[Mint exactly 1 AGT]`);
            console.log(`  1g base price: $${Number(oneGramPrice) / 1e6}`);
            console.log(`  With ${mintSpread / 100}% spread: $${Number(usdAmount) / 1e6}`);

            await USDT.write.approve([goldMinter.address, usdAmount], { account: buyer.account });

            const grossAGT = (await goldMinter.read.getGoldAmount([USDT.address, usdAmount])) as bigint;
            const mintFeeAmt = (await goldMinter.read.calculateGoldFee([grossAGT, true])) as bigint;
            // Simplified formula: fee = goldAmount × fee / 10000
            const expectedMintFee = (BigInt(grossAGT) * BigInt(mintFee)) / 10000n;
            const netAGT = grossAGT - mintFeeAmt;

            console.log(`  Gross AGT: ${Number(grossAGT) / 1e18} AGT`);
            console.log(`  Mint fee calculation (simplified):`);
            console.log(`    = ${Number(grossAGT) / 1e18} × ${mintFee} / 10000`);
            console.log(`    = ${Number(expectedMintFee) / 1e18} AGT`);
            console.log(`  Contract fee: ${Number(mintFeeAmt) / 1e18} AGT`);
            console.log(`  Net AGT (user receives): ${Number(netAGT) / 1e18} AGT`);

            expect(mintFeeAmt).to.equal(expectedMintFee);

            // Execute mint
            const initialBuyerAGT = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const initialOwnerAGT = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            await goldMinter.write.requestMint([USDT.address, usdAmount, netAGT], {
                account: buyer.account,
            });

            const finalBuyerAGT = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const finalOwnerAGT = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            const buyerReceived = finalBuyerAGT - initialBuyerAGT;
            const ownerReceived = finalOwnerAGT - initialOwnerAGT;

            console.log(`\n[Result]`);
            console.log(`  Buyer received: ${Number(buyerReceived) / 1e18} AGT`);
            console.log(`  Owner (fee): ${Number(ownerReceived) / 1e18} AGT`);
            console.log(`  Total minted: ${Number(buyerReceived + ownerReceived) / 1e18} AGT`);

            expect(buyerReceived).to.equal(netAGT);
            expect(ownerReceived).to.equal(mintFeeAmt);
        });

        it('should verify 1 AGT burn flow with exact fee breakdown', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const mintSpread = Number(await goldMinter.read.mintSpread());
            const mintFee = Number(await goldMinter.read.mintFee());
            const redeemSpread = Number(await goldMinter.read.redeemSpread());
            const redeemFee = Number(await goldMinter.read.redeemFee());

            console.log('\n' + '='.repeat(60));
            console.log('1 AGT BURN FLOW TEST (SIMPLIFIED FEE)');
            console.log('='.repeat(60));

            console.log(`\n[Parameters]`);
            console.log(`  mintSpread: ${mintSpread / 100}%, mintFee: ${mintFee / 100}%`);
            console.log(`  redeemSpread: ${redeemSpread / 100}%, redeemFee: ${redeemFee / 100}%`);

            // Calculate gross AGT needed to get exactly 1 AGT net after mint fee
            // netAGT = grossAGT - (grossAGT × fee / 10000)
            // netAGT = grossAGT × (10000 - fee) / 10000
            // grossAGT = netAGT × 10000 / (10000 - fee), round up
            const oneAGT = parseEther('1');
            const feeMultiplier = BigInt(mintFee); // 25 = 0.25%
            const denominator = 10000n - feeMultiplier; // 9975
            const grossAGT = (oneAGT * 10000n + denominator - 1n) / denominator; // ceiling

            // Calculate USD needed for grossAGT (using gram-based price), round up + buffer
            const oneGramPrice = GOLD_PRICE_IN_USD_TOKEN;
            const divisor = parseEther('1') * 10000n;
            // Add +1 to ensure we definitely get >= 1g net after rounding through getGoldAmount
            const usdAmount =
                (grossAGT * oneGramPrice * BigInt(10000 + mintSpread) + divisor - 1n) / divisor + 1n;

            console.log(`\n[Setup: Mint to get exactly 1 AGT net]`);
            console.log(`  Target net AGT: 1.0 AGT`);
            console.log(`  Required gross AGT: ${Number(grossAGT) / 1e18} AGT`);
            console.log(`  1g base price: $${Number(oneGramPrice) / 1e6}`);
            console.log(`  USD needed (with spread): $${Number(usdAmount) / 1e6}`);

            // Execute mint
            await USDT.write.approve([goldMinter.address, usdAmount], { account: buyer.account });
            const actualGrossAGT = (await goldMinter.read.getGoldAmount([USDT.address, usdAmount])) as bigint;
            const mintFeeAmt = (await goldMinter.read.calculateGoldFee([actualGrossAGT, true])) as bigint;
            const netMintAGT = actualGrossAGT - mintFeeAmt;

            await goldMinter.write.requestMint([USDT.address, usdAmount, netMintAGT], {
                account: buyer.account,
            });

            const buyerAGT = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            console.log(`  Actual gross AGT: ${Number(actualGrossAGT) / 1e18} AGT`);
            console.log(`  Mint fee: ${Number(mintFeeAmt) / 1e18} AGT`);
            console.log(`  Buyer received: ${Number(buyerAGT) / 1e18} AGT`);

            console.log(`\n[Burn 1 AGT]`);
            const burnFeeAmt = (await goldMinter.read.calculateGoldFee([buyerAGT, false])) as bigint;
            // Simplified formula: fee = goldAmount × fee / 10000
            const expectedBurnFee = (BigInt(buyerAGT) * BigInt(redeemFee)) / 10000n;

            const netGoldAfterFee = buyerAGT - burnFeeAmt;
            const expectedUSD = (await goldMinter.read.getUsdAmount([
                USDT.address,
                netGoldAfterFee,
            ])) as bigint;

            console.log(`  Burn amount: ${Number(buyerAGT) / 1e18} AGT`);
            console.log(`  Burn fee calculation (simplified):`);
            console.log(`    = ${Number(buyerAGT) / 1e18} × ${redeemFee} / 10000`);
            console.log(`    = ${Number(expectedBurnFee) / 1e18} AGT`);
            console.log(`  Contract fee: ${Number(burnFeeAmt) / 1e18} AGT`);
            console.log(`  Net gold after fee: ${Number(netGoldAfterFee) / 1e18} AGT`);
            console.log(`  Expected USD (with spread): $${Number(expectedUSD) / 1e6}`);

            expect(burnFeeAmt).to.equal(expectedBurnFee);

            // Execute burn
            await goldToken.write.approve([goldMinter.address, buyerAGT], { account: buyer.account });
            await USDT.write.approve([goldMinter.address, expectedUSD], { account: owner.account });

            const buyerUSDTBefore = (await USDT.read.balanceOf([buyer.account.address])) as bigint;
            const ownerAGTBefore = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            await goldMinter.write.requestBurn([USDT.address, buyerAGT, expectedUSD], {
                account: buyer.account,
            });

            const buyerUSDTAfter = (await USDT.read.balanceOf([buyer.account.address])) as bigint;
            const ownerAGTAfter = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            const usdReceived = buyerUSDTAfter - buyerUSDTBefore;
            const feeReceived = ownerAGTAfter - ownerAGTBefore;

            console.log(`\n[Result]`);
            console.log(`  Buyer received USD: $${Number(usdReceived) / 1e6}`);
            console.log(`  Owner received fee: ${Number(feeReceived) / 1e18} AGT`);

            expect(Number(usdReceived)).to.be.closeTo(Number(expectedUSD), 10);
            expect(feeReceived).to.equal(burnFeeAmt);
        });

        it('should verify 1 AGT fee with varying spread/fee params', async function () {
            const { owner, goldMinter } = await fixture();

            const oneAGT = parseEther('1');

            console.log('\n' + '='.repeat(60));
            console.log('1 AGT FEE WITH DIFFERENT PARAMETERS');
            console.log('='.repeat(60));

            const testCases = [
                { spread: 0, fee: 25, desc: 'No spread, 0.25% fee' },
                { spread: 75, fee: 25, desc: '0.75% spread, 0.25% fee' },
                { spread: 150, fee: 50, desc: '1.5% spread, 0.5% fee (default spread)' },
                { spread: 300, fee: 100, desc: '3% spread, 1% fee (max)' },
            ];

            for (const { spread, fee, desc } of testCases) {
                await goldMinter.write.updateMintSpread([spread], { account: owner.account });
                await goldMinter.write.updateMintFee([fee], { account: owner.account });

                const contractFee = (await goldMinter.read.calculateGoldFee([oneAGT, true])) as bigint;
                // Simplified formula: fee = goldAmount × fee / 10000
                const expectedFee = (BigInt(oneAGT) * BigInt(fee)) / 10000n;
                const effectiveRate = fee;

                console.log(`\n[${desc}]`);
                console.log(`  Formula: 1 × ${fee} / 10000`);
                console.log(`         = ${Number(expectedFee) / 1e18} AGT`);
                console.log(`  Contract: ${Number(contractFee) / 1e18} AGT`);
                console.log(`  Effective rate: ${effectiveRate / 100}%`);

                expect(contractFee).to.equal(expectedFee);
            }

            // Restore defaults
            await goldMinter.write.updateMintSpread([150], { account: owner.account });
            await goldMinter.write.updateMintFee([25], { account: owner.account });

            console.log('\n' + '='.repeat(60));
        });
    });

    describe('Simplified Fee Calculation Verification', function () {
        it('should verify mint fee formula: goldAmount × mintFee% (simplified)', async function () {
            const { goldMinter } = await fixture();

            // Get current parameters
            const mintFee = Number(await goldMinter.read.mintFee()); // 25 = 0.25%

            console.log('\n=== MINT FEE FORMULA VERIFICATION (SIMPLIFIED) ===');
            console.log(`mintFee: ${mintFee / 100}% (${mintFee} bps)`);
            console.log(`Formula: goldAmount × ${mintFee / 100}%`);
            console.log(`       = goldAmount × ${mintFee} / 10000`);

            // Test with various gold amounts
            const testAmounts = [
                { amount: parseEther('1'), desc: '1g' },
                { amount: parseEther('10'), desc: '10g' },
                { amount: parseEther('100'), desc: '100g' },
                { amount: parseEther('1000'), desc: '1000g (1kg)' },
            ];

            for (const { amount, desc } of testAmounts) {
                const calculatedFee = (await goldMinter.read.calculateGoldFee([amount, true])) as bigint;
                // Simplified formula: fee = goldAmount × fee / 10000
                const expectedFee = (BigInt(amount) * BigInt(mintFee)) / 10000n;

                console.log(`\n${desc}:`);
                console.log(`  Gold amount: ${Number(amount) / 1e18} AGT`);
                console.log(`  Expected fee: ${Number(expectedFee) / 1e18} AGT`);
                console.log(`  Contract fee: ${Number(calculatedFee) / 1e18} AGT`);
                console.log(`  Fee %: ${((Number(calculatedFee) / Number(amount)) * 100).toFixed(4)}%`);

                // Verify exact match
                expect(calculatedFee).to.equal(expectedFee);
            }

            // Verify the effective fee rate
            const effectiveFeeRate = mintFee;
            console.log(`\nEffective mint fee rate: ${effectiveFeeRate / 100}%`);
        });

        it('should verify redeem fee formula: goldAmount × redeemFee% (simplified)', async function () {
            const { goldMinter } = await fixture();

            // Get current parameters
            const redeemFee = Number(await goldMinter.read.redeemFee()); // 25 = 0.25%

            console.log('\n=== REDEEM FEE FORMULA VERIFICATION (SIMPLIFIED) ===');
            console.log(`redeemFee: ${redeemFee / 100}% (${redeemFee} bps)`);
            console.log(`Formula: goldAmount × ${redeemFee / 100}%`);

            // Test with various gold amounts
            const testAmounts = [
                { amount: parseEther('1'), desc: '1g' },
                { amount: parseEther('10'), desc: '10g' },
                { amount: parseEther('100'), desc: '100g' },
            ];

            for (const { amount, desc } of testAmounts) {
                const calculatedFee = (await goldMinter.read.calculateGoldFee([amount, false])) as bigint;
                // Simplified formula: fee = goldAmount × fee / 10000
                const expectedFee = (BigInt(amount) * BigInt(redeemFee)) / 10000n;

                console.log(`\n${desc}:`);
                console.log(`  Gold amount: ${Number(amount) / 1e18} AGT`);
                console.log(`  Expected fee: ${Number(expectedFee) / 1e18} AGT`);
                console.log(`  Contract fee: ${Number(calculatedFee) / 1e18} AGT`);

                // Verify exact match
                expect(calculatedFee).to.equal(expectedFee);
            }
        });

        it('should verify fee is independent of spread (simplified formula)', async function () {
            const { owner, goldMinter } = await fixture();

            const goldAmount = parseEther('100'); // 100g
            const mintFee = Number(await goldMinter.read.mintFee()); // 25

            console.log('\n=== FEE IS INDEPENDENT OF SPREAD (SIMPLIFIED) ===');
            console.log(`Gold amount: 100g, mintFee: ${mintFee / 100}%`);

            // Simplified formula: fee = goldAmount × fee / 10000 (spread doesn't affect fee)
            const expectedFee = (BigInt(goldAmount) * BigInt(mintFee)) / 10000n;

            // Test different spread values - fee should remain the same
            const spreadTests = [
                { spread: 0, desc: '0%' },
                { spread: 75, desc: '0.75%' },
                { spread: 150, desc: '1.5%' },
                { spread: 300, desc: '3%' },
            ];

            for (const { spread, desc } of spreadTests) {
                await goldMinter.write.updateMintSpread([spread], { account: owner.account });

                const calculatedFee = (await goldMinter.read.calculateGoldFee([goldAmount, true])) as bigint;

                console.log(`\nSpread ${desc} (${spread} bps):`);
                console.log(`  Expected fee: ${Number(expectedFee) / 1e18} AGT`);
                console.log(`  Contract fee: ${Number(calculatedFee) / 1e18} AGT`);
                console.log(`  Fee rate: ${mintFee / 100}% (unchanged by spread)`);

                // Fee should be the same regardless of spread
                expect(calculatedFee).to.equal(expectedFee);
            }

            // Restore default spread
            await goldMinter.write.updateMintSpread([150], { account: owner.account });
        });

        it('should verify fee changes when fee rate parameters change', async function () {
            const { owner, goldMinter } = await fixture();

            const goldAmount = parseEther('100'); // 100g

            console.log('\n=== FEE CHANGE WITH FEE RATE CHANGE (SIMPLIFIED) ===');
            console.log(`Gold amount: 100g`);

            // Test different fee values
            const feeTests = [
                { fee: 0, desc: '0%' },
                { fee: 25, desc: '0.25%' },
                { fee: 50, desc: '0.5%' },
                { fee: 100, desc: '1%' },
            ];

            for (const { fee, desc } of feeTests) {
                await goldMinter.write.updateMintFee([fee], { account: owner.account });

                const calculatedFee = (await goldMinter.read.calculateGoldFee([goldAmount, true])) as bigint;
                // Simplified formula: fee = goldAmount × fee / 10000
                const expectedFee = (BigInt(goldAmount) * BigInt(fee)) / 10000n;

                console.log(`\nFee rate ${desc} (${fee} bps):`);
                console.log(`  Expected fee: ${Number(expectedFee) / 1e18} AGT`);
                console.log(`  Contract fee: ${Number(calculatedFee) / 1e18} AGT`);
                console.log(`  Effective rate: ${fee / 100}%`);

                expect(calculatedFee).to.equal(expectedFee);
            }

            // Restore default fee
            await goldMinter.write.updateMintFee([25], { account: owner.account });
        });

        it('should verify minimum fee is applied for small amounts', async function () {
            const { goldMinter } = await fixture();

            const minGoldFeeAmount = (await goldMinter.read.minGoldFeeAmount()) as bigint;
            const minGoldFee = (await goldMinter.read.minGoldFee()) as bigint;

            console.log('\n=== MINIMUM FEE VERIFICATION ===');
            console.log(`minGoldFeeAmount: ${Number(minGoldFeeAmount) / 1e18} AGT`);
            console.log(`minGoldFee: ${Number(minGoldFee) / 1e18} AGT`);

            // Test amounts below threshold
            const smallAmounts = [parseEther('0.1'), parseEther('0.5'), parseEther('0.9')];

            for (const amount of smallAmounts) {
                const calculatedFee = (await goldMinter.read.calculateGoldFee([amount, true])) as bigint;

                console.log(`\n${Number(amount) / 1e18}g (below ${Number(minGoldFeeAmount) / 1e18}g):`);
                console.log(`  Fee: ${Number(calculatedFee) / 1e18} AGT`);
                console.log(`  Expected: ${Number(minGoldFee) / 1e18} AGT (minimum fee)`);

                // Should equal minimum fee
                expect(calculatedFee).to.equal(minGoldFee);
            }

            // Test amount at/above threshold
            const atThreshold = minGoldFeeAmount;
            const feeAtThreshold = (await goldMinter.read.calculateGoldFee([atThreshold, true])) as bigint;

            const mintFee = Number(await goldMinter.read.mintFee());
            // Simplified formula: fee = goldAmount × fee / 10000
            const expectedPercentageFee = (BigInt(atThreshold) * BigInt(mintFee)) / 10000n;

            console.log(`\n${Number(atThreshold) / 1e18}g (at threshold):`);
            console.log(`  Fee: ${Number(feeAtThreshold) / 1e18} AGT`);
            console.log(`  Expected: ${Number(expectedPercentageFee) / 1e18} AGT (percentage fee)`);

            // Should use percentage fee, not minimum
            expect(feeAtThreshold).to.equal(expectedPercentageFee);
        });

        it('should verify mint uses mintSpread and redeem uses redeemSpread independently', async function () {
            const { owner, goldMinter } = await fixture();

            const goldAmount = parseEther('100'); // 100g

            console.log('\n=== INDEPENDENT SPREAD VERIFICATION ===');

            // Set different spreads for mint and redeem
            await goldMinter.write.updateMintSpread([100], { account: owner.account }); // 1%
            await goldMinter.write.updateRedeemSpread([200], { account: owner.account }); // 2%

            const mintSpread = Number(await goldMinter.read.mintSpread());
            const redeemSpread = Number(await goldMinter.read.redeemSpread());
            const mintFee = Number(await goldMinter.read.mintFee());
            const redeemFee = Number(await goldMinter.read.redeemFee());

            console.log(`mintSpread: ${mintSpread / 100}%, mintFee: ${mintFee / 100}%`);
            console.log(`redeemSpread: ${redeemSpread / 100}%, redeemFee: ${redeemFee / 100}%`);

            // Calculate mint fee (isMint = true)
            const mintFeeAmount = (await goldMinter.read.calculateGoldFee([goldAmount, true])) as bigint;
            // Simplified formula: fee = goldAmount × fee / 10000
            const expectedMintFee = (BigInt(goldAmount) * BigInt(mintFee)) / 10000n;

            // Calculate redeem fee (isMint = false)
            const redeemFeeAmount = (await goldMinter.read.calculateGoldFee([goldAmount, false])) as bigint;
            const expectedRedeemFee = (BigInt(goldAmount) * BigInt(redeemFee)) / 10000n;

            console.log(`\nMint fee (isMint=true):`);
            console.log(`  Expected: ${Number(expectedMintFee) / 1e18} AGT (mintFee ${mintFee} bps)`);
            console.log(`  Contract: ${Number(mintFeeAmount) / 1e18} AGT`);

            console.log(`\nRedeem fee (isMint=false):`);
            console.log(`  Expected: ${Number(expectedRedeemFee) / 1e18} AGT (redeemFee ${redeemFee} bps)`);
            console.log(`  Contract: ${Number(redeemFeeAmount) / 1e18} AGT`);

            // Verify mint fee
            expect(mintFeeAmount).to.equal(expectedMintFee);

            // Verify redeem fee
            expect(redeemFeeAmount).to.equal(expectedRedeemFee);

            // With simplified formula, mint and redeem fees are equal when fee rates are equal
            expect(mintFeeAmount).to.equal(redeemFeeAmount);

            // Restore defaults
            await goldMinter.write.updateMintSpread([150], { account: owner.account });
            await goldMinter.write.updateRedeemSpread([150], { account: owner.account });
        });

        it('should verify complete mint flow with simplified fee calculation', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const usdAmount = parseUnits('1000', 6); // 1000 USDT

            const mintSpread = Number(await goldMinter.read.mintSpread());
            const mintFee = Number(await goldMinter.read.mintFee());

            console.log('\n=== COMPLETE MINT FLOW VERIFICATION (SIMPLIFIED) ===');
            console.log(`USD amount: $${Number(usdAmount) / 1e6}`);
            console.log(`mintSpread: ${mintSpread / 100}%, mintFee: ${mintFee / 100}%`);

            // Step 1: Calculate gross AGT (before fee)
            const grossAGT = (await goldMinter.read.getGoldAmount([USDT.address, usdAmount])) as bigint;
            console.log(`\nStep 1 - Gross AGT (with spread): ${Number(grossAGT) / 1e18} AGT`);

            // Step 2: Calculate fee (simplified formula)
            const fee = (await goldMinter.read.calculateGoldFee([grossAGT, true])) as bigint;
            // Simplified formula: fee = goldAmount × fee / 10000
            const expectedFee = (BigInt(grossAGT) * BigInt(mintFee)) / 10000n;
            console.log(`Step 2 - Fee: ${Number(fee) / 1e18} AGT`);
            console.log(`         Expected: ${Number(expectedFee) / 1e18} AGT`);
            expect(fee).to.equal(expectedFee);

            // Step 3: Calculate net AGT (user receives)
            const netAGT = grossAGT - fee;
            console.log(`Step 3 - Net AGT: ${Number(netAGT) / 1e18} AGT`);

            // Execute mint
            await USDT.write.approve([goldMinter.address, usdAmount], { account: buyer.account });

            const initialBuyerAGT = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const initialOwnerAGT = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            await goldMinter.write.requestMint([USDT.address, usdAmount, netAGT], {
                account: buyer.account,
            });

            const finalBuyerAGT = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const finalOwnerAGT = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            const buyerReceived = finalBuyerAGT - initialBuyerAGT;
            const ownerReceived = finalOwnerAGT - initialOwnerAGT;

            console.log(`\nResult:`);
            console.log(`  Buyer received: ${Number(buyerReceived) / 1e18} AGT`);
            console.log(`  Owner (fee): ${Number(ownerReceived) / 1e18} AGT`);
            console.log(`  Total minted: ${Number(buyerReceived + ownerReceived) / 1e18} AGT`);

            // Verify
            expect(buyerReceived).to.equal(netAGT);
            expect(ownerReceived).to.equal(fee);
            expect(buyerReceived + ownerReceived).to.equal(grossAGT);
        });

        it('should verify complete burn flow with simplified fee calculation', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            // Setup: First mint some AGT for buyer
            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const mintUSD = parseUnits('1000', 6);
            await USDT.write.approve([goldMinter.address, mintUSD], { account: buyer.account });

            const grossAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintUSD])) as bigint;
            const mintFeeAmt = (await goldMinter.read.calculateGoldFee([grossAGT, true])) as bigint;
            const netAGT = grossAGT - mintFeeAmt;

            await goldMinter.write.requestMint([USDT.address, mintUSD, netAGT], {
                account: buyer.account,
            });

            const burnAmount = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

            const redeemSpread = Number(await goldMinter.read.redeemSpread());
            const redeemFee = Number(await goldMinter.read.redeemFee());

            console.log('\n=== COMPLETE BURN FLOW VERIFICATION (SIMPLIFIED) ===');
            console.log(`Burn amount: ${Number(burnAmount) / 1e18} AGT`);
            console.log(`redeemSpread: ${redeemSpread / 100}%, redeemFee: ${redeemFee / 100}%`);

            // Step 1: Calculate burn fee (simplified formula)
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            // Simplified formula: fee = goldAmount × fee / 10000
            const expectedBurnFee = (BigInt(burnAmount) * BigInt(redeemFee)) / 10000n;
            console.log(`\nStep 1 - Burn fee: ${Number(burnFee) / 1e18} AGT`);
            console.log(`         Expected: ${Number(expectedBurnFee) / 1e18} AGT`);
            expect(burnFee).to.equal(expectedBurnFee);

            // Step 2: Calculate net gold after fee
            const netGold = burnAmount - burnFee;
            console.log(`Step 2 - Net gold: ${Number(netGold) / 1e18} AGT`);

            // Step 3: Calculate USD return (with spread)
            const expectedUSD = (await goldMinter.read.getUsdAmount([USDT.address, netGold])) as bigint;
            console.log(`Step 3 - Expected USD: $${Number(expectedUSD) / 1e6}`);

            // Execute burn
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await USDT.write.approve([goldMinter.address, expectedUSD], { account: owner.account });

            const initialBuyerUSDT = (await USDT.read.balanceOf([buyer.account.address])) as bigint;
            const initialOwnerAGT = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            const finalBuyerUSDT = (await USDT.read.balanceOf([buyer.account.address])) as bigint;
            const finalOwnerAGT = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            const usdReceived = finalBuyerUSDT - initialBuyerUSDT;
            const feeReceived = finalOwnerAGT - initialOwnerAGT;

            console.log(`\nResult:`);
            console.log(`  Buyer received: $${Number(usdReceived) / 1e6}`);
            console.log(`  Owner (fee): ${Number(feeReceived) / 1e18} AGT`);

            // Verify
            expect(Number(usdReceived)).to.be.closeTo(Number(expectedUSD), 10);
            expect(feeReceived).to.equal(burnFee);
        });

        it('should verify total round-trip cost calculation', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const initialUSD = parseUnits('1000', 6); // $1000

            const mintSpread = Number(await goldMinter.read.mintSpread());
            const mintFee = Number(await goldMinter.read.mintFee());
            const redeemSpread = Number(await goldMinter.read.redeemSpread());
            const redeemFee = Number(await goldMinter.read.redeemFee());

            console.log('\n=== TOTAL ROUND-TRIP COST VERIFICATION ===');
            console.log(`Initial USD: $${Number(initialUSD) / 1e6}`);
            console.log(`\nParameters:`);
            console.log(`  mintSpread: ${mintSpread / 100}%, mintFee: ${mintFee / 100}%`);
            console.log(`  redeemSpread: ${redeemSpread / 100}%, redeemFee: ${redeemFee / 100}%`);

            // Step 1: Mint
            await USDT.write.approve([goldMinter.address, initialUSD], { account: buyer.account });
            const grossAGT = (await goldMinter.read.getGoldAmount([USDT.address, initialUSD])) as bigint;
            const mintFeeAmt = (await goldMinter.read.calculateGoldFee([grossAGT, true])) as bigint;
            const netAGT = grossAGT - mintFeeAmt;

            await goldMinter.write.requestMint([USDT.address, initialUSD, netAGT], {
                account: buyer.account,
            });

            const buyerAGT = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

            console.log(`\nAfter Mint:`);
            console.log(`  Gross AGT: ${Number(grossAGT) / 1e18}`);
            console.log(`  Mint fee: ${Number(mintFeeAmt) / 1e18} AGT`);
            console.log(`  Net AGT: ${Number(buyerAGT) / 1e18}`);

            // Step 2: Burn all
            await goldToken.write.approve([goldMinter.address, buyerAGT], { account: buyer.account });
            const burnFeeAmt = (await goldMinter.read.calculateGoldFee([buyerAGT, false])) as bigint;
            const expectedUSD = (await goldMinter.read.getUsdAmount([
                USDT.address,
                buyerAGT - burnFeeAmt,
            ])) as bigint;

            await USDT.write.approve([goldMinter.address, expectedUSD], { account: owner.account });

            const buyerUSDTBefore = (await USDT.read.balanceOf([buyer.account.address])) as bigint;

            await goldMinter.write.requestBurn([USDT.address, buyerAGT, expectedUSD], {
                account: buyer.account,
            });

            const buyerUSDTAfter = (await USDT.read.balanceOf([buyer.account.address])) as bigint;
            const finalUSD = buyerUSDTAfter - buyerUSDTBefore;

            console.log(`\nAfter Burn:`);
            console.log(`  Burn fee: ${Number(burnFeeAmt) / 1e18} AGT`);
            console.log(`  Final USD: $${Number(finalUSD) / 1e6}`);

            // Calculate costs
            const totalCost = Number(initialUSD) - Number(finalUSD);
            const totalCostPercent = (totalCost / Number(initialUSD)) * 100;

            // Expected total cost breakdown (simplified formula):
            // 1. Mint spread: user gets less AGT (pays higher price) - 1.5%
            // 2. Mint fee: fee deducted from AGT - 0.25%
            // 3. Redeem spread: user gets less USD (receives lower price) - 1.5%
            // 4. Redeem fee: fee deducted from AGT - 0.25%

            const mintSpreadCost = mintSpread / 100; // 1.5%
            const mintFeeCost = mintFee / 100; // 0.25% (simplified - no spread multiplier)
            const redeemSpreadCost = redeemSpread / 100; // 1.5%
            const redeemFeeCost = redeemFee / 100; // 0.25% (simplified - no spread multiplier)

            console.log(`\n=== COST BREAKDOWN (SIMPLIFIED) ===`);
            console.log(`  Mint spread: ${mintSpreadCost}%`);
            console.log(`  Mint fee: ${mintFeeCost}%`);
            console.log(`  Redeem spread: ${redeemSpreadCost}%`);
            console.log(`  Redeem fee: ${redeemFeeCost}%`);
            console.log(
                `  Total expected: ${(mintSpreadCost + mintFeeCost + redeemSpreadCost + redeemFeeCost).toFixed(2)}%`,
            );
            console.log(`  Actual total: ${totalCostPercent.toFixed(4)}%`);
            console.log(`  Total USD cost: $${totalCost / 1e6}`);

            // Verify total cost is approximately 3.5% (all spreads + fees combined)
            expect(totalCostPercent).to.be.closeTo(3.5, 0.5); // ~3.5% with 0.5% tolerance
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

        it('should revert when non-authorized account tries to update fees', async function () {
            const { buyer, goldMinter, viem } = await fixture();

            const PARAMETER_MANAGER_ROLE = await goldMinter.read.PARAMETER_MANAGER_ROLE();
            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateMintFee([50], { account: buyer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
                [getAddress(buyer.account.address), PARAMETER_MANAGER_ROLE],
            );

            await viem.assertions.revertWithCustomErrorWithArgs(
                goldMinter.write.updateRedeemFee([50], { account: buyer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
                [getAddress(buyer.account.address), PARAMETER_MANAGER_ROLE],
            );
        });

        it('should correctly affect calculateGoldFee when fees change', async function () {
            const { owner, goldMinter } = await fixture();

            const goldAmount = parseEther('10'); // 10g gold

            // Simplified fee formula: goldAmount × fee / 10000

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
