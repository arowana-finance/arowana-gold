// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { console2 } from "forge-std/Script.sol";
import { SafeScript } from "./SafeTx.sol";
import { ProxyFactory } from "../contracts/proxy/ProxyFactory.sol";
import { InitializableProxy } from "../contracts/proxy/InitializableProxy.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";

/// @title UpgradeSafe
/// @notice Forge-native replacement for the cast-based step 1-3 shell flow (dev-runbook.md).
///         One `forge script --broadcast` run performs, in order:
///           step 1 (DEPLOYER_PK) : deploy GoldStreamVerifier proxy + new GoldMinter impl
///           step 2 (SAFE_PK1..3) : Safe approveHash x3 -> execTransaction for
///                                  verifier.setGoldMinter + minter.grantRole(KYC_MANAGER, TRADE_SIGNER)
///           step 3 (DEPLOYER_PK) : upgradeToAndCall(newImpl, migrateToDataStreams) — atomic
///           step 4 (view)        : post-checks; reverts on any mismatch
///
///         Env: source script/env/<env>.env with DEPLOYER_PK (= proxy admin) and
///         SAFE_PK1..3 (any 3 owner keys of the OWNER Safe) exported.
///         Simulate first (omit --broadcast) — the whole flow runs against a fork.
contract UpgradeSafe is SafeScript {
    function run() external {
        address minterProxy = vm.envAddress("GOLDMINTER_PROXY");
        address proxyAdmin = vm.envAddress("PROXY_ADMIN");
        address owner = vm.envAddress("OWNER"); // the Safe
        address verifierProxy = vm.envAddress("VERIFIER_PROXY");
        address link = vm.envAddress("LINK");
        bytes32 feedId = vm.envBytes32("FEED_ID");
        uint64 orderTTL = uint64(vm.envOr("ORDER_TTL", uint256(4 days)));
        address tradeSigner = vm.envAddress("TRADE_SIGNER");
        uint256 deployerPk = vm.envUint("DEPLOYER_PK");
        uint256[] memory pks = _safePks();

        // ── step 1: deployments (deployer EOA) ──
        vm.startBroadcast(deployerPk);
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
        console2.log("verifier :", verifier);
        console2.log("newImpl  :", address(newImpl));

        // ── step 2: Safe txs (approveHash x3 -> execTransaction) ──
        bytes32 kycRole = newImpl.KYC_MANAGER_ROLE();
        _safeExec(owner, verifier, abi.encodeCall(GoldStreamVerifier.setGoldMinter, (minterProxy)), pks);
        _safeExec(owner, minterProxy, abi.encodeWithSignature("grantRole(bytes32,address)", kycRole, tradeSigner), pks);

        // ── step 3: atomic upgrade + migrate (proxy admin EOA) ──
        vm.startBroadcast(deployerPk);
        InitializableProxy(payable(minterProxy)).upgradeToAndCall(
            address(newImpl),
            abi.encodeCall(GoldMinter.migrateToDataStreams, (verifier, orderTTL))
        );
        vm.stopBroadcast();

        // ── step 4: post-checks ──
        GoldMinter m = GoldMinter(minterProxy);
        require(m.orderTTL() == orderTTL);
        require(m.goldStreamVerifier() == verifier);
        require(m.hasRole(kycRole, tradeSigner));
        (,,, address boundMinter,,) = GoldStreamVerifier(verifier).config();
        require(boundMinter == minterProxy);
        console2.log("post-checks OK: orderTTL/verifier/kycRole/binding");
    }
}
