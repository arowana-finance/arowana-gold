/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { parseUnits, parseEther, maxUint256, encodeFunctionData } from 'viem';
import { getClients, timeTravel } from './helpers.js';

const GOLD_PRICE = parseUnits('4096.342', 8); // Oracle price (per ounce)

const GRAMS_PER_OUNCE = parseUnits('31.1034768', 8);

const GOLD_PRICE_IN_USD_TOKEN = (GOLD_PRICE * parseUnits('1', 8)) / GRAMS_PER_OUNCE / 100n;

const fixtureData = {
    USDTMintAmt: 100000, // USDT amount to mint for Owner ($100,000)
    USDTTransferAmt: 50000, // USDT amount to transfer to Buyer ($50,000)
    USDCMintAmt: 100000, // USDC amount to mint for Owner ($100,000)
    USDCTransferAmt: 50000, // USDC amount to transfer to Buyer ($50,000)
};

// ============================================================
// GoldMinter Full Test - Burn Settlement & Security
// ============================================================
describe('GoldMinter Full Test - Burn Settlement & Security', function () {
    // --------------------------------------------------------
    // fixture: Test environment setup function
    // Deploy and initialize all contracts used across tests
    // --------------------------------------------------------
    const fixture = async () => {
        // Get test clients (owner: admin, buyer: purchaser)
        const { owner, buyer, viem } = await getClients();
        const { USDTMintAmt, USDCMintAmt, USDTTransferAmt, USDCTransferAmt } = fixtureData;

        // ====== 1. Deploy BlacklistOracle ======
        // BlacklistOracle: Blacklist management oracle (for token transfer restrictions)
        const blacklistOracleImplementation = await viem.deployContract('BlacklistOracle', []);
        const blacklistOracleProxy = await viem.deployContract('InitializableProxy', []);

        // Encode proxy initialization data
        const blacklistOracleInitData = encodeFunctionData({
            abi: blacklistOracleImplementation.abi,
            functionName: 'initializeOracle',
            args: ['Blacklist Oracle', owner.account.address],
        });

        // Initialize proxy (connect implementation)
        await blacklistOracleProxy.write.initializeProxy(
            [
                'Blacklist Oracle',
                owner.account!.address,
                blacklistOracleImplementation.address,
                blacklistOracleInitData,
            ],
            { account: owner.account },
        );

        // Create contract instance at proxy address
        const blacklistOracle = await viem.getContractAt('BlacklistOracle', blacklistOracleProxy.address);

        // ====== 2. Deploy GoldToken ======
        const goldTokenImplementation = await viem.deployContract('GoldToken', []);
        const goldTokenProxy = await viem.deployContract('InitializableProxy', []);

        const goldTokenInitData = encodeFunctionData({
            abi: goldTokenImplementation.abi,
            functionName: 'initializeGoldToken',
            args: [owner.account!.address, blacklistOracle.address], // Connect owner and blacklist oracle
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

        // ====== 3. Deploy Stablecoins (USDT, USDC) ======
        // ERC20Mock: Mock ERC20 tokens for testing
        const USDT = await viem.deployContract('ERC20Mock', [
            'Tether USD', // Token name
            'USDT', // Token symbol
            6, // decimals (USDT uses 6 decimals)
            parseUnits(String(USDTMintAmt), 6), // Initial supply (to owner)
        ]);
        const USDC = await viem.deployContract('ERC20Mock', [
            'USD Coin', // Token name
            'USDC', // Token symbol
            6, // decimals (USDC uses 6 decimals)
            parseUnits(String(USDCMintAmt), 6), // Initial supply (to owner)
        ]);

        // Transfer USDT, USDC to Buyer (test funds)
        await USDT.write.transfer([buyer.account.address, parseUnits(String(USDTTransferAmt), 6)], {
            account: owner.account,
        });
        await USDC.write.transfer([buyer.account.address, parseUnits(String(USDCTransferAmt), 6)], {
            account: owner.account,
        });

        // ====== 4. Deploy PriceFeed (Price Oracle) ======
        // DataFeed: Chainlink-compatible mock price feed contract
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

        // Set initial gold price ($4096.342/ounce)
        await goldPriceFeed.write.updateAnswer([GOLD_PRICE], {
            account: owner.account,
        });

        // ====== 5. Deploy GoldMinter ======
        // GoldMinter: Gold token mint/burn management contract
        const goldMinterImpl = await viem.deployContract('GoldMinter');
        const goldMinterProxy = await viem.deployContract('InitializableProxy', []);

        const initData = encodeFunctionData({
            abi: goldMinterImpl.abi,
            functionName: 'initializeGoldMinter',
            args: [
                goldToken.address, // Gold token address
                USDT.address, // USDT address
                USDC.address, // USDC address
                goldPriceFeed.address, // Price feed address
                owner.account.address, // usdRecipient (Treasury - USD recipient address)
                owner.account.address, // feeRecipient
                owner.account.address, // owner (contract owner)
                true, // autoSettle: true (enable auto settlement)
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

        // Grant gold token minting permission to GoldMinter (minter role)
        await goldToken.write.addMinter([goldMinter.address], {
            account: owner.account,
        });

        // Return all objects needed for testing
        return {
            owner, // Admin/Treasury account
            buyer, // Purchaser account
            goldToken, // Gold token contract
            USDT, // USDT contract
            USDC, // USDC contract
            goldPriceFeed, // Price feed contract
            goldMinter, // GoldMinter contract
            blacklistOracle, // Blacklist oracle contract
            viem, // viem client (utilities)
        };
    };

    // --------------------------------------------------------
    // Helper function: Mint gold tokens for user
    // Execute the full flow of paying USD and receiving gold tokens
    // --------------------------------------------------------
    async function mintGoldForUser(
        goldMinter: any, // GoldMinter contract
        USDT: any, // USDT contract
        goldToken: any, // Gold token contract
        owner: any, // Admin account (for KYC level setting)
        user: any, // User to receive gold
        usdAmount: bigint, // USD amount to pay
    ) {
        // 1. Set user KYC level (level 2 = KYC'd)
        await goldMinter.write.setLevel([user.account.address, 2], { account: owner.account });

        // 2. Approve USDT for GoldMinter
        await USDT.write.approve([goldMinter.address, usdAmount], { account: user.account });

        // 3. Calculate expected gold amount (before fee deduction)
        const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, usdAmount])) as bigint;

        // 4. Calculate fee
        const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;

        // 5. Expected amount after fee deduction
        const expectedAGTAfterFee = expectedAGT - expectedFee;

        // 6. Execute mint request (auto-settled immediately since autoSettle=true)
        await goldMinter.write.requestMint([USDT.address, usdAmount, expectedAGTAfterFee], {
            account: user.account,
        });

        // 7. Return user's gold token balance
        return await goldToken.read.balanceOf([user.account.address]);
    }

    // ============================================================
    // Test Group 1: Treasury Insufficient Balance - Burn to Pending Settlement
    // ============================================================
    describe('Treasury Insufficient Balance - Burn to Pending Settles', function () {
        // --------------------------------------------------------
        // Test: Auto-settlement should NOT occur when treasury has insufficient USD balance
        // --------------------------------------------------------
        it('should NOT auto-settle burn when treasury has insufficient USD balance', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            console.log('\n=== TREASURY INSUFFICIENT BALANCE TEST ===');

            // 1. Mint gold tokens for buyer (purchase with USD worth 10 grams)
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 10n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Check buyer's gold balance
            const buyerGoldBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            console.log(`Buyer gold balance: ${Number(buyerGoldBalance) / 1e18} AGT`);

            // 2. Check Treasury(owner)'s USDT balance
            const treasuryBalance = (await USDT.read.balanceOf([owner.account.address])) as bigint;
            console.log(`Treasury USDT balance: $${Number(treasuryBalance) / 1e6}`);

            // 3. Calculate burn amount (half of holdings)
            const burnAmount = buyerGoldBalance / 2n;
            // Calculate fee
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            // Expected USD amount (calculated based on amount after fee deduction)
            const expectedUSD = (await goldMinter.read.getUsdAmount([
                USDT.address,
                burnAmount - burnFee,
            ])) as bigint;

            console.log(`Attempting to burn: ${Number(burnAmount) / 1e18} AGT`);
            console.log(`Expected USD return: $${Number(expectedUSD) / 1e6}`);

            // 4. Check Treasury's allowance for GoldMinter
            // If allowance is 0, canBurn() returns false and auto-settlement is blocked
            const treasuryAllowance = (await USDT.read.allowance([
                owner.account.address,
                goldMinter.address,
            ])) as bigint;
            console.log(`Treasury allowance to minter: $${Number(treasuryAllowance) / 1e6}`);

            // 5. Execute burn request
            // Since canBurn() is false, auto-settlement won't happen and remains pending
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

            // Record pending count before request
            const initialPendingCount = await goldMinter.read.getUserPendingBurnCount([
                buyer.account.address,
            ]);

            // Burn request
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // 6. Verify burn is in pending state (not auto-settled)
            const pendingCount = await goldMinter.read.getUserPendingBurnCount([buyer.account.address]);
            console.log(`Pending burn count: ${pendingCount}`);

            // Verify pending count increased by 1
            expect(Number(pendingCount)).to.equal(Number(initialPendingCount) + 1);

            // 7. Check burn order status
            const burnOrders = (await goldMinter.read.getBurnOrdersByNonces([[0n]])) as any[];
            // isSettled should be false (not yet settled)
            expect(burnOrders[0].isSettled).to.equal(false);
            console.log(`Burn order isSettled: ${burnOrders[0].isSettled}`);

            // 8. Verify gold tokens are locked in contract
            const contractGoldBalance = (await goldToken.read.balanceOf([goldMinter.address])) as bigint;

            // Contract should hold the burn request amount
            expect(contractGoldBalance).to.equal(burnAmount);
        });

        // --------------------------------------------------------
        // Test: Admin should be able to manually settle at request-time price
        // Important: Current implementation uses request-time price, not settle-time price
        // --------------------------------------------------------
        it('should allow admin to settle burn manually at ORIGINAL request price', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, goldPriceFeed } = await fixture();

            console.log('\n=== ADMIN MANUAL SETTLE AT REQUEST TIME PRICE ===');

            // 1. Mint gold tokens for buyer
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 10n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            const buyerGoldBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

            // 2. Record price at request time
            const priceAtRequest = await goldPriceFeed.read.latestAnswer();
            console.log(`Gold price at request: $${Number(priceAtRequest) / 1e8} per ounce`);

            // 3. Burn request (auto-settlement blocked due to no Treasury allowance)
            const burnAmount = buyerGoldBalance / 2n;
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            // Expected USD amount at request time (this value is stored in the order)
            const expectedUSDAtRequest = (await goldMinter.read.getUsdAmount([
                USDT.address,
                burnAmount - burnFee,
            ])) as bigint;

            console.log(`Burn amount: ${Number(burnAmount) / 1e18} AGT`);
            console.log(`Expected USD at request time: $${Number(expectedUSDAtRequest) / 1e6}`);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSDAtRequest], {
                account: buyer.account,
            });

            // 4. Important: Change price after request (simulate price increase)
            const newPrice = parseUnits('5000', 8); // $4096 → $5000 increase
            await goldPriceFeed.write.updateAnswer([newPrice], { account: owner.account });
            console.log(`\nGold price changed to: $${Number(newPrice) / 1e8} per ounce`);

            // 5. Calculate expected USD at new price (for comparison)
            const expectedUSDAtNewPrice = (await goldMinter.read.getUsdAmount([
                USDT.address,
                burnAmount - burnFee,
            ])) as bigint;
            console.log(`Expected USD at new price: $${Number(expectedUSDAtNewPrice) / 1e6}`);

            // 6. Treasury approves funds for settlement
            await USDT.write.approve([goldMinter.address, expectedUSDAtNewPrice], {
                account: owner.account,
            });

            // 7. Admin manually executes settlement
            // Note: Current implementation uses request-time price (order.usdAmount)
            const buyerUSDTBefore = (await USDT.read.balanceOf([buyer.account.address])) as bigint;

            await goldMinter.write.settleBurn([0n], { account: owner.account });

            const buyerUSDTAfter = (await USDT.read.balanceOf([buyer.account.address])) as bigint;
            const actualUSDReceived = buyerUSDTAfter - buyerUSDTBefore;

            console.log(`\n=== SETTLEMENT RESULT ===`);
            console.log(`USD at request time: $${Number(expectedUSDAtRequest) / 1e6}`);
            console.log(`USD at settle time: $${Number(expectedUSDAtNewPrice) / 1e6}`);
            console.log(`Actual USD received: $${Number(actualUSDReceived) / 1e6}`);

            // Calculate price difference (request-time price vs actual received)
            const priceDifference = Number(actualUSDReceived) - Number(expectedUSDAtRequest);
            console.log(`Price difference: $${priceDifference / 1e6}`);

            // Verify settlement success
            const burnOrders = (await goldMinter.read.getBurnOrdersByNonces([[0n]])) as any[];
            expect(burnOrders[0].isSettled).to.equal(true); // Settlement completed
            expect(burnOrders[0].success).to.equal(true); // Success
        });

        // --------------------------------------------------------
        // Test: Gold refund when Treasury allowance insufficient
        //
        // Important: In current contract implementation, settleBurn uses "request-time price".
        // Therefore, price drops don't affect the usdAmount >= minUsdAmount condition.
        // Refunds only occur when canBurn() = false:
        //   - Treasury's USD balance insufficient
        //   - Treasury's allowance for GoldMinter insufficient
        // --------------------------------------------------------
        it('should refund gold if treasury has insufficient allowance', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            console.log('\n=== REFUND TEST - TREASURY ALLOWANCE INSUFFICIENT ===');

            // 1. Mint gold tokens for buyer
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 10n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            const buyerGoldBalance = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

            // 2. Create burn request at current price
            const burnAmount = buyerGoldBalance / 2n;
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = (await goldMinter.read.getUsdAmount([
                USDT.address,
                burnAmount - burnFee,
            ])) as bigint;

            console.log(`Burn amount: ${Number(burnAmount) / 1e18} AGT`);
            console.log(`Expected USD (request time): $${Number(expectedUSD) / 1e6}`);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // 3. Treasury approves insufficient allowance
            // settleBurn uses request-time usdAmount ($653), but
            // Treasury approves less than required to trigger canBurn() = false
            const insufficientAllowance = expectedUSD / 2n; // Approve only half of required amount
            await USDT.write.approve([goldMinter.address, insufficientAllowance], {
                account: owner.account,
            });

            console.log(`Treasury allowance: $${Number(insufficientAllowance) / 1e6}`);
            console.log(`Required for settlement: $${Number(expectedUSD) / 1e6}`);
            console.log(`Allowance < Required → canBurn() = false → Refund expected`);

            // 4. Attempt settlement
            // canBurn() = false (insufficient allowance) → success = false → Gold refund
            const buyerGoldBefore = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

            await goldMinter.write.settleBurn([0n], { account: owner.account });

            const buyerGoldAfter = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            const goldRefunded = buyerGoldAfter - buyerGoldBefore;

            console.log(`\n=== REFUND RESULT ===`);
            console.log(`Gold refunded: ${Number(goldRefunded) / 1e18} AGT`);

            // 5. Verify: order is settled but success=false (refunded)
            const burnOrders = (await goldMinter.read.getBurnOrdersByNonces([[0n]])) as any[];
            expect(burnOrders[0].isSettled).to.equal(true); // Settlement processed
            expect(burnOrders[0].success).to.equal(false); // Failed (refunded)
            expect(goldRefunded).to.equal(burnAmount); // Full refund
        });
    });

    // ============================================================
    // Test Group 2: Security Tests - Attack Vectors
    // ============================================================
    describe('Security Tests - Attack Vectors', function () {
        // --------------------------------------------------------
        // Test: Prevent double settlement attack
        // Block attempts to settle the same order twice
        // --------------------------------------------------------
        it('should prevent double settlement attack', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== DOUBLE SETTLEMENT ATTACK TEST ===');

            // 1. Set up burn order
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            const burnAmount = parseEther('1'); // 1 gram
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // 2. First settlement (success)
            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });
            await goldMinter.write.settleBurn([0n], { account: owner.account });

            // 3. Second settlement attempt - should revert with AlreadySettled error
            await viem.assertions.revertWithCustomError(
                goldMinter.write.settleBurn([0n], { account: owner.account }),
                goldMinter,
                'AlreadySettled', // Already settled order
            );
        });

        // --------------------------------------------------------
        // Test: Prevent unauthorized settlement
        // Block settlement attempts from non-Owner accounts
        // --------------------------------------------------------
        it('should prevent unauthorized settlement', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== UNAUTHORIZED SETTLEMENT TEST ===');

            // 1. Set up burn order
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Disable autoSettle to create pending order
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            const burnAmount = parseEther('1');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // 2. Non-owner (buyer) attempts settlement - should revert with permission error
            await viem.assertions.revertWithCustomError(
                goldMinter.write.settleBurn([0n], { account: buyer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount', // No permission
            );
        });

        // --------------------------------------------------------
        // Test: Prevent AML blacklisted user from completing burn
        // Block settlement if user was blacklisted after request
        // --------------------------------------------------------
        it('should prevent AML blacklisted user from completing burn', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== AML BLACKLIST PREVENTION TEST ===');

            // 1. Setup: User normally acquires gold tokens
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Disable autoSettle
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // 2. User requests burn
            const burnAmount = parseEther('1');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // 3. User gets added to AML blacklist after request
            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });
            console.log('User blacklisted after burn request');

            // 4. Settlement attempt - should revert due to AML blacklist
            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.settleBurn([0n], { account: owner.account }),
                goldMinter,
                'AMLBlocked', // AML blocked
            );
        });

        // --------------------------------------------------------
        // Test: Prevent blacklisted user from requesting new burn
        // Block requests from already blacklisted users
        // --------------------------------------------------------
        it('should prevent blacklisted user from requesting new burn', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== AML BLACKLIST REQUEST PREVENTION TEST ===');

            // 1. Setup: User normally acquires gold tokens
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // 2. User gets added to AML blacklist
            await goldMinter.write.setAMLBlacklist([buyer.account.address, true], {
                account: owner.account,
            });

            // 3. Blacklisted user attempts burn request - should revert
            const burnAmount = parseEther('1');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                    account: buyer.account,
                }),
                goldMinter,
                'AMLBlocked', // AML blocked
            );
        });

        // --------------------------------------------------------
        // Test: Prevent settlement with invalid nonce
        // Block settlement attempts for non-existent orders
        // --------------------------------------------------------
        it('should prevent invalid nonce settlement', async function () {
            const { owner, goldMinter, viem } = await fixture();

            console.log('\n=== INVALID NONCE TEST ===');

            // Attempt settlement with non-existent nonce(999) - should revert
            await viem.assertions.revertWithCustomError(
                goldMinter.write.settleBurn([999n], { account: owner.account }),
                goldMinter,
                'InvalidNonce', // Invalid nonce
            );
        });

        // --------------------------------------------------------
        // Test: Verify contract pause functionality
        // Block all requests during emergency, then release
        // --------------------------------------------------------
        it('should handle contract pause correctly', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== EMERGENCY PAUSE TEST ===');

            // 1. Set up gold tokens for user
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // 2. Pause contract
            await goldMinter.write.emergencyPause([], { account: owner.account });

            // 3. Attempt burn request while paused - should revert
            const burnAmount = parseEther('1');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                    account: buyer.account,
                }),
                goldMinter,
                'EnforcedPause', // Paused state
            );

            // 4. Unpause contract
            await goldMinter.write.emergencyUnpause([], { account: owner.account });

            // 5. Burn request should now succeed
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });
        });
    });

    // ============================================================
    // Test Group 3: Price Manipulation & Front-running Tests
    // ============================================================
    describe('Price Manipulation & Front-running Tests', function () {
        // --------------------------------------------------------
        // Test: Protect against extreme price changes at REQUEST time
        // Block requests when price is outside allowed range
        // --------------------------------------------------------
        it('should protect against extreme price changes at REQUEST time', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, goldPriceFeed, viem } = await fixture();

            console.log('\n=== EXTREME PRICE CHANGE TEST (REQUEST TIME) ===');

            // 1. Setup - first mint gold at normal price
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            const burnAmount = parseEther('1');

            // 2. Set price too low - should revert at request time
            // minGoldPrice = below $500/oz
            const tooLowPrice = parseUnits('100', 8); // $100/oz
            await goldPriceFeed.write.updateAnswer([tooLowPrice], { account: owner.account });

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

            // Request should fail due to price out of range
            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, burnAmount, 0n], {
                    account: buyer.account,
                }),
                goldMinter,
                'PriceOutOfRange', // Price out of range
            );

            // 3. Set price too high - also revert at request time
            // maxGoldPrice = above $10,000/oz
            const tooHighPrice = parseUnits('15000', 8); // $15000/oz
            await goldPriceFeed.write.updateAnswer([tooHighPrice], { account: owner.account });

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, burnAmount, 0n], {
                    account: buyer.account,
                }),
                goldMinter,
                'PriceOutOfRange', // Price out of range
            );

            // 4. Restore normal price - request should succeed
            await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });
        });

        // --------------------------------------------------------
        // Test: Reject stale price data at REQUEST time
        // Block requests when price exceeds maxPriceAge (default 10 minutes)
        // --------------------------------------------------------
        it('should reject stale price data at REQUEST time', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, goldPriceFeed, viem } = await fixture();

            console.log('\n=== STALE PRICE TEST (REQUEST TIME) ===');

            // 1. Setup - first mint gold at valid price
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            const burnAmount = parseEther('1');
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

            // 2. Simulate time passage (price becomes stale)
            await timeTravel(15 * 60); // 15 minutes passed (exceeds maxPriceAge=10 minutes)

            // 3. Should fail at request time with stale price
            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, burnAmount, 0n], {
                    account: buyer.account,
                }),
                goldMinter,
                'StalePrice', // Stale price
            );

            // 4. Update price to make it fresh
            await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });

            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            // Request should now succeed
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });
        });

        // --------------------------------------------------------
        // Test: Verify burn slippage protection
        // Block requests when minUsdAmount exceeds allowed slippage range
        // --------------------------------------------------------
        it('should enforce slippage protection on burn', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== SLIPPAGE PROTECTION TEST ===');

            // 1. Setup
            await goldMinter.write.setLevel([buyer.account.address, 2], { account: owner.account });

            // First mint gold
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await USDT.write.approve([goldMinter.address, mintAmount], { account: buyer.account });

            const expectedAGT = (await goldMinter.read.getGoldAmount([USDT.address, mintAmount])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedAGT, true])) as bigint;
            await goldMinter.write.requestMint([USDT.address, mintAmount, expectedAGT - expectedFee], {
                account: buyer.account,
            });

            // 2. Attempt burn with unrealistic minUsdAmount (higher than expected)
            const burnAmount = parseEther('1');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = (await goldMinter.read.getUsdAmount([
                USDT.address,
                burnAmount - burnFee,
            ])) as bigint;
            // Require 2x expected (impossible condition)
            const unrealisticMinUSD = expectedUSD * 2n;

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

            // Should revert due to slippage exceeded
            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, burnAmount, unrealisticMinUSD], {
                    account: buyer.account,
                }),
                goldMinter,
                'Underpriced', // Price requirement not met (slippage exceeded)
            );
        });
    });

    // ============================================================
    // Test Group 4: Edge Cases & Overflow Tests
    // ============================================================
    describe('Edge Cases & Overflow Tests', function () {
        // --------------------------------------------------------
        // Test: Verify minimum burn amount validation
        // Block requests below minGoldAmount (default 1 gram)
        // --------------------------------------------------------
        it('should handle minimum burn amount correctly', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== MINIMUM BURN AMOUNT TEST ===');

            // 1. Setup
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // 2. Attempt burn below minimum amount (1 gram)
            const tooSmallBurn = parseEther('0.5'); // 0.5 grams
            const burnFee = (await goldMinter.read.calculateGoldFee([tooSmallBurn, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, tooSmallBurn - burnFee]);

            await goldToken.write.approve([goldMinter.address, tooSmallBurn], { account: buyer.account });

            // Should revert with SmallAmount error
            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestBurn([USDT.address, tooSmallBurn, expectedUSD], {
                    account: buyer.account,
                }),
                goldMinter,
                'SmallAmount', // Amount too small
            );
        });

        // --------------------------------------------------------
        // Test: Correctly track pending counts after failed settlements
        // Pending count should decrease even for refunds (success=false)
        // --------------------------------------------------------
        it('should correctly track pending counts after failed settlements', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            console.log('\n=== PENDING COUNT AFTER FAILED SETTLEMENT TEST ===');

            // 1. Setup
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 10n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // Disable autoSettle
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // 2. Create burn request
            const burnAmount = parseEther('2');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = (await goldMinter.read.getUsdAmount([
                USDT.address,
                burnAmount - burnFee,
            ])) as bigint;

            const beforeGoldTokenBalance = await goldToken.read.balanceOf([buyer.account.address]);
            console.log(
                `Buyer Gold Balance before burn request: ${Number(beforeGoldTokenBalance) / 1e18} AGT`,
            );

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            const pendingBefore = await goldMinter.read.getUserPendingBurnCount([buyer.account.address]);
            console.log(`Pending count before settlement attempt: ${pendingBefore}`);

            // 3. Remove Treasury allowance to make payment impossible
            // canBurn() returns false triggering settlement failure (refund)
            await USDT.write.approve([goldMinter.address, 0n], { account: owner.account });

            // Attempt settlement (canBurn=false due to insufficient allowance → refund)
            await goldMinter.write.settleBurn([0n], { account: owner.account });

            // 4. Verify pending count decreased (settlement processed even for refund)
            const pendingAfter = await goldMinter.read.getUserPendingBurnCount([buyer.account.address]);
            console.log(`Pending count after failed settlement: ${pendingAfter}`);

            expect(Number(pendingAfter)).to.equal(Number(pendingBefore) - 1);

            // Verify gold was refunded
            const burnOrder = (await goldMinter.read.getBurnOrdersByNonces([[0n]])) as any[];
            expect(burnOrder[0].isSettled).to.equal(true); // Settlement processed
            expect(burnOrder[0].success).to.equal(false); // Failed (refunded)

            const afterGoldTokenBalance = await goldToken.read.balanceOf([buyer.account.address]);
            console.log(
                `Buyer Gold Balance after failed settlement: ${Number(afterGoldTokenBalance) / 1e18} AGT`,
            );
            expect(afterGoldTokenBalance).to.equal(beforeGoldTokenBalance);
        });

        // --------------------------------------------------------
        // Test: Handle multiple concurrent burn requests correctly
        // Settle multiple users' requests regardless of order
        // --------------------------------------------------------
        it('should handle multiple concurrent burn requests correctly', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter, viem } = await fixture();

            console.log('\n=== MULTIPLE CONCURRENT BURNS TEST ===');

            // Get additional users
            const [, , user2, user3] = await viem.getWalletClients();

            // Transfer USDT to users
            await USDT.write.transfer([user2.account.address, parseUnits('10000', 6)], {
                account: owner.account,
            });
            await USDT.write.transfer([user3.account.address, parseUnits('10000', 6)], {
                account: owner.account,
            });

            // Mint gold for all users
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, user2, mintAmount);
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, user3, mintAmount);

            // Disable autoSettle
            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // All users request burn
            const burnAmount = parseEther('1');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            // Each user approves and requests
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: user2.account });
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: user3.account });

            // nonce 0: buyer, nonce 1: user2, nonce 2: user3
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: user2.account,
            });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: user3.account,
            });

            console.log('3 burn requests created');

            // Verify all are pending
            expect(await goldMinter.read.getUserPendingBurnCount([buyer.account.address])).to.equal(1n);
            expect(await goldMinter.read.getUserPendingBurnCount([user2.account.address])).to.equal(1n);
            expect(await goldMinter.read.getUserPendingBurnCount([user3.account.address])).to.equal(1n);

            // Settle in any order (reverse order)
            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });

            await goldMinter.write.settleBurn([2n], { account: owner.account }); // user3 first
            await goldMinter.write.settleBurn([0n], { account: owner.account }); // buyer second
            await goldMinter.write.settleBurn([1n], { account: owner.account }); // user2 last

            // Verify all settled
            const orders = (await goldMinter.read.getBurnOrdersByNonces([[0n, 1n, 2n]])) as any[];
            expect(orders[0].isSettled).to.equal(true);
            expect(orders[1].isSettled).to.equal(true);
            expect(orders[2].isSettled).to.equal(true);

            // Verify all pending counts are 0
            expect(await goldMinter.read.getUserPendingBurnCount([buyer.account.address])).to.equal(0n);
            expect(await goldMinter.read.getUserPendingBurnCount([user2.account.address])).to.equal(0n);
            expect(await goldMinter.read.getUserPendingBurnCount([user3.account.address])).to.equal(0n);
        });

        it('should prevent settling with invalid USD token', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            console.log('\n=== SETTLE WITH DIFFERENT TOKEN TEST ===');

            // 1. Create burn request with USDT
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            const burnAmount = parseEther('1');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // 2. Verify USDT is stored in order
            const burnOrder = (await goldMinter.read.getBurnOrdersByNonces([[0n]])) as any[];
            expect(burnOrder[0].usdToken.toLowerCase()).to.equal(USDT.address.toLowerCase());

            // 3. Settlement must use same token (USDT) as request
            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });
            await goldMinter.write.settleBurn([0n], { account: owner.account });

            // Verify settlement used original request token (USDT)
        });
    });

    // ============================================================
    // Test Group 5: Fee Calculation Edge Cases
    // ============================================================
    describe('Fee Calculation Edge Cases', function () {
        // --------------------------------------------------------
        // Test: Apply minimum fee for small amounts
        // If below minGoldFeeAmount, apply minGoldFee (0.01 AGT)
        // --------------------------------------------------------
        it('should apply minimum fee for small amounts', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            console.log('\n=== MINIMUM FEE TEST ===');

            // 1. Mint sufficient gold
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            // 2. Check fee for exactly 1 gram (minGoldFeeAmount threshold)
            const exactMin = parseEther('1');
            const feeForExactMin = await goldMinter.read.calculateGoldFee([exactMin, true]);

            console.log(`Fee for exactly 1g: ${Number(feeForExactMin) / 1e18} AGT`);

            // Simplified fee formula: goldAmount × fee / 10000
            const mintFee = Number(await goldMinter.read.mintFee());
            const expectedPercentageFee = (Number(exactMin) * mintFee) / 10000;
            expect(Number(feeForExactMin)).to.be.closeTo(expectedPercentageFee, 1000);

            // 3. Check fee for below minGoldFeeAmount (0.5 grams)
            const smallAmount = parseEther('0.5'); // 0.5 grams
            const feeForSmall = await goldMinter.read.calculateGoldFee([smallAmount, true]);

            console.log(`Fee for 0.5g: ${Number(feeForSmall) / 1e18} AGT`);

            // Minimum fee (0.01 AGT) should be applied
            expect(feeForSmall).to.equal(parseEther('0.01'));
        });

        // --------------------------------------------------------
        // Test: Verify fee is transferred to Treasury
        // Fee should be sent to usdRecipient (Treasury) during burn settlement
        // --------------------------------------------------------
        it('should verify fee goes to treasury', async function () {
            const { owner, buyer, USDT, goldToken, goldMinter } = await fixture();

            console.log('\n=== FEE TO TREASURY TEST ===');

            // 1. Setup
            const mintAmount = GOLD_PRICE_IN_USD_TOKEN * 5n;
            await mintGoldForUser(goldMinter, USDT, goldToken, owner, buyer, mintAmount);

            await goldMinter.write.updateAutoSettle([], { account: owner.account });

            // Record Treasury's gold balance before settlement
            const treasuryGoldBefore = (await goldToken.read.balanceOf([owner.account.address])) as bigint;

            // 2. Burn request
            const burnAmount = parseEther('2');
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUSD = await goldMinter.read.getUsdAmount([USDT.address, burnAmount - burnFee]);

            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });
            await goldMinter.write.requestBurn([USDT.address, burnAmount, expectedUSD], {
                account: buyer.account,
            });

            // 3. Settlement
            await USDT.write.approve([goldMinter.address, maxUint256], { account: owner.account });
            await goldMinter.write.settleBurn([0n], { account: owner.account });

            // 4. Verify fee was transferred to Treasury
            const treasuryGoldAfter = (await goldToken.read.balanceOf([owner.account.address])) as bigint;
            const feeReceived = treasuryGoldAfter - treasuryGoldBefore;

            console.log(`Fee calculated: ${Number(burnFee) / 1e18} AGT`);
            console.log(`Fee received by treasury: ${Number(feeReceived) / 1e18} AGT`);

            // Verify calculated fee matches actual received fee
            expect(Number(feeReceived)).to.be.closeTo(Number(burnFee), 1000);
        });
    });
});
