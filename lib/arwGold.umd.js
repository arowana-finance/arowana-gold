(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ethers')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ethers'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arwGold = {}, global.ethers));
})(this, (function (exports, ethers) { 'use strict';

  const _abi$F = [
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
    static abi = _abi$F;
    static createInterface() {
      return new ethers.Interface(_abi$F);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$F, runner);
    }
  }

  var index$11 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Ownable__factory: Ownable__factory
  });

  var index$10 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ownableSol: index$11
  });

  const _abi$E = [
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
    static abi = _abi$E;
    static createInterface() {
      return new ethers.Interface(_abi$E);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$E, runner);
    }
  }

  var index$$ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC1363__factory: IERC1363__factory
  });

  const _abi$D = [
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
    static abi = _abi$D;
    static createInterface() {
      return new ethers.Interface(_abi$D);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$D, runner);
    }
  }

  var index$_ = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC1967__factory: IERC1967__factory
  });

  const _abi$C = [
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
    static abi = _abi$C;
    static createInterface() {
      return new ethers.Interface(_abi$C);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$C, runner);
    }
  }

  var index$Z = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC5267__factory: IERC5267__factory
  });

  const _abi$B = [
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
    static abi = _abi$B;
    static createInterface() {
      return new ethers.Interface(_abi$B);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$B, runner);
    }
  }

  const _abi$A = [
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
    static abi = _abi$A;
    static createInterface() {
      return new ethers.Interface(_abi$A);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$A, runner);
    }
  }

  const _abi$z = [
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
    static abi = _abi$z;
    static createInterface() {
      return new ethers.Interface(_abi$z);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$z, runner);
    }
  }

  var index$Y = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC1155Errors__factory: IERC1155Errors__factory,
    IERC20Errors__factory: IERC20Errors__factory,
    IERC721Errors__factory: IERC721Errors__factory
  });

  var index$X = /*#__PURE__*/Object.freeze({
    __proto__: null,
    draftIerc6093Sol: index$Y,
    ierc1363Sol: index$$,
    ierc1967Sol: index$_,
    ierc5267Sol: index$Z
  });

  const _abi$y = [
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
  const _bytecode$f = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212207307dfd6abbb2f143340696000e3007ea7e9e1bf9f44577ab4b8948deba7c3e164736f6c634300081e0033";
  const isSuperArgs$f = (xs) => xs.length > 1;
  class ERC1967Utils__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$f(args)) {
        super(...args);
      } else {
        super(_abi$y, _bytecode$f, args[0]);
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
    static abi = _abi$y;
    static createInterface() {
      return new ethers.Interface(_abi$y);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$y, runner);
    }
  }

  var index$W = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ERC1967Utils__factory: ERC1967Utils__factory
  });

  var index$V = /*#__PURE__*/Object.freeze({
    __proto__: null,
    erc1967UtilsSol: index$W
  });

  const _abi$x = [
    {
      stateMutability: "payable",
      type: "fallback"
    }
  ];
  class Proxy__factory {
    static abi = _abi$x;
    static createInterface() {
      return new ethers.Interface(_abi$x);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$x, runner);
    }
  }

  var index$U = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Proxy__factory: Proxy__factory
  });

  const _abi$w = [
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
    static abi = _abi$w;
    static createInterface() {
      return new ethers.Interface(_abi$w);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$w, runner);
    }
  }

  var index$T = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IBeacon__factory: IBeacon__factory
  });

  var index$S = /*#__PURE__*/Object.freeze({
    __proto__: null,
    iBeaconSol: index$T
  });

  var index$R = /*#__PURE__*/Object.freeze({
    __proto__: null,
    beacon: index$S,
    erc1967: index$V,
    proxySol: index$U
  });

  const _abi$v = [
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
    static abi = _abi$v;
    static createInterface() {
      return new ethers.Interface(_abi$v);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$v, runner);
    }
  }

  var index$Q = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ERC20__factory: ERC20__factory
  });

  const _abi$u = [
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
    static abi = _abi$u;
    static createInterface() {
      return new ethers.Interface(_abi$u);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$u, runner);
    }
  }

  var index$P = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC20__factory: IERC20__factory
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
    static abi = _abi$t;
    static createInterface() {
      return new ethers.Interface(_abi$t);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$t, runner);
    }
  }

  var index$O = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ERC20Burnable__factory: ERC20Burnable__factory
  });

  const _abi$s = [
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
    static abi = _abi$s;
    static createInterface() {
      return new ethers.Interface(_abi$s);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$s, runner);
    }
  }

  var index$N = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ERC20Permit__factory: ERC20Permit__factory
  });

  const _abi$r = [
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
    static abi = _abi$r;
    static createInterface() {
      return new ethers.Interface(_abi$r);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$r, runner);
    }
  }

  var index$M = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC20Metadata__factory: IERC20Metadata__factory
  });

  const _abi$q = [
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
    static abi = _abi$q;
    static createInterface() {
      return new ethers.Interface(_abi$q);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$q, runner);
    }
  }

  var index$L = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC20Permit__factory: IERC20Permit__factory
  });

  var index$K = /*#__PURE__*/Object.freeze({
    __proto__: null,
    erc20BurnableSol: index$O,
    erc20PermitSol: index$N,
    ierc20MetadataSol: index$M,
    ierc20PermitSol: index$L
  });

  const _abi$p = [
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
  const _bytecode$e = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122043079bea5dd6ee03db8929a1da8105df4c2a69715f282ff58a2bbcc13076658564736f6c634300081e0033";
  const isSuperArgs$e = (xs) => xs.length > 1;
  class SafeERC20__factory extends ethers.ContractFactory {
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
      return new ethers.Interface(_abi$p);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$p, runner);
    }
  }

  var index$J = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SafeERC20__factory: SafeERC20__factory
  });

  var index$I = /*#__PURE__*/Object.freeze({
    __proto__: null,
    safeErc20Sol: index$J
  });

  var index$H = /*#__PURE__*/Object.freeze({
    __proto__: null,
    erc20Sol: index$Q,
    extensions: index$K,
    ierc20Sol: index$P,
    utils: index$I
  });

  var index$G = /*#__PURE__*/Object.freeze({
    __proto__: null,
    erc20: index$H
  });

  const _abi$o = [
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
  const _bytecode$d = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220c68c36133f43860ddc6ed3e6623be94930d2f16dd085cbe0e411f5f23937d27d64736f6c634300081e0033";
  const isSuperArgs$d = (xs) => xs.length > 1;
  class Address__factory extends ethers.ContractFactory {
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
      return new ethers.Interface(_abi$o);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$o, runner);
    }
  }

  var index$F = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Address__factory: Address__factory
  });

  const _abi$n = [
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
  const _bytecode$c = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea26469706673582212203366ec7caa69eeefa2392800944912457d82835fb90169f44a7c8565b5f8af2164736f6c634300081e0033";
  const isSuperArgs$c = (xs) => xs.length > 1;
  class Errors__factory extends ethers.ContractFactory {
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
      return new ethers.Interface(_abi$n);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$n, runner);
    }
  }

  var index$E = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Errors__factory: Errors__factory
  });

  const _abi$m = [
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
    static abi = _abi$m;
    static createInterface() {
      return new ethers.Interface(_abi$m);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$m, runner);
    }
  }

  var index$D = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Nonces__factory: Nonces__factory
  });

  const _abi$l = [
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
  const _bytecode$b = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220219ab62295e5e6d0062337603704630ea0957c62112a6764cc7829f67f4be37064736f6c634300081e0033";
  const isSuperArgs$b = (xs) => xs.length > 1;
  class ShortStrings__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$b(args)) {
        super(...args);
      } else {
        super(_abi$l, _bytecode$b, args[0]);
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
    static abi = _abi$l;
    static createInterface() {
      return new ethers.Interface(_abi$l);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$l, runner);
    }
  }

  var index$C = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ShortStrings__factory: ShortStrings__factory
  });

  const _abi$k = [
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
  const _bytecode$a = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea264697066735822122053ffac151f572fa8e7b3d2712f83100cb9732d1b89f25f4f202cbd72e3deba1764736f6c634300081e0033";
  const isSuperArgs$a = (xs) => xs.length > 1;
  class Strings__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$a(args)) {
        super(...args);
      } else {
        super(_abi$k, _bytecode$a, args[0]);
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
    static abi = _abi$k;
    static createInterface() {
      return new ethers.Interface(_abi$k);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$k, runner);
    }
  }

  var index$B = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Strings__factory: Strings__factory
  });

  const _abi$j = [
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
  const _bytecode$9 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220333e02e58e50c5a47b97e0b2808157ca882fbe172ceed10a85502fbde0f6c85c64736f6c634300081e0033";
  const isSuperArgs$9 = (xs) => xs.length > 1;
  class ECDSA__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$9(args)) {
        super(...args);
      } else {
        super(_abi$j, _bytecode$9, args[0]);
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
    static abi = _abi$j;
    static createInterface() {
      return new ethers.Interface(_abi$j);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$j, runner);
    }
  }

  var index$A = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ECDSA__factory: ECDSA__factory
  });

  const _abi$i = [
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
    static abi = _abi$i;
    static createInterface() {
      return new ethers.Interface(_abi$i);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$i, runner);
    }
  }

  var index$z = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EIP712__factory: EIP712__factory
  });

  var index$y = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ecdsaSol: index$A,
    eip712Sol: index$z
  });

  const _abi$h = [
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
    static abi = _abi$h;
    static createInterface() {
      return new ethers.Interface(_abi$h);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$h, runner);
    }
  }

  var index$x = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC165__factory: IERC165__factory
  });

  var index$w = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ierc165Sol: index$x
  });

  const _abi$g = [
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
  const _bytecode$8 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220a1b7831697d42dd291c07da94884db6b4d89bb944a88f99e59aa86ffc401393064736f6c634300081e0033";
  const isSuperArgs$8 = (xs) => xs.length > 1;
  class SafeCast__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$8(args)) {
        super(...args);
      } else {
        super(_abi$g, _bytecode$8, args[0]);
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
    static abi = _abi$g;
    static createInterface() {
      return new ethers.Interface(_abi$g);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$g, runner);
    }
  }

  var index$v = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SafeCast__factory: SafeCast__factory
  });

  var index$u = /*#__PURE__*/Object.freeze({
    __proto__: null,
    safeCastSol: index$v
  });

  var index$t = /*#__PURE__*/Object.freeze({
    __proto__: null,
    addressSol: index$F,
    cryptography: index$y,
    errorsSol: index$E,
    introspection: index$w,
    math: index$u,
    noncesSol: index$D,
    shortStringsSol: index$C,
    stringsSol: index$B
  });

  var index$s = /*#__PURE__*/Object.freeze({
    __proto__: null,
    access: index$10,
    interfaces: index$X,
    proxy: index$R,
    token: index$G,
    utils: index$t
  });

  const _abi$f = [
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
    static abi = _abi$f;
    static createInterface() {
      return new ethers.Interface(_abi$f);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$f, runner);
    }
  }

  var index$r = /*#__PURE__*/Object.freeze({
    __proto__: null,
    OwnableUpgradeable__factory: OwnableUpgradeable__factory
  });

  var index$q = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ownableUpgradeableSol: index$r
  });

  const _abi$e = [
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
    static abi = _abi$e;
    static createInterface() {
      return new ethers.Interface(_abi$e);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$e, runner);
    }
  }

  var index$p = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Initializable__factory: Initializable__factory
  });

  var index$o = /*#__PURE__*/Object.freeze({
    __proto__: null,
    initializableSol: index$p
  });

  var index$n = /*#__PURE__*/Object.freeze({
    __proto__: null,
    utils: index$o
  });

  const _abi$d = [
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
    static abi = _abi$d;
    static createInterface() {
      return new ethers.Interface(_abi$d);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$d, runner);
    }
  }

  var index$m = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ContextUpgradeable__factory: ContextUpgradeable__factory
  });

  const _abi$c = [
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
    static abi = _abi$c;
    static createInterface() {
      return new ethers.Interface(_abi$c);
    }
    static connect(address, runner) {
      return new ethers.Contract(
        address,
        _abi$c,
        runner
      );
    }
  }

  var index$l = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ReentrancyGuardUpgradeable__factory: ReentrancyGuardUpgradeable__factory
  });

  var index$k = /*#__PURE__*/Object.freeze({
    __proto__: null,
    contextUpgradeableSol: index$m,
    reentrancyGuardUpgradeableSol: index$l
  });

  var index$j = /*#__PURE__*/Object.freeze({
    __proto__: null,
    access: index$q,
    proxy: index$n,
    utils: index$k
  });

  var index$i = /*#__PURE__*/Object.freeze({
    __proto__: null,
    contracts: index$s,
    contractsUpgradeable: index$j
  });

  const _abi$b = [
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
  const _bytecode$7 = "0x60806040526008805464ffffffffff1916633201f40017905566470de4df820000600955662386f26fc10000600a55670de0b6b3a7640000600b55348015604557600080fd5b50613358806100556000396000f3fe608060405234801561001057600080fd5b50600436106102525760003560e01c806394002b5711610146578063c54e44eb116100c3578063dae2f99a11610087578063dae2f99a146105af578063e44a3169146105b8578063f2fde38b146105cb578063f4b89157146105de578063fc93d517146105f1578063feec756c1461060457600080fd5b8063c54e44eb1461050c578063c5d1bbc21461051f578063ca852afb14610576578063cbb6ae3e14610589578063d25f3d3c1461059c57600080fd5b8063b1da41fe1161010a578063b1da41fe146104ab578063b6fea5c8146104c0578063bbde3875146104d3578063c422f9d0146104e6578063c4d66de8146104f957600080fd5b806394002b5714610454578063986d7a69146104675780639af1d35a1461047a5780639eff02271461048f578063ad89bbb0146104a257600080fd5b80634b69c0d5116101d4578063715018a611610198578063715018a6146103cb57806374064a43146103d3578063778048a0146103fe57806389a30271146104115780638da5cb5b1461042457600080fd5b80634b69c0d51461035c5780634f863ea11461036f5780635dd871a31461038257806361b0402d146103a55780636bffc962146103b857600080fd5b806333138a841161021b57806333138a84146102cb5780633e032a3b146102d457806347082db3146102fa578063491e68e21461032f578063493f4f121461034957600080fd5b8062b105e61461025757806308e7a41e1461026c57806314d3940d1461027f57806316222b1914610292578063186cf2b9146102a5575b600080fd5b61026a610265366004612d7b565b610617565b005b61026a61027a366004612d96565b6106b9565b61026a61028d366004612d7b565b610787565b61026a6102a0366004612d96565b610820565b6102b86102b3366004612e38565b610926565b6040519081526020015b60405180910390f35b6102b860095481565b6008546102e790610100900461ffff1681565b60405161ffff90911681526020016102c2565b61031d610308366004612d7b565b60076020526000908152604090205460ff1681565b60405160ff90911681526020016102c2565b60085461033c9060ff1681565b6040516102c29190612e67565b61026a610357366004612e38565b610966565b61026a61036a366004612e9e565b6109a3565b61026a61037d366004612ec8565b6109fe565b610395610390366004612e38565b610a93565b60405190151581526020016102c2565b61026a6103b3366004612e38565b610cb4565b61026a6103c6366004612ee5565b610cf1565b61026a61106a565b6006546103e6906001600160a01b031681565b6040516001600160a01b0390911681526020016102c2565b61026a61040c366004612ee5565b61107e565b6004546103e6906001600160a01b031681565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03166103e6565b6002546103e6906001600160a01b031681565b61026a610475366004612f07565b611461565b6008546102e7906301000000900461ffff1681565b600c546103e6906001600160a01b031681565b6102b8600b5481565b6104b3611815565b6040516102c29190612f3a565b61026a6104ce366004612f86565b611826565b61026a6104e1366004612f07565b6119d0565b6005546103e6906001600160a01b031681565b61026a610507366004612d7b565b611d42565b6003546103e6906001600160a01b031681565b61053261052d366004612e38565b611e3e565b604080516001600160a01b0398891681529790961660208801529486019390935260608501919091526080840152151560a0830152151560c082015260e0016102c2565b61026a610584366004612e38565b611e9d565b610532610597366004612e38565b611eda565b6102b86105aa36600461300c565b611eea565b6102b8600a5481565b61026a6105c6366004613036565b612101565b61026a6105d9366004612d7b565b6121a0565b6102b86105ec36600461300c565b6121de565b61026a6105ff366004612ec8565b6123e1565b61026a610612366004612d7b565b612472565b61061f6124c8565b61062a600082612523565b61066d5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b610678600082612548565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b60008060006106fd85858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061255d92505050565b60025460405163d505accf60e01b815293965091945092506001600160a01b03169063d505accf9061073f90339030908d908c908a908a908a90600401613069565b600060405180830381600087803b15801561075957600080fd5b505af115801561076d573d6000803e3d6000fd5b5050505061077c8989896119d0565b505050505050505050565b61078f6124c8565b61079a600082612523565b156107db5760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610664565b6107e66000826125a7565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016106ae565b600080600061086485858080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061255d92505050565b60035492955090935091506000906001600160a01b038b8116911614610895576004546001600160a01b03166108a2565b6003546001600160a01b03165b60405163d505accf60e01b81529091506001600160a01b0382169063d505accf906108dd90339030908e908d908b908b908b90600401613069565b600060405180830381600087803b1580156108f757600080fd5b505af115801561090b573d6000803e3d6000fd5b5050505061091a8a8a8a611461565b50505050505050505050565b6000600b5482101561093a575050600a5490565b60085461271090610956906301000000900461ffff16846130c0565b61096091906130d7565b92915050565b61096e6124c8565b60098190556040518181527f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d647906020016106ae565b6109ab6124c8565b6008805482919060ff191660018360028111156109ca576109ca612e51565b02179055507ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1816040516106ae9190612e67565b610a066124c8565b6103e88160ff1610610a455760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b6044820152606401610664565b6008805464ffff000000191660ff831663010000008102919091179091556040519081527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc906020016106ae565b600080600260009054906101000a90046001600160a01b03166001600160a01b03166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ae9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b0d91906130f9565b90506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b64573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b889190613112565b90506000600660009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610bdf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c039190613112565b90506000610c11828461312f565b610c1c90600a61322f565b600660009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c6f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c9391906130f9565b610c9d91906130c0565b9050610ca9868561323e565b111595945050505050565b610cbc6124c8565b600b8190556040518181527f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545906020016106ae565b610cfe335b600090612523565b610d1a5760405162461bcd60e51b815260040161066490613251565b600e548210610d5b5760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b6044820152606401610664565b600e8281548110610d6e57610d6e613276565b906000526020600020906006020160050160019054906101000a900460ff1615610dcc5760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b6044820152606401610664565b6000600e8381548110610de157610de1613276565b90600052602060002090600602016002015490506000600e8481548110610e0a57610e0a613276565b906000526020600020906006020160030154831015905080610e6857610e63600e8581548110610e3c57610e3c613276565b60009182526020909120600690910201546002546001600160a01b039081169116846125bc565b610fa6565b82600e8581548110610e7c57610e7c613276565b9060005260206000209060060201600401819055506000600e8581548110610ea657610ea6613276565b600091825260208220600160069092020101546001600160a01b03169150610ecd84610926565b6002549091506001600160a01b03166342966c68610eeb838761328c565b6040518263ffffffff1660e01b8152600401610f0991815260200190565b600060405180830381600087803b158015610f2357600080fd5b505af1158015610f37573d6000803e3d6000fd5b5050600c54600254610f5893506001600160a01b03908116925016836125bc565b600c54600e8054610fa3926001600160a01b0316919089908110610f7e57610f7e613276565b60009182526020909120600690910201546001600160a01b038581169291168861261b565b50505b80600e8581548110610fba57610fba613276565b906000526020600020906006020160050160006101000a81548160ff0219169083151502179055506001600e8581548110610ff757610ff7613276565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550837f565ba89d889ea15e45400288c17db6816d132602d710eb66d0f3d9557c294816848360405161105c9291909182521515602082015260400190565b60405180910390a250505050565b6110726124c8565b61107c600061265a565b565b61108733610cf6565b6110a35760405162461bcd60e51b815260040161066490613251565b600d5482106110e45760405162461bcd60e51b815260206004820152600d60248201526c496e76616c6964206e6f6e636560981b6044820152606401610664565b600d82815481106110f7576110f7613276565b906000526020600020906006020160050160019054906101000a900460ff16156111555760405162461bcd60e51b815260206004820152600f60248201526e105b1c9958591e481cd95d1d1b1959608a1b6044820152606401610664565b6000600d838154811061116a5761116a613276565b906000526020600020906006020160030154821015801561118f575061118f82610a93565b90508061125257600080600d85815481106111ac576111ac613276565b906000526020600020906006020160010160009054906101000a90046001600160a01b0316600d86815481106111e4576111e4613276565b9060005260206000209060060201600201549150915061124b600c60009054906101000a90046001600160a01b0316600d878154811061122657611226613276565b60009182526020909120600690910201546001600160a01b038581169291168461261b565b505061139e565b81600d848154811061126657611266613276565b906000526020600020906006020160040181905550600061128683610926565b600254600c546040516340c10f1960e01b81526001600160a01b0391821660048201526024810184905292935016906340c10f1990604401600060405180830381600087803b1580156112d857600080fd5b505af11580156112ec573d6000803e3d6000fd5b5050600254600d80546001600160a01b0390921693506340c10f199250908790811061131a5761131a613276565b60009182526020909120600690910201546001600160a01b031661133e848761328c565b6040516001600160e01b031960e085901b1681526001600160a01b0390921660048301526024820152604401600060405180830381600087803b15801561138457600080fd5b505af1158015611398573d6000803e3d6000fd5b50505050505b80600d84815481106113b2576113b2613276565b906000526020600020906006020160050160006101000a81548160ff0219169083151502179055506001600d84815481106113ef576113ef613276565b906000526020600020906006020160050160016101000a81548160ff021916908315150217905550827f7bc692b63ac50deef5b78a403ab84227a3ba4c9400ece341f913ea1b0bcff2a383836040516114549291909182521515602082015260400190565b60405180910390a2505050565b6114696126cb565b600061147584846121de565b60085490915082906127109061149490610100900461ffff168261329f565b6114a29061ffff16846130c0565b6114ac91906130d7565b1180156114e95750600854612710906114ce90610100900461ffff16826132b9565b6114dc9061ffff16836130c0565b6114e691906130d7565b82115b6115235760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b6044820152606401610664565b6009548210156115635760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b6044820152606401610664565b60085460ff16600281111561157a5761157a612e51565b3360009081526007602052604090205460ff1610156115c85760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b6044820152606401610664565b6003546000906001600160a01b038681169116146115f1576004546001600160a01b03166115fe565b6003546001600160a01b03165b600c5490915061161d906001600160a01b03808416913391168761261b565b6040805160e081018252338082526001600160a01b03848116602084019081529383018881526060840188815260006080860181815260a0870182815260c08801838152600d8054600181810183559582905299516006909a027fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb5810180549b8a166001600160a01b03199c8d161790559a517fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb68c018054919099169a169990991790965593517fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb789015591517fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb888015590517fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb987015590517fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eba9095018054925115156101000261ff00199615159690961661ffff1990931692909217949094179055905490916117ad9161328c565b604080516001600160a01b0385168152602081018890529081018690527f69c44c537610b2d184f027357271fee6d9eb25ae2b4ccc21d6e56c7bec1841969060600160405180910390a35050611810600160008051602061330383398151915255565b505050565b60606118216000612717565b905090565b6000611830612724565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156118585750825b905060008267ffffffffffffffff1660011480156118755750303b155b905081158015611883575080155b156118a15760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156118cb57845460ff60401b1916600160401b1785555b6118d48661274d565b6118dc612767565b600280546001600160a01b03199081166001600160a01b038f8116919091179092556003805482168e84161790556004805482168d84161790556005805482168c84161790556006805482168b84161790556008805464ffffffff001916633201f40017905566470de4df820000600955662386f26fc10000600a55670de0b6b3a7640000600b55600c805490911691891691909117905561197c612777565b83156119c257845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050505050565b6119d86126cb565b60006119e48484611eea565b600854909150829061271090611a0390610100900461ffff168261329f565b611a119061ffff16846130c0565b611a1b91906130d7565b10158015611a59575060085461271090611a3e90610100900461ffff16826132b9565b611a4c9061ffff16836130c0565b611a5691906130d7565b82115b611a935760405162461bcd60e51b815260206004820152600b60248201526a155b99195c9c1c9a58d95960aa1b6044820152606401610664565b600954831015611ad35760405162461bcd60e51b815260206004820152600b60248201526a14db585b1b105b5bdd5b9d60aa1b6044820152606401610664565b60085460ff166002811115611aea57611aea612e51565b3360009081526007602052604090205460ff161015611b385760405162461bcd60e51b815260206004820152600a602482015269155b99195c9b195d995b60b21b6044820152606401610664565b600254611b50906001600160a01b031633308661261b565b6040805160e081018252338082526001600160a01b03878116602084019081529383018781526060840187815260006080860181815260a0870182815260c08801838152600e8054600181810183559582905299516006909a027fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd810180549b8a166001600160a01b03199c8d161790559a517fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fe8c018054919099169a169990991790965593517fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3ff89015591517fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c40088015590517fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c40187015590517fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c4029095018054925115156101000261ff00199615159690961661ffff199093169290921794909417905590549091611ce09161328c565b604080516001600160a01b0388168152602081018790529081018590527fafae12d8098a1b101657c8062a2634db5c9682923925dfbbd7bee9fb14dea6dc9060600160405180910390a350611810600160008051602061330383398151915255565b6000611d4c612724565b805490915060ff600160401b820416159067ffffffffffffffff16600081158015611d745750825b905060008267ffffffffffffffff166001148015611d915750303b155b905081158015611d9f575080155b15611dbd5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315611de757845460ff60401b1916600160401b1785555b611df08661274d565b8315611e3657845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b600e8181548110611e4e57600080fd5b60009182526020909120600690910201805460018201546002830154600384015460048501546005909501546001600160a01b0394851696509390921693909260ff8082169161010090041687565b611ea56124c8565b600a8190556040518181527f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f906020016106ae565b600d8181548110611e4e57600080fd5b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611f42573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611f6691906130f9565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015611fb9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611fdd9190613112565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015612036573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061205a9190613112565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561209c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906120c09190613112565b9050806120cd83856132d3565b6120d7919061312f565b6120e290600a61322f565b6120ec85886130c0565b6120f691906130d7565b979650505050505050565b61210a33610cf6565b6121265760405162461bcd60e51b815260040161066490613251565b80600281111561213857612138612e51565b6001600160a01b03831660008181526007602052604090819020805460ff191660ff949094169390931790925590517facee830aed55effdcd51d2550a784305c145560f19aaa8f7e02c076e4e15e28490612194908490612e67565b60405180910390a25050565b6121a86124c8565b6001600160a01b0381166121d257604051631e4fbdf760e01b815260006004820152602401610664565b6121db8161265a565b50565b6000806000600560009054906101000a90046001600160a01b03166001600160a01b03166350d25bcd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015612236573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061225a91906130f9565b600560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156122ad573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906122d19190613112565b915091506000600260009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561232a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061234e9190613112565b90506000866001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015612390573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123b49190613112565b905083816123c284866132d3565b6123cc919061312f565b6123d790600a61322f565b6120ec90886130c0565b6123e96124c8565b6103e88160ff16106124285760405162461bcd60e51b81526020600482015260086024820152674f564552464c4f5760c01b6044820152606401610664565b6008805462ffff00191660ff83166101008102919091179091556040519081527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f906020016106ae565b61247a6124c8565b600c80546001600160a01b0319166001600160a01b0383169081179091556040519081527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de906020016106ae565b336124fa7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b03161461107c5760405163118cdaa760e01b8152336004820152602401610664565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000612541836001600160a01b038416612af0565b600080600083516041036125875750505060208101516040820151606083015160001a91906125a0565b604051634be6321b60e01b815260040160405180910390fd5b9193909250565b6000612541836001600160a01b038416612be3565b6040516001600160a01b0383811660248301526044820183905261181091859182169063a9059cbb906064015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050612c32565b6040516001600160a01b0384811660248301528381166044830152606482018390526126549186918216906323b872dd906084016125e9565b50505050565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b6000805160206133038339815191528054600119016126fd57604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b600160008051602061330383398151915255565b6060600061254183612ca3565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610960565b6001600160a01b03811661275e5750335b6107db81612cff565b61276f612d10565b61107c612d35565b60085460405161010090910461ffff1681527f561cb38ccdb3d77bd8befae4d2acb1055ec8e5aed8a49ba9725754310b52650f9060200160405180910390a1600854604051630100000090910461ffff1681527f0e0620d0d7c6ab0fd4ceb44a51188b8687603abffb0b5f4fd545c7b1651ffedc9060200160405180910390a17f3bb3914a552b684e79c3a89fd2170bebf1701d7ae5ec2eaf68d5b1879e32d64760095460405161282a91815260200190565b60405180910390a17f8dada1cf336a746a27adb21b4bc2a9925382b578ec668e1ed05d79fb3198de8f600a5460405161286591815260200190565b60405180910390a17f344fc794e286be40a05fe3e034a7ae3971ef147aa05abca6d19b9ecea71f9545600b546040516128a091815260200190565b60405180910390a16008546040517ff054a19585a0477b2acc9e8a0305be61ee7e708a3e5e10bae7cf6816cefb61b1916128df9160ff90911690612e67565b60405180910390a1600c546040516001600160a01b0390911681527fc2014e920b7997caf84bdbe9af16ae22a197f2569d6da5087765e6593ae105de9060200160405180910390a16002546040805163313ce56760e01b815290517f60ca852ff1baba03007bc4713a71dae297c308708cf17c690276b3daed7ab76e926001600160a01b031691829163313ce567916004808201926020929091908290030181865afa158015612993573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906129b79190613112565b6003546040805163313ce56760e01b815290516001600160a01b0390921691829163313ce5679160048083019260209291908290030181865afa158015612a02573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a269190613112565b600480546040805163313ce56760e01b815290516001600160a01b0390921692839263313ce5679280830192602092918290030181865afa158015612a6f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a939190613112565b600554600654604080516001600160a01b03998a16815260ff9889166020820152968916908701529386166060860152918616608085015290931660a083015291831660c0820152911660e08201526101000160405180910390a1565b60008181526001830160205260408120548015612bd9576000612b1460018361328c565b8554909150600090612b289060019061328c565b9050808214612b8d576000866000018281548110612b4857612b48613276565b9060005260206000200154905080876000018481548110612b6b57612b6b613276565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612b9e57612b9e6132ec565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610960565b6000915050610960565b6000818152600183016020526040812054612c2a57508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610960565b506000610960565b600080602060008451602086016000885af180612c55576040513d6000823e3d81fd5b50506000513d91508115612c6d578060011415612c7a565b6001600160a01b0384163b155b1561265457604051635274afe760e01b81526001600160a01b0385166004820152602401610664565b606081600001805480602002602001604051908101604052809291908181526020018280548015612cf357602002820191906000526020600020905b815481526020019060010190808311612cdf575b50505050509050919050565b612d07612d10565b6121db81612d3d565b612d18612d45565b61107c57604051631afcd79f60e31b815260040160405180910390fd5b612703612d10565b6121a8612d10565b6000612d4f612724565b54600160401b900460ff16919050565b80356001600160a01b0381168114612d7657600080fd5b919050565b600060208284031215612d8d57600080fd5b61254182612d5f565b60008060008060008060a08789031215612daf57600080fd5b612db887612d5f565b9550602087013594506040870135935060608701359250608087013567ffffffffffffffff811115612de957600080fd5b8701601f81018913612dfa57600080fd5b803567ffffffffffffffff811115612e1157600080fd5b896020828401011115612e2357600080fd5b60208201935080925050509295509295509295565b600060208284031215612e4a57600080fd5b5035919050565b634e487b7160e01b600052602160045260246000fd5b6020810160038310612e8957634e487b7160e01b600052602160045260246000fd5b91905290565b803560038110612d7657600080fd5b600060208284031215612eb057600080fd5b61254182612e8f565b60ff811681146121db57600080fd5b600060208284031215612eda57600080fd5b813561254181612eb9565b60008060408385031215612ef857600080fd5b50508035926020909101359150565b600080600060608486031215612f1c57600080fd5b612f2584612d5f565b95602085013595506040909401359392505050565b602080825282518282018190526000918401906040840190835b81811015612f7b5783516001600160a01b0316835260209384019390920191600101612f54565b509095945050505050565b600080600080600080600060e0888a031215612fa157600080fd5b612faa88612d5f565b9650612fb860208901612d5f565b9550612fc660408901612d5f565b9450612fd460608901612d5f565b9350612fe260808901612d5f565b9250612ff060a08901612d5f565b9150612ffe60c08901612d5f565b905092959891949750929550565b6000806040838503121561301f57600080fd5b61302883612d5f565b946020939093013593505050565b6000806040838503121561304957600080fd5b61305283612d5f565b915061306060208401612e8f565b90509250929050565b6001600160a01b0397881681529590961660208601526040850193909352606084019190915260ff16608083015260a082015260c081019190915260e00190565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610960576109606130aa565b6000826130f457634e487b7160e01b600052601260045260246000fd5b500490565b60006020828403121561310b57600080fd5b5051919050565b60006020828403121561312457600080fd5b815161254181612eb9565b60ff8281168282160390811115610960576109606130aa565b6001815b600184111561318357808504811115613167576131676130aa565b600184161561317557908102905b60019390931c92800261314c565b935093915050565b60008261319a57506001610960565b816131a757506000610960565b81600181146131bd57600281146131c7576131e3565b6001915050610960565b60ff8411156131d8576131d86130aa565b50506001821b610960565b5060208310610133831016604e8410600b8410161715613206575081810a610960565b6132136000198484613148565b8060001904821115613227576132276130aa565b029392505050565b600061254160ff84168361318b565b80820180821115610960576109606130aa565b6020808252600b908201526a2727aa2fa9a2aa2a2622a960a91b604082015260600190565b634e487b7160e01b600052603260045260246000fd5b81810381811115610960576109606130aa565b61ffff8181168382160190811115610960576109606130aa565b61ffff8281168282160390811115610960576109606130aa565b60ff8181168382160190811115610960576109606130aa565b634e487b7160e01b600052603160045260246000fdfe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a264697066735822122000a38db5bf82c3462fda7586534fd00a570cc5e49436d6f338340a51237903ff64736f6c634300081e0033";
  const isSuperArgs$7 = (xs) => xs.length > 1;
  class GoldMinter__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$7(args)) {
        super(...args);
      } else {
        super(_abi$b, _bytecode$7, args[0]);
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
    static abi = _abi$b;
    static createInterface() {
      return new ethers.Interface(_abi$b);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$b, runner);
    }
  }

  var index$h = /*#__PURE__*/Object.freeze({
    __proto__: null,
    GoldMinter__factory: GoldMinter__factory
  });

  const _abi$a = [
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
  const _bytecode$6 = "0x60806040526040516102a03803806102a08339810160408190526020916097565b804210607e5760405162461bcd60e51b815260206004820152602360248201527f556e6c6f636b2074696d652073686f756c6420626520696e207468652066757460448201526275726560e81b606482015260840160405180910390fd5b600055600180546001600160a01b0319163317905560af565b60006020828403121560a857600080fd5b5051919050565b6101e2806100be6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063251c1aa3146100465780633ccfd60b146100625780638da5cb5b1461006c575b600080fd5b61004f60005481565b6040519081526020015b60405180910390f35b61006a610097565b005b60015461007f906001600160a01b031681565b6040516001600160a01b039091168152602001610059565b6000544210156100e75760405162461bcd60e51b8152602060048201526016602482015275165bdd4818d85b89dd081dda5d1a191c985dc81e595d60521b60448201526064015b60405180910390fd5b6001546001600160a01b031633146101385760405162461bcd60e51b81526020600482015260146024820152732cb7ba9030b932b713ba103a34329037bbb732b960611b60448201526064016100de565b604080514781524260208201527fbf2ed60bd5b5965d685680c01195c9514e4382e28e3a5a2d2d5244bf59411b93910160405180910390a16001546040516001600160a01b03909116904780156108fc02916000818181858888f193505050501580156101a9573d6000803e3d6000fd5b5056fea2646970667358221220c95acb221631d0674a4b2e409a3e0d2de63f9e77fca4726e9a812898ec4c227864736f6c634300081e0033";
  const isSuperArgs$6 = (xs) => xs.length > 1;
  class Lock__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$6(args)) {
        super(...args);
      } else {
        super(_abi$a, _bytecode$6, args[0]);
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
    static bytecode = _bytecode$6;
    static abi = _abi$a;
    static createInterface() {
      return new ethers.Interface(_abi$a);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$a, runner);
    }
  }

  var index$g = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Lock__factory: Lock__factory
  });

  const _abi$9 = [
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
    static abi = _abi$9;
    static createInterface() {
      return new ethers.Interface(_abi$9);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$9, runner);
    }
  }

  const _abi$8 = [
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
    static abi = _abi$8;
    static createInterface() {
      return new ethers.Interface(_abi$8);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$8, runner);
    }
  }

  var index$f = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IERC20Exp__factory: IERC20Exp__factory,
    IERC20Mintable__factory: IERC20Mintable__factory
  });

  const _abi$7 = [
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
    static abi = _abi$7;
    static createInterface() {
      return new ethers.Interface(_abi$7);
    }
    static connect(address, runner) {
      return new ethers.Contract(
        address,
        _abi$7,
        runner
      );
    }
  }

  var index$e = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IInitializableProxy__factory: IInitializableProxy__factory
  });

  const _abi$6 = [
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
    static abi = _abi$6;
    static createInterface() {
      return new ethers.Interface(_abi$6);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$6, runner);
    }
  }

  var index$d = /*#__PURE__*/Object.freeze({
    __proto__: null,
    IPriceFeed__factory: IPriceFeed__factory
  });

  var index$c = /*#__PURE__*/Object.freeze({
    __proto__: null,
    iInitializableProxySol: index$e,
    iPriceFeedSol: index$d,
    ierc20Sol: index$f
  });

  const _abi$5 = [
    {
      inputs: [],
      name: "InvalidSignatureLength",
      type: "error"
    }
  ];
  const _bytecode$5 = "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220574b61ff6c3c70fe6a552a86b72b2b673ff6c32d7b77aaada3df8adc2fbf03b164736f6c634300081e0033";
  const isSuperArgs$5 = (xs) => xs.length > 1;
  class SigLib__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$5(args)) {
        super(...args);
      } else {
        super(_abi$5, _bytecode$5, args[0]);
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
    static abi = _abi$5;
    static createInterface() {
      return new ethers.Interface(_abi$5);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$5, runner);
    }
  }

  var index$b = /*#__PURE__*/Object.freeze({
    __proto__: null,
    SigLib__factory: SigLib__factory
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
  const _bytecode$4 = "0x6080604052348015600f57600080fd5b506108278061001f6000396000f3fe608060405234801561001057600080fd5b506004361061007c5760003560e01c80638da5cb5b1161005b5780638da5cb5b146100b1578063b1da41fe146100f0578063c4d66de814610105578063f2fde38b1461011857600080fd5b8062b105e61461008157806314d3940d14610096578063715018a6146100a9575b600080fd5b61009461008f36600461072f565b61012b565b005b6100946100a436600461072f565b6101cd565b610094610266565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b0390911681526020015b60405180910390f35b6100f861027a565b6040516100e79190610758565b61009461011336600461072f565b61028b565b61009461012636600461072f565b610387565b6101336103c5565b61013e600082610420565b6101815760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61018c600082610447565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6101d56103c5565b6101e0600082610420565b156102215760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610178565b61022c60008261045c565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e906020016101c2565b61026e6103c5565b6102786000610471565b565b606061028660006104e2565b905090565b60006102956104f6565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156102bd5750825b905060008267ffffffffffffffff1660011480156102da5750303b155b9050811580156102e8575080155b156103065760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561033057845460ff60401b1916600160401b1785555b6103398661051f565b831561037f57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b61038f6103c5565b6001600160a01b0381166103b957604051631e4fbdf760e01b815260006004820152602401610178565b6103c281610471565b50565b336103f77f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146102785760405163118cdaa760e01b8152336004820152602401610178565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b600061043e836001600160a01b038416610539565b600061043e836001600160a01b03841661062c565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b606060006104ef8361067b565b9392505050565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00610441565b6001600160a01b0381166105305750335b610221816106d7565b6000818152600183016020526040812054801561062257600061055d6001836107a4565b8554909150600090610571906001906107a4565b90508082146105d6576000866000018281548110610591576105916107c5565b90600052602060002001549050808760000184815481106105b4576105b46107c5565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806105e7576105e76107db565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610441565b6000915050610441565b600081815260018301602052604081205461067357508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610441565b506000610441565b6060816000018054806020026020016040519081016040528092919081815260200182805480156106cb57602002820191906000526020600020905b8154815260200190600101908083116106b7575b50505050509050919050565b6106df6106e8565b6103c28161070d565b6106f0610715565b61027857604051631afcd79f60e31b815260040160405180910390fd5b61038f6106e8565b600061071f6104f6565b54600160401b900460ff16919050565b60006020828403121561074157600080fd5b81356001600160a01b03811681146104ef57600080fd5b602080825282518282018190526000918401906040840190835b818110156107995783516001600160a01b0316835260209384019390920191600101610772565b509095945050505050565b8181038181111561044157634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220a89b4eefa008f24f9b171e1f846ef1208ba245620d96ac009dd3ef73b034717d64736f6c634300081e0033";
  const isSuperArgs$4 = (xs) => xs.length > 1;
  class WithSettler__factory extends ethers.ContractFactory {
    constructor(...args) {
      if (isSuperArgs$4(args)) {
        super(...args);
      } else {
        super(_abi$4, _bytecode$4, args[0]);
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
    static abi = _abi$4;
    static createInterface() {
      return new ethers.Interface(_abi$4);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$4, runner);
    }
  }

  var index$a = /*#__PURE__*/Object.freeze({
    __proto__: null,
    WithSettler__factory: WithSettler__factory
  });

  var index$9 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sigLibSol: index$b,
    withSettlerSol: index$a
  });

  const _abi$3 = [
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
  const _bytecode$3 = "0x60a060405260086080526006600455348015601957600080fd5b5060805161114061003560003960006101a401526111406000f3fe608060405234801561001057600080fd5b50600436106101725760003560e01c80638da5cb5b116100de578063b5ab58dc11610097578063c4d66de811610071578063c4d66de814610398578063d0d552dd146103ab578063f2fde38b146103be578063feaf968c146103d157600080fd5b8063b5ab58dc1461034f578063b633620c1461036f578063bfc12c051461038f57600080fd5b80638da5cb5b1461028a57806390c3f38f146102ba5780639a24a180146102cd5780639a6fc8f5146102e0578063a87a20ce14610327578063b1da41fe1461033a57600080fd5b806350d25bcd1161013057806350d25bcd1461024957806354fd4d5014610252578063668a0f021461025b578063715018a6146102645780637284e4161461026c5780638205bf6a1461028157600080fd5b8062b105e61461017757806314d3940d1461018c578063313ce5671461019f57806338d52e0f146101dd5780633b2235fc14610208578063408def1e14610236575b600080fd5b61018a610185366004610d33565b6103d9565b005b61018a61019a366004610d33565b61047b565b6101c67f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff90911681526020015b60405180910390f35b6002546101f0906001600160a01b031681565b6040516001600160a01b0390911681526020016101d4565b610228610216366004610d4e565b600b6020526000908152604090205481565b6040519081526020016101d4565b61018a610244366004610d4e565b610514565b61022860065481565b61022860045481565b61022860085481565b61018a610521565b610274610535565b6040516101d49190610d67565b61022860075481565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03166101f0565b61018a6102c8366004610e5a565b6105c3565b61018a6102db366004610e97565b610607565b6102f36102ee366004610ee5565b610644565b604080516001600160501b03968716815260208101959095528401929092526060830152909116608082015260a0016101d4565b61018a610335366004610d4e565b6106c2565b610342610723565b6040516101d49190610f0e565b61022861035d366004610d4e565b60096020526000908152604090205481565b61022861037d366004610d4e565b600a6020526000908152604090205481565b61022860055481565b61018a6103a6366004610d33565b610734565b61018a6103b9366004610d33565b610830565b61018a6103cc366004610d33565b610882565b6102f36108bd565b6103e16108e1565b6103ec60008261093c565b61042f5760405162461bcd60e51b815260206004820152600f60248201526e24a72b20a624a22fa9a2aa2a2622a960891b60448201526064015b60405180910390fd5b61043a600082610963565b506040516001600160a01b03821681527fc75b24622d5a8552bcfe775a11d9009ac47d4c050a3af79686aebe33f902fc03906020015b60405180910390a150565b6104836108e1565b61048e60008261093c565b156104cf5760405162461bcd60e51b8152602060048201526011602482015270222aa82624a1a0aa22afa9a2aa2a2622a960791b6044820152606401610426565b6104da600082610978565b506040516001600160a01b03821681527f0e8d4de8d62b8ad5b1837a4a13009121b82a40e3bdcd6e6f454a72418cc86b0e90602001610470565b61051c6108e1565b600455565b6105296108e1565b610533600061098d565b565b6003805461054290610f5a565b80601f016020809104026020016040519081016040528092919081815260200182805461056e90610f5a565b80156105bb5780601f10610590576101008083540402835291602001916105bb565b820191906000526020600020905b81548152906001019060200180831161059e57829003601f168201915b505050505081565b6105cb6108e1565b60036105d78282610fe3565b507f16fbb51445345dabaa215e5f99a4bd4d8ba9818b508c76d5cd0ea30abcc491c6816040516104709190610d67565b61060f6108e1565b60055460000361061e57426005555b60045460000361062e5760066004555b61063782610830565b610640816105c3565b5050565b6001600160501b0381166000818152600960205260408120548392909190819081906106725760055461069a565b600a600061068a60016001600160501b038a166110b8565b8152602001908152602001600020545b6001600160501b0387166000908152600a602052604090205495979496909594909350915050565b6106cd60003361093c565b6107075760405162461bcd60e51b815260206004820152600b60248201526a2727aa2fa9a2aa2a2622a960a91b6044820152606401610426565b61072081600854600161071a91906110cb565b426109fe565b50565b606061072f6000610aca565b905090565b600061073e610ade565b805490915060ff600160401b820416159067ffffffffffffffff166000811580156107665750825b905060008267ffffffffffffffff1660011480156107835750303b155b905081158015610791575080155b156107af5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156107d957845460ff60401b1916600160401b1785555b6107e286610b07565b831561082857845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050565b6108386108e1565b600280546001600160a01b0319166001600160a01b0383169081179091556040517fc7d9598af6004de7fa9c489a50a55414c75cfbce9fe56fe46956970744d6bc2c90600090a250565b61088a6108e1565b6001600160a01b0381166108b457604051631e4fbdf760e01b815260006004820152602401610426565b6107208161098d565b60008060008060006108d0600854610644565b945094509450945094509091929394565b336109137f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146105335760405163118cdaa760e01b8152336004820152602401610426565b6001600160a01b038116600090815260018301602052604081205415155b90505b92915050565b600061095a836001600160a01b038416610b21565b600061095a836001600160a01b038416610c14565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b8060075410610a0c57505050565b6006839055600781905560088290556000828152600a6020908152604080832080546009845282852088905590859055848452600b909252909120849055151580610a8957604051828152339084907f0109fc6f55cf40689f02fbaad7af7fe7bbac8a3d2186600afc7d3e10cac602719060200160405180910390a35b82847f0559884fd3a460db3073b7fc896cc77986f16e378210ded43186175bf646fc5f84604051610abc91815260200190565b60405180910390a350505050565b60606000610ad783610c63565b9392505050565b6000807ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0061095d565b6001600160a01b038116610b185750335b6104cf81610cbf565b60008181526001830160205260408120548015610c0a576000610b456001836110b8565b8554909150600090610b59906001906110b8565b9050808214610bbe576000866000018281548110610b7957610b796110de565b9060005260206000200154905080876000018481548110610b9c57610b9c6110de565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610bcf57610bcf6110f4565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061095d565b600091505061095d565b6000818152600183016020526040812054610c5b5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561095d565b50600061095d565b606081600001805480602002602001604051908101604052809291908181526020018280548015610cb357602002820191906000526020600020905b815481526020019060010190808311610c9f575b50505050509050919050565b610cc7610cd0565b61072081610cf5565b610cd8610cfd565b61053357604051631afcd79f60e31b815260040160405180910390fd5b61088a610cd0565b6000610d07610ade565b54600160401b900460ff16919050565b80356001600160a01b0381168114610d2e57600080fd5b919050565b600060208284031215610d4557600080fd5b61095a82610d17565b600060208284031215610d6057600080fd5b5035919050565b602081526000825180602084015260005b81811015610d955760208186018101516040868401015201610d78565b506000604082850101526040601f19601f83011684010191505092915050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112610ddc57600080fd5b813567ffffffffffffffff811115610df657610df6610db5565b604051601f8201601f19908116603f0116810167ffffffffffffffff81118282101715610e2557610e25610db5565b604052818152838201602001851015610e3d57600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215610e6c57600080fd5b813567ffffffffffffffff811115610e8357600080fd5b610e8f84828501610dcb565b949350505050565b60008060408385031215610eaa57600080fd5b610eb383610d17565b9150602083013567ffffffffffffffff811115610ecf57600080fd5b610edb85828601610dcb565b9150509250929050565b600060208284031215610ef757600080fd5b81356001600160501b0381168114610ad757600080fd5b602080825282518282018190526000918401906040840190835b81811015610f4f5783516001600160a01b0316835260209384019390920191600101610f28565b509095945050505050565b600181811c90821680610f6e57607f821691505b602082108103610f8e57634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115610fde57806000526020600020601f840160051c81016020851015610fbb5750805b601f840160051c820191505b81811015610fdb5760008155600101610fc7565b50505b505050565b815167ffffffffffffffff811115610ffd57610ffd610db5565b6110118161100b8454610f5a565b84610f94565b6020601f821160018114611045576000831561102d5750848201515b600019600385901b1c1916600184901b178455610fdb565b600084815260208120601f198516915b828110156110755787850151825560209485019460019092019101611055565b50848210156110935786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b8181038181111561095d5761095d6110a2565b8082018082111561095d5761095d6110a2565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fdfea2646970667358221220a8dd9a5f98c09766d61b5a93450fd68c8d0d6aa3bc990f67a1a0fd169a5b69d364736f6c634300081e0033";
  const isSuperArgs$3 = (xs) => xs.length > 1;
  class DataFeed__factory extends ethers.ContractFactory {
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
      return new ethers.Interface(_abi$3);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$3, runner);
    }
  }

  var index$8 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DataFeed__factory: DataFeed__factory
  });

  var index$7 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dataFeedSol: index$8
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
  const _bytecode$2 = "0x6080604052348015600f57600080fd5b506106f18061001f6000396000f3fe60806040526004361061004e5760003560e01c80634f1ef286146100655780635c60da1b146100785780638f283970146100a9578063dce95104146100c9578063f851a440146100dc5761005d565b3661005d5761005b6100f1565b005b61005b6100f1565b61005b6100733660046105be565b610103565b34801561008457600080fd5b5061008d61016a565b6040516001600160a01b03909116815260200160405180910390f35b3480156100b557600080fd5b5061005b6100c436600461060c565b610179565b61005b6100d736600461062e565b6101d9565b3480156100e857600080fd5b5061008d610263565b6101016100fc61026d565b610277565b565b61010b61029b565b6001600160a01b0316336001600160a01b03161461015c5760405162461bcd60e51b81526020600482015260096024820152682727aa2fa0a226a4a760b91b60448201526064015b60405180910390fd5b61016682826102a5565b5050565b600061017461026d565b905090565b61018161029b565b6001600160a01b0316336001600160a01b0316146101cd5760405162461bcd60e51b81526020600482015260096024820152682727aa2fa0a226a4a760b91b6044820152606401610153565b6101d681610364565b50565b60006101e361026d565b6001600160a01b0316148015610209575060006101fe61029b565b6001600160a01b0316145b61024b5760405162461bcd60e51b81526020600482015260136024820152721053149150511657d253925512505312569151606a1b6044820152606401610153565b61025483610364565b61025e82826102a5565b505050565b600061017461029b565b60006101746103b8565b3660008037600080366000845af43d6000803e808015610296573d6000f35b3d6000fd5b60006101746103eb565b6102ae82610413565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561035c57600080836001600160a01b031683604051610304919061068c565b600060405180830381855af49150503d806000811461033f576040519150601f19603f3d011682016040523d82523d6000602084013e610344565b606091505b50915091508161035657805181602001fd5b50505050565b61016661048d565b7f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f61038d6103eb565b604080516001600160a01b03928316815291841660208301520160405180910390a16101d6816104ac565b60007f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b546001600160a01b0316919050565b60007fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61036103dc565b806001600160a01b03163b60000361044957604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610153565b807f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5b80546001600160a01b0319166001600160a01b039290921691909117905550565b34156101015760405163b398979f60e01b815260040160405180910390fd5b6001600160a01b0381166104d657604051633173bdd160e11b815260006004820152602401610153565b807fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d610361046c565b80356001600160a01b038116811461051457600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261054057600080fd5b813567ffffffffffffffff81111561055a5761055a610519565b604051601f8201601f19908116603f0116810167ffffffffffffffff8111828210171561058957610589610519565b6040528181528382016020018510156105a157600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156105d157600080fd5b6105da836104fd565b9150602083013567ffffffffffffffff8111156105f657600080fd5b6106028582860161052f565b9150509250929050565b60006020828403121561061e57600080fd5b610627826104fd565b9392505050565b60008060006060848603121561064357600080fd5b61064c846104fd565b925061065a602085016104fd565b9150604084013567ffffffffffffffff81111561067657600080fd5b6106828682870161052f565b9150509250925092565b6000825160005b818110156106ad5760208186018101518583015201610693565b50600092019182525091905056fea2646970667358221220d37e48c85bce8a403c7bb23ddf9aa957fd557fe6623241763a8dd2bcc6436f2b64736f6c634300081e0033";
  const isSuperArgs$2 = (xs) => xs.length > 1;
  class InitializableProxy__factory extends ethers.ContractFactory {
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
      return new ethers.Interface(_abi$2);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$2, runner);
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
  const _bytecode$1 = "0x61018060405234801561001157600080fd5b506040516118a63803806118a68339810160408190526100309161045f565b338480604051806040016040528060018152602001603160f81b8152508787816003908161005e9190610571565b50600461006b8282610571565b5061007b91508390506005610175565b6101205261008a816006610175565b61014052815160208084019190912060e052815190820120610100524660a05261011760e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506001600160a01b03811661015057604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b610159816101a8565b5060ff82166101605261016c33826101fa565b505050506106a7565b60006020835110156101915761018a83610234565b90506101a2565b8161019c8482610571565b5060ff90505b92915050565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6001600160a01b0382166102245760405163ec442f0560e01b815260006004820152602401610147565b61023060008383610272565b5050565b600080829050601f8151111561025f578260405163305a27a960e01b8152600401610147919061062f565b805161026a82610662565b179392505050565b6001600160a01b03831661029d5780600260008282546102929190610686565b9091555061030f9050565b6001600160a01b038316600090815260208190526040902054818110156102f05760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610147565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b03821661032b5760028054829003905561034a565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161038f91815260200190565b60405180910390a3505050565b634e487b7160e01b600052604160045260246000fd5b60005b838110156103cd5781810151838201526020016103b5565b50506000910152565b600082601f8301126103e757600080fd5b81516001600160401b038111156104005761040061039c565b604051601f8201601f19908116603f011681016001600160401b038111828210171561042e5761042e61039c565b60405281815283820160200185101561044657600080fd5b6104578260208301602087016103b2565b949350505050565b6000806000806080858703121561047557600080fd5b84516001600160401b0381111561048b57600080fd5b610497878288016103d6565b602087015190955090506001600160401b038111156104b557600080fd5b6104c1878288016103d6565b935050604085015160ff811681146104d857600080fd5b6060959095015193969295505050565b600181811c908216806104fc57607f821691505b60208210810361051c57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561056c57806000526020600020601f840160051c810160208510156105495750805b601f840160051c820191505b818110156105695760008155600101610555565b50505b505050565b81516001600160401b0381111561058a5761058a61039c565b61059e8161059884546104e8565b84610522565b6020601f8211600181146105d257600083156105ba5750848201515b600019600385901b1c1916600184901b178455610569565b600084815260208120601f198516915b8281101561060257878501518255602094850194600190920191016105e2565b50848210156106205786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b602081526000825180602084015261064e8160408501602087016103b2565b601f01601f19169190910160400192915050565b8051602080830151919081101561051c5760001960209190910360031b1b16919050565b808201808211156101a257634e487b7160e01b600052601160045260246000fd5b60805160a05160c05160e0516101005161012051610140516101605161119a61070c600039600061019e015260006109840152600061095701526000610814015260006107ec01526000610747015260006107710152600061079b015261119a6000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c806379cc6790116100ad578063a0712d6811610071578063a0712d681461028d578063a9059cbb146102a0578063d505accf146102b3578063dd62ed3e146102c6578063f2fde38b146102ff57600080fd5b806379cc6790146102295780637ecebe001461023c57806384b0196e1461024f5780638da5cb5b1461026a57806395d89b411461028557600080fd5b80633644e515116100f45780633644e515146101c857806340c10f19146101d057806342966c68146101e557806370a08231146101f8578063715018a61461022157600080fd5b806306fdde0314610131578063095ea7b31461014f57806318160ddd1461017257806323b872dd14610184578063313ce56714610197575b600080fd5b610139610312565b6040516101469190610ee4565b60405180910390f35b61016261015d366004610f1a565b6103a4565b6040519015158152602001610146565b6002545b604051908152602001610146565b610162610192366004610f44565b6103be565b60405160ff7f0000000000000000000000000000000000000000000000000000000000000000168152602001610146565b6101766103e2565b6101e36101de366004610f1a565b6103f1565b005b6101e36101f3366004610f81565b610407565b610176610206366004610f9a565b6001600160a01b031660009081526020819052604090205490565b6101e3610414565b6101e3610237366004610f1a565b610428565b61017661024a366004610f9a565b61043d565b61025761045b565b6040516101469796959493929190610fb5565b6008546040516001600160a01b039091168152602001610146565b6101396104a1565b6101e361029b366004610f81565b6104b0565b6101626102ae366004610f1a565b6104c2565b6101e36102c136600461104d565b6104d0565b6101766102d43660046110c0565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101e361030d366004610f9a565b61060f565b606060038054610321906110f3565b80601f016020809104026020016040519081016040528092919081815260200182805461034d906110f3565b801561039a5780601f1061036f5761010080835404028352916020019161039a565b820191906000526020600020905b81548152906001019060200180831161037d57829003601f168201915b5050505050905090565b6000336103b281858561064a565b60019150505b92915050565b6000336103cc85828561065c565b6103d78585856106db565b506001949350505050565b60006103ec61073a565b905090565b6103f9610865565b6104038282610892565b5050565b61041133826108c8565b50565b61041c610865565b61042660006108fe565b565b61043382338361065c565b61040382826108c8565b6001600160a01b0381166000908152600760205260408120546103b8565b60006060806000806000606061046f610950565b61047761097d565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b606060048054610321906110f3565b6104b8610865565b6104113382610892565b6000336103b28185856106db565b834211156104f95760405163313c898160e11b8152600481018590526024015b60405180910390fd5b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c98888886105468c6001600160a01b0316600090815260076020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e00160405160208183030381529060405280519060200120905060006105a1826109aa565b905060006105b1828787876109d7565b9050896001600160a01b0316816001600160a01b0316146105f8576040516325c0072360e11b81526001600160a01b0380831660048301528b1660248201526044016104f0565b6106038a8a8a61064a565b50505050505050505050565b610617610865565b6001600160a01b03811661064157604051631e4fbdf760e01b8152600060048201526024016104f0565b610411816108fe565b6106578383836001610a05565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198110156106d557818110156106c657604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064016104f0565b6106d584848484036000610a05565b50505050565b6001600160a01b03831661070557604051634b637e8f60e11b8152600060048201526024016104f0565b6001600160a01b03821661072f5760405163ec442f0560e01b8152600060048201526024016104f0565b610657838383610ada565b6000306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614801561079357507f000000000000000000000000000000000000000000000000000000000000000046145b156107bd57507f000000000000000000000000000000000000000000000000000000000000000090565b6103ec604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6008546001600160a01b031633146104265760405163118cdaa760e01b81523360048201526024016104f0565b6001600160a01b0382166108bc5760405163ec442f0560e01b8152600060048201526024016104f0565b61040360008383610ada565b6001600160a01b0382166108f257604051634b637e8f60e11b8152600060048201526024016104f0565b61040382600083610ada565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006005610c04565b60606103ec7f00000000000000000000000000000000000000000000000000000000000000006006610c04565b60006103b86109b761073a565b8360405161190160f01b8152600281019290925260228201526042902090565b6000806000806109e988888888610caf565b9250925092506109f98282610d7e565b50909695505050505050565b6001600160a01b038416610a2f5760405163e602df0560e01b8152600060048201526024016104f0565b6001600160a01b038316610a5957604051634a1406b160e11b8152600060048201526024016104f0565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156106d557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610acc91815260200190565b60405180910390a350505050565b6001600160a01b038316610b05578060026000828254610afa919061112d565b90915550610b779050565b6001600160a01b03831660009081526020819052604090205481811015610b585760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016104f0565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610b9357600280548290039055610bb2565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610bf791815260200190565b60405180910390a3505050565b606060ff8314610c1e57610c1783610e37565b90506103b8565b818054610c2a906110f3565b80601f0160208091040260200160405190810160405280929190818152602001828054610c56906110f3565b8015610ca35780601f10610c7857610100808354040283529160200191610ca3565b820191906000526020600020905b815481529060010190602001808311610c8657829003601f168201915b505050505090506103b8565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115610cea5750600091506003905082610d74565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015610d3e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116610d6a57506000925060019150829050610d74565b9250600091508190505b9450945094915050565b6000826003811115610d9257610d9261114e565b03610d9b575050565b6001826003811115610daf57610daf61114e565b03610dcd5760405163f645eedf60e01b815260040160405180910390fd5b6002826003811115610de157610de161114e565b03610e025760405163fce698f760e01b8152600481018290526024016104f0565b6003826003811115610e1657610e1661114e565b03610403576040516335e2f38360e21b8152600481018290526024016104f0565b60606000610e4483610e76565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600060ff8216601f8111156103b857604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b81811015610ec457602081850181015186830182015201610ea8565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610ef76020830184610e9e565b9392505050565b80356001600160a01b0381168114610f1557600080fd5b919050565b60008060408385031215610f2d57600080fd5b610f3683610efe565b946020939093013593505050565b600080600060608486031215610f5957600080fd5b610f6284610efe565b9250610f7060208501610efe565b929592945050506040919091013590565b600060208284031215610f9357600080fd5b5035919050565b600060208284031215610fac57600080fd5b610ef782610efe565b60ff60f81b8816815260e060208201526000610fd460e0830189610e9e565b8281036040840152610fe68189610e9e565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b8181101561103c57835183526020938401939092019160010161101e565b50909b9a5050505050505050505050565b600080600080600080600060e0888a03121561106857600080fd5b61107188610efe565b965061107f60208901610efe565b95506040880135945060608801359350608088013560ff811681146110a357600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156110d357600080fd5b6110dc83610efe565b91506110ea60208401610efe565b90509250929050565b600181811c9082168061110757607f821691505b60208210810361112757634e487b7160e01b600052602260045260246000fd5b50919050565b808201808211156103b857634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea264697066735822122029c627c2fe17ce2b48916f073f23b0f6a387857c97c50fb9381795bebf8db0e064736f6c634300081e0033";
  const isSuperArgs$1 = (xs) => xs.length > 1;
  class ERC20Mock__factory extends ethers.ContractFactory {
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
      return new ethers.Interface(_abi$1);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi$1, runner);
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
  const _bytecode = "0x61016060405234801561001157600080fd5b50336040518060400160405280601281526020017120b937bbb0b7309023b7b632102a37b5b2b760711b81525080604051806040016040528060018152602001603160f81b8152506040518060400160405280601281526020017120b937bbb0b7309023b7b632102a37b5b2b760711b815250604051806040016040528060038152602001621051d560ea1b81525081600390816100af91906103bc565b5060046100bc82826103bc565b506100cc915083905060056101ef565b610120526100db8160066101ef565b61014052815160208084019190912060e052815190820120610100524660a05261016860e05161010051604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201529081019290925260608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b60805250503060c052506001600160a01b0381166101a157604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b6101aa81610222565b506101b6600933610274565b506040513381527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab9060200160405180910390a16104ec565b600060208351101561020b5761020483610290565b905061021c565b8161021684826103bc565b5060ff90505b92915050565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000610289836001600160a01b0384166102ce565b9392505050565b600080829050601f815111156102bb578260405163305a27a960e01b8152600401610198919061047a565b80516102c6826104c8565b179392505050565b60008181526001830160205260408120546103155750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561021c565b50600061021c565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061034757607f821691505b60208210810361036757634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156103b757806000526020600020601f840160051c810160208510156103945750805b601f840160051c820191505b818110156103b457600081556001016103a0565b50505b505050565b81516001600160401b038111156103d5576103d561031d565b6103e9816103e38454610333565b8461036d565b6020601f82116001811461041d57600083156104055750848201515b600019600385901b1c1916600184901b1784556103b4565b600084815260208120601f198516915b8281101561044d578785015182556020948501946001909201910161042d565b508482101561046b5786840151600019600387901b60f8161c191681555b50505050600190811b01905550565b602081526000825180602084015260005b818110156104a8576020818601810151604086840101520161048b565b506000604082850101526040601f19601f83011684010191505092915050565b805160208083015191908110156103675760001960209190910360031b1b16919050565b60805160a05160c05160e0516101005161012051610140516116106105466000396000610bae01526000610b8101526000610a6b01526000610a430152600061099e015260006109c8015260006109f201526116106000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c806379cc6790116100c3578063a0712d681161007c578063a0712d68146102b2578063a9059cbb146102c5578063d505accf146102d8578063dd62ed3e146102eb578063f2fde38b14610324578063f97b57ec1461033757600080fd5b806379cc67901461023b5780637ecebe001461024e57806384b0196e146102615780638da5cb5b1461027c57806395d89b4114610297578063983b2d561461029f57600080fd5b8063313ce56711610115578063313ce567146101cd5780633644e515146101dc57806340c10f19146101e457806342966c68146101f757806370a082311461020a578063715018a61461023357600080fd5b806306fdde0314610152578063095ea7b31461017057806318160ddd1461019357806323b872dd146101a55780633092afd5146101b8575b600080fd5b61015a61034c565b60405161016791906112ce565b60405180910390f35b61018361017e3660046112fd565b6103de565b6040519015158152602001610167565b6002545b604051908152602001610167565b6101836101b3366004611327565b6103f8565b6101cb6101c6366004611364565b61041c565b005b60405160128152602001610167565b6101976104bd565b6101cb6101f23660046112fd565b6104cc565b6101cb61020536600461137f565b61051f565b610197610218366004611364565b6001600160a01b031660009081526020819052604090205490565b6101cb61052c565b6101cb6102493660046112fd565b610540565b61019761025c366004611364565b610555565b610269610573565b6040516101679796959493929190611398565b6008546040516001600160a01b039091168152602001610167565b61015a6105b9565b6101cb6102ad366004611364565b6105c8565b6101cb6102c036600461137f565b610660565b6101836102d33660046112fd565b6106ab565b6101cb6102e6366004611430565b6106b9565b6101976102f93660046114a3565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6101cb610332366004611364565b6107f3565b61033f61082e565b60405161016791906114d6565b60606003805461035b90611522565b80601f016020809104026020016040519081016040528092919081815260200182805461038790611522565b80156103d45780601f106103a9576101008083540402835291602001916103d4565b820191906000526020600020905b8154815290600101906020018083116103b757829003601f168201915b5050505050905090565b6000336103ec81858561083a565b60019150505b92915050565b60003361040685828561084c565b6104118585856108cb565b506001949350505050565b61042461092a565b61042f600982610957565b6104715760405162461bcd60e51b815260206004820152600e60248201526d24a72b20a624a22fa6a4a72a22a960911b60448201526064015b60405180910390fd5b61047c60098261097c565b506040516001600160a01b03821681527f2f91b591fc56ac0917953ad01ec225524ee5ef0555213e4c8a9d8c9728ee7ffb906020015b60405180910390a150565b60006104c7610991565b905090565b6104d9335b600990610957565b6105115760405162461bcd60e51b81526020600482015260096024820152682327a92124a22222a760b91b6044820152606401610468565b61051b8282610abc565b5050565b6105293382610af2565b50565b61053461092a565b61053e6000610b28565b565b61054b82338361084c565b61051b8282610af2565b6001600160a01b0381166000908152600760205260408120546103f2565b600060608060008060006060610587610b7a565b61058f610ba7565b60408051600080825260208201909252600f60f81b9b939a50919850469750309650945092509050565b60606004805461035b90611522565b6105d061092a565b6105db600982610957565b1561061b5760405162461bcd60e51b815260206004820152601060248201526f222aa82624a1a0aa22afa6a4a72a22a960811b6044820152606401610468565b610626600982610bd4565b506040516001600160a01b03821681527f16baa937b08d58713325f93ac58b8a9369a4359bbefb4957d6d9b402735722ab906020016104b2565b610669336104d1565b6106a15760405162461bcd60e51b81526020600482015260096024820152682327a92124a22222a760b91b6044820152606401610468565b6105293382610abc565b6000336103ec8185856108cb565b834211156106dd5760405163313c898160e11b815260048101859052602401610468565b60007f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c988888861072a8c6001600160a01b0316600090815260076020526040902080546001810190915590565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061078582610be9565b9050600061079582878787610c16565b9050896001600160a01b0316816001600160a01b0316146107dc576040516325c0072360e11b81526001600160a01b0380831660048301528b166024820152604401610468565b6107e78a8a8a61083a565b50505050505050505050565b6107fb61092a565b6001600160a01b03811661082557604051631e4fbdf760e01b815260006004820152602401610468565b61052981610b28565b60606104c76009610c44565b6108478383836001610c51565b505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198110156108c557818110156108b657604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610468565b6108c584848484036000610c51565b50505050565b6001600160a01b0383166108f557604051634b637e8f60e11b815260006004820152602401610468565b6001600160a01b03821661091f5760405163ec442f0560e01b815260006004820152602401610468565b610847838383610d26565b6008546001600160a01b0316331461053e5760405163118cdaa760e01b8152336004820152602401610468565b6001600160a01b038116600090815260018301602052604081205415155b9392505050565b6000610975836001600160a01b038416610e50565b6000306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161480156109ea57507f000000000000000000000000000000000000000000000000000000000000000046145b15610a1457507f000000000000000000000000000000000000000000000000000000000000000090565b6104c7604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60208201527f0000000000000000000000000000000000000000000000000000000000000000918101919091527f000000000000000000000000000000000000000000000000000000000000000060608201524660808201523060a082015260009060c00160405160208183030381529060405280519060200120905090565b6001600160a01b038216610ae65760405163ec442f0560e01b815260006004820152602401610468565b61051b60008383610d26565b6001600160a01b038216610b1c57604051634b637e8f60e11b815260006004820152602401610468565b61051b82600083610d26565b600880546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60606104c77f00000000000000000000000000000000000000000000000000000000000000006005610f43565b60606104c77f00000000000000000000000000000000000000000000000000000000000000006006610f43565b6000610975836001600160a01b038416610fee565b60006103f2610bf6610991565b8360405161190160f01b8152600281019290925260228201526042902090565b600080600080610c288888888861103d565b925092509250610c38828261110c565b50909695505050505050565b60606000610975836111c5565b6001600160a01b038416610c7b5760405163e602df0560e01b815260006004820152602401610468565b6001600160a01b038316610ca557604051634a1406b160e11b815260006004820152602401610468565b6001600160a01b03808516600090815260016020908152604080832093871683529290522082905580156108c557826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051610d1891815260200190565b60405180910390a350505050565b6001600160a01b038316610d51578060026000828254610d469190611572565b90915550610dc39050565b6001600160a01b03831660009081526020819052604090205481811015610da45760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610468565b6001600160a01b03841660009081526020819052604090209082900390555b6001600160a01b038216610ddf57600280548290039055610dfe565b6001600160a01b03821660009081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610e4391815260200190565b60405180910390a3505050565b60008181526001830160205260408120548015610f39576000610e74600183611585565b8554909150600090610e8890600190611585565b9050808214610eed576000866000018281548110610ea857610ea8611598565b9060005260206000200154905080876000018481548110610ecb57610ecb611598565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610efe57610efe6115ae565b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506103f2565b60009150506103f2565b606060ff8314610f5d57610f5683611221565b90506103f2565b818054610f6990611522565b80601f0160208091040260200160405190810160405280929190818152602001828054610f9590611522565b8015610fe25780601f10610fb757610100808354040283529160200191610fe2565b820191906000526020600020905b815481529060010190602001808311610fc557829003601f168201915b505050505090506103f2565b6000818152600183016020526040812054611035575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556103f2565b5060006103f2565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156110785750600091506003905082611102565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa1580156110cc573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166110f857506000925060019150829050611102565b9250600091508190505b9450945094915050565b6000826003811115611120576111206115c4565b03611129575050565b600182600381111561113d5761113d6115c4565b0361115b5760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561116f5761116f6115c4565b036111905760405163fce698f760e01b815260048101829052602401610468565b60038260038111156111a4576111a46115c4565b0361051b576040516335e2f38360e21b815260048101829052602401610468565b60608160000180548060200260200160405190810160405280929190818152602001828054801561121557602002820191906000526020600020905b815481526020019060010190808311611201575b50505050509050919050565b6060600061122e83611260565b604080516020808252818301909252919250600091906020820181803683375050509182525060208101929092525090565b600060ff8216601f8111156103f257604051632cd44ac360e21b815260040160405180910390fd5b6000815180845260005b818110156112ae57602081850181015186830182015201611292565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006109756020830184611288565b80356001600160a01b03811681146112f857600080fd5b919050565b6000806040838503121561131057600080fd5b611319836112e1565b946020939093013593505050565b60008060006060848603121561133c57600080fd5b611345846112e1565b9250611353602085016112e1565b929592945050506040919091013590565b60006020828403121561137657600080fd5b610975826112e1565b60006020828403121561139157600080fd5b5035919050565b60ff60f81b8816815260e0602082015260006113b760e0830189611288565b82810360408401526113c98189611288565b606084018890526001600160a01b038716608085015260a0840186905283810360c08501528451808252602080870193509091019060005b8181101561141f578351835260209384019390920191600101611401565b50909b9a5050505050505050505050565b600080600080600080600060e0888a03121561144b57600080fd5b611454886112e1565b9650611462602089016112e1565b95506040880135945060608801359350608088013560ff8116811461148657600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156114b657600080fd5b6114bf836112e1565b91506114cd602084016112e1565b90509250929050565b602080825282518282018190526000918401906040840190835b818110156115175783516001600160a01b03168352602093840193909201916001016114f0565b509095945050505050565b600181811c9082168061153657607f821691505b60208210810361155657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b808201808211156103f2576103f261155c565b818103818111156103f2576103f261155c565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea2646970667358221220078f4773f46cc38a14e29aff5202c410edf8b7e612cd32b59eb9427144dee8c164736f6c634300081e0033";
  const isSuperArgs = (xs) => xs.length > 1;
  class GoldToken__factory extends ethers.ContractFactory {
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
      return new ethers.Interface(_abi);
    }
    static connect(address, runner) {
      return new ethers.Contract(address, _abi, runner);
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
    goldMinterSol: index$h,
    interfaces: index$c,
    libraries: index$9,
    lockSol: index$g,
    oracle: index$7,
    proxy: index$5,
    tokens: index$2
  });

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    contracts: index$1,
    openzeppelin: index$i
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
      goldSupply: Number(ethers.formatEther(goldTokenSupply)),
      goldPrice: Number(ethers.formatUnits(goldPriceFeedAns, DATAFEED_DECIMALS)),
      goldReserve: Number(ethers.formatUnits(goldReserveFeedAns, DATAFEED_DECIMALS)),
      slippage: Number(Number(slippage).toFixed(3)) / 100,
      fees: Number(fees) / 100,
      tradeLevel: Number(tradeLevel),
      minGoldAmount: Number(ethers.formatEther(minGoldAmount)),
      minGoldFee: Number(ethers.formatEther(minGoldFee)),
      minGoldFeeAmount: Number(ethers.formatEther(minGoldFeeAmount))
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
    return Number(num.toFixed(maxDecimals));
  }

  exports.Address__factory = Address__factory;
  exports.ContextUpgradeable__factory = ContextUpgradeable__factory;
  exports.DATAFEED_DECIMALS = DATAFEED_DECIMALS;
  exports.DataFeed__factory = DataFeed__factory;
  exports.ECDSA__factory = ECDSA__factory;
  exports.EIP712__factory = EIP712__factory;
  exports.ERC1967Utils__factory = ERC1967Utils__factory;
  exports.ERC20Burnable__factory = ERC20Burnable__factory;
  exports.ERC20Mock__factory = ERC20Mock__factory;
  exports.ERC20Permit__factory = ERC20Permit__factory;
  exports.ERC20__factory = ERC20__factory;
  exports.Errors__factory = Errors__factory;
  exports.GOLD_TOKEN_DECIMALS = GOLD_TOKEN_DECIMALS;
  exports.GoldMinter__factory = GoldMinter__factory;
  exports.GoldToken__factory = GoldToken__factory;
  exports.IBeacon__factory = IBeacon__factory;
  exports.IERC1155Errors__factory = IERC1155Errors__factory;
  exports.IERC1363__factory = IERC1363__factory;
  exports.IERC165__factory = IERC165__factory;
  exports.IERC1967__factory = IERC1967__factory;
  exports.IERC20Errors__factory = IERC20Errors__factory;
  exports.IERC20Exp__factory = IERC20Exp__factory;
  exports.IERC20Metadata__factory = IERC20Metadata__factory;
  exports.IERC20Mintable__factory = IERC20Mintable__factory;
  exports.IERC20Permit__factory = IERC20Permit__factory;
  exports.IERC20__factory = IERC20__factory;
  exports.IERC5267__factory = IERC5267__factory;
  exports.IERC721Errors__factory = IERC721Errors__factory;
  exports.IInitializableProxy__factory = IInitializableProxy__factory;
  exports.IPriceFeed__factory = IPriceFeed__factory;
  exports.InitializableProxy__factory = InitializableProxy__factory;
  exports.Initializable__factory = Initializable__factory;
  exports.Levels = Levels;
  exports.Lock__factory = Lock__factory;
  exports.Networks = Networks;
  exports.Nonces__factory = Nonces__factory;
  exports.NumDecimals = NumDecimals;
  exports.OwnableUpgradeable__factory = OwnableUpgradeable__factory;
  exports.Ownable__factory = Ownable__factory;
  exports.Proxy__factory = Proxy__factory;
  exports.ReentrancyGuardUpgradeable__factory = ReentrancyGuardUpgradeable__factory;
  exports.SafeCast__factory = SafeCast__factory;
  exports.SafeERC20__factory = SafeERC20__factory;
  exports.ShortStrings__factory = ShortStrings__factory;
  exports.SigLib__factory = SigLib__factory;
  exports.Strings__factory = Strings__factory;
  exports.USD_TOKEN_MAX_DECIMALS = USD_TOKEN_MAX_DECIMALS;
  exports.WithSettler__factory = WithSettler__factory;
  exports.calculateSwap = calculateSwap;
  exports.factories = index;
  exports.getGoldMinterContract = getGoldMinterContract;
  exports.getGoldPriceFeedContract = getGoldPriceFeedContract;
  exports.getGoldReserveFeedContract = getGoldReserveFeedContract;
  exports.getGoldStats = getGoldStats;
  exports.getGoldTokenContract = getGoldTokenContract;
  exports.getStableCoinContract = getStableCoinContract;
  exports.goldConfigs = goldConfigs;

}));
