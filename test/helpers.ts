import { network } from 'hardhat';
import { parseUnits, parseEther, maxUint256, zeroAddress, GetTransactionReceiptParameters } from 'viem';

const { viem, networkHelpers } = await network.connect();

export function u64ToBytesBE(n: bigint): Uint8Array {
    const out = new Uint8Array(8);
    let x = n;
    for (let i = 7; i >= 0; i--) {
        out[i] = Number(x & 0xffn);
        x >>= 8n;
    }
    return out;
}

export function encodeAnswerTimestampPairs(
    pairs: Array<{ answer: bigint; timeStamp: bigint }>,
): `0x${string}` {
    const chunks: number[] = [];
    for (const { answer, timeStamp } of pairs) {
        const a = u64ToBytesBE(answer);
        const t = u64ToBytesBE(timeStamp);
        for (const b of a) chunks.push(b);
        for (const b of t) chunks.push(b);
    }
    const hex = chunks.map((b) => b.toString(16).padStart(2, '0')).join('');
    return ('0x' + hex) as `0x${string}`;
}

export const getClients = async () => {
    const publicClient = await viem.getPublicClient();
    const [owner, buyer, bob, routerEOA] = await viem.getWalletClients();
    return { publicClient, owner, buyer, bob, routerEOA, viem };
};

export const timeTravel = async (seconds: number) => {
    await networkHelpers.mine();
    await networkHelpers.time.increase(seconds);
};

export const setTimeTravel = async (seconds: number) => {
    const latest = await getTimestamp();
    const latestTs = latest;
    const safe = seconds <= latestTs ? latestTs + 1 : seconds;
    await networkHelpers.time.setNextBlockTimestamp(safe);
};

export const getTxByTimestamp = async (txHash: GetTransactionReceiptParameters) => {
    const publicClient = await viem.getPublicClient();
    const receipt = await publicClient.getTransactionReceipt(txHash);
    const block = await publicClient.getBlock({
        blockNumber: receipt.blockNumber,
    });
    return Number(block.timestamp);
};

export const getTimestamp = async () => {
    const publicClient = await viem.getPublicClient();
    return Number((await publicClient.getBlock()).timestamp);
};

export { parseUnits, parseEther, maxUint256, zeroAddress };

export async function signPermitERC2612(params: {
    token: any;
    owner: any;
    spender: `0x${string}`;
    value: bigint;
    deadline?: bigint;
}) {
    const { token, owner, spender, value, deadline = maxUint256 } = params;

    const publicClient = await viem.getPublicClient();
    const chainId = await publicClient.getChainId();

    const name = await token.read.name();
    const nonce = await token.read.nonces([owner.account.address]);
    const version = '1';

    const domain = {
        name,
        version,
        chainId,
        verifyingContract: token.address as `0x${string}`,
    } as const;

    const types = {
        Permit: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ],
    } as const;

    const message = {
        owner: owner.account.address,
        spender,
        value,
        nonce,
        deadline,
    } as const;

    const signature = await owner.signTypedData({
        domain,
        types,
        primaryType: 'Permit',
        message,
    });

    return signature;
}

export async function signKYCMintRequest(params: {
    goldMinter: any;
    settler: any;
    user: `0x${string}`;
    kycLevel: number;
    nonce: bigint;
    deadline: bigint;
    usdToken: `0x${string}`;
    usdAmount: bigint;
    minGoldAmount: bigint;
}) {
    const { goldMinter, settler, user, kycLevel, nonce, deadline, usdToken, usdAmount, minGoldAmount } =
        params;

    const publicClient = await viem.getPublicClient();
    const chainId = await publicClient.getChainId();

    const domain = {
        name: 'GoldMinter',
        version: '1',
        chainId,
        verifyingContract: goldMinter.address as `0x${string}`,
    } as const;

    const types = {
        KYCMintRequest: [
            { name: 'user', type: 'address' },
            { name: 'kycLevel', type: 'uint8' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
            { name: 'usdToken', type: 'address' },
            { name: 'usdAmount', type: 'uint256' },
            { name: 'minGoldAmount', type: 'uint256' },
        ],
    } as const;

    const message = {
        user,
        kycLevel,
        nonce,
        deadline,
        usdToken,
        usdAmount,
        minGoldAmount,
    } as const;

    const signature = await settler.signTypedData({
        domain,
        types,
        primaryType: 'KYCMintRequest',
        message,
    });

    return signature;
}

export async function signKYCBurnRequest(params: {
    goldMinter: any;
    settler: any;
    user: `0x${string}`;
    kycLevel: number;
    nonce: bigint;
    deadline: bigint;
    usdToken: `0x${string}`;
    goldAmount: bigint;
    minUsdAmount: bigint;
}) {
    const { goldMinter, settler, user, kycLevel, nonce, deadline, usdToken, goldAmount, minUsdAmount } =
        params;

    const publicClient = await viem.getPublicClient();
    const chainId = await publicClient.getChainId();

    const domain = {
        name: 'GoldMinter',
        version: '1',
        chainId,
        verifyingContract: goldMinter.address as `0x${string}`,
    } as const;

    const types = {
        KYCBurnRequest: [
            { name: 'user', type: 'address' },
            { name: 'kycLevel', type: 'uint8' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
            { name: 'usdToken', type: 'address' },
            { name: 'goldAmount', type: 'uint256' },
            { name: 'minUsdAmount', type: 'uint256' },
        ],
    } as const;

    const message = {
        user,
        kycLevel,
        nonce,
        deadline,
        usdToken,
        goldAmount,
        minUsdAmount,
    } as const;

    const signature = await settler.signTypedData({
        domain,
        types,
        primaryType: 'KYCBurnRequest',
        message,
    });

    return signature;
}
