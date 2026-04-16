/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import {
    parseUnits,
    parseEther,
    maxUint256,
    getAddress,
    encodeFunctionData,
    zeroAddress,
    Address,
} from 'viem';
import { getClients, signPermitERC2612, signKYCMintRequest, signKYCBurnRequest } from './helpers.js';

// Tests targeting previously uncovered branches to raise coverage above the
// production threshold. Organized by uncovered area.

const GOLD_PRICE = parseUnits('4096.342', 8);
const GRAMS_PER_OUNCE = parseUnits('31.1034768', 8);
const GOLD_PRICE_IN_USD_TOKEN = (GOLD_PRICE * parseUnits('1', 8)) / GRAMS_PER_OUNCE / 100n;

describe('Coverage Boost', function () {
    const fixture = async () => {
        const { owner, buyer, bob, viem } = await getClients();

        const blacklistOracleImpl = await viem.deployContract('BlacklistOracle', []);
        const blacklistOracleProxy = await viem.deployContract('InitializableProxy', []);
        const boInit = encodeFunctionData({
            abi: blacklistOracleImpl.abi,
            functionName: 'initializeOracle',
            args: ['Blacklist Oracle', owner.account.address],
        });
        await blacklistOracleProxy.write.initializeProxy(
            ['Blacklist Oracle', owner.account!.address, blacklistOracleImpl.address, boInit],
            { account: owner.account },
        );
        const blacklistOracle = await viem.getContractAt('BlacklistOracle', blacklistOracleProxy.address);

        const goldTokenImpl = await viem.deployContract('GoldToken', []);
        const goldTokenProxy = await viem.deployContract('InitializableProxy', []);
        const gtInit = encodeFunctionData({
            abi: goldTokenImpl.abi,
            functionName: 'initializeGoldToken',
            args: [owner.account!.address, blacklistOracle.address],
        });
        await goldTokenProxy.write.initializeProxy(
            ['Ontorium Gold Token', owner.account!.address, goldTokenImpl.address, gtInit],
            { account: owner.account },
        );
        const goldToken = await viem.getContractAt('GoldToken', goldTokenProxy.address);

        const USDT = await viem.deployContract('ERC20Mock', [
            'Tether USD',
            'USDT',
            6,
            parseUnits('100000', 6),
        ]);
        const USDC = await viem.deployContract('ERC20Mock', ['USD Coin', 'USDC', 6, parseUnits('100000', 6)]);
        await USDT.write.transfer([buyer.account.address, parseUnits('10000', 6)], {
            account: owner.account,
        });
        await USDC.write.transfer([buyer.account.address, parseUnits('10000', 6)], {
            account: owner.account,
        });

        const priceFeedImpl = await viem.deployContract('DataFeed');
        const priceFeedProxy = await viem.deployContract('InitializableProxy', []);
        const pfInit = encodeFunctionData({
            abi: priceFeedImpl.abi,
            functionName: 'initializeFeed',
            args: [owner.account.address, goldToken.address, `${await goldToken.read.symbol()} / USD`],
        });
        await priceFeedProxy.write.initializeProxy(
            ['DataFeed', owner.account.address, priceFeedImpl.address, pfInit],
            { account: owner.account },
        );
        const goldPriceFeed = await viem.getContractAt('DataFeed', priceFeedProxy.address);
        await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });

        const goldMinterImpl = await viem.deployContract('GoldMinter');
        const goldMinterProxy = await viem.deployContract('InitializableProxy', []);
        const gmInit = encodeFunctionData({
            abi: goldMinterImpl.abi,
            functionName: 'initializeGoldMinter',
            args: [
                goldToken.address,
                USDT.address,
                USDC.address,
                goldPriceFeed.address,
                owner.account.address,
                owner.account.address,
                owner.account.address,
                true,
            ],
        });
        await goldMinterProxy.write.initializeProxy(
            ['GoldMinter', owner.account.address, goldMinterImpl.address, gmInit],
            { account: owner.account },
        );
        const goldMinter = await viem.getContractAt('GoldMinter', goldMinterProxy.address);

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

        await goldToken.write.addMinter([goldMinter.address], { account: owner.account });

        // Revert unit defaults to gram basis for gram-sized test assertions
        await goldMinter.write.updateMinMintAmount([parseEther('1')], { account: owner.account });
        await goldMinter.write.updateMinRedeemAmount([parseEther('1')], { account: owner.account });
        await goldMinter.write.updateMinGoldFee([parseEther('0.01')], { account: owner.account });
        await goldMinter.write.updateMinGoldFeeAmount([parseEther('1')], { account: owner.account });

        return { owner, buyer, bob, viem, goldMinter, goldToken, USDT, USDC, goldPriceFeed };
    };

    describe('Admin Function Edge Cases', function () {
        it('updateMaxPriceAge reverts when age below 5 minutes', async function () {
            const { owner, goldMinter, viem } = await fixture();
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateMaxPriceAge([4n * 60n], { account: owner.account }),
                goldMinter,
                'InvalidPriceAge',
            );
        });

        it('updateMaxPriceAge reverts when age above 30 minutes', async function () {
            const { owner, goldMinter, viem } = await fixture();
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateMaxPriceAge([31n * 60n], { account: owner.account }),
                goldMinter,
                'InvalidPriceAge',
            );
        });

        it('updateMaxPriceAge succeeds within valid range', async function () {
            const { owner, goldMinter } = await fixture();
            // No public getter; just confirm non-revert
            await goldMinter.write.updateMaxPriceAge([15n * 60n], { account: owner.account });
        });

        it('updateTradingLevel updates tradeLevel', async function () {
            const { owner, goldMinter } = await fixture();
            // Levels enum: NONE=0, KYCD=1, KYCD_PRO=2, KYCD_ACCREDITED=3
            await goldMinter.write.updateTradingLevel([2], { account: owner.account });
            expect(await goldMinter.read.tradeLevel()).to.equal(2);
        });

        it('updateRecipient reverts on zero address', async function () {
            const { owner, goldMinter, viem } = await fixture();
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateRecipient([zeroAddress], { account: owner.account }),
                goldMinter,
                'ZeroUSDRecipient',
            );
        });

        it('updateRecipient succeeds with valid address', async function () {
            const { owner, buyer, goldMinter } = await fixture();
            // No public getter; just confirm non-revert
            await goldMinter.write.updateRecipient([buyer.account.address], {
                account: owner.account,
            });
        });

        it('updateFeeRecipient reverts on zero address', async function () {
            const { owner, goldMinter, viem } = await fixture();
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateFeeRecipient([zeroAddress], { account: owner.account }),
                goldMinter,
                'ZeroRecipient',
            );
        });

        it('updateFeeRecipient succeeds with valid address', async function () {
            const { owner, buyer, goldMinter } = await fixture();
            await goldMinter.write.updateFeeRecipient([buyer.account.address], {
                account: owner.account,
            });
            expect(getAddress((await goldMinter.read.feeRecipient()) as Address)).to.equal(
                getAddress(buyer.account.address),
            );
        });
    });

    describe('View Functions', function () {
        it('tradeLevel() returns current trading level', async function () {
            const { goldMinter } = await fixture();
            const level = await goldMinter.read.tradeLevel();
            // Default is KYCD = 1
            expect(level).to.equal(1);
        });

        it('kycNonces() returns per-user nonce', async function () {
            const { buyer, goldMinter } = await fixture();
            const nonce = await goldMinter.read.kycNonces([buyer.account.address]);
            expect(nonce).to.equal(0n);
        });

        it('levels() returns per-user level', async function () {
            const { owner, buyer, goldMinter } = await fixture();
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });
            expect(await goldMinter.read.levels([buyer.account.address])).to.equal(2);
        });
    });

    describe('requestMintWithKYC', function () {
        it('executes mint with valid KYC signature', async function () {
            const { owner, buyer, goldMinter, goldToken, USDT } = await fixture();
            const usdAmount = GOLD_PRICE_IN_USD_TOKEN * 2n;

            // Compute slippage-safe minGoldAmount
            const expectedGold = (await goldMinter.read.getGoldAmount([USDT.address, usdAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;
            const minGoldAmount = expectedGold - expectedFee;

            const deadline = maxUint256;
            const kycLevel = 2;
            const nonce = 1n;

            const kycSignature = await signKYCMintRequest({
                goldMinter,
                signer: owner,
                user: buyer.account.address,
                kycLevel,
                nonce,
                deadline,
                usdToken: USDT.address,
                usdAmount,
                minGoldAmount,
            });

            const permitSignature = await signPermitERC2612({
                token: USDT,
                owner: buyer,
                spender: goldMinter.address,
                value: usdAmount,
                deadline,
            });

            const request = {
                user: buyer.account.address,
                kycLevel,
                nonce,
                deadline,
                usdToken: USDT.address,
                usdAmount,
                minGoldAmount,
            };

            await goldMinter.write.requestMintWithKYC([request, kycSignature, permitSignature], {
                account: buyer.account,
            });

            expect(Number(await goldMinter.read.levels([buyer.account.address]))).to.equal(kycLevel);
            expect(await goldMinter.read.kycNonces([buyer.account.address])).to.equal(nonce);
            // autoSettle=true in fixture, so user should have OXAU after call
            const bal = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(bal > 0n).to.equal(true);
        });

        it('reverts when msg.sender != kycRequest.user', async function () {
            const { owner, buyer, bob, goldMinter, USDT, viem } = await fixture();
            const usdAmount = GOLD_PRICE_IN_USD_TOKEN * 2n;
            const deadline = maxUint256;

            const kycSignature = await signKYCMintRequest({
                goldMinter,
                signer: owner,
                user: buyer.account.address,
                kycLevel: 2,
                nonce: 1n,
                deadline,
                usdToken: USDT.address,
                usdAmount,
                minGoldAmount: 0n,
            });

            const request = {
                user: buyer.account.address,
                kycLevel: 2,
                nonce: 1n,
                deadline,
                usdToken: USDT.address,
                usdAmount,
                minGoldAmount: 0n,
            };

            // bob tries to submit buyer's request
            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMintWithKYC([request, kycSignature, '0x'], {
                    account: bob.account,
                }),
                goldMinter,
                'InvalidSignature',
            );
        });

        it('reverts with empty KYC signature', async function () {
            const { buyer, goldMinter, USDT, viem } = await fixture();
            const usdAmount = GOLD_PRICE_IN_USD_TOKEN * 2n;

            const request = {
                user: buyer.account.address,
                kycLevel: 2,
                nonce: 1n,
                deadline: maxUint256,
                usdToken: USDT.address,
                usdAmount,
                minGoldAmount: 0n,
            };

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMintWithKYC([request, '0x', '0x'], {
                    account: buyer.account,
                }),
                goldMinter,
                'ZeroSignature',
            );
        });
    });

    describe('requestBurnWithKYC', function () {
        it('executes burn with valid KYC signature', async function () {
            const { owner, buyer, goldMinter, goldToken, USDT } = await fixture();

            // Mint gold first via KYC path so kycNonces increments via _processKYC, not setLevel
            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });
            // setLevel above already incremented nonce → next valid nonce is 2

            const mintUSD = GOLD_PRICE_IN_USD_TOKEN * 3n;
            const expectedMintGold = (await goldMinter.read.getGoldAmount([USDT.address, mintUSD])) as bigint;
            const expectedMintFee = (await goldMinter.read.calculateGoldFee([
                expectedMintGold,
                true,
            ])) as bigint;
            const mintMin = expectedMintGold - expectedMintFee;

            await USDT.write.approve([goldMinter.address, mintUSD], { account: buyer.account });
            await goldMinter.write.requestMint([USDT.address, mintUSD, mintMin], {
                account: buyer.account,
            });

            const buyerBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(buyerBalance > 0n).to.equal(true);

            const burnAmount = buyerBalance;
            // Compute slippage-safe minUsdAmount
            const expectedUsd = (await goldMinter.read.getUsdAmount([USDT.address, burnAmount])) as bigint;
            const expectedBurnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            // Net USD after fee deducted from gold
            const netGoldForRedeem = burnAmount - expectedBurnFee;
            const expectedNetUsd = (await goldMinter.read.getUsdAmount([
                USDT.address,
                netGoldForRedeem,
            ])) as bigint;
            void expectedUsd;
            const minUsdAmount = expectedNetUsd;

            const deadline = maxUint256;
            const kycLevel = 2;
            // setLevel called above incremented kycNonces[buyer] to 1; next valid nonce is 2
            const nonce = 2n;

            const kycSignature = await signKYCBurnRequest({
                goldMinter,
                signer: owner,
                user: buyer.account.address,
                kycLevel,
                nonce,
                deadline,
                usdToken: USDT.address,
                goldAmount: burnAmount,
                minUsdAmount,
            });

            const goldPermit = await signPermitERC2612({
                token: goldToken,
                owner: buyer,
                spender: goldMinter.address,
                value: burnAmount,
                deadline,
            });

            const request = {
                user: buyer.account.address,
                kycLevel,
                nonce,
                deadline,
                usdToken: USDT.address,
                goldAmount: burnAmount,
                minUsdAmount,
            };

            await goldMinter.write.requestBurnWithKYC([request, kycSignature, goldPermit], {
                account: buyer.account,
            });

            expect(await goldMinter.read.kycNonces([buyer.account.address])).to.equal(nonce);
        });

        it('reverts when msg.sender != kycRequest.user', async function () {
            const { owner, buyer, bob, goldMinter, USDT, viem } = await fixture();

            const kycSignature = await signKYCBurnRequest({
                goldMinter,
                signer: owner,
                user: buyer.account.address,
                kycLevel: 2,
                nonce: 1n,
                deadline: maxUint256,
                usdToken: USDT.address,
                goldAmount: parseEther('1'),
                minUsdAmount: 0n,
            });

            const request = {
                user: buyer.account.address,
                kycLevel: 2,
                nonce: 1n,
                deadline: maxUint256,
                usdToken: USDT.address,
                goldAmount: parseEther('1'),
                minUsdAmount: 0n,
            };

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurnWithKYC([request, kycSignature, '0x'], {
                    account: bob.account,
                }),
                goldMinter,
                'InvalidSignature',
            );
        });

        it('reverts with empty KYC signature', async function () {
            const { buyer, goldMinter, USDT, viem } = await fixture();

            const request = {
                user: buyer.account.address,
                kycLevel: 2,
                nonce: 1n,
                deadline: maxUint256,
                usdToken: USDT.address,
                goldAmount: parseEther('1'),
                minUsdAmount: 0n,
            };

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurnWithKYC([request, '0x', '0x'], {
                    account: buyer.account,
                }),
                goldMinter,
                'ZeroSignature',
            );
        });
    });

    describe('requestBurnPermit', function () {
        it('executes burn with permit signature', async function () {
            const { owner, buyer, goldMinter, goldToken, USDT } = await fixture();

            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            const mintUSD = GOLD_PRICE_IN_USD_TOKEN * 3n;
            const expectedMintGold = (await goldMinter.read.getGoldAmount([USDT.address, mintUSD])) as bigint;
            const expectedMintFee = (await goldMinter.read.calculateGoldFee([
                expectedMintGold,
                true,
            ])) as bigint;
            const mintMin = expectedMintGold - expectedMintFee;

            await USDT.write.approve([goldMinter.address, mintUSD], { account: buyer.account });
            await goldMinter.write.requestMint([USDT.address, mintUSD, mintMin], {
                account: buyer.account,
            });

            const buyerBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const burnAmount = buyerBalance;
            const deadline = maxUint256;

            // Compute slippage-safe minUsdAmount
            const expectedBurnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const netGoldForRedeem = burnAmount - expectedBurnFee;
            const minUsdAmount = (await goldMinter.read.getUsdAmount([
                USDT.address,
                netGoldForRedeem,
            ])) as bigint;

            const permitSig = await signPermitERC2612({
                token: goldToken,
                owner: buyer,
                spender: goldMinter.address,
                value: burnAmount,
                deadline,
            });

            await goldMinter.write.requestBurnPermit(
                [USDT.address, burnAmount, minUsdAmount, deadline, permitSig],
                { account: buyer.account },
            );

            // Balance after burn request should be less (goldToken transferred to contract/burned)
            const finalBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(finalBalance < buyerBalance).to.equal(true);
        });
    });

    // which guarantees (expectedOutput - feeAmount) >= minGoldAmount.
    // _settleMint then computes netGoldAmount = goldAmount - feeAmount
    // (where goldAmount == expectedOutput stored at request time),
    // so success = netGoldAmount >= minGoldAmount is always true.
    // Coverage gap left as known dead code; flag for contract simplification.

    describe('WithSettler functions (via PriceFeed)', function () {
        it('addSettler / removeSettler / settlers() / isSettler flow', async function () {
            const { owner, buyer, goldPriceFeed } = await fixture();

            // buyer is not a settler initially
            const initialSettlers = (await goldPriceFeed.read.settlers()) as `0x${string}`[];
            const initialHasBuyer = initialSettlers
                .map((a) => a.toLowerCase())
                .includes(buyer.account.address.toLowerCase());
            expect(initialHasBuyer).to.equal(false);

            // Add buyer as settler
            await goldPriceFeed.write.addSettler([buyer.account.address], { account: owner.account });

            const afterAddSettlers = (await goldPriceFeed.read.settlers()) as `0x${string}`[];
            const afterAddHasBuyer = afterAddSettlers
                .map((a) => a.toLowerCase())
                .includes(buyer.account.address.toLowerCase());
            expect(afterAddHasBuyer).to.equal(true);

            // Remove buyer
            await goldPriceFeed.write.removeSettler([buyer.account.address], {
                account: owner.account,
            });

            const afterRemoveSettlers = (await goldPriceFeed.read.settlers()) as `0x${string}`[];
            const afterRemoveHasBuyer = afterRemoveSettlers
                .map((a) => a.toLowerCase())
                .includes(buyer.account.address.toLowerCase());
            expect(afterRemoveHasBuyer).to.equal(false);
        });

        it('addSettler reverts when settler already exists', async function () {
            const { owner, goldPriceFeed } = await fixture();
            // owner is already a settler (added on init)
            let threw = false;
            try {
                await goldPriceFeed.write.addSettler([owner.account.address], {
                    account: owner.account,
                });
            } catch {
                threw = true;
            }
            expect(threw).to.equal(true);
        });

        it('removeSettler reverts when address is not a settler', async function () {
            const { owner, buyer, goldPriceFeed } = await fixture();
            let threw = false;
            try {
                await goldPriceFeed.write.removeSettler([buyer.account.address], {
                    account: owner.account,
                });
            } catch {
                threw = true;
            }
            expect(threw).to.equal(true);
        });

        it('addSettler reverts when called by non-owner', async function () {
            const { buyer, goldPriceFeed } = await fixture();
            let threw = false;
            try {
                await goldPriceFeed.write.addSettler([buyer.account.address], {
                    account: buyer.account,
                });
            } catch {
                threw = true;
            }
            expect(threw).to.equal(true);
        });
    });
});
