import { ContractFactory, Interface, Contract, formatEther, formatUnits } from 'ethers';

const _abi$X = [
    {
        inputs: [],
        name: 'OnlySimulatedBackend',
        type: 'error',
    },
];
const _bytecode$m =
    '0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220bbdb5cb7334558ad783d387c86c20ee67d2ae21464da673dc90a56c617fbcc7164736f6c634300081e0033';
const isSuperArgs$m = (xs) => xs.length > 1;
class AutomationBase__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$m(args)) {
            super(...args);
        } else {
            super(_abi$X, _bytecode$m, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$m;
    static abi = _abi$X;
    static createInterface() {
        return new Interface(_abi$X);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$X, runner);
    }
}

var index$1y = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    AutomationBase__factory: AutomationBase__factory,
});

const _abi$W = [
    {
        inputs: [],
        name: 'OnlySimulatedBackend',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'checkData',
                type: 'bytes',
            },
        ],
        name: 'checkUpkeep',
        outputs: [
            {
                internalType: 'bool',
                name: 'upkeepNeeded',
                type: 'bool',
            },
            {
                internalType: 'bytes',
                name: 'performData',
                type: 'bytes',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'performData',
                type: 'bytes',
            },
        ],
        name: 'performUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class AutomationCompatible__factory {
    static abi = _abi$W;
    static createInterface() {
        return new Interface(_abi$W);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$W, runner);
    }
}

var index$1x = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    AutomationCompatible__factory: AutomationCompatible__factory,
});

const _abi$V = [
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'checkData',
                type: 'bytes',
            },
        ],
        name: 'checkUpkeep',
        outputs: [
            {
                internalType: 'bool',
                name: 'upkeepNeeded',
                type: 'bool',
            },
            {
                internalType: 'bytes',
                name: 'performData',
                type: 'bytes',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'performData',
                type: 'bytes',
            },
        ],
        name: 'performUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class AutomationCompatibleInterface__factory {
    static abi = _abi$V;
    static createInterface() {
        return new Interface(_abi$V);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$V, runner);
    }
}

var index$1w = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    AutomationCompatibleInterface__factory: AutomationCompatibleInterface__factory,
});

var index$1v = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    automationCompatibleInterfaceSol: index$1w,
});

var index$1u = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    automationBaseSol: index$1y,
    automationCompatibleSol: index$1x,
    interfaces: index$1v,
});

const _abi$U = [
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'handleOracleFulfillment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IFunctionsClient__factory {
    static abi = _abi$U;
    static createInterface() {
        return new Interface(_abi$U);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$U, runner);
    }
}

var index$1t = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IFunctionsClient__factory: IFunctionsClient__factory,
});

const _abi$T = [
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
            {
                internalType: 'uint96',
                name: 'juelsPerGas',
                type: 'uint96',
            },
            {
                internalType: 'uint96',
                name: 'costWithoutFulfillment',
                type: 'uint96',
            },
            {
                internalType: 'address',
                name: 'transmitter',
                type: 'address',
            },
            {
                components: [
                    {
                        internalType: 'bytes32',
                        name: 'requestId',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'coordinator',
                        type: 'address',
                    },
                    {
                        internalType: 'uint96',
                        name: 'estimatedTotalCostJuels',
                        type: 'uint96',
                    },
                    {
                        internalType: 'address',
                        name: 'client',
                        type: 'address',
                    },
                    {
                        internalType: 'uint64',
                        name: 'subscriptionId',
                        type: 'uint64',
                    },
                    {
                        internalType: 'uint32',
                        name: 'callbackGasLimit',
                        type: 'uint32',
                    },
                    {
                        internalType: 'uint72',
                        name: 'adminFee',
                        type: 'uint72',
                    },
                    {
                        internalType: 'uint72',
                        name: 'donFee',
                        type: 'uint72',
                    },
                    {
                        internalType: 'uint40',
                        name: 'gasOverheadBeforeCallback',
                        type: 'uint40',
                    },
                    {
                        internalType: 'uint40',
                        name: 'gasOverheadAfterCallback',
                        type: 'uint40',
                    },
                    {
                        internalType: 'uint32',
                        name: 'timeoutTimestamp',
                        type: 'uint32',
                    },
                ],
                internalType: 'struct FunctionsResponse.Commitment',
                name: 'commitment',
                type: 'tuple',
            },
        ],
        name: 'fulfill',
        outputs: [
            {
                internalType: 'enum FunctionsResponse.FulfillResult',
                name: '',
                type: 'uint8',
            },
            {
                internalType: 'uint96',
                name: '',
                type: 'uint96',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAdminFee',
        outputs: [
            {
                internalType: 'uint72',
                name: 'adminFee',
                type: 'uint72',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAllowListId',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'getContractById',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'getProposedContractById',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getProposedContractSet',
        outputs: [
            {
                internalType: 'bytes32[]',
                name: '',
                type: 'bytes32[]',
            },
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'subscriptionId',
                type: 'uint64',
            },
            {
                internalType: 'uint32',
                name: 'callbackGasLimit',
                type: 'uint32',
            },
        ],
        name: 'isValidCallbackGasLimit',
        outputs: [],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32[]',
                name: 'proposalSetIds',
                type: 'bytes32[]',
            },
            {
                internalType: 'address[]',
                name: 'proposalSetAddresses',
                type: 'address[]',
            },
        ],
        name: 'proposeContractsUpdate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'subscriptionId',
                type: 'uint64',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'uint16',
                name: 'dataVersion',
                type: 'uint16',
            },
            {
                internalType: 'uint32',
                name: 'callbackGasLimit',
                type: 'uint32',
            },
            {
                internalType: 'bytes32',
                name: 'donId',
                type: 'bytes32',
            },
        ],
        name: 'sendRequest',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: 'subscriptionId',
                type: 'uint64',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
            {
                internalType: 'uint16',
                name: 'dataVersion',
                type: 'uint16',
            },
            {
                internalType: 'uint32',
                name: 'callbackGasLimit',
                type: 'uint32',
            },
            {
                internalType: 'bytes32',
                name: 'donId',
                type: 'bytes32',
            },
        ],
        name: 'sendRequestToProposed',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'allowListId',
                type: 'bytes32',
            },
        ],
        name: 'setAllowListId',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'updateContracts',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IFunctionsRouter__factory {
    static abi = _abi$T;
    static createInterface() {
        return new Interface(_abi$T);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$T, runner);
    }
}

var index$1s = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IFunctionsRouter__factory: IFunctionsRouter__factory,
});

var index$1r = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    iFunctionsClientSol: index$1t,
    iFunctionsRouterSol: index$1s,
});

const _abi$S = [
    {
        inputs: [],
        name: 'EmptyArgs',
        type: 'error',
    },
    {
        inputs: [],
        name: 'EmptySecrets',
        type: 'error',
    },
    {
        inputs: [],
        name: 'EmptySource',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NoInlineSecrets',
        type: 'error',
    },
    {
        inputs: [],
        name: 'REQUEST_DATA_VERSION',
        outputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const _bytecode$l =
    '0x608c6037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c80635d641dfc146038575b600080fd5b603f600181565b60405161ffff909116815260200160405180910390f3fea264697066735822122011396d510ef8653b34192bd687cc233838c0507fd70c27cba688117f455dea6c64736f6c634300081e0033';
const isSuperArgs$l = (xs) => xs.length > 1;
class FunctionsRequest__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$l(args)) {
            super(...args);
        } else {
            super(_abi$S, _bytecode$l, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$l;
    static abi = _abi$S;
    static createInterface() {
        return new Interface(_abi$S);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$S, runner);
    }
}

var index$1q = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    FunctionsRequest__factory: FunctionsRequest__factory,
});

var index$1p = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    functionsRequestSol: index$1q,
});

var index$1o = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    interfaces: index$1r,
    libraries: index$1p,
});

var index$1n = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    v100: index$1o,
});

var index$1m = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    automation: index$1u,
    functions: index$1n,
});

var index$1l = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    v08: index$1m,
});

var index$1k = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    src: index$1l,
});

var index$1j = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    contracts: index$1k,
});

const _abi$R = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
let Ownable__factory$1 = class Ownable__factory {
    static abi = _abi$R;
    static createInterface() {
        return new Interface(_abi$R);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$R, runner);
    }
};

var index$1i = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Ownable__factory: Ownable__factory$1,
});

var index$1h = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ownableSol: index$1i,
});

const _abi$Q = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approveAndCall',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'approveAndCall',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferAndCall',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'transferAndCall',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'transferFromAndCall',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFromAndCall',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IERC1363__factory {
    static abi = _abi$Q;
    static createInterface() {
        return new Interface(_abi$Q);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$Q, runner);
    }
}

var index$1g = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC1363__factory: IERC1363__factory,
});

const _abi$P = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'previousAdmin',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'newAdmin',
                type: 'address',
            },
        ],
        name: 'AdminChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'beacon',
                type: 'address',
            },
        ],
        name: 'BeaconUpgraded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'implementation',
                type: 'address',
            },
        ],
        name: 'Upgraded',
        type: 'event',
    },
];
class IERC1967__factory {
    static abi = _abi$P;
    static createInterface() {
        return new Interface(_abi$P);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$P, runner);
    }
}

var index$1f = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC1967__factory: IERC1967__factory,
});

const _abi$O = [
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class IERC5267__factory {
    static abi = _abi$O;
    static createInterface() {
        return new Interface(_abi$O);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$O, runner);
    }
}

var index$1e = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC5267__factory: IERC5267__factory,
});

const _abi$N = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ERC1155InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC1155InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'idsLength',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'valuesLength',
                type: 'uint256',
            },
        ],
        name: 'ERC1155InvalidArrayLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'ERC1155InvalidOperator',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC1155InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC1155InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC1155MissingApprovalForAll',
        type: 'error',
    },
];
class IERC1155Errors__factory {
    static abi = _abi$N;
    static createInterface() {
        return new Interface(_abi$N);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$N, runner);
    }
}

const _abi$M = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
];
class IERC20Errors__factory {
    static abi = _abi$M;
    static createInterface() {
        return new Interface(_abi$M);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$M, runner);
    }
}

const _abi$L = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC721IncorrectOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ERC721InsufficientApproval',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'operator',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidOperator',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC721InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'ERC721NonexistentToken',
        type: 'error',
    },
];
class IERC721Errors__factory {
    static abi = _abi$L;
    static createInterface() {
        return new Interface(_abi$L);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$L, runner);
    }
}

var index$1d = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC1155Errors__factory: IERC1155Errors__factory,
    IERC20Errors__factory: IERC20Errors__factory,
    IERC721Errors__factory: IERC721Errors__factory,
});

var index$1c = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    draftIerc6093Sol: index$1d,
    ierc1363Sol: index$1g,
    ierc1967Sol: index$1f,
    ierc5267Sol: index$1e,
});

const _abi$K = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'admin',
                type: 'address',
            },
        ],
        name: 'ERC1967InvalidAdmin',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'beacon',
                type: 'address',
            },
        ],
        name: 'ERC1967InvalidBeacon',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
            },
        ],
        name: 'ERC1967InvalidImplementation',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ERC1967NonPayable',
        type: 'error',
    },
];
const _bytecode$k =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212206ed1569ec487f7c031741ee858b05c87f55623441520321d77dd4f342fe58eaf64736f6c634300081e0033';
const isSuperArgs$k = (xs) => xs.length > 1;
class ERC1967Utils__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$k(args)) {
            super(...args);
        } else {
            super(_abi$K, _bytecode$k, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$k;
    static abi = _abi$K;
    static createInterface() {
        return new Interface(_abi$K);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$K, runner);
    }
}

var index$1b = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC1967Utils__factory: ERC1967Utils__factory,
});

var index$1a = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc1967UtilsSol: index$1b,
});

const _abi$J = [
    {
        stateMutability: 'payable',
        type: 'fallback',
    },
];
class Proxy__factory {
    static abi = _abi$J;
    static createInterface() {
        return new Interface(_abi$J);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$J, runner);
    }
}

var index$19 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Proxy__factory: Proxy__factory,
});

const _abi$I = [
    {
        inputs: [],
        name: 'implementation',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class IBeacon__factory {
    static abi = _abi$I;
    static createInterface() {
        return new Interface(_abi$I);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$I, runner);
    }
}

var index$18 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IBeacon__factory: IBeacon__factory,
});

var index$17 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    iBeaconSol: index$18,
});

var index$16 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    beacon: index$17,
    erc1967: index$1a,
    proxySol: index$19,
});

const _abi$H = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class ERC20__factory {
    static abi = _abi$H;
    static createInterface() {
        return new Interface(_abi$H);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$H, runner);
    }
}

var index$15 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC20__factory: ERC20__factory,
});

const _abi$G = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IERC20__factory {
    static abi = _abi$G;
    static createInterface() {
        return new Interface(_abi$G);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$G, runner);
    }
}

var index$14 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC20__factory: IERC20__factory,
});

const _abi$F = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class ERC20Burnable__factory {
    static abi = _abi$F;
    static createInterface() {
        return new Interface(_abi$F);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$F, runner);
    }
}

var index$13 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC20Burnable__factory: ERC20Burnable__factory,
});

const _abi$E = [
    {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
        ],
        name: 'ERC2612ExpiredSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'signer',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC2612InvalidSigner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentNonce',
                type: 'uint256',
            },
        ],
        name: 'InvalidAccountNonce',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidShortString',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'str',
                type: 'string',
            },
        ],
        name: 'StringTooLong',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class ERC20Permit__factory {
    static abi = _abi$E;
    static createInterface() {
        return new Interface(_abi$E);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$E, runner);
    }
}

var index$12 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC20Permit__factory: ERC20Permit__factory,
});

const _abi$D = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IERC20Metadata__factory {
    static abi = _abi$D;
    static createInterface() {
        return new Interface(_abi$D);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$D, runner);
    }
}

var index$11 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC20Metadata__factory: IERC20Metadata__factory,
});

const _abi$C = [
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IERC20Permit__factory {
    static abi = _abi$C;
    static createInterface() {
        return new Interface(_abi$C);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$C, runner);
    }
}

var index$10 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC20Permit__factory: IERC20Permit__factory,
});

var index$$ = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc20BurnableSol: index$13,
    erc20PermitSol: index$12,
    ierc20MetadataSol: index$11,
    ierc20PermitSol: index$10,
});

const _abi$B = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentAllowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'requestedDecrease',
                type: 'uint256',
            },
        ],
        name: 'SafeERC20FailedDecreaseAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
        ],
        name: 'SafeERC20FailedOperation',
        type: 'error',
    },
];
const _bytecode$j =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220d57eaa45de52902238ed4894622845854acef76a355b4f0a7a72bbe5e6ce635964736f6c634300081e0033';
const isSuperArgs$j = (xs) => xs.length > 1;
class SafeERC20__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$j(args)) {
            super(...args);
        } else {
            super(_abi$B, _bytecode$j, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$j;
    static abi = _abi$B;
    static createInterface() {
        return new Interface(_abi$B);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$B, runner);
    }
}

var index$_ = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    SafeERC20__factory: SafeERC20__factory,
});

var index$Z = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    safeErc20Sol: index$_,
});

var index$Y = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc20Sol: index$15,
    extensions: index$$,
    ierc20Sol: index$14,
    utils: index$Z,
});

var index$X = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc20: index$Y,
});

const _abi$A = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'target',
                type: 'address',
            },
        ],
        name: 'AddressEmptyCode',
        type: 'error',
    },
];
const _bytecode$i =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122091cc318d4ec4f71382606ca691c012d3c80b7db626ffe05df671942891c9a48d64736f6c634300081e0033';
const isSuperArgs$i = (xs) => xs.length > 1;
class Address__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$i(args)) {
            super(...args);
        } else {
            super(_abi$A, _bytecode$i, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$i;
    static abi = _abi$A;
    static createInterface() {
        return new Interface(_abi$A);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$A, runner);
    }
}

var index$W = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Address__factory: Address__factory,
});

const _abi$z = [
    {
        inputs: [],
        name: 'FailedCall',
        type: 'error',
    },
    {
        inputs: [],
        name: 'FailedDeployment',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'MissingPrecompile',
        type: 'error',
    },
];
const _bytecode$h =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212205ec176cb726f7fe3b75f34c13949cc4822001c49944eeff4dc8c5146b1f7d04e64736f6c634300081e0033';
const isSuperArgs$h = (xs) => xs.length > 1;
class Errors__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$h(args)) {
            super(...args);
        } else {
            super(_abi$z, _bytecode$h, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$h;
    static abi = _abi$z;
    static createInterface() {
        return new Interface(_abi$z);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$z, runner);
    }
}

var index$V = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Errors__factory: Errors__factory,
});

const _abi$y = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentNonce',
                type: 'uint256',
            },
        ],
        name: 'InvalidAccountNonce',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class Nonces__factory {
    static abi = _abi$y;
    static createInterface() {
        return new Interface(_abi$y);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$y, runner);
    }
}

var index$U = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Nonces__factory: Nonces__factory,
});

const _abi$x = [
    {
        inputs: [],
        name: 'InvalidShortString',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'str',
                type: 'string',
            },
        ],
        name: 'StringTooLong',
        type: 'error',
    },
];
const _bytecode$g =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220917613a79e91b23f7aebef878fb4f69258b9fd996fef36427786b01f2a894b0664736f6c634300081e0033';
const isSuperArgs$g = (xs) => xs.length > 1;
class ShortStrings__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$g(args)) {
            super(...args);
        } else {
            super(_abi$x, _bytecode$g, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$g;
    static abi = _abi$x;
    static createInterface() {
        return new Interface(_abi$x);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$x, runner);
    }
}

var index$T = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ShortStrings__factory: ShortStrings__factory,
});

const _abi$w = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'StringsInsufficientHexLength',
        type: 'error',
    },
    {
        inputs: [],
        name: 'StringsInvalidAddressFormat',
        type: 'error',
    },
    {
        inputs: [],
        name: 'StringsInvalidChar',
        type: 'error',
    },
];
const _bytecode$f =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220d95c26fd319c9c585343f46ca19353f74a5b604f432447e57b065b1d1a76a5e164736f6c634300081e0033';
const isSuperArgs$f = (xs) => xs.length > 1;
class Strings__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$f(args)) {
            super(...args);
        } else {
            super(_abi$w, _bytecode$f, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$f;
    static abi = _abi$w;
    static createInterface() {
        return new Interface(_abi$w);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$w, runner);
    }
}

var index$S = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Strings__factory: Strings__factory,
});

const _abi$v = [
    {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
    },
];
const _bytecode$e =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212209e1f979569d8d58fa9306ffdc98ce164837aa5373c3f14fff50d6016b25549b264736f6c634300081e0033';
const isSuperArgs$e = (xs) => xs.length > 1;
class ECDSA__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$e(args)) {
            super(...args);
        } else {
            super(_abi$v, _bytecode$e, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$e;
    static abi = _abi$v;
    static createInterface() {
        return new Interface(_abi$v);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$v, runner);
    }
}

var index$R = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ECDSA__factory: ECDSA__factory,
});

const _abi$u = [
    {
        inputs: [],
        name: 'InvalidShortString',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'str',
                type: 'string',
            },
        ],
        name: 'StringTooLong',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class EIP712__factory {
    static abi = _abi$u;
    static createInterface() {
        return new Interface(_abi$u);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$u, runner);
    }
}

var index$Q = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    EIP712__factory: EIP712__factory,
});

var index$P = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ecdsaSol: index$R,
    eip712Sol: index$Q,
});

const _abi$t = [
    {
        inputs: [
            {
                internalType: 'bytes4',
                name: 'interfaceId',
                type: 'bytes4',
            },
        ],
        name: 'supportsInterface',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class IERC165__factory {
    static abi = _abi$t;
    static createInterface() {
        return new Interface(_abi$t);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$t, runner);
    }
}

var index$O = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC165__factory: IERC165__factory,
});

var index$N = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ierc165Sol: index$O,
});

const _abi$s = [
    {
        inputs: [
            {
                internalType: 'uint8',
                name: 'bits',
                type: 'uint8',
            },
            {
                internalType: 'int256',
                name: 'value',
                type: 'int256',
            },
        ],
        name: 'SafeCastOverflowedIntDowncast',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'int256',
                name: 'value',
                type: 'int256',
            },
        ],
        name: 'SafeCastOverflowedIntToUint',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint8',
                name: 'bits',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'SafeCastOverflowedUintDowncast',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'SafeCastOverflowedUintToInt',
        type: 'error',
    },
];
const _bytecode$d =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212205a2787ecd84b455e7e1315bd94b9d5025ce1d062fff587724c8528a572883d9264736f6c634300081e0033';
const isSuperArgs$d = (xs) => xs.length > 1;
class SafeCast__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$d(args)) {
            super(...args);
        } else {
            super(_abi$s, _bytecode$d, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$d;
    static abi = _abi$s;
    static createInterface() {
        return new Interface(_abi$s);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$s, runner);
    }
}

var index$M = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    SafeCast__factory: SafeCast__factory,
});

var index$L = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    safeCastSol: index$M,
});

var index$K = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    addressSol: index$W,
    cryptography: index$P,
    errorsSol: index$V,
    introspection: index$N,
    math: index$L,
    noncesSol: index$U,
    shortStringsSol: index$T,
    stringsSol: index$S,
});

var index$J = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    access: index$1h,
    interfaces: index$1c,
    proxy: index$16,
    token: index$X,
    utils: index$K,
});

const _abi$r = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class OwnableUpgradeable__factory {
    static abi = _abi$r;
    static createInterface() {
        return new Interface(_abi$r);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$r, runner);
    }
}

var index$I = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    OwnableUpgradeable__factory: OwnableUpgradeable__factory,
});

var index$H = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ownableUpgradeableSol: index$I,
});

const _abi$q = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
];
class Initializable__factory {
    static abi = _abi$q;
    static createInterface() {
        return new Interface(_abi$q);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$q, runner);
    }
}

var index$G = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Initializable__factory: Initializable__factory,
});

var index$F = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    initializableSol: index$G,
});

var index$E = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    utils: index$F,
});

const _abi$p = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class ERC20Upgradeable__factory {
    static abi = _abi$p;
    static createInterface() {
        return new Interface(_abi$p);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$p, runner);
    }
}

var index$D = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC20Upgradeable__factory: ERC20Upgradeable__factory,
});

const _abi$o = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class ERC20BurnableUpgradeable__factory {
    static abi = _abi$o;
    static createInterface() {
        return new Interface(_abi$o);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$o, runner);
    }
}

var index$C = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC20BurnableUpgradeable__factory: ERC20BurnableUpgradeable__factory,
});

const _abi$n = [
    {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
        ],
        name: 'ERC2612ExpiredSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'signer',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC2612InvalidSigner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentNonce',
                type: 'uint256',
            },
        ],
        name: 'InvalidAccountNonce',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class ERC20PermitUpgradeable__factory {
    static abi = _abi$n;
    static createInterface() {
        return new Interface(_abi$n);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$n, runner);
    }
}

var index$B = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC20PermitUpgradeable__factory: ERC20PermitUpgradeable__factory,
});

var index$A = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc20BurnableUpgradeableSol: index$C,
    erc20PermitUpgradeableSol: index$B,
});

var index$z = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc20UpgradeableSol: index$D,
    extensions: index$A,
});

var index$y = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc20: index$z,
});

const _abi$m = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
];
class ContextUpgradeable__factory {
    static abi = _abi$m;
    static createInterface() {
        return new Interface(_abi$m);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$m, runner);
    }
}

var index$x = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ContextUpgradeable__factory: ContextUpgradeable__factory,
});

const _abi$l = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentNonce',
                type: 'uint256',
            },
        ],
        name: 'InvalidAccountNonce',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class NoncesUpgradeable__factory {
    static abi = _abi$l;
    static createInterface() {
        return new Interface(_abi$l);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$l, runner);
    }
}

var index$w = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    NoncesUpgradeable__factory: NoncesUpgradeable__factory,
});

const _abi$k = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ReentrancyGuardReentrantCall',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
];
class ReentrancyGuardUpgradeable__factory {
    static abi = _abi$k;
    static createInterface() {
        return new Interface(_abi$k);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$k, runner);
    }
}

var index$v = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ReentrancyGuardUpgradeable__factory: ReentrancyGuardUpgradeable__factory,
});

const _abi$j = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class EIP712Upgradeable__factory {
    static abi = _abi$j;
    static createInterface() {
        return new Interface(_abi$j);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$j, runner);
    }
}

var index$u = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    EIP712Upgradeable__factory: EIP712Upgradeable__factory,
});

var index$t = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    eip712UpgradeableSol: index$u,
});

var index$s = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    contextUpgradeableSol: index$x,
    cryptography: index$t,
    noncesUpgradeableSol: index$w,
    reentrancyGuardUpgradeableSol: index$v,
});

var index$r = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    access: index$H,
    proxy: index$E,
    token: index$y,
    utils: index$s,
});

var index$q = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    contracts: index$J,
    contractsUpgradeable: index$r,
});

const _abi$i = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ReentrancyGuardReentrantCall',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
        ],
        name: 'SafeERC20FailedOperation',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newSettler',
                type: 'address',
            },
        ],
        name: 'AddSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'goldToken',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'goldTokenDecimals',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'USDT',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'USDTDecimals',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'USDC',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint8',
                name: 'USDCDecimals',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'goldPriceFeed',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'goldReserveFeed',
                type: 'address',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'oldSettler',
                type: 'address',
            },
        ],
        name: 'RemoveSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'seller',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'usdToken',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'goldAmount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minUsdAmount',
                type: 'uint256',
            },
        ],
        name: 'RequestBurn',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'buyer',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'usdToken',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'usdAmount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minGoldAmount',
                type: 'uint256',
            },
        ],
        name: 'RequestMint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'usdAmount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
        ],
        name: 'SettleBurn',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'nonce',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'goldAmount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
        ],
        name: 'SettleMint',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'bool',
                name: 'settle',
                type: 'bool',
            },
        ],
        name: 'UpdateAutoSettle',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: 'newFees',
                type: 'uint16',
            },
        ],
        name: 'UpdateFees',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'enum GoldMinter.Levels',
                name: 'level',
                type: 'uint8',
            },
        ],
        name: 'UpdateLevel',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minGoldAmount',
                type: 'uint256',
            },
        ],
        name: 'UpdateMinGold',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minGoldFee',
                type: 'uint256',
            },
        ],
        name: 'UpdateMinGoldFee',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'minGoldFeeAmount',
                type: 'uint256',
            },
        ],
        name: 'UpdateMinGoldFeeAmount',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newRecipient',
                type: 'address',
            },
        ],
        name: 'UpdateRecipient',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint16',
                name: 'newSlippage',
                type: 'uint16',
            },
        ],
        name: 'UpdateSlippage',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'enum GoldMinter.Levels',
                name: 'level',
                type: 'uint8',
            },
        ],
        name: 'UpdateTradingLevel',
        type: 'event',
    },
    {
        inputs: [],
        name: 'USDC',
        outputs: [
            {
                internalType: 'contract IERC20Exp',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'USDT',
        outputs: [
            {
                internalType: 'contract IERC20Exp',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'addSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'autoSettle',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'burnOrders',
        outputs: [
            {
                internalType: 'address',
                name: 'seller',
                type: 'address',
            },
            {
                internalType: 'contract IERC20Exp',
                name: 'usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'goldAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'minUsdAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'usdAmount',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
            {
                internalType: 'bool',
                name: 'isSettled',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_goldAmount',
                type: 'uint256',
            },
        ],
        name: 'calculateGoldFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract IERC20Exp',
                name: 'usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'usdAmount',
                type: 'uint256',
            },
        ],
        name: 'canBurn',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'goldAmount',
                type: 'uint256',
            },
        ],
        name: 'canMint',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'fees',
        outputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'usdAmount',
                type: 'uint256',
            },
        ],
        name: 'getGoldAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'goldAmount',
                type: 'uint256',
            },
        ],
        name: 'getUsdAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'goldPriceFeed',
        outputs: [
            {
                internalType: 'contract IPriceFeed',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'goldReserveFeed',
        outputs: [
            {
                internalType: 'contract IPriceFeed',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'goldToken',
        outputs: [
            {
                internalType: 'contract IERC20Mintable',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_goldToken',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_USDT',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_USDC',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_goldPriceFeed',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_goldReserveFeed',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_usdRecipient',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: '_autoSettle',
                type: 'bool',
            },
        ],
        name: 'initializeGoldMinter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
        ],
        name: 'initializeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'levels',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'minGoldAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'minGoldFee',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'minGoldFeeAmount',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'mintOrders',
        outputs: [
            {
                internalType: 'address',
                name: 'buyer',
                type: 'address',
            },
            {
                internalType: 'contract IERC20Exp',
                name: 'usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'usdAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'minGoldAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'goldAmount',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
            {
                internalType: 'bool',
                name: 'isSettled',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'removeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_goldAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_minUsdAmount',
                type: 'uint256',
            },
        ],
        name: 'requestBurn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_goldAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_minUsdAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_sigDeadline',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_signature',
                type: 'bytes',
            },
        ],
        name: 'requestBurnPermit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_usdAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_minGoldAmount',
                type: 'uint256',
            },
        ],
        name: 'requestMint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_usdToken',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_usdAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_minGoldAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_sigDeadline',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_signature',
                type: 'bytes',
            },
        ],
        name: 'requestMintPermit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                internalType: 'enum GoldMinter.Levels',
                name: 'level',
                type: 'uint8',
            },
        ],
        name: 'setLevel',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'burnNonce',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'usdAmount',
                type: 'uint256',
            },
        ],
        name: 'settleBurn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'mintNonce',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'goldAmount',
                type: 'uint256',
            },
        ],
        name: 'settleMint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settlers',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'slippage',
        outputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'tradeLevel',
        outputs: [
            {
                internalType: 'enum GoldMinter.Levels',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'updateAutoSettle',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint8',
                name: '_fees',
                type: 'uint8',
            },
        ],
        name: 'updateFees',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_minGold',
                type: 'uint256',
            },
        ],
        name: 'updateMinGold',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_minGoldFee',
                type: 'uint256',
            },
        ],
        name: 'updateMinGoldFee',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_minGoldFeeAmount',
                type: 'uint256',
            },
        ],
        name: 'updateMinGoldFeeAmount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_usdRecipient',
                type: 'address',
            },
        ],
        name: 'updateRecipient',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint8',
                name: '_slippage',
                type: 'uint8',
            },
        ],
        name: 'updateSlippage',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'enum GoldMinter.Levels',
                name: 'level',
                type: 'uint8',
            },
        ],
        name: 'updateTradingLevel',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'usdRecipient',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const _bytecode$c =
    '0x6080604052600a805464ffffffffff1916633201f40017905566470de4df820000600b55662386f26fc10000600c55670de0b6b3a7640000600d55600e805460ff19166001179055348015605257600080fd5b5061366e806100626000396000f3fe608060405234801561001057600080fd5b50600436106102735760003560e01c8063778048a011610151578063c54e44eb116100c3578063dae2f99a11610087578063dae2f99a146105fd578063e44a316914610606578063f2fde38b14610619578063f4b891571461062c578063fc93d5171461063f578063feec756c1461065257600080fd5b8063c54e44eb1461055a578063c5d1bbc21461056d578063ca852afb146105c4578063cbb6ae3e146105d7578063d25f3d3c146105ea57600080fd5b80639af1d35a116101155780639af1d35a146104e95780639eff0227146104fe578063ad89bbb014610516578063b1da41fe1461051f578063bbde387514610534578063c422f9d01461054757600080fd5b8063778048a01461046d57806389a30271146104805780638da5cb5b1461049357806394002b57146104c3578063986d7a69146104d657600080fd5b80634645b6dc116101ea5780634f863ea1116101ae5780634f863ea1146103ee5780635dd871a31461040157806361b0402d146104145780636bffc96214610427578063715018a61461043a57806374064a431461044257600080fd5b80634645b6dc1461036657806347082db314610379578063491e68e2146103ae578063493f4f12146103c85780634b69c0d5146103db57600080fd5b80631f6a02671161023c5780631f6a0267146102ec578063329bad171461030957806333138a841461031c578063356d2c66146103255780633e032a3b1461032d578063404588d41461035357600080fd5b8062b105e61461027857806308e7a41e1461028d57806314d3940d146102a057806316222b19146102b3578063186cf2b9146102c6575b600080fd5b61028b610286366004612fff565b610665565b005b61028b61029b366004613032565b610707565b61028b6102ae366004612fff565b61079e565b61028b6102c1366004613032565b610837565b6102d96102d436600461311b565b610906565b6040519081526020015b60405180910390f35b600e546102f99060ff1681565b60405190151581526020016102e3565b61028b610317366004612fff565b610946565b6102d9600b5481565b61028b610a42565b600a5461034090610100900461ffff1681565b60405161ffff90911681526020016102e3565b61028b610361366004613134565b610aaa565b6102f96103743660046131e2565b610d29565b61039c610387366004612fff565b60076020526000908152604090205460ff1681565b60405160ff90911681526020016102e3565b600a546103bb9060ff1681565b6040516102e39190613224565b61028b6103d636600461311b565b610daa565b61028b6103e9366004613260565b610de7565b61028b6103fc36600461328a565b610e42565b6102f961040f36600461311b565b610ed7565b61028b61042236600461311b565b6110f8565b61028b6104353660046132a7565b611135565b61028b61116a565b600654610455906001600160a01b031681565b6040516001600160a01b0390911681526020016102e3565b61028b61047b3660046132a7565b61117e565b600454610455906001600160a01b031681565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b0316610455565b600254610455906001600160a01b031681565b61028b6104e43660046132c9565b6111af565b600a54610340906301000000900461ffff1681565b600e546104559061010090046001600160a01b031681565b6102d9600d5481565b61052761158d565b6040516102e391906132fe565b61028b6105423660046132c9565b61159e565b600554610455906001600160a01b031681565b600354610455906001600160a01b031681565b61058061057b36600461311b565b611935565b604080516001600160a01b0398891681529790961660208801529486019390935260608501919091526080840152151560a0830152151560c082015260e0016102e3565b61028b6105d236600461311b565b611994565b6105806105e536600461311b565b6119d1565b6102d96105f83660046131e2565b6119e1565b6102d9600c5481565b61028b61061436600461334a565b611bf8565b61028b610627366004612fff565b611c99565b6102d961063a3660046131e2565b611cd7565b61028b61064d36600461328a565b611eda565b61028b610660366004612fff565b611f6b565b61066d611fc9565b61067860008261203f565b6106bb5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b6106c6600082612064565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b600080600061071584612079565b60025460405163d505accf60e01b815293965091945092506001600160a01b03169063d505accf9061075790339030908c908b908a908a908a9060040161337f565b600060405180830381600087803b15801561077157600080fd5b505af1158015610785573d6000803e3d6000fd5b5050505061079488888861159e565b5050505050505050565b6107a6611fc9565b6107b160008261203f565b156107f25760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b60448201526064016106b2565b6107fd6000826120c3565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016106fc565b600080600061084584612079565b60035492955090935091506000906001600160a01b038a8116911614610876576004546001600160a01b0316610883565b6003546001600160a01b03165b60405163d505accf60e01b81529091506001600160a01b0382169063d505accf906108be90339030908d908c908b908b908b9060040161337f565b600060405180830381600087803b1580156108d857600080fd5b505af11580156108ec573d6000803e3d6000fd5b505050506108fb8989896111af565b505050505050505050565b6000600d5482101561091a575050600c5490565b600a5461271090610936906301000000900461ffff16846133d6565b61094091906133ed565b92915050565b60006109506120d8565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156109785750825b905060008267ffffffffffffffff1660011480156109955750303b155b9050811580156109a3575080155b156109c15760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156109eb57845460ff60401b1916600160401b1785555b6109f486612101565b8315610a3a57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b610a4a611fc9565b600e5460ff16610a5b576001610a5e565b60005b600e805460ff1916911515918217905560405160ff909116151581527ffab1a2e8d359cc6254f5d7cb67a07c879262e5265e7099012b96ed60aace3bd9906020015b60405180910390a1565b6000610ab46120d8565b805490915060ff600160401b820416159067ffffffffffffffff16600081158015610adc5750825b905060008267ffffffffffffffff166001148015610af95750303b155b905081158015610b07575080155b15610b255760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610b4f57845460ff60401b1916600160401b1785555b8c600260006101000a8154816001600160a01b0302191690836001600160a01b031602179055508b600360006101000a8154816001600160a01b0302191690836001600160a01b031602179055508a600460006101000a8154816001600160a01b0302191690836001600160a01b0316021790555089600560006101000a8154816001600160a01b0302191690836001600160a01b0316021790555088600660006101000a8154816001600160a01b0302191690836001600160a01b031602179055506101f4600a60016101000a81548161ffff021916908361ffff1602179055506032600a60036101000a81548161ffff021916908361ffff16021790555066470de4df820000600b81905550662386f26fc10000600c81905550670de0b6b3a7640000600d8190555085600e60006101000a81548160ff02191690831515021790555087600e60016101000a8154816001600160a01b0302191690836001600160a01b03160217905550610cc361211b565b610ccc87612101565b610cd461212b565b8315610d1a57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050505050505050565b600e546040516370a0823160e01b81526101009091046001600160a01b03908116600483015260009183918516906370a0823190602401602060405180830381865afa158015610d7d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610da1919061340f565b10159392505050565b610db2611fc9565b600b8190556040518181527f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d647906020016106fc565b610def611fc9565b600a805482919060ff19166001836002811115610e0e57610e0e61320e565b02179055507ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1816040516106fc9190613224565b610e4a611fc9565b6103e88160ff1610610e895760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b60448201526064016106b2565b600a805464ffff000000191660ff831663010000008102919091179091556040519081527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc906020016106fc565b600080600260009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610f2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f51919061340f565b90506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610fa8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fcc9190613428565b90506000600660009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611023573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110479190613428565b905060006110558284613445565b61106090600a613545565b600660009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156110b3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110d7919061340f565b6110e191906133d6565b90506110ed8685613554565b111595945050505050565b611100611fc9565b600d8190556040518181527f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545906020016106fc565b61114060003361203f565b61115c5760405162461bcd60e51b81526004016106b290613567565b61116682826124df565b5050565b611172611fc9565b61117c6000612850565b565b61118960003361203f565b6111a55760405162461bcd60e51b81526004016106b290613567565b61116682826128c1565b6111b7612c84565b60006111c38484611cd7565b600a549091508290612710906111e290610100900461ffff168261358c565b6111f09061ffff16846133d6565b6111fa91906133ed565b1180156112375750600a546127109061121c90610100900461ffff16826135a6565b61122a9061ffff16836133d6565b61123491906133ed565b82115b6112715760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b60448201526064016106b2565b600b548210156112b15760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b60448201526064016106b2565b600a5460ff1660028111156112c8576112c861320e565b3360009081526007602052604090205460ff1610156113165760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b60448201526064016106b2565b6003546000906001600160a01b0386811691161461133f576004546001600160a01b031661134c565b6003546001600160a01b03165b600e54909150611371906001600160a01b038084169133916101009091041687612cbc565b600880546040805160e081018252338082526001600160a01b03868116602084019081528385018b8152606085018b815260006080870181815260a0880182815260c0890183815260018c018d559b909252965160068a027ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3810180549288166001600160a01b031993841617905594517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee4860180549190971691161790945590517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee5830155517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee682015592517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee7840155517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee89092018054955115156101000261ff00199315159390931661ffff1990961695909517919091179093555190919082907f69c44c537610b2d184f027357271fee6d9eb25ae2b4ccc21d6e56c7bec184196906115419086908a908a906001600160a01b039390931683526020830191909152604082015260600190565b60405180910390a3600e5460ff16801561155f575061155f83610ed7565b1561156e5761156e81846128c1565b505050611588600160008051602061361983398151915255565b505050565b60606115996000612d3d565b905090565b6115a6612c84565b60006115b284846119e1565b600a549091508290612710906115d190610100900461ffff168261358c565b6115df9061ffff16846133d6565b6115e991906133ed565b101580156116275750600a546127109061160c90610100900461ffff16826135a6565b61161a9061ffff16836133d6565b61162491906133ed565b82115b6116615760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b60448201526064016106b2565b600b548310156116a15760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b60448201526064016106b2565b600a5460ff1660028111156116b8576116b861320e565b3360009081526007602052604090205460ff1610156117065760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b60448201526064016106b2565b60025461171e906001600160a01b0316333086612cbc565b600980546040805160e081018252338082526001600160a01b03898116602084019081528385018a8152606085018a815260006080870181815260a0880182815260c0890183815260018c018d559b909252965160068a027f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af810180549288166001600160a01b031993841617905594517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b0860180549190971691161790945590517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b1830155517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b282015592517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b3840155517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b49092018054955115156101000261ff00199315159390931661ffff1990961695909517919091179093555190919082907fafae12d8098a1b101657c8062a2634db5c9682923925dfbbd7bee9fb14dea6dc906118ee908990899089906001600160a01b039390931683526020830191909152604082015260600190565b60405180910390a3600e5460ff16801561190d575061190d8583610d29565b1561191c5761191c81836124df565b5050611588600160008051602061361983398151915255565b6009818154811061194557600080fd5b60009182526020909120600690910201805460018201546002830154600384015460048501546005909501546001600160a01b0394851696509390921693909260ff8082169161010090041687565b61199c611fc9565b600c8190556040518181527f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f906020016106fc565b6008818154811061194557600080fd5b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611a39573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a5d919061340f565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611ab0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ad49190613428565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611b2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b519190613428565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611b93573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bb79190613428565b905080611bc483856135c0565b611bce9190613445565b611bd990600a613545565b611be385886133d6565b611bed91906133ed565b979650505050505050565b611c0360003361203f565b611c1f5760405162461bcd60e51b81526004016106b290613567565b806002811115611c3157611c3161320e565b6001600160a01b03831660008181526007602052604090819020805460ff191660ff949094169390931790925590517facee830aed55effdcd51d2550a784305c145560f19aaa8f7e02c076e4e15e28490611c8d908490613224565b60405180910390a25050565b611ca1611fc9565b6001600160a01b038116611ccb57604051631e4fbdf760e01b8152600060048201526024016106b2565b611cd481612850565b50565b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611d2f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611d53919061340f565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611da6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dca9190613428565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611e23573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611e479190613428565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611e89573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ead9190613428565b90508381611ebb84866135c0565b611ec59190613445565b611ed090600a613545565b611be390886133d6565b611ee2611fc9565b6103e88160ff1610611f215760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b60448201526064016106b2565b600a805462ffff00191660ff83166101008102919091179091556040519081527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f906020016106fc565b611f73611fc9565b600e8054610100600160a81b0319166101006001600160a01b038416908102919091179091556040519081527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de906020016106fc565b6000611ffc7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b90506001600160a01b0381161580159061201f57506001600160a01b0381163314155b15611cd45760405163118cdaa760e01b81523360048201526024016106b2565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b600061205d836001600160a01b038416612d4a565b600080600083516041036120a35750505060208101516040820151606083015160001a91906120bc565b604051634be6321b60e01b815260040160405180910390fd5b9193909250565b600061205d836001600160a01b038416612e3d565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610940565b6001600160a01b0381166121125750335b6107f281612e8c565b612123612e9d565b61117c612ec2565b600a5460405161010090910461ffff1681527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f9060200160405180910390a1600a54604051630100000090910461ffff1681527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc9060200160405180910390a17f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d647600b546040516121de91815260200190565b60405180910390a17f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f600c5460405161221991815260200190565b60405180910390a17f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545600d5460405161225491815260200190565b60405180910390a1600e5460405160ff909116151581527ffab1a2e8d359cc6254f5d7cb67a07c879262e5265e7099012b96ed60aace3bd99060200160405180910390a1600a546040517ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1916122cf9160ff90911690613224565b60405180910390a1600e546040516101009091046001600160a01b031681527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de9060200160405180910390a16002546040805163313ce56760e01b815290517f60ca852ff1baba03007bc4713a71dae297c308708cf17c690276b3daed7ab76e926001600160a01b031691829163313ce567916004808201926020929091908290030181865afa158015612387573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123ab9190613428565b6003546040805163313ce56760e01b815290516001600160a01b0390921691829163313ce5679160048083019260209291908290030181865afa1580156123f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061241a9190613428565b600480546040805163313ce56760e01b815290516001600160a01b0390921692839263313ce5679280830192602092918290030181865afa158015612463573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124879190613428565b600554600654604080516001600160a01b03998a16815260ff9889166020820152968916908701529386166060860152918616608085015290931660a083015291831660c0820152911660e082015261010001610aa0565b60095482106125205760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b60448201526064016106b2565b60098281548110612533576125336135d9565b906000526020600020906006020160050160019054906101000a900460ff16156125915760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b60448201526064016106b2565b6000600983815481106125a6576125a66135d9565b60009182526020822060016006909202010154600980546001600160a01b03909216935090859081106125db576125db6135d9565b9060005260206000209060060201600201549050600060098581548110612604576126046135d9565b906000526020600020906006020160030154841015801561262a575061262a8385610d29565b9050806126735761266e60098681548110612647576126476135d9565b60009182526020909120600690910201546002546001600160a01b03908116911684612eca565b61278b565b8360098681548110612687576126876135d9565b90600052602060002090600602016004018190555060006126a783610906565b6002549091506001600160a01b03166342966c686126c583866135ef565b6040518263ffffffff1660e01b81526004016126e391815260200190565b600060405180830381600087803b1580156126fd57600080fd5b505af1158015612711573d6000803e3d6000fd5b5050600e5460025461273893506001600160a01b0390811692506101009091041683612eca565b612789600e60019054906101000a90046001600160a01b031660098881548110612764576127646135d9565b60009182526020909120600690910201546001600160a01b0387811692911688612cbc565b505b806009868154811061279f5761279f6135d9565b906000526020600020906006020160050160006101000a81548160ff0219169083151502179055506001600986815481106127dc576127dc6135d9565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550847f565ba89d889ea15e45400288c17db6816d132602d710eb66d0f3d9557c29481685836040516128419291909182521515602082015260400190565b60405180910390a25050505050565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60085482106129025760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b60448201526064016106b2565b60088281548110612915576129156135d9565b906000526020600020906006020160050160019054906101000a900460ff16156129735760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b60448201526064016106b2565b600060088381548110612988576129886135d9565b90600052602060002090600602016003015482101580156129ad57506129ad82610ed7565b905080612a7057600080600885815481106129ca576129ca6135d9565b906000526020600020906006020160010160009054906101000a90046001600160a01b031660088681548110612a0257612a026135d9565b90600052602060002090600602016002015491509150612a69600e60019054906101000a90046001600160a01b031660088781548110612a4457612a446135d9565b60009182526020909120600690910201546001600160a01b0385811692911684612cbc565b5050612bc1565b8160088481548110612a8457612a846135d9565b9060005260206000209060060201600401819055506000612aa483610906565b600254600e546040516340c10f1960e01b81526001600160a01b03610100909204821660048201526024810184905292935016906340c10f1990604401600060405180830381600087803b158015612afb57600080fd5b505af1158015612b0f573d6000803e3d6000fd5b5050600254600880546001600160a01b0390921693506340c10f1992509087908110612b3d57612b3d6135d9565b60009182526020909120600690910201546001600160a01b0316612b6184876135ef565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401600060405180830381600087803b158015612ba757600080fd5b505af1158015612bbb573d6000803e3d6000fd5b50505050505b8060088481548110612bd557612bd56135d9565b906000526020600020906006020160050160006101000a81548160ff021916908315150217905550600160088481548110612c1257612c126135d9565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550827f7bc692b63ac50deef5b78a403ab84227a3ba4c9400ece341f913ea1b0bcff2a38383604051612c779291909182521515602082015260400190565b60405180910390a2505050565b600080516020613619833981519152805460011901612cb657604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b6040516001600160a01b038481166024830152838116604483015260648201839052612d239186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050612efb565b50505050565b600160008051602061361983398151915255565b6060600061205d83612f6c565b60008181526001830160205260408120548015612e33576000612d6e6001836135ef565b8554909150600090612d82906001906135ef565b9050808214612de7576000866000018281548110612da257612da26135d9565b9060005260206000200154905080876000018481548110612dc557612dc56135d9565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612df857612df8613602565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610940565b6000915050610940565b6000818152600183016020526040812054612e8457508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610940565b506000610940565b612e94612e9d565b611cd481612fc8565b612ea5612fd0565b61117c57604051631afcd79f60e31b815260040160405180910390fd5b612d29612e9d565b6040516001600160a01b0383811660248301526044820183905261158891859182169063a9059cbb90606401612cf1565b600080602060008451602086016000885af180612f1e576040513d6000823e3d81fd5b50506000513d91508115612f36578060011415612f43565b6001600160a01b0384163b155b15612d2357604051635274afe760e01b81526001600160a01b03851660048201526024016106b2565b606081600001805480602002602001604051908101604052809291908181526020018280548015612fbc57602002820191906000526020600020905b815481526020019060010190808311612fa8575b50505050509050919050565b611ca1612e9d565b6000612fda6120d8565b54600160401b900460ff16919050565b6001600160a01b0381168114611cd457600080fd5b60006020828403121561301157600080fd5b813561205d81612fea565b634e487b7160e01b600052604160045260246000fd5b600080600080600060a0868803121561304a57600080fd5b853561305581612fea565b9450602086013593506040860135925060608601359150608086013567ffffffffffffffff81111561308657600080fd5b8601601f8101881361309757600080fd5b803567ffffffffffffffff8111156130b1576130b161301c565b604051601f8201601f19908116603f0116810167ffffffffffffffff811182821017156130e0576130e061301c565b6040528181528282016020018a10156130f857600080fd5b816020840160208301376000602083830101528093505050509295509295909350565b60006020828403121561312d57600080fd5b5035919050565b600080600080600080600080610100898b03121561315157600080fd5b883561315c81612fea565b9750602089013561316c81612fea565b9650604089013561317c81612fea565b9550606089013561318c81612fea565b9450608089013561319c81612fea565b935060a08901356131ac81612fea565b925060c08901356131bc81612fea565b915060e089013580151581146131d157600080fd5b809150509295985092959890939650565b600080604083850312156131f557600080fd5b823561320081612fea565b946020939093013593505050565b634e487b7160e01b600052602160045260246000fd5b602081016003831061324657634e487b7160e01b600052602160045260246000fd5b91905290565b80356003811061325b57600080fd5b919050565b60006020828403121561327257600080fd5b61205d8261324c565b60ff81168114611cd457600080fd5b60006020828403121561329c57600080fd5b813561205d8161327b565b600080604083850312156132ba57600080fd5b50508035926020909101359150565b6000806000606084860312156132de57600080fd5b83356132e981612fea565b95602085013595506040909401359392505050565b602080825282518282018190526000918401906040840190835b8181101561333f5783516001600160a01b0316835260209384019390920191600101613318565b509095945050505050565b6000806040838503121561335d57600080fd5b823561336881612fea565b91506133766020840161324c565b90509250929050565b6001600160a01b0397881681529590961660208601526040850193909352606084019190915260ff16608083015260a082015260c081019190915260e00190565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610940576109406133c0565b60008261340a57634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561342157600080fd5b5051919050565b60006020828403121561343a57600080fd5b815161205d8161327b565b60ff8281168282160390811115610940576109406133c0565b6001815b60018411156134995780850481111561347d5761347d6133c0565b600184161561348b57908102905b60019390931c928002613462565b935093915050565b6000826134b057506001610940565b816134bd57506000610940565b81600181146134d357600281146134dd576134f9565b6001915050610940565b60ff8411156134ee576134ee6133c0565b50506001821b610940565b5060208310610133831016604e8410600b841016171561351c575081810a610940565b613529600019848461345e565b806000190482111561353d5761353d6133c0565b029392505050565b600061205d60ff8416836134a1565b80820180821115610940576109406133c0565b6020808252600b908201526a2727aa2fa9a2aa2a2622a960a91b604082015260600190565b61ffff8181168382160190811115610940576109406133c0565b61ffff8281168282160390811115610940576109406133c0565b60ff8181168382160190811115610940576109406133c0565b634e487b7160e01b600052603260045260246000fd5b81810381811115610940576109406133c0565b634e487b7160e01b600052603160045260246000fdfe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a264697066735822122045ecb0000d44375733cc8acfd8f80468deb18d9100767e1b684c27bb6879d37764736f6c634300081e0033';
const isSuperArgs$c = (xs) => xs.length > 1;
class GoldMinter__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$c(args)) {
            super(...args);
        } else {
            super(_abi$i, _bytecode$c, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$c;
    static abi = _abi$i;
    static createInterface() {
        return new Interface(_abi$i);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$i, runner);
    }
}

var index$p = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    GoldMinter__factory: GoldMinter__factory,
});

const _abi$h = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_unlockTime',
                type: 'uint256',
            },
        ],
        stateMutability: 'payable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'when',
                type: 'uint256',
            },
        ],
        name: 'Withdrawal',
        type: 'event',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address payable',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unlockTime',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
const _bytecode$b =
    '0x60806040526040516102a03803806102a08339810160408190526020916097565b804210607e5760405162461bcd60e51b815260206004820152602360248201527f556e6c6f636b2074696d652073686f756c6420626520696e207468652066757460448201526275726560e81b606482015260840160405180910390fd5b600055600180546001600160a01b0319163317905560af565b60006020828403121560a857600080fd5b5051919050565b6101e2806100be6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063251c1aa3146100465780633ccfd60b146100625780638da5cb5b1461006c575b600080fd5b61004f60005481565b6040519081526020015b60405180910390f35b61006a610097565b005b60015461007f906001600160a01b031681565b6040516001600160a01b039091168152602001610059565b6000544210156100e75760405162461bcd60e51b8152602060048201526016602482015275165bdd4818d85b89dd081dda5d1a191c985dc81e595d60521b60448201526064015b60405180910390fd5b6001546001600160a01b031633146101385760405162461bcd60e51b81526020600482015260146024820152732cb7ba9030b932b713ba103a34329037bbb732b960611b60448201526064016100de565b604080514781524260208201527fbf2ed60bd5b5965d685680c01195c9514e4382e28e3a5a2d2d5244bf59411b93910160405180910390a16001546040516001600160a01b03909116904780156108fc02916000818181858888f193505050501580156101a9573d6000803e3d6000fd5b5056fea2646970667358221220f01938c8290c1dd5e30daffea959f2a6c551cbeefa73a0b16f0407e719006b5464736f6c634300081e0033';
const isSuperArgs$b = (xs) => xs.length > 1;
class Lock__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$b(args)) {
            super(...args);
        } else {
            super(_abi$h, _bytecode$b, args[0]);
        }
    }
    getDeployTransaction(_unlockTime, overrides) {
        return super.getDeployTransaction(_unlockTime, overrides || {});
    }
    deploy(_unlockTime, overrides) {
        return super.deploy(_unlockTime, overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$b;
    static abi = _abi$h;
    static createInterface() {
        return new Interface(_abi$h);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$h, runner);
    }
}

var index$o = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Lock__factory: Lock__factory,
});

const _abi$g = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IERC20Exp__factory {
    static abi = _abi$g;
    static createInterface() {
        return new Interface(_abi$g);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$g, runner);
    }
}

const _abi$f = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class IERC20Mintable__factory {
    static abi = _abi$f;
    static createInterface() {
        return new Interface(_abi$f);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$f, runner);
    }
}

var index$n = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IERC20Exp__factory: IERC20Exp__factory,
    IERC20Mintable__factory: IERC20Mintable__factory,
});

const _abi$e = [
    {
        inputs: [],
        name: 'admin',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newAdmin',
                type: 'address',
            },
        ],
        name: 'changeAdmin',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'implementation',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
            {
                internalType: 'address',
                name: 'newAdmin',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newImplementation',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'initializeProxy',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'proxyDescription',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newImplementation',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'upgradeToAndCall',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
];
class IInitializableProxy__factory {
    static abi = _abi$e;
    static createInterface() {
        return new Interface(_abi$e);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$e, runner);
    }
}

var index$m = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IInitializableProxy__factory: IInitializableProxy__factory,
});

const _abi$d = [
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getTokenType',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRound',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class IPriceFeed__factory {
    static abi = _abi$d;
    static createInterface() {
        return new Interface(_abi$d);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$d, runner);
    }
}

var index$l = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    IPriceFeed__factory: IPriceFeed__factory,
});

var index$k = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    iInitializableProxySol: index$m,
    iPriceFeedSol: index$l,
    ierc20Sol: index$n,
});

const _abi$c = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
class Ownable__factory {
    static abi = _abi$c;
    static createInterface() {
        return new Interface(_abi$c);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$c, runner);
    }
}

var index$j = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Ownable__factory: Ownable__factory,
});

const _abi$b = [
    {
        inputs: [],
        name: 'InvalidSignatureLength',
        type: 'error',
    },
];
const _bytecode$a =
    '0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220141830cae7f79f0fc79a41f639667c64620ef6b77f23644308694e2679e4f6b464736f6c634300081e0033';
const isSuperArgs$a = (xs) => xs.length > 1;
class SigLib__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$a(args)) {
            super(...args);
        } else {
            super(_abi$b, _bytecode$a, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$a;
    static abi = _abi$b;
    static createInterface() {
        return new Interface(_abi$b);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$b, runner);
    }
}

var index$i = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    SigLib__factory: SigLib__factory,
});

const _abi$a = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newSettler',
                type: 'address',
            },
        ],
        name: 'AddSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'oldSettler',
                type: 'address',
            },
        ],
        name: 'RemoveSettler',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'addSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
        ],
        name: 'initializeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'removeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settlers',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
const _bytecode$9 =
    '0x6080604052348015600f57600080fd5b506108428061001f6000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c8063715018a61161005b578063715018a6146100bc5780638da5cb5b146100c4578063b1da41fe14610103578063f2fde38b1461011857600080fd5b8062b105e61461008157806314d3940d14610096578063329bad17146100a9575b600080fd5b61009461008f36600461074a565b61012b565b005b6100946100a436600461074a565b6101cd565b6100946100b736600461074a565b610266565b610094610362565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b0390911681526020015b60405180910390f35b61010b610376565b6040516100fa9190610773565b61009461012636600461074a565b610387565b6101336103c5565b61013e60008261043b565b6101815760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61018c600082610462565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6101d56103c5565b6101e060008261043b565b156102215760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610178565b61022c600082610477565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016101c2565b600061027061048c565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156102985750825b905060008267ffffffffffffffff1660011480156102b55750303b155b9050811580156102c3575080155b156102e15760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561030b57845460ff60401b1916600160401b1785555b610314866104b5565b831561035a57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b61036a6103c5565b61037460006104cf565b565b60606103826000610540565b905090565b61038f6103c5565b6001600160a01b0381166103b957604051631e4fbdf760e01b815260006004820152602401610178565b6103c2816104cf565b50565b60006103f87f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b90506001600160a01b0381161580159061041b57506001600160a01b0381163314155b156103c25760405163118cdaa760e01b8152336004820152602401610178565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b6000610459836001600160a01b038416610554565b6000610459836001600160a01b038416610647565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061045c565b6001600160a01b0381166104c65750335b61022181610696565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b6060600061054d836106a7565b9392505050565b6000818152600183016020526040812054801561063d5760006105786001836107bf565b855490915060009061058c906001906107bf565b90508082146105f15760008660000182815481106105ac576105ac6107e0565b90600052602060002001549050808760000184815481106105cf576105cf6107e0565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610602576106026107f6565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061045c565b600091505061045c565b600081815260018301602052604081205461068e5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561045c565b50600061045c565b61069e610703565b6103c281610728565b6060816000018054806020026020016040519081016040528092919081815260200182805480156106f757602002820191906000526020600020905b8154815260200190600101908083116106e3575b50505050509050919050565b61070b610730565b61037457604051631afcd79f60e31b815260040160405180910390fd5b61038f610703565b600061073a61048c565b54600160401b900460ff16919050565b60006020828403121561075c57600080fd5b81356001600160a01b038116811461054d57600080fd5b602080825282518282018190526000918401906040840190835b818110156107b45783516001600160a01b031683526020938401939092019160010161078d565b509095945050505050565b8181038181111561045c57634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea26469706673582212207f80e0bb609bceb9cf1ed7969785d989cdc482e735db1c02b5ed324b3ef0857864736f6c634300081e0033';
const isSuperArgs$9 = (xs) => xs.length > 1;
class WithSettler__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$9(args)) {
            super(...args);
        } else {
            super(_abi$a, _bytecode$9, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$9;
    static abi = _abi$a;
    static createInterface() {
        return new Interface(_abi$a);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$a, runner);
    }
}

var index$h = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    WithSettler__factory: WithSettler__factory,
});

var index$g = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ownableSol: index$j,
    sigLibSol: index$i,
    withSettlerSol: index$h,
});

const _abi$9 = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OnlyRouterCanFulfill',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OnlySimulatedBackend',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
        ],
        name: 'UnexpectedRequestID',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newSettler',
                type: 'address',
            },
        ],
        name: 'AddSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'int256',
                name: 'current',
                type: 'int256',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'updatedAt',
                type: 'uint256',
            },
        ],
        name: 'AnswerUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'router',
                type: 'address',
            },
        ],
        name: 'InitializedConsumer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
        ],
        name: 'NewAsset',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'description',
                type: 'string',
            },
        ],
        name: 'NewDescription',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'startedBy',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'startedAt',
                type: 'uint256',
            },
        ],
        name: 'NewRound',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'oldSettler',
                type: 'address',
            },
        ],
        name: 'RemoveSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestFulfilled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestSent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'Response',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'upkeepContract',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepInterval',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepRateInterval',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepRateCap',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'maxBaseGasPrice',
                type: 'uint64',
            },
        ],
        name: 'SetUpkeep',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'addSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'asset',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'checkUpkeep',
        outputs: [
            {
                internalType: 'bool',
                name: 'upkeepNeeded',
                type: 'bool',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'deploymentTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'description',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'donID',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'gasLimit',
        outputs: [
            {
                internalType: 'uint32',
                name: '',
                type: 'uint32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint80',
                name: '_roundId',
                type: 'uint80',
            },
        ],
        name: 'getRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: 'roundId',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: 'answer',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: 'startedAt',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'updatedAt',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: 'answeredInRound',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getTimestampAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
        ],
        name: 'getUpkeepTime',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'handleOracleFulfillment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'i_router',
        outputs: [
            {
                internalType: 'contract IFunctionsRouter',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
            {
                internalType: 'uint64',
                name: '_remoteChain',
                type: 'uint64',
            },
            {
                internalType: 'address',
                name: '_remoteChainOracle',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_upkeepContract',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: '_upkeepInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateCap',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_maxBaseGasPrice',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_updateInterval',
                type: 'uint64',
            },
        ],
        name: 'initializeAGTPriceFeed',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_upkeepContract',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: '_upkeepInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateCap',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_maxBaseGasPrice',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_updateInterval',
                type: 'uint64',
            },
        ],
        name: 'initializeAGTReserveFeed',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address',
            },
        ],
        name: 'initializeConsumer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
        ],
        name: 'initializeFeed',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
        ],
        name: 'initializeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lastUpkeep',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRound',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxBaseGasPrice',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'performUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'remoteChain',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'remoteChainOracle',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'removeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'request',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 's_lastRequestId',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'sendRequestCBOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
        ],
        name: 'setAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
        ],
        name: 'setDescription',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: '_updateInterval',
                type: 'uint64',
            },
        ],
        name: 'setInterval',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_upkeepContract',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: '_upkeepInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateCap',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_maxBaseGasPrice',
                type: 'uint64',
            },
        ],
        name: 'setUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_version',
                type: 'uint256',
            },
        ],
        name: 'setVersion',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settlers',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'subscriptionId',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'int256',
                name: 'newAnswer',
                type: 'int256',
            },
        ],
        name: 'updateAnswer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'updateInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '_request',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: '_subscriptionId',
                type: 'uint64',
            },
            {
                internalType: 'uint32',
                name: '_gasLimit',
                type: 'uint32',
            },
            {
                internalType: 'bytes32',
                name: '_donID',
                type: 'bytes32',
            },
        ],
        name: 'updateRequest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepContract',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepRateCap',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepRateInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        name: 'upkeepRates',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'version',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const _bytecode$8 =
    '0x60806040526006600555348015601457600080fd5b50612739806100246000396000f3fe608060405234801561001057600080fd5b506004361061030b5760003560e01c80636ad6c8ce1161019d578063b1e21749116100e9578063d0d552dd116100a2578063f2fde38b1161007c578063f2fde38b14610720578063f68016b714610733578063fd2c80ae1461075f578063feaf968c1461077257600080fd5b8063d0d552dd146106e7578063d4ab0d5f146106fa578063e58864421461070d57600080fd5b8063b1e2174914610668578063b5ab58dc14610671578063b633620c14610691578063bfc12c05146106b1578063c3ba0e24146106ba578063c41c7dce146106d457600080fd5b80638205bf6a116101565780639a6fc8f5116101305780639a6fc8f5146105df578063a26fd90d14610626578063a87a20ce14610640578063b1da41fe1461065357600080fd5b80638205bf6a146105bb5780638da5cb5b146105c457806390c3f38f146105cc57600080fd5b80636ad6c8ce146105455780636e04ff0d1461056e5780636e74336b1461058f578063715018a6146105985780637284e416146105a057806375f83db3146105a857600080fd5b80633b2235fc1161025c578063581bdd16116102155780635dcbdc5a116101ef5780635dcbdc5a146105035780635e0611f11461051657806365e28ce014610529578063668a0f021461053c57600080fd5b8063581bdd16146104c357806359770db2146104d65780635a74373c146104e957600080fd5b80633b2235fc146104515780633d7c5d3e14610471578063408def1e1461048b5780634585e33b1461049e57806350d25bcd146104b157806354fd4d50146104ba57600080fd5b806314b31678116102c9578063313ce567116102a3578063313ce567146103e4578063329bad17146103fe578063338cdca11461041157806338d52e0f1461042657600080fd5b806314b31678146103a857806314d3940d146103be578063225a2b93146103d157600080fd5b8062b105e6146103105780630494878e14610325578063057b39671461035557806306216fa01461036857806309c1ba2e146103825780630ca7617514610395575b600080fd5b61032361031e366004611d46565b61077a565b005b601254610338906001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b610323610363366004611e0b565b61081c565b60145461033890600160401b90046001600160401b031681565b600e54610338906001600160401b031681565b6103236103a3366004611e68565b610908565b6103b061096e565b60405190815260200161034c565b6103236103cc366004611d46565b610a9e565b6103236103df366004611ec2565b610b37565b6103ec600881565b60405160ff909116815260200161034c565b61032361040c366004611d46565b610c21565b610419610d09565b60405161034c9190611f3b565b600354610439906001600160a01b031681565b6040516001600160a01b03909116815260200161034c565b6103b061045f366004611f4e565b600c6020526000908152604090205481565b60125461033890600160801b90046001600160401b031681565b610323610499366004611f4e565b610d97565b6103236104ac366004611f67565b610da4565b6103b060075481565b6103b060055481565b600054610439906001600160a01b031681565b6103236104e4366004611ff0565b610df0565b60115461033890600160a01b90046001600160401b031681565b610338610511366004611f4e565b610e1b565b601154610439906001600160a01b031681565b61032361053736600461200b565b610e44565b6103b060095481565b610338610553366004611ff0565b6013602052600090815260409020546001600160401b031681565b61058161057c366004611f67565b610f58565b60405161034c9291906120df565b6103b0600f5481565b610323610f7e565b610419610f92565b6103236105b6366004612102565b610f9f565b6103b060085481565b61043961100c565b6103236105da3660046121fa565b61103a565b6105f26105ed36600461222e565b61107e565b604080516001600160501b03968716815260208101959095528401929092526060830152909116608082015260a00161034c565b60125461033890600160c01b90046001600160401b031681565b61032361064e366004611f4e565b6110fc565b61065b61115d565b60405161034c9190612257565b6103b060105481565b6103b061067f366004611f4e565b600a6020526000908152604090205481565b6103b061069f366004611f4e565b600b6020526000908152604090205481565b6103b060065481565b60125461033890600160401b90046001600160401b031681565b6103236106e23660046122a3565b61116e565b6103236106f5366004611d46565b6111c2565b601554610439906001600160a01b031681565b61032361071b366004612313565b611214565b61032361072e366004611d46565b6112e3565b600e5461074a90600160401b900463ffffffff1681565b60405163ffffffff909116815260200161034c565b601454610338906001600160401b031681565b6105f261131e565b610782611342565b61078d60018261138f565b6107d05760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b6107db6001826113b4565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b60006108266113c9565b805490915060ff600160401b82041615906001600160401b031660008115801561084d5750825b90506000826001600160401b031660011480156108695750303b155b905081158015610877575080155b156108955760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156108bf57845460ff60401b1916600160401b1785555b6108ca8888886113f2565b83156108fe57845460ff60401b19168555604051600181526000805160206126e48339815191529060200160405180910390a15b5050505050505050565b6000546001600160a01b031633146109335760405163c6829f8360e01b815260040160405180910390fd5b61093e83838361141b565b60405183907f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e690600090a2505050565b600061097861100c565b6001600160a01b0316336001600160a01b031614806109a157506011546001600160a01b031633145b6109e05760405162461bcd60e51b815260206004820152601060248201526f2737ba20b63637bbb2b221b0b63632b960811b60448201526064016107c7565b610a94600d80546109f090612378565b80601f0160208091040260200160405190810160405280929190818152602001828054610a1c90612378565b8015610a695780601f10610a3e57610100808354040283529160200191610a69565b820191906000526020600020905b815481529060010190602001808311610a4c57829003601f168201915b5050600e54600f546001600160401b0382169450600160401b90910463ffffffff16925090506114fc565b6010819055905090565b610aa6611342565b610ab160018261138f565b15610af25760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b60448201526064016107c7565b610afd6001826115b0565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e90602001610811565b6000610b416113c9565b805490915060ff600160401b82041615906001600160401b0316600081158015610b685750825b90506000826001600160401b03166001148015610b845750303b155b905081158015610b92575080155b15610bb05760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610bda57845460ff60401b1916600160401b1785555b610be487876115c5565b8315610c1857845460ff60401b19168555604051600181526000805160206126e48339815191529060200160405180910390a15b50505050505050565b6000610c2b6113c9565b805490915060ff600160401b82041615906001600160401b0316600081158015610c525750825b90506000826001600160401b03166001148015610c6e5750303b155b905081158015610c7c575080155b15610c9a5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610cc457845460ff60401b1916600160401b1785555b610ccd86611630565b8315610d0157845460ff60401b19168555604051600181526000805160206126e48339815191529060200160405180910390a15b505050505050565b600d8054610d1690612378565b80601f0160208091040260200160405190810160405280929190818152602001828054610d4290612378565b8015610d8f5780601f10610d6457610100808354040283529160200191610d8f565b820191906000526020600020905b815481529060010190602001808311610d7257829003601f168201915b505050505081565b610d9f611342565b600555565b610dac61164a565b15610dec576012805467ffffffffffffffff60801b1916600160801b426001600160401b031602179055600d8054610de891906109f090612378565b6010555b5050565b610df8611342565b6014805467ffffffffffffffff19166001600160401b0392909216919091179055565b6012546000906001600160401b0316610e3481846123de565b610e3e919061240c565b92915050565b6000610e4e6113c9565b805490915060ff600160401b82041615906001600160401b0316600081158015610e755750825b90506000826001600160401b03166001148015610e915750303b155b905081158015610e9f575080155b15610ebd5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610ee757845460ff60401b1916600160401b1785555b610ef086610df0565b610efd8b8b8b8b8b611214565b610f0860008d6115c5565b610f138f8f8f6113f2565b8315610f4757845460ff60401b19168555604051600181526000805160206126e48339815191529060200160405180910390a15b505050505050505050505050505050565b60006060610f6461164a565b604080516000815260208101909152909590945092505050565b610f86611342565b610f90600061168a565b565b60048054610d1690612378565b610fa7611342565b601480546fffffffffffffffff00000000000000001916600160401b6001600160401b038c1602179055601580546001600160a01b0319166001600160a01b038a16179055610ffe8c8c8c8a8a8a8a8a8a8a610e44565b505050505050505050505050565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b611042611342565b600461104e828261247c565b507f16fbb51445345dabaa215e5f99a4bd4d8ba9818b508c76d5cd0ea30abcc491c6816040516108119190611f3b565b6001600160501b0381166000818152600a60205260408120548392909190819081906110ac576006546110d4565b600b60006110c460016001600160501b038a1661253a565b8152602001908152602001600020545b6001600160501b0387166000908152600b602052604090205495979496909594909350915050565b61110760013361138f565b6111415760405162461bcd60e51b815260206004820152600b60248201526a2727aa2fa9a2aa2a2622a960a91b60448201526064016107c7565b61115a816009546001611154919061254d565b426116fb565b50565b606061116960016117c7565b905090565b611176611342565b600d611182858261247c565b50600e805463ffffffff909316600160401b026bffffffffffffffffffffffff199093166001600160401b039094169390931791909117909155600f5550565b6111ca611342565b600380546001600160a01b0319166001600160a01b0383169081179091556040517fc7d9598af6004de7fa9c489a50a55414c75cfbce9fe56fe46956970744d6bc2c90600090a250565b61121c611342565b601180546001600160a01b0387166001600160e01b03199091168117600160a01b6001600160401b0388811691820292909217909355601280548783166fffffffffffffffffffffffffffffffff199091168117600160401b888516908102919091176001600160c01b0316600160c01b948816948502179092556040805195865260208601919091528401526060830152907fbed5a7c7626f62707ea8a0c71900fd8623e8ae9fde3cd99cfa5dc7d54bbabee09060800160405180910390a25050505050565b6112eb611342565b6001600160a01b03811661131557604051631e4fbdf760e01b8152600060048201526024016107c7565b61115a8161168a565b600080600080600061133160095461107e565b945094509450945094509091929394565b600061134c61100c565b90506001600160a01b0381161580159061136f57506001600160a01b0381163314155b1561115a5760405163118cdaa760e01b81523360048201526024016107c7565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b60006113ad836001600160a01b0384166117d4565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610e3e565b426006908155600555611404826111c2565b61140d8161103a565b61141683611630565b505050565b6013600061142842610e1b565b6001600160401b039081168252602082019290925260400160009081208054909216919061145583612560565b91906101000a8154816001600160401b0302191690836001600160401b0316021790555050826010541461149f5760405163d068bf5b60e01b8152600481018490526024016107c7565b600182511180156114af57508051155b156114bd576114bd826118ce565b827f7873807bf6ddc50401cd3d29bbe0decee23fd4d68d273f4b5eb83cded4d2f17283836040516114ef92919061258b565b60405180910390a2505050565b6000805460405163230e93b160e11b815282916001600160a01b03169063461d2762906115369088908a906001908a908a906004016125b9565b6020604051808303816000875af1158015611555573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115799190612602565b60405190915081907f1131472297a800fee664d1d89cfa8f7676ff07189ecc53f80bbb5f4969099db890600090a295945050505050565b60006113ad836001600160a01b0384166119c2565b600080546001600160a01b0319166001600160a01b0383161790556001600160a01b038216156115f8576115f882611630565b6040516001600160a01b038216907f8e027fb3d390e4e77e8857eb25c3f2b2b17eb69cb36c0b1b993f8a94e29accea90600090a25050565b6001600160a01b0381166116415750335b610af281611a11565b6000611654611a22565b61165e5750600090565b601454600854611677916001600160401b03169061254d565b4210156116845750600090565b50600190565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b806008541061170957505050565b6007839055600881905560098290556000828152600b602090815260408083208054600a845282852088905590859055848452600c90925290912084905515158061178657604051828152339084907f0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac602719060200160405180910390a35b82847f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f846040516117b991815260200190565b60405180910390a350505050565b606060006113ad83611adb565b600081815260018301602052604081205480156118bd5760006117f860018361253a565b855490915060009061180c9060019061253a565b905080821461187157600086600001828154811061182c5761182c61261b565b906000526020600020015490508087600001848154811061184f5761184f61261b565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061188257611882612631565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610e3e565b6000915050610e3e565b5092915050565b60006118d982611b37565b90506000600282516118eb9190612647565b905060005b818110156119bc5760008361190683600261265b565b815181106119165761191661261b565b60200260200101519050600084836002611930919061265b565b61193b90600161254d565b8151811061194b5761194b61261b565b602002602001015190506000826001600160401b0316905080600c6000846001600160401b03168152602001908152602001600020540361198e575050506119b4565b6119b08160095460016119a1919061254d565b846001600160401b03166116fb565b5050505b6001016118f0565b50505050565b6000818152600183016020526040812054611a0957508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610e3e565b506000610e3e565b611a19611ce3565b61115a81611d08565b6012546000906001600160401b03600160c01b9091048116489091161115611a4a5750600090565b601154601254611a74916001600160401b03600160a01b909104811691600160801b900416612672565b6001600160401b0316426001600160401b03161015611a935750600090565b601254600160401b90046001600160401b031660136000611ab342610e1b565b6001600160401b03908116825260208201929092526040016000205416106116845750600090565b606081600001805480602002602001604051908101604052809291908181526020018280548015611b2b57602002820191906000526020600020905b815481526020019060010190808311611b17575b50505050509050919050565b606060088251611b479190612691565b15611ba85760405162461bcd60e51b815260206004820152602b60248201527f44617461206c656e677468206d75737420626520646976697369626c6520627960448201526a206368756e6b2073697a6560a81b60648201526084016107c7565b600060088351611bb89190612647565b90506000816001600160401b03811115611bd457611bd4611d61565b604051908082528060200260200182016040528015611bfd578160200160208202803683370190505b50905060005b82811015611cdb5760408051600880825281830190925260009160208201818036833701905050905060005b6008811015611c9b578681611c4585600861265b565b611c4f919061254d565b81518110611c5f57611c5f61261b565b602001015160f81c60f81b828281518110611c7c57611c7c61261b565b60200101906001600160f81b031916908160001a905350600101611c2f565b50611ca5816126a5565b60c01c838381518110611cba57611cba61261b565b6001600160401b039092166020928302919091019091015250600101611c03565b509392505050565b611ceb611d10565b610f9057604051631afcd79f60e31b815260040160405180910390fd5b6112eb611ce3565b6000611d1a6113c9565b54600160401b900460ff16919050565b80356001600160a01b0381168114611d4157600080fd5b919050565b600060208284031215611d5857600080fd5b6113ad82611d2a565b634e487b7160e01b600052604160045260246000fd5b600082601f830112611d8857600080fd5b8135602083016000806001600160401b03841115611da857611da8611d61565b50604051601f19601f85018116603f011681018181106001600160401b0382111715611dd657611dd6611d61565b604052838152905080828401871015611dee57600080fd5b838360208301376000602085830101528094505050505092915050565b600080600060608486031215611e2057600080fd5b611e2984611d2a565b9250611e3760208501611d2a565b915060408401356001600160401b03811115611e5257600080fd5b611e5e86828701611d77565b9150509250925092565b600080600060608486031215611e7d57600080fd5b8335925060208401356001600160401b03811115611e9a57600080fd5b611ea686828701611d77565b92505060408401356001600160401b03811115611e5257600080fd5b60008060408385031215611ed557600080fd5b611ede83611d2a565b9150611eec60208401611d2a565b90509250929050565b6000815180845260005b81811015611f1b57602081850181015186830182015201611eff565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006113ad6020830184611ef5565b600060208284031215611f6057600080fd5b5035919050565b60008060208385031215611f7a57600080fd5b82356001600160401b03811115611f9057600080fd5b8301601f81018513611fa157600080fd5b80356001600160401b03811115611fb757600080fd5b856020828401011115611fc957600080fd5b6020919091019590945092505050565b80356001600160401b0381168114611d4157600080fd5b60006020828403121561200257600080fd5b6113ad82611fd9565b6000806000806000806000806000806101408b8d03121561202b57600080fd5b6120348b611d2a565b995061204260208c01611d2a565b985060408b01356001600160401b0381111561205d57600080fd5b6120698d828e01611d77565b98505061207860608c01611d2a565b965061208660808c01611d2a565b955061209460a08c01611fd9565b94506120a260c08c01611fd9565b93506120b060e08c01611fd9565b92506120bf6101008c01611fd9565b91506120ce6101208c01611fd9565b90509295989b9194979a5092959850565b82151581526040602082015260006120fa6040830184611ef5565b949350505050565b6000806000806000806000806000806000806101808d8f03121561212557600080fd5b61212e8d611d2a565b9b5061213c60208e01611d2a565b9a506001600160401b0360408e0135111561215657600080fd5b6121668e60408f01358f01611d77565b995061217460608e01611fd9565b985061218260808e01611d2a565b975061219060a08e01611d2a565b965061219e60c08e01611d2a565b95506121ac60e08e01611fd9565b94506121bb6101008e01611fd9565b93506121ca6101208e01611fd9565b92506121d96101408e01611fd9565b91506121e86101608e01611fd9565b90509295989b509295989b509295989b565b60006020828403121561220c57600080fd5b81356001600160401b0381111561222257600080fd5b6120fa84828501611d77565b60006020828403121561224057600080fd5b81356001600160501b03811681146113ad57600080fd5b602080825282518282018190526000918401906040840190835b818110156122985783516001600160a01b0316835260209384019390920191600101612271565b509095945050505050565b600080600080608085870312156122b957600080fd5b84356001600160401b038111156122cf57600080fd5b6122db87828801611d77565b9450506122ea60208601611fd9565b9250604085013563ffffffff8116811461230357600080fd5b9396929550929360600135925050565b600080600080600060a0868803121561232b57600080fd5b61233486611d2a565b945061234260208701611fd9565b935061235060408701611fd9565b925061235e60608701611fd9565b915061236c60808701611fd9565b90509295509295909350565b600181811c9082168061238c57607f821691505b6020821081036123ac57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006001600160401b038316806123f7576123f76123b2565b806001600160401b0384160491505092915050565b6001600160401b0381811683821602908116908181146118c7576118c76123c8565b601f82111561141657806000526020600020601f840160051c810160208510156124555750805b601f840160051c820191505b818110156124755760008155600101612461565b5050505050565b81516001600160401b0381111561249557612495611d61565b6124a9816124a38454612378565b8461242e565b6020601f8211600181146124dd57600083156124c55750848201515b600019600385901b1c1916600184901b178455612475565b600084815260208120601f198516915b8281101561250d57878501518255602094850194600190920191016124ed565b508482101561252b5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b81810381811115610e3e57610e3e6123c8565b80820180821115610e3e57610e3e6123c8565b60006001600160401b0382166001600160401b038103612582576125826123c8565b60010192915050565b60408152600061259e6040830185611ef5565b82810360208401526125b08185611ef5565b95945050505050565b6001600160401b038616815260a0602082015260006125db60a0830187611ef5565b61ffff9590951660408301525063ffffffff92909216606083015260809091015292915050565b60006020828403121561261457600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b600082612656576126566123b2565b500490565b8082028115828204841417610e3e57610e3e6123c8565b6001600160401b038181168382160190811115610e3e57610e3e6123c8565b6000826126a0576126a06123b2565b500690565b805160208201516001600160c01b03198116919060088210156126dc576001600160c01b0319600883900360031b81901b82161692505b505091905056fec7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2a2646970667358221220c9ab9a3968a459ffc2af778330cc6c9a7f11d680a73f3984ac9b0ca44d5cbc1364736f6c634300081e0033';
const isSuperArgs$8 = (xs) => xs.length > 1;
class AGTPriceFeed__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$8(args)) {
            super(...args);
        } else {
            super(_abi$9, _bytecode$8, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$8;
    static abi = _abi$9;
    static createInterface() {
        return new Interface(_abi$9);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$9, runner);
    }
}

var index$f = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    AGTPriceFeed__factory: AGTPriceFeed__factory,
});

const _abi$8 = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OnlyRouterCanFulfill',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OnlySimulatedBackend',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
        ],
        name: 'UnexpectedRequestID',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newSettler',
                type: 'address',
            },
        ],
        name: 'AddSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'int256',
                name: 'current',
                type: 'int256',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'updatedAt',
                type: 'uint256',
            },
        ],
        name: 'AnswerUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'router',
                type: 'address',
            },
        ],
        name: 'InitializedConsumer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
        ],
        name: 'NewAsset',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'description',
                type: 'string',
            },
        ],
        name: 'NewDescription',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'startedBy',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'startedAt',
                type: 'uint256',
            },
        ],
        name: 'NewRound',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'oldSettler',
                type: 'address',
            },
        ],
        name: 'RemoveSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestFulfilled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestSent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'Response',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'upkeepContract',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepInterval',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepRateInterval',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepRateCap',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'maxBaseGasPrice',
                type: 'uint64',
            },
        ],
        name: 'SetUpkeep',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'addSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'asset',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'checkUpkeep',
        outputs: [
            {
                internalType: 'bool',
                name: 'upkeepNeeded',
                type: 'bool',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'deploymentTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'description',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'donID',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'gasLimit',
        outputs: [
            {
                internalType: 'uint32',
                name: '',
                type: 'uint32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint80',
                name: '_roundId',
                type: 'uint80',
            },
        ],
        name: 'getRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: 'roundId',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: 'answer',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: 'startedAt',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'updatedAt',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: 'answeredInRound',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getTimestampAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
        ],
        name: 'getUpkeepTime',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'handleOracleFulfillment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'i_router',
        outputs: [
            {
                internalType: 'contract IFunctionsRouter',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_upkeepContract',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: '_upkeepInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateCap',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_maxBaseGasPrice',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_updateInterval',
                type: 'uint64',
            },
        ],
        name: 'initializeAGTReserveFeed',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address',
            },
        ],
        name: 'initializeConsumer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
        ],
        name: 'initializeFeed',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
        ],
        name: 'initializeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lastUpkeep',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRound',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxBaseGasPrice',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'performUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'removeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'request',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 's_lastRequestId',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'sendRequestCBOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
        ],
        name: 'setAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
        ],
        name: 'setDescription',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: '_updateInterval',
                type: 'uint64',
            },
        ],
        name: 'setInterval',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_upkeepContract',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: '_upkeepInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateCap',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_maxBaseGasPrice',
                type: 'uint64',
            },
        ],
        name: 'setUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_version',
                type: 'uint256',
            },
        ],
        name: 'setVersion',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settlers',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'subscriptionId',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'int256',
                name: 'newAnswer',
                type: 'int256',
            },
        ],
        name: 'updateAnswer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'updateInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '_request',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: '_subscriptionId',
                type: 'uint64',
            },
            {
                internalType: 'uint32',
                name: '_gasLimit',
                type: 'uint32',
            },
            {
                internalType: 'bytes32',
                name: '_donID',
                type: 'bytes32',
            },
        ],
        name: 'updateRequest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepContract',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepRateCap',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepRateInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        name: 'upkeepRates',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'version',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const _bytecode$7 =
    '0x60806040526006600555348015601457600080fd5b50612543806100246000396000f3fe608060405234801561001057600080fd5b50600436106102ba5760003560e01c8063668a0f0211610182578063b1da41fe116100e9578063c41c7dce116100a2578063f2fde38b1161007c578063f2fde38b1461068f578063f68016b7146106a2578063fd2c80ae146106ce578063feaf968c146106e157600080fd5b8063c41c7dce14610656578063d0d552dd14610669578063e58864421461067c57600080fd5b8063b1da41fe146105d5578063b1e21749146105ea578063b5ab58dc146105f3578063b633620c14610613578063bfc12c0514610633578063c3ba0e241461063c57600080fd5b80638205bf6a1161013b5780638205bf6a1461053d5780638da5cb5b1461054657806390c3f38f1461054e5780639a6fc8f514610561578063a26fd90d146105a8578063a87a20ce146105c257600080fd5b8063668a0f02146104d15780636ad6c8ce146104da5780636e04ff0d146105035780636e74336b14610524578063715018a61461052d5780637284e4161461053557600080fd5b80633b2235fc11610226578063581bdd16116101df578063581bdd161461045857806359770db21461046b5780635a74373c1461047e5780635dcbdc5a146104985780635e0611f1146104ab57806365e28ce0146104be57600080fd5b80633b2235fc146103e65780633d7c5d3e14610406578063408def1e146104205780634585e33b1461043357806350d25bcd1461044657806354fd4d501461044f57600080fd5b806314d3940d1161027857806314d3940d14610353578063225a2b9314610366578063313ce56714610379578063329bad1714610393578063338cdca1146103a657806338d52e0f146103bb57600080fd5b8062b105e6146102bf5780630494878e146102d4578063057b39671461030457806309c1ba2e146103175780630ca761751461032a57806314b316781461033d575b600080fd5b6102d26102cd366004611c48565b6106e9565b005b6012546102e7906001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b6102d2610312366004611d0d565b61078b565b600e546102e7906001600160401b031681565b6102d2610338366004611d6a565b610877565b6103456108dd565b6040519081526020016102fb565b6102d2610361366004611c48565b610a0d565b6102d2610374366004611dc4565b610aa6565b610381600881565b60405160ff90911681526020016102fb565b6102d26103a1366004611c48565b610b90565b6103ae610c78565b6040516102fb9190611e3d565b6003546103ce906001600160a01b031681565b6040516001600160a01b0390911681526020016102fb565b6103456103f4366004611e50565b600c6020526000908152604090205481565b6012546102e790600160801b90046001600160401b031681565b6102d261042e366004611e50565b610d06565b6102d2610441366004611e69565b610d13565b61034560075481565b61034560055481565b6000546103ce906001600160a01b031681565b6102d2610479366004611ef2565b610d5f565b6011546102e790600160a01b90046001600160401b031681565b6102e76104a6366004611e50565b610d8a565b6011546103ce906001600160a01b031681565b6102d26104cc366004611f0d565b610db3565b61034560095481565b6102e76104e8366004611ef2565b6013602052600090815260409020546001600160401b031681565b610516610511366004611e69565b610ec7565b6040516102fb929190611fe1565b610345600f5481565b6102d2610eed565b6103ae610f01565b61034560085481565b6103ce610f0e565b6102d261055c366004612004565b610f3c565b61057461056f366004612038565b610f80565b604080516001600160501b03968716815260208101959095528401929092526060830152909116608082015260a0016102fb565b6012546102e790600160c01b90046001600160401b031681565b6102d26105d0366004611e50565b610ffe565b6105dd61105f565b6040516102fb9190612061565b61034560105481565b610345610601366004611e50565b600a6020526000908152604090205481565b610345610621366004611e50565b600b6020526000908152604090205481565b61034560065481565b6012546102e790600160401b90046001600160401b031681565b6102d26106643660046120ad565b611070565b6102d2610677366004611c48565b6110c4565b6102d261068a36600461211d565b611116565b6102d261069d366004611c48565b6111e5565b600e546106b990600160401b900463ffffffff1681565b60405163ffffffff90911681526020016102fb565b6014546102e7906001600160401b031681565b610574611220565b6106f1611244565b6106fc600182611291565b61073f5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61074a6001826112b6565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b60006107956112cb565b805490915060ff600160401b82041615906001600160401b03166000811580156107bc5750825b90506000826001600160401b031660011480156107d85750303b155b9050811580156107e6575080155b156108045760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561082e57845460ff60401b1916600160401b1785555b6108398888886112f4565b831561086d57845460ff60401b19168555604051600181526000805160206124ee8339815191529060200160405180910390a15b5050505050505050565b6000546001600160a01b031633146108a25760405163c6829f8360e01b815260040160405180910390fd5b6108ad83838361131d565b60405183907f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e690600090a2505050565b60006108e7610f0e565b6001600160a01b0316336001600160a01b0316148061091057506011546001600160a01b031633145b61094f5760405162461bcd60e51b815260206004820152601060248201526f2737ba20b63637bbb2b221b0b63632b960811b6044820152606401610736565b610a03600d805461095f90612182565b80601f016020809104026020016040519081016040528092919081815260200182805461098b90612182565b80156109d85780601f106109ad576101008083540402835291602001916109d8565b820191906000526020600020905b8154815290600101906020018083116109bb57829003601f168201915b5050600e54600f546001600160401b0382169450600160401b90910463ffffffff16925090506113fe565b6010819055905090565b610a15611244565b610a20600182611291565b15610a615760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610736565b610a6c6001826114b2565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e90602001610780565b6000610ab06112cb565b805490915060ff600160401b82041615906001600160401b0316600081158015610ad75750825b90506000826001600160401b03166001148015610af35750303b155b905081158015610b01575080155b15610b1f5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610b4957845460ff60401b1916600160401b1785555b610b5387876114c7565b8315610b8757845460ff60401b19168555604051600181526000805160206124ee8339815191529060200160405180910390a15b50505050505050565b6000610b9a6112cb565b805490915060ff600160401b82041615906001600160401b0316600081158015610bc15750825b90506000826001600160401b03166001148015610bdd5750303b155b905081158015610beb575080155b15610c095760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610c3357845460ff60401b1916600160401b1785555b610c3c86611532565b8315610c7057845460ff60401b19168555604051600181526000805160206124ee8339815191529060200160405180910390a15b505050505050565b600d8054610c8590612182565b80601f0160208091040260200160405190810160405280929190818152602001828054610cb190612182565b8015610cfe5780601f10610cd357610100808354040283529160200191610cfe565b820191906000526020600020905b815481529060010190602001808311610ce157829003601f168201915b505050505081565b610d0e611244565b600555565b610d1b61154c565b15610d5b576012805467ffffffffffffffff60801b1916600160801b426001600160401b031602179055600d8054610d57919061095f90612182565b6010555b5050565b610d67611244565b6014805467ffffffffffffffff19166001600160401b0392909216919091179055565b6012546000906001600160401b0316610da381846121e8565b610dad9190612216565b92915050565b6000610dbd6112cb565b805490915060ff600160401b82041615906001600160401b0316600081158015610de45750825b90506000826001600160401b03166001148015610e005750303b155b905081158015610e0e575080155b15610e2c5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610e5657845460ff60401b1916600160401b1785555b610e5f86610d5f565b610e6c8b8b8b8b8b611116565b610e7760008d6114c7565b610e828f8f8f6112f4565b8315610eb657845460ff60401b19168555604051600181526000805160206124ee8339815191529060200160405180910390a15b505050505050505050505050505050565b60006060610ed361154c565b604080516000815260208101909152909590945092505050565b610ef5611244565b610eff600061158c565b565b60048054610c8590612182565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b610f44611244565b6004610f508282612286565b507f16fbb51445345dabaa215e5f99a4bd4d8ba9818b508c76d5cd0ea30abcc491c6816040516107809190611e3d565b6001600160501b0381166000818152600a6020526040812054839290919081908190610fae57600654610fd6565b600b6000610fc660016001600160501b038a16612344565b8152602001908152602001600020545b6001600160501b0387166000908152600b602052604090205495979496909594909350915050565b611009600133611291565b6110435760405162461bcd60e51b815260206004820152600b60248201526a2727aa2fa9a2aa2a2622a960a91b6044820152606401610736565b61105c8160095460016110569190612357565b426115fd565b50565b606061106b60016116c9565b905090565b611078611244565b600d6110848582612286565b50600e805463ffffffff909316600160401b026bffffffffffffffffffffffff199093166001600160401b039094169390931791909117909155600f5550565b6110cc611244565b600380546001600160a01b0319166001600160a01b0383169081179091556040517fc7d9598af6004de7fa9c489a50a55414c75cfbce9fe56fe46956970744d6bc2c90600090a250565b61111e611244565b601180546001600160a01b0387166001600160e01b03199091168117600160a01b6001600160401b0388811691820292909217909355601280548783166fffffffffffffffffffffffffffffffff199091168117600160401b888516908102919091176001600160c01b0316600160c01b948816948502179092556040805195865260208601919091528401526060830152907fbed5a7c7626f62707ea8a0c71900fd8623e8ae9fde3cd99cfa5dc7d54bbabee09060800160405180910390a25050505050565b6111ed611244565b6001600160a01b03811661121757604051631e4fbdf760e01b815260006004820152602401610736565b61105c8161158c565b6000806000806000611233600954610f80565b945094509450945094509091929394565b600061124e610f0e565b90506001600160a01b0381161580159061127157506001600160a01b0381163314155b1561105c5760405163118cdaa760e01b8152336004820152602401610736565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b60006112af836001600160a01b0384166116d6565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610dad565b426006908155600555611306826110c4565b61130f81610f3c565b61131883611532565b505050565b6013600061132a42610d8a565b6001600160401b03908116825260208201929092526040016000908120805490921691906113578361236a565b91906101000a8154816001600160401b0302191690836001600160401b031602179055505082601054146113a15760405163d068bf5b60e01b815260048101849052602401610736565b600182511180156113b157508051155b156113bf576113bf826117d0565b827f7873807bf6ddc50401cd3d29bbe0decee23fd4d68d273f4b5eb83cded4d2f17283836040516113f1929190612395565b60405180910390a2505050565b6000805460405163230e93b160e11b815282916001600160a01b03169063461d2762906114389088908a906001908a908a906004016123c3565b6020604051808303816000875af1158015611457573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061147b919061240c565b60405190915081907f1131472297a800fee664d1d89cfa8f7676ff07189ecc53f80bbb5f4969099db890600090a295945050505050565b60006112af836001600160a01b0384166118c4565b600080546001600160a01b0319166001600160a01b0383161790556001600160a01b038216156114fa576114fa82611532565b6040516001600160a01b038216907f8e027fb3d390e4e77e8857eb25c3f2b2b17eb69cb36c0b1b993f8a94e29accea90600090a25050565b6001600160a01b0381166115435750335b610a6181611913565b6000611556611924565b6115605750600090565b601454600854611579916001600160401b031690612357565b4210156115865750600090565b50600190565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b806008541061160b57505050565b6007839055600881905560098290556000828152600b602090815260408083208054600a845282852088905590859055848452600c90925290912084905515158061168857604051828152339084907f0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac602719060200160405180910390a35b82847f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f846040516116bb91815260200190565b60405180910390a350505050565b606060006112af836119dd565b600081815260018301602052604081205480156117bf5760006116fa600183612344565b855490915060009061170e90600190612344565b905080821461177357600086600001828154811061172e5761172e612425565b906000526020600020015490508087600001848154811061175157611751612425565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806117845761178461243b565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610dad565b6000915050610dad565b5092915050565b60006117db82611a39565b90506000600282516117ed9190612451565b905060005b818110156118be57600083611808836002612465565b8151811061181857611818612425565b602002602001015190506000848360026118329190612465565b61183d906001612357565b8151811061184d5761184d612425565b602002602001015190506000826001600160401b0316905080600c6000846001600160401b031681526020019081526020016000205403611890575050506118b6565b6118b28160095460016118a39190612357565b846001600160401b03166115fd565b5050505b6001016117f2565b50505050565b600081815260018301602052604081205461190b57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610dad565b506000610dad565b61191b611be5565b61105c81611c0a565b6012546000906001600160401b03600160c01b909104811648909116111561194c5750600090565b601154601254611976916001600160401b03600160a01b909104811691600160801b90041661247c565b6001600160401b0316426001600160401b031610156119955750600090565b601254600160401b90046001600160401b0316601360006119b542610d8a565b6001600160401b03908116825260208201929092526040016000205416106115865750600090565b606081600001805480602002602001604051908101604052809291908181526020018280548015611a2d57602002820191906000526020600020905b815481526020019060010190808311611a19575b50505050509050919050565b606060088251611a49919061249b565b15611aaa5760405162461bcd60e51b815260206004820152602b60248201527f44617461206c656e677468206d75737420626520646976697369626c6520627960448201526a206368756e6b2073697a6560a81b6064820152608401610736565b600060088351611aba9190612451565b90506000816001600160401b03811115611ad657611ad6611c63565b604051908082528060200260200182016040528015611aff578160200160208202803683370190505b50905060005b82811015611bdd5760408051600880825281830190925260009160208201818036833701905050905060005b6008811015611b9d578681611b47856008612465565b611b519190612357565b81518110611b6157611b61612425565b602001015160f81c60f81b828281518110611b7e57611b7e612425565b60200101906001600160f81b031916908160001a905350600101611b31565b50611ba7816124af565b60c01c838381518110611bbc57611bbc612425565b6001600160401b039092166020928302919091019091015250600101611b05565b509392505050565b611bed611c12565b610eff57604051631afcd79f60e31b815260040160405180910390fd5b6111ed611be5565b6000611c1c6112cb565b54600160401b900460ff16919050565b80356001600160a01b0381168114611c4357600080fd5b919050565b600060208284031215611c5a57600080fd5b6112af82611c2c565b634e487b7160e01b600052604160045260246000fd5b600082601f830112611c8a57600080fd5b8135602083016000806001600160401b03841115611caa57611caa611c63565b50604051601f19601f85018116603f011681018181106001600160401b0382111715611cd857611cd8611c63565b604052838152905080828401871015611cf057600080fd5b838360208301376000602085830101528094505050505092915050565b600080600060608486031215611d2257600080fd5b611d2b84611c2c565b9250611d3960208501611c2c565b915060408401356001600160401b03811115611d5457600080fd5b611d6086828701611c79565b9150509250925092565b600080600060608486031215611d7f57600080fd5b8335925060208401356001600160401b03811115611d9c57600080fd5b611da886828701611c79565b92505060408401356001600160401b03811115611d5457600080fd5b60008060408385031215611dd757600080fd5b611de083611c2c565b9150611dee60208401611c2c565b90509250929050565b6000815180845260005b81811015611e1d57602081850181015186830182015201611e01565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006112af6020830184611df7565b600060208284031215611e6257600080fd5b5035919050565b60008060208385031215611e7c57600080fd5b82356001600160401b03811115611e9257600080fd5b8301601f81018513611ea357600080fd5b80356001600160401b03811115611eb957600080fd5b856020828401011115611ecb57600080fd5b6020919091019590945092505050565b80356001600160401b0381168114611c4357600080fd5b600060208284031215611f0457600080fd5b6112af82611edb565b6000806000806000806000806000806101408b8d031215611f2d57600080fd5b611f368b611c2c565b9950611f4460208c01611c2c565b985060408b01356001600160401b03811115611f5f57600080fd5b611f6b8d828e01611c79565b985050611f7a60608c01611c2c565b9650611f8860808c01611c2c565b9550611f9660a08c01611edb565b9450611fa460c08c01611edb565b9350611fb260e08c01611edb565b9250611fc16101008c01611edb565b9150611fd06101208c01611edb565b90509295989b9194979a5092959850565b8215158152604060208201526000611ffc6040830184611df7565b949350505050565b60006020828403121561201657600080fd5b81356001600160401b0381111561202c57600080fd5b611ffc84828501611c79565b60006020828403121561204a57600080fd5b81356001600160501b03811681146112af57600080fd5b602080825282518282018190526000918401906040840190835b818110156120a25783516001600160a01b031683526020938401939092019160010161207b565b509095945050505050565b600080600080608085870312156120c357600080fd5b84356001600160401b038111156120d957600080fd5b6120e587828801611c79565b9450506120f460208601611edb565b9250604085013563ffffffff8116811461210d57600080fd5b9396929550929360600135925050565b600080600080600060a0868803121561213557600080fd5b61213e86611c2c565b945061214c60208701611edb565b935061215a60408701611edb565b925061216860608701611edb565b915061217660808701611edb565b90509295509295909350565b600181811c9082168061219657607f821691505b6020821081036121b657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006001600160401b03831680612201576122016121bc565b806001600160401b0384160491505092915050565b6001600160401b0381811683821602908116908181146117c9576117c96121d2565b601f82111561131857806000526020600020601f840160051c8101602085101561225f5750805b601f840160051c820191505b8181101561227f576000815560010161226b565b5050505050565b81516001600160401b0381111561229f5761229f611c63565b6122b3816122ad8454612182565b84612238565b6020601f8211600181146122e757600083156122cf5750848201515b600019600385901b1c1916600184901b17845561227f565b600084815260208120601f198516915b8281101561231757878501518255602094850194600190920191016122f7565b50848210156123355786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b81810381811115610dad57610dad6121d2565b80820180821115610dad57610dad6121d2565b60006001600160401b0382166001600160401b03810361238c5761238c6121d2565b60010192915050565b6040815260006123a86040830185611df7565b82810360208401526123ba8185611df7565b95945050505050565b6001600160401b038616815260a0602082015260006123e560a0830187611df7565b61ffff9590951660408301525063ffffffff92909216606083015260809091015292915050565b60006020828403121561241e57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b600082612460576124606121bc565b500490565b8082028115828204841417610dad57610dad6121d2565b6001600160401b038181168382160190811115610dad57610dad6121d2565b6000826124aa576124aa6121bc565b500690565b805160208201516001600160c01b03198116919060088210156124e6576001600160c01b0319600883900360031b81901b82161692505b505091905056fec7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2a2646970667358221220be112412583deff11e3ed67624d050605d9e298ca4dd7f43065549f29b1ff06764736f6c634300081e0033';
const isSuperArgs$7 = (xs) => xs.length > 1;
class AGTReserveFeed__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$7(args)) {
            super(...args);
        } else {
            super(_abi$8, _bytecode$7, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$7;
    static abi = _abi$8;
    static createInterface() {
        return new Interface(_abi$8);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$8, runner);
    }
}

var index$e = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    AGTReserveFeed__factory: AGTReserveFeed__factory,
});

const _abi$7 = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OnlyRouterCanFulfill',
        type: 'error',
    },
    {
        inputs: [],
        name: 'OnlySimulatedBackend',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
        ],
        name: 'UnexpectedRequestID',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newSettler',
                type: 'address',
            },
        ],
        name: 'AddSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'router',
                type: 'address',
            },
        ],
        name: 'InitializedConsumer',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'oldSettler',
                type: 'address',
            },
        ],
        name: 'RemoveSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestFulfilled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestSent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'Response',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'upkeepContract',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepInterval',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepRateInterval',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'upkeepRateCap',
                type: 'uint64',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'maxBaseGasPrice',
                type: 'uint64',
            },
        ],
        name: 'SetUpkeep',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'addSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'checkUpkeep',
        outputs: [
            {
                internalType: 'bool',
                name: 'upkeepNeeded',
                type: 'bool',
            },
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'donID',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'gasLimit',
        outputs: [
            {
                internalType: 'uint32',
                name: '',
                type: 'uint32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'timestamp',
                type: 'uint256',
            },
        ],
        name: 'getUpkeepTime',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'handleOracleFulfillment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'i_router',
        outputs: [
            {
                internalType: 'contract IFunctionsRouter',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_router',
                type: 'address',
            },
        ],
        name: 'initializeConsumer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
        ],
        name: 'initializeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'lastUpkeep',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'maxBaseGasPrice',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        name: 'performUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'removeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'request',
        outputs: [
            {
                internalType: 'bytes',
                name: '',
                type: 'bytes',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 's_lastRequestId',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'sendRequestCBOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_upkeepContract',
                type: 'address',
            },
            {
                internalType: 'uint64',
                name: '_upkeepInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateInterval',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_upkeepRateCap',
                type: 'uint64',
            },
            {
                internalType: 'uint64',
                name: '_maxBaseGasPrice',
                type: 'uint64',
            },
        ],
        name: 'setUpkeep',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settlers',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'subscriptionId',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: '_request',
                type: 'bytes',
            },
            {
                internalType: 'uint64',
                name: '_subscriptionId',
                type: 'uint64',
            },
            {
                internalType: 'uint32',
                name: '_gasLimit',
                type: 'uint32',
            },
            {
                internalType: 'bytes32',
                name: '_donID',
                type: 'bytes32',
            },
        ],
        name: 'updateRequest',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepContract',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepRateCap',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'upkeepRateInterval',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        name: 'upkeepRates',
        outputs: [
            {
                internalType: 'uint64',
                name: '',
                type: 'uint64',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const _bytecode$6 =
    '0x6080604052348015600f57600080fd5b506118da8061001f6000396000f3fe608060405234801561001057600080fd5b50600436106101c35760003560e01c80635e0611f1116100f9578063b1da41fe11610097578063c41c7dce11610071578063c41c7dce146103e4578063e5886442146103f7578063f2fde38b1461040a578063f68016b71461041d57600080fd5b8063b1da41fe146103ac578063b1e21749146103c1578063c3ba0e24146103ca57600080fd5b80636e74336b116100d35780636e74336b14610379578063715018a6146103825780638da5cb5b1461038a578063a26fd90d1461039257600080fd5b80635e0611f11461031c5780636ad6c8ce1461032f5780636e04ff0d1461035857600080fd5b8063329bad17116101665780634585e33b116101405780634585e33b146102b1578063581bdd16146102c45780635a74373c146102ef5780635dcbdc5a1461030957600080fd5b8063329bad171461026f578063338cdca1146102825780633d7c5d3e1461029757600080fd5b80630ca76175116101a25780630ca761751461022057806314b316781461023357806314d3940d14610249578063225a2b931461025c57600080fd5b8062b105e6146101c85780630494878e146101dd57806309c1ba2e1461020d575b600080fd5b6101db6101d6366004611215565b610449565b005b6008546101f0906001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b6004546101f0906001600160401b031681565b6101db61022e3660046112d3565b6104eb565b61023b610551565b604051908152602001610204565b6101db610257366004611215565b610681565b6101db61026a366004611343565b61071a565b6101db61027d366004611215565b610816565b61028a610910565b60405161020491906113bc565b6008546101f090600160801b90046001600160401b031681565b6101db6102bf3660046113cf565b61099e565b6000546102d7906001600160a01b031681565b6040516001600160a01b039091168152602001610204565b6007546101f090600160a01b90046001600160401b031681565b6101f0610317366004611441565b6109ea565b6007546102d7906001600160a01b031681565b6101f061033d366004611471565b6009602052600090815260409020546001600160401b031681565b61036b6103663660046113cf565b610a13565b60405161020492919061148c565b61023b60055481565b6101db610a39565b6102d7610a4d565b6008546101f090600160c01b90046001600160401b031681565b6103b4610a7b565b60405161020491906114af565b61023b60065481565b6008546101f090600160401b90046001600160401b031681565b6101db6103f23660046114fb565b610a8c565b6101db61040536600461156b565b610ae0565b6101db610418366004611215565b610baf565b60045461043490600160401b900463ffffffff1681565b60405163ffffffff9091168152602001610204565b610451610bed565b61045c600182610c3a565b61049f5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b6104aa600182610c5f565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6000546001600160a01b031633146105165760405163c6829f8360e01b815260040160405180910390fd5b610521838383610c74565b60405183907f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e690600090a2505050565b600061055b610a4d565b6001600160a01b0316336001600160a01b0316148061058457506007546001600160a01b031633145b6105c35760405162461bcd60e51b815260206004820152601060248201526f2737ba20b63637bbb2b221b0b63632b960811b6044820152606401610496565b610677600380546105d3906115d0565b80601f01602080910402602001604051908101604052809291908181526020018280546105ff906115d0565b801561064c5780601f106106215761010080835404028352916020019161064c565b820191906000526020600020905b81548152906001019060200180831161062f57829003601f168201915b50506004546005546001600160401b0382169450600160401b90910463ffffffff1692509050610d48565b6006819055905090565b610689610bed565b610694600182610c3a565b156106d55760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610496565b6106e0600182610dfc565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016104e0565b6000610724610e11565b805490915060ff600160401b82041615906001600160401b031660008115801561074b5750825b90506000826001600160401b031660011480156107675750303b155b905081158015610775575080155b156107935760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156107bd57845460ff60401b1916600160401b1785555b6107c78787610e3a565b831561080d57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050565b6000610820610e11565b805490915060ff600160401b82041615906001600160401b03166000811580156108475750825b90506000826001600160401b031660011480156108635750303b155b905081158015610871575080155b1561088f5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156108b957845460ff60401b1916600160401b1785555b6108c286610ea5565b831561090857845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6003805461091d906115d0565b80601f0160208091040260200160405190810160405280929190818152602001828054610949906115d0565b80156109965780601f1061096b57610100808354040283529160200191610996565b820191906000526020600020905b81548152906001019060200180831161097957829003601f168201915b505050505081565b6109a6610ebf565b156109e6576008805467ffffffffffffffff60801b1916600160801b426001600160401b031602179055600380546109e291906105d3906115d0565b6006555b5050565b6008546000906001600160401b0316610a038184611620565b610a0d919061165c565b92915050565b60006060610a1f610ebf565b604080516000815260208101909152909590945092505050565b610a41610bed565b610a4b6000610f7e565b565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6060610a876001610fef565b905090565b610a94610bed565b6003610aa085826116cd565b506004805463ffffffff909316600160401b026bffffffffffffffffffffffff199093166001600160401b03909416939093179190911790915560055550565b610ae8610bed565b600780546001600160a01b0387166001600160e01b03199091168117600160a01b6001600160401b0388811691820292909217909355600880548783166fffffffffffffffffffffffffffffffff199091168117600160401b888516908102919091176001600160c01b0316600160c01b948816948502179092556040805195865260208601919091528401526060830152907fbed5a7c7626f62707ea8a0c71900fd8623e8ae9fde3cd99cfa5dc7d54bbabee09060800160405180910390a25050505050565b610bb7610bed565b6001600160a01b038116610be157604051631e4fbdf760e01b815260006004820152602401610496565b610bea81610f7e565b50565b6000610bf7610a4d565b90506001600160a01b03811615801590610c1a57506001600160a01b0381163314155b15610bea5760405163118cdaa760e01b8152336004820152602401610496565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000610c58836001600160a01b038416610ffc565b60096000610c81426109ea565b6001600160401b0390811682526020820192909252604001600090812080549092169190610cae8361178b565b91906101000a8154816001600160401b0302191690836001600160401b03160217905550508260065414610cf85760405163d068bf5b60e01b815260048101849052602401610496565b60018251118015610d0857508051155b50827f7873807bf6ddc50401cd3d29bbe0decee23fd4d68d273f4b5eb83cded4d2f1728383604051610d3b9291906117b6565b60405180910390a2505050565b6000805460405163230e93b160e11b815282916001600160a01b03169063461d276290610d829088908a906001908a908a906004016117e4565b6020604051808303816000875af1158015610da1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc5919061182d565b60405190915081907f1131472297a800fee664d1d89cfa8f7676ff07189ecc53f80bbb5f4969099db890600090a295945050505050565b6000610c58836001600160a01b0384166110f6565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610a0d565b600080546001600160a01b0319166001600160a01b0383161790556001600160a01b03821615610e6d57610e6d82610ea5565b6040516001600160a01b038216907f8e027fb3d390e4e77e8857eb25c3f2b2b17eb69cb36c0b1b993f8a94e29accea90600090a25050565b6001600160a01b038116610eb65750335b6106d581611145565b6008546000906001600160401b03600160c01b9091048116489091161115610ee75750600090565b600754600854610f11916001600160401b03600160a01b909104811691600160801b900416611846565b6001600160401b0316426001600160401b03161015610f305750600090565b600854600160401b90046001600160401b031660096000610f50426109ea565b6001600160401b0390811682526020820192909252604001600020541610610f785750600090565b50600190565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60606000610c5883611156565b600081815260018301602052604081205480156110e5576000611020600183611865565b855490915060009061103490600190611865565b905080821461109957600086600001828154811061105457611054611878565b906000526020600020015490508087600001848154811061107757611077611878565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806110aa576110aa61188e565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610a0d565b6000915050610a0d565b5092915050565b600081815260018301602052604081205461113d57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610a0d565b506000610a0d565b61114d6111b2565b610bea816111d7565b6060816000018054806020026020016040519081016040528092919081815260200182805480156111a657602002820191906000526020600020905b815481526020019060010190808311611192575b50505050509050919050565b6111ba6111df565b610a4b57604051631afcd79f60e31b815260040160405180910390fd5b610bb76111b2565b60006111e9610e11565b54600160401b900460ff16919050565b80356001600160a01b038116811461121057600080fd5b919050565b60006020828403121561122757600080fd5b610c58826111f9565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261125757600080fd5b81356001600160401b0381111561127057611270611230565b604051601f8201601f19908116603f011681016001600160401b038111828210171561129e5761129e611230565b6040528181528382016020018510156112b657600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000606084860312156112e857600080fd5b8335925060208401356001600160401b0381111561130557600080fd5b61131186828701611246565b92505060408401356001600160401b0381111561132d57600080fd5b61133986828701611246565b9150509250925092565b6000806040838503121561135657600080fd5b61135f836111f9565b915061136d602084016111f9565b90509250929050565b6000815180845260005b8181101561139c57602081850181015186830182015201611380565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610c586020830184611376565b600080602083850312156113e257600080fd5b82356001600160401b038111156113f857600080fd5b8301601f8101851361140957600080fd5b80356001600160401b0381111561141f57600080fd5b85602082840101111561143157600080fd5b6020919091019590945092505050565b60006020828403121561145357600080fd5b5035919050565b80356001600160401b038116811461121057600080fd5b60006020828403121561148357600080fd5b610c588261145a565b82151581526040602082015260006114a76040830184611376565b949350505050565b602080825282518282018190526000918401906040840190835b818110156114f05783516001600160a01b03168352602093840193909201916001016114c9565b509095945050505050565b6000806000806080858703121561151157600080fd5b84356001600160401b0381111561152757600080fd5b61153387828801611246565b9450506115426020860161145a565b9250604085013563ffffffff8116811461155b57600080fd5b9396929550929360600135925050565b600080600080600060a0868803121561158357600080fd5b61158c866111f9565b945061159a6020870161145a565b93506115a86040870161145a565b92506115b66060870161145a565b91506115c46080870161145a565b90509295509295909350565b600181811c908216806115e457607f821691505b60208210810361160457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60006001600160401b0383168061164757634e487b7160e01b600052601260045260246000fd5b806001600160401b0384160491505092915050565b6001600160401b0381811683821602908116908181146110ef576110ef61160a565b601f8211156116c857806000526020600020601f840160051c810160208510156116a55750805b601f840160051c820191505b818110156116c557600081556001016116b1565b50505b505050565b81516001600160401b038111156116e6576116e6611230565b6116fa816116f484546115d0565b8461167e565b6020601f82116001811461172e57600083156117165750848201515b600019600385901b1c1916600184901b1784556116c5565b600084815260208120601f198516915b8281101561175e578785015182556020948501946001909201910161173e565b508482101561177c5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b60006001600160401b0382166001600160401b0381036117ad576117ad61160a565b60010192915050565b6040815260006117c96040830185611376565b82810360208401526117db8185611376565b95945050505050565b6001600160401b038616815260a06020820152600061180660a0830187611376565b61ffff9590951660408301525063ffffffff92909216606083015260809091015292915050565b60006020828403121561183f57600080fd5b5051919050565b6001600160401b038181168382160190811115610a0d57610a0d61160a565b81810381811115610a0d57610a0d61160a565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea26469706673582212206a9a6110b1912937b8067a48fba3e15e9c3aac851afffb1678c8ef7b3fd1663a64736f6c634300081e0033';
const isSuperArgs$6 = (xs) => xs.length > 1;
class BaseFunctionsConsumer__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$6(args)) {
            super(...args);
        } else {
            super(_abi$7, _bytecode$6, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$6;
    static abi = _abi$7;
    static createInterface() {
        return new Interface(_abi$7);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$7, runner);
    }
}

var index$d = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    BaseFunctionsConsumer__factory: BaseFunctionsConsumer__factory,
});

const _abi$6 = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newSettler',
                type: 'address',
            },
        ],
        name: 'AddSettler',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'int256',
                name: 'current',
                type: 'int256',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'updatedAt',
                type: 'uint256',
            },
        ],
        name: 'AnswerUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
        ],
        name: 'NewAsset',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'description',
                type: 'string',
            },
        ],
        name: 'NewDescription',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'startedBy',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'startedAt',
                type: 'uint256',
            },
        ],
        name: 'NewRound',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'oldSettler',
                type: 'address',
            },
        ],
        name: 'RemoveSettler',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'addSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'asset',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'deploymentTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'description',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint80',
                name: '_roundId',
                type: 'uint80',
            },
        ],
        name: 'getRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: 'roundId',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: 'answer',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: 'startedAt',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'updatedAt',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: 'answeredInRound',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        name: 'getTimestampAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
        ],
        name: 'initializeFeed',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
        ],
        name: 'initializeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRound',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_settler',
                type: 'address',
            },
        ],
        name: 'removeSettler',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_asset',
                type: 'address',
            },
        ],
        name: 'setAsset',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
        ],
        name: 'setDescription',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_version',
                type: 'uint256',
            },
        ],
        name: 'setVersion',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'settlers',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'int256',
                name: 'newAnswer',
                type: 'int256',
            },
        ],
        name: 'updateAnswer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'version',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const _bytecode$5 =
    '0x60806040526006600455348015601457600080fd5b50611237806100246000396000f3fe608060405234801561001057600080fd5b50600436106101725760003560e01c80637284e416116100de578063b1da41fe11610097578063bfc12c0511610071578063bfc12c0514610383578063d0d552dd1461038c578063f2fde38b1461039f578063feaf968c146103b257600080fd5b8063b1da41fe1461032e578063b5ab58dc14610343578063b633620c1461036357600080fd5b80637284e416146102735780638205bf6a146102885780638da5cb5b1461029157806390c3f38f146102c15780639a6fc8f5146102d4578063a87a20ce1461031b57600080fd5b80633b2235fc116101305780633b2235fc1461020f578063408def1e1461023d57806350d25bcd1461025057806354fd4d5014610259578063668a0f0214610262578063715018a61461026b57600080fd5b8062b105e614610177578063057b39671461018c57806314d3940d1461019f578063313ce567146101b2578063329bad17146101d157806338d52e0f146101e4575b600080fd5b61018a610185366004610e1b565b6103ba565b005b61018a61019a366004610edb565b61045c565b61018a6101ad366004610e1b565b61055c565b6101ba600881565b60405160ff90911681526020015b60405180910390f35b61018a6101df366004610e1b565b6105f5565b6002546101f7906001600160a01b031681565b6040516001600160a01b0390911681526020016101c8565b61022f61021d366004610f39565b600b6020526000908152604090205481565b6040519081526020016101c8565b61018a61024b366004610f39565b6106f1565b61022f60065481565b61022f60045481565b61022f60085481565b61018a6106fe565b61027b610712565b6040516101c89190610f52565b61022f60075481565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03166101f7565b61018a6102cf366004610fa0565b6107a0565b6102e76102e2366004610fdd565b6107e4565b604080516001600160501b03968716815260208101959095528401929092526060830152909116608082015260a0016101c8565b61018a610329366004610f39565b610862565b6103366108c3565b6040516101c89190611006565b61022f610351366004610f39565b60096020526000908152604090205481565b61022f610371366004610f39565b600a6020526000908152604090205481565b61022f60055481565b61018a61039a366004610e1b565b6108d4565b61018a6103ad366004610e1b565b610926565b6102e7610961565b6103c2610985565b6103cd6000826109fb565b6104105760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61041b600082610a22565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6000610466610a37565b805490915060ff600160401b820416159067ffffffffffffffff1660008115801561048e5750825b905060008267ffffffffffffffff1660011480156104ab5750303b155b9050811580156104b9575080155b156104d75760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561050157845460ff60401b1916600160401b1785555b61050c888888610a60565b831561055257845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b5050505050505050565b610564610985565b61056f6000826109fb565b156105b05760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610407565b6105bb600082610a89565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e90602001610451565b60006105ff610a37565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156106275750825b905060008267ffffffffffffffff1660011480156106445750303b155b905081158015610652575080155b156106705760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561069a57845460ff60401b1916600160401b1785555b6106a386610a9e565b83156106e957845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6106f9610985565b600455565b610706610985565b6107106000610ab8565b565b6003805461071f90611052565b80601f016020809104026020016040519081016040528092919081815260200182805461074b90611052565b80156107985780601f1061076d57610100808354040283529160200191610798565b820191906000526020600020905b81548152906001019060200180831161077b57829003601f168201915b505050505081565b6107a8610985565b60036107b482826110da565b507f16fbb51445345dabaa215e5f99a4bd4d8ba9818b508c76d5cd0ea30abcc491c6816040516104519190610f52565b6001600160501b0381166000818152600960205260408120548392909190819081906108125760055461083a565b600a600061082a60016001600160501b038a166111af565b8152602001908152602001600020545b6001600160501b0387166000908152600a602052604090205495979496909594909350915050565b61086d6000336109fb565b6108a75760405162461bcd60e51b815260206004820152600b60248201526a2727aa2fa9a2aa2a2622a960a91b6044820152606401610407565b6108c08160085460016108ba91906111c2565b42610b29565b50565b60606108cf6000610bf5565b905090565b6108dc610985565b600280546001600160a01b0319166001600160a01b0383169081179091556040517fc7d9598af6004de7fa9c489a50a55414c75cfbce9fe56fe46956970744d6bc2c90600090a250565b61092e610985565b6001600160a01b03811661095857604051631e4fbdf760e01b815260006004820152602401610407565b6108c081610ab8565b60008060008060006109746008546107e4565b945094509450945094509091929394565b60006109b87f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b90506001600160a01b038116158015906109db57506001600160a01b0381163314155b156108c05760405163118cdaa760e01b8152336004820152602401610407565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b6000610a19836001600160a01b038416610c09565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610a1c565b426005556006600455610a72826108d4565b610a7b816107a0565b610a8483610a9e565b505050565b6000610a19836001600160a01b038416610cfc565b6001600160a01b038116610aaf5750335b6105b081610d4b565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b8060075410610b3757505050565b6006839055600781905560088290556000828152600a6020908152604080832080546009845282852088905590859055848452600b909252909120849055151580610bb457604051828152339084907f0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac602719060200160405180910390a35b82847f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f84604051610be791815260200190565b60405180910390a350505050565b60606000610c0283610d5c565b9392505050565b60008181526001830160205260408120548015610cf2576000610c2d6001836111af565b8554909150600090610c41906001906111af565b9050808214610ca6576000866000018281548110610c6157610c616111d5565b9060005260206000200154905080876000018481548110610c8457610c846111d5565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610cb757610cb76111eb565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610a1c565b6000915050610a1c565b6000818152600183016020526040812054610d4357508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610a1c565b506000610a1c565b610d53610db8565b6108c081610ddd565b606081600001805480602002602001604051908101604052809291908181526020018280548015610dac57602002820191906000526020600020905b815481526020019060010190808311610d98575b50505050509050919050565b610dc0610de5565b61071057604051631afcd79f60e31b815260040160405180910390fd5b61092e610db8565b6000610def610a37565b54600160401b900460ff16919050565b80356001600160a01b0381168114610e1657600080fd5b919050565b600060208284031215610e2d57600080fd5b610a1982610dff565b634e487b7160e01b600052604160045260246000fd5b600082601f830112610e5d57600080fd5b813567ffffffffffffffff811115610e7757610e77610e36565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610ea657610ea6610e36565b604052818152838201602001851015610ebe57600080fd5b816020850160208301376000918101602001919091529392505050565b600080600060608486031215610ef057600080fd5b610ef984610dff565b9250610f0760208501610dff565b9150604084013567ffffffffffffffff811115610f2357600080fd5b610f2f86828701610e4c565b9150509250925092565b600060208284031215610f4b57600080fd5b5035919050565b602081526000825180602084015260005b81811015610f805760208186018101516040868401015201610f63565b506000604082850101526040601f19601f83011684010191505092915050565b600060208284031215610fb257600080fd5b813567ffffffffffffffff811115610fc957600080fd5b610fd584828501610e4c565b949350505050565b600060208284031215610fef57600080fd5b81356001600160501b0381168114610c0257600080fd5b602080825282518282018190526000918401906040840190835b818110156110475783516001600160a01b0316835260209384019390920191600101611020565b509095945050505050565b600181811c9082168061106657607f821691505b60208210810361108657634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115610a8457806000526020600020601f840160051c810160208510156110b35750805b601f840160051c820191505b818110156110d357600081556001016110bf565b5050505050565b815167ffffffffffffffff8111156110f4576110f4610e36565b611108816111028454611052565b8461108c565b6020601f82116001811461113c57600083156111245750848201515b600019600385901b1c1916600184901b1784556110d3565b600084815260208120601f198516915b8281101561116c578785015182556020948501946001909201910161114c565b508482101561118a5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b81810381811115610a1c57610a1c611199565b80820180821115610a1c57610a1c611199565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220753ba77d37458d50dd7aefd91f3b7f3beab5e29c5895b37a363afe45a71dd63b64736f6c634300081e0033';
const isSuperArgs$5 = (xs) => xs.length > 1;
class DataFeed__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$5(args)) {
            super(...args);
        } else {
            super(_abi$6, _bytecode$5, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$5;
    static abi = _abi$6;
    static createInterface() {
        return new Interface(_abi$6);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$6, runner);
    }
}

var index$c = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    DataFeed__factory: DataFeed__factory,
});

const _abi$5 = [
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'denomination',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'latestAggregator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'previousAggregator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint16',
                name: 'nextPhaseId',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'FeedConfirmed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'asset',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'denomination',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'proposedAggregator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'currentAggregator',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'FeedProposed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        inputs: [],
        name: 'aggregator',
        outputs: [
            {
                internalType: 'contract DataFeedAggregator',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'asset',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_aggregator',
                type: 'address',
            },
        ],
        name: 'callAsset',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'deploymentTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'description',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_roundId',
                type: 'uint256',
            },
        ],
        name: 'getAnswer',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint80',
                name: '_roundId',
                type: 'uint80',
            },
        ],
        name: 'getRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_roundId',
                type: 'uint256',
            },
        ],
        name: 'getTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_timestamp',
                type: 'uint256',
            },
        ],
        name: 'getTimestampAnswer',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_aggregator',
                type: 'address',
            },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestAnswer',
        outputs: [
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRound',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
            {
                internalType: 'int256',
                name: '',
                type: 'int256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint80',
                name: '',
                type: 'uint80',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'latestTimestamp',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        name: 'phaseAggregators',
        outputs: [
            {
                internalType: 'contract DataFeedAggregator',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'phaseId',
        outputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_aggregator',
                type: 'address',
            },
        ],
        name: 'proposeAggregator',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'version',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
const _bytecode$4 =
    '0x6080604052348015600f57600080fd5b50610fdf8061001f6000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c80637284e416116100b8578063b633620c1161007c578063b633620c146102c2578063bfc12c05146102d5578063c1597304146102dd578063f2fde38b14610306578063f8a2abd314610319578063feaf968c1461032c57600080fd5b80637284e416146102185780638205bf6a1461022d5780638da5cb5b146102355780639a6fc8f514610265578063b5ab58dc146102af57600080fd5b8063485cc9551161010a578063485cc955146101c257806350d25bcd146101d757806354fd4d50146101df57806358303b10146101e7578063668a0f0214610208578063715018a61461021057600080fd5b8063245a7bfc1461014757806330c812731461016c578063313ce5671461017f57806338d52e0f146101995780633b2235fc146101a1575b600080fd5b61014f610334565b6040516001600160a01b0390911681526020015b60405180910390f35b61014f61017a366004610cbc565b610354565b61018761040a565b60405160ff9091168152602001610163565b61014f61047a565b6101b46101af366004610ce0565b610487565b604051908152602001610163565b6101d56101d0366004610cf9565b610505565b005b6101b461061a565b6101b4610685565b6000546101f59061ffff1681565b60405161ffff9091168152602001610163565b6101b46106cc565b6101d5610713565b610220610727565b6040516101639190610d56565b6101b4610796565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031661014f565b610278610273366004610da1565b6107dd565b6040805169ffffffffffffffffffff968716815260208101959095528401929092526060830152909116608082015260a001610163565b6101b46102bd366004610ce0565b610875565b6101b46102d0366004610ce0565b6108ac565b6101b46108e3565b61014f6102eb366004610dbe565b6001602052600090815260409020546001600160a01b031681565b6101d5610314366004610cbc565b61092a565b6101d5610327366004610cbc565b61096d565b610278610abd565b6000805461ffff168152600160205260409020546001600160a01b031690565b60408051600481526024810182526020810180516001600160e01b03166338d52e0f60e01b1790529051600091829182916001600160a01b0386169161039a9190610de2565b600060405180830381855afa9150503d80600081146103d5576040519150601f19603f3d011682016040523d82523d6000602084013e6103da565b606091505b5091509150816103ee575060009392505050565b808060200190518101906104029190610dfe565b949350505050565b6000610414610334565b6001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610451573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104759190610e1b565b905090565b600061047561017a610334565b6000610491610334565b6001600160a01b0316633b2235fc836040518263ffffffff1660e01b81526004016104be91815260200190565b602060405180830381865afa1580156104db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ff9190610e3e565b92915050565b600061050f610b3f565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156105375750825b905060008267ffffffffffffffff1660011480156105545750303b155b905081158015610562575080155b156105805760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156105aa57845460ff60401b1916600160401b1785555b6001600160a01b038616156105c2576105c28661096d565b6105cb87610b68565b831561061157845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050565b6000610624610334565b6001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610661573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104759190610e3e565b600061068f610334565b6001600160a01b03166354fd4d506040518163ffffffff1660e01b8152600401602060405180830381865afa158015610661573d6000803e3d6000fd5b60006106d6610334565b6001600160a01b031663668a0f026040518163ffffffff1660e01b8152600401602060405180830381865afa158015610661573d6000803e3d6000fd5b61071b610b79565b6107256000610bef565b565b6060610731610334565b6001600160a01b0316637284e4166040518163ffffffff1660e01b8152600401600060405180830381865afa15801561076e573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526104759190810190610e6d565b60006107a0610334565b6001600160a01b0316638205bf6a6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610661573d6000803e3d6000fd5b60008060008060006107ed610334565b604051639a6fc8f560e01b815269ffffffffffffffffffff881660048201526001600160a01b039190911690639a6fc8f59060240160a060405180830381865afa15801561083f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108639190610f22565b939a9299509097509550909350915050565b600061087f610334565b6001600160a01b031663b5ab58dc836040518263ffffffff1660e01b81526004016104be91815260200190565b60006108b6610334565b6001600160a01b031663b633620c836040518263ffffffff1660e01b81526004016104be91815260200190565b60006108ed610334565b6001600160a01b031663bfc12c056040518163ffffffff1660e01b8152600401602060405180830381865afa158015610661573d6000803e3d6000fd5b610932610b79565b6001600160a01b03811661096157604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b61096a81610bef565b50565b610975610b79565b806000610980610334565b9050600061098d84610354565b60005490915061ffff161515806109ac57506001600160a01b03821615155b156109e0576000805461ffff1690806109c483610f7a565b91906101000a81548161ffff021916908361ffff160217905550505b6000805461ffff1681526001602090815260409182902080546001600160a01b0319166001600160a01b03878116919091179091558251858216815233928101929092528681169261034892918516917fb56c4f88c3e344891ef92e51f036d7116e886f4ea57f5ba93e28b5f44925b9ce910160405180910390a4600054604080516001600160a01b03858116825261ffff9093166020820152338183015290518683169261034892908516917f27a180c70f2642f63d1694eb252b7df52e7ab2565e3f67adf7748acb7d82b9bc9181900360600190a450505050565b6000806000806000610acd610334565b6001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610b0a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b2e9190610f22565b945094509450945094509091929394565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a006104ff565b610b70610c60565b61096a81610c85565b6000610bac7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b90506001600160a01b03811615801590610bcf57506001600160a01b0381163314155b1561096a5760405163118cdaa760e01b8152336004820152602401610958565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b610c68610c8d565b61072557604051631afcd79f60e31b815260040160405180910390fd5b610932610c60565b6000610c97610b3f565b54600160401b900460ff16919050565b6001600160a01b038116811461096a57600080fd5b600060208284031215610cce57600080fd5b8135610cd981610ca7565b9392505050565b600060208284031215610cf257600080fd5b5035919050565b60008060408385031215610d0c57600080fd5b8235610d1781610ca7565b91506020830135610d2781610ca7565b809150509250929050565b60005b83811015610d4d578181015183820152602001610d35565b50506000910152565b6020815260008251806020840152610d75816040850160208701610d32565b601f01601f19169190910160400192915050565b69ffffffffffffffffffff8116811461096a57600080fd5b600060208284031215610db357600080fd5b8135610cd981610d89565b600060208284031215610dd057600080fd5b813561ffff81168114610cd957600080fd5b60008251610df4818460208701610d32565b9190910192915050565b600060208284031215610e1057600080fd5b8151610cd981610ca7565b600060208284031215610e2d57600080fd5b815160ff81168114610cd957600080fd5b600060208284031215610e5057600080fd5b5051919050565b634e487b7160e01b600052604160045260246000fd5b600060208284031215610e7f57600080fd5b815167ffffffffffffffff811115610e9657600080fd5b8201601f81018413610ea757600080fd5b805167ffffffffffffffff811115610ec157610ec1610e57565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610ef057610ef0610e57565b604052818152828201602001861015610f0857600080fd5b610f19826020830160208601610d32565b95945050505050565b600080600080600060a08688031215610f3a57600080fd5b8551610f4581610d89565b60208701516040880151606089015160808a015193985091965094509250610f6c81610d89565b809150509295509295909350565b600061ffff821661ffff8103610fa057634e487b7160e01b600052601160045260246000fd5b6001019291505056fea2646970667358221220e714beebc0198d2b4b156079cfcf6b7c74956c967ef19f8c0fbb3c25e4c2a9c364736f6c634300081e0033';
const isSuperArgs$4 = (xs) => xs.length > 1;
class DataFeedAggregator__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$4(args)) {
            super(...args);
        } else {
            super(_abi$5, _bytecode$4, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$4;
    static abi = _abi$5;
    static createInterface() {
        return new Interface(_abi$5);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$5, runner);
    }
}

var index$b = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    DataFeedAggregator__factory: DataFeedAggregator__factory,
});

const _abi$4 = [
    {
        inputs: [],
        name: 'OnlyRouterCanFulfill',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestFulfilled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'id',
                type: 'bytes32',
            },
        ],
        name: 'RequestSent',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'requestId',
                type: 'bytes32',
            },
            {
                internalType: 'bytes',
                name: 'response',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: 'err',
                type: 'bytes',
            },
        ],
        name: 'handleOracleFulfillment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'i_router',
        outputs: [
            {
                internalType: 'contract IFunctionsRouter',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
];
class FunctionsClient__factory {
    static abi = _abi$4;
    static createInterface() {
        return new Interface(_abi$4);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$4, runner);
    }
}

var index$a = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    FunctionsClient__factory: FunctionsClient__factory,
});

var index$9 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    agtPriceFeedSol: index$f,
    agtReserveFeedSol: index$e,
    baseFunctionsConsumerSol: index$d,
    dataFeedAggregatorSol: index$b,
    dataFeedSol: index$c,
    functionsClientSol: index$a,
});

const _abi$3 = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'admin',
                type: 'address',
            },
        ],
        name: 'ERC1967InvalidAdmin',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
            },
        ],
        name: 'ERC1967InvalidImplementation',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ERC1967NonPayable',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'previousAdmin',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'newAdmin',
                type: 'address',
            },
        ],
        name: 'AdminChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'string',
                name: 'description',
                type: 'string',
            },
        ],
        name: 'DescriptionChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'implementation',
                type: 'address',
            },
        ],
        name: 'Upgraded',
        type: 'event',
    },
    {
        stateMutability: 'payable',
        type: 'fallback',
    },
    {
        inputs: [],
        name: 'admin',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newAdmin',
                type: 'address',
            },
        ],
        name: 'changeAdmin',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
        ],
        name: 'changeDescription',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'implementation',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: '_description',
                type: 'string',
            },
            {
                internalType: 'address',
                name: 'newAdmin',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'newImplementation',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'initializeProxy',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'proxyDescription',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newImplementation',
                type: 'address',
            },
            {
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'upgradeToAndCall',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        stateMutability: 'payable',
        type: 'receive',
    },
];
const _bytecode$3 =
    '0x6080604052348015600f57600080fd5b50610aac8061001f6000396000f3fe6080604052600436106100745760003560e01c8063aba001731161004e578063aba00173146100f0578063e612041314610103578063ee0530f414610123578063f851a4401461014557610083565b80634f1ef2861461008b5780635c60da1b1461009e5780638f283970146100d057610083565b366100835761008161015a565b005b61008161015a565b610081610099366004610762565b61016c565b3480156100aa57600080fd5b506100b36101bb565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100dc57600080fd5b506100816100eb3660046107b0565b6101ca565b6100816100fe3660046107d2565b61020e565b34801561010f57600080fd5b5061008161011e36600461085c565b6102a2565b34801561012f57600080fd5b506101386102e3565b6040516100c791906108bd565b34801561015157600080fd5b506100b3610394565b61016a61016561039e565b6103a8565b565b6101746103d1565b6001600160a01b0316336001600160a01b0316146101ad5760405162461bcd60e51b81526004016101a4906108f0565b60405180910390fd5b6101b782826103db565b5050565b60006101c561039e565b905090565b6101d26103d1565b6001600160a01b0316336001600160a01b0316146102025760405162461bcd60e51b81526004016101a4906108f0565b61020b81610494565b50565b600061021861039e565b6001600160a01b031614801561023e575060006102336103d1565b6001600160a01b0316145b6102805760405162461bcd60e51b81526020600482015260136024820152721053149150511657d253925512505312569151606a1b60448201526064016101a4565b61028983610494565b61029382826103db565b61029c846104e8565b50505050565b6102aa6103d1565b6001600160a01b0316336001600160a01b0316146102da5760405162461bcd60e51b81526004016101a4906108f0565b61020b816104e8565b60607ffcba12fcf625f4823c7c0c86b97ab29721afc9e784836bc00bf04553a0c8dff4805461031190610913565b80601f016020809104026020016040519081016040528092919081815260200182805461033d90610913565b801561038a5780601f1061035f5761010080835404028352916020019161038a565b820191906000526020600020905b81548152906001019060200180831161036d57829003601f168201915b5050505050905090565b60006101c56103d1565b60006101c5610555565b3660008037600080366000845af43d6000803e8080156103c7573d6000f35b3d6000fd5b505050565b60006101c5610588565b6103e4826105b0565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561048c57600080836001600160a01b03168360405161043a919061094d565b600060405180830381855af49150503d8060008114610475576040519150601f19603f3d011682016040523d82523d6000602084013e61047a565b606091505b50915091508161029c57805181602001fd5b6101b761062a565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f6104bd610588565b604080516001600160a01b03928316815291841660208301520160405180910390a161020b81610649565b80511561020b577ffcba12fcf625f4823c7c0c86b97ab29721afc9e784836bc00bf04553a0c8dff461051a82826109b7565b507f8a1bce929b257bfd582fa164d9b9fa4d4b0b7442b10b3aad23e2c56aa4e0d61a8160405161054a91906108bd565b60405180910390a150565b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b546001600160a01b0316919050565b60007fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103610579565b806001600160a01b03163b6000036105e657604051634c9c8ce360e01b81526001600160a01b03821660048201526024016101a4565b807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b80546001600160a01b0319166001600160a01b039290921691909117905550565b341561016a5760405163b398979f60e01b815260040160405180910390fd5b6001600160a01b03811661067357604051633173bdd160e11b8152600060048201526024016101a4565b807fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103610609565b80356001600160a01b03811681146106b157600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126106dd57600080fd5b81356020830160008067ffffffffffffffff8411156106fe576106fe6106b6565b50604051601f19601f85018116603f0116810181811067ffffffffffffffff8211171561072d5761072d6106b6565b60405283815290508082840187101561074557600080fd5b838360208301376000602085830101528094505050505092915050565b6000806040838503121561077557600080fd5b61077e8361069a565b9150602083013567ffffffffffffffff81111561079a57600080fd5b6107a6858286016106cc565b9150509250929050565b6000602082840312156107c257600080fd5b6107cb8261069a565b9392505050565b600080600080608085870312156107e857600080fd5b843567ffffffffffffffff8111156107ff57600080fd5b61080b878288016106cc565b94505061081a6020860161069a565b92506108286040860161069a565b9150606085013567ffffffffffffffff81111561084457600080fd5b610850878288016106cc565b91505092959194509250565b60006020828403121561086e57600080fd5b813567ffffffffffffffff81111561088557600080fd5b610891848285016106cc565b949350505050565b60005b838110156108b457818101518382015260200161089c565b50506000910152565b60208152600082518060208401526108dc816040850160208701610899565b601f01601f19169190910160400192915050565b6020808252600990820152682727aa2fa0a226a4a760b91b604082015260600190565b600181811c9082168061092757607f821691505b60208210810361094757634e487b7160e01b600052602260045260246000fd5b50919050565b6000825161095f818460208701610899565b9190910192915050565b601f8211156103cc57806000526020600020601f840160051c810160208510156109905750805b601f840160051c820191505b818110156109b0576000815560010161099c565b5050505050565b815167ffffffffffffffff8111156109d1576109d16106b6565b6109e5816109df8454610913565b84610969565b6020601f821160018114610a195760008315610a015750848201515b600019600385901b1c1916600184901b1784556109b0565b600084815260208120601f198516915b82811015610a495787850151825560209485019460019092019101610a29565b5084821015610a675786840151600019600387901b60f8161c191681555b50505050600190811b0190555056fea2646970667358221220ee1de67c701a789b5c9672e5d80634c00975e8353c40fcba7350cdd45a489b4864736f6c634300081e0033';
const isSuperArgs$3 = (xs) => xs.length > 1;
class InitializableProxy__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$3(args)) {
            super(...args);
        } else {
            super(_abi$3, _bytecode$3, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$3;
    static abi = _abi$3;
    static createInterface() {
        return new Interface(_abi$3);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$3, runner);
    }
}

var index$8 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    InitializableProxy__factory: InitializableProxy__factory,
});

var index$7 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    initializableProxySol: index$8,
});

const _abi$2 = [
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name_',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'symbol_',
                type: 'string',
            },
            {
                internalType: 'uint8',
                name: 'decimals_',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'supply_',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
        ],
        name: 'ERC2612ExpiredSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'signer',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC2612InvalidSigner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentNonce',
                type: 'uint256',
            },
        ],
        name: 'InvalidAccountNonce',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidShortString',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'str',
                type: 'string',
            },
        ],
        name: 'StringTooLong',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
const _bytecode$2 =
    '0x61018060405234801561001157600080fd5b506040516118a63803806118a68339810160408190526100309161045f565b338480604051806040016040528060018152602001603160f81b8152508787816003908161005e9190610571565b50600461006b8282610571565b5061007b91508390506005610175565b6101205261008a816006610175565b61014052815160208084019190912060e052815190820120610100524660a05261011760e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506001600160a01b03811661015057604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b610159816101a8565b5060ff82166101605261016c33826101fa565b505050506106a7565b60006020835110156101915761018a83610234565b90506101a2565b8161019c8482610571565b5060ff90505b92915050565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166102245760405163ec442f0560e01b815260006004820152602401610147565b61023060008383610272565b5050565b600080829050601f8151111561025f578260405163305a27a960e01b8152600401610147919061062f565b805161026a82610662565b179392505050565b6001600160a01b03831661029d5780600260008282546102929190610686565b9091555061030f9050565b6001600160a01b038316600090815260208190526040902054818110156102f05760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610147565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b03821661032b5760028054829003905561034a565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161038f91815260200190565b60405180910390a3505050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156103cd5781810151838201526020016103b5565b50506000910152565b600082601f8301126103e757600080fd5b81516001600160401b038111156104005761040061039c565b604051601f8201601f19908116603f011681016001600160401b038111828210171561042e5761042e61039c565b60405281815283820160200185101561044657600080fd5b6104578260208301602087016103b2565b949350505050565b6000806000806080858703121561047557600080fd5b84516001600160401b0381111561048b57600080fd5b610497878288016103d6565b602087015190955090506001600160401b038111156104b557600080fd5b6104c1878288016103d6565b935050604085015160ff811681146104d857600080fd5b6060959095015193969295505050565b600181811c908216806104fc57607f821691505b60208210810361051c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561056c57806000526020600020601f840160051c810160208510156105495750805b601f840160051c820191505b818110156105695760008155600101610555565b50505b505050565b81516001600160401b0381111561058a5761058a61039c565b61059e8161059884546104e8565b84610522565b6020601f8211600181146105d257600083156105ba5750848201515b600019600385901b1c1916600184901b178455610569565b600084815260208120601f198516915b8281101561060257878501518255602094850194600190920191016105e2565b50848210156106205786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b602081526000825180602084015261064e8160408501602087016103b2565b601f01601f19169190910160400192915050565b8051602080830151919081101561051c5760001960209190910360031b1b16919050565b808201808211156101a257634e487b7160e01b600052601160045260246000fd5b60805160a05160c05160e0516101005161012051610140516101605161119a61070c600039600061019e015260006109840152600061095701526000610814015260006107ec01526000610747015260006107710152600061079b015261119a6000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806379cc6790116100ad578063a0712d6811610071578063a0712d681461028d578063a9059cbb146102a0578063d505accf146102b3578063dd62ed3e146102c6578063f2fde38b146102ff57600080fd5b806379cc6790146102295780637ecebe001461023c57806384b0196e1461024f5780638da5cb5b1461026a57806395d89b411461028557600080fd5b80633644e515116100f45780633644e515146101c857806340c10f19146101d057806342966c68146101e557806370a08231146101f8578063715018a61461022157600080fd5b806306fdde0314610131578063095ea7b31461014f57806318160ddd1461017257806323b872dd14610184578063313ce56714610197575b600080fd5b610139610312565b6040516101469190610ee4565b60405180910390f35b61016261015d366004610f1a565b6103a4565b6040519015158152602001610146565b6002545b604051908152602001610146565b610162610192366004610f44565b6103be565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610146565b6101766103e2565b6101e36101de366004610f1a565b6103f1565b005b6101e36101f3366004610f81565b610407565b610176610206366004610f9a565b6001600160a01b031660009081526020819052604090205490565b6101e3610414565b6101e3610237366004610f1a565b610428565b61017661024a366004610f9a565b61043d565b61025761045b565b6040516101469796959493929190610fb5565b6008546040516001600160a01b039091168152602001610146565b6101396104a1565b6101e361029b366004610f81565b6104b0565b6101626102ae366004610f1a565b6104c2565b6101e36102c136600461104d565b6104d0565b6101766102d43660046110c0565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101e361030d366004610f9a565b61060f565b606060038054610321906110f3565b80601f016020809104026020016040519081016040528092919081815260200182805461034d906110f3565b801561039a5780601f1061036f5761010080835404028352916020019161039a565b820191906000526020600020905b81548152906001019060200180831161037d57829003601f168201915b5050505050905090565b6000336103b281858561064a565b60019150505b92915050565b6000336103cc85828561065c565b6103d78585856106db565b506001949350505050565b60006103ec61073a565b905090565b6103f9610865565b6104038282610892565b5050565b61041133826108c8565b50565b61041c610865565b61042660006108fe565b565b61043382338361065c565b61040382826108c8565b6001600160a01b0381166000908152600760205260408120546103b8565b60006060806000806000606061046f610950565b61047761097d565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b606060048054610321906110f3565b6104b8610865565b6104113382610892565b6000336103b28185856106db565b834211156104f95760405163313c898160e11b8152600481018590526024015b60405180910390fd5b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886105468c6001600160a01b0316600090815260076020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006105a1826109aa565b905060006105b1828787876109d7565b9050896001600160a01b0316816001600160a01b0316146105f8576040516325c0072360e11b81526001600160a01b0380831660048301528b1660248201526044016104f0565b6106038a8a8a61064a565b50505050505050505050565b610617610865565b6001600160a01b03811661064157604051631e4fbdf760e01b8152600060048201526024016104f0565b610411816108fe565b6106578383836001610a05565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198110156106d557818110156106c657604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064016104f0565b6106d584848484036000610a05565b50505050565b6001600160a01b03831661070557604051634b637e8f60e11b8152600060048201526024016104f0565b6001600160a01b03821661072f5760405163ec442f0560e01b8152600060048201526024016104f0565b610657838383610ada565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561079357507f000000000000000000000000000000000000000000000000000000000000000046145b156107bd57507f000000000000000000000000000000000000000000000000000000000000000090565b6103ec604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6008546001600160a01b031633146104265760405163118cdaa760e01b81523360048201526024016104f0565b6001600160a01b0382166108bc5760405163ec442f0560e01b8152600060048201526024016104f0565b61040360008383610ada565b6001600160a01b0382166108f257604051634b637e8f60e11b8152600060048201526024016104f0565b61040382600083610ada565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006005610c04565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006006610c04565b60006103b86109b761073a565b8360405161190160f01b8152600281019290925260228201526042902090565b6000806000806109e988888888610caf565b9250925092506109f98282610d7e565b50909695505050505050565b6001600160a01b038416610a2f5760405163e602df0560e01b8152600060048201526024016104f0565b6001600160a01b038316610a5957604051634a1406b160e11b8152600060048201526024016104f0565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156106d557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610acc91815260200190565b60405180910390a350505050565b6001600160a01b038316610b05578060026000828254610afa919061112d565b90915550610b779050565b6001600160a01b03831660009081526020819052604090205481811015610b585760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016104f0565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610b9357600280548290039055610bb2565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610bf791815260200190565b60405180910390a3505050565b606060ff8314610c1e57610c1783610e37565b90506103b8565b818054610c2a906110f3565b80601f0160208091040260200160405190810160405280929190818152602001828054610c56906110f3565b8015610ca35780601f10610c7857610100808354040283529160200191610ca3565b820191906000526020600020905b815481529060010190602001808311610c8657829003601f168201915b505050505090506103b8565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115610cea5750600091506003905082610d74565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610d3e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610d6a57506000925060019150829050610d74565b9250600091508190505b9450945094915050565b6000826003811115610d9257610d9261114e565b03610d9b575050565b6001826003811115610daf57610daf61114e565b03610dcd5760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115610de157610de161114e565b03610e025760405163fce698f760e01b8152600481018290526024016104f0565b6003826003811115610e1657610e1661114e565b03610403576040516335e2f38360e21b8152600481018290526024016104f0565b60606000610e4483610e76565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600060ff8216601f8111156103b857604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b81811015610ec457602081850181015186830182015201610ea8565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610ef76020830184610e9e565b9392505050565b80356001600160a01b0381168114610f1557600080fd5b919050565b60008060408385031215610f2d57600080fd5b610f3683610efe565b946020939093013593505050565b600080600060608486031215610f5957600080fd5b610f6284610efe565b9250610f7060208501610efe565b929592945050506040919091013590565b600060208284031215610f9357600080fd5b5035919050565b600060208284031215610fac57600080fd5b610ef782610efe565b60ff60f81b8816815260e060208201526000610fd460e0830189610e9e565b8281036040840152610fe68189610e9e565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b8181101561103c57835183526020938401939092019160010161101e565b50909b9a5050505050505050505050565b600080600080600080600060e0888a03121561106857600080fd5b61107188610efe565b965061107f60208901610efe565b95506040880135945060608801359350608088013560ff811681146110a357600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156110d357600080fd5b6110dc83610efe565b91506110ea60208401610efe565b90509250929050565b600181811c9082168061110757607f821691505b60208210810361112757634e487b7160e01b600052602260045260246000fd5b50919050565b808201808211156103b857634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea2646970667358221220fc351c58252ca46f5af9957b16cdcd69989e3a55eec27983632fffae26f4e97964736f6c634300081e0033';
const isSuperArgs$2 = (xs) => xs.length > 1;
class ERC20Mock__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$2(args)) {
            super(...args);
        } else {
            super(_abi$2, _bytecode$2, args[0]);
        }
    }
    getDeployTransaction(name_, symbol_, decimals_, supply_, overrides) {
        return super.getDeployTransaction(name_, symbol_, decimals_, supply_, overrides || {});
    }
    deploy(name_, symbol_, decimals_, supply_, overrides) {
        return super.deploy(name_, symbol_, decimals_, supply_, overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$2;
    static abi = _abi$2;
    static createInterface() {
        return new Interface(_abi$2);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$2, runner);
    }
}

var index$6 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ERC20Mock__factory: ERC20Mock__factory,
});

const _abi$1 = [
    {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
        ],
        name: 'ERC2612ExpiredSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'signer',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC2612InvalidSigner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentNonce',
                type: 'uint256',
            },
        ],
        name: 'InvalidAccountNonce',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'newMinter',
                type: 'address',
            },
        ],
        name: 'AddMinter',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'oldMinter',
                type: 'address',
            },
        ],
        name: 'RemoveMinter',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_minter',
                type: 'address',
            },
        ],
        name: 'addMinter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_initOwner',
                type: 'address',
            },
        ],
        name: 'initializeGoldToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name_',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'symbol_',
                type: 'string',
            },
            {
                internalType: 'uint8',
                name: 'decimals_',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'supply_',
                type: 'uint256',
            },
        ],
        name: 'initializeToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'minters',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_minter',
                type: 'address',
            },
        ],
        name: 'removeMinter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
const _bytecode$1 =
    '0x6080604052348015600f57600080fd5b50611c438061001f6000396000f3fe608060405234801561001057600080fd5b50600436106101585760003560e01c80637ecebe00116100c3578063a9059cbb1161007c578063a9059cbb146102fe578063b5499b4d14610311578063d505accf14610324578063dd62ed3e14610337578063f2fde38b1461034a578063f97b57ec1461035d57600080fd5b80637ecebe001461026857806384b0196e1461027b5780638da5cb5b1461029657806395d89b41146102d0578063983b2d56146102d85780639b041c41146102eb57600080fd5b80633644e515116101155780633644e5151461020c57806340c10f191461021457806342966c681461022757806370a082311461023a578063715018a61461024d57806379cc67901461025557600080fd5b806306fdde031461015d578063095ea7b31461017b57806318160ddd1461019e57806323b872dd146101cf5780633092afd5146101e2578063313ce567146101f7575b600080fd5b610165610372565b604051610172919061168c565b60405180910390f35b61018e6101893660046116bb565b61041b565b6040519015158152602001610172565b7f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace02545b604051908152602001610172565b61018e6101dd3660046116e5565b610435565b6101f56101f0366004611722565b610459565b005b60005460405160ff9091168152602001610172565b6101c16104fa565b6101f56102223660046116bb565b610509565b6101f561023536600461173d565b61055a565b6101c1610248366004611722565b610567565b6101f561059a565b6101f56102633660046116bb565b6105ae565b6101c1610276366004611722565b6105c3565b6102836105ce565b6040516101729796959493929190611756565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b039091168152602001610172565b61016561067a565b6101f56102e6366004611722565b6106b9565b6101f56102f93660046118a4565b610751565b61018e61030c3660046116bb565b610879565b6101f561031f366004611722565b610887565b6101f5610332366004611925565b61092b565b6101c1610345366004611990565b610a84565b6101f5610358366004611722565b610ace565b610365610b09565b60405161017291906119c3565b60606000600080516020611bce8339815191525b905080600301805461039790611a0f565b80601f01602080910402602001604051908101604052809291908181526020018280546103c390611a0f565b80156104105780601f106103e557610100808354040283529160200191610410565b820191906000526020600020905b8154815290600101906020018083116103f357829003601f168201915b505050505091505090565b600033610429818585610b15565b60019150505b92915050565b600033610443858285610b27565b61044e858585610b8e565b506001949350505050565b610461610bed565b61046c600182610c63565b6104ae5760405162461bcd60e51b815260206004820152600e60248201526d24a72b20a624a22fa6a4a72a22a960911b60448201526064015b60405180910390fd5b6104b9600182610c88565b506040516001600160a01b03821681527f2f91b591fc56ac0917953ad01ec225524ee5ef0555213e4c8a9d8c9728ee7ffb906020015b60405180910390a150565b6000610504610c9d565b905090565b610514600133610c63565b61054c5760405162461bcd60e51b81526020600482015260096024820152682327a92124a22222a760b91b60448201526064016104a5565b6105568282610ca7565b5050565b6105643382610cdd565b50565b600080600080516020611bce8339815191525b6001600160a01b0390931660009081526020939093525050604090205490565b6105a2610bed565b6105ac6000610d13565b565b6105b9823383610b27565b6105568282610cdd565b600061042f82610d84565b60006060808280808381600080516020611bee83398151915280549091501580156105fb57506001810154155b61063f5760405162461bcd60e51b81526020600482015260156024820152741152540dcc4c8e88155b9a5b9a5d1a585b1a5e9959605a1b60448201526064016104a5565b610647610dad565b61064f610dec565b60408051600080825260208201909252600f60f81b9c939b5091995046985030975095509350915050565b7f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace048054606091600080516020611bce8339815191529161039790611a0f565b6106c1610bed565b6106cc600182610c63565b1561070c5760405162461bcd60e51b815260206004820152601060248201526f222aa82624a1a0aa22afa6a4a72a22a960811b60448201526064016104a5565b610717600182610e04565b506040516001600160a01b03821681527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab906020016104ef565b600061075b610e19565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156107835750825b905060008267ffffffffffffffff1660011480156107a05750303b155b9050811580156107ae575080155b156107cc5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156107f657845460ff60401b1916600160401b1785555b6108008989610e42565b61080989610e54565b6000805460ff191660ff89161790558515610828576108283387610ca7565b831561086e57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b600033610429818585610b8e565b6108da6040518060400160405280601281526020017120b937bbb0b7309023b7b632102a37b5b2b760711b815250604051806040016040528060038152602001621051d560ea1b81525060126000610751565b6108e5600182610e04565b506040516001600160a01b03821681527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab9060200160405180910390a161056481610d13565b8342111561094f5760405163313c898160e11b8152600481018590526024016104a5565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886109bb8c6001600160a01b031660009081527f5ab42ced628888259c08ac98db1eb0cf702fc1501344311d8b100cd1bfe4bb006020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e0016040516020818303038152906040528051906020012090506000610a1682610e7f565b90506000610a2682878787610eac565b9050896001600160a01b0316816001600160a01b031614610a6d576040516325c0072360e11b81526001600160a01b0380831660048301528b1660248201526044016104a5565b610a788a8a8a610b15565b50505050505050505050565b6001600160a01b0391821660009081527f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace016020908152604080832093909416825291909152205490565b610ad6610bed565b6001600160a01b038116610b0057604051631e4fbdf760e01b8152600060048201526024016104a5565b61056481610d13565b60606105046001610eda565b610b228383836001610ee7565b505050565b6000610b338484610a84565b9050600019811015610b885781811015610b7957604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064016104a5565b610b8884848484036000610ee7565b50505050565b6001600160a01b038316610bb857604051634b637e8f60e11b8152600060048201526024016104a5565b6001600160a01b038216610be25760405163ec442f0560e01b8152600060048201526024016104a5565b610b22838383610fcf565b6000610c207f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b90506001600160a01b03811615801590610c4357506001600160a01b0381163314155b156105645760405163118cdaa760e01b81523360048201526024016104a5565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000610c81836001600160a01b03841661110d565b6000610504611200565b6001600160a01b038216610cd15760405163ec442f0560e01b8152600060048201526024016104a5565b61055660008383610fcf565b6001600160a01b038216610d0757604051634b637e8f60e11b8152600060048201526024016104a5565b61055682600083610fcf565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b6000807f5ab42ced628888259c08ac98db1eb0cf702fc1501344311d8b100cd1bfe4bb0061057a565b7fa16a46d94261c7517cc8ff89f61c0ce93598e3c849801011dee649a6a557d1028054606091600080516020611bee8339815191529161039790611a0f565b60606000600080516020611bee833981519152610386565b6000610c81836001600160a01b038416611274565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061042f565b610e4a6112c3565b61055682826112e8565b610e5c6112c3565b61056481604051806040016040528060018152602001603160f81b815250611339565b600061042f610e8c610c9d565b8360405161190160f01b8152600281019290925260228201526042902090565b600080600080610ebe8888888861139a565b925092509250610ece8282611469565b50909695505050505050565b60606000610c8183611522565b600080516020611bce8339815191526001600160a01b038516610f205760405163e602df0560e01b8152600060048201526024016104a5565b6001600160a01b038416610f4a57604051634a1406b160e11b8152600060048201526024016104a5565b6001600160a01b03808616600090815260018301602090815260408083209388168352929052208390558115610fc857836001600160a01b0316856001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92585604051610fbf91815260200190565b60405180910390a35b5050505050565b600080516020611bce8339815191526001600160a01b03841661100b57818160020160008282546110009190611a5f565b9091555061107d9050565b6001600160a01b0384166000908152602082905260409020548281101561105e5760405163391434e360e21b81526001600160a01b038616600482015260248101829052604481018490526064016104a5565b6001600160a01b03851660009081526020839052604090209083900390555b6001600160a01b03831661109b5760028101805483900390556110ba565b6001600160a01b03831660009081526020829052604090208054830190555b826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516110ff91815260200190565b60405180910390a350505050565b600081815260018301602052604081205480156111f6576000611131600183611a72565b855490915060009061114590600190611a72565b90508082146111aa57600086600001828154811061116557611165611a85565b906000526020600020015490508087600001848154811061118857611188611a85565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806111bb576111bb611a9b565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061042f565b600091505061042f565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f61122b61157e565b6112336115e8565b60408051602081019490945283019190915260608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b60008181526001830160205260408120546112bb5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561042f565b50600061042f565b6112cb61162c565b6105ac57604051631afcd79f60e31b815260040160405180910390fd5b6112f06112c3565b600080516020611bce8339815191527f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace0361132a8482611af8565b5060048101610b888382611af8565b6113416112c3565b600080516020611bee8339815191527fa16a46d94261c7517cc8ff89f61c0ce93598e3c849801011dee649a6a557d10261137b8482611af8565b506003810161138a8382611af8565b5060008082556001909101555050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156113d5575060009150600390508261145f565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015611429573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166114555750600092506001915082905061145f565b9250600091508190505b9450945094915050565b600082600381111561147d5761147d611bb7565b03611486575050565b600182600381111561149a5761149a611bb7565b036114b85760405163f645eedf60e01b815260040160405180910390fd5b60028260038111156114cc576114cc611bb7565b036114ed5760405163fce698f760e01b8152600481018290526024016104a5565b600382600381111561150157611501611bb7565b03610556576040516335e2f38360e21b8152600481018290526024016104a5565b60608160000180548060200260200160405190810160405280929190818152602001828054801561157257602002820191906000526020600020905b81548152602001906001019080831161155e575b50505050509050919050565b6000600080516020611bee83398151915281611598610dad565b8051909150156115b057805160209091012092915050565b815480156115bf579392505050565b7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470935050505090565b6000600080516020611bee83398151915281611602610dec565b80519091501561161a57805160209091012092915050565b600182015480156115bf579392505050565b6000611636610e19565b54600160401b900460ff16919050565b6000815180845260005b8181101561166c57602081850181015186830182015201611650565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610c816020830184611646565b80356001600160a01b03811681146116b657600080fd5b919050565b600080604083850312156116ce57600080fd5b6116d78361169f565b946020939093013593505050565b6000806000606084860312156116fa57600080fd5b6117038461169f565b92506117116020850161169f565b929592945050506040919091013590565b60006020828403121561173457600080fd5b610c818261169f565b60006020828403121561174f57600080fd5b5035919050565b60ff60f81b8816815260e06020820152600061177560e0830189611646565b82810360408401526117878189611646565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b818110156117dd5783518352602093840193909201916001016117bf565b50909b9a5050505050505050505050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261181557600080fd5b813567ffffffffffffffff81111561182f5761182f6117ee565b604051601f8201601f19908116603f0116810167ffffffffffffffff8111828210171561185e5761185e6117ee565b60405281815283820160200185101561187657600080fd5b816020850160208301376000918101602001919091529392505050565b803560ff811681146116b657600080fd5b600080600080608085870312156118ba57600080fd5b843567ffffffffffffffff8111156118d157600080fd5b6118dd87828801611804565b945050602085013567ffffffffffffffff8111156118fa57600080fd5b61190687828801611804565b93505061191560408601611893565b9396929550929360600135925050565b600080600080600080600060e0888a03121561194057600080fd5b6119498861169f565b96506119576020890161169f565b9550604088013594506060880135935061197360808901611893565b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156119a357600080fd5b6119ac8361169f565b91506119ba6020840161169f565b90509250929050565b602080825282518282018190526000918401906040840190835b81811015611a045783516001600160a01b03168352602093840193909201916001016119dd565b509095945050505050565b600181811c90821680611a2357607f821691505b602082108103611a4357634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561042f5761042f611a49565b8181038181111561042f5761042f611a49565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b601f821115610b2257806000526020600020601f840160051c81016020851015611ad85750805b601f840160051c820191505b81811015610fc85760008155600101611ae4565b815167ffffffffffffffff811115611b1257611b126117ee565b611b2681611b208454611a0f565b84611ab1565b6020601f821160018114611b5a5760008315611b425750848201515b600019600385901b1c1916600184901b178455610fc8565b600084815260208120601f198516915b82811015611b8a5787850151825560209485019460019092019101611b6a565b5084821015611ba85786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b634e487b7160e01b600052602160045260246000fdfe52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00a16a46d94261c7517cc8ff89f61c0ce93598e3c849801011dee649a6a557d100a264697066735822122012ddbd6f46ed2fa208ed7fc0d51b5a45829c990f9f7a5cfa66653a108e00486b64736f6c634300081e0033';
const isSuperArgs$1 = (xs) => xs.length > 1;
class GoldToken__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs$1(args)) {
            super(...args);
        } else {
            super(_abi$1, _bytecode$1, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode$1;
    static abi = _abi$1;
    static createInterface() {
        return new Interface(_abi$1);
    }
    static connect(address, runner) {
        return new Contract(address, _abi$1, runner);
    }
}

var index$5 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    GoldToken__factory: GoldToken__factory,
});

const _abi = [
    {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'length',
                type: 'uint256',
            },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'allowance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'balance',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'needed',
                type: 'uint256',
            },
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'approver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidApprover',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'ERC20InvalidSpender',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
        ],
        name: 'ERC2612ExpiredSignature',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'signer',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'ERC2612InvalidSigner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'currentNonce',
                type: 'uint256',
            },
        ],
        name: 'InvalidAccountNonce',
        type: 'error',
    },
    {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
    },
    {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint64',
                name: 'version',
                type: 'uint64',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'burnFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
            {
                internalType: 'bytes1',
                name: 'fields',
                type: 'bytes1',
            },
            {
                internalType: 'string',
                name: 'name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'version',
                type: 'string',
            },
            {
                internalType: 'uint256',
                name: 'chainId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'verifyingContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: 'salt',
                type: 'bytes32',
            },
            {
                internalType: 'uint256[]',
                name: 'extensions',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'string',
                name: 'name_',
                type: 'string',
            },
            {
                internalType: 'string',
                name: 'symbol_',
                type: 'string',
            },
            {
                internalType: 'uint8',
                name: 'decimals_',
                type: 'uint8',
            },
            {
                internalType: 'uint256',
                name: 'supply_',
                type: 'uint256',
            },
        ],
        name: 'initializeToken',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'deadline',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'permit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
const _bytecode =
    '0x6080604052348015600f57600080fd5b5061154a8061001f6000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806379cc6790116100975780639b041c41116100665780639b041c4114610218578063a9059cbb1461022b578063d505accf1461023e578063dd62ed3e1461025157600080fd5b806379cc6790146101cf5780637ecebe00146101e257806384b0196e146101f557806395d89b411461021057600080fd5b8063313ce567116100d3578063313ce5671461018a5780633644e5151461019f57806342966c68146101a757806370a08231146101bc57600080fd5b806306fdde0314610105578063095ea7b31461012357806318160ddd1461014657806323b872dd14610177575b600080fd5b61010d610264565b60405161011a919061101f565b60405180910390f35b610136610131366004611055565b61030d565b604051901515815260200161011a565b7f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace02545b60405190815260200161011a565b61013661018536600461107f565b610327565b60005460405160ff909116815260200161011a565b61016961034b565b6101ba6101b53660046110bc565b61035a565b005b6101696101ca3660046110d5565b610367565b6101ba6101dd366004611055565b61039a565b6101696101f03660046110d5565b6103b3565b6101fd6103be565b60405161011a97969594939291906110f0565b61010d61046f565b6101ba61022636600461123e565b6104ae565b610136610239366004611055565b6105d6565b6101ba61024c3660046112bf565b6105e4565b61016961025f36600461132a565b61073d565b606060006000805160206114d58339815191525b90508060030180546102899061135d565b80601f01602080910402602001604051908101604052809291908181526020018280546102b59061135d565b80156103025780601f106102d757610100808354040283529160200191610302565b820191906000526020600020905b8154815290600101906020018083116102e557829003601f168201915b505050505091505090565b60003361031b818585610787565b60019150505b92915050565b600033610335858285610799565b610340858585610800565b506001949350505050565b600061035561085f565b905090565b6103643382610869565b50565b6000806000805160206114d58339815191525b6001600160a01b0390931660009081526020939093525050604090205490565b6103a5823383610799565b6103af8282610869565b5050565b60006103218261089f565b600060608082808083816000805160206114f583398151915280549091501580156103eb57506001810154155b6104345760405162461bcd60e51b81526020600482015260156024820152741152540dcc4c8e88155b9a5b9a5d1a585b1a5e9959605a1b60448201526064015b60405180910390fd5b61043c6108c8565b610444610907565b60408051600080825260208201909252600f60f81b9c939b5091995046985030975095509350915050565b7f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace0480546060916000805160206114d5833981519152916102899061135d565b60006104b861091f565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156104e05750825b905060008267ffffffffffffffff1660011480156104fd5750303b155b90508115801561050b575080155b156105295760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561055357845460ff60401b1916600160401b1785555b61055d8989610948565b6105668961095a565b6000805460ff191660ff89161790558515610585576105853387610985565b83156105cb57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b60003361031b818585610800565b834211156106085760405163313c898160e11b81526004810185905260240161042b565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886106748c6001600160a01b031660009081527f5ab42ced628888259c08ac98db1eb0cf702fc1501344311d8b100cd1bfe4bb006020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006106cf826109bb565b905060006106df828787876109e8565b9050896001600160a01b0316816001600160a01b031614610726576040516325c0072360e11b81526001600160a01b0380831660048301528b16602482015260440161042b565b6107318a8a8a610787565b50505050505050505050565b6001600160a01b0391821660009081527f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace016020908152604080832093909416825291909152205490565b6107948383836001610a16565b505050565b60006107a5848461073d565b90506000198110156107fa57818110156107eb57604051637dc7a0d960e11b81526001600160a01b0384166004820152602481018290526044810183905260640161042b565b6107fa84848484036000610a16565b50505050565b6001600160a01b03831661082a57604051634b637e8f60e11b81526000600482015260240161042b565b6001600160a01b0382166108545760405163ec442f0560e01b81526000600482015260240161042b565b610794838383610afe565b6000610355610c3c565b6001600160a01b03821661089357604051634b637e8f60e11b81526000600482015260240161042b565b6103af82600083610afe565b6000807f5ab42ced628888259c08ac98db1eb0cf702fc1501344311d8b100cd1bfe4bb0061037a565b7fa16a46d94261c7517cc8ff89f61c0ce93598e3c849801011dee649a6a557d10280546060916000805160206114f5833981519152916102899061135d565b606060006000805160206114f5833981519152610278565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610321565b610950610cb0565b6103af8282610cd7565b610962610cb0565b61036481604051806040016040528060018152602001603160f81b815250610d28565b6001600160a01b0382166109af5760405163ec442f0560e01b81526000600482015260240161042b565b6103af60008383610afe565b60006103216109c861085f565b8360405161190160f01b8152600281019290925260228201526042902090565b6000806000806109fa88888888610d89565b925092509250610a0a8282610e58565b50909695505050505050565b6000805160206114d58339815191526001600160a01b038516610a4f5760405163e602df0560e01b81526000600482015260240161042b565b6001600160a01b038416610a7957604051634a1406b160e11b81526000600482015260240161042b565b6001600160a01b03808616600090815260018301602090815260408083209388168352929052208390558115610af757836001600160a01b0316856001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92585604051610aee91815260200190565b60405180910390a35b5050505050565b6000805160206114d58339815191526001600160a01b038416610b3a5781816002016000828254610b2f9190611397565b90915550610bac9050565b6001600160a01b03841660009081526020829052604090205482811015610b8d5760405163391434e360e21b81526001600160a01b0386166004820152602481018290526044810184905260640161042b565b6001600160a01b03851660009081526020839052604090209083900390555b6001600160a01b038316610bca576002810180548390039055610be9565b6001600160a01b03831660009081526020829052604090208054830190555b826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610c2e91815260200190565b60405180910390a350505050565b60007f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f610c67610f11565b610c6f610f7b565b60408051602081019490945283019190915260608201524660808201523060a082015260c00160405160208183030381529060405280519060200120905090565b610cb8610fbf565b610cd557604051631afcd79f60e31b815260040160405180910390fd5b565b610cdf610cb0565b6000805160206114d58339815191527f52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace03610d1984826113ff565b50600481016107fa83826113ff565b610d30610cb0565b6000805160206114f58339815191527fa16a46d94261c7517cc8ff89f61c0ce93598e3c849801011dee649a6a557d102610d6a84826113ff565b5060038101610d7983826113ff565b5060008082556001909101555050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115610dc45750600091506003905082610e4e565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610e18573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610e4457506000925060019150829050610e4e565b9250600091508190505b9450945094915050565b6000826003811115610e6c57610e6c6114be565b03610e75575050565b6001826003811115610e8957610e896114be565b03610ea75760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115610ebb57610ebb6114be565b03610edc5760405163fce698f760e01b81526004810182905260240161042b565b6003826003811115610ef057610ef06114be565b036103af576040516335e2f38360e21b81526004810182905260240161042b565b60006000805160206114f583398151915281610f2b6108c8565b805190915015610f4357805160209091012092915050565b81548015610f52579392505050565b7fc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470935050505090565b60006000805160206114f583398151915281610f95610907565b805190915015610fad57805160209091012092915050565b60018201548015610f52579392505050565b6000610fc961091f565b54600160401b900460ff16919050565b6000815180845260005b81811015610fff57602081850181015186830182015201610fe3565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006110326020830184610fd9565b9392505050565b80356001600160a01b038116811461105057600080fd5b919050565b6000806040838503121561106857600080fd5b61107183611039565b946020939093013593505050565b60008060006060848603121561109457600080fd5b61109d84611039565b92506110ab60208501611039565b929592945050506040919091013590565b6000602082840312156110ce57600080fd5b5035919050565b6000602082840312156110e757600080fd5b61103282611039565b60ff60f81b8816815260e06020820152600061110f60e0830189610fd9565b82810360408401526111218189610fd9565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b81811015611177578351835260209384019390920191600101611159565b50909b9a5050505050505050505050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126111af57600080fd5b813567ffffffffffffffff8111156111c9576111c9611188565b604051601f8201601f19908116603f0116810167ffffffffffffffff811182821017156111f8576111f8611188565b60405281815283820160200185101561121057600080fd5b816020850160208301376000918101602001919091529392505050565b803560ff8116811461105057600080fd5b6000806000806080858703121561125457600080fd5b843567ffffffffffffffff81111561126b57600080fd5b6112778782880161119e565b945050602085013567ffffffffffffffff81111561129457600080fd5b6112a08782880161119e565b9350506112af6040860161122d565b9396929550929360600135925050565b600080600080600080600060e0888a0312156112da57600080fd5b6112e388611039565b96506112f160208901611039565b9550604088013594506060880135935061130d6080890161122d565b9699959850939692959460a0840135945060c09093013592915050565b6000806040838503121561133d57600080fd5b61134683611039565b915061135460208401611039565b90509250929050565b600181811c9082168061137157607f821691505b60208210810361139157634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561032157634e487b7160e01b600052601160045260246000fd5b601f82111561079457806000526020600020601f840160051c810160208510156113df5750805b601f840160051c820191505b81811015610af757600081556001016113eb565b815167ffffffffffffffff81111561141957611419611188565b61142d81611427845461135d565b846113b8565b6020601f82116001811461146157600083156114495750848201515b600019600385901b1c1916600184901b178455610af7565b600084815260208120601f198516915b828110156114915787850151825560209485019460019092019101611471565b50848210156114af5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b634e487b7160e01b600052602160045260246000fdfe52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00a16a46d94261c7517cc8ff89f61c0ce93598e3c849801011dee649a6a557d100a26469706673582212208d975e45d1b8835fd1bfc7dac1b1f724cd0910ef6d9f2a5b2a5ad28be86829bf64736f6c634300081e0033';
const isSuperArgs = (xs) => xs.length > 1;
class InitializableERC20__factory extends ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        } else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static bytecode = _bytecode;
    static abi = _abi;
    static createInterface() {
        return new Interface(_abi);
    }
    static connect(address, runner) {
        return new Contract(address, _abi, runner);
    }
}

var index$4 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    InitializableERC20__factory: InitializableERC20__factory,
});

var index$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    erc20MockSol: index$6,
    goldTokenSol: index$5,
    initializableErc20Sol: index$4,
});

var index$2 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    goldMinterSol: index$p,
    interfaces: index$k,
    libraries: index$g,
    lockSol: index$o,
    oracles: index$9,
    proxy: index$7,
    tokens: index$3,
});

var index$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    chainlink: index$1j,
    contracts: index$2,
    openzeppelin: index$q,
});

var index = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    AGTPriceFeed__factory: AGTPriceFeed__factory,
    AGTReserveFeed__factory: AGTReserveFeed__factory,
    Address__factory: Address__factory,
    AutomationBase__factory: AutomationBase__factory,
    AutomationCompatibleInterface__factory: AutomationCompatibleInterface__factory,
    AutomationCompatible__factory: AutomationCompatible__factory,
    BaseFunctionsConsumer__factory: BaseFunctionsConsumer__factory,
    ContextUpgradeable__factory: ContextUpgradeable__factory,
    DataFeedAggregator__factory: DataFeedAggregator__factory,
    DataFeed__factory: DataFeed__factory,
    ECDSA__factory: ECDSA__factory,
    EIP712Upgradeable__factory: EIP712Upgradeable__factory,
    EIP712__factory: EIP712__factory,
    ERC1967Utils__factory: ERC1967Utils__factory,
    ERC20BurnableUpgradeable__factory: ERC20BurnableUpgradeable__factory,
    ERC20Burnable__factory: ERC20Burnable__factory,
    ERC20Mock__factory: ERC20Mock__factory,
    ERC20PermitUpgradeable__factory: ERC20PermitUpgradeable__factory,
    ERC20Permit__factory: ERC20Permit__factory,
    ERC20Upgradeable__factory: ERC20Upgradeable__factory,
    ERC20__factory: ERC20__factory,
    Errors__factory: Errors__factory,
    FunctionsClient__factory: FunctionsClient__factory,
    FunctionsRequest__factory: FunctionsRequest__factory,
    GoldMinter__factory: GoldMinter__factory,
    GoldToken__factory: GoldToken__factory,
    IBeacon__factory: IBeacon__factory,
    IERC1155Errors__factory: IERC1155Errors__factory,
    IERC1363__factory: IERC1363__factory,
    IERC165__factory: IERC165__factory,
    IERC1967__factory: IERC1967__factory,
    IERC20Errors__factory: IERC20Errors__factory,
    IERC20Exp__factory: IERC20Exp__factory,
    IERC20Metadata__factory: IERC20Metadata__factory,
    IERC20Mintable__factory: IERC20Mintable__factory,
    IERC20Permit__factory: IERC20Permit__factory,
    IERC20__factory: IERC20__factory,
    IERC5267__factory: IERC5267__factory,
    IERC721Errors__factory: IERC721Errors__factory,
    IFunctionsClient__factory: IFunctionsClient__factory,
    IFunctionsRouter__factory: IFunctionsRouter__factory,
    IInitializableProxy__factory: IInitializableProxy__factory,
    IPriceFeed__factory: IPriceFeed__factory,
    InitializableERC20__factory: InitializableERC20__factory,
    InitializableProxy__factory: InitializableProxy__factory,
    Initializable__factory: Initializable__factory,
    Lock__factory: Lock__factory,
    NoncesUpgradeable__factory: NoncesUpgradeable__factory,
    Nonces__factory: Nonces__factory,
    OwnableUpgradeable__factory: OwnableUpgradeable__factory,
    Ownable__factory: Ownable__factory,
    Proxy__factory: Proxy__factory,
    ReentrancyGuardUpgradeable__factory: ReentrancyGuardUpgradeable__factory,
    SafeCast__factory: SafeCast__factory,
    SafeERC20__factory: SafeERC20__factory,
    ShortStrings__factory: ShortStrings__factory,
    SigLib__factory: SigLib__factory,
    Strings__factory: Strings__factory,
    WithSettler__factory: WithSettler__factory,
    factories: index$1,
});

var Networks = /* @__PURE__ */ ((Networks2) => {
    Networks2[(Networks2['MAINNET'] = 1)] = 'MAINNET';
    Networks2[(Networks2['ARBITRUM_SEPOLIA'] = 421614)] = 'ARBITRUM_SEPOLIA';
    return Networks2;
})(Networks || {});
const goldConfigs = {
    [421614 /* ARBITRUM_SEPOLIA */]: {
        chainId: 421614 /* ARBITRUM_SEPOLIA */,
        rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
        goldToken: '0x90dEDb255F05C8FFEeb628a6b9Ad6160e8174Cb0',
        goldPriceFeed: '0xBB7D041d5E2828569f4Bd667509AE15c3862298C',
        goldReserveFeed: '0x46013a422ac2fb5c10f1bba16abba4175fc54426',
        goldMinter: '0x27c58B2e12841402671C2D86fE5AC4e0100498C0',
    },
};
function getStableCoinContract(address, runner) {
    return ERC20Mock__factory.connect(address, runner);
}
function getGoldTokenContract(address, runner) {
    return GoldToken__factory.connect(address, runner);
}
function getGoldPriceFeedContract(address, runner) {
    return DataFeed__factory.connect(address, runner);
}
function getGoldReserveFeedContract(address, runner) {
    return DataFeed__factory.connect(address, runner);
}
function getGoldMinterContract(address, runner) {
    return GoldMinter__factory.connect(address, runner);
}

const DATAFEED_DECIMALS = 8;
const GOLD_TOKEN_DECIMALS = 18;
const USD_TOKEN_MAX_DECIMALS = 6;
var Levels = /* @__PURE__ */ ((Levels2) => {
    Levels2[(Levels2['DEFAULT'] = 0)] = 'DEFAULT';
    Levels2[(Levels2['KYCD'] = 1)] = 'KYCD';
    Levels2[(Levels2['APPROVED'] = 2)] = 'APPROVED';
    return Levels2;
})(Levels || {});
async function getGoldStats({ goldToken, goldPriceFeed, goldReserveFeed, goldMinter }) {
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
        goldSupply: NumDecimals(formatEther(goldTokenSupply)),
        goldPrice: NumDecimals(formatUnits(goldPriceFeedAns, DATAFEED_DECIMALS)),
        goldReserve: NumDecimals(formatUnits(goldReserveFeedAns, DATAFEED_DECIMALS)),
        slippage: NumDecimals(Number(slippage) / 100, 3),
        fees: NumDecimals(Number(fees) / 100, 3),
        tradeLevel: Number(tradeLevel),
        minGoldAmount: NumDecimals(formatEther(minGoldAmount)),
        minGoldFee: NumDecimals(formatEther(minGoldFee)),
        minGoldFeeAmount: NumDecimals(formatEther(minGoldFeeAmount)),
    };
}
function calculateSwap({ inputAmount, isBuy, goldPrice, fees, slippage, minGoldFee, minGoldFeeAmount }) {
    const outputDecimals = isBuy ? GOLD_TOKEN_DECIMALS : USD_TOKEN_MAX_DECIMALS;
    const outputAmount = NumDecimals(
        isBuy ? inputAmount / goldPrice : inputAmount * goldPrice,
        outputDecimals,
    );
    const goldAmount = isBuy ? outputAmount : inputAmount;
    const overMinGoldFeeAmount = goldAmount >= (minGoldFeeAmount || 0);
    const goldFees = NumDecimals(
        overMinGoldFeeAmount ? (goldAmount * (fees || 0)) / 100 : minGoldFee || 0,
        GOLD_TOKEN_DECIMALS,
    );
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
function NumDecimals(num, maxDecimals = 18) {
    return Number(Number(num).toFixed(maxDecimals));
}

export {
    DATAFEED_DECIMALS,
    GOLD_TOKEN_DECIMALS,
    Levels,
    Networks,
    NumDecimals,
    USD_TOKEN_MAX_DECIMALS,
    calculateSwap,
    index as contracts,
    getGoldMinterContract,
    getGoldPriceFeedContract,
    getGoldReserveFeedContract,
    getGoldStats,
    getGoldTokenContract,
    getStableCoinContract,
    goldConfigs,
};
