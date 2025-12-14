// SPDX-License-Identifier: MIT
//
// CascadingCashback Smart Contract v0.1.0
//
// ============================================================================
// CONCEPT
// ============================================================================
//
// A universal token sale module with a tiered cashback mechanism that
// incentivizes early participation. Buyers receive cashback based on their
// position in the global sale sequence, with rates decreasing as more tokens
// are sold.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │                     CASCADING CASHBACK MODEL                        │
// ├─────────────────────────────────────────────────────────────────────┤
// │                                                                     │
// │   Stage 1:  tokens      1 –     1,000  →  20% cashback             │
// │   Stage 2:  tokens  1,001 –    10,000  →  15% cashback             │
// │   Stage 3:  tokens 10,001 –   100,000  →  10% cashback             │
// │   Stage 4:  tokens 100,001 –  600,000  →   5% cashback             │
// │   Stage 5:  tokens 600,001 – 1,000,000 →   0% cashback             │
// │                                                                     │
// │   Cashback accrues immediately but can only be withdrawn            │
// │   after the sale is complete (all tokens sold).                     │
// │                                                                     │
// └─────────────────────────────────────────────────────────────────────┘
//
// SCOPE OF VERSION 0.1.0
// ----------------------
// This is a proof-of-concept implementation:
// - No payment processing (purchase() is free)
// - Fixed parameters (hardcoded tiers)
// - No pause/cancel functionality
// - Universal module (works with any standard ERC-20 token)
//
// INTEGRATION MODEL
// -----------------
// Demo:       User → purchase(amount) → CascadingCashback
// Production: User → Payment → Backend → purchaseFor(recipient, amount)
//
// CASHBACK LIFECYCLE
// ------------------
// ACCRUAL → COMPLETION → CLAIM
//
// 1. During sale: Users purchase tokens, cashback accrues
// 2. Sale ends: When all 1,000,000 tokens are sold
// 3. After sale: Users can withdraw their accrued cashback
//
// SECURITY MODEL
// --------------
// - ReentrancyGuard: Protects all state-changing functions with external calls
// - CEI Pattern: Checks → Effects → Interactions ordering in all functions
// - Solvency Invariant: Contract balance ≥ cashback liability at all times
// - Owner Restrictions: Cannot withdraw tokens reserved for cashback
//
// LIABILITY ACCOUNTING
// --------------------
// The contract tracks cashback as a financial liability:
//
//   Current Liability = totalCashbackAccrued - totalCashbackClaimed
//
// This ensures transparency and enables solvency verification at any time.
//
// ============================================================================

pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title CascadingCashback
/// @notice Token sale contract with tiered cashback rewards based on purchase timing
/// @dev Implements a five-stage sale with decreasing cashback rates (20% → 15% → 10% → 5% → 0%)
/// @custom:security-contact security@bill-of-exchange.github.io
/// @author Viktor Ageyev (https://github.com/ageyev)
contract CascadingCashback is ReentrancyGuard {

    // =========================================================================
    // IMMUTABLE STATE
    // =========================================================================

    /// @notice The ERC-20 token being sold
    /// @dev Set at deployment, cannot be changed
    IERC20 public immutable token;

    /// @notice Address authorized to call purchaseFor()
    /// @dev Typically the backend service or multi-sig wallet
    address public owner;

    // =========================================================================
    // SALE CONSTANTS
    // =========================================================================

    /// @notice Total tokens available for purchase (raw units)
    uint256 public constant TOKENS_FOR_SALE = 1_000_000;

    /// @notice End of Stage 1 (20% cashback stage)
    uint256 public constant STAGE1_END = 1_000;

    /// @notice End of Stage 2 (15% cashback stage)
    uint256 public constant STAGE2_END = 10_000;

    /// @notice End of Stage 3 (10% cashback stage)
    uint256 public constant STAGE3_END = 100_000;

    /// @notice End of Stage 4 (5% cashback stage)
    uint256 public constant STAGE4_END = 600_000;

    // Stage 5 implicitly ends at TOKENS_FOR_SALE (1,000,000)

    // =========================================================================
    // SALE STATE
    // =========================================================================

    /// @notice Total tokens sold so far
    /// @dev Monotonically increasing, never decreases
    uint256 public tokensSold;

    /// @notice Total cashback accrued by all buyers (lifetime)
    /// @dev Sum of all cashback earned, including already claimed
    uint256 public totalCashbackAccrued;

    /// @notice Total cashback claimed by all buyers (lifetime)
    /// @dev Sum of all cashback withdrawals
    uint256 public totalCashbackClaimed;

    // =========================================================================
    // PER-BUYER ACCOUNTING
    // =========================================================================

    /// @notice Tokens purchased by each address
    mapping(address => uint256) public purchased;

    /// @notice Cashback accrued by each address
    /// @dev Total earned, including both claimed and unclaimed
    mapping(address => uint256) public cashbackAccrued;

    /// @notice Cashback already claimed by each address
    mapping(address => uint256) public cashbackClaimed;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /// @notice Emitted once at deployment
    /// @param tokenAddress The ERC-20 token being sold
    /// @param tokensForSale Total tokens available
    event SaleInitialized(address indexed tokenAddress, uint256 tokensForSale);

    /// @notice Emitted for every token purchase
    /// @param buyer Address receiving the purchased tokens
    /// @param amount Number of tokens purchased
    /// @param cashbackEarned Cashback accrued from this purchase
    /// @param initiatedBy Address that called the purchase function
    event TokensPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 cashbackEarned,
        address indexed initiatedBy
    );

    /// @notice Emitted when a purchase causes the cashback rate to change
    /// @param previousRate Old cashback rate (0-20)
    /// @param newRate New cashback rate (0-20)
    /// @param tokensSoldAfter Total tokens sold after the rate change
    event CashbackRateChanged(
        uint256 previousRate,
        uint256 newRate,
        uint256 tokensSoldAfter
    );

    /// @notice Emitted once when the last token is sold
    /// @param totalSold Total tokens sold (should equal TOKENS_FOR_SALE)
    /// @param totalCashbackLiability Total cashback owed to all buyers
    event SaleCompleted(uint256 totalSold, uint256 totalCashbackLiability);

    /// @notice Emitted when a buyer withdraws cashback
    /// @param buyer Address withdrawing cashback
    /// @param amount Amount of cashback withdrawn
    event CashbackClaimed(address indexed buyer, uint256 amount);

    /// @notice Emitted when ownership is transferred
    /// @param previousOwner Previous owner address
    /// @param newOwner New owner address
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /// @notice Deploys the contract and initializes the sale
    /// @dev The contract does not verify token balance at deployment.
    ///      The owner must ensure at least 1,035,550 tokens are deposited
    ///      before the sale begins (1,000,000 for sale + 35,550 max cashback).
    /// @param tokenAddress ERC-20 token to be sold
    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "CC: Token address is zero");

        token = IERC20(tokenAddress);
        owner = msg.sender;

        emit SaleInitialized(tokenAddress, TOKENS_FOR_SALE);
        emit OwnershipTransferred(address(0), msg.sender);
    }

    // =========================================================================
    // MODIFIERS
    // =========================================================================

    /// @dev Restricts function access to the owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "CC: Caller is not owner");
        _;
    }

    // =========================================================================
    // PURCHASE FUNCTIONS
    // =========================================================================

    /// @notice Purchases tokens for the caller (demo/testing mode)
    /// @dev No payment required. This is a proof-of-concept function.
    ///      In production, use purchaseFor() with backend payment verification.
    /// @param amount Number of tokens to purchase (raw units)
    function purchase(uint256 amount) external nonReentrant {
        _purchase(msg.sender, amount, msg.sender);
    }

    /// @notice Purchases tokens on behalf of another address (production mode)
    /// @dev Only callable by owner. Intended for backend integration after
    ///      off-chain payment verification (Stripe, bank transfer, etc.)
    /// @param recipient Address to receive the purchased tokens
    /// @param amount Number of tokens to purchase (raw units)
    function purchaseFor(address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "CC: Recipient is zero address");
        _purchase(recipient, amount, msg.sender);
    }

    /// @dev Internal purchase logic with cashback calculation
    /// @param buyer Address receiving tokens and cashback
    /// @param amount Number of tokens to purchase
    /// @param initiator Address that called the function (for event logging)
    function _purchase(address buyer, uint256 amount, address initiator) private {
        // CHECKS
        require(amount > 0, "CC: Amount must be positive");
        require(!saleFinished(), "CC: Sale has finished");
        require(amount <= tokensLeftForSale(), "CC: Exceeds available tokens");

        // Store initial rate for event emission
        uint256 rateBefore = currentCashbackRate();

        // Calculate cashback for this purchase
        uint256 cashback = _calculateCashback(amount, tokensSold);

        // EFFECTS
        tokensSold += amount;
        purchased[buyer] += amount;
        cashbackAccrued[buyer] += cashback;
        totalCashbackAccrued += cashback;

        // INTERACTIONS
        require(
            token.transfer(buyer, amount),
            "CC: Token transfer failed"
        );

        // Emit purchase event
        emit TokensPurchased(buyer, amount, cashback, initiator);

        // Check if rate changed due to this purchase
        uint256 rateAfter = currentCashbackRate();
        if (rateAfter != rateBefore) {
            emit CashbackRateChanged(rateBefore, rateAfter, tokensSold);
        }

        // Check if sale just completed
        if (saleFinished()) {
            emit SaleCompleted(tokensSold, getCashbackLiability());
        }
    }

    /// @dev Calculates cashback for a purchase, handling cross-stage splits
    /// @param amount Number of tokens being purchased
    /// @param soldBefore Number of tokens already sold before this purchase
    /// @return Total cashback earned from this purchase
    function _calculateCashback(uint256 amount, uint256 soldBefore) private pure returns (uint256) {
        uint256 cashback = 0;
        uint256 remaining = amount;
        uint256 currentPosition = soldBefore;

        // Process Stage 1 (20% cashback)
        if (remaining > 0 && currentPosition < STAGE1_END) {
            uint256 tokensInStage = _min(remaining, STAGE1_END - currentPosition);
            cashback += (tokensInStage * 20) / 100;
            currentPosition += tokensInStage;
            remaining -= tokensInStage;
        }

        // Process Stage 2 (15% cashback)
        if (remaining > 0 && currentPosition < STAGE2_END) {
            uint256 tokensInStage = _min(remaining, STAGE2_END - currentPosition);
            cashback += (tokensInStage * 15) / 100;
            currentPosition += tokensInStage;
            remaining -= tokensInStage;
        }

        // Process Stage 3 (10% cashback)
        if (remaining > 0 && currentPosition < STAGE3_END) {
            uint256 tokensInStage = _min(remaining, STAGE3_END - currentPosition);
            cashback += (tokensInStage * 10) / 100;
            currentPosition += tokensInStage;
            remaining -= tokensInStage;
        }

        // Process Stage 4 (5% cashback)
        if (remaining > 0 && currentPosition < STAGE4_END) {
            uint256 tokensInStage = _min(remaining, STAGE4_END - currentPosition);
            cashback += (tokensInStage * 5) / 100;
            currentPosition += tokensInStage;
            remaining -= tokensInStage;
        }

        // Stage 5 (0% cashback) - no calculation needed

        return cashback;
    }

    // =========================================================================
    // CASHBACK WITHDRAWAL FUNCTIONS
    // =========================================================================

    /// @notice Withdraws a specified amount of accrued cashback
    /// @dev Only available after sale completion. Uses CEI pattern for security.
    /// @param amount Amount of cashback to withdraw
    function withdrawCashback(uint256 amount) public nonReentrant {
        // CHECKS
        require(saleFinished(), "CC: Sale not finished");
        require(amount > 0, "CC: Amount must be positive");

        uint256 withdrawable = getWithdrawableCashback(msg.sender);
        require(amount <= withdrawable, "CC: Exceeds withdrawable cashback");

        // EFFECTS
        cashbackClaimed[msg.sender] += amount;
        totalCashbackClaimed += amount;

        // INTERACTIONS
        require(
            token.transfer(msg.sender, amount),
            "CC: Cashback transfer failed"
        );

        emit CashbackClaimed(msg.sender, amount);
    }

    /// @notice Withdraws all available cashback for the caller
    /// @dev Convenience wrapper around withdrawCashback()
    function withdrawAllCashback() external {
        uint256 withdrawable = getWithdrawableCashback(msg.sender);
        require(withdrawable > 0, "CC: No cashback to withdraw");
        withdrawCashback(withdrawable);
    }

    // =========================================================================
    // OWNER FUNCTIONS
    // =========================================================================

    /// @notice Withdraws excess tokens not needed for cashback obligations
    /// @dev Only callable after sale completion. Enforces solvency invariant.
    /// @param to Address to receive the excess tokens
    /// @param amount Number of tokens to withdraw
    function withdrawExcessTokens(address to, uint256 amount) external onlyOwner nonReentrant {
        // CHECKS
        require(saleFinished(), "CC: Sale not finished");
        require(to != address(0), "CC: Recipient is zero address");
        require(amount > 0, "CC: Amount must be positive");

        uint256 excess = getExcessTokens();
        require(amount <= excess, "CC: Exceeds excess tokens");

        // Verify solvency invariant will hold after withdrawal
        uint256 balanceAfter = token.balanceOf(address(this)) - amount;
        uint256 liability = getCashbackLiability();
        require(balanceAfter >= liability, "CC: Would violate solvency");

        // INTERACTIONS (no state changes needed)
        require(
            token.transfer(to, amount),
            "CC: Excess token transfer failed"
        );
    }

    /// @notice Transfers ownership to a new address
    /// @dev Standard ownership transfer pattern
    /// @param newOwner Address of the new owner
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "CC: New owner is zero address");

        address previousOwner = owner;
        owner = newOwner;

        emit OwnershipTransferred(previousOwner, newOwner);
    }

    // =========================================================================
    // VIEW FUNCTIONS: SALE STATUS
    // =========================================================================

    /// @notice Returns the number of tokens remaining for sale
    /// @return Tokens still available for purchase
    function tokensLeftForSale() public view returns (uint256) {
        return TOKENS_FOR_SALE - tokensSold;
    }

    /// @notice Checks if the sale has finished
    /// @return True if all tokens have been sold
    function saleFinished() public view returns (bool) {
        return tokensSold >= TOKENS_FOR_SALE;
    }

    /// @notice Returns the cashback rate for the next token to be sold
    /// @dev Rate is expressed as an integer (0-20), representing percentage
    /// @return Current cashback rate (0, 5, 10, 15, or 20)
    function currentCashbackRate() public view returns (uint256) {
        if (tokensSold < STAGE1_END) return 20;
        if (tokensSold < STAGE2_END) return 15;
        if (tokensSold < STAGE3_END) return 10;
        if (tokensSold < STAGE4_END) return 5;
        return 0;
    }

    /// @notice Returns the current stage of the sale
    /// @dev Stages are numbered 1-5
    /// @return Current stage (1 = highest cashback, 5 = no cashback)
    function currentStage() public view returns (uint256) {
        if (tokensSold < STAGE1_END) return 1;
        if (tokensSold < STAGE2_END) return 2;
        if (tokensSold < STAGE3_END) return 3;
        if (tokensSold < STAGE4_END) return 4;
        return 5;
    }

    // =========================================================================
    // VIEW FUNCTIONS: BUYER INFORMATION
    // =========================================================================

    /// @notice Returns the amount of cashback available for withdrawal
    /// @param buyer Address to query
    /// @return Amount of cashback that can be withdrawn
    function getWithdrawableCashback(address buyer) public view returns (uint256) {
        return cashbackAccrued[buyer] - cashbackClaimed[buyer];
    }

    // =========================================================================
    // VIEW FUNCTIONS: CONTRACT STATE
    // =========================================================================

    /// @notice Returns the contract's current token balance
    /// @return Token balance held by this contract
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /// @notice Returns the total unpaid cashback liability
    /// @dev This is the amount the contract must reserve for future claims
    /// @return Total cashback owed but not yet withdrawn
    function getCashbackLiability() public view returns (uint256) {
        return totalCashbackAccrued - totalCashbackClaimed;
    }

    /// @notice Returns the amount of tokens the owner can withdraw
    /// @dev Excess = Balance - Liability (tokens not needed for cashback)
    /// @return Tokens available for owner withdrawal
    function getExcessTokens() public view returns (uint256) {
        uint256 balance = getTokenBalance();
        uint256 liability = getCashbackLiability();

        if (balance <= liability) {
            return 0;
        }

        return balance - liability;
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    /// @dev Returns the minimum of two numbers
    /// @param a First number
    /// @param b Second number
    /// @return The smaller of a and b
    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    // =========================================================================
    // ETHER REJECTION
    // =========================================================================

    /// @notice Rejects any Ether sent to this contract
    /// @dev This contract only deals with ERC-20 tokens
    receive() external payable {
        revert("CC: Ether not accepted");
    }

    /// @notice Rejects any unknown function calls
    fallback() external payable {
        revert("CC: Unknown call rejected");
    }
}
