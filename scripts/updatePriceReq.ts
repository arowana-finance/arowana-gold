import process from 'process';
import { readFile } from 'fs/promises';
import {
    simulateScript,
    buildRequestCBOR,
    ReturnType,
    decodeResult,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit';
import { hexToBytes, type Hex } from 'viem';
import { network } from 'hardhat';

const { viem } = await network.connect();

const CONSUMER_ADDRESS =
    (process.env.CONSUMER_ADDRESS as `0x${string}`) ??
    ('0xc6323b645cf5822db1e03df44f62e9b8dc5b6924' as const);
const SUBSCRIPTION_ID = Number(process.env.SUBSCRIPTION_ID ?? 542);

const gasLimit = 300000;

interface ChainlinkConfig {
    routerAddress: `0x${string}`;
    explorerUrl: string;
    donID: `0x${string}`;
}

const networkConfigs: Record<number, ChainlinkConfig> = {
    421614: {
        routerAddress: '0x234a5fb5Bd614a7AA2FfAB244D603abFA0Ac5C5C',
        explorerUrl: 'https://sepolia.arbiscan.io',
        donID: '0x66756e2d617262697472756d2d7365706f6c69612d3100000000000000000000',
    },
};

async function updateRequest() {
    const [owner] = await viem.getWalletClients();
    const publicClient = await viem.getPublicClient();

    const chainId = await publicClient.getChainId();
    const netCfg = networkConfigs[chainId];
    if (!netCfg) throw new Error(`Unsupported chainId: ${chainId}`);
    const { donID, explorerUrl } = netCfg;

    const source = await readFile('./deno/priceSource.js', { encoding: 'utf8' });
    console.log('Start simulation...');

    const response = await simulateScript({
        source,
        args: [],
        bytesArgs: [],
        // secrets: ...
    });

    console.log('Simulation result', response);
    const { errorString, responseBytesHexstring } = response;
    if (errorString) {
        console.log(`❌ Error during simulation: `, errorString);
    } else {
        const returnType = ReturnType.uint256;
        if (responseBytesHexstring && hexToBytes(responseBytesHexstring as Hex).length) {
            const decodedResponse = decodeResult(responseBytesHexstring as Hex, returnType);
            console.log(`✅ Decoded response to ${returnType}: `, decodedResponse);
        }
    }

    //////// MAKE REQUEST ////////
    console.log('\nMake request...');

    const automatedFunctionsConsumer = await viem.getContractAt('BaseFunctionsConsumer', CONSUMER_ADDRESS);

    const functionsRequestBytesHexString = buildRequestCBOR({
        codeLocation: Location.Inline,
        codeLanguage: CodeLanguage.JavaScript,
        source,
        args: [],
        bytesArgs: [],
    }) as `0x${string}`;

    const updateTxHash = await automatedFunctionsConsumer.write.updateRequest(
        [functionsRequestBytesHexString, BigInt(SUBSCRIPTION_ID), gasLimit, donID],
        { account: owner.account },
    );

    const updateReceipt = await publicClient.waitForTransactionReceipt({
        hash: updateTxHash,
    });
    console.log(`✅ Request settings updated! Transaction hash ${updateReceipt.transactionHash}`);

    //////// SEND REQUEST ////////
    console.log('\nSending Functions request...');

    const sendTxHash = await automatedFunctionsConsumer.write.sendRequestCBOR([], { account: owner.account });

    const sendReceipt = await publicClient.waitForTransactionReceipt({
        hash: sendTxHash,
    });
    console.log(
        `\n✅ Functions request sent! Transaction hash ${sendReceipt.transactionHash} - Check the explorer ${explorerUrl}/tx/${sendReceipt.transactionHash}`,
    );
}

updateRequest().catch((err) => {
    console.error(err);
    process.exit(1);
});
