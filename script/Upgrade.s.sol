// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Script, console2 } from "forge-std/Script.sol";
import { ProxyFactory } from "../contracts/proxy/ProxyFactory.sol";
import { InitializableProxy } from "../contracts/proxy/InitializableProxy.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";

/// @title Upgrade
/// @notice Migrates a LIVE legacy deployment (Chainlink Functions/Automation "push"
///         GoldMinter, audit-certik) to the Data Streams "pull" implementation.
///
///         This is NOT {Deploy} (greenfield). BlacklistOracle and GoldToken are already
///         deployed and are left untouched. Only two things happen here:
///           1. GoldStreamVerifier is deployed fresh (it did not exist in the legacy stack).
///           2. The EXISTING GoldMinter proxy is upgraded to the new implementation AND
///              migrated atomically via `migrateToDataStreams` (sets verifier + orderTTL),
///              so no zero-verifier window is ever observable.
///
///         Storage safety: the new GoldMinterStorage struct is a strict append of the
///         legacy one — verified field-by-field against audit-certik (mainnet) AND
///         diffed identical on main (dev/stage), so ONE implementation upgrades all
///         three environments. `goldPriceFeed`, `maxPriceAge`, `minGoldPrice`,
///         `maxGoldPrice` become read-only dead slots. The sanity band is now a
///         compile-time constant, so the ceiling auto-moves to $20,000 on upgrade
///         (docs/설계.md R2/Q3). Run `make check-upgrade` against the matching legacy
///         build-info (main for dev/stage, audit-certik for mainnet) before broadcasting.
///
/// @dev Required env vars:
///        GOLDMINTER_PROXY — the LIVE legacy GoldMinter proxy (unchanged address)
///        PROXY_ADMIN      — ERC-1967 admin of that proxy (must sign upgradeToAndCall)
///        OWNER            — verifier owner / role admin (must sign verifier.setGoldMinter)
///        VERIFIER_PROXY   — Chainlink Data Streams VerifierProxy (network-specific)
///        LINK             — LINK token address (network-specific)
///        FEED_ID          — XAU/USD v8 feedId (bytes32, network-specific)
///        ORDER_TTL        — (optional) R1 self-cancel TTL in seconds; default 4 days
///        TRADE_SIGNER     — (optional but REQUIRED for a functional system) backend
///                           KMS address that signs KYC + TradeWindow (business-hours
///                           gate, R8). Granted KYC_MANAGER_ROLE post-upgrade. Without
///                           a live KYC_MANAGER signer every request reverts at the
///                           gate (InvalidTradeWindowSigner) — the system would be
///                           upgraded but unusable. Omit ONLY if the role is already
///                           granted on the target proxy.
///
///        Network cheat-sheet (docs/reference/external-deps.md):
///          Arbitrum One     VERIFIER_PROXY=0x478Aa2aC9F6D65F84e09D9185d126c3a17c2a93C
///                           LINK=0xf97f4df75117a78c1A5a0DBb814Af92458539FB4
///                           FEED_ID=0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89
///          Arbitrum Sepolia VERIFIER_PROXY=0x2ff010DEbC1297f19579B4246cad07bd24F2488A
///                           LINK=0xb1D4538B4571d411F07960EF2838Ce337FE1E80E
///                           FEED_ID=0x0008dc605e8fc3cd2e609da016af59e6e8aad20b672264949c5b99e1ca3b90fd
///
///        Run (simulation first — add --broadcast only after review):
///          forge script script/Upgrade.s.sol --rpc-url $RPC --evm-version prague
///
///        NOTE ON SIGNERS (mainnet): PROXY_ADMIN, OWNER and the role admin are typically
///        DISTINCT multisigs, so the state-changing steps below are usually executed as
///        SEPARATE governance transactions, not one EOA broadcast. This script models
///        the sequence for dev/stage/testnet rehearsal; split it per-signer for production.
contract Upgrade is Script {
    function run() external {
        address goldMinterProxy = vm.envAddress("GOLDMINTER_PROXY");
        address proxyAdmin = vm.envAddress("PROXY_ADMIN");
        address owner = vm.envAddress("OWNER");
        address verifierProxy = vm.envAddress("VERIFIER_PROXY");
        address link = vm.envAddress("LINK");
        bytes32 feedId = vm.envBytes32("FEED_ID");
        uint64 orderTTL = uint64(vm.envOr("ORDER_TTL", uint256(4 days)));

        // Signer split (matches live deployments, dev included): OWNER signs verifier
        // deploy/bind + role grant; PROXY_ADMIN signs only upgradeToAndCall. Passing the
        // address to startBroadcast makes simulation impersonate it (no key needed) and
        // real broadcast pick the matching key from --private-keys / keystore.
        vm.startBroadcast(owner);

        // 1) Deploy GoldStreamVerifier fresh, behind its own proxy, atomically initialized.
        ProxyFactory factory = new ProxyFactory();
        address verifier = factory.deployProxy(
            keccak256("ontorium.verifier.v2"),
            "Ontorium GoldStreamVerifier",
            proxyAdmin,
            address(new GoldStreamVerifier()),
            abi.encodeCall(GoldStreamVerifier.initialize, (owner, verifierProxy, link, feedId))
        );

        // 2) Bind the verifier's sole consumer to the EXISTING GoldMinter proxy.
        //    onlyOwner — the broadcasting key must be `owner` (verifier owner).
        GoldStreamVerifier(verifier).setGoldMinter(goldMinterProxy);

        // 3) Deploy the new GoldMinter implementation. forge auto-deploys and links the
        //    external libraries (MintLogic / BurnLogic / GoldMinterLib); record their
        //    addresses from the broadcast for explorer verification.
        GoldMinter newImpl = new GoldMinter();

        vm.stopBroadcast();

        // 4) Upgrade the LIVE proxy AND migrate in ONE call. `upgradeToAndCall` is
        //    `ifAdmin` (must be signed by PROXY_ADMIN); the migrate data is delegatecalled
        //    into the new impl, setting verifier + orderTTL with zero exposure window.
        vm.startBroadcast(proxyAdmin);
        InitializableProxy(payable(goldMinterProxy))
            .upgradeToAndCall(address(newImpl), abi.encodeCall(GoldMinter.migrateToDataStreams, (verifier, orderTTL)));
        vm.stopBroadcast();

        // 5) Business-hours gate (R8): the backend signer must hold KYC_MANAGER_ROLE or
        //    every request dies at the gate. grantRole requires DEFAULT_ADMIN_ROLE (OWNER).
        address tradeSigner = vm.envOr("TRADE_SIGNER", address(0));
        if (tradeSigner != address(0)) {
            vm.startBroadcast(owner);
            GoldMinter(goldMinterProxy).grantRole(
                GoldMinter(goldMinterProxy).KYC_MANAGER_ROLE(), tradeSigner
            );
            vm.stopBroadcast();
        }

        // ── Post-conditions (revert the script if the migration did not take) ──
        require(GoldMinter(goldMinterProxy).orderTTL() == orderTTL, "ORDER_TTL_NOT_SET");
        require(GoldMinter(goldMinterProxy).goldStreamVerifier() == verifier, "VERIFIER_NOT_SET");
        if (tradeSigner != address(0)) {
            require(
                GoldMinter(goldMinterProxy).hasRole(
                    GoldMinter(goldMinterProxy).KYC_MANAGER_ROLE(), tradeSigner
                ),
                "TRADE_SIGNER_ROLE_NOT_GRANTED"
            );
        }

        console2.log("GoldStreamVerifier :", verifier);
        console2.log("GoldMinter impl    :", address(newImpl));
        console2.log("GoldMinter proxy   :", goldMinterProxy, "(unchanged)");
        console2.log("orderTTL           :", orderTTL);
        console2.log("tradeSigner        :", tradeSigner);

        // ── Remaining owner/ops steps (NOT in this script; run as governance txs) ──
        //   • Fund `verifier` with LINK and set up balance monitoring (verify() pulls
        //     LINK per report; if it runs dry, all mint/redeem revert).
        //   • Confirm GoldToken still grants MINTER_ROLE to this GoldMinter proxy
        //     (unchanged by the upgrade, but verify).
        //   • Grant SETTLER_ROLE to the settlement multisig if not already.
        //   • `make layout-baseline` at this commit and commit layouts/ for future diffs.
    }
}
