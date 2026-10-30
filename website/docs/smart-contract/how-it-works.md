---
sidebar_position: 1
title: How it works
---

# How the contract works

The `BillsOfExchange` smart contract keeps a registry of electronic bills of exchange on Ethereum. It is designed to meet the definition of a bill of exchange in the [UK Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) and to hold the bills in electronic form under the [Electronic Communications Act 2000](https://www.legislation.gov.uk/ukpga/2000/7) and the [Electronic Trade Documents Act 2023](https://www.legislation.gov.uk/ukpga/2023/38).

This page is an overview. The authoritative description of the legal model, the invariants and the design decisions is the [specification](https://github.com/bill-of-exchange/bill-of-exchange.github.io/blob/master/smart-contracts/contracts/BillOfExchange_Specification.v.0.1.0.md).

:::warning[Test networks]
Ethereum test networks are never valid registries for real bills of exchange. Every deployment listed on this site so far is a demonstration, and the names of the parties in it are placeholders.
:::

## One unit, one bill

Every smallest unit of the token is one separate bill of exchange for **0.01 Israeli new shekel** (one agora), payable **to bearer, at sight**. The contract reports `decimals() = 2`, so a wallet shows 1000 bills as 10.00.

The terms of the bill are public constants of the contract, readable by anyone: the order to pay (`ORDER`), the parties (`DRAWER_NAME`, `DRAWEE_NAME`), the time of payment, the sum and the currency, and the statements recorded with every bill (`DESCRIPTION`, `LEGAL_SIGNATURE_STATEMENT`, `KYC_AND_AML_NOTICE`).

## The parties

| Party | Who | What it does in the contract |
|---|---|---|
| **Drawer** | the person who gives the order to pay; its address is fixed in `DRAWER_ETH_ADDRESS` | draws (issues) new bills |
| **Drawee** | the person to whom the order is addressed, for example a bank; its address is fixed in `DRAWEE_ETH_ADDRESS` | accepts bills, and thereby becomes primarily liable on them |
| **Bearer** | whoever holds the bills: the owner of the Ethereum address that holds them | transfers bills, presents them for payment |

The signature of a party is the signature of the Ethereum transaction that calls the corresponding function of the contract (see `LEGAL_SIGNATURE_STATEMENT`).

## Two ledgers: unaccepted and accepted bills

A bill exists in exactly one of two states, and the contract keeps a separate ledger for each.

| | Unaccepted bills | Accepted bills |
|---|---|---|
| Liable party | the drawer only | the drawee (primarily) |
| Interface | functions of this contract only | standard ERC-20 and ERC-1363 |
| Visible in wallet apps | no: use this site or a block explorer | yes, as a token balance |
| Balance and total | `balanceOfUnaccepted`, `totalSupplyOfUnaccepted` | `balanceOf`, `totalSupply` |

Acceptance moves bills from the first ledger to the second. It does not create new bills and does not move them to another holder: the same bills only change their legal status. That is why acceptance emits the contract's own `Acceptance` event and no ERC-20 `Transfer` event; the specification (§4.5.3) explains this choice and what it costs.

## The life of a bill

1. **Drawing.** The drawer calls `draw(amount)`. New unaccepted bills appear in the drawer's unaccepted balance.
2. **Delivery to the drawee.** The drawer passes the unaccepted bills to the drawee with `transferOfUnaccepted(drawee, amount)`. This is the intended path; the contract deliberately does not forbid other recipients, to keep room for other business models.
3. **Acceptance.** The drawee calls `accept(amount)` for bills it holds, or `acceptOn(holder, amount)` for bills held by someone else. The bills become accepted.
4. **Circulation.** Accepted bills move between bearers like any ERC-20 token: `transfer`, `approve` and `transferFrom`, or the ERC-1363 `transferAndCall` family.
5. **Destruction.** A holder can destroy bills it holds: `burn` for accepted bills, `burnOfUnaccepted` for unaccepted ones. Destroyed bills leave the registry permanently.

The contract rejects plain Ether transfers and calls to functions it does not have.

## Checking it yourself

The source code of every deployment is verified on Etherscan and Blockscout, so anyone can compare the code with the specification and read the registry directly. The addresses are on the [Deployments](./deployments.mdx) page.
