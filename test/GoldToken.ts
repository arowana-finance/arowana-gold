/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { parseEther, zeroAddress, getAddress, maxUint256, encodeFunctionData } from 'viem';
import { getClients, signPermitERC2612 } from './helpers.js';

const TOKEN_NAME = 'Arowana Gold Token';
const TOKEN_SYMBOL = 'AGT';
const TOKEN_DECIMALS = 18;

describe('GoldToken', function () {
    const fixture = async () => {
        const { owner, buyer: user1, bob: user2, routerEOA: user3, viem } = await getClients();

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

        return { owner, user1, user2, user3, blacklistOracle, goldToken, viem };
    };

    describe('Deployment and Initialization', function () {
        it('Should initialize with correct parameters', async function () {
            const { owner, goldToken } = await fixture();

            expect(await goldToken.read.name()).to.equal(TOKEN_NAME);
            expect(await goldToken.read.symbol()).to.equal(TOKEN_SYMBOL);
            expect(await goldToken.read.decimals()).to.equal(TOKEN_DECIMALS);
            expect(await goldToken.read.totalSupply()).to.equal(0n);
            expect(await goldToken.read.owner()).to.equal(getAddress(owner.account.address));
        });

        it('Should set blacklist oracle correctly', async function () {
            const { blacklistOracle, goldToken } = await fixture();
            expect(await goldToken.read.blacklistOracle()).to.equal(getAddress(blacklistOracle.address));
        });

        it('Should add deployer as initial minter', async function () {
            const { owner, goldToken } = await fixture();
            const minters = await goldToken.read.minters();
            expect(minters).to.include(getAddress(owner.account.address));
        });
    });

    describe('Minter Management', function () {
        it('Should allow owner to add minters', async function () {
            const { user1, goldToken } = await fixture();

            await goldToken.write.addMinter([user1.account.address]);

            const minters = await goldToken.read.minters();
            expect(minters).to.include(getAddress(user1.account.address));
        });

        it('Should emit AddMinter event', async function () {
            const { user1, goldToken } = await fixture();

            await goldToken.write.addMinter([user1.account.address]);

            const events = (await goldToken.getEvents.AddMinter()) as any[];
            expect(events[events.length - 1].args.newMinter).to.equal(getAddress(user1.account.address));
        });

        it('Should not allow duplicate minters', async function () {
            const { owner, goldToken, viem } = await fixture();

            await viem.assertions.revertWithCustomError(
                goldToken.write.addMinter([owner.account.address]),
                goldToken,
                'DuplicateMinter',
            );
        });

        it('Should allow owner to remove minters', async function () {
            const { user1, goldToken } = await fixture();

            await goldToken.write.addMinter([user1.account.address]);
            await goldToken.write.removeMinter([user1.account.address]);

            const minters = await goldToken.read.minters();
            expect(minters).to.not.include(getAddress(user1.account.address));
        });

        it('Should emit RemoveMinter event', async function () {
            const { user1, goldToken } = await fixture();

            await goldToken.write.addMinter([user1.account.address]);
            await goldToken.write.removeMinter([user1.account.address]);

            const events = (await goldToken.getEvents.RemoveMinter()) as any[];
            expect(events[events.length - 1].args.oldMinter).to.equal(getAddress(user1.account.address));
        });

        it('Should not allow removing non-existent minters', async function () {
            const { user1, goldToken, viem } = await fixture();

            await viem.assertions.revertWithCustomError(
                goldToken.write.removeMinter([user1.account.address]),
                goldToken,
                'InvalidMinter',
            );
        });

        it('Should only allow owner to manage minters', async function () {
            const { owner, user1, user2, goldToken, viem } = await fixture();

            await viem.assertions.revertWithCustomError(
                goldToken.write.addMinter([user2.account.address], { account: user1.account }),
                goldToken,
                'OwnableUnauthorizedAccount',
            );

            await viem.assertions.revertWithCustomError(
                goldToken.write.removeMinter([owner.account.address], { account: user1.account }),
                goldToken,
                'OwnableUnauthorizedAccount',
            );
        });
    });

    describe('Minting Functionality', async function () {
        const { owner, user1, user2, goldToken, viem } = await fixture();

        await goldToken.write.addMinter([user1.account.address]);

        it('Should allow minters to mint tokens', async function () {
            const mintAmount = parseEther('100');
            await goldToken.write.mint([user2.account.address, mintAmount], { account: owner.account });

            expect(await goldToken.read.balanceOf([user2.account.address])).to.equal(mintAmount);
            expect(await goldToken.read.totalSupply()).to.equal(mintAmount);
        });

        it('Should allow authorized minter to mint', async function () {
            const mintAmount = parseEther('50');
            await goldToken.write.mint([user2.account.address, mintAmount], { account: user1.account });

            expect(await goldToken.read.balanceOf([user2.account.address])).to.equal(mintAmount);
        });

        it('Should not allow non-minters to mint', async function () {
            await viem.assertions.revertWithCustomError(
                goldToken.write.mint([user2.account.address, parseEther('100')], { account: user2.account }),
                goldToken,
                'FORBIDDEN',
            );
        });

        it('Should handle large mint amounts', async function () {
            const largeAmount = parseEther('1000000');
            await goldToken.write.mint([user2.account.address, largeAmount], { account: owner.account });

            expect(await goldToken.read.balanceOf([user2.account.address])).to.equal(largeAmount);
        });
    });

    describe('Blacklist Integration', async function () {
        const { owner, user1, user2, user3, goldToken, blacklistOracle, viem } = await fixture();

        await goldToken.write.mint([user1.account.address, parseEther('100')], {
            account: owner.account,
        });
        await goldToken.write.mint([user2.account.address, parseEther('100')], {
            account: owner.account,
        });

        it('Should prevent transfers from blacklisted addresses', async function () {
            await blacklistOracle.write.addBlacklist([[user1.account.address]]);

            await viem.assertions.revertWithCustomError(
                goldToken.write.transfer([user2.account.address, parseEther('50')], {
                    account: user1.account,
                }),
                goldToken,
                'BlacklistedAddress',
            );
        });

        it('Should prevent transfers to blacklisted addresses', async function () {
            await blacklistOracle.write.addBlacklist([[user2.account.address]]);

            await viem.assertions.revertWithCustomError(
                goldToken.write.transfer([user2.account.address, parseEther('50')], {
                    account: user1.account,
                }),
                goldToken,
                'BlacklistedAddress',
            );
        });

        it('Should prevent minting to blacklisted addresses', async function () {
            await blacklistOracle.write.addBlacklist([[user3.account.address]]);

            await viem.assertions.revertWithCustomError(
                goldToken.write.mint([user3.account.address, parseEther('50')], { account: owner.account }),
                goldToken,
                'BlacklistedAddress',
            );
        });

        it('Should allow transfers when blacklist oracle is not set', async function () {
            // Deploy new token without blacklist oracle
            const newToken = await viem.deployContract('GoldToken');
            await newToken.write.initializeGoldToken([owner.account.address, zeroAddress]);

            await newToken.write.mint([user1.account.address, parseEther('100')], { account: owner.account });

            // Should work fine without blacklist check
            await newToken.write.transfer([user2.account.address, parseEther('50')], {
                account: user1.account,
            });

            expect(await newToken.read.balanceOf([user1.account.address])).to.equal(parseEther('50'));
            expect(await newToken.read.balanceOf([user2.account.address])).to.equal(parseEther('50'));
        });

        it('Should allow normal operations after removing from blacklist', async function () {
            await blacklistOracle.write.addBlacklist([[user1.account.address]]);

            // Should fail initially
            await viem.assertions.revertWithCustomError(
                goldToken.write.transfer([user2.account.address, parseEther('50')], {
                    account: user1.account,
                }),
                goldToken,
                'BlacklistedAddress',
            );

            // Remove from blacklist
            await blacklistOracle.write.removeBlacklist([[user1.account.address]]);

            // Should work now
            await goldToken.write.transfer([user2.account.address, parseEther('50')], {
                account: user1.account,
            });

            expect(await goldToken.read.balanceOf([user1.account.address])).to.equal(parseEther('50'));
            expect(await goldToken.read.balanceOf([user2.account.address])).to.equal(parseEther('150'));
        });
    });

    describe('Blacklist Oracle Management', function () {
        it('Should allow owner to change blacklist oracle', async function () {
            const { owner, goldToken } = await fixture();

            await goldToken.write.changeBlacklistOracle([owner.account.address]);

            expect(await goldToken.read.blacklistOracle()).to.equal(getAddress(owner.account.address));
        });

        it('Should emit BlacklistOracleChanged event', async function () {
            const { owner, goldToken } = await fixture();

            await goldToken.write.changeBlacklistOracle([owner.account.address]);

            const events = (await goldToken.getEvents.BlacklistOracleChanged()) as any[];
            expect(events[events.length - 1].args._blacklistOracle).to.equal(
                getAddress(owner.account.address),
            );
        });

        it('Should only allow owner to change blacklist oracle', async function () {
            const { owner, user1, goldToken, viem } = await fixture();

            await viem.assertions.revertWithCustomError(
                goldToken.write.changeBlacklistOracle([owner.account.address], { account: user1.account }),
                goldToken,
                'OwnableUnauthorizedAccount',
            );
        });

        it('Should allow setting blacklist oracle to zero address', async function () {
            const { goldToken } = await fixture();

            await goldToken.write.changeBlacklistOracle([zeroAddress]);
            expect(await goldToken.read.blacklistOracle()).to.equal(zeroAddress);
        });
    });

    describe('ERC20 Standard Functions', async function () {
        const { owner, user1, user2, user3, goldToken } = await fixture();
        await goldToken.write.mint([user1.account.address, parseEther('1000')], {
            account: owner.account,
        });
        await goldToken.write.mint([user2.account.address, parseEther('500')], {
            account: owner.account,
        });

        it('Should support transfer functionality', async function () {
            await goldToken.write.transfer([user2.account.address, parseEther('100')], {
                account: user1.account,
            });

            expect(await goldToken.read.balanceOf([user1.account.address])).to.equal(parseEther('900'));
            expect(await goldToken.read.balanceOf([user2.account.address])).to.equal(parseEther('600'));
        });

        it('Should support approve and transferFrom', async function () {
            await goldToken.write.approve([user2.account.address, parseEther('200')], {
                account: user1.account,
            });

            expect(await goldToken.read.allowance([user1.account.address, user2.account.address])).to.equal(
                parseEther('200'),
            );

            await goldToken.write.transferFrom(
                [user1.account.address, user3.account.address, parseEther('150')],
                { account: user2.account },
            );

            expect(await goldToken.read.balanceOf([user1.account.address])).to.equal(parseEther('850'));
            expect(await goldToken.read.balanceOf([user3.account.address])).to.equal(parseEther('150'));
            expect(await goldToken.read.allowance([user1.account.address, user2.account.address])).to.equal(
                parseEther('50'),
            );
        });

        it('Should support burning functionality', async function () {
            const burnAmount = parseEther('100');
            const initialBalance = (await goldToken.read.balanceOf([user1.account.address])) as bigint;
            const initialSupply = (await goldToken.read.totalSupply()) as bigint;

            await goldToken.write.burn([burnAmount], { account: user1.account });

            expect(await goldToken.read.balanceOf([user1.account.address])).to.equal(
                initialBalance - burnAmount,
            );
            expect(await goldToken.read.totalSupply()).to.equal(initialSupply - burnAmount);
        });

        it('Should support burnFrom functionality', async function () {
            await goldToken.write.approve([user2.account.address, parseEther('100')], {
                account: user1.account,
            });

            const burnAmount = parseEther('100');
            const initialBalance = (await goldToken.read.balanceOf([user1.account.address])) as bigint;
            const initialSupply = (await goldToken.read.totalSupply()) as bigint;

            await goldToken.write.burnFrom([user1.account.address, burnAmount], { account: user2.account });

            expect(await goldToken.read.balanceOf([user1.account.address])).to.equal(
                initialBalance - burnAmount,
            );
            expect(await goldToken.read.totalSupply()).to.equal(initialSupply - burnAmount);
            expect(await goldToken.read.allowance([user1.account.address, user2.account.address])).to.equal(
                0n,
            );
        });
    });

    describe('ERC20 Permit (ERC-2612)', async function () {
        const { owner, user1, user2, goldToken } = await fixture();

        await goldToken.write.mint([user1.account.address, parseEther('1000')], {
            account: owner.account,
        });

        it('Should support permit functionality', async function () {
            const value = parseEther('100');
            const deadline = maxUint256;

            const signature = await signPermitERC2612({
                token: goldToken,
                owner: user1,
                spender: user2.account.address,
                value: value,
                deadline: deadline,
            });

            const [v, r, s] = [
                `0x${signature.slice(130)}`,
                signature.slice(0, 66),
                `0x${signature.slice(66, 130)}`,
            ];

            await goldToken.write.permit([
                user1.account.address,
                user2.account.address,
                value,
                deadline,
                parseInt(v, 16),
                r,
                s,
            ]);

            expect(await goldToken.read.allowance([user1.account.address, user2.account.address])).to.equal(
                value,
            );
        });

        it('Should increment nonces correctly', async function () {
            const initialNonce = (await goldToken.read.nonces([user1.account.address])) as bigint;

            const signature = await signPermitERC2612({
                token: goldToken,
                owner: user1,
                spender: user2.account.address,
                value: parseEther('100'),
            });

            const [v, r, s] = [
                `0x${signature.slice(130)}`,
                signature.slice(0, 66),
                `0x${signature.slice(66, 130)}`,
            ];

            await goldToken.write.permit([
                user1.account.address,
                user2.account.address,
                parseEther('100'),
                maxUint256,
                parseInt(v, 16),
                r,
                s,
            ]);

            expect(await goldToken.read.nonces([user1.account.address])).to.equal(initialNonce + 1n);
        });

        it('Should have correct domain separator', async function () {
            const domainSeparator = String(await goldToken.read.DOMAIN_SEPARATOR());
            expect(domainSeparator).to.be.a('string');
            expect(domainSeparator.length).to.equal(66); // 0x + 64 hex chars
        });
    });

    describe('Edge Cases and Security', function () {
        it('Should handle zero amount transfers', async function () {
            const { owner, user1, user2, goldToken } = await fixture();

            await goldToken.write.mint([user1.account.address, parseEther('100')], {
                account: owner.account,
            });

            await goldToken.write.transfer([user2.account.address, 0n], { account: user1.account });

            expect(await goldToken.read.balanceOf([user1.account.address])).to.equal(parseEther('100'));
            expect(await goldToken.read.balanceOf([user2.account.address])).to.equal(0n);
        });

        it('Should handle self-transfers', async function () {
            const { owner, user1, goldToken } = await fixture();

            const amount = parseEther('100');
            await goldToken.write.mint([user1.account.address, amount], { account: owner.account });

            await goldToken.write.transfer([user1.account.address, parseEther('50')], {
                account: user1.account,
            });

            expect(await goldToken.read.balanceOf([user1.account.address])).to.equal(amount);
        });

        it('Should prevent transfers exceeding balance', async function () {
            const { owner, user1, user2, goldToken, viem } = await fixture();

            await goldToken.write.mint([user1.account.address, parseEther('100')], {
                account: owner.account,
            });

            await viem.assertions.revertWithCustomError(
                goldToken.write.transfer([user2.account.address, parseEther('101')], {
                    account: user1.account,
                }),
                goldToken,
                'ERC20InsufficientBalance',
            );
        });

        it('Should prevent unauthorized transfers', async function () {
            const { owner, user1, user2, user3, goldToken, viem } = await fixture();

            await goldToken.write.mint([user1.account.address, parseEther('100')], {
                account: owner.account,
            });

            await viem.assertions.revertWithCustomError(
                goldToken.write.transferFrom(
                    [user1.account.address, user3.account.address, parseEther('50')],
                    { account: user2.account },
                ),
                goldToken,
                'ERC20InsufficientAllowance',
            );
        });

        it('Should maintain total supply consistency', async function () {
            const { owner, user1, user2, goldToken } = await fixture();

            const mintAmount1 = parseEther('100');
            const mintAmount2 = parseEther('200');
            const burnAmount = parseEther('50');

            await goldToken.write.mint([user1.account.address, mintAmount1], { account: owner.account });
            await goldToken.write.mint([user2.account.address, mintAmount2], { account: owner.account });

            expect(await goldToken.read.totalSupply()).to.equal(mintAmount1 + mintAmount2);

            await goldToken.write.burn([burnAmount], { account: user1.account });

            expect(await goldToken.read.totalSupply()).to.equal(mintAmount1 + mintAmount2 - burnAmount);
        });
    });
});
