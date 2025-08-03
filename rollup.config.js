/**
 * Unused for solidity projects unless you need to test custom src files
 */
import { getRollupConfig } from '@arowanadao/rollup';

const config = [
    getRollupConfig({ input: './src/index.ts' }),
    getRollupConfig({ 
        input: './src/index.ts',
        browserName: 'arwGold',
        globals: {
            ethers: 'ethers'
        },
        external: ['crypto', 'ethers'],
    }),
]

export default config;