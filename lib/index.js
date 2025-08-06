import { ContractFactory, Interface, Contract, formatEther, formatUnits } from 'ethers';

const _abi$P = [
  {
    inputs: [],
    name: "OnlySimulatedBackend",
    type: "error"
  }
];
const _bytecode$k = "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220bf379d922fe670f526022cd63b5e26dbb187dad1f7e1adef7badef490118606c64736f6c634300081e0033";
const isSuperArgs$k = (xs) => xs.length > 1;
class AutomationBase__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$k(args)) {
      super(...args);
    } else {
      super(_abi$P, _bytecode$k, args[0]);
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
  static abi = _abi$P;
  static createInterface() {
    return new Interface(_abi$P);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$P, runner);
  }
}

var index$1l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AutomationBase__factory: AutomationBase__factory
});

const _abi$O = [
  {
    inputs: [],
    name: "OnlySimulatedBackend",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "checkData",
        type: "bytes"
      }
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool"
      },
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes"
      }
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class AutomationCompatible__factory {
  static abi = _abi$O;
  static createInterface() {
    return new Interface(_abi$O);
  }
  static connect(address, runner) {
    return new Contract(
      address,
      _abi$O,
      runner
    );
  }
}

var index$1k = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AutomationCompatible__factory: AutomationCompatible__factory
});

const _abi$N = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "checkData",
        type: "bytes"
      }
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool"
      },
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "performData",
        type: "bytes"
      }
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class AutomationCompatibleInterface__factory {
  static abi = _abi$N;
  static createInterface() {
    return new Interface(_abi$N);
  }
  static connect(address, runner) {
    return new Contract(
      address,
      _abi$N,
      runner
    );
  }
}

var index$1j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AutomationCompatibleInterface__factory: AutomationCompatibleInterface__factory
});

var index$1i = /*#__PURE__*/Object.freeze({
  __proto__: null,
  automationCompatibleInterfaceSol: index$1j
});

var index$1h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  automationBaseSol: index$1l,
  automationCompatibleSol: index$1k,
  interfaces: index$1i
});

const _abi$M = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes"
      }
    ],
    name: "handleOracleFulfillment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IFunctionsClient__factory {
  static abi = _abi$M;
  static createInterface() {
    return new Interface(_abi$M);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$M, runner);
  }
}

var index$1g = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IFunctionsClient__factory: IFunctionsClient__factory
});

const _abi$L = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes"
      },
      {
        internalType: "uint96",
        name: "juelsPerGas",
        type: "uint96"
      },
      {
        internalType: "uint96",
        name: "costWithoutFulfillment",
        type: "uint96"
      },
      {
        internalType: "address",
        name: "transmitter",
        type: "address"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "requestId",
            type: "bytes32"
          },
          {
            internalType: "address",
            name: "coordinator",
            type: "address"
          },
          {
            internalType: "uint96",
            name: "estimatedTotalCostJuels",
            type: "uint96"
          },
          {
            internalType: "address",
            name: "client",
            type: "address"
          },
          {
            internalType: "uint64",
            name: "subscriptionId",
            type: "uint64"
          },
          {
            internalType: "uint32",
            name: "callbackGasLimit",
            type: "uint32"
          },
          {
            internalType: "uint72",
            name: "adminFee",
            type: "uint72"
          },
          {
            internalType: "uint72",
            name: "donFee",
            type: "uint72"
          },
          {
            internalType: "uint40",
            name: "gasOverheadBeforeCallback",
            type: "uint40"
          },
          {
            internalType: "uint40",
            name: "gasOverheadAfterCallback",
            type: "uint40"
          },
          {
            internalType: "uint32",
            name: "timeoutTimestamp",
            type: "uint32"
          }
        ],
        internalType: "struct FunctionsResponse.Commitment",
        name: "commitment",
        type: "tuple"
      }
    ],
    name: "fulfill",
    outputs: [
      {
        internalType: "enum FunctionsResponse.FulfillResult",
        name: "",
        type: "uint8"
      },
      {
        internalType: "uint96",
        name: "",
        type: "uint96"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getAdminFee",
    outputs: [
      {
        internalType: "uint72",
        name: "adminFee",
        type: "uint72"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllowListId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "getContractById",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "getProposedContractById",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getProposedContractSet",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]"
      },
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64"
      },
      {
        internalType: "uint32",
        name: "callbackGasLimit",
        type: "uint32"
      }
    ],
    name: "isValidCallbackGasLimit",
    outputs: [],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "proposalSetIds",
        type: "bytes32[]"
      },
      {
        internalType: "address[]",
        name: "proposalSetAddresses",
        type: "address[]"
      }
    ],
    name: "proposeContractsUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      },
      {
        internalType: "uint16",
        name: "dataVersion",
        type: "uint16"
      },
      {
        internalType: "uint32",
        name: "callbackGasLimit",
        type: "uint32"
      },
      {
        internalType: "bytes32",
        name: "donId",
        type: "bytes32"
      }
    ],
    name: "sendRequest",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "subscriptionId",
        type: "uint64"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      },
      {
        internalType: "uint16",
        name: "dataVersion",
        type: "uint16"
      },
      {
        internalType: "uint32",
        name: "callbackGasLimit",
        type: "uint32"
      },
      {
        internalType: "bytes32",
        name: "donId",
        type: "bytes32"
      }
    ],
    name: "sendRequestToProposed",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "allowListId",
        type: "bytes32"
      }
    ],
    name: "setAllowListId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "updateContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IFunctionsRouter__factory {
  static abi = _abi$L;
  static createInterface() {
    return new Interface(_abi$L);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$L, runner);
  }
}

var index$1f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IFunctionsRouter__factory: IFunctionsRouter__factory
});

var index$1e = /*#__PURE__*/Object.freeze({
  __proto__: null,
  iFunctionsClientSol: index$1g,
  iFunctionsRouterSol: index$1f
});

const _abi$K = [
  {
    inputs: [],
    name: "EmptyArgs",
    type: "error"
  },
  {
    inputs: [],
    name: "EmptySecrets",
    type: "error"
  },
  {
    inputs: [],
    name: "EmptySource",
    type: "error"
  },
  {
    inputs: [],
    name: "NoInlineSecrets",
    type: "error"
  },
  {
    inputs: [],
    name: "REQUEST_DATA_VERSION",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
const _bytecode$j = "0x608c6037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c80635d641dfc146038575b600080fd5b603f600181565b60405161ffff909116815260200160405180910390f3fea26469706673582212202b4b7e4bd324d9ed20026d245a468c6a22c23fcd83e741f915c4d57b57cfe18e64736f6c634300081e0033";
const isSuperArgs$j = (xs) => xs.length > 1;
class FunctionsRequest__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$j(args)) {
      super(...args);
    } else {
      super(_abi$K, _bytecode$j, args[0]);
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
  static abi = _abi$K;
  static createInterface() {
    return new Interface(_abi$K);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$K, runner);
  }
}

var index$1d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  FunctionsRequest__factory: FunctionsRequest__factory
});

var index$1c = /*#__PURE__*/Object.freeze({
  __proto__: null,
  functionsRequestSol: index$1d
});

var index$1b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  interfaces: index$1e,
  libraries: index$1c
});

var index$1a = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v100: index$1b
});

var index$19 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  automation: index$1h,
  functions: index$1a
});

var index$18 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v08: index$19
});

var index$17 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  src: index$18
});

var index$16 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  contracts: index$17
});

const _abi$J = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class Ownable__factory {
  static abi = _abi$J;
  static createInterface() {
    return new Interface(_abi$J);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$J, runner);
  }
}

var index$15 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Ownable__factory: Ownable__factory
});

var index$14 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ownableSol: index$15
});

const _abi$I = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approveAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "approveAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "transferAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "transferFromAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFromAndCall",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IERC1363__factory {
  static abi = _abi$I;
  static createInterface() {
    return new Interface(_abi$I);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$I, runner);
  }
}

var index$13 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC1363__factory: IERC1363__factory
});

const _abi$H = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address"
      }
    ],
    name: "AdminChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address"
      }
    ],
    name: "BeaconUpgraded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address"
      }
    ],
    name: "Upgraded",
    type: "event"
  }
];
class IERC1967__factory {
  static abi = _abi$H;
  static createInterface() {
    return new Interface(_abi$H);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$H, runner);
  }
}

var index$12 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC1967__factory: IERC1967__factory
});

const _abi$G = [
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
class IERC5267__factory {
  static abi = _abi$G;
  static createInterface() {
    return new Interface(_abi$G);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$G, runner);
  }
}

var index$11 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC5267__factory: IERC5267__factory
});

const _abi$F = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "ERC1155InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC1155InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "idsLength",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "valuesLength",
        type: "uint256"
      }
    ],
    name: "ERC1155InvalidArrayLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "ERC1155InvalidOperator",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC1155InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC1155InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "ERC1155MissingApprovalForAll",
    type: "error"
  }
];
class IERC1155Errors__factory {
  static abi = _abi$F;
  static createInterface() {
    return new Interface(_abi$F);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$F, runner);
  }
}

const _abi$E = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSpender",
    type: "error"
  }
];
class IERC20Errors__factory {
  static abi = _abi$E;
  static createInterface() {
    return new Interface(_abi$E);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$E, runner);
  }
}

const _abi$D = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "ERC721IncorrectOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "ERC721InsufficientApproval",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC721InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address"
      }
    ],
    name: "ERC721InvalidOperator",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "ERC721InvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC721InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC721InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "ERC721NonexistentToken",
    type: "error"
  }
];
class IERC721Errors__factory {
  static abi = _abi$D;
  static createInterface() {
    return new Interface(_abi$D);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$D, runner);
  }
}

var index$10 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC1155Errors__factory: IERC1155Errors__factory,
  IERC20Errors__factory: IERC20Errors__factory,
  IERC721Errors__factory: IERC721Errors__factory
});

var index$$ = /*#__PURE__*/Object.freeze({
  __proto__: null,
  draftIerc6093Sol: index$10,
  ierc1363Sol: index$13,
  ierc1967Sol: index$12,
  ierc5267Sol: index$11
});

const _abi$C = [
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address"
      }
    ],
    name: "ERC1967InvalidAdmin",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beacon",
        type: "address"
      }
    ],
    name: "ERC1967InvalidBeacon",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address"
      }
    ],
    name: "ERC1967InvalidImplementation",
    type: "error"
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error"
  }
];
const _bytecode$i = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122062a9372f0c9794e2f611e7fac1948437e6dbf8deea2847f072755d64b12d060864736f6c634300081e0033";
const isSuperArgs$i = (xs) => xs.length > 1;
class ERC1967Utils__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$i(args)) {
      super(...args);
    } else {
      super(_abi$C, _bytecode$i, args[0]);
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
  static abi = _abi$C;
  static createInterface() {
    return new Interface(_abi$C);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$C, runner);
  }
}

var index$_ = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ERC1967Utils__factory: ERC1967Utils__factory
});

var index$Z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  erc1967UtilsSol: index$_
});

const _abi$B = [
  {
    stateMutability: "payable",
    type: "fallback"
  }
];
class Proxy__factory {
  static abi = _abi$B;
  static createInterface() {
    return new Interface(_abi$B);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$B, runner);
  }
}

var index$Y = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Proxy__factory: Proxy__factory
});

const _abi$A = [
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
class IBeacon__factory {
  static abi = _abi$A;
  static createInterface() {
    return new Interface(_abi$A);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$A, runner);
  }
}

var index$X = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IBeacon__factory: IBeacon__factory
});

var index$W = /*#__PURE__*/Object.freeze({
  __proto__: null,
  iBeaconSol: index$X
});

var index$V = /*#__PURE__*/Object.freeze({
  __proto__: null,
  beacon: index$W,
  erc1967: index$Z,
  proxySol: index$Y
});

const _abi$z = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSpender",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class ERC20__factory {
  static abi = _abi$z;
  static createInterface() {
    return new Interface(_abi$z);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$z, runner);
  }
}

var index$U = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ERC20__factory: ERC20__factory
});

const _abi$y = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IERC20__factory {
  static abi = _abi$y;
  static createInterface() {
    return new Interface(_abi$y);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$y, runner);
  }
}

var index$T = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC20__factory: IERC20__factory
});

const _abi$x = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSpender",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class ERC20Burnable__factory {
  static abi = _abi$x;
  static createInterface() {
    return new Interface(_abi$x);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$x, runner);
  }
}

var index$S = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ERC20Burnable__factory: ERC20Burnable__factory
});

const _abi$w = [
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSpender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "ERC2612ExpiredSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "ERC2612InvalidSigner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "currentNonce",
        type: "uint256"
      }
    ],
    name: "InvalidAccountNonce",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "StringTooLong",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class ERC20Permit__factory {
  static abi = _abi$w;
  static createInterface() {
    return new Interface(_abi$w);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$w, runner);
  }
}

var index$R = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ERC20Permit__factory: ERC20Permit__factory
});

const _abi$v = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IERC20Metadata__factory {
  static abi = _abi$v;
  static createInterface() {
    return new Interface(_abi$v);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$v, runner);
  }
}

var index$Q = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC20Metadata__factory: IERC20Metadata__factory
});

const _abi$u = [
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IERC20Permit__factory {
  static abi = _abi$u;
  static createInterface() {
    return new Interface(_abi$u);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$u, runner);
  }
}

var index$P = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC20Permit__factory: IERC20Permit__factory
});

var index$O = /*#__PURE__*/Object.freeze({
  __proto__: null,
  erc20BurnableSol: index$S,
  erc20PermitSol: index$R,
  ierc20MetadataSol: index$Q,
  ierc20PermitSol: index$P
});

const _abi$t = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "currentAllowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "requestedDecrease",
        type: "uint256"
      }
    ],
    name: "SafeERC20FailedDecreaseAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "SafeERC20FailedOperation",
    type: "error"
  }
];
const _bytecode$h = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220dbf8e4203f94d8e4ad734d5eb2cdac4926867b2e8c5d6eae4dfcf7d5f94684e564736f6c634300081e0033";
const isSuperArgs$h = (xs) => xs.length > 1;
class SafeERC20__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$h(args)) {
      super(...args);
    } else {
      super(_abi$t, _bytecode$h, args[0]);
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
  static abi = _abi$t;
  static createInterface() {
    return new Interface(_abi$t);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$t, runner);
  }
}

var index$N = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SafeERC20__factory: SafeERC20__factory
});

var index$M = /*#__PURE__*/Object.freeze({
  __proto__: null,
  safeErc20Sol: index$N
});

var index$L = /*#__PURE__*/Object.freeze({
  __proto__: null,
  erc20Sol: index$U,
  extensions: index$O,
  ierc20Sol: index$T,
  utils: index$M
});

var index$K = /*#__PURE__*/Object.freeze({
  __proto__: null,
  erc20: index$L
});

const _abi$s = [
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address"
      }
    ],
    name: "AddressEmptyCode",
    type: "error"
  }
];
const _bytecode$g = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212201fc2c6a5fa64151a2a2d5451091c20e00555d36d6b34d9ff44871ab8da5db51364736f6c634300081e0033";
const isSuperArgs$g = (xs) => xs.length > 1;
class Address__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$g(args)) {
      super(...args);
    } else {
      super(_abi$s, _bytecode$g, args[0]);
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
  static abi = _abi$s;
  static createInterface() {
    return new Interface(_abi$s);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$s, runner);
  }
}

var index$J = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Address__factory: Address__factory
});

const _abi$r = [
  {
    inputs: [],
    name: "FailedCall",
    type: "error"
  },
  {
    inputs: [],
    name: "FailedDeployment",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "MissingPrecompile",
    type: "error"
  }
];
const _bytecode$f = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212203f1730160c464cafc9716409e66f29875e3e25549b944ddcbfea24c060a9b09764736f6c634300081e0033";
const isSuperArgs$f = (xs) => xs.length > 1;
class Errors__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$f(args)) {
      super(...args);
    } else {
      super(_abi$r, _bytecode$f, args[0]);
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
  static abi = _abi$r;
  static createInterface() {
    return new Interface(_abi$r);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$r, runner);
  }
}

var index$I = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Errors__factory: Errors__factory
});

const _abi$q = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "currentNonce",
        type: "uint256"
      }
    ],
    name: "InvalidAccountNonce",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
class Nonces__factory {
  static abi = _abi$q;
  static createInterface() {
    return new Interface(_abi$q);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$q, runner);
  }
}

var index$H = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Nonces__factory: Nonces__factory
});

const _abi$p = [
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "StringTooLong",
    type: "error"
  }
];
const _bytecode$e = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220e600e95020cdbe2161d64ea302f32dfb8c453fbdbce67122840571c1e38851d164736f6c634300081e0033";
const isSuperArgs$e = (xs) => xs.length > 1;
class ShortStrings__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$e(args)) {
      super(...args);
    } else {
      super(_abi$p, _bytecode$e, args[0]);
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
  static abi = _abi$p;
  static createInterface() {
    return new Interface(_abi$p);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$p, runner);
  }
}

var index$G = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ShortStrings__factory: ShortStrings__factory
});

const _abi$o = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "StringsInsufficientHexLength",
    type: "error"
  },
  {
    inputs: [],
    name: "StringsInvalidAddressFormat",
    type: "error"
  },
  {
    inputs: [],
    name: "StringsInvalidChar",
    type: "error"
  }
];
const _bytecode$d = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212203e05daeb73b1f41e380c74bdaa2c6977bd59e1d3781dce07dd5073cceefd4b0f64736f6c634300081e0033";
const isSuperArgs$d = (xs) => xs.length > 1;
class Strings__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$d(args)) {
      super(...args);
    } else {
      super(_abi$o, _bytecode$d, args[0]);
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
  static abi = _abi$o;
  static createInterface() {
    return new Interface(_abi$o);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$o, runner);
  }
}

var index$F = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Strings__factory: Strings__factory
});

const _abi$n = [
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error"
  }
];
const _bytecode$c = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122019a430171fc1cbff737aabbb52a1f928ff3655fd6086507138ee4296a5eb221b64736f6c634300081e0033";
const isSuperArgs$c = (xs) => xs.length > 1;
class ECDSA__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$c(args)) {
      super(...args);
    } else {
      super(_abi$n, _bytecode$c, args[0]);
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
  static abi = _abi$n;
  static createInterface() {
    return new Interface(_abi$n);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$n, runner);
  }
}

var index$E = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ECDSA__factory: ECDSA__factory
});

const _abi$m = [
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "StringTooLong",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
class EIP712__factory {
  static abi = _abi$m;
  static createInterface() {
    return new Interface(_abi$m);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$m, runner);
  }
}

var index$D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  EIP712__factory: EIP712__factory
});

var index$C = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ecdsaSol: index$E,
  eip712Sol: index$D
});

const _abi$l = [
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
class IERC165__factory {
  static abi = _abi$l;
  static createInterface() {
    return new Interface(_abi$l);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$l, runner);
  }
}

var index$B = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC165__factory: IERC165__factory
});

var index$A = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ierc165Sol: index$B
});

const _abi$k = [
  {
    inputs: [
      {
        internalType: "uint8",
        name: "bits",
        type: "uint8"
      },
      {
        internalType: "int256",
        name: "value",
        type: "int256"
      }
    ],
    name: "SafeCastOverflowedIntDowncast",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "value",
        type: "int256"
      }
    ],
    name: "SafeCastOverflowedIntToUint",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "bits",
        type: "uint8"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "SafeCastOverflowedUintDowncast",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "SafeCastOverflowedUintToInt",
    type: "error"
  }
];
const _bytecode$b = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212209976569c352b1356c6bcbc93628e1e523615ea7551366e1c80b29a024a0bb3bc64736f6c634300081e0033";
const isSuperArgs$b = (xs) => xs.length > 1;
class SafeCast__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$b(args)) {
      super(...args);
    } else {
      super(_abi$k, _bytecode$b, args[0]);
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
  static bytecode = _bytecode$b;
  static abi = _abi$k;
  static createInterface() {
    return new Interface(_abi$k);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$k, runner);
  }
}

var index$z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SafeCast__factory: SafeCast__factory
});

var index$y = /*#__PURE__*/Object.freeze({
  __proto__: null,
  safeCastSol: index$z
});

var index$x = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addressSol: index$J,
  cryptography: index$C,
  errorsSol: index$I,
  introspection: index$A,
  math: index$y,
  noncesSol: index$H,
  shortStringsSol: index$G,
  stringsSol: index$F
});

var index$w = /*#__PURE__*/Object.freeze({
  __proto__: null,
  access: index$14,
  interfaces: index$$,
  proxy: index$V,
  token: index$K,
  utils: index$x
});

const _abi$j = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class OwnableUpgradeable__factory {
  static abi = _abi$j;
  static createInterface() {
    return new Interface(_abi$j);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$j, runner);
  }
}

var index$v = /*#__PURE__*/Object.freeze({
  __proto__: null,
  OwnableUpgradeable__factory: OwnableUpgradeable__factory
});

var index$u = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ownableUpgradeableSol: index$v
});

const _abi$i = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  }
];
class Initializable__factory {
  static abi = _abi$i;
  static createInterface() {
    return new Interface(_abi$i);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$i, runner);
  }
}

var index$t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Initializable__factory: Initializable__factory
});

var index$s = /*#__PURE__*/Object.freeze({
  __proto__: null,
  initializableSol: index$t
});

var index$r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  utils: index$s
});

const _abi$h = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  }
];
class ContextUpgradeable__factory {
  static abi = _abi$h;
  static createInterface() {
    return new Interface(_abi$h);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$h, runner);
  }
}

var index$q = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ContextUpgradeable__factory: ContextUpgradeable__factory
});

const _abi$g = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  }
];
class ReentrancyGuardUpgradeable__factory {
  static abi = _abi$g;
  static createInterface() {
    return new Interface(_abi$g);
  }
  static connect(address, runner) {
    return new Contract(
      address,
      _abi$g,
      runner
    );
  }
}

var index$p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ReentrancyGuardUpgradeable__factory: ReentrancyGuardUpgradeable__factory
});

var index$o = /*#__PURE__*/Object.freeze({
  __proto__: null,
  contextUpgradeableSol: index$q,
  reentrancyGuardUpgradeableSol: index$p
});

var index$n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  access: index$u,
  proxy: index$r,
  utils: index$o
});

var index$m = /*#__PURE__*/Object.freeze({
  __proto__: null,
  contracts: index$w,
  contractsUpgradeable: index$n
});

const _abi$f = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      }
    ],
    name: "SafeERC20FailedOperation",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newSettler",
        type: "address"
      }
    ],
    name: "AddSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "goldToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "goldTokenDecimals",
        type: "uint8"
      },
      {
        indexed: false,
        internalType: "address",
        name: "USDT",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "USDTDecimals",
        type: "uint8"
      },
      {
        indexed: false,
        internalType: "address",
        name: "USDC",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "USDCDecimals",
        type: "uint8"
      },
      {
        indexed: false,
        internalType: "address",
        name: "goldPriceFeed",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "goldReserveFeed",
        type: "address"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldSettler",
        type: "address"
      }
    ],
    name: "RemoveSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "usdToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "goldAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minUsdAmount",
        type: "uint256"
      }
    ],
    name: "RequestBurn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "usdToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minGoldAmount",
        type: "uint256"
      }
    ],
    name: "RequestMint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool"
      }
    ],
    name: "SettleBurn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "goldAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "success",
        type: "bool"
      }
    ],
    name: "SettleMint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "settle",
        type: "bool"
      }
    ],
    name: "UpdateAutoSettle",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "newFees",
        type: "uint16"
      }
    ],
    name: "UpdateFees",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "enum GoldMinter.Levels",
        name: "level",
        type: "uint8"
      }
    ],
    name: "UpdateLevel",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "minGoldAmount",
        type: "uint256"
      }
    ],
    name: "UpdateMinGold",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "minGoldFee",
        type: "uint256"
      }
    ],
    name: "UpdateMinGoldFee",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "minGoldFeeAmount",
        type: "uint256"
      }
    ],
    name: "UpdateMinGoldFeeAmount",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newRecipient",
        type: "address"
      }
    ],
    name: "UpdateRecipient",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint16",
        name: "newSlippage",
        type: "uint16"
      }
    ],
    name: "UpdateSlippage",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum GoldMinter.Levels",
        name: "level",
        type: "uint8"
      }
    ],
    name: "UpdateTradingLevel",
    type: "event"
  },
  {
    inputs: [],
    name: "USDC",
    outputs: [
      {
        internalType: "contract IERC20Exp",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "USDT",
    outputs: [
      {
        internalType: "contract IERC20Exp",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "addSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "autoSettle",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "burnOrders",
    outputs: [
      {
        internalType: "address",
        name: "seller",
        type: "address"
      },
      {
        internalType: "contract IERC20Exp",
        name: "usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "goldAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "minUsdAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "success",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isSettled",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_goldAmount",
        type: "uint256"
      }
    ],
    name: "calculateGoldFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Exp",
        name: "usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256"
      }
    ],
    name: "canBurn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "goldAmount",
        type: "uint256"
      }
    ],
    name: "canMint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "fees",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256"
      }
    ],
    name: "getGoldAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "goldAmount",
        type: "uint256"
      }
    ],
    name: "getUsdAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "goldPriceFeed",
    outputs: [
      {
        internalType: "contract IPriceFeed",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "goldReserveFeed",
    outputs: [
      {
        internalType: "contract IPriceFeed",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "goldToken",
    outputs: [
      {
        internalType: "contract IERC20Mintable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initOwner",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_goldToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "_USDT",
        type: "address"
      },
      {
        internalType: "address",
        name: "_USDC",
        type: "address"
      },
      {
        internalType: "address",
        name: "_goldPriceFeed",
        type: "address"
      },
      {
        internalType: "address",
        name: "_goldReserveFeed",
        type: "address"
      },
      {
        internalType: "address",
        name: "_usdRecipient",
        type: "address"
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "bool",
        name: "_autoSettle",
        type: "bool"
      }
    ],
    name: "initializeGoldMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "levels",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "minGoldAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "minGoldFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "minGoldFeeAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "mintOrders",
    outputs: [
      {
        internalType: "address",
        name: "buyer",
        type: "address"
      },
      {
        internalType: "contract IERC20Exp",
        name: "usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "minGoldAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "goldAmount",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "success",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "isSettled",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "removeSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_goldAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_minUsdAmount",
        type: "uint256"
      }
    ],
    name: "requestBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_goldAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_minUsdAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_sigDeadline",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes"
      }
    ],
    name: "requestBurnPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_usdAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_minGoldAmount",
        type: "uint256"
      }
    ],
    name: "requestMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_usdToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "_usdAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_minGoldAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_sigDeadline",
        type: "uint256"
      },
      {
        internalType: "bytes",
        name: "_signature",
        type: "bytes"
      }
    ],
    name: "requestMintPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "enum GoldMinter.Levels",
        name: "level",
        type: "uint8"
      }
    ],
    name: "setLevel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "burnNonce",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "usdAmount",
        type: "uint256"
      }
    ],
    name: "settleBurn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "mintNonce",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "goldAmount",
        type: "uint256"
      }
    ],
    name: "settleMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "settlers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "slippage",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "tradeLevel",
    outputs: [
      {
        internalType: "enum GoldMinter.Levels",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "updateAutoSettle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_fees",
        type: "uint8"
      }
    ],
    name: "updateFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minGold",
        type: "uint256"
      }
    ],
    name: "updateMinGold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minGoldFee",
        type: "uint256"
      }
    ],
    name: "updateMinGoldFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minGoldFeeAmount",
        type: "uint256"
      }
    ],
    name: "updateMinGoldFeeAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_usdRecipient",
        type: "address"
      }
    ],
    name: "updateRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_slippage",
        type: "uint8"
      }
    ],
    name: "updateSlippage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "enum GoldMinter.Levels",
        name: "level",
        type: "uint8"
      }
    ],
    name: "updateTradingLevel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "usdRecipient",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
const _bytecode$a = "0x6080604052600a805464ffffffffff1916633201f40017905566470de4df820000600b55662386f26fc10000600c55670de0b6b3a7640000600d55600e805460ff19166001179055348015605257600080fd5b50613651806100626000396000f3fe608060405234801561001057600080fd5b50600436106102735760003560e01c806389a3027111610151578063c54e44eb116100c3578063dae2f99a11610087578063dae2f99a146105fd578063e44a316914610606578063f2fde38b14610619578063f4b891571461062c578063fc93d5171461063f578063feec756c1461065257600080fd5b8063c54e44eb1461055a578063c5d1bbc21461056d578063ca852afb146105c4578063cbb6ae3e146105d7578063d25f3d3c146105ea57600080fd5b80639eff0227116101155780639eff0227146104eb578063ad89bbb014610503578063b1da41fe1461050c578063bbde387514610521578063c422f9d014610534578063c4d66de81461054757600080fd5b806389a302711461046d5780638da5cb5b1461048057806394002b57146104b0578063986d7a69146104c35780639af1d35a146104d657600080fd5b806347082db3116101ea5780635dd871a3116101ae5780635dd871a3146103ee57806361b0402d146104015780636bffc96214610414578063715018a61461042757806374064a431461042f578063778048a01461045a57600080fd5b806347082db314610366578063491e68e21461039b578063493f4f12146103b55780634b69c0d5146103c85780634f863ea1146103db57600080fd5b80631f6a02671161023c5780631f6a0267146102ec57806333138a8414610309578063356d2c66146103125780633e032a3b1461031a578063404588d4146103405780634645b6dc1461035357600080fd5b8062b105e61461027857806308e7a41e1461028d57806314d3940d146102a057806316222b19146102b3578063186cf2b9146102c6575b600080fd5b61028b610286366004612fe2565b610665565b005b61028b61029b366004613015565b610707565b61028b6102ae366004612fe2565b61079e565b61028b6102c1366004613015565b610837565b6102d96102d43660046130fe565b610906565b6040519081526020015b60405180910390f35b600e546102f99060ff1681565b60405190151581526020016102e3565b6102d9600b5481565b61028b610946565b600a5461032d90610100900461ffff1681565b60405161ffff90911681526020016102e3565b61028b61034e366004613117565b6109ae565b6102f96103613660046131c5565b610c2d565b610389610374366004612fe2565b60076020526000908152604090205460ff1681565b60405160ff90911681526020016102e3565b600a546103a89060ff1681565b6040516102e39190613207565b61028b6103c33660046130fe565b610cae565b61028b6103d6366004613243565b610ceb565b61028b6103e936600461326d565b610d46565b6102f96103fc3660046130fe565b610ddb565b61028b61040f3660046130fe565b610ffc565b61028b61042236600461328a565b611039565b61028b611070565b600654610442906001600160a01b031681565b6040516001600160a01b0390911681526020016102e3565b61028b61046836600461328a565b611084565b600454610442906001600160a01b031681565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b0316610442565b600254610442906001600160a01b031681565b61028b6104d13660046132ac565b6110b3565b600a5461032d906301000000900461ffff1681565b600e546104429061010090046001600160a01b031681565b6102d9600d5481565b610514611491565b6040516102e391906132e1565b61028b61052f3660046132ac565b6114a2565b600554610442906001600160a01b031681565b61028b610555366004612fe2565b611839565b600354610442906001600160a01b031681565b61058061057b3660046130fe565b611935565b604080516001600160a01b0398891681529790961660208801529486019390935260608501919091526080840152151560a0830152151560c082015260e0016102e3565b61028b6105d23660046130fe565b611994565b6105806105e53660046130fe565b6119d1565b6102d96105f83660046131c5565b6119e1565b6102d9600c5481565b61028b61061436600461332d565b611bf8565b61028b610627366004612fe2565b611c97565b6102d961063a3660046131c5565b611cd5565b61028b61064d36600461326d565b611ed8565b61028b610660366004612fe2565b611f69565b61066d611fc7565b610678600082612022565b6106bb5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b6106c6600082612047565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b60008060006107158461205c565b60025460405163d505accf60e01b815293965091945092506001600160a01b03169063d505accf9061075790339030908c908b908a908a908a90600401613362565b600060405180830381600087803b15801561077157600080fd5b505af1158015610785573d6000803e3d6000fd5b505050506107948888886114a2565b5050505050505050565b6107a6611fc7565b6107b1600082612022565b156107f25760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b60448201526064016106b2565b6107fd6000826120a6565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016106fc565b60008060006108458461205c565b60035492955090935091506000906001600160a01b038a8116911614610876576004546001600160a01b0316610883565b6003546001600160a01b03165b60405163d505accf60e01b81529091506001600160a01b0382169063d505accf906108be90339030908d908c908b908b908b90600401613362565b600060405180830381600087803b1580156108d857600080fd5b505af11580156108ec573d6000803e3d6000fd5b505050506108fb8989896110b3565b505050505050505050565b6000600d5482101561091a575050600c5490565b600a5461271090610936906301000000900461ffff16846133b9565b61094091906133d0565b92915050565b61094e611fc7565b600e5460ff1661095f576001610962565b60005b600e805460ff1916911515918217905560405160ff909116151581527ffab1a2e8d359cc6254f5d7cb67a07c879262e5265e7099012b96ed60aace3bd9906020015b60405180910390a1565b60006109b86120bb565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156109e05750825b905060008267ffffffffffffffff1660011480156109fd5750303b155b905081158015610a0b575080155b15610a295760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610a5357845460ff60401b1916600160401b1785555b610a5c876120e4565b610a646120fe565b8c600260006101000a8154816001600160a01b0302191690836001600160a01b031602179055508b600360006101000a8154816001600160a01b0302191690836001600160a01b031602179055508a600460006101000a8154816001600160a01b0302191690836001600160a01b0316021790555089600560006101000a8154816001600160a01b0302191690836001600160a01b0316021790555088600660006101000a8154816001600160a01b0302191690836001600160a01b031602179055506101f4600a60016101000a81548161ffff021916908361ffff1602179055506032600a60036101000a81548161ffff021916908361ffff16021790555066470de4df820000600b81905550662386f26fc10000600c81905550670de0b6b3a7640000600d8190555085600e60006101000a81548160ff02191690831515021790555087600e60016101000a8154816001600160a01b0302191690836001600160a01b03160217905550610bd861210e565b8315610c1e57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050505050505050565b600e546040516370a0823160e01b81526101009091046001600160a01b03908116600483015260009183918516906370a0823190602401602060405180830381865afa158015610c81573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca591906133f2565b10159392505050565b610cb6611fc7565b600b8190556040518181527f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d647906020016106fc565b610cf3611fc7565b600a805482919060ff19166001836002811115610d1257610d126131f1565b02179055507ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1816040516106fc9190613207565b610d4e611fc7565b6103e88160ff1610610d8d5760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b60448201526064016106b2565b600a805464ffff000000191660ff831663010000008102919091179091556040519081527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc906020016106fc565b600080600260009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610e31573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e5591906133f2565b90506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610eac573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ed0919061340b565b90506000600660009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610f27573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f4b919061340b565b90506000610f598284613428565b610f6490600a613528565b600660009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610fb7573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fdb91906133f2565b610fe591906133b9565b9050610ff18685613537565b111595945050505050565b611004611fc7565b600d8190556040518181527f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545906020016106fc565b611046335b600090612022565b6110625760405162461bcd60e51b81526004016106b29061354a565b61106c82826124c2565b5050565b611078611fc7565b6110826000612833565b565b61108d3361103e565b6110a95760405162461bcd60e51b81526004016106b29061354a565b61106c82826128a4565b6110bb612c67565b60006110c78484611cd5565b600a549091508290612710906110e690610100900461ffff168261356f565b6110f49061ffff16846133b9565b6110fe91906133d0565b11801561113b5750600a546127109061112090610100900461ffff1682613589565b61112e9061ffff16836133b9565b61113891906133d0565b82115b6111755760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b60448201526064016106b2565b600b548210156111b55760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b60448201526064016106b2565b600a5460ff1660028111156111cc576111cc6131f1565b3360009081526007602052604090205460ff16101561121a5760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b60448201526064016106b2565b6003546000906001600160a01b03868116911614611243576004546001600160a01b0316611250565b6003546001600160a01b03165b600e54909150611275906001600160a01b038084169133916101009091041687612c9f565b600880546040805160e081018252338082526001600160a01b03868116602084019081528385018b8152606085018b815260006080870181815260a0880182815260c0890183815260018c018d559b909252965160068a027ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3810180549288166001600160a01b031993841617905594517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee4860180549190971691161790945590517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee5830155517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee682015592517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee7840155517ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee89092018054955115156101000261ff00199315159390931661ffff1990961695909517919091179093555190919082907f69c44c537610b2d184f027357271fee6d9eb25ae2b4ccc21d6e56c7bec184196906114459086908a908a906001600160a01b039390931683526020830191909152604082015260600190565b60405180910390a3600e5460ff168015611463575061146383610ddb565b156114725761147281846128a4565b50505061148c60016000805160206135fc83398151915255565b505050565b606061149d6000612d20565b905090565b6114aa612c67565b60006114b684846119e1565b600a549091508290612710906114d590610100900461ffff168261356f565b6114e39061ffff16846133b9565b6114ed91906133d0565b1015801561152b5750600a546127109061151090610100900461ffff1682613589565b61151e9061ffff16836133b9565b61152891906133d0565b82115b6115655760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b60448201526064016106b2565b600b548310156115a55760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b60448201526064016106b2565b600a5460ff1660028111156115bc576115bc6131f1565b3360009081526007602052604090205460ff16101561160a5760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b60448201526064016106b2565b600254611622906001600160a01b0316333086612c9f565b600980546040805160e081018252338082526001600160a01b03898116602084019081528385018a8152606085018a815260006080870181815260a0880182815260c0890183815260018c018d559b909252965160068a027f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af810180549288166001600160a01b031993841617905594517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b0860180549190971691161790945590517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b1830155517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b282015592517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b3840155517f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b49092018054955115156101000261ff00199315159390931661ffff1990961695909517919091179093555190919082907fafae12d8098a1b101657c8062a2634db5c9682923925dfbbd7bee9fb14dea6dc906117f2908990899089906001600160a01b039390931683526020830191909152604082015260600190565b60405180910390a3600e5460ff16801561181157506118118583610c2d565b156118205761182081836124c2565b505061148c60016000805160206135fc83398151915255565b60006118436120bb565b805490915060ff600160401b820416159067ffffffffffffffff1660008115801561186b5750825b905060008267ffffffffffffffff1660011480156118885750303b155b905081158015611896575080155b156118b45760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156118de57845460ff60401b1916600160401b1785555b6118e7866120e4565b831561192d57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6009818154811061194557600080fd5b60009182526020909120600690910201805460018201546002830154600384015460048501546005909501546001600160a01b0394851696509390921693909260ff8082169161010090041687565b61199c611fc7565b600c8190556040518181527f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f906020016106fc565b6008818154811061194557600080fd5b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611a39573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611a5d91906133f2565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611ab0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611ad4919061340b565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611b2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b51919061340b565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611b93573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bb7919061340b565b905080611bc483856135a3565b611bce9190613428565b611bd990600a613528565b611be385886133b9565b611bed91906133d0565b979650505050505050565b611c013361103e565b611c1d5760405162461bcd60e51b81526004016106b29061354a565b806002811115611c2f57611c2f6131f1565b6001600160a01b03831660008181526007602052604090819020805460ff191660ff949094169390931790925590517facee830aed55effdcd51d2550a784305c145560f19aaa8f7e02c076e4e15e28490611c8b908490613207565b60405180910390a25050565b611c9f611fc7565b6001600160a01b038116611cc957604051631e4fbdf760e01b8152600060048201526024016106b2565b611cd281612833565b50565b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611d2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611d5191906133f2565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611da4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611dc8919061340b565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611e21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611e45919061340b565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611e87573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611eab919061340b565b90508381611eb984866135a3565b611ec39190613428565b611ece90600a613528565b611be390886133b9565b611ee0611fc7565b6103e88160ff1610611f1f5760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b60448201526064016106b2565b600a805462ffff00191660ff83166101008102919091179091556040519081527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f906020016106fc565b611f71611fc7565b600e8054610100600160a81b0319166101006001600160a01b038416908102919091179091556040519081527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de906020016106fc565b33611ff97f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146110825760405163118cdaa760e01b81523360048201526024016106b2565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000612040836001600160a01b038416612d2d565b600080600083516041036120865750505060208101516040820151606083015160001a919061209f565b604051634be6321b60e01b815260040160405180910390fd5b9193909250565b6000612040836001600160a01b038416612e20565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610940565b6001600160a01b0381166120f55750335b6107f281612e6f565b612106612e80565b611082612ea5565b600a5460405161010090910461ffff1681527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f9060200160405180910390a1600a54604051630100000090910461ffff1681527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc9060200160405180910390a17f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d647600b546040516121c191815260200190565b60405180910390a17f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f600c546040516121fc91815260200190565b60405180910390a17f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545600d5460405161223791815260200190565b60405180910390a1600e5460405160ff909116151581527ffab1a2e8d359cc6254f5d7cb67a07c879262e5265e7099012b96ed60aace3bd99060200160405180910390a1600a546040517ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1916122b29160ff90911690613207565b60405180910390a1600e546040516101009091046001600160a01b031681527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de9060200160405180910390a16002546040805163313ce56760e01b815290517f60ca852ff1baba03007bc4713a71dae297c308708cf17c690276b3daed7ab76e926001600160a01b031691829163313ce567916004808201926020929091908290030181865afa15801561236a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061238e919061340b565b6003546040805163313ce56760e01b815290516001600160a01b0390921691829163313ce5679160048083019260209291908290030181865afa1580156123d9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123fd919061340b565b600480546040805163313ce56760e01b815290516001600160a01b0390921692839263313ce5679280830192602092918290030181865afa158015612446573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061246a919061340b565b600554600654604080516001600160a01b03998a16815260ff9889166020820152968916908701529386166060860152918616608085015290931660a083015291831660c0820152911660e0820152610100016109a4565b60095482106125035760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b60448201526064016106b2565b60098281548110612516576125166135bc565b906000526020600020906006020160050160019054906101000a900460ff16156125745760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b60448201526064016106b2565b600060098381548110612589576125896135bc565b60009182526020822060016006909202010154600980546001600160a01b03909216935090859081106125be576125be6135bc565b90600052602060002090600602016002015490506000600985815481106125e7576125e76135bc565b906000526020600020906006020160030154841015801561260d575061260d8385610c2d565b905080612656576126516009868154811061262a5761262a6135bc565b60009182526020909120600690910201546002546001600160a01b03908116911684612ead565b61276e565b836009868154811061266a5761266a6135bc565b906000526020600020906006020160040181905550600061268a83610906565b6002549091506001600160a01b03166342966c686126a883866135d2565b6040518263ffffffff1660e01b81526004016126c691815260200190565b600060405180830381600087803b1580156126e057600080fd5b505af11580156126f4573d6000803e3d6000fd5b5050600e5460025461271b93506001600160a01b0390811692506101009091041683612ead565b61276c600e60019054906101000a90046001600160a01b031660098881548110612747576127476135bc565b60009182526020909120600690910201546001600160a01b0387811692911688612c9f565b505b8060098681548110612782576127826135bc565b906000526020600020906006020160050160006101000a81548160ff0219169083151502179055506001600986815481106127bf576127bf6135bc565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550847f565ba89d889ea15e45400288c17db6816d132602d710eb66d0f3d9557c29481685836040516128249291909182521515602082015260400190565b60405180910390a25050505050565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60085482106128e55760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b60448201526064016106b2565b600882815481106128f8576128f86135bc565b906000526020600020906006020160050160019054906101000a900460ff16156129565760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b60448201526064016106b2565b60006008838154811061296b5761296b6135bc565b9060005260206000209060060201600301548210158015612990575061299082610ddb565b905080612a5357600080600885815481106129ad576129ad6135bc565b906000526020600020906006020160010160009054906101000a90046001600160a01b0316600886815481106129e5576129e56135bc565b90600052602060002090600602016002015491509150612a4c600e60019054906101000a90046001600160a01b031660088781548110612a2757612a276135bc565b60009182526020909120600690910201546001600160a01b0385811692911684612c9f565b5050612ba4565b8160088481548110612a6757612a676135bc565b9060005260206000209060060201600401819055506000612a8783610906565b600254600e546040516340c10f1960e01b81526001600160a01b03610100909204821660048201526024810184905292935016906340c10f1990604401600060405180830381600087803b158015612ade57600080fd5b505af1158015612af2573d6000803e3d6000fd5b5050600254600880546001600160a01b0390921693506340c10f1992509087908110612b2057612b206135bc565b60009182526020909120600690910201546001600160a01b0316612b4484876135d2565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401600060405180830381600087803b158015612b8a57600080fd5b505af1158015612b9e573d6000803e3d6000fd5b50505050505b8060088481548110612bb857612bb86135bc565b906000526020600020906006020160050160006101000a81548160ff021916908315150217905550600160088481548110612bf557612bf56135bc565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550827f7bc692b63ac50deef5b78a403ab84227a3ba4c9400ece341f913ea1b0bcff2a38383604051612c5a9291909182521515602082015260400190565b60405180910390a2505050565b6000805160206135fc833981519152805460011901612c9957604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b6040516001600160a01b038481166024830152838116604483015260648201839052612d069186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050612ede565b50505050565b60016000805160206135fc83398151915255565b6060600061204083612f4f565b60008181526001830160205260408120548015612e16576000612d516001836135d2565b8554909150600090612d65906001906135d2565b9050808214612dca576000866000018281548110612d8557612d856135bc565b9060005260206000200154905080876000018481548110612da857612da86135bc565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612ddb57612ddb6135e5565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610940565b6000915050610940565b6000818152600183016020526040812054612e6757508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610940565b506000610940565b612e77612e80565b611cd281612fab565b612e88612fb3565b61108257604051631afcd79f60e31b815260040160405180910390fd5b612d0c612e80565b6040516001600160a01b0383811660248301526044820183905261148c91859182169063a9059cbb90606401612cd4565b600080602060008451602086016000885af180612f01576040513d6000823e3d81fd5b50506000513d91508115612f19578060011415612f26565b6001600160a01b0384163b155b15612d0657604051635274afe760e01b81526001600160a01b03851660048201526024016106b2565b606081600001805480602002602001604051908101604052809291908181526020018280548015612f9f57602002820191906000526020600020905b815481526020019060010190808311612f8b575b50505050509050919050565b611c9f612e80565b6000612fbd6120bb565b54600160401b900460ff16919050565b6001600160a01b0381168114611cd257600080fd5b600060208284031215612ff457600080fd5b813561204081612fcd565b634e487b7160e01b600052604160045260246000fd5b600080600080600060a0868803121561302d57600080fd5b853561303881612fcd565b9450602086013593506040860135925060608601359150608086013567ffffffffffffffff81111561306957600080fd5b8601601f8101881361307a57600080fd5b803567ffffffffffffffff81111561309457613094612fff565b604051601f8201601f19908116603f0116810167ffffffffffffffff811182821017156130c3576130c3612fff565b6040528181528282016020018a10156130db57600080fd5b816020840160208301376000602083830101528093505050509295509295909350565b60006020828403121561311057600080fd5b5035919050565b600080600080600080600080610100898b03121561313457600080fd5b883561313f81612fcd565b9750602089013561314f81612fcd565b9650604089013561315f81612fcd565b9550606089013561316f81612fcd565b9450608089013561317f81612fcd565b935060a089013561318f81612fcd565b925060c089013561319f81612fcd565b915060e089013580151581146131b457600080fd5b809150509295985092959890939650565b600080604083850312156131d857600080fd5b82356131e381612fcd565b946020939093013593505050565b634e487b7160e01b600052602160045260246000fd5b602081016003831061322957634e487b7160e01b600052602160045260246000fd5b91905290565b80356003811061323e57600080fd5b919050565b60006020828403121561325557600080fd5b6120408261322f565b60ff81168114611cd257600080fd5b60006020828403121561327f57600080fd5b81356120408161325e565b6000806040838503121561329d57600080fd5b50508035926020909101359150565b6000806000606084860312156132c157600080fd5b83356132cc81612fcd565b95602085013595506040909401359392505050565b602080825282518282018190526000918401906040840190835b818110156133225783516001600160a01b03168352602093840193909201916001016132fb565b509095945050505050565b6000806040838503121561334057600080fd5b823561334b81612fcd565b91506133596020840161322f565b90509250929050565b6001600160a01b0397881681529590961660208601526040850193909352606084019190915260ff16608083015260a082015260c081019190915260e00190565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610940576109406133a3565b6000826133ed57634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561340457600080fd5b5051919050565b60006020828403121561341d57600080fd5b81516120408161325e565b60ff8281168282160390811115610940576109406133a3565b6001815b600184111561347c57808504811115613460576134606133a3565b600184161561346e57908102905b60019390931c928002613445565b935093915050565b60008261349357506001610940565b816134a057506000610940565b81600181146134b657600281146134c0576134dc565b6001915050610940565b60ff8411156134d1576134d16133a3565b50506001821b610940565b5060208310610133831016604e8410600b84101617156134ff575081810a610940565b61350c6000198484613441565b8060001904821115613520576135206133a3565b029392505050565b600061204060ff841683613484565b80820180821115610940576109406133a3565b6020808252600b908201526a2727aa2fa9a2aa2a2622a960a91b604082015260600190565b61ffff8181168382160190811115610940576109406133a3565b61ffff8281168282160390811115610940576109406133a3565b60ff8181168382160190811115610940576109406133a3565b634e487b7160e01b600052603260045260246000fd5b81810381811115610940576109406133a3565b634e487b7160e01b600052603160045260246000fdfe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a26469706673582212208768c5b505d9b73af1a4809b55b5d8de299146407d1f624f017bad1fab28606464736f6c634300081e0033";
const isSuperArgs$a = (xs) => xs.length > 1;
class GoldMinter__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$a(args)) {
      super(...args);
    } else {
      super(_abi$f, _bytecode$a, args[0]);
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
  static abi = _abi$f;
  static createInterface() {
    return new Interface(_abi$f);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$f, runner);
  }
}

var index$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GoldMinter__factory: GoldMinter__factory
});

const _abi$e = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_unlockTime",
        type: "uint256"
      }
    ],
    stateMutability: "payable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "when",
        type: "uint256"
      }
    ],
    name: "Withdrawal",
    type: "event"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "unlockTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
const _bytecode$9 = "0x60806040526040516102a03803806102a08339810160408190526020916097565b804210607e5760405162461bcd60e51b815260206004820152602360248201527f556e6c6f636b2074696d652073686f756c6420626520696e207468652066757460448201526275726560e81b606482015260840160405180910390fd5b600055600180546001600160a01b0319163317905560af565b60006020828403121560a857600080fd5b5051919050565b6101e2806100be6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063251c1aa3146100465780633ccfd60b146100625780638da5cb5b1461006c575b600080fd5b61004f60005481565b6040519081526020015b60405180910390f35b61006a610097565b005b60015461007f906001600160a01b031681565b6040516001600160a01b039091168152602001610059565b6000544210156100e75760405162461bcd60e51b8152602060048201526016602482015275165bdd4818d85b89dd081dda5d1a191c985dc81e595d60521b60448201526064015b60405180910390fd5b6001546001600160a01b031633146101385760405162461bcd60e51b81526020600482015260146024820152732cb7ba9030b932b713ba103a34329037bbb732b960611b60448201526064016100de565b604080514781524260208201527fbf2ed60bd5b5965d685680c01195c9514e4382e28e3a5a2d2d5244bf59411b93910160405180910390a16001546040516001600160a01b03909116904780156108fc02916000818181858888f193505050501580156101a9573d6000803e3d6000fd5b5056fea2646970667358221220326a7d93def3c33f45778d35a66767b56981dd59398e9f4b243849bf3ac48a1c64736f6c634300081e0033";
const isSuperArgs$9 = (xs) => xs.length > 1;
class Lock__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$9(args)) {
      super(...args);
    } else {
      super(_abi$e, _bytecode$9, args[0]);
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
  static bytecode = _bytecode$9;
  static abi = _abi$e;
  static createInterface() {
    return new Interface(_abi$e);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$e, runner);
  }
}

var index$k = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Lock__factory: Lock__factory
});

const _abi$d = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IERC20Exp__factory {
  static abi = _abi$d;
  static createInterface() {
    return new Interface(_abi$d);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$d, runner);
  }
}

const _abi$c = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
];
class IERC20Mintable__factory {
  static abi = _abi$c;
  static createInterface() {
    return new Interface(_abi$c);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$c, runner);
  }
}

var index$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IERC20Exp__factory: IERC20Exp__factory,
  IERC20Mintable__factory: IERC20Mintable__factory
});

const _abi$b = [
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address"
      }
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address"
      },
      {
        internalType: "address",
        name: "newImplementation",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "initializeProxy",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  }
];
class IInitializableProxy__factory {
  static abi = _abi$b;
  static createInterface() {
    return new Interface(_abi$b);
  }
  static connect(address, runner) {
    return new Contract(
      address,
      _abi$b,
      runner
    );
  }
}

var index$i = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IInitializableProxy__factory: IInitializableProxy__factory
});

const _abi$a = [
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "getTokenType",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "latestAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
class IPriceFeed__factory {
  static abi = _abi$a;
  static createInterface() {
    return new Interface(_abi$a);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$a, runner);
  }
}

var index$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  IPriceFeed__factory: IPriceFeed__factory
});

var index$g = /*#__PURE__*/Object.freeze({
  __proto__: null,
  iInitializableProxySol: index$i,
  iPriceFeedSol: index$h,
  ierc20Sol: index$j
});

const _abi$9 = [
  {
    inputs: [],
    name: "InvalidSignatureLength",
    type: "error"
  }
];
const _bytecode$8 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220a15d9e5bcb1d90686da42764b418a075b9bd43093c44bcbf4c8ff6d3f475fdf564736f6c634300081e0033";
const isSuperArgs$8 = (xs) => xs.length > 1;
class SigLib__factory extends ContractFactory {
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

var index$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SigLib__factory: SigLib__factory
});

const _abi$8 = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newSettler",
        type: "address"
      }
    ],
    name: "AddSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldSettler",
        type: "address"
      }
    ],
    name: "RemoveSettler",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "addSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initOwner",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "removeSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "settlers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
const _bytecode$7 = "0x6080604052348015600f57600080fd5b506108278061001f6000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c80638da5cb5b1161005b5780638da5cb5b146100b1578063b1da41fe146100f0578063c4d66de814610105578063f2fde38b1461011857600080fd5b8062b105e61461008157806314d3940d14610096578063715018a6146100a9575b600080fd5b61009461008f36600461072f565b61012b565b005b6100946100a436600461072f565b6101cd565b610094610266565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b0390911681526020015b60405180910390f35b6100f861027a565b6040516100e79190610758565b61009461011336600461072f565b61028b565b61009461012636600461072f565b610387565b6101336103c5565b61013e600082610420565b6101815760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61018c600082610447565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6101d56103c5565b6101e0600082610420565b156102215760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610178565b61022c60008261045c565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016101c2565b61026e6103c5565b6102786000610471565b565b606061028660006104e2565b905090565b60006102956104f6565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156102bd5750825b905060008267ffffffffffffffff1660011480156102da5750303b155b9050811580156102e8575080155b156103065760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561033057845460ff60401b1916600160401b1785555b6103398661051f565b831561037f57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b61038f6103c5565b6001600160a01b0381166103b957604051631e4fbdf760e01b815260006004820152602401610178565b6103c281610471565b50565b336103f77f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146102785760405163118cdaa760e01b8152336004820152602401610178565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b600061043e836001600160a01b038416610539565b600061043e836001600160a01b03841661062c565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b606060006104ef8361067b565b9392505050565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610441565b6001600160a01b0381166105305750335b610221816106d7565b6000818152600183016020526040812054801561062257600061055d6001836107a4565b8554909150600090610571906001906107a4565b90508082146105d6576000866000018281548110610591576105916107c5565b90600052602060002001549050808760000184815481106105b4576105b46107c5565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806105e7576105e76107db565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610441565b6000915050610441565b600081815260018301602052604081205461067357508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610441565b506000610441565b6060816000018054806020026020016040519081016040528092919081815260200182805480156106cb57602002820191906000526020600020905b8154815260200190600101908083116106b7575b50505050509050919050565b6106df6106e8565b6103c28161070d565b6106f0610715565b61027857604051631afcd79f60e31b815260040160405180910390fd5b61038f6106e8565b600061071f6104f6565b54600160401b900460ff16919050565b60006020828403121561074157600080fd5b81356001600160a01b03811681146104ef57600080fd5b602080825282518282018190526000918401906040840190835b818110156107995783516001600160a01b0316835260209384019390920191600101610772565b509095945050505050565b8181038181111561044157634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea26469706673582212205f309185e14adea1c93cc618c6d00bec7b356098515db49df16d9453f50a843064736f6c634300081e0033";
const isSuperArgs$7 = (xs) => xs.length > 1;
class WithSettler__factory extends ContractFactory {
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

var index$e = /*#__PURE__*/Object.freeze({
  __proto__: null,
  WithSettler__factory: WithSettler__factory
});

var index$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  sigLibSol: index$f,
  withSettlerSol: index$e
});

const _abi$7 = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [],
    name: "OnlyRouterCanFulfill",
    type: "error"
  },
  {
    inputs: [],
    name: "OnlySimulatedBackend",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      }
    ],
    name: "UnexpectedRequestID",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newSettler",
        type: "address"
      }
    ],
    name: "AddSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "int256",
        name: "current",
        type: "int256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256"
      }
    ],
    name: "AnswerUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address"
      }
    ],
    name: "NewAsset",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string"
      }
    ],
    name: "NewDescription",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "startedBy",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256"
      }
    ],
    name: "NewRound",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldSettler",
        type: "address"
      }
    ],
    name: "RemoveSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "RequestFulfilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "RequestSent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "response",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "err",
        type: "bytes"
      }
    ],
    name: "Response",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "router",
        type: "address"
      }
    ],
    name: "SetConsumer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "upkeepContract",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "upkeepInterval",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "upkeepRateInterval",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "upkeepRateCap",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "maxBaseGasPrice",
        type: "uint64"
      }
    ],
    name: "SetUpkeep",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "addSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "asset",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "deploymentTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "donID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "gasLimit",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "getAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80"
      }
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80"
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256"
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256"
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "getTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "getTimestampAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "getUpkeepTime",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes"
      }
    ],
    name: "handleOracleFulfillment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "i_router",
    outputs: [
      {
        internalType: "contract IFunctionsRouter",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initOwner",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "lastUpkeep",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      },
      {
        internalType: "int256",
        name: "",
        type: "int256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "maxBaseGasPrice",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "removeSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "request",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "s_lastRequestId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "sendRequestCBOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address"
      },
      {
        internalType: "string",
        name: "_description",
        type: "string"
      },
      {
        internalType: "address",
        name: "_router",
        type: "address"
      },
      {
        internalType: "address",
        name: "_upkeepContract",
        type: "address"
      },
      {
        internalType: "uint64",
        name: "_upkeepInterval",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_upkeepRateInterval",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_upkeepRateCap",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_maxBaseGasPrice",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_updateInterval",
        type: "uint64"
      }
    ],
    name: "setAGTFeedInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address"
      }
    ],
    name: "setAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_router",
        type: "address"
      }
    ],
    name: "setConsumer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string"
      }
    ],
    name: "setDescription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address"
      },
      {
        internalType: "string",
        name: "_description",
        type: "string"
      }
    ],
    name: "setFeedInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "_updateInterval",
        type: "uint64"
      }
    ],
    name: "setInterval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_upkeepContract",
        type: "address"
      },
      {
        internalType: "uint64",
        name: "_upkeepInterval",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_upkeepRateInterval",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_upkeepRateCap",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_maxBaseGasPrice",
        type: "uint64"
      }
    ],
    name: "setUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_version",
        type: "uint256"
      }
    ],
    name: "setVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "settlers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "subscriptionId",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "newAnswer",
        type: "int256"
      }
    ],
    name: "updateAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "updateInterval",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_request",
        type: "bytes"
      },
      {
        internalType: "uint64",
        name: "_subscriptionId",
        type: "uint64"
      },
      {
        internalType: "uint32",
        name: "_gasLimit",
        type: "uint32"
      },
      {
        internalType: "bytes32",
        name: "_donID",
        type: "bytes32"
      }
    ],
    name: "updateRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepInterval",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepRateCap",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepRateInterval",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    name: "upkeepRates",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
const _bytecode$6 = "0x60a060405260086080526006600555348015601957600080fd5b50608051612242610035600039600061035801526122426000f3fe608060405234801561001057600080fd5b50600436106102ba5760003560e01c80636e74336b11610182578063b5ab58dc116100e9578063d0d552dd116100a2578063f2fde38b1161007c578063f2fde38b146106ae578063f68016b7146106c1578063fd2c80ae146106ed578063feaf968c1461070057600080fd5b8063d0d552dd14610675578063e037711814610688578063e58864421461069b57600080fd5b8063b5ab58dc146105ec578063b633620c1461060c578063bfc12c051461062c578063c3ba0e2414610635578063c41c7dce1461064f578063c4d66de81461066257600080fd5b80639a24a1801161013b5780639a24a180146105475780639a6fc8f51461055a578063a26fd90d146105a1578063a87a20ce146105bb578063b1da41fe146105ce578063b1e21749146105e357600080fd5b80636e74336b1461050a578063715018a6146105135780637284e4161461051b5780638205bf6a146105235780638da5cb5b1461052c57806390c3f38f1461053457600080fd5b80634585e33b116102265780635dcbdc5a116101df5780635dcbdc5a1461047e5780635e0611f11461049157806363a579d5146104a4578063668a0f02146104b75780636ad6c8ce146104c05780636e04ff0d146104e957600080fd5b80634585e33b1461041957806350d25bcd1461042c57806354fd4d5014610435578063581bdd161461043e57806359770db2146104515780635a74373c1461046457600080fd5b8063313ce56711610278578063313ce56714610353578063338cdca11461038c57806338d52e0f146103a15780633b2235fc146103cc5780633d7c5d3e146103ec578063408def1e1461040657600080fd5b8062b105e6146102bf5780630494878e146102d457806309c1ba2e146103045780630ca761751461031757806314b316781461032a57806314d3940d14610340575b600080fd5b6102d26102cd3660046119a5565b610708565b005b6012546102e7906001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b600e546102e7906001600160401b031681565b6102d2610325366004611a6a565b6107aa565b610332610810565b6040519081526020016102fb565b6102d261034e3660046119a5565b610940565b61037a7f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff90911681526020016102fb565b6103946109d9565b6040516102fb9190611b20565b6003546103b4906001600160a01b031681565b6040516001600160a01b0390911681526020016102fb565b6103326103da366004611b33565b600c6020526000908152604090205481565b6012546102e790600160801b90046001600160401b031681565b6102d2610414366004611b33565b610a67565b6102d2610427366004611b4c565b610a74565b61033260075481565b61033260055481565b6000546103b4906001600160a01b031681565b6102d261045f366004611bd5565b610ac0565b6011546102e790600160a01b90046001600160401b031681565b6102e761048c366004611b33565b610aeb565b6011546103b4906001600160a01b031681565b6102d26104b23660046119a5565b610b14565b61033260095481565b6102e76104ce366004611bd5565b6013602052600090815260409020546001600160401b031681565b6104fc6104f7366004611b4c565b610b64565b6040516102fb929190611bf0565b610332600f5481565b6102d2610b8a565b610394610b9e565b61033260085481565b6103b4610bab565b6102d2610542366004611c13565b610bd9565b6102d2610555366004611c47565b610c1d565b61056d610568366004611c94565b610c56565b604080516001600160501b03968716815260208101959095528401929092526060830152909116608082015260a0016102fb565b6012546102e790600160c01b90046001600160401b031681565b6102d26105c9366004611b33565b610cd4565b6105d6610d35565b6040516102fb9190611cbd565b61033260105481565b6103326105fa366004611b33565b600a6020526000908152604090205481565b61033261061a366004611b33565b600b6020526000908152604090205481565b61033260065481565b6012546102e790600160401b90046001600160401b031681565b6102d261065d366004611d09565b610d46565b6102d26106703660046119a5565b610d9a565b6102d26106833660046119a5565b610e94565b6102d2610696366004611d79565b610ee6565b6102d26106a9366004611e3b565b610f22565b6102d26106bc3660046119a5565b610ff1565b600e546106d890600160401b900463ffffffff1681565b60405163ffffffff90911681526020016102fb565b6014546102e7906001600160401b031681565b61056d61102c565b610710611050565b61071b600182611082565b61075e5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b6107696001826110a7565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6000546001600160a01b031633146107d55760405163c6829f8360e01b815260040160405180910390fd5b6107e08383836110bc565b60405183907f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e690600090a2505050565b600061081a610bab565b6001600160a01b0316336001600160a01b0316148061084357506011546001600160a01b031633145b6108825760405162461bcd60e51b815260206004820152601060248201526f2737ba20b63637bbb2b221b0b63632b960811b6044820152606401610755565b610936600d805461089290611ea0565b80601f01602080910402602001604051908101604052809291908181526020018280546108be90611ea0565b801561090b5780601f106108e05761010080835404028352916020019161090b565b820191906000526020600020905b8154815290600101906020018083116108ee57829003601f168201915b5050600e54600f546001600160401b0382169450600160401b90910463ffffffff169250905061119d565b6010819055905090565b610948611050565b610953600182611082565b156109945760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610755565b61099f600182611251565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e9060200161079f565b600d80546109e690611ea0565b80601f0160208091040260200160405190810160405280929190818152602001828054610a1290611ea0565b8015610a5f5780601f10610a3457610100808354040283529160200191610a5f565b820191906000526020600020905b815481529060010190602001808311610a4257829003601f168201915b505050505081565b610a6f611050565b600555565b610a7c611266565b15610abc576012805467ffffffffffffffff60801b1916600160801b426001600160401b031602179055600d8054610ab8919061089290611ea0565b6010555b5050565b610ac8611050565b6014805467ffffffffffffffff19166001600160401b0392909216919091179055565b6012546000906001600160401b0316610b048184611f06565b610b0e9190611f34565b92915050565b610b1c611050565b600080546001600160a01b0319166001600160a01b038316908117825560405190917fcd35971ad691b112415e0fd43feb761712ca91c32838df7450c9dc1ef532784691a250565b60006060610b70611266565b604080516000815260208101909152909590945092505050565b610b92611050565b610b9c60006112a6565b565b600480546109e690611ea0565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b610be1611050565b6004610bed8282611fa5565b507f16fbb51445345dabaa215e5f99a4bd4d8ba9818b508c76d5cd0ea30abcc491c68160405161079f9190611b20565b610c25611050565b600654600003610c3457426006555b600554600003610c445760066005555b610c4d82610e94565b610abc81610bd9565b6001600160501b0381166000818152600a6020526040812054839290919081908190610c8457600654610cac565b600b6000610c9c60016001600160501b038a16612063565b8152602001908152602001600020545b6001600160501b0387166000908152600b602052604090205495979496909594909350915050565b610cdf600133611082565b610d195760405162461bcd60e51b815260206004820152600b60248201526a2727aa2fa9a2aa2a2622a960a91b6044820152606401610755565b610d32816009546001610d2c9190612076565b42611317565b50565b6060610d4160016113e3565b905090565b610d4e611050565b600d610d5a8582611fa5565b50600e805463ffffffff909316600160401b026bffffffffffffffffffffffff199093166001600160401b039094169390931791909117909155600f5550565b6000610da46113f0565b805490915060ff600160401b82041615906001600160401b0316600081158015610dcb5750825b90506000826001600160401b03166001148015610de75750303b155b905081158015610df5575080155b15610e135760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610e3d57845460ff60401b1916600160401b1785555b610e4686611419565b8315610e8c57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b610e9c611050565b600380546001600160a01b0319166001600160a01b0383169081179091556040517fc7d9598af6004de7fa9c489a50a55414c75cfbce9fe56fe46956970744d6bc2c90600090a250565b610eee611050565b610ef88989610c1d565b610f0187610b14565b610f0e8686868686610f22565b610f1781610ac0565b505050505050505050565b610f2a611050565b601180546001600160a01b0387166001600160e01b03199091168117600160a01b6001600160401b0388811691820292909217909355601280548783166fffffffffffffffffffffffffffffffff199091168117600160401b888516908102919091176001600160c01b0316600160c01b948816948502179092556040805195865260208601919091528401526060830152907fbed5a7c7626f62707ea8a0c71900fd8623e8ae9fde3cd99cfa5dc7d54bbabee09060800160405180910390a25050505050565b610ff9611050565b6001600160a01b03811661102357604051631e4fbdf760e01b815260006004820152602401610755565b610d32816112a6565b600080600080600061103f600954610c56565b945094509450945094509091929394565b33611059610bab565b6001600160a01b031614610b9c5760405163118cdaa760e01b8152336004820152602401610755565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b60006110a0836001600160a01b038416611433565b601360006110c942610aeb565b6001600160401b03908116825260208201929092526040016000908120805490921691906110f683612089565b91906101000a8154816001600160401b0302191690836001600160401b031602179055505082601054146111405760405163d068bf5b60e01b815260048101849052602401610755565b6001825111801561115057508051155b1561115e5761115e8261152d565b827f7873807bf6ddc50401cd3d29bbe0decee23fd4d68d273f4b5eb83cded4d2f17283836040516111909291906120b4565b60405180910390a2505050565b6000805460405163230e93b160e11b815282916001600160a01b03169063461d2762906111d79088908a906001908a908a906004016120e2565b6020604051808303816000875af11580156111f6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061121a919061212b565b60405190915081907f1131472297a800fee664d1d89cfa8f7676ff07189ecc53f80bbb5f4969099db890600090a295945050505050565b60006110a0836001600160a01b038416611621565b6000611270611670565b61127a5750600090565b601454600854611293916001600160401b031690612076565b4210156112a05750600090565b50600190565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b806008541061132557505050565b6007839055600881905560098290556000828152600b602090815260408083208054600a845282852088905590859055848452600c9092529091208490551515806113a257604051828152339084907f0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac602719060200160405180910390a35b82847f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f846040516113d591815260200190565b60405180910390a350505050565b606060006110a083611729565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610b0e565b6001600160a01b03811661142a5750335b61099481611785565b6000818152600183016020526040812054801561151c576000611457600183612063565b855490915060009061146b90600190612063565b90508082146114d057600086600001828154811061148b5761148b612144565b90600052602060002001549050808760000184815481106114ae576114ae612144565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806114e1576114e161215a565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610b0e565b6000915050610b0e565b5092915050565b600061153882611796565b905060006002825161154a9190612170565b905060005b8181101561161b57600083611565836002612184565b8151811061157557611575612144565b6020026020010151905060008483600261158f9190612184565b61159a906001612076565b815181106115aa576115aa612144565b602002602001015190506000826001600160401b0316905080600c6000846001600160401b0316815260200190815260200160002054036115ed57505050611613565b61160f8160095460016116009190612076565b846001600160401b0316611317565b5050505b60010161154f565b50505050565b600081815260018301602052604081205461166857508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610b0e565b506000610b0e565b6012546000906001600160401b03600160c01b90910481164890911611156116985750600090565b6011546012546116c2916001600160401b03600160a01b909104811691600160801b90041661219b565b6001600160401b0316426001600160401b031610156116e15750600090565b601254600160401b90046001600160401b03166013600061170142610aeb565b6001600160401b03908116825260208201929092526040016000205416106112a05750600090565b60608160000180548060200260200160405190810160405280929190818152602001828054801561177957602002820191906000526020600020905b815481526020019060010190808311611765575b50505050509050919050565b61178d611942565b610d3281611967565b6060600882516117a691906121ba565b156118075760405162461bcd60e51b815260206004820152602b60248201527f44617461206c656e677468206d75737420626520646976697369626c6520627960448201526a206368756e6b2073697a6560a81b6064820152608401610755565b6000600883516118179190612170565b90506000816001600160401b03811115611833576118336119c0565b60405190808252806020026020018201604052801561185c578160200160208202803683370190505b50905060005b8281101561193a5760408051600880825281830190925260009160208201818036833701905050905060005b60088110156118fa5786816118a4856008612184565b6118ae9190612076565b815181106118be576118be612144565b602001015160f81c60f81b8282815181106118db576118db612144565b60200101906001600160f81b031916908160001a90535060010161188e565b50611904816121ce565b60c01c83838151811061191957611919612144565b6001600160401b039092166020928302919091019091015250600101611862565b509392505050565b61194a61196f565b610b9c57604051631afcd79f60e31b815260040160405180910390fd5b610ff9611942565b60006119796113f0565b54600160401b900460ff16919050565b80356001600160a01b03811681146119a057600080fd5b919050565b6000602082840312156119b757600080fd5b6110a082611989565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126119e757600080fd5b8135602083016000806001600160401b03841115611a0757611a076119c0565b50604051601f19601f85018116603f011681018181106001600160401b0382111715611a3557611a356119c0565b604052838152905080828401871015611a4d57600080fd5b838360208301376000602085830101528094505050505092915050565b600080600060608486031215611a7f57600080fd5b8335925060208401356001600160401b03811115611a9c57600080fd5b611aa8868287016119d6565b92505060408401356001600160401b03811115611ac457600080fd5b611ad0868287016119d6565b9150509250925092565b6000815180845260005b81811015611b0057602081850181015186830182015201611ae4565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006110a06020830184611ada565b600060208284031215611b4557600080fd5b5035919050565b60008060208385031215611b5f57600080fd5b82356001600160401b03811115611b7557600080fd5b8301601f81018513611b8657600080fd5b80356001600160401b03811115611b9c57600080fd5b856020828401011115611bae57600080fd5b6020919091019590945092505050565b80356001600160401b03811681146119a057600080fd5b600060208284031215611be757600080fd5b6110a082611bbe565b8215158152604060208201526000611c0b6040830184611ada565b949350505050565b600060208284031215611c2557600080fd5b81356001600160401b03811115611c3b57600080fd5b611c0b848285016119d6565b60008060408385031215611c5a57600080fd5b611c6383611989565b915060208301356001600160401b03811115611c7e57600080fd5b611c8a858286016119d6565b9150509250929050565b600060208284031215611ca657600080fd5b81356001600160501b03811681146110a057600080fd5b602080825282518282018190526000918401906040840190835b81811015611cfe5783516001600160a01b0316835260209384019390920191600101611cd7565b509095945050505050565b60008060008060808587031215611d1f57600080fd5b84356001600160401b03811115611d3557600080fd5b611d41878288016119d6565b945050611d5060208601611bbe565b9250604085013563ffffffff81168114611d6957600080fd5b9396929550929360600135925050565b60008060008060008060008060006101208a8c031215611d9857600080fd5b611da18a611989565b985060208a01356001600160401b03811115611dbc57600080fd5b611dc88c828d016119d6565b985050611dd760408b01611989565b9650611de560608b01611989565b9550611df360808b01611bbe565b9450611e0160a08b01611bbe565b9350611e0f60c08b01611bbe565b9250611e1d60e08b01611bbe565b9150611e2c6101008b01611bbe565b90509295985092959850929598565b600080600080600060a08688031215611e5357600080fd5b611e5c86611989565b9450611e6a60208701611bbe565b9350611e7860408701611bbe565b9250611e8660608701611bbe565b9150611e9460808701611bbe565b90509295509295909350565b600181811c90821680611eb457607f821691505b602082108103611ed457634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006001600160401b03831680611f1f57611f1f611eda565b806001600160401b0384160491505092915050565b6001600160401b03818116838216029081169081811461152657611526611ef0565b601f821115611fa057806000526020600020601f840160051c81016020851015611f7d5750805b601f840160051c820191505b81811015611f9d5760008155600101611f89565b50505b505050565b81516001600160401b03811115611fbe57611fbe6119c0565b611fd281611fcc8454611ea0565b84611f56565b6020601f8211600181146120065760008315611fee5750848201515b600019600385901b1c1916600184901b178455611f9d565b600084815260208120601f198516915b828110156120365787850151825560209485019460019092019101612016565b50848210156120545786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b81810381811115610b0e57610b0e611ef0565b80820180821115610b0e57610b0e611ef0565b60006001600160401b0382166001600160401b0381036120ab576120ab611ef0565b60010192915050565b6040815260006120c76040830185611ada565b82810360208401526120d98185611ada565b95945050505050565b6001600160401b038616815260a06020820152600061210460a0830187611ada565b61ffff9590951660408301525063ffffffff92909216606083015260809091015292915050565b60006020828403121561213d57600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b60008261217f5761217f611eda565b500490565b8082028115828204841417610b0e57610b0e611ef0565b6001600160401b038181168382160190811115610b0e57610b0e611ef0565b6000826121c9576121c9611eda565b500690565b805160208201516001600160c01b0319811691906008821015612205576001600160c01b0319600883900360031b81901b82161692505b505091905056fea26469706673582212205fb5989a47fbb425ee95fac5e2b01c76f9ed7e0abfb1a96ac701a26ec1d6098264736f6c634300081e0033";
const isSuperArgs$6 = (xs) => xs.length > 1;
class AGTReserveFeed__factory extends ContractFactory {
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

var index$c = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AGTReserveFeed__factory: AGTReserveFeed__factory
});

const _abi$6 = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [],
    name: "OnlyRouterCanFulfill",
    type: "error"
  },
  {
    inputs: [],
    name: "OnlySimulatedBackend",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      }
    ],
    name: "UnexpectedRequestID",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newSettler",
        type: "address"
      }
    ],
    name: "AddSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldSettler",
        type: "address"
      }
    ],
    name: "RemoveSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "RequestFulfilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "RequestSent",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "response",
        type: "bytes"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "err",
        type: "bytes"
      }
    ],
    name: "Response",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "router",
        type: "address"
      }
    ],
    name: "SetConsumer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "upkeepContract",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "upkeepInterval",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "upkeepRateInterval",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "upkeepRateCap",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "maxBaseGasPrice",
        type: "uint64"
      }
    ],
    name: "SetUpkeep",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "addSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool"
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "donID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "gasLimit",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256"
      }
    ],
    name: "getUpkeepTime",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes"
      }
    ],
    name: "handleOracleFulfillment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "i_router",
    outputs: [
      {
        internalType: "contract IFunctionsRouter",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initOwner",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "lastUpkeep",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "maxBaseGasPrice",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "removeSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "request",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "s_lastRequestId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "sendRequestCBOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_router",
        type: "address"
      }
    ],
    name: "setConsumer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_upkeepContract",
        type: "address"
      },
      {
        internalType: "uint64",
        name: "_upkeepInterval",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_upkeepRateInterval",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_upkeepRateCap",
        type: "uint64"
      },
      {
        internalType: "uint64",
        name: "_maxBaseGasPrice",
        type: "uint64"
      }
    ],
    name: "setUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "settlers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "subscriptionId",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_request",
        type: "bytes"
      },
      {
        internalType: "uint64",
        name: "_subscriptionId",
        type: "uint64"
      },
      {
        internalType: "uint32",
        name: "_gasLimit",
        type: "uint32"
      },
      {
        internalType: "bytes32",
        name: "_donID",
        type: "bytes32"
      }
    ],
    name: "updateRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepInterval",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepRateCap",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "upkeepRateInterval",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    name: "upkeepRates",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
const _bytecode$5 = "0x6080604052348015600f57600080fd5b506117758061001f6000396000f3fe608060405234801561001057600080fd5b50600436106101c35760003560e01c80636ad6c8ce116100f9578063b1e2174911610097578063c4d66de811610071578063c4d66de8146103e4578063e5886442146103f7578063f2fde38b1461040a578063f68016b71461041d57600080fd5b8063b1e21749146103ae578063c3ba0e24146103b7578063c41c7dce146103d157600080fd5b8063715018a6116100d3578063715018a61461036f5780638da5cb5b14610377578063a26fd90d1461037f578063b1da41fe1461039957600080fd5b80636ad6c8ce1461031c5780636e04ff0d146103455780636e74336b1461036657600080fd5b80633d7c5d3e116101665780635a74373c116101405780635a74373c146102c95780635dcbdc5a146102e35780635e0611f1146102f657806363a579d51461030957600080fd5b80633d7c5d3e146102715780634585e33b1461028b578063581bdd161461029e57600080fd5b80630ca76175116101a25780630ca761751461022057806314b316781461023357806314d3940d14610249578063338cdca11461025c57600080fd5b8062b105e6146101c85780630494878e146101dd57806309c1ba2e1461020d575b600080fd5b6101db6101d63660046110e3565b610449565b005b6008546101f0906001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b6004546101f0906001600160401b031681565b6101db61022e3660046111a1565b6104eb565b61023b610551565b604051908152602001610204565b6101db6102573660046110e3565b610681565b61026461071a565b6040516102049190611257565b6008546101f090600160801b90046001600160401b031681565b6101db61029936600461126a565b6107a8565b6000546102b1906001600160a01b031681565b6040516001600160a01b039091168152602001610204565b6007546101f090600160a01b90046001600160401b031681565b6101f06102f13660046112dc565b6107f4565b6007546102b1906001600160a01b031681565b6101db6103173660046110e3565b61081d565b6101f061032a36600461130c565b6009602052600090815260409020546001600160401b031681565b61035861035336600461126a565b61086d565b604051610204929190611327565b61023b60055481565b6101db610893565b6102b16108a7565b6008546101f090600160c01b90046001600160401b031681565b6103a16108d5565b604051610204919061134a565b61023b60065481565b6008546101f090600160401b90046001600160401b031681565b6101db6103df366004611396565b6108e6565b6101db6103f23660046110e3565b61093a565b6101db610405366004611406565b610a34565b6101db6104183660046110e3565b610b03565b60045461043490600160401b900463ffffffff1681565b60405163ffffffff9091168152602001610204565b610451610b41565b61045c600182610b73565b61049f5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b6104aa600182610b98565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6000546001600160a01b031633146105165760405163c6829f8360e01b815260040160405180910390fd5b610521838383610bad565b60405183907f85e1543bf2f84fe80c6badbce3648c8539ad1df4d2b3d822938ca0538be727e690600090a2505050565b600061055b6108a7565b6001600160a01b0316336001600160a01b0316148061058457506007546001600160a01b031633145b6105c35760405162461bcd60e51b815260206004820152601060248201526f2737ba20b63637bbb2b221b0b63632b960811b6044820152606401610496565b610677600380546105d39061146b565b80601f01602080910402602001604051908101604052809291908181526020018280546105ff9061146b565b801561064c5780601f106106215761010080835404028352916020019161064c565b820191906000526020600020905b81548152906001019060200180831161062f57829003601f168201915b50506004546005546001600160401b0382169450600160401b90910463ffffffff1692509050610c81565b6006819055905090565b610689610b41565b610694600182610b73565b156106d55760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610496565b6106e0600182610d35565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016104e0565b600380546107279061146b565b80601f01602080910402602001604051908101604052809291908181526020018280546107539061146b565b80156107a05780601f10610775576101008083540402835291602001916107a0565b820191906000526020600020905b81548152906001019060200180831161078357829003601f168201915b505050505081565b6107b0610d4a565b156107f0576008805467ffffffffffffffff60801b1916600160801b426001600160401b031602179055600380546107ec91906105d39061146b565b6006555b5050565b6008546000906001600160401b031661080d81846114bb565b61081791906114f7565b92915050565b610825610b41565b600080546001600160a01b0319166001600160a01b038316908117825560405190917fcd35971ad691b112415e0fd43feb761712ca91c32838df7450c9dc1ef532784691a250565b60006060610879610d4a565b604080516000815260208101909152909590945092505050565b61089b610b41565b6108a56000610e09565b565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b60606108e16001610e7a565b905090565b6108ee610b41565b60036108fa8582611568565b506004805463ffffffff909316600160401b026bffffffffffffffffffffffff199093166001600160401b03909416939093179190911790915560055550565b6000610944610e87565b805490915060ff600160401b82041615906001600160401b031660008115801561096b5750825b90506000826001600160401b031660011480156109875750303b155b905081158015610995575080155b156109b35760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156109dd57845460ff60401b1916600160401b1785555b6109e686610eb0565b8315610a2c57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b610a3c610b41565b600780546001600160a01b0387166001600160e01b03199091168117600160a01b6001600160401b0388811691820292909217909355600880548783166fffffffffffffffffffffffffffffffff199091168117600160401b888516908102919091176001600160c01b0316600160c01b948816948502179092556040805195865260208601919091528401526060830152907fbed5a7c7626f62707ea8a0c71900fd8623e8ae9fde3cd99cfa5dc7d54bbabee09060800160405180910390a25050505050565b610b0b610b41565b6001600160a01b038116610b3557604051631e4fbdf760e01b815260006004820152602401610496565b610b3e81610e09565b50565b33610b4a6108a7565b6001600160a01b0316146108a55760405163118cdaa760e01b8152336004820152602401610496565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000610b91836001600160a01b038416610eca565b60096000610bba426107f4565b6001600160401b0390811682526020820192909252604001600090812080549092169190610be783611626565b91906101000a8154816001600160401b0302191690836001600160401b03160217905550508260065414610c315760405163d068bf5b60e01b815260048101849052602401610496565b60018251118015610c4157508051155b50827f7873807bf6ddc50401cd3d29bbe0decee23fd4d68d273f4b5eb83cded4d2f1728383604051610c74929190611651565b60405180910390a2505050565b6000805460405163230e93b160e11b815282916001600160a01b03169063461d276290610cbb9088908a906001908a908a9060040161167f565b6020604051808303816000875af1158015610cda573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cfe91906116c8565b60405190915081907f1131472297a800fee664d1d89cfa8f7676ff07189ecc53f80bbb5f4969099db890600090a295945050505050565b6000610b91836001600160a01b038416610fc4565b6008546000906001600160401b03600160c01b9091048116489091161115610d725750600090565b600754600854610d9c916001600160401b03600160a01b909104811691600160801b9004166116e1565b6001600160401b0316426001600160401b03161015610dbb5750600090565b600854600160401b90046001600160401b031660096000610ddb426107f4565b6001600160401b0390811682526020820192909252604001600020541610610e035750600090565b50600190565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b60606000610b9183611013565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610817565b6001600160a01b038116610ec15750335b6106d58161106f565b60008181526001830160205260408120548015610fb3576000610eee600183611700565b8554909150600090610f0290600190611700565b9050808214610f67576000866000018281548110610f2257610f22611713565b9060005260206000200154905080876000018481548110610f4557610f45611713565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610f7857610f78611729565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610817565b6000915050610817565b5092915050565b600081815260018301602052604081205461100b57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610817565b506000610817565b60608160000180548060200260200160405190810160405280929190818152602001828054801561106357602002820191906000526020600020905b81548152602001906001019080831161104f575b50505050509050919050565b611077611080565b610b3e816110a5565b6110886110ad565b6108a557604051631afcd79f60e31b815260040160405180910390fd5b610b0b611080565b60006110b7610e87565b54600160401b900460ff16919050565b80356001600160a01b03811681146110de57600080fd5b919050565b6000602082840312156110f557600080fd5b610b91826110c7565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261112557600080fd5b81356001600160401b0381111561113e5761113e6110fe565b604051601f8201601f19908116603f011681016001600160401b038111828210171561116c5761116c6110fe565b60405281815283820160200185101561118457600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000606084860312156111b657600080fd5b8335925060208401356001600160401b038111156111d357600080fd5b6111df86828701611114565b92505060408401356001600160401b038111156111fb57600080fd5b61120786828701611114565b9150509250925092565b6000815180845260005b818110156112375760208185018101518683018201520161121b565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610b916020830184611211565b6000806020838503121561127d57600080fd5b82356001600160401b0381111561129357600080fd5b8301601f810185136112a457600080fd5b80356001600160401b038111156112ba57600080fd5b8560208284010111156112cc57600080fd5b6020919091019590945092505050565b6000602082840312156112ee57600080fd5b5035919050565b80356001600160401b03811681146110de57600080fd5b60006020828403121561131e57600080fd5b610b91826112f5565b82151581526040602082015260006113426040830184611211565b949350505050565b602080825282518282018190526000918401906040840190835b8181101561138b5783516001600160a01b0316835260209384019390920191600101611364565b509095945050505050565b600080600080608085870312156113ac57600080fd5b84356001600160401b038111156113c257600080fd5b6113ce87828801611114565b9450506113dd602086016112f5565b9250604085013563ffffffff811681146113f657600080fd5b9396929550929360600135925050565b600080600080600060a0868803121561141e57600080fd5b611427866110c7565b9450611435602087016112f5565b9350611443604087016112f5565b9250611451606087016112f5565b915061145f608087016112f5565b90509295509295909350565b600181811c9082168061147f57607f821691505b60208210810361149f57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60006001600160401b038316806114e257634e487b7160e01b600052601260045260246000fd5b806001600160401b0384160491505092915050565b6001600160401b038181168382160290811690818114610fbd57610fbd6114a5565b601f82111561156357806000526020600020601f840160051c810160208510156115405750805b601f840160051c820191505b81811015611560576000815560010161154c565b50505b505050565b81516001600160401b03811115611581576115816110fe565b6115958161158f845461146b565b84611519565b6020601f8211600181146115c957600083156115b15750848201515b600019600385901b1c1916600184901b178455611560565b600084815260208120601f198516915b828110156115f957878501518255602094850194600190920191016115d9565b50848210156116175786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b60006001600160401b0382166001600160401b038103611648576116486114a5565b60010192915050565b6040815260006116646040830185611211565b82810360208401526116768185611211565b95945050505050565b6001600160401b038616815260a0602082015260006116a160a0830187611211565b61ffff9590951660408301525063ffffffff92909216606083015260809091015292915050565b6000602082840312156116da57600080fd5b5051919050565b6001600160401b038181168382160190811115610817576108176114a5565b81810381811115610817576108176114a5565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea26469706673582212202618aec3d6176cc1750ddd78e1d22314a3dd46d4df6f376a3054515c5c97e9fd64736f6c634300081e0033";
const isSuperArgs$5 = (xs) => xs.length > 1;
class BaseFunctionsConsumer__factory extends ContractFactory {
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
    return new Contract(
      address,
      _abi$6,
      runner
    );
  }
}

var index$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  BaseFunctionsConsumer__factory: BaseFunctionsConsumer__factory
});

const _abi$5 = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newSettler",
        type: "address"
      }
    ],
    name: "AddSettler",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "int256",
        name: "current",
        type: "int256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256"
      }
    ],
    name: "AnswerUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address"
      }
    ],
    name: "NewAsset",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string"
      }
    ],
    name: "NewDescription",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "roundId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "startedBy",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startedAt",
        type: "uint256"
      }
    ],
    name: "NewRound",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldSettler",
        type: "address"
      }
    ],
    name: "RemoveSettler",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "addSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "asset",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "deploymentTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "getAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80"
      }
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "roundId",
        type: "uint80"
      },
      {
        internalType: "int256",
        name: "answer",
        type: "int256"
      },
      {
        internalType: "uint256",
        name: "startedAt",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "updatedAt",
        type: "uint256"
      },
      {
        internalType: "uint80",
        name: "answeredInRound",
        type: "uint80"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "getTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "getTimestampAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initOwner",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "latestAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      },
      {
        internalType: "int256",
        name: "",
        type: "int256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_settler",
        type: "address"
      }
    ],
    name: "removeSettler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address"
      }
    ],
    name: "setAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_description",
        type: "string"
      }
    ],
    name: "setDescription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address"
      },
      {
        internalType: "string",
        name: "_description",
        type: "string"
      }
    ],
    name: "setFeedInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_version",
        type: "uint256"
      }
    ],
    name: "setVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "settlers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "newAnswer",
        type: "int256"
      }
    ],
    name: "updateAnswer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
const _bytecode$4 = "0x60a060405260086080526006600455348015601957600080fd5b5060805161114061003560003960006101a401526111406000f3fe608060405234801561001057600080fd5b50600436106101725760003560e01c80638da5cb5b116100de578063b5ab58dc11610097578063c4d66de811610071578063c4d66de814610398578063d0d552dd146103ab578063f2fde38b146103be578063feaf968c146103d157600080fd5b8063b5ab58dc1461034f578063b633620c1461036f578063bfc12c051461038f57600080fd5b80638da5cb5b1461028a57806390c3f38f146102ba5780639a24a180146102cd5780639a6fc8f5146102e0578063a87a20ce14610327578063b1da41fe1461033a57600080fd5b806350d25bcd1161013057806350d25bcd1461024957806354fd4d5014610252578063668a0f021461025b578063715018a6146102645780637284e4161461026c5780638205bf6a1461028157600080fd5b8062b105e61461017757806314d3940d1461018c578063313ce5671461019f57806338d52e0f146101dd5780633b2235fc14610208578063408def1e14610236575b600080fd5b61018a610185366004610d33565b6103d9565b005b61018a61019a366004610d33565b61047b565b6101c67f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff90911681526020015b60405180910390f35b6002546101f0906001600160a01b031681565b6040516001600160a01b0390911681526020016101d4565b610228610216366004610d4e565b600b6020526000908152604090205481565b6040519081526020016101d4565b61018a610244366004610d4e565b610514565b61022860065481565b61022860045481565b61022860085481565b61018a610521565b610274610535565b6040516101d49190610d67565b61022860075481565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03166101f0565b61018a6102c8366004610e5a565b6105c3565b61018a6102db366004610e97565b610607565b6102f36102ee366004610ee5565b610644565b604080516001600160501b03968716815260208101959095528401929092526060830152909116608082015260a0016101d4565b61018a610335366004610d4e565b6106c2565b610342610723565b6040516101d49190610f0e565b61022861035d366004610d4e565b60096020526000908152604090205481565b61022861037d366004610d4e565b600a6020526000908152604090205481565b61022860055481565b61018a6103a6366004610d33565b610734565b61018a6103b9366004610d33565b610830565b61018a6103cc366004610d33565b610882565b6102f36108bd565b6103e16108e1565b6103ec60008261093c565b61042f5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61043a600082610963565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6104836108e1565b61048e60008261093c565b156104cf5760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610426565b6104da600082610978565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e90602001610470565b61051c6108e1565b600455565b6105296108e1565b610533600061098d565b565b6003805461054290610f5a565b80601f016020809104026020016040519081016040528092919081815260200182805461056e90610f5a565b80156105bb5780601f10610590576101008083540402835291602001916105bb565b820191906000526020600020905b81548152906001019060200180831161059e57829003601f168201915b505050505081565b6105cb6108e1565b60036105d78282610fe3565b507f16fbb51445345dabaa215e5f99a4bd4d8ba9818b508c76d5cd0ea30abcc491c6816040516104709190610d67565b61060f6108e1565b60055460000361061e57426005555b60045460000361062e5760066004555b61063782610830565b610640816105c3565b5050565b6001600160501b0381166000818152600960205260408120548392909190819081906106725760055461069a565b600a600061068a60016001600160501b038a166110b8565b8152602001908152602001600020545b6001600160501b0387166000908152600a602052604090205495979496909594909350915050565b6106cd60003361093c565b6107075760405162461bcd60e51b815260206004820152600b60248201526a2727aa2fa9a2aa2a2622a960a91b6044820152606401610426565b61072081600854600161071a91906110cb565b426109fe565b50565b606061072f6000610aca565b905090565b600061073e610ade565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156107665750825b905060008267ffffffffffffffff1660011480156107835750303b155b905081158015610791575080155b156107af5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156107d957845460ff60401b1916600160401b1785555b6107e286610b07565b831561082857845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6108386108e1565b600280546001600160a01b0319166001600160a01b0383169081179091556040517fc7d9598af6004de7fa9c489a50a55414c75cfbce9fe56fe46956970744d6bc2c90600090a250565b61088a6108e1565b6001600160a01b0381166108b457604051631e4fbdf760e01b815260006004820152602401610426565b6107208161098d565b60008060008060006108d0600854610644565b945094509450945094509091929394565b336109137f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146105335760405163118cdaa760e01b8152336004820152602401610426565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b600061095a836001600160a01b038416610b21565b600061095a836001600160a01b038416610c14565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b8060075410610a0c57505050565b6006839055600781905560088290556000828152600a6020908152604080832080546009845282852088905590859055848452600b909252909120849055151580610a8957604051828152339084907f0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac602719060200160405180910390a35b82847f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f84604051610abc91815260200190565b60405180910390a350505050565b60606000610ad783610c63565b9392505050565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061095d565b6001600160a01b038116610b185750335b6104cf81610cbf565b60008181526001830160205260408120548015610c0a576000610b456001836110b8565b8554909150600090610b59906001906110b8565b9050808214610bbe576000866000018281548110610b7957610b796110de565b9060005260206000200154905080876000018481548110610b9c57610b9c6110de565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610bcf57610bcf6110f4565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061095d565b600091505061095d565b6000818152600183016020526040812054610c5b5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561095d565b50600061095d565b606081600001805480602002602001604051908101604052809291908181526020018280548015610cb357602002820191906000526020600020905b815481526020019060010190808311610c9f575b50505050509050919050565b610cc7610cd0565b61072081610cf5565b610cd8610cfd565b61053357604051631afcd79f60e31b815260040160405180910390fd5b61088a610cd0565b6000610d07610ade565b54600160401b900460ff16919050565b80356001600160a01b0381168114610d2e57600080fd5b919050565b600060208284031215610d4557600080fd5b61095a82610d17565b600060208284031215610d6057600080fd5b5035919050565b602081526000825180602084015260005b81811015610d955760208186018101516040868401015201610d78565b506000604082850101526040601f19601f83011684010191505092915050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112610ddc57600080fd5b813567ffffffffffffffff811115610df657610df6610db5565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610e2557610e25610db5565b604052818152838201602001851015610e3d57600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215610e6c57600080fd5b813567ffffffffffffffff811115610e8357600080fd5b610e8f84828501610dcb565b949350505050565b60008060408385031215610eaa57600080fd5b610eb383610d17565b9150602083013567ffffffffffffffff811115610ecf57600080fd5b610edb85828601610dcb565b9150509250929050565b600060208284031215610ef757600080fd5b81356001600160501b0381168114610ad757600080fd5b602080825282518282018190526000918401906040840190835b81811015610f4f5783516001600160a01b0316835260209384019390920191600101610f28565b509095945050505050565b600181811c90821680610f6e57607f821691505b602082108103610f8e57634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115610fde57806000526020600020601f840160051c81016020851015610fbb5750805b601f840160051c820191505b81811015610fdb5760008155600101610fc7565b50505b505050565b815167ffffffffffffffff811115610ffd57610ffd610db5565b6110118161100b8454610f5a565b84610f94565b6020601f821160018114611045576000831561102d5750848201515b600019600385901b1c1916600184901b178455610fdb565b600084815260208120601f198516915b828110156110755787850151825560209485019460019092019101611055565b50848210156110935786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8181038181111561095d5761095d6110a2565b8082018082111561095d5761095d6110a2565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220e7c181aa95755823c0cfaf98f58748dae8fa981f4eb48996c1ba77d6e40a9d2364736f6c634300081e0033";
const isSuperArgs$4 = (xs) => xs.length > 1;
class DataFeed__factory extends ContractFactory {
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

var index$a = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DataFeed__factory: DataFeed__factory
});

const _abi$4 = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error"
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "denomination",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "latestAggregator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "previousAggregator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "nextPhaseId",
        type: "uint16"
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "FeedConfirmed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "denomination",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "proposedAggregator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "currentAggregator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "FeedProposed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    inputs: [],
    name: "aggregator",
    outputs: [
      {
        internalType: "contract DataFeedAggregator",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "asset",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_aggregator",
        type: "address"
      }
    ],
    name: "callAsset",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "deploymentTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "description",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_roundId",
        type: "uint256"
      }
    ],
    name: "getAnswer",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80"
      }
    ],
    name: "getRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      },
      {
        internalType: "int256",
        name: "",
        type: "int256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_roundId",
        type: "uint256"
      }
    ],
    name: "getTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256"
      }
    ],
    name: "getTimestampAnswer",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_initOwner",
        type: "address"
      },
      {
        internalType: "address",
        name: "_aggregator",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "latestAnswer",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRound",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      },
      {
        internalType: "int256",
        name: "",
        type: "int256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint80",
        name: "",
        type: "uint80"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16"
      }
    ],
    name: "phaseAggregators",
    outputs: [
      {
        internalType: "contract DataFeedAggregator",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "phaseId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_aggregator",
        type: "address"
      }
    ],
    name: "proposeAggregator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
const _bytecode$3 = "0x6080604052348015600f57600080fd5b506110928061001f6000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c80637284e416116100b8578063b633620c1161007c578063b633620c146102c2578063bfc12c05146102d5578063c1597304146102dd578063f2fde38b14610306578063f8a2abd314610319578063feaf968c1461032c57600080fd5b80637284e416146102185780638205bf6a1461022d5780638da5cb5b146102355780639a6fc8f514610265578063b5ab58dc146102af57600080fd5b8063485cc9551161010a578063485cc955146101c257806350d25bcd146101d757806354fd4d50146101df57806358303b10146101e7578063668a0f0214610208578063715018a61461021057600080fd5b8063245a7bfc1461014757806330c812731461016c578063313ce5671461017f57806338d52e0f146101995780633b2235fc146101a1575b600080fd5b61014f610334565b6040516001600160a01b0390911681526020015b60405180910390f35b61014f61017a366004610d6f565b610354565b61018761040a565b60405160ff9091168152602001610163565b61014f61047a565b6101b46101af366004610d93565b610487565b604051908152602001610163565b6101d56101d0366004610dac565b610505565b005b6101b4610708565b6101b4610773565b6000546101f59061ffff1681565b60405161ffff9091168152602001610163565b6101b46107ba565b6101d5610801565b610220610815565b6040516101639190610e09565b6101b4610884565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031661014f565b610278610273366004610e54565b6108cb565b6040805169ffffffffffffffffffff968716815260208101959095528401929092526060830152909116608082015260a001610163565b6101b46102bd366004610d93565b610963565b6101b46102d0366004610d93565b61099a565b6101b46109d1565b61014f6102eb366004610e71565b6001602052600090815260409020546001600160a01b031681565b6101d5610314366004610d6f565b610a18565b6101d5610327366004610d6f565b610a5b565b610278610b8b565b6000805461ffff168152600160205260409020546001600160a01b031690565b60408051600481526024810182526020810180516001600160e01b03166338d52e0f60e01b1790529051600091829182916001600160a01b0386169161039a9190610e95565b600060405180830381855afa9150503d80600081146103d5576040519150601f19603f3d011682016040523d82523d6000602084013e6103da565b606091505b5091509150816103ee575060009392505050565b808060200190518101906104029190610eb1565b949350505050565b6000610414610334565b6001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610451573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104759190610ece565b905090565b600061047561017a610334565b6000610491610334565b6001600160a01b0316633b2235fc836040518263ffffffff1660e01b81526004016104be91815260200190565b602060405180830381865afa1580156104db573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ff9190610ef1565b92915050565b600061050f610c0d565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156105375750825b905060008267ffffffffffffffff1660011480156105545750303b155b905081158015610562575080155b156105805760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156105aa57845460ff60401b1916600160401b1785555b6001600160a01b0387166105bc573396505b6105c587610c36565b6001600160a01b038616156106b9578560006105e082610354565b6000805461ffff16815260016020908152604080832080546001600160a01b0319166001600160a01b0388811691909117909155815193845233928401929092529293508a81169261034892918516917fb56c4f88c3e344891ef92e51f036d7116e886f4ea57f5ba93e28b5f44925b9ce910160405180910390a4600080546040805192835261ffff909116602083015233908201526001600160a01b0389811691610348918416907f27a180c70f2642f63d1694eb252b7df52e7ab2565e3f67adf7748acb7d82b9bc9060600160405180910390a450505b83156106ff57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050565b6000610712610334565b6001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561074f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104759190610ef1565b600061077d610334565b6001600160a01b03166354fd4d506040518163ffffffff1660e01b8152600401602060405180830381865afa15801561074f573d6000803e3d6000fd5b60006107c4610334565b6001600160a01b031663668a0f026040518163ffffffff1660e01b8152600401602060405180830381865afa15801561074f573d6000803e3d6000fd5b610809610c47565b6108136000610ca2565b565b606061081f610334565b6001600160a01b0316637284e4166040518163ffffffff1660e01b8152600401600060405180830381865afa15801561085c573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526104759190810190610f20565b600061088e610334565b6001600160a01b0316638205bf6a6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561074f573d6000803e3d6000fd5b60008060008060006108db610334565b604051639a6fc8f560e01b815269ffffffffffffffffffff881660048201526001600160a01b039190911690639a6fc8f59060240160a060405180830381865afa15801561092d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109519190610fd5565b939a9299509097509550909350915050565b600061096d610334565b6001600160a01b031663b5ab58dc836040518263ffffffff1660e01b81526004016104be91815260200190565b60006109a4610334565b6001600160a01b031663b633620c836040518263ffffffff1660e01b81526004016104be91815260200190565b60006109db610334565b6001600160a01b031663bfc12c056040518163ffffffff1660e01b8152600401602060405180830381865afa15801561074f573d6000803e3d6000fd5b610a20610c47565b6001600160a01b038116610a4f57604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b610a5881610ca2565b50565b610a63610c47565b806000610a6e610334565b90506000610a7b84610354565b6000805491925061ffff9091169080610a938361102d565b82546101009290920a61ffff8181021990931691831602179091556000805490911681526001602090815260409182902080546001600160a01b0319166001600160a01b0388811691909117909155825186821681523392810192909252878116935061034892908516917fb56c4f88c3e344891ef92e51f036d7116e886f4ea57f5ba93e28b5f44925b9ce910160405180910390a4600054604080516001600160a01b03858116825261ffff9093166020820152338183015290518683169261034892908516917f27a180c70f2642f63d1694eb252b7df52e7ab2565e3f67adf7748acb7d82b9bc9181900360600190a450505050565b6000806000806000610b9b610334565b6001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610bd8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bfc9190610fd5565b945094509450945094509091929394565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a006104ff565b610c3e610d13565b610a5881610d38565b33610c797f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146108135760405163118cdaa760e01b8152336004820152602401610a46565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b610d1b610d40565b61081357604051631afcd79f60e31b815260040160405180910390fd5b610a20610d13565b6000610d4a610c0d565b54600160401b900460ff16919050565b6001600160a01b0381168114610a5857600080fd5b600060208284031215610d8157600080fd5b8135610d8c81610d5a565b9392505050565b600060208284031215610da557600080fd5b5035919050565b60008060408385031215610dbf57600080fd5b8235610dca81610d5a565b91506020830135610dda81610d5a565b809150509250929050565b60005b83811015610e00578181015183820152602001610de8565b50506000910152565b6020815260008251806020840152610e28816040850160208701610de5565b601f01601f19169190910160400192915050565b69ffffffffffffffffffff81168114610a5857600080fd5b600060208284031215610e6657600080fd5b8135610d8c81610e3c565b600060208284031215610e8357600080fd5b813561ffff81168114610d8c57600080fd5b60008251610ea7818460208701610de5565b9190910192915050565b600060208284031215610ec357600080fd5b8151610d8c81610d5a565b600060208284031215610ee057600080fd5b815160ff81168114610d8c57600080fd5b600060208284031215610f0357600080fd5b5051919050565b634e487b7160e01b600052604160045260246000fd5b600060208284031215610f3257600080fd5b815167ffffffffffffffff811115610f4957600080fd5b8201601f81018413610f5a57600080fd5b805167ffffffffffffffff811115610f7457610f74610f0a565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610fa357610fa3610f0a565b604052818152828201602001861015610fbb57600080fd5b610fcc826020830160208601610de5565b95945050505050565b600080600080600060a08688031215610fed57600080fd5b8551610ff881610e3c565b60208701516040880151606089015160808a01519398509196509450925061101f81610e3c565b809150509295509295909350565b600061ffff821661ffff810361105357634e487b7160e01b600052601160045260246000fd5b6001019291505056fea26469706673582212201f512719669e56be40266f844b7396ca5a14304780c1316c230dcc973f90817e64736f6c634300081e0033";
const isSuperArgs$3 = (xs) => xs.length > 1;
class DataFeedAggregator__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$3(args)) {
      super(...args);
    } else {
      super(_abi$4, _bytecode$3, args[0]);
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
  static abi = _abi$4;
  static createInterface() {
    return new Interface(_abi$4);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$4, runner);
  }
}

var index$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  DataFeedAggregator__factory: DataFeedAggregator__factory
});

const _abi$3 = [
  {
    inputs: [],
    name: "OnlyRouterCanFulfill",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "RequestFulfilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32"
      }
    ],
    name: "RequestSent",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32"
      },
      {
        internalType: "bytes",
        name: "response",
        type: "bytes"
      },
      {
        internalType: "bytes",
        name: "err",
        type: "bytes"
      }
    ],
    name: "handleOracleFulfillment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "i_router",
    outputs: [
      {
        internalType: "contract IFunctionsRouter",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];
class FunctionsClient__factory {
  static abi = _abi$3;
  static createInterface() {
    return new Interface(_abi$3);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$3, runner);
  }
}

var index$8 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  FunctionsClient__factory: FunctionsClient__factory
});

var index$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  agtReserveFeedSol: index$c,
  baseFunctionsConsumerSol: index$b,
  dataFeedAggregatorSol: index$9,
  dataFeedSol: index$a,
  functionsClientSol: index$8
});

const _abi$2 = [
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address"
      }
    ],
    name: "ERC1967InvalidAdmin",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address"
      }
    ],
    name: "ERC1967InvalidImplementation",
    type: "error"
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address"
      }
    ],
    name: "AdminChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address"
      }
    ],
    name: "Upgraded",
    type: "event"
  },
  {
    stateMutability: "payable",
    type: "fallback"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address"
      }
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address"
      },
      {
        internalType: "address",
        name: "newImplementation",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "initializeProxy",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    stateMutability: "payable",
    type: "receive"
  }
];
const _bytecode$2 = "0x6080604052348015600f57600080fd5b506106f18061001f6000396000f3fe60806040526004361061004e5760003560e01c80634f1ef286146100655780635c60da1b146100785780638f283970146100a9578063dce95104146100c9578063f851a440146100dc5761005d565b3661005d5761005b6100f1565b005b61005b6100f1565b61005b6100733660046105be565b610103565b34801561008457600080fd5b5061008d61016a565b6040516001600160a01b03909116815260200160405180910390f35b3480156100b557600080fd5b5061005b6100c436600461060c565b610179565b61005b6100d736600461062e565b6101d9565b3480156100e857600080fd5b5061008d610263565b6101016100fc61026d565b610277565b565b61010b61029b565b6001600160a01b0316336001600160a01b03161461015c5760405162461bcd60e51b81526020600482015260096024820152682727aa2fa0a226a4a760b91b60448201526064015b60405180910390fd5b61016682826102a5565b5050565b600061017461026d565b905090565b61018161029b565b6001600160a01b0316336001600160a01b0316146101cd5760405162461bcd60e51b81526020600482015260096024820152682727aa2fa0a226a4a760b91b6044820152606401610153565b6101d681610364565b50565b60006101e361026d565b6001600160a01b0316148015610209575060006101fe61029b565b6001600160a01b0316145b61024b5760405162461bcd60e51b81526020600482015260136024820152721053149150511657d253925512505312569151606a1b6044820152606401610153565b61025483610364565b61025e82826102a5565b505050565b600061017461029b565b60006101746103b8565b3660008037600080366000845af43d6000803e808015610296573d6000f35b3d6000fd5b60006101746103eb565b6102ae82610413565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561035c57600080836001600160a01b031683604051610304919061068c565b600060405180830381855af49150503d806000811461033f576040519150601f19603f3d011682016040523d82523d6000602084013e610344565b606091505b50915091508161035657805181602001fd5b50505050565b61016661048d565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f61038d6103eb565b604080516001600160a01b03928316815291841660208301520160405180910390a16101d6816104ac565b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b546001600160a01b0316919050565b60007fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61036103dc565b806001600160a01b03163b60000361044957604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610153565b807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b80546001600160a01b0319166001600160a01b039290921691909117905550565b34156101015760405163b398979f60e01b815260040160405180910390fd5b6001600160a01b0381166104d657604051633173bdd160e11b815260006004820152602401610153565b807fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610361046c565b80356001600160a01b038116811461051457600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261054057600080fd5b813567ffffffffffffffff81111561055a5761055a610519565b604051601f8201601f19908116603f0116810167ffffffffffffffff8111828210171561058957610589610519565b6040528181528382016020018510156105a157600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156105d157600080fd5b6105da836104fd565b9150602083013567ffffffffffffffff8111156105f657600080fd5b6106028582860161052f565b9150509250929050565b60006020828403121561061e57600080fd5b610627826104fd565b9392505050565b60008060006060848603121561064357600080fd5b61064c846104fd565b925061065a602085016104fd565b9150604084013567ffffffffffffffff81111561067657600080fd5b6106828682870161052f565b9150509250925092565b6000825160005b818110156106ad5760208186018101518583015201610693565b50600092019182525091905056fea2646970667358221220b964e33ef6561dce378cb6b49e06af6b0c4db2a504d6d74254b06989a345498464736f6c634300081e0033";
const isSuperArgs$2 = (xs) => xs.length > 1;
class InitializableProxy__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$2(args)) {
      super(...args);
    } else {
      super(_abi$2, _bytecode$2, args[0]);
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
  static bytecode = _bytecode$2;
  static abi = _abi$2;
  static createInterface() {
    return new Interface(_abi$2);
  }
  static connect(address, runner) {
    return new Contract(address, _abi$2, runner);
  }
}

var index$6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  InitializableProxy__factory: InitializableProxy__factory
});

var index$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  initializableProxySol: index$6
});

const _abi$1 = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string"
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8"
      },
      {
        internalType: "uint256",
        name: "supply_",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSpender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "ERC2612ExpiredSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "ERC2612InvalidSigner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "currentNonce",
        type: "uint256"
      }
    ],
    name: "InvalidAccountNonce",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "StringTooLong",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
const _bytecode$1 = "0x61018060405234801561001157600080fd5b506040516118a63803806118a68339810160408190526100309161045f565b338480604051806040016040528060018152602001603160f81b8152508787816003908161005e9190610571565b50600461006b8282610571565b5061007b91508390506005610175565b6101205261008a816006610175565b61014052815160208084019190912060e052815190820120610100524660a05261011760e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506001600160a01b03811661015057604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b610159816101a8565b5060ff82166101605261016c33826101fa565b505050506106a7565b60006020835110156101915761018a83610234565b90506101a2565b8161019c8482610571565b5060ff90505b92915050565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166102245760405163ec442f0560e01b815260006004820152602401610147565b61023060008383610272565b5050565b600080829050601f8151111561025f578260405163305a27a960e01b8152600401610147919061062f565b805161026a82610662565b179392505050565b6001600160a01b03831661029d5780600260008282546102929190610686565b9091555061030f9050565b6001600160a01b038316600090815260208190526040902054818110156102f05760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610147565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b03821661032b5760028054829003905561034a565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161038f91815260200190565b60405180910390a3505050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156103cd5781810151838201526020016103b5565b50506000910152565b600082601f8301126103e757600080fd5b81516001600160401b038111156104005761040061039c565b604051601f8201601f19908116603f011681016001600160401b038111828210171561042e5761042e61039c565b60405281815283820160200185101561044657600080fd5b6104578260208301602087016103b2565b949350505050565b6000806000806080858703121561047557600080fd5b84516001600160401b0381111561048b57600080fd5b610497878288016103d6565b602087015190955090506001600160401b038111156104b557600080fd5b6104c1878288016103d6565b935050604085015160ff811681146104d857600080fd5b6060959095015193969295505050565b600181811c908216806104fc57607f821691505b60208210810361051c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561056c57806000526020600020601f840160051c810160208510156105495750805b601f840160051c820191505b818110156105695760008155600101610555565b50505b505050565b81516001600160401b0381111561058a5761058a61039c565b61059e8161059884546104e8565b84610522565b6020601f8211600181146105d257600083156105ba5750848201515b600019600385901b1c1916600184901b178455610569565b600084815260208120601f198516915b8281101561060257878501518255602094850194600190920191016105e2565b50848210156106205786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b602081526000825180602084015261064e8160408501602087016103b2565b601f01601f19169190910160400192915050565b8051602080830151919081101561051c5760001960209190910360031b1b16919050565b808201808211156101a257634e487b7160e01b600052601160045260246000fd5b60805160a05160c05160e0516101005161012051610140516101605161119a61070c600039600061019e015260006109840152600061095701526000610814015260006107ec01526000610747015260006107710152600061079b015261119a6000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806379cc6790116100ad578063a0712d6811610071578063a0712d681461028d578063a9059cbb146102a0578063d505accf146102b3578063dd62ed3e146102c6578063f2fde38b146102ff57600080fd5b806379cc6790146102295780637ecebe001461023c57806384b0196e1461024f5780638da5cb5b1461026a57806395d89b411461028557600080fd5b80633644e515116100f45780633644e515146101c857806340c10f19146101d057806342966c68146101e557806370a08231146101f8578063715018a61461022157600080fd5b806306fdde0314610131578063095ea7b31461014f57806318160ddd1461017257806323b872dd14610184578063313ce56714610197575b600080fd5b610139610312565b6040516101469190610ee4565b60405180910390f35b61016261015d366004610f1a565b6103a4565b6040519015158152602001610146565b6002545b604051908152602001610146565b610162610192366004610f44565b6103be565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610146565b6101766103e2565b6101e36101de366004610f1a565b6103f1565b005b6101e36101f3366004610f81565b610407565b610176610206366004610f9a565b6001600160a01b031660009081526020819052604090205490565b6101e3610414565b6101e3610237366004610f1a565b610428565b61017661024a366004610f9a565b61043d565b61025761045b565b6040516101469796959493929190610fb5565b6008546040516001600160a01b039091168152602001610146565b6101396104a1565b6101e361029b366004610f81565b6104b0565b6101626102ae366004610f1a565b6104c2565b6101e36102c136600461104d565b6104d0565b6101766102d43660046110c0565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101e361030d366004610f9a565b61060f565b606060038054610321906110f3565b80601f016020809104026020016040519081016040528092919081815260200182805461034d906110f3565b801561039a5780601f1061036f5761010080835404028352916020019161039a565b820191906000526020600020905b81548152906001019060200180831161037d57829003601f168201915b5050505050905090565b6000336103b281858561064a565b60019150505b92915050565b6000336103cc85828561065c565b6103d78585856106db565b506001949350505050565b60006103ec61073a565b905090565b6103f9610865565b6104038282610892565b5050565b61041133826108c8565b50565b61041c610865565b61042660006108fe565b565b61043382338361065c565b61040382826108c8565b6001600160a01b0381166000908152600760205260408120546103b8565b60006060806000806000606061046f610950565b61047761097d565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b606060048054610321906110f3565b6104b8610865565b6104113382610892565b6000336103b28185856106db565b834211156104f95760405163313c898160e11b8152600481018590526024015b60405180910390fd5b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886105468c6001600160a01b0316600090815260076020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006105a1826109aa565b905060006105b1828787876109d7565b9050896001600160a01b0316816001600160a01b0316146105f8576040516325c0072360e11b81526001600160a01b0380831660048301528b1660248201526044016104f0565b6106038a8a8a61064a565b50505050505050505050565b610617610865565b6001600160a01b03811661064157604051631e4fbdf760e01b8152600060048201526024016104f0565b610411816108fe565b6106578383836001610a05565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198110156106d557818110156106c657604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064016104f0565b6106d584848484036000610a05565b50505050565b6001600160a01b03831661070557604051634b637e8f60e11b8152600060048201526024016104f0565b6001600160a01b03821661072f5760405163ec442f0560e01b8152600060048201526024016104f0565b610657838383610ada565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561079357507f000000000000000000000000000000000000000000000000000000000000000046145b156107bd57507f000000000000000000000000000000000000000000000000000000000000000090565b6103ec604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6008546001600160a01b031633146104265760405163118cdaa760e01b81523360048201526024016104f0565b6001600160a01b0382166108bc5760405163ec442f0560e01b8152600060048201526024016104f0565b61040360008383610ada565b6001600160a01b0382166108f257604051634b637e8f60e11b8152600060048201526024016104f0565b61040382600083610ada565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006005610c04565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006006610c04565b60006103b86109b761073a565b8360405161190160f01b8152600281019290925260228201526042902090565b6000806000806109e988888888610caf565b9250925092506109f98282610d7e565b50909695505050505050565b6001600160a01b038416610a2f5760405163e602df0560e01b8152600060048201526024016104f0565b6001600160a01b038316610a5957604051634a1406b160e11b8152600060048201526024016104f0565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156106d557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610acc91815260200190565b60405180910390a350505050565b6001600160a01b038316610b05578060026000828254610afa919061112d565b90915550610b779050565b6001600160a01b03831660009081526020819052604090205481811015610b585760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016104f0565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610b9357600280548290039055610bb2565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610bf791815260200190565b60405180910390a3505050565b606060ff8314610c1e57610c1783610e37565b90506103b8565b818054610c2a906110f3565b80601f0160208091040260200160405190810160405280929190818152602001828054610c56906110f3565b8015610ca35780601f10610c7857610100808354040283529160200191610ca3565b820191906000526020600020905b815481529060010190602001808311610c8657829003601f168201915b505050505090506103b8565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115610cea5750600091506003905082610d74565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610d3e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610d6a57506000925060019150829050610d74565b9250600091508190505b9450945094915050565b6000826003811115610d9257610d9261114e565b03610d9b575050565b6001826003811115610daf57610daf61114e565b03610dcd5760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115610de157610de161114e565b03610e025760405163fce698f760e01b8152600481018290526024016104f0565b6003826003811115610e1657610e1661114e565b03610403576040516335e2f38360e21b8152600481018290526024016104f0565b60606000610e4483610e76565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600060ff8216601f8111156103b857604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b81811015610ec457602081850181015186830182015201610ea8565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610ef76020830184610e9e565b9392505050565b80356001600160a01b0381168114610f1557600080fd5b919050565b60008060408385031215610f2d57600080fd5b610f3683610efe565b946020939093013593505050565b600080600060608486031215610f5957600080fd5b610f6284610efe565b9250610f7060208501610efe565b929592945050506040919091013590565b600060208284031215610f9357600080fd5b5035919050565b600060208284031215610fac57600080fd5b610ef782610efe565b60ff60f81b8816815260e060208201526000610fd460e0830189610e9e565b8281036040840152610fe68189610e9e565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b8181101561103c57835183526020938401939092019160010161101e565b50909b9a5050505050505050505050565b600080600080600080600060e0888a03121561106857600080fd5b61107188610efe565b965061107f60208901610efe565b95506040880135945060608801359350608088013560ff811681146110a357600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156110d357600080fd5b6110dc83610efe565b91506110ea60208401610efe565b90509250929050565b600181811c9082168061110757607f821691505b60208210810361112757634e487b7160e01b600052602260045260246000fd5b50919050565b808201808211156103b857634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea2646970667358221220c7e814e7942620e0f5418374438c380aba33a88558c2099a101774240bcf251564736f6c634300081e0033";
const isSuperArgs$1 = (xs) => xs.length > 1;
class ERC20Mock__factory extends ContractFactory {
  constructor(...args) {
    if (isSuperArgs$1(args)) {
      super(...args);
    } else {
      super(_abi$1, _bytecode$1, args[0]);
    }
  }
  getDeployTransaction(name_, symbol_, decimals_, supply_, overrides) {
    return super.getDeployTransaction(
      name_,
      symbol_,
      decimals_,
      supply_,
      overrides || {}
    );
  }
  deploy(name_, symbol_, decimals_, supply_, overrides) {
    return super.deploy(
      name_,
      symbol_,
      decimals_,
      supply_,
      overrides || {}
    );
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

var index$4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ERC20Mock__factory: ERC20Mock__factory
});

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256"
      }
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientAllowance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256"
      }
    ],
    name: "ERC20InsufficientBalance",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address"
      }
    ],
    name: "ERC20InvalidApprover",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address"
      }
    ],
    name: "ERC20InvalidReceiver",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "ERC20InvalidSpender",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "ERC2612ExpiredSignature",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "ERC2612InvalidSigner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "currentNonce",
        type: "uint256"
      }
    ],
    name: "InvalidAccountNonce",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "OwnableInvalidOwner",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string"
      }
    ],
    name: "StringTooLong",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newMinter",
        type: "address"
      }
    ],
    name: "AddMinter",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldMinter",
        type: "address"
      }
    ],
    name: "RemoveMinter",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_minter",
        type: "address"
      }
    ],
    name: "addMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "version",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address"
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32"
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "minters",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_minter",
        type: "address"
      }
    ],
    name: "removeMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
const _bytecode = "0x61016060405234801561001157600080fd5b50336040518060400160405280601281526020017120b937bbb0b7309023b7b632102a37b5b2b760711b81525080604051806040016040528060018152602001603160f81b8152506040518060400160405280601281526020017120b937bbb0b7309023b7b632102a37b5b2b760711b815250604051806040016040528060038152602001621051d560ea1b81525081600390816100af91906103bc565b5060046100bc82826103bc565b506100cc915083905060056101ef565b610120526100db8160066101ef565b61014052815160208084019190912060e052815190820120610100524660a05261016860e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506001600160a01b0381166101a157604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6101aa81610222565b506101b6600933610274565b506040513381527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab9060200160405180910390a16104ec565b600060208351101561020b5761020483610290565b905061021c565b8161021684826103bc565b5060ff90505b92915050565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000610289836001600160a01b0384166102ce565b9392505050565b600080829050601f815111156102bb578260405163305a27a960e01b8152600401610198919061047a565b80516102c6826104c8565b179392505050565b60008181526001830160205260408120546103155750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561021c565b50600061021c565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061034757607f821691505b60208210810361036757634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156103b757806000526020600020601f840160051c810160208510156103945750805b601f840160051c820191505b818110156103b457600081556001016103a0565b50505b505050565b81516001600160401b038111156103d5576103d561031d565b6103e9816103e38454610333565b8461036d565b6020601f82116001811461041d57600083156104055750848201515b600019600385901b1c1916600184901b1784556103b4565b600084815260208120601f198516915b8281101561044d578785015182556020948501946001909201910161042d565b508482101561046b5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b602081526000825180602084015260005b818110156104a8576020818601810151604086840101520161048b565b506000604082850101526040601f19601f83011684010191505092915050565b805160208083015191908110156103675760001960209190910360031b1b16919050565b60805160a05160c05160e0516101005161012051610140516116106105466000396000610bae01526000610b8101526000610a6b01526000610a430152600061099e015260006109c8015260006109f201526116106000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c806379cc6790116100c3578063a0712d681161007c578063a0712d68146102b2578063a9059cbb146102c5578063d505accf146102d8578063dd62ed3e146102eb578063f2fde38b14610324578063f97b57ec1461033757600080fd5b806379cc67901461023b5780637ecebe001461024e57806384b0196e146102615780638da5cb5b1461027c57806395d89b4114610297578063983b2d561461029f57600080fd5b8063313ce56711610115578063313ce567146101cd5780633644e515146101dc57806340c10f19146101e457806342966c68146101f757806370a082311461020a578063715018a61461023357600080fd5b806306fdde0314610152578063095ea7b31461017057806318160ddd1461019357806323b872dd146101a55780633092afd5146101b8575b600080fd5b61015a61034c565b60405161016791906112ce565b60405180910390f35b61018361017e3660046112fd565b6103de565b6040519015158152602001610167565b6002545b604051908152602001610167565b6101836101b3366004611327565b6103f8565b6101cb6101c6366004611364565b61041c565b005b60405160128152602001610167565b6101976104bd565b6101cb6101f23660046112fd565b6104cc565b6101cb61020536600461137f565b61051f565b610197610218366004611364565b6001600160a01b031660009081526020819052604090205490565b6101cb61052c565b6101cb6102493660046112fd565b610540565b61019761025c366004611364565b610555565b610269610573565b6040516101679796959493929190611398565b6008546040516001600160a01b039091168152602001610167565b61015a6105b9565b6101cb6102ad366004611364565b6105c8565b6101cb6102c036600461137f565b610660565b6101836102d33660046112fd565b6106ab565b6101cb6102e6366004611430565b6106b9565b6101976102f93660046114a3565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101cb610332366004611364565b6107f3565b61033f61082e565b60405161016791906114d6565b60606003805461035b90611522565b80601f016020809104026020016040519081016040528092919081815260200182805461038790611522565b80156103d45780601f106103a9576101008083540402835291602001916103d4565b820191906000526020600020905b8154815290600101906020018083116103b757829003601f168201915b5050505050905090565b6000336103ec81858561083a565b60019150505b92915050565b60003361040685828561084c565b6104118585856108cb565b506001949350505050565b61042461092a565b61042f600982610957565b6104715760405162461bcd60e51b815260206004820152600e60248201526d24a72b20a624a22fa6a4a72a22a960911b60448201526064015b60405180910390fd5b61047c60098261097c565b506040516001600160a01b03821681527f2f91b591fc56ac0917953ad01ec225524ee5ef0555213e4c8a9d8c9728ee7ffb906020015b60405180910390a150565b60006104c7610991565b905090565b6104d9335b600990610957565b6105115760405162461bcd60e51b81526020600482015260096024820152682327a92124a22222a760b91b6044820152606401610468565b61051b8282610abc565b5050565b6105293382610af2565b50565b61053461092a565b61053e6000610b28565b565b61054b82338361084c565b61051b8282610af2565b6001600160a01b0381166000908152600760205260408120546103f2565b600060608060008060006060610587610b7a565b61058f610ba7565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b60606004805461035b90611522565b6105d061092a565b6105db600982610957565b1561061b5760405162461bcd60e51b815260206004820152601060248201526f222aa82624a1a0aa22afa6a4a72a22a960811b6044820152606401610468565b610626600982610bd4565b506040516001600160a01b03821681527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab906020016104b2565b610669336104d1565b6106a15760405162461bcd60e51b81526020600482015260096024820152682327a92124a22222a760b91b6044820152606401610468565b6105293382610abc565b6000336103ec8185856108cb565b834211156106dd5760405163313c898160e11b815260048101859052602401610468565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c988888861072a8c6001600160a01b0316600090815260076020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061078582610be9565b9050600061079582878787610c16565b9050896001600160a01b0316816001600160a01b0316146107dc576040516325c0072360e11b81526001600160a01b0380831660048301528b166024820152604401610468565b6107e78a8a8a61083a565b50505050505050505050565b6107fb61092a565b6001600160a01b03811661082557604051631e4fbdf760e01b815260006004820152602401610468565b61052981610b28565b60606104c76009610c44565b6108478383836001610c51565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198110156108c557818110156108b657604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610468565b6108c584848484036000610c51565b50505050565b6001600160a01b0383166108f557604051634b637e8f60e11b815260006004820152602401610468565b6001600160a01b03821661091f5760405163ec442f0560e01b815260006004820152602401610468565b610847838383610d26565b6008546001600160a01b0316331461053e5760405163118cdaa760e01b8152336004820152602401610468565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000610975836001600160a01b038416610e50565b6000306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480156109ea57507f000000000000000000000000000000000000000000000000000000000000000046145b15610a1457507f000000000000000000000000000000000000000000000000000000000000000090565b6104c7604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6001600160a01b038216610ae65760405163ec442f0560e01b815260006004820152602401610468565b61051b60008383610d26565b6001600160a01b038216610b1c57604051634b637e8f60e11b815260006004820152602401610468565b61051b82600083610d26565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606104c77f00000000000000000000000000000000000000000000000000000000000000006005610f43565b60606104c77f00000000000000000000000000000000000000000000000000000000000000006006610f43565b6000610975836001600160a01b038416610fee565b60006103f2610bf6610991565b8360405161190160f01b8152600281019290925260228201526042902090565b600080600080610c288888888861103d565b925092509250610c38828261110c565b50909695505050505050565b60606000610975836111c5565b6001600160a01b038416610c7b5760405163e602df0560e01b815260006004820152602401610468565b6001600160a01b038316610ca557604051634a1406b160e11b815260006004820152602401610468565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156108c557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610d1891815260200190565b60405180910390a350505050565b6001600160a01b038316610d51578060026000828254610d469190611572565b90915550610dc39050565b6001600160a01b03831660009081526020819052604090205481811015610da45760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610468565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610ddf57600280548290039055610dfe565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e4391815260200190565b60405180910390a3505050565b60008181526001830160205260408120548015610f39576000610e74600183611585565b8554909150600090610e8890600190611585565b9050808214610eed576000866000018281548110610ea857610ea8611598565b9060005260206000200154905080876000018481548110610ecb57610ecb611598565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610efe57610efe6115ae565b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506103f2565b60009150506103f2565b606060ff8314610f5d57610f5683611221565b90506103f2565b818054610f6990611522565b80601f0160208091040260200160405190810160405280929190818152602001828054610f9590611522565b8015610fe25780601f10610fb757610100808354040283529160200191610fe2565b820191906000526020600020905b815481529060010190602001808311610fc557829003601f168201915b505050505090506103f2565b6000818152600183016020526040812054611035575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556103f2565b5060006103f2565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156110785750600091506003905082611102565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa1580156110cc573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166110f857506000925060019150829050611102565b9250600091508190505b9450945094915050565b6000826003811115611120576111206115c4565b03611129575050565b600182600381111561113d5761113d6115c4565b0361115b5760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561116f5761116f6115c4565b036111905760405163fce698f760e01b815260048101829052602401610468565b60038260038111156111a4576111a46115c4565b0361051b576040516335e2f38360e21b815260048101829052602401610468565b60608160000180548060200260200160405190810160405280929190818152602001828054801561121557602002820191906000526020600020905b815481526020019060010190808311611201575b50505050509050919050565b6060600061122e83611260565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600060ff8216601f8111156103f257604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b818110156112ae57602081850181015186830182015201611292565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006109756020830184611288565b80356001600160a01b03811681146112f857600080fd5b919050565b6000806040838503121561131057600080fd5b611319836112e1565b946020939093013593505050565b60008060006060848603121561133c57600080fd5b611345846112e1565b9250611353602085016112e1565b929592945050506040919091013590565b60006020828403121561137657600080fd5b610975826112e1565b60006020828403121561139157600080fd5b5035919050565b60ff60f81b8816815260e0602082015260006113b760e0830189611288565b82810360408401526113c98189611288565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b8181101561141f578351835260209384019390920191600101611401565b50909b9a5050505050505050505050565b600080600080600080600060e0888a03121561144b57600080fd5b611454886112e1565b9650611462602089016112e1565b95506040880135945060608801359350608088013560ff8116811461148657600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156114b657600080fd5b6114bf836112e1565b91506114cd602084016112e1565b90509250929050565b602080825282518282018190526000918401906040840190835b818110156115175783516001600160a01b03168352602093840193909201916001016114f0565b509095945050505050565b600181811c9082168061153657607f821691505b60208210810361155657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103f2576103f261155c565b818103818111156103f2576103f261155c565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea2646970667358221220fdbc9a70cf0eff84020b197f8e61a42bb90698018ab721b32a355e2b7267ecf564736f6c634300081e0033";
const isSuperArgs = (xs) => xs.length > 1;
class GoldToken__factory extends ContractFactory {
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

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  GoldToken__factory: GoldToken__factory
});

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  erc20MockSol: index$4,
  goldTokenSol: index$3
});

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  goldMinterSol: index$l,
  interfaces: index$g,
  libraries: index$d,
  lockSol: index$k,
  oracle: index$7,
  proxy: index$5,
  tokens: index$2
});

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  chainlink: index$16,
  contracts: index$1,
  openzeppelin: index$m
});

var Networks = /* @__PURE__ */ ((Networks2) => {
  Networks2[Networks2["MAINNET"] = 1] = "MAINNET";
  Networks2[Networks2["ARBITRUM_SEPOLIA"] = 421614] = "ARBITRUM_SEPOLIA";
  return Networks2;
})(Networks || {});
const goldConfigs = {
  [421614 /* ARBITRUM_SEPOLIA */]: {
    chainId: 421614 /* ARBITRUM_SEPOLIA */,
    rpc: "https://sepolia-rollup.arbitrum.io/rpc",
    goldToken: "0xfF35467D561CaD5a3d33f2eE3A4a430d53332643",
    goldPriceFeed: "0xB1Bcf13BAe2b914b4f59e0c835B9Ecf8b606c50c",
    goldReserveFeed: "0x0623C5E104cf1282CEB1F5f623Da994BAB6D57CD",
    goldMinter: "0x3Fd3b42721DcC4cBc3d71291213380422A2d41a1"
  }
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
  Levels2[Levels2["DEFAULT"] = 0] = "DEFAULT";
  Levels2[Levels2["KYCD"] = 1] = "KYCD";
  Levels2[Levels2["APPROVED"] = 2] = "APPROVED";
  return Levels2;
})(Levels || {});
async function getGoldStats({
  goldToken,
  goldPriceFeed,
  goldReserveFeed,
  goldMinter
}) {
  const [
    goldTokenSupply,
    goldPriceFeedAns,
    goldReserveFeedAns,
    slippage,
    fees,
    tradeLevel,
    minGoldAmount,
    minGoldFee,
    minGoldFeeAmount
  ] = await Promise.all([
    goldToken.totalSupply(),
    goldPriceFeed.latestAnswer(),
    goldReserveFeed.latestAnswer(),
    goldMinter.slippage(),
    goldMinter.fees(),
    goldMinter.tradeLevel(),
    goldMinter.minGoldAmount(),
    goldMinter.minGoldFee(),
    goldMinter.minGoldFeeAmount()
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
    minGoldFeeAmount: NumDecimals(formatEther(minGoldFeeAmount))
  };
}
function calculateSwap({
  inputAmount,
  isBuy,
  goldPrice,
  fees,
  slippage,
  minGoldFee,
  minGoldFeeAmount
}) {
  const outputDecimals = isBuy ? GOLD_TOKEN_DECIMALS : USD_TOKEN_MAX_DECIMALS;
  const outputAmount = NumDecimals(
    isBuy ? inputAmount / goldPrice : inputAmount * goldPrice,
    outputDecimals
  );
  const goldAmount = isBuy ? outputAmount : inputAmount;
  const overMinGoldFeeAmount = goldAmount >= (minGoldFeeAmount || 0);
  const goldFees = NumDecimals(
    overMinGoldFeeAmount ? goldAmount * (fees || 0) / 100 : minGoldFee || 0,
    GOLD_TOKEN_DECIMALS
  );
  const outputOnSlippage = NumDecimals(
    outputAmount * (100 - (slippage || 2) * 0.5 + (fees || 0)) / 100,
    outputDecimals
  );
  return {
    outputAmount,
    outputOnSlippage,
    goldAmount,
    goldFees
  };
}
function NumDecimals(num, maxDecimals = 18) {
  return Number(Number(num).toFixed(maxDecimals));
}

export { AGTReserveFeed__factory, Address__factory, AutomationBase__factory, AutomationCompatibleInterface__factory, AutomationCompatible__factory, BaseFunctionsConsumer__factory, ContextUpgradeable__factory, DATAFEED_DECIMALS, DataFeedAggregator__factory, DataFeed__factory, ECDSA__factory, EIP712__factory, ERC1967Utils__factory, ERC20Burnable__factory, ERC20Mock__factory, ERC20Permit__factory, ERC20__factory, Errors__factory, FunctionsClient__factory, FunctionsRequest__factory, GOLD_TOKEN_DECIMALS, GoldMinter__factory, GoldToken__factory, IBeacon__factory, IERC1155Errors__factory, IERC1363__factory, IERC165__factory, IERC1967__factory, IERC20Errors__factory, IERC20Exp__factory, IERC20Metadata__factory, IERC20Mintable__factory, IERC20Permit__factory, IERC20__factory, IERC5267__factory, IERC721Errors__factory, IFunctionsClient__factory, IFunctionsRouter__factory, IInitializableProxy__factory, IPriceFeed__factory, InitializableProxy__factory, Initializable__factory, Levels, Lock__factory, Networks, Nonces__factory, NumDecimals, OwnableUpgradeable__factory, Ownable__factory, Proxy__factory, ReentrancyGuardUpgradeable__factory, SafeCast__factory, SafeERC20__factory, ShortStrings__factory, SigLib__factory, Strings__factory, USD_TOKEN_MAX_DECIMALS, WithSettler__factory, calculateSwap, index as factories, getGoldMinterContract, getGoldPriceFeedContract, getGoldReserveFeedContract, getGoldStats, getGoldTokenContract, getStableCoinContract, goldConfigs };
