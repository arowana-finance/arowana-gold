/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { network } from 'hardhat';
import { Logger } from 'logger-chain';
import {
    encodeFunctionData,
    zeroAddress,
    parseGwei,
    parseUnits,
    parseEther,
    maxUint256,
    type Hex,
} from 'viem';

const { viem } = await network.connect();

const OXAU_NAME = 'Ontorium Gold Token';
const OXAU_SYMBOL = 'OXAU';

// Chainlink (for local testing)
const CHAINLINK_ROUTER = '0x97083e831f8f0638855e2a515c90edcf158df238';
const REMOTE_CHAIN = 42161;
const REMOTE_CHAIN_ORACLE = '0x1F954Dc24a49708C26E0C1777f16750B5C6d5a2c';

// Role Constants
const DEFAULT_ADMIN_ROLE =
    '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
const SETTLER_ROLE = '0x6666bf5bfee463d10a7fc50448047f8a53b7762d7e28fbc5c643182785f3fd3f' as `0x${string}`;
const PARAMETER_MANAGER_ROLE =
    '0xf7e61c4e74c42df4eeae815b78ea28052584091f2e136a00ad566b99fd705839' as `0x${string}`;
const INFRA_MANAGER_ROLE =
    '0x38e3514d14a43b32346641d4cce38d023dcec3c7e11e9c363aa96dd6981420ee' as `0x${string}`;
const KYC_MANAGER_ROLE =
    '0x6f35daacd116f0f629c42d5459fd6842d505964e6828899d889573dc5bc51cf8' as `0x${string}`;

// Gold price: $4096.342/ounce (8 decimals)
const GOLD_PRICE = parseUnits('4096.342', 8);
const GRAMS_PER_OUNCE = parseUnits('31.1034768', 8);
// Price per 1g (based on USD token 6 decimals)
const GOLD_PRICE_PER_GRAM_USD = (GOLD_PRICE * parseUnits('1', 8)) / GRAMS_PER_OUNCE / 100n;

const logger = new Logger();

// ============ Tx Record ============
interface TxRecord {
    phase: string;
    step: string;
    txHash: string;
    blockNumber: string;
    address?: string;
}

const records: TxRecord[] = [];

async function trackTx(phase: string, step: string, txHashPromise: Promise<Hex>, address?: string) {
    const publicClient = await viem.getPublicClient();
    const hash = await txHashPromise;
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    records.push({
        phase,
        step,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber.toString(),
        address,
    });
    logger.debug('Tx', `${step} (hash: ${receipt.transactionHash}, block: ${receipt.blockNumber})`);
    return receipt;
}

// ============================================================
// E2E Full Test — Deployment simulation + Mint/Redeem/Settle/Pause
// ============================================================
describe('E2E Full Test — Deploy + Mint/Redeem/Settle/Pause', function () {
    // Shared state (used by all tests after deployment)
    let deployer: any;
    let adminMultisig: any;
    let parameterMultisig: any;
    let infraMultisig: any;
    let settlerMultisig: any;
    let kycBackend: any;
    let buyer: any;

    let goldToken: any;
    let goldMinter: any;
    let priceFeed: any;
    let blacklistOracle: any;
    let usdt: any;
    let usdc: any;

    let boProxy: any;
    let gtProxy: any;
    let pfProxy: any;
    let gmProxy: any;

    // ============================================================
    // Deployment simulation (Steps 1~7 full flow)
    // ============================================================
    before(async function () {
        const wallets = await viem.getWalletClients();
        deployer = wallets[0];
        adminMultisig = wallets[1];
        parameterMultisig = wallets[2];
        infraMultisig = wallets[3];
        settlerMultisig = wallets[4];
        kycBackend = wallets[5];
        buyer = wallets[6];

        logger.debug('Deployer', deployer.account.address);
        logger.debug('Admin Multisig', adminMultisig.account.address);
        logger.debug('Settler Multisig', settlerMultisig.account.address);
        logger.debug('KYC Backend', kycBackend.account.address);
        logger.debug('Buyer', buyer.account.address);

        // ──── Mock token deployment (for local testing) ────
        usdt = await viem.deployContract('ERC20Mock', ['Tether USD', 'USDT', 6, parseUnits('1000000', 6)]);
        usdc = await viem.deployContract('ERC20Mock', ['USD Coin', 'USDC', 6, parseUnits('1000000', 6)]);
        logger.debug('Deploy', `USDT Mock: ${usdt.address}`);
        logger.debug('Deploy', `USDC Mock: ${usdc.address}`);

        // ──── Step 1: deployOXAUToken.ts ────
        logger.debug('Phase', '═══ Step 1. Deploy BlacklistOracle + GoldToken ═══');

        const boImpl = await viem.deployContract('BlacklistOracle', []);
        boProxy = await viem.deployContract('InitializableProxy', []);
        const boInitData = encodeFunctionData({
            abi: boImpl.abi,
            functionName: 'initializeOracle',
            args: ['Blacklist Oracle', adminMultisig.account.address],
        });
        await trackTx(
            'Step1',
            'BlacklistOracle Proxy deploy + initialize',
            boProxy.write.initializeProxy(
                ['Blacklist Oracle', deployer.account.address, boImpl.address, boInitData],
                { account: deployer.account },
            ),
            boProxy.address,
        );
        blacklistOracle = await viem.getContractAt('BlacklistOracle', boProxy.address);

        const gtImpl = await viem.deployContract('GoldToken', []);
        gtProxy = await viem.deployContract('InitializableProxy', []);
        const gtInitData = encodeFunctionData({
            abi: gtImpl.abi,
            functionName: 'initializeGoldToken',
            args: [deployer.account.address, boProxy.address],
        });
        await trackTx(
            'Step1',
            'GoldToken Proxy deploy + initialize',
            gtProxy.write.initializeProxy([OXAU_NAME, deployer.account.address, gtImpl.address, gtInitData], {
                account: deployer.account,
            }),
            gtProxy.address,
        );
        goldToken = await viem.getContractAt('GoldToken', gtProxy.address);

        // ──── Step 2: deployOXAUPriceFeed.ts ────
        logger.debug('Phase', '═══ Step 2. Deploy OXAUPriceFeed ═══');

        const pfImpl = await viem.deployContract('AGTPriceFeed', []);
        pfProxy = await viem.deployContract('InitializableProxy', []);
        const pfInitData = encodeFunctionData({
            abi: pfImpl.abi,
            functionName: 'initializeAGTPriceFeed',
            args: [
                {
                    initOwner: deployer.account.address,
                    asset: gtProxy.address, // Changed: zeroAddress → GoldToken address
                    description: `${OXAU_SYMBOL} / USD`,
                    remoteChain: BigInt(REMOTE_CHAIN),
                    remoteChainOracle: REMOTE_CHAIN_ORACLE,
                    router: CHAINLINK_ROUTER,
                    upkeepContract: zeroAddress,
                    upkeepInterval: 60n,
                    upkeepRateInterval: 300n,
                    upkeepRateCap: 5n,
                    maxBaseGasPrice: parseGwei('1'),
                    updateInterval: 300n,
                },
            ],
        });
        await trackTx(
            'Step2',
            'OXAUPriceFeed Proxy deploy + initialize',
            pfProxy.write.initializeProxy(
                [`${OXAU_SYMBOL} Price Feed`, deployer.account.address, pfImpl.address, pfInitData],
                { account: deployer.account },
            ),
            pfProxy.address,
        );
        priceFeed = await viem.getContractAt('AGTPriceFeed', pfProxy.address);

        // Manually set price (for local testing)
        await trackTx(
            'Step2',
            'PriceFeed.updateAnswer (test price: $4096.342/oz)',
            priceFeed.write.updateAnswer([GOLD_PRICE], { account: deployer.account }),
        );

        // ──── Step 3: deployOXAUMinter.ts ────
        logger.debug('Phase', '═══ Step 3. Deploy GoldMinter + grant roles ═══');

        const gmImpl = await viem.deployContract('GoldMinter', []);
        gmProxy = await viem.deployContract('InitializableProxy', []);
        const gmInitData = encodeFunctionData({
            abi: gmImpl.abi,
            functionName: 'initializeGoldMinter',
            args: [
                gtProxy.address,
                usdt.address,
                usdc.address,
                pfProxy.address,
                settlerMultisig.account.address, // usdRecipient
                deployer.account.address, // feeRecipient
                deployer.account.address, // owner
                true, // autoSettle
            ],
        });
        await trackTx(
            'Step3',
            'GoldMinter Proxy deploy + initialize',
            gmProxy.write.initializeProxy(
                [`${OXAU_NAME} Minter`, deployer.account.address, gmImpl.address, gmInitData],
                { account: deployer.account },
            ),
            gmProxy.address,
        );
        goldMinter = await viem.getContractAt('GoldMinter', gmProxy.address);

        // Grant roles
        await trackTx(
            'Step3',
            'GoldToken.addMinter(GoldMinter)',
            goldToken.write.addMinter([goldMinter.address], { account: deployer.account }),
        );
        await trackTx(
            'Step3',
            'GoldMinter.grantRole(PARAMETER_MANAGER_ROLE)',
            goldMinter.write.grantRole([PARAMETER_MANAGER_ROLE, parameterMultisig.account.address], {
                account: deployer.account,
            }),
        );
        await trackTx(
            'Step3',
            'GoldMinter.grantRole(INFRA_MANAGER_ROLE)',
            goldMinter.write.grantRole([INFRA_MANAGER_ROLE, infraMultisig.account.address], {
                account: deployer.account,
            }),
        );
        await trackTx(
            'Step3',
            'GoldMinter.grantRole(SETTLER_ROLE)',
            goldMinter.write.grantRole([SETTLER_ROLE, settlerMultisig.account.address], {
                account: deployer.account,
            }),
        );
        await trackTx(
            'Step3',
            'GoldMinter.grantRole(KYC_MANAGER_ROLE)',
            goldMinter.write.grantRole([KYC_MANAGER_ROLE, kycBackend.account.address], {
                account: deployer.account,
            }),
        );

        // Transfer Admin
        await trackTx(
            'Step3',
            'GoldToken.grantRole(DEFAULT_ADMIN_ROLE, Admin Multisig)',
            goldToken.write.grantRole([DEFAULT_ADMIN_ROLE, adminMultisig.account.address], {
                account: deployer.account,
            }),
        );
        await trackTx(
            'Step3',
            'GoldMinter.grantRole(DEFAULT_ADMIN_ROLE, Admin Multisig)',
            goldMinter.write.grantRole([DEFAULT_ADMIN_ROLE, adminMultisig.account.address], {
                account: deployer.account,
            }),
        );
        await trackTx(
            'Step3',
            'GoldToken.renounceRole(DEFAULT_ADMIN_ROLE, Deployer)',
            goldToken.write.renounceRole([DEFAULT_ADMIN_ROLE, deployer.account.address], {
                account: deployer.account,
            }),
        );
        await trackTx(
            'Step3',
            'GoldMinter.renounceRole(DEFAULT_ADMIN_ROLE, Deployer)',
            goldMinter.write.renounceRole([DEFAULT_ADMIN_ROLE, deployer.account.address], {
                account: deployer.account,
            }),
        );

        // ──── Step 5~6 skipped (Chainlink Upkeep/Functions — not possible in local testing) ────

        // ──── Step 7: transferOXAUAdmin.ts ────
        logger.debug('Phase', '═══ Step 7. Transfer Owner / Proxy Admin ═══');

        await trackTx(
            'Step7',
            'PriceFeed.transferOwnership(Admin Multisig)',
            priceFeed.write.transferOwnership([adminMultisig.account.address], { account: deployer.account }),
        );

        const proxyTargets = [
            { name: 'BlacklistOracle', address: boProxy.address },
            { name: 'GoldToken', address: gtProxy.address },
            { name: 'OXAUPriceFeed', address: pfProxy.address },
            { name: 'GoldMinter', address: gmProxy.address },
        ];

        for (const target of proxyTargets) {
            const proxy = await viem.getContractAt('InitializableProxy', target.address);
            await trackTx(
                'Step7',
                `${target.name} Proxy.changeAdmin(Admin Multisig)`,
                proxy.write.changeAdmin([adminMultisig.account.address], { account: deployer.account }),
            );
        }

        // ──── E2E test preparation: fund buyer with USDT/USDC ────
        await usdt.write.transfer([buyer.account.address, parseUnits('50000', 6)], {
            account: deployer.account,
        });
        await usdc.write.transfer([buyer.account.address, parseUnits('50000', 6)], {
            account: deployer.account,
        });

        // Fund settlerMultisig (usdRecipient) with USDT (for Redeem settlement)
        await usdt.write.transfer([settlerMultisig.account.address, parseUnits('100000', 6)], {
            account: deployer.account,
        });

        logger.debug('Phase', '═══ Deployment complete — E2E test start ═══');
    });

    // ============================================================
    // 1. On-chain deployment verification
    // ============================================================
    describe('1. On-chain deployment verification', function () {
        it('should set GoldMinter roles correctly', async function () {
            expect(await goldMinter.read.hasRole([DEFAULT_ADMIN_ROLE, adminMultisig.account.address])).to.be
                .true;
            expect(await goldMinter.read.hasRole([PARAMETER_MANAGER_ROLE, parameterMultisig.account.address]))
                .to.be.true;
            expect(await goldMinter.read.hasRole([INFRA_MANAGER_ROLE, infraMultisig.account.address])).to.be
                .true;
            expect(await goldMinter.read.hasRole([SETTLER_ROLE, settlerMultisig.account.address])).to.be.true;
            expect(await goldMinter.read.hasRole([KYC_MANAGER_ROLE, kycBackend.account.address])).to.be.true;
        });

        it('should revoke DEFAULT_ADMIN_ROLE from Deployer', async function () {
            expect(await goldMinter.read.hasRole([DEFAULT_ADMIN_ROLE, deployer.account.address])).to.be.false;
            expect(await goldToken.read.hasRole([DEFAULT_ADMIN_ROLE, deployer.account.address])).to.be.false;
        });

        it('should set GoldToken roles correctly', async function () {
            expect(await goldToken.read.hasRole([DEFAULT_ADMIN_ROLE, adminMultisig.account.address])).to.be
                .true;
            const MINTER_ROLE = await goldToken.read.MINTER_ROLE();
            expect(await goldToken.read.hasRole([MINTER_ROLE, goldMinter.address])).to.be.true;
        });

        it('should set GoldToken metadata correctly', async function () {
            expect(await goldToken.read.name()).to.equal('Ontorium Gold Token');
            expect(await goldToken.read.symbol()).to.equal('OXAU');
            expect(await goldToken.read.decimals()).to.equal(18);
            expect(await goldToken.read.totalSupply()).to.equal(0n);
        });

        it('should set GoldMinter parameters correctly', async function () {
            expect(await goldMinter.read.mintSpread()).to.equal(150);
            expect(await goldMinter.read.redeemSpread()).to.equal(150);
            expect(await goldMinter.read.mintFee()).to.equal(25);
            expect(await goldMinter.read.redeemFee()).to.equal(25);
            expect(await goldMinter.read.slippage()).to.equal(500);
            expect(await goldMinter.read.minMintAmount()).to.equal(parseEther('1000'));
            expect(await goldMinter.read.minRedeemAmount()).to.equal(parseEther('1000'));
        });

        it('should set PriceFeed asset to GoldToken', async function () {
            const asset = await priceFeed.read.asset();
            expect((asset as string).toLowerCase()).to.equal(gtProxy.address.toLowerCase());
        });

        it('should return gold price from PriceFeed', async function () {
            const price = (await priceFeed.read.latestAnswer()) as bigint;
            expect(price).to.equal(GOLD_PRICE);
        });
    });

    // ============================================================
    // 2. Mint E2E test
    // ============================================================
    describe('2. Mint E2E', function () {
        before(async function () {
            // E2E test uses gram-based amounts, so lower the minimum to 1g.
            await goldMinter.write.updateMinMintAmount([parseEther('1')], {
                account: parameterMultisig.account,
            });
            await goldMinter.write.updateMinRedeemAmount([parseEther('1')], {
                account: parameterMultisig.account,
            });
            await goldMinter.write.updateMinGoldFee([parseEther('0.01')], {
                account: parameterMultisig.account,
            });
            await goldMinter.write.updateMinGoldFeeAmount([parseEther('1')], {
                account: parameterMultisig.account,
            });
        });

        it('KYC setup → USDT approve → requestMint → auto-settle → receive OXAU', async function () {
            // 1. Set KYC level (executed by kycBackend)
            await goldMinter.write.setLevel([buyer.account.address, 2], {
                account: kycBackend.account,
            });

            // 2. USDT approve
            const mintUsdAmount = GOLD_PRICE_PER_GRAM_USD * 5n; // about 5g worth
            await usdt.write.approve([goldMinter.address, mintUsdAmount], { account: buyer.account });

            // 3. Calculate expected gold amount and fee
            const expectedGold = (await goldMinter.read.getGoldAmount([
                usdt.address,
                mintUsdAmount,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;
            const expectedNet = expectedGold - expectedFee;

            // 4. requestMint (autoSettle=true so immediate settlement)
            await goldMinter.write.requestMint([usdt.address, mintUsdAmount, expectedNet], {
                account: buyer.account,
            });

            // 5. Verify OXAU receipt
            const buyerGold = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(buyerGold).to.be.greaterThan(0);
            expect(Number(buyerGold)).to.be.closeTo(Number(expectedNet), 1000);

            // 6. Verify fee transferred to feeRecipient (deployer)
            const recipientGold = (await goldToken.read.balanceOf([deployer.account.address])) as bigint;
            expect(recipientGold).to.be.greaterThan(0);

            logger.debug('Mint', `Buyer received: ${Number(buyerGold) / 1e18} OXAU`);
            logger.debug('Mint', `Fee to recipient: ${Number(recipientGold) / 1e18} OXAU`);
        });
    });

    // ============================================================
    // 3. Redeem E2E test
    // ============================================================
    describe('3. Redeem E2E', function () {
        it('OXAU approve → requestBurn → settler settle → receive USDT', async function () {
            // 1. Check buyer's OXAU balance
            const buyerGold = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(buyerGold).to.be.greaterThan(0);

            // 2. Amount of gold to burn (half of holdings)
            const burnAmount = buyerGold / 2n;
            const burnFee = (await goldMinter.read.calculateGoldFee([burnAmount, false])) as bigint;
            const expectedUsd = (await goldMinter.read.getUsdAmount([
                usdt.address,
                burnAmount - burnFee,
            ])) as bigint;

            // 3. OXAU approve
            await goldToken.write.approve([goldMinter.address, burnAmount], { account: buyer.account });

            // 4. usdRecipient (settlerMultisig) approves USDT (required for Redeem settlement)
            await usdt.write.approve([goldMinter.address, maxUint256], {
                account: settlerMultisig.account,
            });

            // 5. Record Buyer USDT balance
            const buyerUsdBefore = (await usdt.read.balanceOf([buyer.account.address])) as bigint;

            // 6. requestBurn (autoSettle=true + canBurn=true → immediate settlement)
            await goldMinter.write.requestBurn([usdt.address, burnAmount, expectedUsd], {
                account: buyer.account,
            });

            // 7. Verify USDT receipt
            const buyerUsdAfter = (await usdt.read.balanceOf([buyer.account.address])) as bigint;
            const usdReceived = buyerUsdAfter - buyerUsdBefore;
            expect(usdReceived).to.be.greaterThan(0);

            // 8. Verify OXAU balance decreased
            const buyerGoldAfter = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(Number(buyerGoldAfter)).to.be.lessThan(Number(buyerGold));

            logger.debug('Redeem', `Burned: ${Number(burnAmount) / 1e18} OXAU`);
            logger.debug('Redeem', `Received: $${Number(usdReceived) / 1e6} USDT`);
        });
    });

    // ============================================================
    // 4. Manual Settle test (when autoSettle disabled)
    // ============================================================
    describe('4. Manual Settle (Settler Role)', function () {
        it('disable autoSettle → requestMint → settler calls settleMint', async function () {
            // 1. Disable autoSettle (executed by parameterMultisig — updateAutoSettle is a toggle)
            await goldMinter.write.updateAutoSettle([], {
                account: parameterMultisig.account,
            });

            // 2. Mint request
            const mintUsdAmount = GOLD_PRICE_PER_GRAM_USD * 2n;
            await usdt.write.approve([goldMinter.address, mintUsdAmount], { account: buyer.account });

            const expectedGold = (await goldMinter.read.getGoldAmount([
                usdt.address,
                mintUsdAmount,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;
            const expectedNet = expectedGold - expectedFee;

            const buyerGoldBefore = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;

            await goldMinter.write.requestMint([usdt.address, mintUsdAmount, expectedNet], {
                account: buyer.account,
            });

            // 3. Not yet settled — no balance change
            const buyerGoldPending = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(buyerGoldPending).to.equal(buyerGoldBefore);

            // 4. Settler manually settles (fetch last nonce via getUserMintNonces)
            const nonces = (await goldMinter.read.getUserMintNonces([
                buyer.account.address,
                0n,
                100n,
            ])) as bigint[];
            const lastMintNonce = nonces[nonces.length - 1];
            await goldMinter.write.settleMint([lastMintNonce], {
                account: settlerMultisig.account,
            });

            // 5. Verify OXAU receipt after settlement
            const buyerGoldAfter = (await goldToken.read.balanceOf([buyer.account.address])) as bigint;
            expect(Number(buyerGoldAfter)).to.be.greaterThan(Number(buyerGoldBefore));

            // 6. Restore autoSettle (toggle)
            await goldMinter.write.updateAutoSettle([], {
                account: parameterMultisig.account,
            });
        });
    });

    // ============================================================
    // 5. Emergency Pause / Unpause test
    // ============================================================
    describe('5. Emergency Pause / Unpause', function () {
        it('adminMultisig pauses → mint blocked → unpause → mint allowed', async function () {
            // 1. Emergency Pause (executed by adminMultisig)
            await goldMinter.write.emergencyPause([], { account: adminMultisig.account });
            expect(await goldMinter.read.paused()).to.be.true;

            // 2. Attempt requestMint while paused → revert
            const mintUsdAmount = GOLD_PRICE_PER_GRAM_USD * 2n; // above minimum amount (1g)
            await usdt.write.approve([goldMinter.address, mintUsdAmount], { account: buyer.account });

            const expectedGold = (await goldMinter.read.getGoldAmount([
                usdt.address,
                mintUsdAmount,
            ])) as bigint;
            const expectedFee = (await goldMinter.read.calculateGoldFee([expectedGold, true])) as bigint;

            await viem.assertions.revertWithCustomError(
                goldMinter.write.requestMint([usdt.address, mintUsdAmount, expectedGold - expectedFee], {
                    account: buyer.account,
                }),
                goldMinter,
                'EnforcedPause',
            );

            // 3. Emergency Unpause
            await goldMinter.write.emergencyUnpause([], { account: adminMultisig.account });
            expect(await goldMinter.read.paused()).to.be.false;

            // 4. requestMint succeeds after unpause
            await goldMinter.write.requestMint([usdt.address, mintUsdAmount, expectedGold - expectedFee], {
                account: buyer.account,
            });
        });
    });

    // ============================================================
    // 6. Access control test
    // ============================================================
    describe('6. Access control', function () {
        it('Deployer cannot execute emergencyPause', async function () {
            await viem.assertions.revertWithCustomError(
                goldMinter.write.emergencyPause([], { account: deployer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
            );
        });

        it('Buyer cannot execute settleMint', async function () {
            await viem.assertions.revertWithCustomError(
                goldMinter.write.settleMint([0n], { account: buyer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
            );
        });

        it('Deployer cannot change parameters', async function () {
            await viem.assertions.revertWithCustomError(
                goldMinter.write.updateMintSpread([100], { account: deployer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
            );
        });

        it('Deployer cannot set KYC level', async function () {
            await viem.assertions.revertWithCustomError(
                goldMinter.write.setLevel([buyer.account.address, 1], { account: deployer.account }),
                goldMinter,
                'AccessControlUnauthorizedAccount',
            );
        });

        it('parameterMultisig can change parameters', async function () {
            const currentSpread = await goldMinter.read.mintSpread();
            await goldMinter.write.updateMintSpread([100], { account: parameterMultisig.account });
            expect(await goldMinter.read.mintSpread()).to.equal(100);
            // Restore
            await goldMinter.write.updateMintSpread([currentSpread], { account: parameterMultisig.account });
        });
    });

    // ============================================================
    // 7. Final results output
    // ============================================================
    after(function () {
        console.log('\n');
        console.log('='.repeat(80));
        console.log('  E2E Full Test — Transaction records');
        console.log('='.repeat(80));

        console.log('\n| Phase | Step | TX Hash | Block |');
        console.log('| ----- | ---- | ------- | ----- |');
        for (const r of records) {
            console.log(`| ${r.phase} | ${r.step} | ${r.txHash.slice(0, 10)}... | ${r.blockNumber} |`);
        }
        console.log('\n' + '='.repeat(80));
    });
});
