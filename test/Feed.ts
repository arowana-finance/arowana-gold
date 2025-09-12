import { expect } from 'chai';
import hre from 'hardhat';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { getAddress, maxUint256, parseGwei, parseUnits, zeroHash } from 'viem';
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

// ---------------------------------------------------------------------------
// 1) DataFeed 단위 테스트(초기화/메타데이터/라운드조회 기본)
// ---------------------------------------------------------------------------
describe('DataFeed', () => {
    async function fixture() {
        const { owner } = await getClients();
        const { description } = fixtureData;

        const feed = await hre.viem.deployContract('DataFeed');

        await feed.write.initializeFeed([owner.account.address, owner.account.address, description], {
            account: owner.account,
        });

        return { owner, feed };
    }

    it('초기화/메타데이터 setter 동작', async () => {
        const { owner, feed } = await loadFixture(fixture);
        const { version, description, updateDescription } = fixtureData;

        // 초기 description/asset 확인
        expect(await feed.read.description()).to.equal(description);
        expect(await feed.read.asset()).to.equal(getAddress(owner.account.address));
        expect(await feed.read.version()).to.equal(6n);
        expect(await feed.read.decimals()).to.equal(8);

        // owner로 메타데이터 변경
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

    it('라운드 조회 포맷(getRoundData/latestRoundData) 기본값', async () => {
        const { feed } = await loadFixture(fixture);

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
});

describe('AGTReserveFeed', () => {
    async function fixture() {
        const { owner, routerEOA } = await getClients();
        const { upkeepInterval, upkeepRateInterval, upkeepRateCap, maxBaseGasPrice, updateInterval } =
            fixtureData;

        const reserveFeed = await hre.viem.deployContract('AGTReserveFeed');

        await reserveFeed.write.initializeAGTReserveFeed(
            [
                owner.account.address, // 오너(WithSettler 초기화)
                owner.account.address, // asset(임시로 owner 주소 사용)
                'RESERVE / USD',
                routerEOA.account.address, // router: EOA 주소(콜백 시 msg.sender 일치용)
                owner.account.address, // upkeepContract: 임시로 owner
                upkeepInterval,
                upkeepRateInterval,
                upkeepRateCap,
                parseGwei(String(maxBaseGasPrice)),
                updateInterval,
            ],
            { account: owner.account },
        );

        return { owner, routerEOA, reserveFeed };
    }

    it('handleOracleFulfillment → handleResponse: (answer,timestamp) 페어 반영', async () => {
        const { reserveFeed, routerEOA } = await loadFixture(fixture);

        expect(await reserveFeed.read.latestRound()).to.equal(0n);
        expect(await reserveFeed.read.latestAnswer()).to.equal(0n);
        expect(await reserveFeed.read.latestTimestamp()).to.equal(0n);

        const updateTime = BigInt(await getTimestamp()) + 5n;
        const updateAnswer = 123_456n; // uint64 범위 값 (임의의 준비금/가격)

        const payload = encodeAnswerTimestampPairs([{ answer: updateAnswer, timeStamp: updateTime }]);

        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });

        expect(await reserveFeed.read.latestRound()).to.equal(1n);
        expect(await reserveFeed.read.latestAnswer()).to.equal(updateAnswer);
        expect(await reserveFeed.read.latestTimestamp()).to.equal(updateTime);
        expect(await reserveFeed.read.getTimestampAnswer([updateTime])).to.equal(updateAnswer);

        // 동일 페어를 다시 보내면(중복) latestRound 증가/변화가 없어야 함
        const lrBefore = await reserveFeed.read.latestRound();
        await reserveFeed.write.handleOracleFulfillment([zeroHash, payload, '0x'], {
            account: routerEOA.account,
        });
        expect(await reserveFeed.read.latestRound()).to.equal(lrBefore); // 변동 없
    });

    it('여러 (answer,timestamp) 페어를 한 번에 반영(오래된→최신 순서)', async () => {
        const { reserveFeed, routerEOA } = await loadFixture(fixture);

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

        // 중간 타임스탬프들도 각각 기록되었는지 확인
        for (const { answer, timeStamp } of pairs) {
            expect(await reserveFeed.read.getTimestampAnswer([timeStamp])).to.equal(answer);
        }
    });
});

// ---------------------------------------------------------------------------
// 3) AGTPriceFeed: 원격 체인 메타데이터 저장 + ReserveFeed 초기화 경로 재사용
// ---------------------------------------------------------------------------
describe('AGTPriceFeed', () => {
    async function fixture() {
        const { owner, routerEOA } = await getClients();
        const { upkeepInterval, upkeepRateInterval, upkeepRateCap, maxBaseGasPrice, updateInterval } =
            fixtureData;

        const priceFeed = await hre.viem.deployContract('AGTPriceFeed');

        await priceFeed.write.initializeAGTPriceFeed(
            [
                owner.account.address,
                owner.account.address,
                'PRICE / USD (mirror)',
                42161n, // remoteChain (예: Arbitrum 메인넷 chainId)
                owner.account.address, // remoteChainOracle (임의)
                routerEOA.account.address, // router(EOA) – 콜백 보낼 주체
                owner.account.address, // upkeepContract (임의)
                upkeepInterval,
                upkeepRateInterval,
                upkeepRateCap,
                parseGwei(String(maxBaseGasPrice)),
                updateInterval,
            ],
            { account: owner.account },
        );

        return { owner, routerEOA, priceFeed };
    }

    it('원격 체인 메타데이터/기본 상태', async () => {
        const { priceFeed, owner } = await loadFixture(fixture);

        expect(await priceFeed.read.remoteChain()).to.equal(42161n);
        expect(await priceFeed.read.remoteChainOracle()).to.equal(getAddress(owner.account.address));
        expect(await priceFeed.read.description()).to.equal('PRICE / USD (mirror)');
    });

    it('Functions 콜백 경로(AGTReserveFeed 동일 로직 상속)로 값 반영', async () => {
        const { priceFeed, routerEOA } = await loadFixture(fixture);

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
});

describe('DataFeedAggregator', () => {
    async function fixture() {
        const { owner } = await getClients();
        const { aggregatorDescription } = fixtureData;

        const feed = await hre.viem.deployContract('DataFeed');
        await feed.write.initializeFeed(
            [owner.account.address, owner.account.address, aggregatorDescription],
            { account: owner.account },
        );

        // Aggregator 배포/초기화(초기 aggregator로 feed 주소 등록)
        const agg = await hre.viem.deployContract('DataFeedAggregator');
        await agg.write.initialize([owner.account.address, feed.address], {
            account: owner.account,
        });

        return { owner, feed, agg };
    }

    it('프록시가 decimals/description/version 등을 위임 조회', async () => {
        const { feed, agg } = await loadFixture(fixture);
        const { aggregatorDescription } = fixtureData;

        // feed 쪽의 기본값들
        expect(await feed.read.decimals()).to.equal(8);
        expect(await feed.read.description()).to.equal(aggregatorDescription);
        expect(await feed.read.version()).to.equal(6n);

        // agg(프록시) 경유 조회가 동일해야 함
        expect(await agg.read.decimals()).to.equal(8);
        expect(await agg.read.description()).to.equal(aggregatorDescription);
        expect(await agg.read.version()).to.equal(6n);
    });

    it('asset()/deploymentTimestamp/latest* 등도 위임 조회', async () => {
        const { owner, feed, agg } = await loadFixture(fixture);

        expect(await agg.read.asset()).to.equal(getAddress(owner.account.address));
        const dep = await feed.read.deploymentTimestamp();
        expect(await agg.read.deploymentTimestamp()).to.equal(dep);

        // 아직 업데이트가 없으므로 0
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

    it('새로운 aggregator 제안/확정 → 페이즈 전환', async () => {
        const { owner, agg } = await loadFixture(fixture);
        const { updateAggregatorDescription } = fixtureData;

        const feed2 = await hre.viem.deployContract('DataFeed');
        await feed2.write.initializeFeed(
            [owner.account.address, owner.account.address, updateAggregatorDescription],
            { account: owner.account },
        );

        await agg.write.proposeAggregator([feed2.address], {
            account: owner.account,
        });

        expect(await agg.read.description()).to.equal(updateAggregatorDescription);
    });
});
