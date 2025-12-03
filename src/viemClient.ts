import {
    createPublicClient,
    createWalletClient,
    http,
    parseUnits,
    formatUnits,
    encodePacked,
    toBytes,
    getContract,
    type Address,
    type Hash,
} from 'viem';
import { arbitrumSepolia, arbitrum } from 'viem/chains';

export {
    createPublicClient,
    createWalletClient,
    http,
    parseUnits,
    formatUnits,
    encodePacked,
    toBytes,
    getContract,
    arbitrumSepolia,
    arbitrum,
    type Address,
    type Hash,
};

export function createTWAPClients(network: 'arbitrum' | 'arbitrum-sepolia' = 'arbitrum-sepolia') {
    const chain = network === 'arbitrum' ? arbitrum : arbitrumSepolia;
    const rpcUrl =
        network === 'arbitrum'
            ? process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'
            : process.env.ARBITRUM_SEPOLIA_RPC_URL || 'https://sepolia-rollup.arbitrum.io/rpc';

    const publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl),
    });

    return {
        publicClient,
        chain,
        network,
    };
}

export function getTWAPContract(contractName: string, address: Address, publicClient: any, abi: any) {
    return getContract({
        address,
        abi,
        client: publicClient,
    });
}
