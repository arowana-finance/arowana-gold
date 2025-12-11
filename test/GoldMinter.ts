import { expect } from 'chai';

import { parseUnits, parseEther, maxUint256, getAddress, encodeFunctionData, zeroAddress } from 'viem';
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

        const goldToken = await viem.deployContract('GoldToken');
        await goldToken.write.initializeGoldToken([owner.account.address, zeroAddress], {
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
            [USDT.address, GOLD_PRICE_IN_USD_TOKEN * 2n, parseEther(String(goldSellAmt))],
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
});
