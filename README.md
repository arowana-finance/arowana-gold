# Ontorium Gold (OXAU)

Gold-backed RWA stablecoin. 1 OXAU = 1 gram of gold (ERC-20, 18 decimals).

- **GoldToken** — the OXAU token, with transfer controls via BlacklistOracle
- **GoldMinter** — request/settle mint & redeem engine (KYC/AML, business-hours gate, order TTL)
- **GoldStreamVerifier** — Chainlink Data Streams oracle. Verifies signed XAU/USD
  reports on-chain at request time and locks the price into the order

## How it works

1. The backend fetches a signed report from the Data Streams API and issues it to the
   user together with an EIP-712 TradeWindow signature — only during business hours
2. The user calls `requestMint`/`requestBurn` — on-chain the report is verified
   (freshness via `maxReportAge`, default 90s), the gate is checked (signer, time
   window, Permit2-style unordered nonce), then price and amounts are locked into
   the order and funds are escrowed
3. Settlement — immediate when autoSettle is on, otherwise a SETTLER calls
   `settleMint`/`settleBurn`. Settlement uses only the locked amounts (no oracle access)
4. Escape hatches — after `orderTTL` (default 4 days) the owner may self-cancel
   (escrow returned). Blocked orders go through the SETTLER resolve path:
   sanctioned → seize/retain, under-level → return (enforced in code)

## Getting started

```bash
git clone --recurse-submodules <repo>

# build + offline tests (fast gate, run after every edit)
forge build
forge test --no-match-path 'test/fork/*'

# fork tests against the live Arbitrum VerifierProxy
forge test --match-path 'test/fork/*' --fork-url https://arb1.arbitrum.io/rpc --evm-version prague

# format / lint
forge fmt --check
forge lint

# coverage (--ir-minimum: via_ir off to avoid stack-too-deep)
forge coverage --ir-minimum --fork-url https://arb1.arbitrum.io/rpc --evm-version prague --report summary

# upgrade-safety + ERC-7201 layout validation (required before any upgrade —
# namespaced storage is invisible to forge inspect, so the OZ upgrades-core CLI is used)
FOUNDRY_PROFILE=upgrade-check forge build
npx @openzeppelin/upgrades-core@^1 validate out-upgrade-check/build-info --contract contracts/GoldMinter.sol:GoldMinter
# (repeat for GoldStreamVerifier / GoldToken / BlacklistOracle)
```

`solc 0.8.28` / `via_ir=true` / `evm=prague` — `foundry.toml` is the source of truth.
CI runs build + tests on every PR; fork tests run on manual trigger (`ARB_RPC` secret).

## Repository layout

| Path | Contents |
|---|---|
| `contracts/` | GoldToken · GoldMinter (+ MintLogic/BurnLogic external libraries) · GoldStreamVerifier · BlacklistOracle · proxy |
| `test/` | unit / property-based fuzz + `test/fork/` (E2E, revert coverage, attack scenarios) |
| `script/` | `Deploy.s.sol` (full deployment + Safe wiring) · `UpgradeSafe.s.sol` (Safe 3/5 upgrade) · `SafeTx.sol` (Safe execution helper) |
| `layouts/` | deploy-time storage-layout baseline (intentionally tracked) |

## Deploy / upgrade

```bash
source script/env/<env>.env    # addresses & config; export keys in the shell only, right before running

# full fresh deployment (+ Safe wiring when SAFE_PK1..3 are exported)
forge script script/Deploy.s.sol --rpc-url $RPC --evm-version prague [--broadcast]

# upgrade an existing proxy: deploy verifier + impl → 2 Safe txs → atomic upgradeToAndCall
forge script script/UpgradeSafe.s.sol --rpc-url $RPC --evm-version prague [--broadcast]
```

Simulate first (omit `--broadcast`). OWNER is a Safe multisig (3 owner keys required);
the proxy admin is the deployer EOA.

After an upgrade, freeze the storage-layout baseline:

```bash
FOUNDRY_PROFILE=upgrade-check forge build
cp out-upgrade-check/build-info/*.json layouts/baseline/   # commit layouts/
```
