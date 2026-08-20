// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Script, console2 } from "forge-std/Script.sol";
import { ProxyFactory } from "../contracts/proxy/ProxyFactory.sol";
import { InitializableProxy } from "../contracts/proxy/InitializableProxy.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";

/// @title UpgradeMultisig
/// @notice Multisig-owner variant of {Upgrade}: OWNER is a Safe (dev: threshold 3), so the
///         privileged calls cannot be broadcast from a key. This script does ONLY the
///         permissionless part (deployments) with ANY funded EOA, then prints the exact
///         calldata for the two Safe transactions and the one proxy-admin transaction.
///
///         Execution order:
///           step 1 (this script, any EOA) : deploy verifier(+proxy, owner=Safe) + new impl
///           step 2 (Safe, batch both)     : verifier.setGoldMinter + minter.grantRole
///           step 3 (PROXY_ADMIN EOA)      : upgradeToAndCall(newImpl, migrate) — atomic
///
///         Env: same as Upgrade.s.sol (script/env/dev.env). Broadcast key = any funded EOA.
contract UpgradeMultisig is Script {
    function run() external {
        address goldMinterProxy = vm.envAddress("GOLDMINTER_PROXY");
        address proxyAdmin = vm.envAddress("PROXY_ADMIN");
        address owner = vm.envAddress("OWNER"); // the Safe — becomes verifier owner
        address verifierProxy = vm.envAddress("VERIFIER_PROXY");
        address link = vm.envAddress("LINK");
        bytes32 feedId = vm.envBytes32("FEED_ID");
        uint64 orderTTL = uint64(vm.envOr("ORDER_TTL", uint256(4 days)));
        address tradeSigner = vm.envOr("TRADE_SIGNER", address(0));

        // ── step 1: permissionless deployments (any funded EOA) ──
        vm.startBroadcast();
        ProxyFactory factory = new ProxyFactory();
        address verifier = factory.deployProxy(
            keccak256("ontorium.verifier.v2"),
            "Ontorium GoldStreamVerifier",
            proxyAdmin,
            address(new GoldStreamVerifier()),
            abi.encodeCall(GoldStreamVerifier.initialize, (owner, verifierProxy, link, feedId))
        );
        GoldMinter newImpl = new GoldMinter();
        vm.stopBroadcast();

        // ── step 2/3 calldata (copy into Safe Transaction Builder / cast send) ──
        bytes32 kycRole = newImpl.KYC_MANAGER_ROLE();

        console2.log("deployed verifier :", verifier);
        console2.log("deployed newImpl  :", address(newImpl));
        console2.log("");
        console2.log("=== [step 2] Safe batch (owner multisig) ===");
        console2.log("tx A  to:", verifier);
        console2.log("      data (setGoldMinter):");
        console2.logBytes(abi.encodeCall(GoldStreamVerifier.setGoldMinter, (goldMinterProxy)));
        console2.log("tx B  to:", goldMinterProxy);
        console2.log("      data (grantRole KYC_MANAGER -> tradeSigner):");
        console2.logBytes(abi.encodeWithSignature("grantRole(bytes32,address)", kycRole, tradeSigner));
        console2.log("");
        console2.log("=== [step 3] proxy-admin tx (EOA), AFTER step 2 ===");
        console2.log("tx    to:", goldMinterProxy);
        console2.log("      data (upgradeToAndCall + migrateToDataStreams):");
        console2.logBytes(
            abi.encodeCall(
                InitializableProxy.upgradeToAndCall,
                (address(newImpl), abi.encodeCall(GoldMinter.migrateToDataStreams, (verifier, orderTTL)))
            )
        );
        console2.log("");
        console2.log("post-checks: orderTTL()==", orderTTL);
        console2.log("             goldStreamVerifier()==", verifier);
        console2.log("             hasRole(KYC_MANAGER, tradeSigner)==true, signer:", tradeSigner);
    }
}
