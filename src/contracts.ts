import { Provider } from 'ethers';
import { type SignerWithAddress } from 'ethers-opt';
import {
    DataFeed__factory,
    ERC20Mock__factory,
    GoldMinter__factory,
    GoldToken__factory,
} from '../typechain-types/index.js';

export type Runner = SignerWithAddress | Provider;

export interface BaseConfig extends Record<string, string | number> {
    chainId: number;
    rpc: string;
}

export interface GoldConfig extends BaseConfig {
    goldToken: string;
    goldPriceFeed: string;
    goldReserveFeed: string;
    goldMinter: string;
}

export enum Networks {
    MAINNET = 1,
    ARBITRUM_SEPOLIA = 421614,
}

export const goldConfigs: Record<number, GoldConfig> = {
    [Networks.ARBITRUM_SEPOLIA]: {
        chainId: Networks.ARBITRUM_SEPOLIA,
        rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
        goldToken: '0x953d0C3060944b07127FaC6DCE7a30B06a98d881',
        goldPriceFeed: '0xBB7D041d5E2828569f4Bd667509AE15c3862298C',
        goldReserveFeed: '0xa94fCB087C9E5D8480C04049D97e2fE2F3b306a0',
        goldMinter: '0x373d4Be1BCfC77eB7804cFA62418a73f89FfC7F9',
    },
};

export function getStableCoinContract(address: string, runner?: Runner) {
    return ERC20Mock__factory.connect(address, runner);
}

export function getGoldTokenContract(address: string, runner?: Runner) {
    return GoldToken__factory.connect(address, runner);
}

export function getGoldPriceFeedContract(address: string, runner?: Runner) {
    return DataFeed__factory.connect(address, runner);
}

export function getGoldReserveFeedContract(address: string, runner?: Runner) {
    return DataFeed__factory.connect(address, runner);
}

export function getGoldMinterContract(address: string, runner?: Runner) {
    return GoldMinter__factory.connect(address, runner);
}
