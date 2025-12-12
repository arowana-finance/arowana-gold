import { network } from 'hardhat';
import type { Account, PublicClient, WalletClient, Address } from 'viem';

export type Runner = Account | PublicClient | WalletClient;

const { viem } = await network.connect();

export interface BaseConfig extends Record<string, string | number> {
    chainId: number;
    rpc: string;
}

export interface GoldConfig extends BaseConfig {
    goldToken: Address;
    goldPriceFeed: Address;
    goldReserveFeed: Address;
    goldMinter: Address;
}

export enum Networks {
    MAINNET = 1,
    ARBITRUM_SEPOLIA = 421614,
}

export const goldConfigs: Record<number, GoldConfig> = {
    [Networks.ARBITRUM_SEPOLIA]: {
        chainId: Networks.ARBITRUM_SEPOLIA,
        rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
        goldToken: '0x90dEDb255F05C8FFEeb628a6b9Ad6160e8174Cb0',
        goldPriceFeed: '0xBB7D041d5E2828569f4Bd667509AE15c3862298C',
        goldReserveFeed: '0x46013a422ac2fb5c10f1bba16abba4175fc54426',
        goldMinter: '0x27c58B2e12841402671C2D86fE5AC4e0100498C0',
    },
};

export async function getStableCoinContract(address: Address) {
    return await viem.getContractAt('ERC20Mock', address);
}

export async function getGoldTokenContract(address: Address) {
    return await viem.getContractAt('GoldToken', address);
}

export async function getGoldPriceFeedContract(address: Address) {
    return await viem.getContractAt('DataFeed', address);
}

export async function getGoldReserveFeedContract(address: Address) {
    return await viem.getContractAt('DataFeed', address);
}

export async function getGoldMinterContract(address: Address) {
    return await viem.getContractAt('GoldMinter', address);
}
