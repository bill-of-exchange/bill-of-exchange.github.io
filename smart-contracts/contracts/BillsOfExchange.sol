// SPDX-License-Identifier: MIT
// BillsOfExchange Smart Contract v0.1.0
//
// LEGAL MODEL
// -----------
// Bearer bill of exchange under UK Bills of Exchange Act 1882, adapted to
// electronic form per UK Electronic Communications Act 2000 and UK Electronic
// Trade Documents Act 2023.
//
// Key characteristics:
// - Payable to bearer, not to order (no indorsement)
// - Transfer by change of possession (on-chain balance)
// - Time of payment: at sight
// - Fixed nominal value: 0.01 ILS per smallest unit (decimals = 2)
//
// DUAL LEDGER ARCHITECTURE
// ------------------------
// 1. Unaccepted Bills Ledger — drawer liability only, no ERC-20 interface
// 2. Accepted Bills Ledger — drawee primary liability, full ERC-20/ERC-1363
//
// Acceptance moves bills between ledgers WITHOUT emitting Transfer event,
// because acceptance is a change of legal status, not creation of new tokens.
//
// REENTRANCY ANALYSIS
// -------------------
// Reentrancy guards are deliberately omitted. Rationale:
// - Unaccepted ledger functions perform no external calls.
// - Accepted ledger inherits ERC-1363 callbacks which follow CEI pattern:
//   balance updates occur BEFORE callbacks.
// - Cross-ledger attacks prevented by access control: only DRAWEE can accept,
//   only DRAWER can draw.
//
// FORK REQUIREMENTS
// -----------------
// This contract requires forked OpenZeppelin ERC20 v5.4.0 with _balances and
// _totalSupply changed from private to internal. See libs/ERC20.sol.

pragma solidity ^0.8.28;

import "./libs/ERC20.sol";           // Fork of OpenZeppelin ERC20 v5.4.0 (internal _balances/_totalSupply)
import "./libs/ERC20Burnable.sol";   // Fork of OpenZeppelin ERC20Burnable v5.4.0 using forked ERC20
import "./libs/ERC1363.sol";         // Fork of ERC1363 implementation using forked ERC20

/// @title BillsOfExchange
/// @notice Bearer bill of exchange as ERC-20 compatible token under UK BoEA 1882.
/// @dev Each smallest unit (1 raw unit) = one bill of exchange for 0.01 ILS.
/// @custom:security-contact security@example.com
contract BillsOfExchange is ERC20, ERC20Burnable, ERC1363 {

    // =========================================================================
    // VERSIONING
    // =========================================================================

    /// @notice Semantic version of this contract.
    string public constant CONTRACT_VERSION = "0.1.0";

    // =========================================================================
    // PARTY ADDRESSES
    // =========================================================================

    /// @notice Ethereum address authorized to draw (issue) new bills.
    /// @custom:deployment MUST be replaced with actual drawer address.
    address public constant DRAWER_ETH_ADDRESS = 0x000000000000000000000000000000000000d0c0;

    /// @notice Ethereum address authorized to accept bills.
    /// @custom:deployment MUST be replaced with actual drawee address.
    address public constant DRAWEE_ETH_ADDRESS = 0x000000000000000000000000000000000000dA0E;

    // =========================================================================
    // LEGAL DESCRIPTORS
    // =========================================================================

    /// @notice Legal name and address of the drawer.
    /// @custom:deployment MUST be replaced with actual drawer details.
    string public constant DRAWER_NAME = "Drawer Ltd., 12 Main Street, London, UK";

    /// @notice Legal name and address of the drawee (acceptor).
    /// @custom:deployment MUST be replaced with actual drawee details.
    string public constant DRAWEE_NAME = "Drawee Bank, 13 Dizengoff Street, Tel Aviv, Israel";

    /// @notice The unconditional order written on the bill.
    string public constant ORDER =
    "Pay to bearer (tokenholder), but not to order, the sum of "
    "0.01 (one hundredth) Israeli new shekel (one agora).";

    /// @notice Time of payment specification per BoEA 1882 s.10.
    string public constant TIME_OF_PAYMENT = "at sight";

    /// @notice ISO 4217 currency code.
    string public constant CURRENCY = "ILS";

    /// @notice Nominal value per bill of exchange.
    string public constant SUM_PER_BILL = "0.01";

    /// @notice Statement on legal effect of transaction signatures.
    string public constant LEGAL_SIGNATURE_STATEMENT =
    "A signature of the transaction that successfully calls corresponding functions "
    "is treated as a legally binding signature under the UK Bills of Exchange Act 1882 "
    "taking into account the provisions of the UK Electronic Communications Act 2000 "
    "and the UK Electronic Trade Documents Act 2023.";

    /// @notice Full description of the instrument and its legal properties.
    string public constant DESCRIPTION =
    "Every smallest unit of this ERC-20-compatible token represents one separate bill "
    "of exchange payable to bearer, not to order, in the amount of 0.01 Israeli new shekel. "
    "The bearer is the natural or legal person who owns the Ethereum address that holds "
    "the token balance. Acceptance by the drawee is recorded on-chain and changes the legal "
    "status of the bill from unaccepted to accepted. In the case of a blockchain fork, "
    "the drawee will publicly designate which Ethereum chain is treated as the valid registry "
    "for these bills; in case of dispute, the question shall be resolved by a competent court "
    "or arbitration tribunal under the applicable lex cambiaria. "
    "All Ethereum test networks are not valid registries for real bills of exchange.";

    /// @notice Clarification of KYC/AML relationship to bill validity.
    string public constant KYC_AND_AML_NOTICE =
    "Failure to perform KYC can create regulatory exposure under applicable AML/CFT regimes "
    "(for obliged entities), but does not, by itself, invalidate the bill or extinguish "
    "the drawee's obligation to pay a duly issued and accepted bill presented by the bearer "
    "(subject to general limitations: illegality, sanctions, public policy, etc.). "
    "This is conceptually similar to paper cash (banknotes), which are also bearer instruments "
    "rooted in the same legal tradition.";

    // =========================================================================
    // UNACCEPTED BILLS LEDGER
    // =========================================================================

    /// @dev Balance of unaccepted bills per address (drawer liability only).
    mapping(address => uint256) private _balanceOfUnaccepted;

    /// @dev Total supply of unaccepted bills.
    uint256 private _totalSupplyOfUnaccepted;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /// @notice Emitted when the drawer issues new bills of exchange.
    /// @param amount Number of bills drawn (each worth 0.01 ILS).
    event Draw(uint256 amount);

    /// @notice Emitted when unaccepted bills are transferred between addresses.
    /// @param from Sender address.
    /// @param to Recipient address.
    /// @param amount Number of bills transferred.
    event TransferOfUnaccepted(address indexed from, address indexed to, uint256 amount);

    /// @notice Emitted when unaccepted bills are burned by their holder.
    /// @param holder Address that burned the bills.
    /// @param amount Number of bills burned.
    event BurnOfUnaccepted(address indexed holder, uint256 amount);

    /// @notice Emitted when the drawee accepts bills, changing their legal status.
    /// @dev Does NOT indicate creation of new tokens — only ledger transition.
    /// @param holder Address whose bills were accepted.
    /// @param amount Number of bills accepted.
    event Acceptance(address indexed holder, uint256 amount);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /// @notice Deploys the contract with no initial bills. Use draw() to issue.
    constructor() ERC20("BillsOfExchange", unicode"₪") {}

    // =========================================================================
    // ERC-20 METADATA
    // =========================================================================

    /// @notice Returns 2 decimals (each unit = 0.01 ILS = 1 agora).
    function decimals() public pure override returns (uint8) {
        return 2;
    }

    // =========================================================================
    // UNACCEPTED BILLS: VIEW FUNCTIONS
    // =========================================================================

    /// @notice Returns the unaccepted bills balance for an account.
    /// @param account Address to query.
    /// @return Balance of unaccepted bills.
    function balanceOfUnaccepted(address account) external view returns (uint256) {
        return _balanceOfUnaccepted[account];
    }

    /// @notice Returns the total supply of unaccepted bills.
    /// @return Total unaccepted bills in existence.
    function totalSupplyOfUnaccepted() external view returns (uint256) {
        return _totalSupplyOfUnaccepted;
    }

    // =========================================================================
    // DRAWING BILLS
    // =========================================================================

    /// @notice Issues new unaccepted bills to the drawer.
    /// @dev Only callable by DRAWER_ETH_ADDRESS. Each unit = 0.01 ILS.
    /// @param amount Number of bills to draw.
    function draw(uint256 amount) external {
        require(msg.sender == DRAWER_ETH_ADDRESS, "BOE: Only drawer can draw");
        require(amount > 0, "BOE: Amount must be positive");

        _balanceOfUnaccepted[DRAWER_ETH_ADDRESS] += amount;
        _totalSupplyOfUnaccepted += amount;

        emit Draw(amount);
    }

    // =========================================================================
    // TRANSFERS OF UNACCEPTED BILLS
    // =========================================================================

    /// @notice Transfers unaccepted bills to another address.
    /// @dev Models physical transfer of possession before acceptance.
    /// @param to Recipient address.
    /// @param amount Number of unaccepted bills to transfer.
    function transferOfUnaccepted(address to, uint256 amount) external {
        require(to != address(0), "BOE: Transfer to zero address");
        require(amount > 0, "BOE: Amount must be positive");

        uint256 senderBalance = _balanceOfUnaccepted[msg.sender];
        require(senderBalance >= amount, "BOE: Insufficient unaccepted balance");

        unchecked {
            _balanceOfUnaccepted[msg.sender] = senderBalance - amount;
        }
        _balanceOfUnaccepted[to] += amount;

        emit TransferOfUnaccepted(msg.sender, to, amount);
    }

    // =========================================================================
    // BURNING UNACCEPTED BILLS
    // =========================================================================

    /// @notice Burns unaccepted bills held by the caller, reducing drawer liability.
    /// @param amount Number of unaccepted bills to burn.
    function burnOfUnaccepted(uint256 amount) external {
        require(amount > 0, "BOE: Amount must be positive");

        uint256 holderBalance = _balanceOfUnaccepted[msg.sender];
        require(holderBalance >= amount, "BOE: Insufficient unaccepted balance");

        unchecked {
            _balanceOfUnaccepted[msg.sender] = holderBalance - amount;
            _totalSupplyOfUnaccepted -= amount;
        }

        emit BurnOfUnaccepted(msg.sender, amount);
    }

    // =========================================================================
    // ACCEPTANCE
    // =========================================================================

    /// @notice Accepts unaccepted bills held by the drawee itself.
    /// @dev Only callable by DRAWEE_ETH_ADDRESS.
    /// @param amount Number of bills to accept.
    function accept(uint256 amount) external {
        require(msg.sender == DRAWEE_ETH_ADDRESS, "BOE: Only drawee can accept");
        _acceptOn(msg.sender, amount);
    }

    /// @notice Accepts unaccepted bills held by a specified holder.
    /// @dev Only callable by DRAWEE_ETH_ADDRESS. Bills remain with holder.
    /// @param holder Address whose unaccepted bills are being accepted.
    /// @param amount Number of bills to accept.
    function acceptOn(address holder, uint256 amount) external {
        require(msg.sender == DRAWEE_ETH_ADDRESS, "BOE: Only drawee can accept");
        _acceptOn(holder, amount);
    }

    /// @dev Internal acceptance logic. Moves bills from unaccepted to accepted ledger.
    ///      CRITICAL: Does NOT emit Transfer event — acceptance changes legal status,
    ///      it does not create new tokens. The bills already existed as unaccepted.
    /// @param holder Address whose bills are being accepted.
    /// @param amount Number of bills to accept.
    function _acceptOn(address holder, uint256 amount) private {
        require(holder != address(0), "BOE: Holder is zero address");
        require(amount > 0, "BOE: Amount must be positive");

        uint256 unacceptedBalance = _balanceOfUnaccepted[holder];
        require(unacceptedBalance >= amount, "BOE: Insufficient unaccepted balance");

        unchecked {
        // Remove from unaccepted ledger (drawer liability)
            _balanceOfUnaccepted[holder] = unacceptedBalance - amount;
            _totalSupplyOfUnaccepted -= amount;
        }

        // Add to accepted ledger (drawee liability)
        // Direct access to forked ERC20 internal variables — no Transfer event
        _balances[holder] += amount;
        _totalSupply += amount;

        emit Acceptance(holder, amount);
    }

    // =========================================================================
    // ETHER REJECTION
    // =========================================================================

    /// @notice Rejects any Ether sent to this contract.
    receive() external payable {
        revert("BOE: Ether not accepted");
    }

    /// @notice Rejects any unknown function calls.
    fallback() external payable {
        revert("BOE: Unknown call rejected");
    }
}
