import { ContractTypesMap } from 'hardhat/types/artifacts';
import { formatEther, formatUnits } from 'viem';

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
    goldToken: ContractTypesMap['GoldToken'];
    goldPriceFeed: ContractTypesMap['DataFeed'];
    goldReserveFeed: ContractTypesMap['DataFeed'];
    goldMinter: ContractTypesMap['GoldMinter'];
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
        goldToken.read.totalSupply(),
        goldPriceFeed.read.latestAnswer(),
        goldReserveFeed.read.latestAnswer(),
        goldMinter.read.slippage(),
        goldMinter.read.fees(),
        goldMinter.read.tradeLevel(),
        goldMinter.read.minGoldAmount(),
        goldMinter.read.minGoldFee(),
        goldMinter.read.minGoldFeeAmount(),
    ]);

    return {
        goldSupply: NumDecimals(formatEther(goldTokenSupply)),
        goldPrice: NumDecimals(formatUnits(goldPriceFeedAns, DATAFEED_DECIMALS)),
        goldReserve: NumDecimals(formatUnits(goldReserveFeedAns, DATAFEED_DECIMALS)),
        slippage: NumDecimals(Number(slippage) / 100, 3),
        fees: NumDecimals(Number(fees) / 100, 3),
        tradeLevel: Number(tradeLevel) as Levels,
        minGoldAmount: NumDecimals(formatEther(minGoldAmount)),
        minGoldFee: NumDecimals(formatEther(minGoldFee)),
        minGoldFeeAmount: NumDecimals(formatEther(minGoldFeeAmount)),
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
    // 출력 자릿수
    const outputDecimals = isBuy ? GOLD_TOKEN_DECIMALS : USD_TOKEN_MAX_DECIMALS;

    // 1) 순수 계산된 출력
    const outputAmount = NumDecimals(
        isBuy ? inputAmount / goldPrice : inputAmount * goldPrice,
        outputDecimals,
    );

    // 2) 수수료 기준이 되는 goldAmount
    const goldAmount = isBuy ? outputAmount : inputAmount;
    const overMinGoldFeeAmount = goldAmount >= (minGoldFeeAmount ?? 0);

    // 3) 수수료: 기준금액 이상이면 (amount * fees%) / 100, 아니면 최소 수수료
    const goldFees = NumDecimals(
        overMinGoldFeeAmount ? (goldAmount * (fees ?? 0)) / 100 : (minGoldFee ?? 0),
        GOLD_TOKEN_DECIMALS,
    );

    // 4) 슬리피지 반영 예상치(사용자 안내용)
    const outputOnSlippage = NumDecimals(
        (outputAmount * (100 - (slippage ?? 2) * 0.5 + (fees ?? 0))) / 100,
        outputDecimals,
    );

    return { outputAmount, outputOnSlippage, goldAmount, goldFees };
}

export function NumDecimals(num: number | string | bigint, maxDecimals = 18) {
    return Number(Number(num).toFixed(maxDecimals));
}
