// Imports
const ethers = await import("npm:ethers@6.15.0");
const ethersOpt = await import("npm:ethers-opt@1.0.7");

const RESERVE_API = 'https://gold-reserve.arowana.finance';
const RPC_URL = 'https://sepolia-rollup.arbitrum.io/rpc';
const CONTRACT_ADDRESS = '0x0623C5E104cf1282CEB1F5f623Da994BAB6D57CD';
const ORACLE_DECIMALS = 8;
const oracleInterval = 3600;

const abi = [
    {
        "inputs":[
            
        ],
        "name":"latestAnswer",
        "outputs":[
            {
                "internalType":"int256",
                "name":"",
                "type":"int256"
            }
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[
            
        ],
        "name":"latestRound",
        "outputs":[
            {
                "internalType":"uint256",
                "name":"",
                "type":"uint256"
            }
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[
            
        ],
        "name":"latestRoundData",
        "outputs":[
            {
                "internalType":"uint80",
                "name":"",
                "type":"uint80"
            },
            {
                "internalType":"int256",
                "name":"",
                "type":"int256"
            },
            {
                "internalType":"uint256",
                "name":"",
                "type":"uint256"
            },
            {
                "internalType":"uint256",
                "name":"",
                "type":"uint256"
            },
            {
                "internalType":"uint80",
                "name":"",
                "type":"uint80"
            }
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[
            
        ],
        "name":"latestTimestamp",
        "outputs":[
            {
                "internalType":"uint256",
                "name":"",
                "type":"uint256"
            }
        ],
        "stateMutability":"view",
        "type":"function"
    }
]

// Chainlink Functions compatible Ethers JSON RPC provider class
// (this is required for making Ethers RPC calls with Chainlink Functions)
class FunctionsJsonRpcProvider extends ethersOpt.Provider {
  constructor(url) {
    super(url);
    this.url = url;
  }

  async _send(payload) {
    const resp = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await resp.json();

    return !Array.isArray(result) ? [result] : result;
  }
}

async function getDataFeedRound() {
    try {
        const provider = new FunctionsJsonRpcProvider(RPC_URL);
        const dataFeedContract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
        const [roundId, answer, , updatedAt] = await dataFeedContract.latestRoundData();
        
        return {
            roundId: Number(roundId),
            answer: Number(ethers.formatUnits(answer, ORACLE_DECIMALS)),
            updatedAt: Number(updatedAt),
        }
    } catch {
        return {
            roundId: 0,
            answer: 0,
            updatedAt: 0,
        }
    }
}

async function getApi() {
    try {
        const resp = await fetch(RESERVE_API)

        if (!resp.ok) {
            return 0;
        }

        const { reserve } = await resp.json();

        return Number(reserve);
    } catch {
        return 0;
    }
}

async function processSource() {
    const [{ updatedAt }, reserve] = await Promise.all([
        getDataFeedRound(),
        getApi(),
    ]);

    const currentTimestamp = Math.floor(Date.now() / 1000 / oracleInterval) * oracleInterval;

    if (!reserve || (updatedAt >= currentTimestamp)) {
        return ethers.getBytes('0x01');
    }

    const reserveBN = ethers.parseUnits(String(reserve), ORACLE_DECIMALS);

    return ethers.getBytes(ethers.solidityPacked(['uint64', 'uint64'], [reserveBN, currentTimestamp]));
}

const encoded = await processSource();

return encoded;