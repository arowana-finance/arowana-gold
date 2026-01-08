import { expect } from 'chai';
import { encodeFunctionData, getAddress, parseGwei, zeroHash } from 'viem';
import { encodeAnswerTimestampPairs, getClients, getTimestamp } from './helpers.js';

type LatestRoundData = [bigint, bigint, bigint, bigint, bigint];

const fixtureData = {
    version: 100,
    description: 'TEST / USD',
    updateDescription: 'AGT / USD',
    aggregatorDescription: 'AGG / USD',
    updateAggregatorDescription: 'AGG2 / USD',
    upkeepInterval: 5,
    upkeepRateInterval: 60,
    upkeepRateCap: 10,
    maxBaseGasPrice: 1,
    updateInterval: 3,
};

describe('DataFeed', () => {
    async function fixture() {
        const { owner, viem } = await getClients();
        const { description } = fixtureData;

        const feedImpl = await viem.deployContract('DataFeed');
        const feedProxy = await viem.deployContract('InitializableProxy', []);

        const feedInitData = encodeFunctionData({
            abi: feedImpl.abi,
            functionName: 'initializeFeed',
            args: [owner.account.address, owner.account.address, description],
        });

        await feedProxy.write.initializeProxy(
            ['DataFeed', owner.account.address, feedImpl.address, feedInitData],
            { account: owner.account },
        );

        const feed = await viem.getContractAt('DataFeed', feedProxy.address);

        return { owner, feed, viem };
    }

    it('initialization/metadata setter works', async () => {
        const { owner, feed } = await fixture();
        const { version, description, updateDescription } = fixtureData;

        // Check initial description/asset
        expect(await feed.read.description()).to.equal(description);
        expect(await feed.read.asset()).to.equal(getAddress(owner.account.address));
        expect(await feed.read.version()).to.equal(6n);
        expect(await feed.read.decimals()).to.equal(8);

        // Change metadata as the owner
        await feed.write.setDescription([updateDescription], {
            account: owner.account,
        });
        await feed.write.setAsset([owner.account.address], {
            account: owner.account,
        });
        await feed.write.setVersion([version], { account: owner.account });

        expect(await feed.read.description()).to.equal(updateDescription);
        expect(await feed.read.asset()).to.equal(getAddress(owner.account.address));
        expect(await feed.read.version()).to.equal(BigInt(version));
    });

    it('round query format (getRoundData/latestRoundData) default values', async () => {
        const { feed } = await fixture();

        const lr = await feed.read.latestRound();
        expect(lr).to.equal(0n);

        const [roundId, answer, startedAt, updatedAt, answeredInRound] =
            (await feed.read.latestRoundData()) as LatestRoundData;

        expect(roundId).to.equal(0n);
        expect(answer).to.equal(0n);
        expect(updatedAt).to.equal(0n);
        expect(answeredInRound).to.equal(0n);

        const dep = await feed.read.deploymentTimestamp();
        expect(startedAt).to.equal(dep);
    });

    it('onlyOwner: setters revert if caller is not the owner', async () => {
        const { feed, viem } = await fixture();
        const [, attacker] = await viem.getWalletClients();

        await viem.assertions.revertWithCustomErrorWithArgs(
            feed.write.setDescription(['HACK'], { account: attacker.account }),
            feed,
            'OwnableUnauthorizedAccount',
            [getAddress(attacker.account.address)],
        );
        await viem.assertions.revertWithCustomErrorWithArgs(
            feed.write.setAsset([attacker.account.address], {
                account: attacker.account,
            }),
            feed,
            'OwnableUnauthorizedAccount',
            [getAddress(attacker.account.address)],
        );
        await viem.assertions.revertWithCustomErrorWithArgs(
            feed.write.setVersion([999], { account: attacker.account }),
            feed,
            'OwnableUnauthorizedAccount',
            [getAddress(attacker.account.address)],
        );
    });
});

describe('AGTReserveFeed', () => {
    async function fixture() {
        const { owner, routerEOA, viem } = await getClients();
        const { upkeepInterval, upkeepRateInterval, upkeepRateCap, maxBaseGasPrice, updateInterval } =
            fixtureData;

        const reserveFeed = await viem.deployContract('AGTReserveFeed');

        await reserveFeed.write.initializeAGTReserveFeed(
            [
                owner.account.address, // Owner (initialize WithSettler)
                owner.account.address, // Asset (temporarily use the owner address)
                'RESERVE / USD',
                routerEOA.account.address, // Router: EOA address (to match msg.sender during callback)
                owner.account.address, // UpkeepContract: temporarily set as owner
                upkeepInterval,
                upkeepRateInterval,
                upkeepRateCap,
                parseGwei(String(maxBaseGasPrice)),
                updateInterval,
            ],
            { account: owner.account },
        );

        return { owner, routerEOA, reserveFeed, viem };
    }

    it('handleOracleFulfillment → handleResponse: reflects (answer,timestamp) pair', async () => {
        const { reserveFeed, routerEOA } = await fixture();

        expect(await reserveFeed.read.latestRound()).to.equal(0n);
        expect(await reserveFeed.read.latestAnswer()).to.equal(0n);
        expect(await reserveFeed.read.latestTimestamp()).to.equal(0n);

        const updateTime = BigInt(await getTimestamp()) + 5n;
        const updateAnswer = 123_456n; // uint64 range values (arbitrary reserve/price)

        const payload = encodeAnswerTimestampPairs([{ answer: updateAnswer, timeStamp: updateTime }]);

        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });

        expect(await reserveFeed.read.latestRound()).to.equal(1n);
        expect(await reserveFeed.read.latestAnswer()).to.equal(updateAnswer);
        expect(await reserveFeed.read.latestTimestamp()).to.equal(updateTime);
        expect(await reserveFeed.read.getTimestampAnswer([updateTime])).to.equal(updateAnswer);

        // When sending the same pair again (duplicate), latestRound should not increase/change
        const lrBefore = await reserveFeed.read.latestRound();
        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });
        expect(await reserveFeed.read.latestRound()).to.equal(lrBefore); // No change
    });

    it('reflects multiple (answer,timestamp) pairs at once (oldest → latest order)', async () => {
        const { reserveFeed, routerEOA } = await fixture();

        const base = BigInt(await getTimestamp()) + 10n;
        const pairs = [
            { answer: 100n, timeStamp: base + 1n },
            { answer: 200n, timeStamp: base + 2n },
            { answer: 300n, timeStamp: base + 3n },
        ];
        const payload = encodeAnswerTimestampPairs(pairs);

        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });

        expect(await reserveFeed.read.latestRound()).to.equal(3n);
        expect(await reserveFeed.read.latestAnswer()).to.equal(300n);
        expect(await reserveFeed.read.latestTimestamp()).to.equal(base + 3n);

        // Verify that intermediate timestamps are each recorded
        for (const { answer, timeStamp } of pairs) {
            expect(await reserveFeed.read.getTimestampAnswer([timeStamp])).to.equal(answer);
        }
    });

    it('handleOracleFulfillment: rejects non-router callers', async () => {
        const { reserveFeed, viem } = await fixture();

        const [, attacker] = await viem.getWalletClients();
        const time = BigInt(await getTimestamp()) + 5n;
        const payload = encodeAnswerTimestampPairs([{ answer: 123n, timeStamp: time }]);

        await viem.assertions.revertWithCustomError(
            reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
                account: attacker.account,
            }),
            reserveFeed,
            'OnlyRouterCanFulfill',
        );
    });

    it('among multiple pairs, past/duplicate timestamps are ignored and only the latest is reflected', async () => {
        const { reserveFeed, routerEOA } = await fixture();

        const base = BigInt(await getTimestamp()) + 10n;
        const pairs = [
            { answer: 111n, timeStamp: base + 1n },
            { answer: 222n, timeStamp: base + 2n },
            { answer: 111n, timeStamp: base + 1n }, // Duplicate
            { answer: 50n, timeStamp: base + 0n }, // Past values (ignored)
            { answer: 333n, timeStamp: base + 3n },
        ];
        const payload = encodeAnswerTimestampPairs(pairs);

        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });

        expect(await reserveFeed.read.latestRound()).to.equal(3n);
        expect(await reserveFeed.read.latestAnswer()).to.equal(333n);
        expect(await reserveFeed.read.latestTimestamp()).to.equal(base + 3n);

        expect(await reserveFeed.read.getTimestampAnswer([base + 1n])).to.equal(111n);
        expect(await reserveFeed.read.getTimestampAnswer([base + 2n])).to.equal(222n);
        expect(await reserveFeed.read.getTimestampAnswer([base + 3n])).to.equal(333n);
    });

    it('replay attack prevention: resending the same payload leaves state unchanged', async () => {
        const { reserveFeed, routerEOA } = await (async () => {
            const { owner, routerEOA, viem } = await getClients();
            const reserveFeed = await viem.deployContract('AGTReserveFeed');
            await reserveFeed.write.initializeAGTReserveFeed(
                [
                    owner.account.address,
                    owner.account.address,
                    'RESERVE / USD',
                    routerEOA.account.address,
                    owner.account.address,
                    5,
                    60,
                    10,
                    parseGwei('1'),
                    3,
                ],
                { account: owner.account },
            );
            return { reserveFeed, routerEOA };
        })();

        const time = BigInt(await getTimestamp()) + 15n;
        const payload = encodeAnswerTimestampPairs([{ answer: 777n, timeStamp: time }]);

        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });
        const before = {
            round: await reserveFeed.read.latestRound(),
            ts: await reserveFeed.read.latestTimestamp(),
            ans: await reserveFeed.read.latestAnswer(),
        };
        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });

        expect(await reserveFeed.read.latestRound()).to.equal(before.round);
        expect(await reserveFeed.read.latestTimestamp()).to.equal(before.ts);
        expect(await reserveFeed.read.latestAnswer()).to.equal(before.ans);
    });
});

describe('AGTPriceFeed', () => {
    async function fixture() {
        const { owner, routerEOA, viem } = await getClients();
        const { upkeepInterval, upkeepRateInterval, upkeepRateCap, maxBaseGasPrice, updateInterval } =
            fixtureData;

        const priceFeedImplementation = await viem.deployContract('AGTPriceFeed');
        const priceFeedProxy = await viem.deployContract('InitializableProxy', []);

        const initData = encodeFunctionData({
            abi: priceFeedImplementation.abi,
            functionName: 'initializeAGTPriceFeed',
            args: [
                {
                    initOwner: owner.account.address,
                    asset: owner.account.address,
                    description: 'PRICE / USD (mirror)',
                    remoteChain: 42161n, // remoteChain (e.g., Arbitrum mainnet chainId)
                    remoteChainOracle: owner.account.address, // remoteChainOracle (arbitrary)
                    router: routerEOA.account.address, // Router (EOA) – the entity sending the callback
                    upkeepContract: owner.account.address, // UpkeepContract (arbitrary)
                    upkeepInterval: upkeepInterval,
                    upkeepRateInterval: upkeepRateInterval,
                    upkeepRateCap: upkeepRateCap,
                    maxBaseGasPrice: parseGwei(String(maxBaseGasPrice)),
                    updateInterval: updateInterval,
                },
            ],
        });

        await priceFeedProxy.write.initializeProxy(
            [`AGT Price Feed`, owner.account!.address, priceFeedImplementation.address, initData],
            { account: owner.account },
        );

        const priceFeed = await viem.getContractAt('AGTPriceFeed', priceFeedProxy.address);

        return { owner, routerEOA, priceFeed, viem };
    }

    it('remote chain metadata/default state', async () => {
        const { priceFeed, owner } = await fixture();

        expect(await priceFeed.read.remoteChain()).to.equal(42161n);
        expect(await priceFeed.read.remoteChainOracle()).to.equal(getAddress(owner.account.address));
        expect(await priceFeed.read.description()).to.equal('PRICE / USD (mirror)');
    });

    it('Functions callback path (AGTReserveFeed inherited logic) reflects values', async () => {
        const { priceFeed, routerEOA } = await fixture();

        const timeStamp = BigInt(await getTimestamp()) + 20n;
        const answer = 999_999n;

        const payload = encodeAnswerTimestampPairs([{ answer: answer, timeStamp: timeStamp }]);

        await priceFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });

        expect(await priceFeed.read.latestAnswer()).to.equal(answer);
        expect(await priceFeed.read.latestTimestamp()).to.equal(timeStamp);
        expect(await priceFeed.read.latestRound()).to.equal(1n);
    });

    it('only router can trigger callback (rejects non-router)', async () => {
        const { priceFeed, viem } = await fixture();

        const [, attacker] = await viem.getWalletClients();
        const time = BigInt(await getTimestamp()) + 1n;
        const payload = encodeAnswerTimestampPairs([{ answer: 1_000_000n, timeStamp: time }]);

        await viem.assertions.revertWithCustomError(
            priceFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
                account: attacker.account,
            }),
            priceFeed,
            'OnlyRouterCanFulfill',
        );
    });
});

describe('DataFeedAggregator', () => {
    async function fixture() {
        const { owner, viem } = await getClients();
        const { aggregatorDescription } = fixtureData;

        const feed = await viem.deployContract('DataFeed');
        await feed.write.initializeFeed(
            [owner.account.address, owner.account.address, aggregatorDescription],
            { account: owner.account },
        );

        // Deploy/initialize Aggregator (register feed address as the initial aggregator)
        const agg = await viem.deployContract('DataFeedAggregator');
        await agg.write.initialize([owner.account.address, feed.address], {
            account: owner.account,
        });

        return { owner, feed, agg, viem };
    }

    it('proxy delegates decimals/description/version queries', async () => {
        const { feed, agg } = await fixture();
        const { aggregatorDescription } = fixtureData;

        // Default values on the feed side
        expect(await feed.read.decimals()).to.equal(8);
        expect(await feed.read.description()).to.equal(aggregatorDescription);
        expect(await feed.read.version()).to.equal(6n);

        // Queries through agg (proxy) should be the same
        expect(await agg.read.decimals()).to.equal(8);
        expect(await agg.read.description()).to.equal(aggregatorDescription);
        expect(await agg.read.version()).to.equal(6n);
    });

    it('asset()/deploymentTimestamp/latest* are also delegated', async () => {
        const { owner, feed, agg } = await fixture();

        expect(await agg.read.asset()).to.equal(getAddress(owner.account.address));
        const dep = await feed.read.deploymentTimestamp();
        expect(await agg.read.deploymentTimestamp()).to.equal(dep);

        // Since no updates yet, should be 0
        expect(await agg.read.latestRound()).to.equal(0n);
        expect(await agg.read.latestTimestamp()).to.equal(0n);
        expect(await agg.read.latestAnswer()).to.equal(0n);

        const [rid, ans, startedAt, updatedAt, air] = (await agg.read.latestRoundData()) as LatestRoundData;

        expect(rid).to.equal(0n);
        expect(ans).to.equal(0n);
        expect(updatedAt).to.equal(0n);
        expect(air).to.equal(0n);
        expect(startedAt).to.equal(dep);
    });

    it('new aggregator proposal/confirmation → phase transition', async () => {
        const { owner, agg, viem } = await fixture();
        const { updateAggregatorDescription } = fixtureData;

        const feed2 = await viem.deployContract('DataFeed');
        await feed2.write.initializeFeed(
            [owner.account.address, owner.account.address, updateAggregatorDescription],
            { account: owner.account },
        );

        await agg.write.proposeAggregator([feed2.address], {
            account: owner.account,
        });

        expect(await agg.read.description()).to.equal(updateAggregatorDescription);
    });

    it('onlyOwner: only owner can propose a new aggregator', async () => {
        const { owner, agg, viem } = await fixture();

        const [, attacker] = await viem.getWalletClients();
        const newFeed = await viem.deployContract('DataFeed');
        await newFeed.write.initializeFeed([owner.account.address, owner.account.address, 'AGG2 / USD'], {
            account: owner.account,
        });

        await viem.assertions.revertWithCustomErrorWithArgs(
            agg.write.proposeAggregator([newFeed.address], {
                account: attacker.account,
            }),
            agg,
            'OwnableUnauthorizedAccount',
            [getAddress(attacker.account.address)],
        );
    });

    it('after aggregator replacement, decimals/description delegation remains consistent', async () => {
        const { owner, feed, agg } = await fixture();
        const { aggregatorDescription } = fixtureData;

        await agg.write.proposeAggregator([feed.address], {
            account: owner.account,
        });

        expect(await agg.read.decimals()).to.equal(8);
        expect(await agg.read.description()).to.equal(aggregatorDescription);
        expect(await agg.read.version()).to.equal(6n);
    });
});
