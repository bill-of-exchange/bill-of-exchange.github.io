---
sidebar_position: 2
title: Functions by role
---

# Functions by role

Amounts are always counted in **bills**, the smallest units of the token: `amount = 1000` means 1000 bills, that is ₪10.00. Functions restricted to a party revert when called from any other address; the restriction is enforced by the contract itself, not by this website.

## Anyone: reading the registry

| Function | Returns |
|---|---|
| `balanceOf(account)` | accepted bills held by `account` |
| `balanceOfUnaccepted(account)` | unaccepted bills held by `account` |
| `totalSupply()` | all accepted bills in existence |
| `totalSupplyOfUnaccepted()` | all unaccepted bills in existence |
| `DRAWER_NAME`, `DRAWEE_NAME`, `ORDER`, `TIME_OF_PAYMENT`, `SUM_PER_BILL`, `CURRENCY` | the terms on the face of the bill |
| `DESCRIPTION`, `LEGAL_SIGNATURE_STATEMENT`, `KYC_AND_AML_NOTICE` | statements recorded with every bill |
| `DRAWER_ETH_ADDRESS`, `DRAWEE_ETH_ADDRESS` | the addresses of the drawer and the drawee |
| `CONTRACT_VERSION`, `name()`, `symbol()`, `decimals()` | version and token metadata |

## Drawer

| Function | Effect |
|---|---|
| `draw(amount)` | creates `amount` new unaccepted bills in the drawer's unaccepted balance |

## Drawee

| Function | Effect |
|---|---|
| `accept(amount)` | accepts `amount` unaccepted bills held by the drawee |
| `acceptOn(holder, amount)` | accepts `amount` unaccepted bills held by `holder`; the bills stay with `holder` |

## Holder of unaccepted bills

| Function | Effect |
|---|---|
| `transferOfUnaccepted(to, amount)` | passes unaccepted bills to `to` |
| `burnOfUnaccepted(amount)` | destroys the caller's unaccepted bills |

## Holder of accepted bills

| Function | Effect |
|---|---|
| `transfer(to, amount)` | passes accepted bills to `to` |
| `approve(spender, amount)`, `transferFrom(from, to, amount)` | lets another address move bills on the holder's behalf |
| `transferAndCall`, `transferFromAndCall`, `approveAndCall` | ERC-1363: the same, notifying a receiving contract |
| `burn(amount)`, `burnFrom(account, amount)` | destroys accepted bills |

## Events

| Event | Emitted when |
|---|---|
| `Draw(amount)` | the drawer draws bills |
| `TransferOfUnaccepted(from, to, amount)` | unaccepted bills change hands |
| `BurnOfUnaccepted(holder, amount)` | unaccepted bills are destroyed |
| `Acceptance(holder, amount)` | the drawee accepts bills (no `Transfer` event: see [How it works](./how-it-works.md)) |
| `Transfer(from, to, amount)` | accepted bills change hands or are destroyed (ERC-20) |
| `Approval(owner, spender, amount)` | an allowance is set (ERC-20) |
