/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';

import { parseUnits, parseEther, encodeFunctionData } from 'viem';
import { getClients } from './helpers.js';

const GOLD_PRICE = parseUnits('4096.342', 8);

describe.skip('GoldMinter Load Tests', function () {
    // Increase timeout for load tests
    this.timeout(600000); // 10 minutes

    const fixture = async () => {
        const { owner, buyer, bob, routerEOA, viem } = await getClients();

        const user1 = buyer;
        const user2 = bob;
        const user3 = routerEOA;

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

        // Deploy USDT with large supply for load testing
        const largeUsdtAmount = parseUnits('1000000000000', 6); // 1 trillion USDT
        const USDT = await viem.deployContract('ERC20Mock', ['Tether USD', 'USDT', 6, largeUsdtAmount]);

        // Transfer to users
        await USDT.write.transfer([user1.account.address, parseUnits('100000000000', 6)], {
            account: owner.account,
        });
        await USDT.write.transfer([user2.account.address, parseUnits('100000000000', 6)], {
            account: owner.account,
        });
        await USDT.write.transfer([user3.account.address, parseUnits('100000000000', 6)], {
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
        await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });

        // Deploy USDC for GoldMinter initialization
        const USDC = await viem.deployContract('ERC20Mock', [
            'USD Coin',
            'USDC',
            6,
            parseUnits('1000000000000', 6),
        ]);

        const goldMinterImpl = await viem.deployContract('GoldMinter', []);
        const goldMinterProxy = await viem.deployContract('InitializableProxy', []);

        const goldMinterInitData = encodeFunctionData({
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
            ['GoldMinter', owner.account.address, goldMinterImpl.address, goldMinterInitData],
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

        // Setup: Grant MINTER_ROLE to GoldMinter
        await goldToken.write.addMinter([goldMinter.address], { account: owner.account });

        // Setup: Set user levels to 2 (required for minting)
        await goldMinter.write.setLevel([user1.account.address, 2], { account: owner.account });
        await goldMinter.write.setLevel([user2.account.address, 2], { account: owner.account });
        await goldMinter.write.setLevel([user3.account.address, 2], { account: owner.account });

        // Setup: Set maxPriceAge to maximum allowed (30 minutes)
        await goldMinter.write.updateMaxPriceAge([1800n], { account: owner.account });

        // Approve GoldMinter to spend USDT
        const maxApproval = parseUnits('1000000000000', 6);
        await USDT.write.approve([goldMinter.address, maxApproval], { account: user1.account });
        await USDT.write.approve([goldMinter.address, maxApproval], { account: user2.account });
        await USDT.write.approve([goldMinter.address, maxApproval], { account: user3.account });

        // Approve GoldMinter to spend GoldToken for burns
        const maxGoldApproval = parseEther('1000000000');
        await goldToken.write.approve([goldMinter.address, maxGoldApproval], { account: user1.account });
        await goldToken.write.approve([goldMinter.address, maxGoldApproval], { account: user2.account });
        await goldToken.write.approve([goldMinter.address, maxGoldApproval], { account: user3.account });

        return {
            goldMinter,
            goldToken,
            USDT,
            goldPriceFeed,
            blacklistOracle,
            owner,
            user1,
            user2,
            user3,
            viem,
        };
    };

    /**
     * Helper: Create multiple mint requests for a user
     * Refreshes price feed every 100 requests to avoid StalePrice errors
     */
    async function createMintRequests(
        goldMinter: any,
        USDT: any,
        user: any,
        count: number,
        goldPriceFeed: any,
        owner: any,
        usdAmountPerRequest: bigint = parseUnits('200', 6), // ~1.5g gold at current price
    ) {
        const startTime = Date.now();

        // Calculate expected gold amount once (within 5% slippage requirement)
        const expectedGold = await goldMinter.read.getGoldAmount([USDT.address, usdAmountPerRequest]);
        const minGoldAmount = (expectedGold * 96n) / 100n; // 4% slippage (within 5% limit)

        for (let i = 0; i < count; i++) {
            // Refresh price every 100 requests to avoid StalePrice
            if (i > 0 && i % 100 === 0) {
                await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });
            }

            await goldMinter.write.requestMint([USDT.address, usdAmountPerRequest, minGoldAmount], {
                account: user.account,
            });

            if ((i + 1) % 100 === 0) {
                console.log(`    Created ${i + 1}/${count} mint requests...`);
            }
        }

        const endTime = Date.now();
        return endTime - startTime;
    }

    /**
     * Helper: Create multiple burn requests for a user
     * Refreshes price feed every 100 requests to avoid StalePrice errors
     */
    async function createBurnRequests(
        goldMinter: any,
        USDT: any,
        user: any,
        count: number,
        goldPriceFeed: any,
        owner: any,
        goldAmountPerRequest: bigint = parseEther('1'),
    ) {
        const startTime = Date.now();

        // Calculate expected USD amount once (within 5% slippage requirement)
        const expectedUsd = await goldMinter.read.getUsdAmount([USDT.address, goldAmountPerRequest]);
        const minUsdAmount = (expectedUsd * 96n) / 100n; // 4% slippage (within 5% limit)

        for (let i = 0; i < count; i++) {
            // Refresh price every 100 requests to avoid StalePrice
            if (i > 0 && i % 100 === 0) {
                await goldPriceFeed.write.updateAnswer([GOLD_PRICE], { account: owner.account });
            }

            await goldMinter.write.requestBurn([USDT.address, goldAmountPerRequest, minUsdAmount], {
                account: user.account,
            });

            if ((i + 1) % 100 === 0) {
                console.log(`    Created ${i + 1}/${count} burn requests...`);
            }
        }

        const endTime = Date.now();
        return endTime - startTime;
    }

    /**
     * Helper: Mint gold tokens for a user (for burn testing)
     * Uses large USD amount to get enough gold for burn tests
     */
    async function mintGoldForUser(goldMinter: any, USDT: any, owner: any, user: any) {
        const usdAmount = parseUnits('100000000', 6); // 100M USD
        const expectedGold = await goldMinter.read.getGoldAmount([USDT.address, usdAmount]);
        const minGoldAmount = (expectedGold * 96n) / 100n;

        // Get the current nonce before minting (will be the nonce of the new order)
        const currentCount = await goldMinter.read.getUserMintCount([user.account.address]);
        await goldMinter.write.requestMint([USDT.address, usdAmount, minGoldAmount], {
            account: user.account,
        });

        // Get the nonce from the newly created order
        const nonces = await goldMinter.read.getUserMintNonces([user.account.address, currentCount, 1n]);
        await goldMinter.write.settleMint([nonces[0]], { account: owner.account });
    }

    describe('Mint Order Load Tests', function () {
        it('should handle 100 mint requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            const count = 100;
            console.log(`\n  Creating ${count} mint requests...`);

            const createTime = await createMintRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} mint requests in ${createTime}ms`);

            console.log(`  Testing query functions...`);

            // 1. getUserMintCount
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserMintCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserMintCount: ${totalCount} (${queryTime}ms)`);
            expect(totalCount).to.equal(BigInt(count));

            // 2. getUserPendingMintCount
            startTime = Date.now();
            const pendingCount = await goldMinter.read.getUserPendingMintCount([user1.account.address]);
            queryTime = Date.now() - startTime;
            console.log(`    getUserPendingMintCount: ${pendingCount} (${queryTime}ms)`);
            expect(pendingCount).to.equal(BigInt(count));

            // 3. getUserMintNonces with pagination (first 10)
            startTime = Date.now();
            const nonces = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                10n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces (0-10): ${nonces.length} items (${queryTime}ms)`);
            expect(nonces.length).to.equal(10);

            // 4. getUserMintNonces with pagination (last 10)
            startTime = Date.now();
            const lastNonces = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                BigInt(count - 10),
                10n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(
                `    getUserMintNonces (${count - 10}-${count}): ${lastNonces.length} items (${queryTime}ms)`,
            );
            expect(lastNonces.length).to.equal(10);

            // 5. getMintOrdersByNonces
            startTime = Date.now();
            const orders = (await goldMinter.read.getMintOrdersByNonces([nonces])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (10 items): ${orders.length} orders (${queryTime}ms)`);
            expect(orders.length).to.equal(10);
        });

        it('should handle 500 mint requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            const count = 500;
            console.log(`\n  Creating ${count} mint requests...`);

            const createTime = await createMintRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} mint requests in ${createTime}ms`);

            console.log(`  Testing query performance...`);

            // Count query (O(1))
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserMintCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserMintCount: ${totalCount} (${queryTime}ms)`);

            // Pagination query - first page
            startTime = Date.now();
            const page1 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 1 (0-100): ${page1.length} items (${queryTime}ms)`);

            // Pagination query - middle page
            startTime = Date.now();
            const page3 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                200n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 3 (200-300): ${page3.length} items (${queryTime}ms)`);

            // Pagination query - last page
            startTime = Date.now();
            const page5 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                400n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 5 (400-500): ${page5.length} items (${queryTime}ms)`);

            // Batch order retrieval
            startTime = Date.now();
            const orders = (await goldMinter.read.getMintOrdersByNonces([page1])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (100 items): ${orders.length} orders (${queryTime}ms)`);

            expect(totalCount).to.equal(BigInt(count));
        });

        it('should handle multiple users with 200 requests each', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1, user2, user3 } = await fixture();

            const countPerUser = 200;
            console.log(`\n  Creating ${countPerUser} mint requests for 3 users...`);

            await createMintRequests(goldMinter, USDT, user1, countPerUser, goldPriceFeed, owner);
            console.log(`    User1 done`);
            await createMintRequests(goldMinter, USDT, user2, countPerUser, goldPriceFeed, owner);
            console.log(`    User2 done`);
            await createMintRequests(goldMinter, USDT, user3, countPerUser, goldPriceFeed, owner);
            console.log(`    User3 done`);

            const count1 = (await goldMinter.read.getUserMintCount([user1.account.address])) as bigint;
            const count2 = (await goldMinter.read.getUserMintCount([user2.account.address])) as bigint;
            const count3 = (await goldMinter.read.getUserMintCount([user3.account.address])) as bigint;

            console.log(`  User1 count: ${count1}`);
            console.log(`  User2 count: ${count2}`);
            console.log(`  User3 count: ${count3}`);

            expect(count1).to.equal(BigInt(countPerUser));
            expect(count2).to.equal(BigInt(countPerUser));
            expect(count3).to.equal(BigInt(countPerUser));

            // Total orders = sum of all user counts
            const totalOrders = count1 + count2 + count3;
            console.log(`  Total orders: ${totalOrders}`);
            expect(totalOrders).to.equal(BigInt(countPerUser * 3));
        });
    });

    describe('Burn Order Load Tests', function () {
        it('should handle 100 burn requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            console.log(`\n  Minting gold for user...`);
            await mintGoldForUser(goldMinter, USDT, owner, user1);

            const count = 100;
            console.log(`  Creating ${count} burn requests...`);

            const createTime = await createBurnRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} burn requests in ${createTime}ms`);

            console.log(`  Testing query functions...`);

            // 1. getUserBurnCount
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserBurnCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserBurnCount: ${totalCount} (${queryTime}ms)`);
            expect(totalCount).to.equal(BigInt(count));

            // 2. getUserPendingBurnCount
            startTime = Date.now();
            const pendingCount = await goldMinter.read.getUserPendingBurnCount([user1.account.address]);
            queryTime = Date.now() - startTime;
            console.log(`    getUserPendingBurnCount: ${pendingCount} (${queryTime}ms)`);
            expect(pendingCount).to.equal(BigInt(count));

            // 3. getUserBurnNonces with pagination
            startTime = Date.now();
            const nonces = (await goldMinter.read.getUserBurnNonces([
                user1.account.address,
                0n,
                10n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserBurnNonces (0-10): ${nonces.length} items (${queryTime}ms)`);
            expect(nonces.length).to.equal(10);

            // 4. getBurnOrdersByNonces
            startTime = Date.now();
            const orders = (await goldMinter.read.getBurnOrdersByNonces([nonces])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getBurnOrdersByNonces (10 items): ${orders.length} orders (${queryTime}ms)`);
            expect(orders.length).to.equal(10);
        });

        it('should handle 500 burn requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            console.log(`\n  Minting gold for user...`);
            await mintGoldForUser(goldMinter, USDT, owner, user1);

            const count = 500;
            console.log(`  Creating ${count} burn requests...`);

            const createTime = await createBurnRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} burn requests in ${createTime}ms`);

            console.log(`  Testing query performance...`);

            // Count query (O(1))
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserBurnCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserBurnCount: ${totalCount} (${queryTime}ms)`);

            // Pagination query - first page
            startTime = Date.now();
            const page1 = (await goldMinter.read.getUserBurnNonces([
                user1.account.address,
                0n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserBurnNonces page 1 (0-100): ${page1.length} items (${queryTime}ms)`);

            // Pagination query - last page
            startTime = Date.now();
            const page5 = (await goldMinter.read.getUserBurnNonces([
                user1.account.address,
                400n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserBurnNonces page 5 (400-500): ${page5.length} items (${queryTime}ms)`);

            // Batch order retrieval
            startTime = Date.now();
            const orders = (await goldMinter.read.getBurnOrdersByNonces([page1])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getBurnOrdersByNonces (100 items): ${orders.length} orders (${queryTime}ms)`);

            expect(totalCount).to.equal(BigInt(count));
        });
    });

    describe('Pagination Edge Cases', function () {
        it('should handle offset beyond data range', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            await createMintRequests(goldMinter, USDT, user1, 10, goldPriceFeed, owner);

            const nonces = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                100n,
                10n,
            ])) as any[];
            expect(nonces.length).to.equal(0);
        });

        it('should handle limit larger than remaining items', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            await createMintRequests(goldMinter, USDT, user1, 10, goldPriceFeed, owner);

            const nonces = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                5n,
                100n,
            ])) as any[];
            expect(nonces.length).to.equal(5);
        });

        it('should handle zero limit', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            await createMintRequests(goldMinter, USDT, user1, 10, goldPriceFeed, owner);

            const nonces = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                0n,
            ])) as any[];
            expect(nonces.length).to.equal(0);
        });

        it('should return empty for user with no orders', async function () {
            const { goldMinter, user1 } = await fixture();

            const count = await goldMinter.read.getUserMintCount([user1.account.address]);
            const pendingCount = await goldMinter.read.getUserPendingMintCount([user1.account.address]);
            const nonces = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                10n,
            ])) as any[];

            expect(count).to.equal(0n);
            expect(pendingCount).to.equal(0n);
            expect(nonces.length).to.equal(0);
        });
    });

    describe('Performance Benchmarks', function () {
        it('should benchmark query performance at different scales', async function () {
            const scales = [50, 100, 200];
            const results: { scale: number; createTime: number; countTime: number; paginateTime: number }[] =
                [];

            for (const scale of scales) {
                const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

                console.log(`\n  Benchmarking ${scale} records...`);

                const createTime = await createMintRequests(
                    goldMinter,
                    USDT,
                    user1,
                    scale,
                    goldPriceFeed,
                    owner,
                );

                const countStart = Date.now();
                await goldMinter.read.getUserMintCount([user1.account.address]);
                const countTime = Date.now() - countStart;

                const paginateStart = Date.now();
                await goldMinter.read.getUserMintNonces([
                    user1.account.address,
                    BigInt(Math.floor(scale / 2)),
                    50n,
                ]);
                const paginateTime = Date.now() - paginateStart;

                results.push({ scale, createTime, countTime, paginateTime });
                console.log(
                    `    Create: ${createTime}ms, Count: ${countTime}ms, Paginate: ${paginateTime}ms`,
                );
            }

            console.log('\n  Performance Summary:');
            console.log('  | Scale | Create (ms) | Count (ms) | Paginate (ms) |');
            console.log('  |-------|-------------|------------|---------------|');
            for (const r of results) {
                console.log(
                    `  | ${r.scale.toString().padEnd(5)} | ${r.createTime.toString().padEnd(11)} | ${r.countTime.toString().padEnd(10)} | ${r.paginateTime.toString().padEnd(13)} |`,
                );
            }
        });
    });

    describe('Large Scale Tests', function () {
        it('should handle 1000 mint requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            const count = 1000;
            console.log(`\n  Creating ${count} mint requests...`);

            const createTime = await createMintRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} mint requests in ${createTime}ms`);

            console.log(`  Testing query performance...`);

            // Count query (O(1))
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserMintCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserMintCount: ${totalCount} (${queryTime}ms)`);
            expect(totalCount).to.equal(BigInt(count));

            // Pending count query
            startTime = Date.now();
            const pendingCount = await goldMinter.read.getUserPendingMintCount([user1.account.address]);
            queryTime = Date.now() - startTime;
            console.log(`    getUserPendingMintCount: ${pendingCount} (${queryTime}ms)`);
            expect(pendingCount).to.equal(BigInt(count));

            // Pagination query - first page
            startTime = Date.now();
            const page1 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 1 (0-100): ${page1.length} items (${queryTime}ms)`);

            // Pagination query - middle page
            startTime = Date.now();
            const page5 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                400n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 5 (400-500): ${page5.length} items (${queryTime}ms)`);

            // Pagination query - last page
            startTime = Date.now();
            const page10 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                900n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 10 (900-1000): ${page10.length} items (${queryTime}ms)`);

            // Batch order retrieval
            startTime = Date.now();
            const orders = (await goldMinter.read.getMintOrdersByNonces([page1])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (100 items): ${orders.length} orders (${queryTime}ms)`);
        });

        it('should handle 2000 mint requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            const count = 2000;
            console.log(`\n  Creating ${count} mint requests...`);

            const createTime = await createMintRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} mint requests in ${createTime}ms`);

            console.log(`  Testing query performance...`);

            // Count query (O(1))
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserMintCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserMintCount: ${totalCount} (${queryTime}ms)`);
            expect(totalCount).to.equal(BigInt(count));

            // Pagination query - first page
            startTime = Date.now();
            const page1 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 1 (0-100): ${page1.length} items (${queryTime}ms)`);

            // Pagination query - middle page
            startTime = Date.now();
            const page10 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                900n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 10 (900-1000): ${page10.length} items (${queryTime}ms)`);

            // Pagination query - last page
            startTime = Date.now();
            const page20 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                1900n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 20 (1900-2000): ${page20.length} items (${queryTime}ms)`);

            // Batch order retrieval - 100 orders
            startTime = Date.now();
            const orders100 = (await goldMinter.read.getMintOrdersByNonces([page1])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (100 items): ${orders100.length} orders (${queryTime}ms)`);

            // Batch order retrieval - 50 orders from middle
            const middle50 = page10.slice(0, 50);
            startTime = Date.now();
            const orders50 = (await goldMinter.read.getMintOrdersByNonces([middle50])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (50 items): ${orders50.length} orders (${queryTime}ms)`);
        });

        it('should handle 5000 mint requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            const count = 5000;
            console.log(`\n  Creating ${count} mint requests...`);

            const createTime = await createMintRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} mint requests in ${createTime}ms`);

            console.log(`  Testing query performance...`);

            // Count query (O(1))
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserMintCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserMintCount: ${totalCount} (${queryTime}ms)`);
            expect(totalCount).to.equal(BigInt(count));

            // Pending count query
            startTime = Date.now();
            const pendingCount = await goldMinter.read.getUserPendingMintCount([user1.account.address]);
            queryTime = Date.now() - startTime;
            console.log(`    getUserPendingMintCount: ${pendingCount} (${queryTime}ms)`);

            // Pagination query - first page
            startTime = Date.now();
            const page1 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 1 (0-100): ${page1.length} items (${queryTime}ms)`);

            // Pagination query - middle page (page 25)
            startTime = Date.now();
            const page25 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                2400n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 25 (2400-2500): ${page25.length} items (${queryTime}ms)`);

            // Pagination query - last page (page 50)
            startTime = Date.now();
            const page50 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                4900n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 50 (4900-5000): ${page50.length} items (${queryTime}ms)`);

            // Batch order retrieval
            startTime = Date.now();
            const orders = (await goldMinter.read.getMintOrdersByNonces([page1])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (100 items): ${orders.length} orders (${queryTime}ms)`);
        });

        it('should handle 10000 mint requests and query efficiently', async function () {
            const { goldMinter, USDT, goldPriceFeed, owner, user1 } = await fixture();

            const count = 10000;
            console.log(`\n  Creating ${count} mint requests...`);

            const createTime = await createMintRequests(goldMinter, USDT, user1, count, goldPriceFeed, owner);
            console.log(`  Created ${count} mint requests in ${createTime}ms`);

            console.log(`  Testing query performance...`);

            // Count query (O(1))
            let startTime = Date.now();
            const totalCount = await goldMinter.read.getUserMintCount([user1.account.address]);
            let queryTime = Date.now() - startTime;
            console.log(`    getUserMintCount: ${totalCount} (${queryTime}ms)`);
            expect(totalCount).to.equal(BigInt(count));

            // Pending count query
            startTime = Date.now();
            const pendingCount = await goldMinter.read.getUserPendingMintCount([user1.account.address]);
            queryTime = Date.now() - startTime;
            console.log(`    getUserPendingMintCount: ${pendingCount} (${queryTime}ms)`);

            // Pagination query - first page
            startTime = Date.now();
            const page1 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                0n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 1 (0-100): ${page1.length} items (${queryTime}ms)`);

            // Pagination query - middle page (page 50)
            startTime = Date.now();
            const page50 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                4900n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getUserMintNonces page 50 (4900-5000): ${page50.length} items (${queryTime}ms)`);

            // Pagination query - last page (page 100)
            startTime = Date.now();
            const page100 = (await goldMinter.read.getUserMintNonces([
                user1.account.address,
                9900n,
                100n,
            ])) as any[];
            queryTime = Date.now() - startTime;
            console.log(
                `    getUserMintNonces page 100 (9900-10000): ${page100.length} items (${queryTime}ms)`,
            );

            // Batch order retrieval - 100 orders
            startTime = Date.now();
            const orders100 = (await goldMinter.read.getMintOrdersByNonces([page1])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (100 items): ${orders100.length} orders (${queryTime}ms)`);

            // Batch order retrieval - 200 orders (combine 2 pages)
            const combined200 = [...page1, ...page50];
            startTime = Date.now();
            const orders200 = (await goldMinter.read.getMintOrdersByNonces([combined200])) as any[];
            queryTime = Date.now() - startTime;
            console.log(`    getMintOrdersByNonces (200 items): ${orders200.length} orders (${queryTime}ms)`);
        });
    });
});
