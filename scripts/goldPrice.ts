import { getChainlinkPrice, Provider } from 'ethers-opt';

const ETH_RPC = 'https://rpc.mevblocker.io';

export async function getGoldPrice(): Promise<number> {
    const provider = new Provider(ETH_RPC);

    return await getChainlinkPrice(provider, 'XAU');
}
