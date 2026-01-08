/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { zeroAddress, getAddress, encodeFunctionData } from 'viem';
import { getClients } from './helpers.js';

const BLACKLIST_NAME = 'Blacklist Oracle';

describe('BlacklistOracle', function () {
    const fixture = async () => {
        const { owner, buyer: user1, bob: user2, routerEOA: user3, viem } = await getClients();

        const blacklistOracleImplementation = await viem.deployContract('BlacklistOracle', []);
        const blacklistOracleProxy = await viem.deployContract('InitializableProxy', []);

        const blacklistOracleInitData = encodeFunctionData({
            abi: blacklistOracleImplementation.abi,
            functionName: 'initializeOracle',
            args: [BLACKLIST_NAME, owner.account.address],
        });

        await blacklistOracleProxy.write.initializeProxy(
            [
                BLACKLIST_NAME,
                owner.account!.address,
                blacklistOracleImplementation.address,
                blacklistOracleInitData,
            ],
            { account: owner.account },
        );

        const blacklistOracle = await viem.getContractAt('BlacklistOracle', blacklistOracleProxy.address);

        return { owner, user1, user2, user3, blacklistOracle, viem };
    };

    describe('Deployment and Initialization', function () {
        it('Should initialize with correct name and owner', async function () {
            const { blacklistOracle, owner } = await fixture();
            expect(await blacklistOracle.read.name()).to.equal(BLACKLIST_NAME);
            expect(await blacklistOracle.read.owner()).to.equal(getAddress(owner.account.address));
        });

        it('Should emit BlacklistInitialized event', async function () {
            const { owner, viem } = await fixture();

            const newBlacklistOracleImplementation = await viem.deployContract('BlacklistOracle', []);
            const newBlacklistOracleProxy = await viem.deployContract('InitializableProxy', []);

            const blacklistOracleInitData = encodeFunctionData({
                abi: newBlacklistOracleImplementation.abi,
                functionName: 'initializeOracle',
                args: ['Blacklist Oracle', owner.account.address],
            });

            await newBlacklistOracleProxy.write.initializeProxy(
                [
                    'Blacklist Oracle',
                    owner.account!.address,
                    newBlacklistOracleImplementation.address,
                    blacklistOracleInitData,
                ],
                { account: owner.account },
            );

            const newBlacklistOracle = await viem.getContractAt(
                'BlacklistOracle',
                newBlacklistOracleProxy.address,
            );

            const events = (await newBlacklistOracle.getEvents.BlacklistInitialized()) as any[];

            expect(events).to.have.lengthOf(1);
            expect(events[0].args._name).to.equal(BLACKLIST_NAME);
        });

        it('Should not allow re-initialization', async function () {
            const { owner, viem, blacklistOracle } = await fixture();
            await viem.assertions.revertWithCustomError(
                blacklistOracle.write.initializeOracle([BLACKLIST_NAME, owner.account.address]),
                blacklistOracle,
                'InvalidInitialization',
            );
        });
    });

    describe('Access Control', function () {
        it('Should only allow owner to add blacklist', async function () {
            const { user1, viem, blacklistOracle } = await fixture();
            await viem.assertions.revertWithCustomError(
                blacklistOracle.write.addBlacklist([[user1.account.address]], { account: user1.account }),
                blacklistOracle,
                'OwnableUnauthorizedAccount',
            );
        });

        it('Should only allow owner to remove blacklist', async function () {
            const { user1, viem, blacklistOracle } = await fixture();
            await viem.assertions.revertWithCustomError(
                blacklistOracle.write.removeBlacklist([[user1.account.address]], { account: user1.account }),
                blacklistOracle,
                'OwnableUnauthorizedAccount',
            );
        });
    });

    describe('Blacklist Management', async function () {
        const { owner, user1, user2, user3, blacklistOracle, viem } = await fixture();
        // Add some addresses to blacklist
        await blacklistOracle.write.addBlacklist([[user1.account.address, user2.account.address]]);

        it('Should add addresses to blacklist', async function () {
            expect(await blacklistOracle.read.isBlacklisted([user1.account.address])).to.be.true;
            expect(await blacklistOracle.read.isBlacklisted([user2.account.address])).to.be.true;
            expect(await blacklistOracle.read.isBlacklisted([user3.account.address])).to.be.false;
        });

        it('Should emit BlacklistAdded event', async function () {
            await blacklistOracle.write.addBlacklist([[user3.account.address]]);

            const events = (await blacklistOracle.getEvents.BlacklistAdded()) as any[];
            expect(events[events.length - 1].args.addrs).to.deep.equal([getAddress(user3.account.address)]);
        });

        it('Should revert when adding duplicate addresses', async function () {
            await viem.assertions.revertWithCustomError(
                blacklistOracle.write.addBlacklist([[user1.account.address]]),
                blacklistOracle,
                'InvalidAddress',
            );
        });

        it('Should remove addresses from blacklist', async function () {
            await blacklistOracle.write.removeBlacklist([[user1.account.address]]);

            expect(await blacklistOracle.read.isBlacklisted([user1.account.address])).to.be.false;
            expect(await blacklistOracle.read.isBlacklisted([user2.account.address])).to.be.true;
        });

        it('Should emit BlacklistRemoved event', async function () {
            await blacklistOracle.write.removeBlacklist([[user1.account.address]]);

            const events = (await blacklistOracle.getEvents.BlacklistRemoved()) as any[];
            expect(events[events.length - 1].args.addrs).to.deep.equal([getAddress(user1.account.address)]);
        });

        it('Should revert when removing non-existent addresses', async function () {
            await viem.assertions.revertWithCustomError(
                blacklistOracle.write.removeBlacklist([[user3.account.address]]),
                blacklistOracle,
                'InvalidAddress',
            );
        });

        it('Should handle batch operations correctly', async function () {
            const batchAddresses = [user3.account.address, owner.account.address];
            await blacklistOracle.write.addBlacklist([batchAddresses]);

            for (const addr of batchAddresses) {
                expect(await blacklistOracle.read.isBlacklisted([addr])).to.be.true;
            }

            await blacklistOracle.write.removeBlacklist([batchAddresses]);

            for (const addr of batchAddresses) {
                expect(await blacklistOracle.read.isBlacklisted([addr])).to.be.false;
            }
        });
    });

    describe('Blacklist Queries', async function () {
        const { owner, user1, user2, user3, blacklistOracle } = await fixture();
        await blacklistOracle.write.addBlacklist([
            [user1.account.address, user2.account.address, user3.account.address],
        ]);

        it('Should check single address correctly', async function () {
            expect(await blacklistOracle.read.isBlacklisted([user1.account.address])).to.be.true;
            expect(await blacklistOracle.read.isBlacklisted([owner.account.address])).to.be.false;
        });

        it('Should check multiple addresses correctly - all clean', async function () {
            const result = (await blacklistOracle.read.areBlacklisted([
                [owner.account.address, zeroAddress],
            ])) as any[];

            expect(result[0]).to.be.false; // no blacklisted addresses
            expect(result[1]).to.equal(2n); // checked 2 addresses
        });

        it('Should check multiple addresses correctly - with blacklisted', async function () {
            const result = (await blacklistOracle.read.areBlacklisted([
                [owner.account.address, user1.account.address, user3.account.address],
            ])) as any[];

            expect(result[0]).to.be.true; // found blacklisted address
            expect(result[1]).to.equal(1n); // index of first blacklisted address (user1)
        });

        it('Should return correct blacklist count', async function () {
            expect(await blacklistOracle.read.getBlacklistCount()).to.equal(3n);

            await blacklistOracle.write.removeBlacklist([[user1.account.address]]);
            expect(await blacklistOracle.read.getBlacklistCount()).to.equal(2n);
        });

        it('Should return blacklist pagination correctly', async function () {
            const fullList = (await blacklistOracle.read.getBlacklist([0n, 3n])) as any[];
            expect(fullList).to.have.lengthOf(3);

            const partialList = (await blacklistOracle.read.getBlacklist([1n, 3n])) as any[];
            expect(partialList).to.have.lengthOf(2);
            expect(partialList[0]).to.equal(fullList[1]);
            expect(partialList[1]).to.equal(fullList[2]);
        });

        it('Should handle empty blacklist correctly', async function () {
            await blacklistOracle.write.removeBlacklist([
                [user1.account.address, user2.account.address, user3.account.address],
            ]);

            expect(await blacklistOracle.read.getBlacklistCount()).to.equal(0n);
            expect(await blacklistOracle.read.isBlacklisted([user1.account.address])).to.be.false;

            const result = (await blacklistOracle.read.areBlacklisted([[user1.account.address]])) as any[];
            expect(result[0]).to.be.false;
            expect(result[1]).to.equal(1n);
        });
    });

    describe('Edge Cases and Security', function () {
        it('Should handle zero address correctly', async function () {
            const { blacklistOracle } = await fixture();

            await blacklistOracle.write.addBlacklist([[zeroAddress]]);
            expect(await blacklistOracle.read.isBlacklisted([zeroAddress])).to.be.true;
        });

        it('Should handle empty array inputs', async function () {
            const { blacklistOracle } = await fixture();

            await blacklistOracle.write.addBlacklist([[]]);
            await blacklistOracle.write.removeBlacklist([[]]);
            // Should not revert and maintain current state
            expect(await blacklistOracle.read.getBlacklistCount()).to.equal(0n);
        });

        it('Should handle large batch operations', async function () {
            const { blacklistOracle } = await fixture();

            const addresses: `0x${string}`[] = [];
            for (let i = 0; i < 50; i++) {
                addresses.push(`0x${i.toString(16).padStart(40, '0')}` as `0x${string}`);
            }

            await blacklistOracle.write.addBlacklist([addresses]);
            expect(await blacklistOracle.read.getBlacklistCount()).to.equal(50n);

            // Test batch removal
            const halfAddresses = addresses.slice(0, 25);
            await blacklistOracle.write.removeBlacklist([halfAddresses]);
            expect(await blacklistOracle.read.getBlacklistCount()).to.equal(25n);
        });

        it('Should maintain consistent state after multiple operations', async function () {
            const { user1, user2, blacklistOracle } = await fixture();
            // Add addresses
            await blacklistOracle.write.addBlacklist([[user1.account.address]]);
            await blacklistOracle.write.addBlacklist([[user2.account.address]]);

            // Remove one
            await blacklistOracle.write.removeBlacklist([[user1.account.address]]);

            // Add back
            await blacklistOracle.write.addBlacklist([[user1.account.address]]);

            expect(await blacklistOracle.read.getBlacklistCount()).to.equal(2n);
            expect(await blacklistOracle.read.isBlacklisted([user1.account.address])).to.be.true;
            expect(await blacklistOracle.read.isBlacklisted([user2.account.address])).to.be.true;
        });
    });
});
