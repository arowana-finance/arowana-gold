import process from 'process';
import { configVariable, type HardhatUserConfig } from 'hardhat/config';
import hardhatNetworkHelpers from '@nomicfoundation/hardhat-network-helpers';
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
//import hardhatTypechain from '@nomicfoundation/hardhat-typechain';
//import hardhatEthers from '@nomicfoundation/hardhat-ethers';
//import hardhatAbiExporter from '@solidstate/hardhat-abi-exporter';
import hardhatMocha from '@nomicfoundation/hardhat-mocha';
import 'dotenv/config';

const config: HardhatUserConfig = {
    plugins: [
        hardhatToolboxViemPlugin,
        hardhatNetworkHelpers,
        //hardhatTypechain,
        //hardhatEthers,
        //hardhatAbiExporter,
        hardhatMocha,
    ],
    abiExporter: {
        runOnCompile: true,
        clear: true,
        spacing: 4,
        format: 'typescript',
    },
    solidity: {
        version: '0.8.30',
        settings: {
            evmVersion: 'london',
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
        npmFilesToBuild: [],
    },
    // Use develop network to connect any EVM compatible network (for any chainIds)
    networks: {
        hardhatMainnet: {
            type: 'edr-simulated',
            chainType: 'l1',
        },
        hardhatOp: {
            type: 'edr-simulated',
            chainType: 'op',
        },
        develop: {
            type: 'http',
            chainType: 'l1',
            url: process.env.RPC_URL || 'http://localhost:8545',
            accounts: {
                mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
                initialIndex: Number(process.env.MNEMONIC_INDEX) || 0,
            },
        },
        sepolia: {
            type: 'http',
            chainType: 'l1',
            url: process.env.RPC_URL || 'https://0xrpc.io/sep',
            accounts: {
                mnemonic: (() => {
                    try {
                        return configVariable('SEPOLIA_MNEMONIC');
                    } catch {
                        return process.env.MNEMONIC || 'test test test test test test test test test test test junk';
                    }
                })(),
                initialIndex: Number(process.env.MNEMONIC_INDEX) || 0,
            },
        },
    },
};

export default config;
