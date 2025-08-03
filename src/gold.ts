import { formatEther, formatUnits } from 'ethers';
import { GoldMinter, GoldToken, DataFeed } from '../typechain-types/index.js';

export const DATAFEED_DECIMALS = 8;

export const GOLD_TOKEN_DECIMALS = 18;

export const USD_TOKEN_MAX_DECIMALS = 6;

export enum Levels {
    DEFAULT = 0,
    KYCD = 1,
    APPROVED = 2,
}

export interface GoldStats {
    goldSupply: number;
    goldPrice: number;
    goldReserve: number;
    slippage: number;
    fees: number;
    tradeLevel: Levels;
    minGoldAmount: number;
    minGoldFee: number;
    minGoldFeeAmount: number;
}

export interface GoldMintQuote {
    inputAmount: number;
    isBuy: boolean;
    goldPrice: number;
    fees?: number;
    slippage?: number;
    minGoldFee?: number;
    minGoldFeeAmount?: number;
}

export interface GoldMintQuoteResult {
    outputAmount: number;
    outputOnSlippage: number;
    goldAmount: number;
    goldFees: number;
}

export async function getGoldStats({
    goldToken,
    goldPriceFeed,
    goldReserveFeed,
    goldMinter,
}: {
    goldToken: GoldToken;
    goldPriceFeed: DataFeed;
    goldReserveFeed: DataFeed;
    goldMinter: GoldMinter;
}): Promise<GoldStats> {
    const [
        goldTokenSupply,
        goldPriceFeedAns,
        goldReserveFeedAns,
        slippage,
        fees,
        tradeLevel,
        minGoldAmount,
        minGoldFee,
        minGoldFeeAmount,
    ] = await Promise.all([
        goldToken.totalSupply(),
        goldPriceFeed.latestAnswer(),
        goldReserveFeed.latestAnswer(),
        goldMinter.slippage(),
        goldMinter.fees(),
        goldMinter.tradeLevel(),
        goldMinter.minGoldAmount(),
        goldMinter.minGoldFee(),
        goldMinter.minGoldFeeAmount(),
    ]);

    return {
        goldSupply: Number(formatEther(goldTokenSupply)),
        goldPrice: Number(formatUnits(goldPriceFeedAns, DATAFEED_DECIMALS)),
        goldReserve: Number(formatUnits(goldReserveFeedAns, DATAFEED_DECIMALS)),
        slippage: Number(Number(slippage).toFixed(3)) / 100,
        fees: Number(fees) / 100,
        tradeLevel: Number(tradeLevel) as Levels,
        minGoldAmount: Number(formatEther(minGoldAmount)),
        minGoldFee: Number(formatEther(minGoldFee)),
        minGoldFeeAmount: Number(formatEther(minGoldFeeAmount)),
    };
}

export function calculateSwap({
    inputAmount,
    isBuy,
    goldPrice,
    fees,
    slippage,
    minGoldFee,
    minGoldFeeAmount,
}: GoldMintQuote): GoldMintQuoteResult {
    // Output
    const outputDecimals = isBuy ? GOLD_TOKEN_DECIMALS : USD_TOKEN_MAX_DECIMALS;
    const outputAmount = NumDecimals(
        isBuy ? inputAmount / goldPrice : inputAmount * goldPrice,
        outputDecimals,
    );

    const goldAmount = isBuy ? outputAmount : inputAmount;
    const overMinGoldFeeAmount = goldAmount >= (minGoldFeeAmount || 0);

    // 0.5% of amount as fees if over minimum 0.01 amount
    const goldFees = NumDecimals(
        overMinGoldFeeAmount ? (goldAmount * (fees || 0)) / 100 : minGoldFee || 0,
        GOLD_TOKEN_DECIMALS,
    );
    // Output with slippages for user input
    const outputOnSlippage = NumDecimals(
        (outputAmount * (100 - (slippage || 2) * 0.5 + (fees || 0))) / 100,
        outputDecimals,
    );

    return {
        outputAmount,
        outputOnSlippage,
        goldAmount,
        goldFees,
    };
}

export function NumDecimals(num: number, maxDecimals = 18) {
    return Number(num.toFixed(maxDecimals));
}
