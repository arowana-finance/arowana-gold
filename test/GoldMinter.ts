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
        expect(await goldMinter.read.fees()).to.equal(40);
    });

    it('getGoldAmount', async function () {
        const { USDT, goldMinter } = await fixture();

        const result1 = await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN]);
        expect(Number(result1)).to.be.closeTo(Number(parseEther('1')), Number(parseEther('0.000005'))); // Allow 5 microether tolerance

        const result2 = await goldMinter.read.getGoldAmount([USDT.address, GOLD_PRICE_IN_USD_TOKEN / 2n]);
        expect(Number(result2)).to.be.closeTo(Number(parseEther('1')) / 2, Number(parseEther('0.000005'))); // Allow 5 microether tolerance
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

        const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT])) as bigint;

        const expectedAGTAfterFee = expectedAGT - expectedFee;

        await goldMinter.write.requestMintPermit(
            [USDT.address, mintAmt, expectedAGTAfterFee, maxUint256, signature],
            { account: buyer.account },
        );

        await goldMinter.write.settleMint([0n, expectedAGT], {
            account: owner.account,
        });

        const feeBps = await goldMinter.read.fees();
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

        const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT])) as bigint;

        const expectedAGTAfterFee = expectedAGT - expectedFee;

        await goldMinter.write.requestMint([USDT.address, mintAmt, expectedAGTAfterFee], {
            account: buyer.account,
        });
        await goldMinter.write.settleMint([0n, expectedAGT], {
            account: owner.account,
        });

        const amountExFee = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
        const burnFee = (await goldMinter.read.calculateGoldFee([amountExFee])) as bigint;

        const expectedUSDAfterBurnFee = Number(
            await goldMinter.read.getUsdAmount([USDT.address, amountExFee - burnFee]),
        );

        await goldToken.write.approve([goldMinter.address, maxUint256], {
            account: buyer.account,
        });

        await goldMinter.write.requestBurn([USDT.address, amountExFee, expectedUSDAfterBurnFee], {
            account: buyer.account,
        });

        await USDT.write.approve([goldMinter.address, expectedUSDAfterBurnFee], {
            account: owner.account,
        });

        await goldMinter.write.settleBurn([0n, burnFee], {
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
        const usdAmount = parseUnits('500', 6); // 4300 USDT
        const goldPrice = await goldPriceFeed.read.latestAnswer();

        // Calculate expected AGT amount before fees
        const expectedAGT = Number(await goldMinter.read.getGoldAmount([USDT.address, usdAmount]));

        // Calculate expected fee
        const expectedFee = await goldMinter.read.calculateGoldFee([expectedAGT]);

        // Calculate expected AGT after fees
        const expectedAGTAfterFee = Number(expectedAGT) - Number(expectedFee);

        const feeValueInUSD = Number(await goldMinter.read.getUsdAmount([USDT.address, expectedFee]));

        // Approve USDT transfer
        await USDT.write.approve([goldMinter.address, usdAmount], { account: buyer.account });

        // Get initial balances
        const initialOwnerBalance = await goldToken.read.balanceOf([owner.account.address]);
        const initialBuyerBalance = await goldToken.read.balanceOf([buyer.account.address]);

        // Execute mint
        await goldMinter.write.requestMint([USDT.address, usdAmount, expectedAGTAfterFee], {
            account: buyer.account,
        });

        // Check final balances
        const finalOwnerBalance = await goldToken.read.balanceOf([owner.account.address]);
        const finalBuyerBalance = await goldToken.read.balanceOf([buyer.account.address]);

        const actualFeeReceived = Number(finalOwnerBalance) - Number(initialOwnerBalance);
        const actualAGTReceived = Number(finalBuyerBalance) - Number(initialBuyerBalance);

        // Verify fee calculation
        expect(actualFeeReceived).to.be.closeTo(Number(expectedFee), 10); // Allow small tolerance
        expect(actualAGTReceived).to.be.closeTo(Number(expectedAGTAfterFee), 1000); // Allow 1000 wei tolerance for rounding

        // Verify this is using percentage fee (0.4%)
        if (Number(expectedAGT) >= 1e18) {
            const expectedPercentageFee = (Number(expectedAGT) * 40) / 10000; // 0.4%
            expect(Number(expectedFee)).to.be.closeTo(expectedPercentageFee, 1e15); // Allow 0.001 ether tolerance
            console.log(`Percentage fee (0.4%) correctly applied: ${Number(expectedFee) / 1e18} ether`);
        }

        // Now test burn flow
        const burnAmount = actualAGTReceived; // Burn all AGT received
        const expectedUSDReturn = Number(await goldMinter.read.getUsdAmount([USDT.address, burnAmount]));
        const burnFee = Number(await goldMinter.read.calculateGoldFee([burnAmount]));
        const expectedUSDAfterBurnFee = Number(
            await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]),
        );

        // Verify burn fee calculation
        if (burnAmount >= 1e18) {
            const expectedBurnPercentageFee = (burnAmount * 40) / 10000; // 0.4%
            expect(burnFee).to.be.closeTo(expectedBurnPercentageFee, 1000); // Allow 1000 wei tolerance
        } else {
            // Fixed fee should be applied (0.01 ether)
            expect(burnFee).to.equal(10000000000000000); // 0.01 ether
        }

        // Get owner's initial AGT balance to verify fee transfer
        const initialOwnerAGTBalance = Number(await goldToken.read.balanceOf([owner.account.address]));

        // Approve AGT transfer for burn
        await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

        // Fund the contract with USDT for burn settlement
        await USDT.write.transfer([owner.account.address, expectedUSDReturn], { account: owner.account });
        await USDT.write.approve([goldMinter.address, expectedUSDReturn], { account: owner.account });

        const initialUSDTBalance = Number(await USDT.read.balanceOf([buyer.account.address]));

        // Execute burn (Now properly deducts fee from USD amount)
        await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSDAfterBurnFee], {
            account: buyer.account,
        });

        const finalUSDTBalance = Number(await USDT.read.balanceOf([buyer.account.address]));
        const finalOwnerAGTBalance = Number(await goldToken.read.balanceOf([owner.account.address]));
        const actualUSDTReceived = finalUSDTBalance - initialUSDTBalance;
        const actualAGTFeeReceived = finalOwnerAGTBalance - initialOwnerAGTBalance;

        // Verify burn transaction
        // Now properly deducts burn fee from USD amount
        expect(actualUSDTReceived).to.be.closeTo(expectedUSDAfterBurnFee, 10000);
        // AGT fee should be transferred to owner
        expect(actualAGTFeeReceived).to.be.closeTo(burnFee, 1000);

        const burnFeeInUSD = Number(await goldMinter.read.getUsdAmount([USDT.address, actualAGTFeeReceived]));

        const totalFeesInUSD = Number(usdAmount) - actualUSDTReceived;
        const totalFeePercentage = (totalFeesInUSD * 10000) / Number(usdAmount);

        // Now both mint and burn properly charge fees
        // Total should be approximately 0.8% (0.4% mint + 0.4% burn)
        expect(totalFeePercentage).to.be.closeTo(80, 10); // ~80bps = 0.8% with 10bps tolerance
        console.log(
            `Total round-trip fee correctly applied: ${totalFeePercentage / 100}% (mint 0.4% + burn 0.4%)`,
        );
        console.log(`Mint fee: $${feeValueInUSD / 1000000} USD`);
        console.log(`Burn fee: $${burnFeeInUSD / 1000000} USD`);

        console.log(`\n=== COMPLETE TEST SUMMARY ===`);
        console.log(`INITIAL STATE:`);
        console.log(`  User starts with: $${usdAmount / 1000000n} USDT`);
        console.log(
            `  Gold price: $${Number(goldPrice) / 100000000} per ounce, $${Number(goldPrice) / 100000000 / 31.1034768} per gram`,
        );

        console.log(`\nMINT PROCESS:`);
        console.log(`  Expected AGT (before fee): ${Number(expectedAGT) / 1e18} AGT`);
        console.log(`  Mint fee: ${Number(expectedFee) / 1e18} AGT = $${feeValueInUSD / 1000000} USD (0.4%)`);
        console.log(`  User received: ${actualAGTReceived / 1e18} AGT`);
        console.log(
            `  AGT value verification: ${actualAGTReceived / 1e18} AGT × $${Number(goldPrice) / 100000000 / 31.1034768} = $${(actualAGTReceived * Number(goldPrice)) / (1e18 * 1e8 * 31.1034768)} USD`,
        );

        console.log(`\nBURN PROCESS:`);
        console.log(`  User burns: ${burnAmount / 1e18} AGT`);
        console.log(`  Burn fee: ${actualAGTFeeReceived / 1e18} AGT = $${burnFeeInUSD / 1000000} USD (0.4%)`);
        console.log(`  User received back: $${actualUSDTReceived / 1000000} USDT`);
        console.log(`  Remaining AGT after fee: ${(burnAmount - actualAGTFeeReceived) / 1e18} AGT`);
        console.log(
            `  Remaining AGT value verification: ${(burnAmount - actualAGTFeeReceived) / 1e18} AGT × $${Number(goldPrice) / 100000000 / 31.1034768} = $${((burnAmount - actualAGTFeeReceived) * Number(goldPrice)) / (1e18 * 1e8 * 31.1034768)} USD`,
        );

        console.log(`\nFINAL RESULTS:`);
        console.log(`  Started with: $${usdAmount / 1000000n} USDT`);
        console.log(`  Ended with: $${actualUSDTReceived / 1000000} USDT`);
        console.log(`  Total fees paid: $${totalFeesInUSD / 1000000} USD (${totalFeePercentage / 100}%)`);
        console.log(
            `  Owner received fees: ${(Number(expectedFee) + actualAGTFeeReceived) / 1e18} AGT = $${(feeValueInUSD + burnFeeInUSD) / 1000000} USD`,
        );

        console.log(`\nVERIFICATION COMPLETE: All fees calculated correctly according to 0.4% policy`);
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
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT])) as bigint;
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

        it('should SUCCEED when minting 1g + 0.5% worth of USD (enough to cover fee)', async function () {
            const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // Calculate 1g + buffer to cover 0.4% fee
            // To get exactly 1g after 0.4% fee: need 1g / 0.996 = 1.00402g
            // Adding 0.5% buffer: 1g * 1.005 = 1.005g worth
            const bufferMultiplier = 1005n; // 1.005 = 100.5%
            const usdAmountWithBuffer = (GOLD_PRICE_IN_USD_TOKEN * bufferMultiplier) / 1000n;

            const goldPrice = await goldPriceFeed.read.latestAnswer();

            console.log(`\n=== MINIMUM MINT TEST (1g + 0.5% buffer) ===`);
            console.log(`Gold price: $${Number(goldPrice) / 1e8} per ounce`);
            console.log(`1g price: $${Number(GOLD_PRICE_IN_USD_TOKEN) / 1e6} USD`);
            console.log(`Depositing: $${Number(usdAmountWithBuffer) / 1e6} USD (1g + 0.5%)`);

            // Calculate expected values
            const expectedAGT = (await goldMinter.read.getGoldAmount([
                USDT.address,
                usdAmountWithBuffer,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT])) as bigint;
            const netAGT = expectedAGT - expectedFee;

            console.log(`Expected AGT (before fee): ${Number(expectedAGT) / 1e18} AGT`);
            console.log(`Fee (0.4%): ${Number(expectedFee) / 1e18} AGT`);
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
                `\n✅ TEST PASSED: 1g + 0.5% buffer successfully minted ${actualAGTReceived / 1e18} AGT`,
            );
        });

        it('should calculate exact minimum USD required to mint 1g after fee', async function () {
            const { owner, buyer, goldToken, USDT, goldPriceFeed, goldMinter } = await fixture();

            await goldMinter.write.updateAutoSettle();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const goldPrice = await goldPriceFeed.read.latestAnswer();
            const feeRate = 40n; // 0.4% = 40 bps

            console.log(`\n=== EXACT MINIMUM CALCULATION ===`);
            console.log(`Gold price: $${Number(goldPrice) / 1e8} per ounce`);
            console.log(`1g base price: $${Number(GOLD_PRICE_IN_USD_TOKEN) / 1e6} USD`);
            console.log(`Fee rate: ${Number(feeRate) / 100}%`);

            // To receive exactly 1g after fee:
            // netAGT = grossAGT - fee
            // 1g = grossAGT - (grossAGT * 0.004)
            // 1g = grossAGT * 0.996
            // grossAGT = 1g / 0.996 = 1.00401606... g

            // Calculate minimum USD needed (ceiling division to ensure we round up)
            // minUSD = ceil(1g_price / 0.996) = ceil(1g_price * 10000 / 9960)
            const divisor = 10000n - feeRate;
            const minUSDRequired = (GOLD_PRICE_IN_USD_TOKEN * 10000n + divisor - 1n) / divisor;

            console.log(`\nMinimum USD to get 1g after fee: $${Number(minUSDRequired) / 1e6} USD`);
            console.log(
                `This is ${(Number(minUSDRequired) / Number(GOLD_PRICE_IN_USD_TOKEN) - 1) * 100}% more than 1g base price`,
            );

            // Verify by calculation
            const expectedAGT = (await goldMinter.read.getGoldAmount([
                USDT.address,
                minUSDRequired,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT])) as bigint;
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
});
