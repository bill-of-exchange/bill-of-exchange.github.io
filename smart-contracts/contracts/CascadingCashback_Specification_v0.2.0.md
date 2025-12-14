# CascadingCashback Smart Contract Specification

**Version:** 0.1.0  
**Status:** Draft  
**Date:** December 2024  
**Author:** [Viktor Ageyev](https://github.com/ageyev)  
**Repository:** https://github.com/bill-of-exchange/bill-of-exchange.github.io

---

## Table of Contents 

1. [Overview](#1-overview)
2. [Definitions and Units](#2-definitions-and-units)
3. [Roles](#3-roles)
4. [Sale Parameters](#4-sale-parameters)
5. [Cashback Calculation](#5-cashback-calculation)
6. [State Model](#6-state-model)
7. [Invariants](#7-invariants)
8. [Functions](#8-functions)
9. [Events](#9-events)
10. [Security Considerations](#10-security-considerations)
11. [Design Decisions](#11-design-decisions)
12. [Future Roadmap (Non-Normative)](#12-future-roadmap-non-normative)
13. [Appendix: Calculation Examples](#13-appendix-calculation-examples)

---

## 1. Overview

### 1.1 Purpose

CascadingCashback is a smart contract module that implements a token sale with a tiered cashback mechanism. Buyers receive cashback (in the same token being sold) based on the global sale position at the time of purchase. Earlier buyers receive higher cashback rates, creating an incentive for early participation.

The contract is designed as a **universal module** that works with any standard ERC-20 token.

### 1.2 Concept

The sale progresses through five stages. As more tokens are sold globally, the cashback rate decreases:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CASCADING CASHBACK MODEL                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Stage 1:  tokens      1 –     1,000  →  20% cashback          │
│   Stage 2:  tokens  1,001 –    10,000  →  15% cashback          │
│   Stage 3:  tokens 10,001 –   100,000  →  10% cashback          │
│   Stage 4:  tokens 100,001 –  600,000  →   5% cashback          │
│   Stage 5:  tokens 600,001 – 1,000,000 →   0% cashback          │
│                                                                 │
│   Cashback accrues immediately but can only be withdrawn        │
│   after the sale is complete (all tokens sold).                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Scope of this version

This specification describes a **proof-of-concept** implementation:

- **No payment processing** — `purchase()` distributes tokens without requiring payment
- **Fixed parameters** — token quantity and cashback tiers are hardcoded
- **No pause/cancel** — sale progresses forward until completion
- **Universal module** — works with any standard ERC-20 token

### 1.4 Out of Scope

The following are **explicitly not part of this specification**:

| Category             | What is excluded                                            |
|----------------------|-------------------------------------------------------------|
| **Payment**          | On-chain payment in ETH, stablecoins, or other tokens       |
| **Fiat integration** | Stripe, bank transfers, card processing                     |
| **Identity**         | KYC verification, whitelisting, access control beyond Owner |
| **Token issuance**   | Minting, burning, or managing the underlying ERC-20 token   |
| **Upgradeability**   | Proxy patterns, parameter changes after deployment          |
| **Regulatory**       | Jurisdiction-specific compliance, securities classification |

### 1.5 Integration Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRODUCTION FLOW                            │
│                                                                 │
│   User                                                          │
│     │                                                           │
│     ▼                                                           │
│   Payment (Stripe / Bank / Crypto)                              │
│     │                                                           │
│     ▼                                                           │
│   Backend (verifies payment)                                    │
│     │                                                           │
│     ▼                                                           │
│   purchaseFor(recipient, amount)  ──────►  CascadingCashback    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        DEMO FLOW                                │
│                                                                 │
│   User  ──────►  purchase(amount)  ──────►  CascadingCashback   │
│                  (no payment required)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.6 Cashback Lifecycle

The cashback mechanism follows a strict three-phase lifecycle:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   ACCRUAL    │ ───► │  COMPLETION  │ ───► │    CLAIM     │
│    PHASE     │      │    PHASE     │      │    PHASE     │
├──────────────┤      ├──────────────┤      ├──────────────┤
│ Sale active  │      │ Sale ended   │      │ Users claim  │
│ Users buy    │      │ All tokens   │      │ their        │
│ Cashback     │      │ sold         │      │ cashback     │
│ accrues      │      │ Claims open  │      │              │
└──────────────┘      └──────────────┘      └──────────────┘
```

---

## 2. Definitions and Units

### 2.1 Token Units

All numeric values in this contract represent **raw token units** (the smallest indivisible unit of the ERC-20 token).

| Term               | Definition                                                    |
|--------------------|---------------------------------------------------------------|
| **Raw unit**       | The smallest unit of the token (1 in internal representation) |
| **Human-readable** | Raw units ÷ 10^decimals                                       |

**Conversion examples:**

| Token decimals | Raw units | Human-readable |
|----------------|-----------|----------------|
| 18             | 1,000,000 | 0.000000000001 |
| 2              | 1,000,000 | 10,000.00      |
| 0              | 1,000,000 | 1,000,000      |

### 2.2 Key Terms

| Term                   | Definition                                                |
|------------------------|-----------------------------------------------------------|
| **Sale**               | The process of distributing tokens to buyers              |
| **Purchase**           | Acquisition of tokens via `purchase()` or `purchaseFor()` |
| **Cashback**           | Additional tokens awarded based on purchase timing        |
| **Stage**              | A range of token indices with a fixed cashback rate       |
| **Cashback liability** | Total cashback owed but not yet withdrawn                 |
| **Sale completion**    | State when tokensSold = TOKENS_FOR_SALE                   |
| **Splitting**          | Dividing a cross-stage purchase for cashback calculation  |

---

## 3. Roles

### 3.1 Owner (Admin)

The address that deployed the contract. Implements standard Ownable pattern.

**Capabilities:**

| Action                      | Function                 | When allowed          |
|-----------------------------|--------------------------|-----------------------|
| Purchase on behalf of users | `purchaseFor()`          | During sale           |
| Withdraw excess tokens      | `withdrawExcessTokens()` | After sale completion |
| Transfer ownership          | `transferOwnership()`    | Anytime               |

**Limitations:**

The Owner **cannot**:
- Change sale parameters (TOKENS_FOR_SALE, stage boundaries, rates)
- Withdraw tokens reserved for cashback obligations
- Pause or cancel the sale
- Modify the token address

### 3.2 Buyer

Any Ethereum address that purchases tokens.

**Capabilities:**

| Action                    | Function                | When allowed          |
|---------------------------|-------------------------|-----------------------|
| Purchase tokens           | `purchase()`            | During sale           |
| Withdraw partial cashback | `withdrawCashback()`    | After sale completion |
| Withdraw all cashback     | `withdrawAllCashback()` | After sale completion |
| View balances             | View functions          | Anytime               |

### 3.3 Token Depositor

**Any address** can send tokens to the contract. This allows flexibility in treasury management (e.g., multi-sig wallets, separate funding address).

---

## 4. Sale Parameters

### 4.1 Constants

| Constant          | Value     | Description                            |
|-------------------|-----------|----------------------------------------|
| `TOKENS_FOR_SALE` | 1,000,000 | Total raw units available for purchase |
| `STAGE1_END`      | 1,000     | End of 20% cashback stage              |
| `STAGE2_END`      | 10,000    | End of 15% cashback stage              |
| `STAGE3_END`      | 100,000   | End of 10% cashback stage              |
| `STAGE4_END`      | 600,000   | End of 5% cashback stage               |

### 4.2 Cashback Tiers

| Stage     | Token Range         | Tokens in Stage | Rate | Max Cashback |
|-----------|---------------------|-----------------|------|--------------|
| 1         | 1 – 1,000           | 1,000           | 20%  | 200          |
| 2         | 1,001 – 10,000      | 9,000           | 15%  | 1,350        |
| 3         | 10,001 – 100,000    | 90,000          | 10%  | 9,000        |
| 4         | 100,001 – 600,000   | 500,000         | 5%   | 25,000       |
| 5         | 600,001 – 1,000,000 | 400,000         | 0%   | 0            |
| **Total** |                     | **1,000,000**   |      | **35,550**   |

### 4.3 Funding Requirements

| Requirement                  | Amount        | Calculation                   |
|------------------------------|---------------|-------------------------------|
| Tokens for sale              | 1,000,000     | Fixed                         |
| Maximum cashback liability   | 35,550        | Sum of max cashback per stage |
| **Minimum contract balance** | **1,035,550** | Sale + max cashback           |

---

## 5. Cashback Calculation

### 5.1 Core Principle

Cashback is determined by the **global sale position**, not individual purchase history. 
Each token has a fixed cashback rate based on its index in the sale sequence.

### 5.2 Algorithm

(Expressed in [Pseudocode](https://en.wikipedia.org/wiki/Pseudocode)):

```
function calculateCashback(amount, soldBefore):
    cashback = 0
    remaining = amount
    currentPosition = soldBefore
    
    // Process each stage that the purchase spans
    for each stage in [Stage1, Stage2, Stage3, Stage4, Stage5]:
        if remaining == 0:
            break
        if currentPosition >= stage.end:
            continue
            
        // How many tokens fall within this stage?
        tokensInStage = min(remaining, stage.end - currentPosition)
        
        // Calculate cashback for this segment
        cashback += tokensInStage * stage.rate / 100
        
        // Advance position
        currentPosition += tokensInStage
        remaining -= tokensInStage
    
    return cashback
```

### 5.3 Splitting Logic

When a purchase spans multiple stages, it is **split** at stage boundaries. Each segment receives the cashback rate of its respective stage.

**Example:** Purchase of 500 tokens when 800 already sold:
- Segment 1: tokens 801–1,000 (200 tokens) at 20%
- Segment 2: tokens 1,001–1,300 (300 tokens) at 15%
- Total: calculated separately, then summed

### 5.4 Rounding

Integer division is used. Fractional cashback is **truncated** (rounded down).

```
cashback = tokensInSegment * rate / 100  // Integer division
```

**Example:** 7 tokens × 15% = 7 × 15 / 100 = 105 / 100 = **1** (not 1.05)

---

## 6. State Model

### 6.1 Immutable State

| Variable  | Type   | Description                 |
|-----------|--------|-----------------------------|
| `token`   | IERC20 | The ERC-20 token being sold |

### 6.2 Sale State

| Variable               | Type    | Description                              |
|------------------------|---------|------------------------------------------|
| `tokensSold`           | uint256 | Total tokens purchased so far            |
| `totalCashbackAccrued` | uint256 | Sum of all cashback earned (lifetime)    |
| `totalCashbackClaimed` | uint256 | Sum of all cashback withdrawn (lifetime) |

### 6.3 Per-Buyer Accounting

| Mapping                    | Type    | Description                   |
|----------------------------|---------|-------------------------------|
| `purchased[address]`       | uint256 | Tokens purchased by address   |
| `cashbackAccrued[address]` | uint256 | Cashback earned by address    |
| `cashbackClaimed[address]` | uint256 | Cashback withdrawn by address |

### 6.4 Derived Values (View Functions)

| Value                           | Calculation                                   | Description               |
|---------------------------------|-----------------------------------------------|---------------------------|
| `tokensLeftForSale()`           | TOKENS_FOR_SALE − tokensSold                  | Remaining tokens          |
| `saleFinished()`                | tokensSold ≥ TOKENS_FOR_SALE                  | Sale completion status    |
| `getCashbackLiability()`        | totalCashbackAccrued − totalCashbackClaimed   | Unpaid obligations        |
| `getWithdrawableCashback(addr)` | cashbackAccrued[addr] − cashbackClaimed[addr] | User's claimable amount   |
| `getExcessTokens()`             | balance − getCashbackLiability()              | Owner-withdrawable tokens |

### 6.5 Liability Tracking

Cashback is modeled as a **financial liability** of the contract:

```
┌───────────────────────────────────────────────────────────────────┐
│                    LIABILITY ACCOUNTING                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   When user purchases:                                            │
│     totalCashbackAccrued += cashbackEarned                        │
│     cashbackAccrued[user] += cashbackEarned                       │
│     → Liability INCREASES                                         │
│                                                                   │
│   When user claims:                                               │
│     totalCashbackClaimed += amount                                │
│     cashbackClaimed[user] += amount                               │
│     → Liability DECREASES                                         │
│                                                                   │
│   Current liability = totalCashbackAccrued - totalCashbackClaimed │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 7. Invariants

These conditions **must hold true** at the end of every transaction. Violation indicates a bug.

### 7.1 Cap Integrity

```
tokensSold ≤ TOKENS_FOR_SALE
```

The contract cannot sell more tokens than allocated.

### 7.2 Solvency Invariant

```
token.balanceOf(address(this)) ≥ getCashbackLiability()
```

The contract must always hold enough tokens to cover all unpaid cashback obligations.

**Enforcement:** `withdrawExcessTokens()` checks this before allowing Owner withdrawal.

### 7.3 Liability Conservation

```
getCashbackLiability() == Σ(cashbackAccrued[addr] - cashbackClaimed[addr]) for all addresses
```

Global liability must equal the sum of individual liabilities.

### 7.4 Claim Integrity

```
cashbackClaimed[addr] ≤ cashbackAccrued[addr]  // For all addresses
```

No address can claim more cashback than accrued.

### 7.5 Sale Monotonicity

```
tokensSold can only increase (never decrease)
```

Sales cannot be reversed.

---

## 8. Functions

### 8.1 Purchase Functions

#### `purchase(uint256 amount)`

Purchases tokens for the caller.

| Aspect            | Specification                                                               |
|-------------------|-----------------------------------------------------------------------------|
| **Access**        | Anyone                                                                      |
| **Preconditions** | Sale not finished; amount > 0; amount ≤ tokensLeftForSale()                 |
| **State changes** | tokensSold ↑; purchased[msg.sender] ↑; cashback accrued                     |
| **Interactions**  | Transfers `amount` tokens to msg.sender                                     |
| **Events**        | `TokensPurchased`, possibly `CashbackRateChanged`, possibly `SaleCompleted` |

#### `purchaseFor(address recipient, uint256 amount)`

Purchases tokens on behalf of another address. Intended for backend integration.
Can be called by Owner only. 

| Aspect            | Specification                                                                       |
|-------------------|-------------------------------------------------------------------------------------|
| **Access**        | Owner only                                                                          |
| **Preconditions** | Sale not finished; amount > 0; amount ≤ tokensLeftForSale(); recipient ≠ address(0) |
| **State changes** | Same as `purchase()`, but credited to `recipient`                                   |
| **Events**        | `TokensPurchased` (with initiatedBy = msg.sender)                                   |

### 8.2 Cashback Withdrawal Functions

#### `withdrawCashback(uint256 amount)`

Withdraws a specified amount of accrued cashback.

| Aspect            | Specification                                                           |
|-------------------|-------------------------------------------------------------------------|
| **Access**        | Anyone with withdrawable cashback                                       |
| **Preconditions** | Sale finished; amount > 0; amount ≤ getWithdrawableCashback(msg.sender) |
| **State changes** | cashbackClaimed[msg.sender] ↑; totalCashbackClaimed ↑                   |
| **Interactions**  | Transfers `amount` tokens to msg.sender                                 |
| **Events**        | `CashbackClaimed`                                                       |

#### `withdrawAllCashback()`

Withdraws all available cashback for the caller.

| Aspect             | Specification                                                 |
|--------------------|---------------------------------------------------------------|
| **Access**         | Anyone with withdrawable cashback                             |
| **Preconditions**  | Sale finished; getWithdrawableCashback(msg.sender) > 0        |
| **Implementation** | Calls `withdrawCashback(getWithdrawableCashback(msg.sender))` |
| **Events**         | `CashbackClaimed`                                             |

### 8.3 Owner Functions

#### `withdrawExcessTokens(address to, uint256 amount)`

Withdraws tokens not needed for cashback obligations.

| Aspect             | Specification                                                          |
|--------------------|------------------------------------------------------------------------|
| **Access**         | Owner only                                                             |
| **Preconditions**  | Sale finished; to ≠ address(0); amount > 0; amount ≤ getExcessTokens() |
| **Solvency check** | Verifies: balance − amount ≥ getCashbackLiability()                    |
| **Interactions**   | Transfers `amount` tokens to `to`                                      |

#### `transferOwnership(address newOwner)`

Transfers contract ownership.

| Aspect            | Specification          |
|-------------------|------------------------|
| **Access**        | Owner only             |
| **Preconditions** | newOwner ≠ address(0)  |
| **Events**        | `OwnershipTransferred` |

### 8.4 View Functions

#### Sale Status

| Function                | Returns | Description                |
|-------------------------|---------|----------------------------|
| `token()`               | address | ERC-20 token address       |
| `tokensSold()`          | uint256 | Total tokens sold          |
| `tokensLeftForSale()`   | uint256 | Remaining tokens           |
| `saleFinished()`        | bool    | True if all tokens sold    |
| `currentCashbackRate()` | uint256 | Rate (0–20) for next token |
| `currentStage()`        | uint256 | Current stage (1–5)        |

#### Buyer Information

| Function                           | Returns | Description                 |
|------------------------------------|---------|-----------------------------|
| `purchased(address)`               | uint256 | Tokens purchased by address |
| `cashbackAccrued(address)`         | uint256 | Total cashback earned       |
| `cashbackClaimed(address)`         | uint256 | Cashback already withdrawn  |
| `getWithdrawableCashback(address)` | uint256 | Available to withdraw       |

#### Contract State

| Function                 | Returns | Description               |
|--------------------------|---------|---------------------------|
| `getTokenBalance()`      | uint256 | Contract's token balance  |
| `getCashbackLiability()` | uint256 | Total unpaid cashback     |
| `getExcessTokens()`      | uint256 | Owner-withdrawable amount |

#### Constants

| Function            | Returns | Description |
|---------------------|---------|-------------|
| `TOKENS_FOR_SALE()` | uint256 | 1,000,000   |
| `STAGE1_END()`      | uint256 | 1,000       |
| `STAGE2_END()`      | uint256 | 10,000      |
| `STAGE3_END()`      | uint256 | 100,000     |
| `STAGE4_END()`      | uint256 | 600,000     |

---

## 9. Events

### 9.1 Sale Events

#### `SaleInitialized`

Emitted once at deployment.

```solidity
event SaleInitialized(address indexed token, uint256 tokensForSale);
```

#### `TokensPurchased`

Emitted for every purchase.

```solidity
event TokensPurchased(
    address indexed buyer,
    uint256 amount,
    uint256 cashbackEarned,
    address indexed initiatedBy  // msg.sender who called the function
);
```

The `initiatedBy` field enables audit trail distinction between:
- Direct purchases: `initiatedBy == buyer`
- Admin purchases: `initiatedBy == owner`, `buyer == recipient`

#### `CashbackRateChanged`

Emitted when a purchase causes the marginal rate to change.

```solidity
event CashbackRateChanged(
    uint256 previousRate,
    uint256 newRate,
    uint256 tokensSoldAfter
);
```

#### `SaleCompleted`

Emitted once when the last token is sold.

```solidity
event SaleCompleted(uint256 totalSold, uint256 totalCashbackLiability);
```

### 9.2 Claim Events

#### `CashbackClaimed`

Emitted when a buyer withdraws cashback.

```solidity
event CashbackClaimed(address indexed buyer, uint256 amount);
```

### 9.3 Admin Events

#### `OwnershipTransferred`

Standard Ownable event.

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
```

---

## 10. Security Considerations

### 10.1 Reentrancy

**Mitigations:**
1. **ReentrancyGuard** modifier on all state-changing functions with external calls
2. **Checks-Effects-Interactions (CEI)** pattern: all state updates before token transfers

```
// Correct order in withdrawCashback():
1. CHECKS:  require(saleFinished()); require(amount <= withdrawable);
2. EFFECTS: cashbackClaimed[msg.sender] += amount; totalCashbackClaimed += amount;
3. INTERACTIONS: token.transfer(msg.sender, amount);
```

### 10.2 Token Compatibility

**Supported:** Standard ERC-20 tokens that:
- Return `true` on successful `transfer()`
- Do not have fee-on-transfer mechanics
- Do not have rebasing mechanics

**Not supported:** Non-standard tokens. If integration with non-standard tokens is required, a separate contract version must be developed.

### 10.3 Integer Overflow

Solidity 0.8.x provides built-in overflow protection. No additional checks required.

### 10.4 Access Control

- Owner functions protected by `onlyOwner` modifier
- No arbitrary code execution
- No `selfdestruct` or `delegatecall`

### 10.5 Denial of Service

- No loops over unbounded arrays
- Cashback withdrawal is pull-based (users claim), not push-based
- No reliance on external contract state for core operations

### 10.6 Front-Running

Purchase order may be affected by front-running (attacker purchases first to get higher cashback). This is **inherent to the tiered model** and considered acceptable because:
- The mechanism is transparent
- Front-running does not steal funds, only gets a slightly better rate
- Mitigation would add significant complexity

### 10.7 Solvency Guarantee

The `withdrawExcessTokens()` function enforces the Solvency Invariant, preventing Owner from withdrawing tokens needed for cashback obligations.

**Owner responsibility:** Ensure contract holds at least 1,035,550 raw units before sale begins.

---

## 11. Design Decisions

This section documents architectural choices, their rationale, and alternatives considered.

### 11.1 Raw Units vs Human-Readable

| Aspect           | Decision                                                 |
|------------------|----------------------------------------------------------|
| **Choice**       | All values in raw token units                            |
| **Rationale**    | Simplicity; no rounding errors; universal for any ERC-20 |
| **Alternative**  | Contract reads token.decimals() and adjusts              |
| **Why rejected** | Adds complexity and gas; mixes presentation with logic   |

### 11.2 No Balance Verification at Deployment

| Aspect           | Decision                                                               |
|------------------|------------------------------------------------------------------------|
| **Choice**       | Contract does not verify token balance at construction                 |
| **Rationale**    | Flexibility — tokens can be deposited after deployment, by any address |
| **Alternative**  | Require deposit in constructor                                         |
| **Why rejected** | Limits deployment flexibility; complicates multi-sig workflows         |

### 11.3 No Pause/Cancel Functionality

| Aspect           | Decision                                                     |
|------------------|--------------------------------------------------------------|
| **Choice**       | Sale can only progress forward until completion              |
| **Rationale**    | Simplicity; reduced attack surface; "code is law" philosophy |
| **Alternative**  | OpenZeppelin Pausable pattern                                |
| **Why rejected** | Adds centralization risk; not needed for PoC                 |
| **Future**       | May add in production version if business requires           |

### 11.4 No Purchase Limits

| Aspect           | Decision                                            |
|------------------|-----------------------------------------------------|
| **Choice**       | No minimum, maximum, or per-address limits          |
| **Rationale**    | No business reason to limit; simpler implementation |
| **Implication**  | Single buyer could purchase entire sale             |
| **Alternative**  | Per-transaction caps; per-address caps; whitelist   |
| **Why rejected** | Complexity; limits better enforced at backend level |

### 11.5 Payment Model

| Aspect              | Decision                                                      |
|---------------------|---------------------------------------------------------------|
| **Choice**          | `purchase()` requires no payment; `purchaseFor()` for backend |
| **Rationale**       | v0.1.0 is proof-of-concept; payments handled off-chain        |
| **Demo flow**       | User calls `purchase()` directly                              |
| **Production flow** | User pays off-chain → Backend calls `purchaseFor()`           |
| **Alternative**     | Accept ETH or stablecoin on-chain                             |
| **Why rejected**    | Complexity; regulatory implications                           |

### 11.6 Partial Cashback Withdrawal

| Aspect             | Decision                                                    |
|--------------------|-------------------------------------------------------------|
| **Choice**         | Both `withdrawCashback(amount)` and `withdrawAllCashback()` |
| **Rationale**      | User flexibility                                            |
| **Implementation** | `withdrawAllCashback()` wraps `withdrawCashback()`          |
| **Alternative**    | Only full withdrawal                                        |
| **Why rejected**   | Unnecessarily restrictive                                   |

### 11.7 Cashback Claim Timing

| Aspect           | Decision                                        |
|------------------|-------------------------------------------------|
| **Choice**       | Cashback claimable only after sale completion   |
| **Rationale**    | Prevents gaming; simplifies solvency guarantees |
| **Implication**  | Buyers wait for full sale                       |
| **Alternative**  | Immediate withdrawal                            |
| **Why rejected** | Complexity, not needed in PoC                   |

### 11.8 Ownable Pattern

| Aspect           | Decision                                          |
|------------------|---------------------------------------------------|
| **Choice**       | Standard Ownable with transferOwnership           |
| **Rationale**    | Familiar pattern; allows admin recovery scenarios |
| **Alternative**  | Immutable admin address                           |
| **Why rejected** | Less flexible for production scenarios            |
| **Future**       | May switch to immutable for trustless version     |

### 11.9 ERC-20 Compatibility

| Aspect            | Decision                                    |
|-------------------|---------------------------------------------|
| **Choice**        | Only standard ERC-20 tokens supported       |
| **Rationale**     | Simplicity; predictable behavior            |
| **Not supported** | Fee-on-transfer; rebasing; non-bool returns |
| **Alternative**   | SafeERC20 wrapper                           |
| **Why rejected**  | Not needed for intended use case            |

### 11.10 Event Traceability

| Aspect           | Decision                                               |
|------------------|--------------------------------------------------------|
| **Choice**       | `TokensPurchased` includes `initiatedBy` field         |
| **Rationale**    | Distinguishes direct purchases from admin-initiated    |
| **Use case**     | Audit trail; analytics; compliance                     |
| **Alternative**  | Separate events for `purchase()` and `purchaseFor()`   |
| **Why rejected** | Single event simpler; `initiatedBy` provides same info |

---

## 12. Future Roadmap (Non-Normative)

> **Note:** This section is descriptive and non-binding. It outlines potential future extensions that are explicitly out of scope for v0.1.0.

### 12.1 Stage-Based Cashback Availability

Cashback for each stage becomes claimable when that stage completes, even if overall sale is not finished.

**Motivation:** Reduce risk for early buyers if sale doesn't complete.

### 12.2 Time-Based Sale Completion

Sale finishes when either:
- All tokens sold, OR
- `block.timestamp >= saleEndTime`

**Motivation:** Allow honest closure and cashback claims with partial sale volume.

### 12.3 Configurable Parameters

Stage boundaries and rates passed to constructor instead of hardcoded.

**Motivation:** Reusable contract for different sale configurations.

### 12.4 On-Chain Payment

Accept ETH or stablecoins as payment, with price oracle integration.

**Motivation:** Fully on-chain sales without backend dependency.

### 12.5 Trustless Admin

Replace Ownable with immutable admin address. Limited strictly to `purchaseFor()`.

**Motivation:** Reduced trust assumptions; stronger "code is law" guarantees.

---

## 13. Appendix: Calculation Examples

### Example 1: Simple Single-Stage Purchase

**Scenario:** First purchase, 500 tokens.

| Parameter         | Value |
|-------------------|-------|
| tokensSold before | 0     |
| amount            | 500   |
| Stage             | 1     |
| Rate              | 20%   |

**Calculation:**
```
cashback = 500 × 20 / 100 = 100
```

**Result:** 500 tokens purchased, 100 cashback accrued.

---

### Example 2: Cross-Stage Purchase (Two Stages)

**Scenario:** Purchase 500 tokens when 800 already sold.

| Segment   | Tokens  | Range       | Stage | Rate  | Cashback |
|-----------|---------|-------------|-------|-------|----------|
| 1         | 200     | 801–1,000   | 1     | 20%   | 40       |
| 2         | 300     | 1,001–1,300 | 2     | 15%   | 45       |
| **Total** | **500** |             |       |       | **85**   |

**Result:** 500 tokens purchased, 85 cashback accrued.

---

### Example 3: Cross-Stage Purchase (Three Stages)

**Scenario:** Purchase 20,000 tokens when 9,000 already sold.

| Segment   | Tokens     | Range         | Stage | Rate | Cashback  |
|-----------|------------|---------------|-------|------|-----------|
| 1         | 1,000      | 9,001–10,000  | 2     | 15%  | 150       |
| 2         | 19,000     | 10,001–29,000 | 3     | 10%  | 1,900     |
| **Total** | **20,000** |               |       |      | **2,050** |

**Result:** 20,000 tokens purchased, 2,050 cashback accrued.

---

### Example 4: Stage 5 Purchase (Zero Cashback)

**Scenario:** Purchase 10,000 tokens when 700,000 already sold.

| Parameter         | Value   |
|-------------------|---------|
| tokensSold before | 700,000 |
| amount            | 10,000  |
| Stage             | 5       |
| Rate              | 0%      |

**Calculation:**
```
cashback = 10,000 × 0 / 100 = 0
```

**Result:** 10,000 tokens purchased, 0 cashback accrued.

---

### Example 5: Rounding (Truncation)

**Scenario:** Purchase 7 tokens in Stage 2.

| Parameter | Value |
|-----------|-------|
| amount    | 7     |
| Rate      | 15%   |

**Calculation:**
```
cashback = 7 × 15 / 100 = 105 / 100 = 1  (integer division)
```

**Result:** 7 tokens purchased, 1 cashback accrued (not 1.05).

---

### Example 6: Maximum Cashback Scenario

**Scenario:** All 1,000,000 tokens purchased sequentially.

| Stage     | Tokens        | Rate | Cashback   |
|-----------|---------------|------|------------|
| 1         | 1,000         | 20%  | 200        |
| 2         | 9,000         | 15%  | 1,350      |
| 3         | 90,000        | 10%  | 9,000      |
| 4         | 500,000       | 5%   | 25,000     |
| 5         | 400,000       | 0%   | 0          |
| **Total** | **1,000,000** |      | **35,550** |

**Minimum contract funding:** 1,000,000 + 35,550 = **1,035,550 tokens**

---

### Example 7: Multiple Sequential Buyers

**Scenario:** Three buyers purchase in sequence.

| Buyer | Before | Amount | Stage(s) | Cashback |
|-------|--------|--------|----------|----------|
| Alice | 0      | 1,000  | 1        | 200      |
| Bob   | 1,000  | 9,000  | 2        | 1,350    |
| Carol | 10,000 | 90,000 | 3        | 9,000    |

**State after:**
- tokensSold = 100,000
- totalCashbackAccrued = 10,550
- currentStage = 4
- currentCashbackRate = 5%

---

### Example 8: Partial Cashback Withdrawal

**Scenario:** Alice has 200 cashback accrued, withdraws 50.

**Before:**
- cashbackAccrued[Alice] = 200
- cashbackClaimed[Alice] = 0
- getWithdrawableCashback(Alice) = 200

**After withdrawCashback(50):**
- cashbackAccrued[Alice] = 200 (unchanged)
- cashbackClaimed[Alice] = 50
- getWithdrawableCashback(Alice) = 150

---

*End of Specification*
