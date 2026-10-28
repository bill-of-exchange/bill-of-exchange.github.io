# Smart contracts

Solidity implementation of electronic **bills of exchange** under the
[UK Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61)
and the [Electronic Trade Documents Act 2023](https://www.legislation.gov.uk/ukpga/2023/38).

The authoritative description of the legal model, invariants and design decisions is the
specification: [BillOfExchange_Specification.v.0.1.0.md](contracts/BillOfExchange_Specification.v.0.1.0.md).
Read it before reading the code.

## Contents

| Path | Purpose |
|---|---|
| `contracts/BillsOfExchange.sol` | Main contract (v0.1.0): dual ledger of unaccepted and accepted bills |
| `contracts/libs/` | Minimal forks of OpenZeppelin v5.4.0 ERC-20, ERC20Burnable, ERC-1363 (see file headers) |
| `scripts/viem-deploy-verify.ts` | Deployment and Etherscan/Blockscout verification |
| `scripts/demo-lifecycle.ts` | Terminal demo of a bill's life: draw, accept, transfer, burn |
| `test/BillsOfExchange.t.sol` | Solidity tests (forge-std), including a fuzzed conservation-of-bills check |
| `deployments/` | One JSON record per deployment, written by the deploy script; read by the website |

## Status

Pre-release. Not audited. Party addresses and names in the contract are **placeholders**.
No deployment of v0.1.0 represents real bills of exchange; Ethereum test networks are
never valid registries.

## Build

```shell
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/viem-deploy-verify.ts --network sepolia
```

Requires `SEPOLIA_RPC_URL`, `ETH_DEV_PRIVATE_KEY` (the deployer) and `ETHERSCAN_API_KEY`,
via `hardhat-keystore` or environment variables (environment variables take precedence).
Keep a single Solidity profile in `hardhat.config.ts`; verification fails with several.

## Compiler and verification

- Solidity 0.8.36: the newest version that both Etherscan and Blockscout could verify at the first deployment.
- `splitTestsCompilation: true` in `hardhat.config.ts` compiles the Solidity tests in a separate job. Without it,
  test-only remappings (forge-std) end up in the contract's metadata, and Blockscout and Sourcify report only a
  partial match.
- The deploy script verifies on Etherscan and Blockscout. Blockscout often answers HTTP 429; the script retries, then
  asks Blockscout for the contract's status, because Blockscout also imports verified sources from a shared database.
- Redeploying byte-identical code gives the new address only a "Similar Match" on Etherscan; resubmitting the
  source with `--force` did not turn it into an "Exact Match". Deploy again only after changing the code.

## Deployment records and the website

Each successful deployment to a live network writes `deployments/<time>_<network>_<address>.json`, including the
ABI of the deployed code. The website takes the latest record for each chain at every build
(`website/scripts/sync-deployments.mjs`) and uses its ABI, never the current artifacts, so changing the source here
does not affect the site until the next deployment; after a deployment it is enough to rebuild the site. Delete a
record to retire its deployment. Details:
[`website/README.md`](../website/README.md).

## Demo

```shell
npx hardhat run scripts/demo-lifecycle.ts --network hardhatMainnet   # local simulation, fresh contract
npx hardhat run scripts/demo-lifecycle.ts --network sepolia          # the latest Sepolia deployment
```

On a live network the configured account must be the contract's drawer and drawee. `DEMO_PAUSE_MS` slows the
output down for screen recording.
