import hre from 'hardhat';
import { parseUnits, parseEther, maxUint256, zeroAddress, GetTransactionReceiptParameters } from 'viem';

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
    const publicClient = await hre.viem.getPublicClient();
    const [owner, buyer, bob, routerEOA] = await hre.viem.getWalletClients();
    return { publicClient, owner, buyer, bob, routerEOA };
};

export const timeTravel = async (seconds: number) => {
    await hre.network.provider.send('evm_increaseTime', [seconds]);
    await hre.network.provider.send('evm_mine');
};

export const setTimeTravel = async (seconds: number) => {
    const latest = await hre.network.provider.send('eth_getBlockByNumber', ['latest', false]);
    const latestTs = Number(latest.timestamp);
    const safe = seconds <= latestTs ? latestTs + 1 : seconds;
    await hre.network.provider.send('evm_setNextBlockTimestamp', [safe]);
};

export const getTxByTimestamp = async (txHash: GetTransactionReceiptParameters) => {
    const publicClient = await hre.viem.getPublicClient();
    const receipt = await publicClient.getTransactionReceipt(txHash);
    const block = await publicClient.getBlock({
        blockNumber: receipt.blockNumber,
    });
    return Number(block.timestamp);
};

export const getTimestamp = async () => {
    const publicClient = await hre.viem.getPublicClient();
    return Number((await publicClient.getBlock()).timestamp);
};

export { parseUnits, parseEther, maxUint256, zeroAddress };

/**
 * EIP-2612 Permit 서명 (ERC20Permit 표준)
 * - token: viem 컨트랙트 핸들 (ERC20Permit 지원)
 * - owner: 서명자(walletClient)
 * - spender: 허용받을 주소(컨트랙트)
 * - value: 허용량
 * - deadline: 만료(기본: maxUint256)
 */
export async function signPermitERC2612(params: {
    token: any;
    owner: any;
    spender: `0x${string}`;
    value: bigint;
    deadline?: bigint;
}) {
    const { token, owner, spender, value, deadline = maxUint256 } = params;

    const publicClient = await hre.viem.getPublicClient();
    const chainId = await publicClient.getChainId();

    const name = await token.read.name();
    const nonce = await token.read.nonces([owner.account.address]);
    const version = '1'; // OZ ERC20Permit 기본 버전

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
