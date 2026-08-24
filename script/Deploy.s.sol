// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { console2 } from "forge-std/Script.sol";
import { SafeScript } from "./SafeTx.sol";
import { ProxyFactory } from "../contracts/proxy/ProxyFactory.sol";
import { InitializableProxy } from "../contracts/proxy/InitializableProxy.sol";
import { BlacklistOracle } from "../contracts/BlacklistOracle.sol";
import { GoldToken } from "../contracts/tokens/GoldToken.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";

/// @title Deploy
/// @notice MED 3 — deploys the full Ontorium Gold V2 system with EVERY proxy
///         created via {ProxyFactory}, i.e. deployed AND initialized in a single
///         transaction. This is the fix for the unprotected `initializeProxy`
///         front-running window: no proxy is ever observable on-chain in an
///         uninitialized state, and each proxy's admin is asserted post-deploy.
///
///         InitializableProxy itself is unchanged (audit decision: option 1).
///
/// @dev Required env vars (set the real values at deploy time):
///        PROXY_ADMIN     — ERC-1967 admin for all proxies (multisig / timelock)
///        OWNER           — operational owner / role admin (multisig)
///        VERIFIER_PROXY  — Chainlink Data Streams VerifierProxy address
///        LINK            — LINK token address
///        FEED_ID         — XAU/USD v8 feedId (bytes32)
///        USDT, USDC      — stablecoin addresses
///        USD_RECIPIENT   — treasury that receives deposited USD
///        FEE_RECIPIENT   — recipient of protocol fee gold
///      confirmed live values before mainnet deployment.
contract Deploy is SafeScript {
    function run() external {
        address proxyAdmin = vm.envAddress("PROXY_ADMIN");
        address owner = vm.envAddress("OWNER");
        address verifierProxy = vm.envAddress("VERIFIER_PROXY");
        address link = vm.envAddress("LINK");
        bytes32 feedId = vm.envBytes32("FEED_ID");
        address usdt = vm.envAddress("USDT");
        address usdc = vm.envAddress("USDC");
        address usdRecipient = vm.envAddress("USD_RECIPIENT");
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");

        vm.startBroadcast();

        ProxyFactory factory = new ProxyFactory();

        // 1) BlacklistOracle
        address blacklist = factory.deployProxy(
            keccak256("ontorium.blacklist.v2"),
            "Ontorium BlacklistOracle",
            proxyAdmin,
            address(new BlacklistOracle()),
            abi.encodeCall(BlacklistOracle.initializeOracle, ("Ontorium Sanctions", owner))
        );
        _assertAdmin(blacklist, proxyAdmin);

        // 2) GoldToken (OXAU)
        address goldToken = factory.deployProxy(
            keccak256("ontorium.goldtoken.v2"),
            "Ontorium GoldToken",
            proxyAdmin,
            address(new GoldToken()),
            abi.encodeCall(GoldToken.initializeGoldToken, (owner, blacklist))
        );
        _assertAdmin(goldToken, proxyAdmin);

        // 3) GoldStreamVerifier (Data Streams pull oracle)
        address verifier = factory.deployProxy(
            keccak256("ontorium.verifier.v2"),
            "Ontorium GoldStreamVerifier",
            proxyAdmin,
            address(new GoldStreamVerifier()),
            abi.encodeCall(GoldStreamVerifier.initialize, (owner, verifierProxy, link, feedId))
        );
        _assertAdmin(verifier, proxyAdmin);

        // 4) GoldMinter (core engine)
        //    GoldMinter links the external GoldMinterLib (R7) — forge auto-deploys
        //    the library in this broadcast; record its address for explorer verification.
        address minter = factory.deployProxy(
            keccak256("ontorium.goldminter.v2"),
            "Ontorium GoldMinter",
            proxyAdmin,
            address(new GoldMinter()),
            abi.encodeCall(
                GoldMinter.initializeGoldMinter,
                // autoSettle=true — always-on posture, decided 2026-07-23 (docs/결과.md Q1)
                (goldToken, usdt, usdc, verifier, usdRecipient, feeRecipient, owner, true)
            )
        );
        _assertAdmin(minter, proxyAdmin);

        vm.stopBroadcast();

        console2.log("ProxyFactory       :", address(factory));
        console2.log("BlacklistOracle    :", blacklist);
        console2.log("GoldToken (OXAU)   :", goldToken);
        console2.log("GoldStreamVerifier :", verifier);
        console2.log("GoldMinter         :", minter);

        // ── Post-deploy wiring via the owner Safe (forge-native, no shell) ──
        // Enabled when SAFE_PK1..3 are exported (any 3 owner keys of `owner`).
        // Skipped otherwise — run the same calls later via SafeScript/Safe UI.
        if (vm.envOr("SAFE_PK1", uint256(0)) != 0) {
            uint256[] memory pks = _safePks();
            _safeExec(owner, verifier, abi.encodeCall(GoldStreamVerifier.setGoldMinter, (minter)), pks);
            _safeExec(owner, goldToken, abi.encodeWithSignature("addMinter(address)", minter), pks);

            address settler = vm.envOr("SETTLER", address(0));
            if (settler != address(0)) {
                _safeExec(
                    owner,
                    minter,
                    abi.encodeWithSignature("grantRole(bytes32,address)", GoldMinter(minter).SETTLER_ROLE(), settler),
                    pks
                );
            }
            address tradeSigner = vm.envOr("TRADE_SIGNER", address(0));
            if (tradeSigner != address(0)) {
                _safeExec(
                    owner,
                    minter,
                    abi.encodeWithSignature(
                        "grantRole(bytes32,address)", GoldMinter(minter).KYC_MANAGER_ROLE(), tradeSigner
                    ),
                    pks
                );
            }
            console2.log("wiring done: setGoldMinter / addMinter / roles");
        }
        // LINK fee: subscription billing — no LINK balance needed, address only.
    }

    function _assertAdmin(address proxy, address expected) internal view {
        require(InitializableProxy(payable(proxy)).admin() == expected, "ADMIN_MISMATCH");
    }
}
