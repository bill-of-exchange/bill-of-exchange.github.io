# BillsOfExchange Smart Contract 

**Specification v0.1.0 (Draft)**

## 0. Status, Scope and Philosophy

This document specifies the implementation of a **bearer bill of exchange** using [distributed ledger technology (DLT)](https://en.wikipedia.org/wiki/Distributed_ledger) under the [UK Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) as adapted to electronic form according to the [UK Electronic Communications Act 2000](https://www.legislation.gov.uk/ukpga/2000/7) and the [UK Electronic Trade Documents Act 2023](https://www.legislation.gov.uk/ukpga/2023/30/contents). 

It contains both a description of the smart contract code and of the relevant *lex cambiaria* (law of negotiable instruments)

The contract is designed:

* **For public reading and scrutiny.** The source code and this specification are part of the legal and technical “shopfront” of the instrument.
* **For legal fidelity first, then technical convenience.** Where a tension arises between ERC-20 conventions and the legal model of a bill of exchange, the legal model wins.
* **As a stable base layer.** This spec is for `CONTRACT_VERSION = "0.1.0"` — a pre-1.0 version, but already intended to be conceptually stable. Future changes that alter the legal model or invariants must be versioned and justified explicitly.

This specification is written in Markdown and is meant to be published together with the contract code in a public repository (GitHub/GitLab).

---

## 1. Legal and Economic Model

### 1.1 Instrument Type

The contract implements a **bill of exchange**, created in electronic form, with the following characteristics:

* **Payable to bearer, not to order**

    * The bill is *not* “payable to order” and is *not* transferable by indorsement.
    * The bearer is the natural or legal person who owns the Ethereum address that currently holds the token (or the person that address holder represents off-chain).

* **Bearer nature**

    * Legal rights in the bill pass with possession: in our model, with the on-chain balance at a given address.
    * Transfer of the bill of exchange happens purely on-chain as a transfer of the bill (token) itself, **not** via indorsements written on the instrument.

* **At sight**

    * Time of payment: “at sight”.
    * There is no on-chain maturity date logic in this version.

* **Fixed nominal value, decimals = 2**

    * One smallest indivisible unit of the token (1 “raw unit”) represents one separate bill of exchange in the amount of **0.01 ILS (one agora)**.
    * `decimals = 2`. Wallets may display aggregated balances (e.g. `33.87` tokens as ₪33.87), but legally this is a bundle of 3,387 separate bills of 0.01 ILS each.

### 1.2 Parties

The relevant parties under the bill of exchange model are:

* **Drawer (legal party)**
  The drawer is the natural or legal person identified in the descriptive constants (e.g. `DRAWER_NAME`). Under [Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61), the drawer is the person who issues (draws) and signs the bill of exchange.

* **Drawer’s Ethereum address (technical representation)**
  The constant `DRAWER_ETH_ADDRESS` is the Ethereum address used by the drawer to issue (draw) bills via the `draw(...)` function. A signature of a successful transaction that calls `draw(...)` from `DRAWER_ETH_ADDRESS` is treated as the drawer’s signature for the purposes of BoEA 1882 (in particular ss.3 and 17) and the Electronic Trade Documents Act 2023 s.3.


* **Drawee / Acceptor (legal party)**
  The drawee is the natural or legal person identified in the descriptive constants (e.g. `DRAWEE_NAME`). Upon acceptance, the drawee becomes the primary obligor on the bill of exchange.

* **Drawee’s Ethereum address (technical representation)**
  The constant `DRAWEE_ETH_ADDRESS` is the Ethereum address used by the drawee to accept bills via `accept(...)` / `acceptOn(...)`. A signature of a successful transaction that calls these functions from `DRAWEE_ETH_ADDRESS` is treated as the drawee’s signature of acceptance under BoEA 1882 (especially s.17: “The mere signature of the drawee without additional words is sufficient”) and ETDA 2023 s.3.


* **Bearer / Holder**
  The bearer (in the sense of a bearer bill in *lex cambiaria*) is the person (natural or legal) who owns the Ethereum address that currently holds the relevant token balance. This person may be different from the person operating the private key in fact (e.g. custodial arrangements), but on-chain the address is the technical representation of possession.

### 1.3 Dual Liability and Two Ledgers

Under the [UK Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61), the legal status of a bill changes when it is accepted:

* Before acceptance:
    * The bill is an unconditional order given by the drawer; only the drawer is liable.
  
* After acceptance:
    * The drawee has signed the bill and becomes the primary obligor; the drawer’s liability becomes secondary (regress).

To model this correctly, the contract maintains two **equally real** on-chain ledgers:

1. **Unaccepted Bills Ledger**

    * Represents bills that have been drawn but not accepted.
    * Legally: the drawer is the only liable party.
    * Technically: balances are kept in a dedicated mapping (`balanceOfUnaccepted`) and total in `totalSupplyOfUnaccepted`.
    * There is **no ERC-20 interface** exposed for these balances: only dedicated functions (`draw`, `transferOfUnaccepted`, `burnOfUnaccepted`) operate on this ledger.


2. **Accepted Bills Ledger (ERC-20 interface)**

    * Represents bills that have been accepted by the drawee.
    * Legally: the drawee is the primary obligor; the bills behave like cash-equivalent bearer instruments within the constraints of the chosen legal system.
    * Technically: balances are standard ERC-20 balances (`balanceOf` / `totalSupply`) with the normal ERC-20 / ERC-1363 interface.

**Only accepted bills have a standard ERC-20 interface** and are visible to external tools as a fungible ERC-20 token. Unaccepted bills are tracked separately.

### 1.4 KYC / AML and Bearer Instruments

Under the [UK Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) and the traditional *lex cambiaria*, the validity and enforceability of a bill of exchange **do not depend** on performing KYC/AML checks at each transfer.

* Failure to perform KYC can create regulatory exposure under applicable AML/CFT regimes (for obliged entities), but **does not, by itself, invalidate the bill** or extinguish the drawee’s obligation to pay a duly issued and accepted bill presented by the bearer (subject to general limitations: illegality, sanctions, public policy, etc.).
* This is conceptually similar to paper cash (banknotes), which are also bearer instruments rooted in the same legal tradition.

The contract will include a public string constant, for example:

```solidity
string public constant KYC_AND_AML_NOTICE = 
    "Transfer, holding and enforcement of these bearer bills of exchange do not depend on KYC/AML checks for their legal validity under the Bills of Exchange Act 1882 and related lex cambiaria. Applicable AML/CFT and sanctions regimes may impose separate obligations on regulated entities, but failure to perform KYC/AML procedures does not, by itself, extinguish the drawee's obligation to pay a bill presented by the bearer.";
```

This is not a waiver of KYC/AML obligations; it clarifies the relationship between [UK Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) and regulatory regimes.

---

## 2. Technical Architecture

### 2.1 Solidity Version and Compiler

* Target Solidity version in this contract:

  ```solidity
  pragma solidity ^0.8.20;
  ```

* This aligns with [OpenZeppelin Contracts v5.4.0](https://github.com/OpenZeppelin/openzeppelin-contracts), which also use `^0.8.20`.

* The version can be upgraded in future with explicit review; any change to the compiler version must be treated as a minor or patch version bump of the contract (e.g. `0.1.1` or `0.2.0`).

### 2.2 Files and Directory Structure

Suggested layout:

```text
contracts/
├── libs/
│   ├── ERC20.sol           // Fork of OpenZeppelin ERC20 v5.4.0, with minimal changes
│   ├── ERC20Burnable.sol   // Fork of OpenZeppelin ERC20Burnable v5.4.0, using the forked ERC20
│   └── ERC1363.sol         // Fork of an ERC-1363 implementation, adapted to the forked ERC20
└── BillsOfExchange.sol     // Main contract implementing the legal model
```

### 2.3 Forked Libraries (“Fork & Expose” Pattern)

We deliberately **fork** OpenZeppelin’s ERC-20 implementation, but keep the public names (`ERC20`, `ERC20Burnable`) to preserve a familiar inheritance signature:

```solidity
contract BillsOfExchange is ERC20, ERC20Burnable, ERC1363 {
    ...
}
```

The forks are **minimal** and must be documented in comments at the top of each file:

* `libs/ERC20.sol` (fork of OZ ERC20):

    * Change `_balances` and `_totalSupply` from `private` to `internal`.
    * Add a clear comment explaining that this is done to allow the `BillsOfExchange` contract to perform a legal acceptance transition by directly updating these internal variables **without** emitting a `Transfer` event (no “mint from zero” semantics).
    * All other logic remains unchanged.

* `libs/ERC20Burnable.sol`:

    * Updated to inherit from the forked `ERC20` in `libs/ERC20.sol`.
    * Otherwise unchanged.

* `libs/ERC1363.sol`:

    * Updated to inherit from the forked `ERC20`.
    * Provides standard ERC-1363 functions (e.g. `transferAndCall`) for **accepted** bills only.
    * No use of ERC-1363 for unaccepted bills.

### 2.4 Inheritance and Interfaces

`BillsOfExchange` inherits:

* `ERC20` (forked): core ERC-20 logic for accepted bills;
* `ERC20Burnable` (forked): burning of accepted bills;
* `ERC1363` (forked): callbacks for advanced integrations on accepted bills.

We **do not** use:

* `Ownable` or other admin patterns — there is no on-chain owner with special powers beyond what is hard-coded via constants;
* `ERC20Permit` / EIP-2612 in this version — gasless approvals are out of scope for current implementation.

---

## 3. Public Constants and State

### 3.1 Versioning

The contract must expose its own version as a constant:

```solidity
string public constant CONTRACT_VERSION = "0.1.0";
```

Any change that affects behaviour, legal model or invariants must be accompanied by a new version string and an updated specification.

### 3.2 Parties and Legal Description

Representative examples (exact text to be finalised before deployment):

```solidity
// Technical addresses (to be hard-coded before deployment)
address public constant DRAWER_ETH_ADDRESS  = 0x...;  // Ethereum address used to call draw(...)
address public constant DRAWEE_ETH_ADDRESS  = 0x...;  // Ethereum address used to call accept/acceptOn

// Legal descriptors (immutable textual description)
string public constant DRAWER_NAME    = "Drawer Ltd., 12 Main Street, London, UK";
string public constant DRAWEE_NAME    = "Drawee Bank, 13 Dizengoff Street, Tel Aviv, Israel";

string public constant ORDER = 
    "Pay to bearer (tokenholder), but not to order, the sum of 0.01 (one hundredth) Israeli new shekel (one agora)";

string public constant TIME_OF_PAYMENT = "at sight";
string public constant CURRENCY = "ILS"; // Israeli new shekel, see https://en.wikipedia.org/wiki/ISO_4217 
string public constant SUM_PER_BILL = "0.01"; // 0.01 ILS per bill of exchange

string public constant LEGAL_SIGNATURE_STATEMENT =
    "A signature of the transaction that successfully calls corresponding functions is treated as a legally binding signature under the UK Bills of Exchange Act 1882 taking into account the provisions the UK Electronic Communications Act 2000 and the UK Electronic Trade Documents Act 2023";

string public constant DESCRIPTION =
    "Every smallest unit of this ERC-20-compatible token represents one separate bill of exchange payable to bearer, not to order, in the amount of 0.01 Israeli new shekel. The bearer is the natural or legal person who owns the Ethereum address that holds the token balance. Acceptance by the drawee is recorded on-chain and changes the legal status of the bill from unaccepted to accepted. In the case of a blockchain fork, the drawee will publicly designate which Ethereum chain is treated as the valid registry for these bills; in case of dispute, the question shall be resolved by a competent court or arbitration tribunal under the applicable lex cambiaria. All Ethereum test networks are not valid registries for real bills of exchange.";
    
string public constant KYC_AND_AML_NOTICE = 
    "Failure to perform KYC can create regulatory exposure under applicable AML/CFT regimes (for obliged entities), but does not, by itself, invalidate the bill or extinguish the drawee’s obligation to pay a duly issued and accepted bill presented by the bearer (subject to general limitations: illegality, sanctions, public policy, etc.). This is conceptually similar to paper cash (banknotes), which are also bearer instruments rooted in the same legal tradition.";
```

### 3.3 Decimals and ERC-20 Metadata

* Name: `"BillsOfExchange"` (or a more specific name if desired)
* Symbol: e.g. `unicode"₪"` for an ILS-denominated series.
* `decimals()`: fixed at `2`.

```solidity
function decimals() public pure override returns (uint8) {
    return 2;
}
```

### 3.4 Unaccepted Bills Ledger

The Unaccepted Bills Ledger tracks bills that have been drawn but not accepted.

State:

```solidity
mapping(address => uint256) private _balanceOfUnaccepted;
uint256 private _totalSupplyOfUnaccepted;
```

Public views:

```solidity
function balanceOfUnaccepted(address account) external view returns (uint256);
function totalSupplyOfUnaccepted() external view returns (uint256);
```

### 3.5 Accepted Bills Ledger (ERC-20)

Accepted bills use the standard ERC-20 internal storage:

* `_balances` and `_totalSupply` from the forked ERC-20, now `internal`.
* Public ERC-20 functions:

    * `balanceOf(address)`
    * `totalSupply()`
    * `transfer`, `approve`, `transferFrom`
    * plus ERC-1363 functions such as `transferAndCall`, etc.
    * plus burn functions from `ERC20Burnable` for accepted bills.

---

## 4. Functions

All public/external functions must be documented with NatSpec (`@notice`, `@dev`, `@param`, `@return`) emphasising both the technical behaviour and its legal meaning.

### 4.1 Constructor

```solidity
constructor()
    ERC20("BillsOfExchange", unicode"₪")
{
    // No bills are created in the constructor.
    // All bills must be explicitly drawn via draw(...).
}
```

Key points:

* **No arguments.**
* **No initial issuance.** We do not pre-issue bills in the constructor; every bill must be created through an explicit `draw(...)` call from the drawer’s address.

### 4.2 Drawing Bills (Unaccepted State)

#### 4.2.1 `draw(uint256 amount)`

* **Access control**

  ```solidity
  require(msg.sender == DRAWER_ETH_ADDRESS, "Only drawer can draw bills");
  require(amount > 0, "Amount must be greater than zero");
  ```

* **Effect**

    * Increase `_balanceOfUnaccepted[DRAWER_ETH_ADDRESS]` by `amount`.
    * Increase `_totalSupplyOfUnaccepted` by `amount`.

* **Event**

  ```solidity
  event Draw(uint256 amount);
  ```

  Emit `Draw(amount)`.

* **Legal meaning**

    * Each unit in `amount` corresponds to issuing (drawing) one new bill of exchange in the amount of 0.01 ILS.
    * The signature of the `draw` transaction from `DRAWER_ETH_ADDRESS` is treated as the drawer’s signature under BoEA 1882 and ETDA 2023.

### 4.3 Transfers of Unaccepted Bills

#### 4.3.1 `transferOfUnaccepted(address to, uint256 amount)`

* **Access**

    * Any address can transfer the unaccepted bills it holds.

* **Checks**

  ```solidity
  require(to != address(0), "Cannot transfer to zero address");
  require(amount > 0, "Amount must be greater than zero");
  require(_balanceOfUnaccepted[msg.sender] >= amount, "Insufficient unaccepted balance");
  ```

* **Effect**

  ```solidity
  _balanceOfUnaccepted[msg.sender] -= amount;
  _balanceOfUnaccepted[to] += amount;
  ```

* **Event**

  ```solidity
  event TransferOfUnaccepted(address indexed from, address indexed to, uint256 amount);
  ```

* **Legal meaning**

    * This models transfer of possession of **unaccepted** bills of exchange between parties.
    * Liability remains with the drawer; drawee is not yet bound.

### 4.4 Burning Unaccepted Bills

#### 4.4.1 `burnOfUnaccepted(uint256 amount)`

* **Access**

    * Any holder of unaccepted bills may burn them.

* **Checks**

  ```solidity
  require(amount > 0, "Amount must be greater than zero");
  require(_balanceOfUnaccepted[msg.sender] >= amount, "Insufficient unaccepted balance");
  ```

* **Effect**

  ```solidity
  _balanceOfUnaccepted[msg.sender] -= amount;
  _totalSupplyOfUnaccepted -= amount;
  ```

* **Event**

  ```solidity
  event BurnOfUnaccepted(address indexed holder, uint256 amount);
  ```

* **Legal meaning**

    * This is analogous to physically destroying unaccepted paper bills: the drawer’s potential liability is reduced by the nominal amount of the destroyed bills.

### 4.5 Acceptance

Acceptance moves bills from the Unaccepted Bills Ledger to the Accepted Bills Ledger, without creating new tokens and **without emitting an ERC-20 `Transfer` event**.

#### 4.5.1 `accept(uint256 amount)`

* **Access**

  ```solidity
  require(msg.sender == DRAWEE_ETH_ADDRESS, "Only drawee can accept bills");
  ```

* **Effect**

  Delegates to `acceptOn(msg.sender, amount)`.

#### 4.5.2 `acceptOn(address holder, uint256 amount)`

* **Access**

  ```solidity
  require(msg.sender == DRAWEE_ETH_ADDRESS, "Only drawee can accept bills");
  ```

* **Checks**

  ```solidity
  require(amount > 0, "Amount must be greater than zero");
  require(_balanceOfUnaccepted[holder] >= amount, "Insufficient unaccepted balance");
  ```

* **Effect (core transition)**

  ```solidity
  _balanceOfUnaccepted[holder] -= amount;
  _totalSupplyOfUnaccepted -= amount;

  _balances[holder] += amount;   // internal from forked ERC20
  _totalSupply       += amount;  // internal from forked ERC20
  ```

* **Events**

    * **Do NOT** emit a standard ERC-20 `Transfer` event.
    * Emit a custom acceptance event:

      ```solidity
      event Acceptance(address indexed holder, uint256 amount);
      ```

* **Legal meaning**

    * The drawee, by calling this function from `DRAWEE_ETH_ADDRESS`, accepts the specified number of bills.
    * The legal status of these bills changes from unaccepted (drawer liability only) to accepted (drawee primary liability).
    * No new bills are created; the number of bills in existence does not increase. Only their ledger and legal status change.

### 4.6 Accepted Bills: Standard ERC-20 and ERC-1363 Functions

All standard ERC-20 and ERC-1363 functions inherited from the forked libraries apply **only to accepted bills** (i.e. the balances stored in `_balances` / `balanceOf`):

* `transfer`, `approve`, `transferFrom`
* `burn`, `burnFrom` (from `ERC20Burnable`)
* `transferAndCall`, `transferFromAndCall` (from `ERC1363`) and similar.

The usual ERC-20 invariants apply to this accepted ledger.

---

## 5. Invariants and Legal-Technical Correspondence

The following invariants are fundamental to the legal correctness of this contract and must not be changed without a fresh legal analysis and an explicit decision to alter the underlying legal model.

1. **Conservation of bills (issued vs. destroyed)**

   At any time:

   ```text
   totalBillsInExistence = totalSupplyOfUnaccepted() + totalSupply()
   ```

   This quantity:

    * Increases only through `draw(...)`.
    * Decreases only through `burnOfUnaccepted(...)` and `burn(...)` / `burnFrom(...)` on accepted bills.
    * Is not affected by `accept(...)` / `acceptOn(...)` (pure state transition unaccepted → accepted).

2. **Acceptance does not create new tokens**

    * `accept` and `acceptOn` never increase `totalBillsInExistence`.
    * They only move bills from the Unaccepted Bills Ledger to the Accepted Bills Ledger.

3. **Access control**

    * Only `DRAWER_ETH_ADDRESS` may call `draw(...)`.
    * Only `DRAWEe_ETH_ADDRESS` may call `accept(...)` / `acceptOn(...)`.

4. **Unaccepted ledger isolation**

    * Unaccepted bills do **not** implement `transfer`, `approve`, `transferFrom`, ERC-1363 callbacks, etc.
    * They are moved only via `transferOfUnaccepted` and burned via `burnOfUnaccepted`.

5. **Accepted ledger ERC-20 correctness**

    * All ERC-20 functions operate solely on `_balances` / `_totalSupply`.
    * Standard ERC-20 invariants (sum of balances = totalSupply, etc.) must hold at all times for accepted bills.

---

## 6. Known Limitations and Non-Goals

The following features are deliberately **not** implemented in this version:

* **No indorsement mechanics**

    * We do not model indorsements, indorsers or indorsees on-chain.
    * The bill is “payable to bearer, not to order”; transfer happens by change of bearer (address), not by indorsement.

* **No qualified acceptance**

    * We do not model qualified or partial acceptance under BoEA (e.g. acceptance for part of the amount, conditional acceptance).

* **No maturity date**

    * All bills are “at sight”.
    * There is no on-chain date logic for time of payment.

* **No on-chain fork selection logic**

    * The contract does not contain any active mechanism to detect or choose the “valid” chain in case of a fork.
    * The fork clause is declarative, embedded in `DESCRIPTION`; decisions about which chain is treated as the valid registry are made off-chain by the drawee and, in case of dispute, by courts or arbitral tribunals.

* **No ERC-20 Permit (EIP-2612)**

    * `permit` / gasless approvals are out of scope for this version.

All of these non-features are design choices, not oversights. Any future version that adds them must be explicitly versioned and accompanied by an updated legal analysis.

---

## 7. Notes for Auditors and Implementers

* **Read the legal constants first.** `DESCRIPTION`, `LEGAL_SIGNATURE_STATEMENT`, `KYC_AND_AML_NOTICE`, and the party descriptors explain why certain technical choices (e.g. no `Transfer` event on acceptance) have been made.

* **Pay attention to the dual ledger.** A large part of the legal model is encoded in the separation between:

    * `_balanceOfUnaccepted` / `totalSupplyOfUnaccepted` and
    * `_balances` / `totalSupply` (ERC-20).

* **Acceptance is the key legal event.**
  Ensure that:

    * `accept` / `acceptOn` never emit ERC-20 `Transfer` events;
    * they do not call `_mint` / `_burn`, but only manipulate internal storage as specified;
    * events and comments clearly state that acceptance changes legal status, not the number of bills.

---
