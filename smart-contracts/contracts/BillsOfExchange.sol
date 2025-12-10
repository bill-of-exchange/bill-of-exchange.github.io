// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "./libs/ERC20.sol";
import {ERC20Burnable} from "./libs/ERC20Burnable.sol";
import {ERC1363} from "./libs/ERC1363.sol";

/// @title BillsOfExchange bearer bill smart contract
/// @notice Implements a dual-ledger bearer bill of exchange under UK Bills of Exchange Act 1882.
/// @dev Accepted bills use ERC-20/1363 interfaces; unaccepted bills live in a separate ledger.
contract BillsOfExchange is ERC20, ERC20Burnable, ERC1363 {
    // ----------------------
    // Versioning
    // ----------------------
    string public constant CONTRACT_VERSION = "0.1.0";

    // ----------------------
    // Parties (technical addresses)
    // ----------------------
    address public constant DRAWER_ETH_ADDRESS = 0x000000000000000000000000000000000000d0c0;
    address public constant DRAWEE_ETH_ADDRESS = 0x000000000000000000000000000000000000dA0E;

    // ----------------------
    // Legal descriptors
    // ----------------------
    string public constant DRAWER_NAME = "Drawer Ltd., 12 Main Street, London, UK";
    string public constant DRAWEE_NAME = "Drawee Bank, 13 Dizengoff Street, Tel Aviv, Israel";

    string public constant ORDER =
        "Pay to bearer (tokenholder), but not to order, the sum of 0.01 (one hundredth) Israeli new shekel (one agora)";

    string public constant TIME_OF_PAYMENT = "at sight";
    string public constant CURRENCY = "ILS";
    string public constant SUM_PER_BILL = "0.01";

    string public constant LEGAL_SIGNATURE_STATEMENT =
        "A signature of the transaction that successfully calls corresponding functions is treated as a legally binding signature under the UK Bills of Exchange Act 1882 taking into account the provisions the UK Electronic Communications Act 2000 and the UK Electronic Trade Documents Act 2023";

    string public constant DESCRIPTION =
        "Every smallest unit of this ERC-20-compatible token represents one separate bill of exchange payable to bearer, not to order, in the amount of 0.01 Israeli new shekel. The bearer is the natural or legal person who owns the Ethereum address that holds the token balance. Acceptance by the drawee is recorded on-chain and changes the legal status of the bill from unaccepted to accepted. In the case of a blockchain fork, the drawee will publicly designate which Ethereum chain is treated as the valid registry for these bills; in case of dispute, the question shall be resolved by a competent court or arbitration tribunal under the applicable lex cambiaria. All Ethereum test networks are not valid registries for real bills of exchange.";

    string public constant KYC_AND_AML_NOTICE =
        "Failure to perform KYC can create regulatory exposure under applicable AML/CFT regimes (for obliged entities), but does not, by itself, invalidate the bill or extinguish the drawee’s obligation to pay a duly issued and accepted bill presented by the bearer (subject to general limitations: illegality, sanctions, public policy, etc.).This is conceptually similar to paper cash (banknotes), which are also bearer instruments rooted in the same legal tradition.";

    // ----------------------
    // Unaccepted bills ledger
    // ----------------------
    mapping(address => uint256) private _balanceOfUnaccepted;
    uint256 private _totalSupplyOfUnaccepted;

    // ----------------------
    // Events
    // ----------------------
    event Draw(uint256 amount);
    event TransferOfUnaccepted(address indexed from, address indexed to, uint256 amount);
    event BurnOfUnaccepted(address indexed holder, uint256 amount);
    event Acceptance(address indexed holder, uint256 amount);

    constructor() ERC20("BillsOfExchange", unicode"₪") {}

    /// @notice Returns decimals fixed at 2 because each unit represents 0.01 ILS.
    function decimals() public pure override returns (uint8) {
        return 2;
    }

    /// @notice View the unaccepted balance of an address.
    /// @param account Holder address.
    /// @return Balance of unaccepted bills.
    function balanceOfUnaccepted(address account) external view returns (uint256) {
        return _balanceOfUnaccepted[account];
    }

    /// @notice View total supply of unaccepted bills.
    function totalSupplyOfUnaccepted() external view returns (uint256) {
        return _totalSupplyOfUnaccepted;
    }

    /// @notice Draw new unaccepted bills; callable only by the drawer’s Ethereum address.
    /// @dev Increases the total bills in existence; legal signature captured by the transaction.
    /// @param amount Number of bill units to draw (each unit is 0.01 ILS).
    function draw(uint256 amount) external {
        require(msg.sender == DRAWER_ETH_ADDRESS, "Only drawer can draw bills");
        require(amount > 0, "Amount must be greater than zero");

        _balanceOfUnaccepted[DRAWER_ETH_ADDRESS] += amount;
        _totalSupplyOfUnaccepted += amount;

        emit Draw(amount);
    }

    /// @notice Transfer unaccepted bills between holders.
    /// @dev Models transfer of possession before drawee acceptance; ERC-20 interface intentionally unused.
    /// @param to Recipient address.
    /// @param amount Number of unaccepted bill units to transfer.
    function transferOfUnaccepted(address to, uint256 amount) external {
        require(to != address(0), "Cannot transfer to zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(_balanceOfUnaccepted[msg.sender] >= amount, "Insufficient unaccepted balance");

        unchecked {
            _balanceOfUnaccepted[msg.sender] -= amount;
            _balanceOfUnaccepted[to] += amount;
        }

        emit TransferOfUnaccepted(msg.sender, to, amount);
    }

    /// @notice Burn unaccepted bills, reducing drawer liability.
    /// @param amount Number of unaccepted bill units to burn.
    function burnOfUnaccepted(uint256 amount) external {
        require(amount > 0, "Amount must be greater than zero");
        require(_balanceOfUnaccepted[msg.sender] >= amount, "Insufficient unaccepted balance");

        unchecked {
            _balanceOfUnaccepted[msg.sender] -= amount;
            _totalSupplyOfUnaccepted -= amount;
        }

        emit BurnOfUnaccepted(msg.sender, amount);
    }

    /// @notice Accept bills held by the drawee, changing their legal status to accepted.
    /// @dev Convenience wrapper that accepts bills in the drawee’s own address.
    /// @param amount Number of bill units to accept.
    function accept(uint256 amount) external {
        acceptOn(msg.sender, amount);
    }

    /// @notice Accept bills on behalf of a holder; callable only by the drawee’s Ethereum address.
    /// @dev Moves bills from the unaccepted ledger into the accepted ERC-20 ledger without mint semantics.
    /// @param holder Address whose unaccepted bills are being accepted.
    /// @param amount Number of bill units to accept.
    function acceptOn(address holder, uint256 amount) public {
        require(msg.sender == DRAWEE_ETH_ADDRESS, "Only drawee can accept bills");
        require(amount > 0, "Amount must be greater than zero");
        require(_balanceOfUnaccepted[holder] >= amount, "Insufficient unaccepted balance");

        unchecked {
            _balanceOfUnaccepted[holder] -= amount;
            _totalSupplyOfUnaccepted -= amount;

            _balances[holder] += amount;
            _totalSupply += amount;
        }

        emit Acceptance(holder, amount);
    }
}
