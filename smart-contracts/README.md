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

Requires `SEPOLIA_RPC_URL` and a deployer key (via `hardhat-keystore` or environment).
Keep a single Solidity profile in `hardhat.config.ts`; verification fails with several.
