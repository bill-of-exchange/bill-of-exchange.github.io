// SPDX-License-Identifier: MIT
//
// CascadingCashback Smart Contract
// Version: 0.2.0
// Author: [Viktor Ageyev](https://github.com/ageyev)
// Specification: CascadingCashback_Specification_v0.2.0.md
// https://github.com/bill-of-exchange/bill-of-exchange.github.io/blob/master/smart-contracts/contracts/CascadingCashback_Specification_v0.2.0.md
// ============================================================================
//
// CONCEPT
// -------
// A token sale module with tiered cashback incentivizing early participation.
// Cashback rates decrease as more tokens are sold.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │                      CASCADING CASHBACK MODEL                           │
// ├─────────────────────────────────────────────────────────────────────────┤
// │   Stage 1:  tokens      1 –     1,000  →  20% cashback    (200 max)     │
// │   Stage 2:  tokens  1,001 –    10,000  →  15% cashback  (1,350 max)     │
// │   Stage 3:  tokens 10,001 –   100,000  →  10% cashback  (9,000 max)     │
// │   Stage 4:  tokens 100,001 –  600,000  →   5% cashback (25,000 max)     │
// │   Stage 5:  tokens 600,001 – 1,000,000 →   0% cashback      (0 max)     │
// │                                                         ───────────     │
// │                                          Maximum total:  35,550         │
// │   Minimum funding: 1,000,000 + 35,550 = 1,035,550 tokens                │
// └─────────────────────────────────────────────────────────────────────────┘
//
// LIFECYCLE
// ---------
//   ACCRUAL (sale active) → COMPLETION (all sold) → CLAIM (withdrawals open)
//
// SECURITY
// --------
//   • ReentrancyGuard + CEI pattern
//   • SafeERC20 for token transfers
//   • Funding invariant at purchase time
//   • Solvency invariant at owner withdrawal
//
// ============================================================================

pragma solidity ^0.8.31;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title CascadingCashback
/// @notice Token sale with tiered cashback rewards based on purchase timing
/// @dev Implements CascadingCashback Specification v0.2.0
/// @custom:security-contact security@example.com
contract CascadingCashback is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // =========================================================================
    // TYPES
    // =========================================================================

    /// @dev Represents a cashback tier with boundary and rate
    struct Stage {
        uint256 endPosition;  // Exclusive upper bound (tokens sold)
        uint256 ratePercent;  // Cashback rate (0-20)
    }

    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /// @notice Total tokens available for sale
    uint256 public constant TOKENS_FOR_SALE = 1_000_000;

    /// @notice Maximum possible cashback (sum of all tiers at full capacity)
    uint256 public constant MAX_TOTAL_CASHBACK = 35_550;

    /// @notice Minimum tokens required to fund the contract
    uint256 public constant MINIMUM_FUNDING = TOKENS_FOR_SALE + MAX_TOTAL_CASHBACK;

    // Stage boundaries (exclusive upper bounds)
    uint256 public constant STAGE1_END = 1_000;
    uint256 public constant STAGE2_END = 10_000;
    uint256 public constant STAGE3_END = 100_000;
    uint256 public constant STAGE4_END = 600_000;

    // Cashback rates (percentage points)
    uint256 public constant RATE_STAGE1 = 20;
    uint256 public constant RATE_STAGE2 = 15;
    uint256 public constant RATE_STAGE3 = 10;
    uint256 public constant RATE_STAGE4 = 5;
    uint256 public constant RATE_STAGE5 = 0;

    // =========================================================================
    // IMMUTABLE STATE
    // =========================================================================

    /// @notice The ERC-20 token being sold and used for cashback
    IERC20 public immutable token;

    // =========================================================================
    // SALE STATE
    // =========================================================================

    /// @notice Total tokens purchased so far
    uint256 public tokensSold;

    /// @notice Sum of all cashback earned by all buyers (lifetime)
    uint256 public totalCashbackAccrued;

    /// @notice Sum of all cashback withdrawn by all buyers (lifetime)
    uint256 public totalCashbackClaimed;

    /// @dev Ensures SaleCompleted event fires exactly once
    bool private _saleCompletedEmitted;

    // =========================================================================
    // PER-BUYER ACCOUNTING
    // =========================================================================

    /// @notice Tokens purchased by each buyer
    mapping(address buyer => uint256 amount) public purchased;

    /// @notice Cashback earned by each buyer (lifetime, including claimed)
    mapping(address buyer => uint256 amount) public cashbackAccrued;

    /// @notice Cashback withdrawn by each buyer
    mapping(address buyer => uint256 amount) public cashbackClaimed;

    // =========================================================================
    // EVENTS
    // =========================================================================

    /// @notice Emitted once at deployment
    event SaleInitialized(address indexed tokenAddress, uint256 tokensForSale);

    /// @notice Emitted for every purchase
    event TokensPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 cashbackEarned,
        address indexed initiatedBy
    );

    /// @notice Emitted when cashback rate changes due to tier transition
    event CashbackRateChanged(
        uint256 previousRate,
        uint256 newRate,
        uint256 tokensSoldAfter
    );

    /// @notice Emitted once when all tokens are sold
    event SaleCompleted(uint256 totalSold, uint256 totalCashbackLiability);

    /// @notice Emitted when buyer withdraws cashback
    event CashbackClaimed(address indexed buyer, uint256 amount);

    // =========================================================================
    // ERRORS
    // =========================================================================

    /// @notice Token address is zero
    error ZeroAddress();

    /// @notice Token address is not a contract
    error NotAContract(address addr);

    /// @notice Amount parameter is zero
    error ZeroAmount();

    /// @notice Sale has finished
    error SaleAlreadyFinished();

    /// @notice Sale has not finished yet
    error SaleNotFinished();

    /// @notice Purchase exceeds available tokens
    error ExceedsAvailableTokens(uint256 requested, uint256 available);

    /// @notice Contract lacks sufficient token balance
    error InsufficientContractFunding(uint256 required, uint256 deFacto);

    /// @notice Cashback withdrawal exceeds available
    error InsufficientCashback(uint256 requested, uint256 available);

    /// @notice Owner withdrawal exceeds excess tokens
    error InsufficientExcessTokens(uint256 requested, uint256 available);

    /// @notice Withdrawal would break solvency
    error SolvencyViolation(uint256 balanceAfter, uint256 liabilityRequired);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /// @notice Deploys the contract
    /// @param tokenAddress ERC-20 token to be sold
    /// @param initialOwner Contract owner (admin)
    constructor(
        address tokenAddress,
        address initialOwner
    ) Ownable(initialOwner) {
        if (tokenAddress == address(0)) revert ZeroAddress();
        if (tokenAddress.code.length == 0) revert NotAContract(tokenAddress);

        token = IERC20(tokenAddress);

        emit SaleInitialized(tokenAddress, TOKENS_FOR_SALE);
    }

    // =========================================================================
    // PURCHASE FUNCTIONS
    // =========================================================================

    /// @notice Purchase tokens for the caller (demo mode, no payment)
    /// @param amount Tokens to purchase
    function purchase(uint256 amount) external nonReentrant {
        _executePurchase(msg.sender, amount, msg.sender);
    }

    /// @notice Purchase tokens for another address (production mode)
    /// @dev Owner only. For backend integration after off-chain payment.
    /// @param recipient Address to receive tokens
    /// @param amount Tokens to purchase
    function purchaseFor(
        address recipient,
        uint256 amount
    ) external onlyOwner nonReentrant {
        if (recipient == address(0)) revert ZeroAddress();
        _executePurchase(recipient, amount, msg.sender);
    }

    /// @dev Internal purchase logic with funding validation
    function _executePurchase(
        address recipient,
        uint256 amount,
        address initiator
    ) private {
        // === CHECKS ===

        if (saleFinished()) revert SaleAlreadyFinished();
        if (amount == 0) revert ZeroAmount();

        uint256 available = tokensLeftForSale();
        if (amount > available) {
            revert ExceedsAvailableTokens(amount, available);
        }

        uint256 soldBefore = tokensSold;
        uint256 rateBefore = _getCashbackRateAt(soldBefore);
        uint256 cashbackEarned = _calculateCashback(amount, soldBefore);

        // Funding invariant: contract must hold enough for:
        //   remaining sale tokens + existing liability + new cashback
        uint256 currentBalance = token.balanceOf(address(this));
        uint256 currentLiability = getCashbackLiability();
        uint256 tokensRemainingAfter = available - amount;
        uint256 requiredBalance = tokensRemainingAfter + currentLiability + cashbackEarned;
        uint256 balanceAfter = currentBalance - amount;

        if (balanceAfter < requiredBalance) {
            revert InsufficientContractFunding(requiredBalance, balanceAfter);
        }

        // === EFFECTS ===

        tokensSold = soldBefore + amount;
        purchased[recipient] += amount;

        if (cashbackEarned > 0) {
            cashbackAccrued[recipient] += cashbackEarned;
            totalCashbackAccrued += cashbackEarned;
        }

        // === INTERACTIONS ===

        token.safeTransfer(recipient, amount);

        // === EVENTS ===

        emit TokensPurchased(recipient, amount, cashbackEarned, initiator);

        uint256 rateAfter = _getCashbackRateAt(tokensSold);
        if (rateAfter != rateBefore) {
            emit CashbackRateChanged(rateBefore, rateAfter, tokensSold);
        }

        if (tokensSold == TOKENS_FOR_SALE && !_saleCompletedEmitted) {
            _saleCompletedEmitted = true;
            emit SaleCompleted(tokensSold, getCashbackLiability());
        }
    }

    // =========================================================================
    // CASHBACK WITHDRAWAL FUNCTIONS
    // =========================================================================

    /// @notice Withdraw specified amount of accrued cashback
    /// @dev Only after sale completion
    /// @param amount Cashback to withdraw
    function withdrawCashback(uint256 amount) public nonReentrant {
        // === CHECKS ===

        if (!saleFinished()) revert SaleNotFinished();
        if (amount == 0) revert ZeroAmount();

        uint256 withdrawable = getWithdrawableCashback(msg.sender);
        if (amount > withdrawable) {
            revert InsufficientCashback(amount, withdrawable);
        }

        // === EFFECTS ===

        cashbackClaimed[msg.sender] += amount;
        totalCashbackClaimed += amount;

        // === INTERACTIONS ===

        token.safeTransfer(msg.sender, amount);

        // === EVENTS ===

        emit CashbackClaimed(msg.sender, amount);
    }

    /// @notice Withdraw all accrued cashback
    function withdrawAllCashback() external {
        uint256 withdrawable = getWithdrawableCashback(msg.sender);
        if (withdrawable == 0) revert ZeroAmount();
        withdrawCashback(withdrawable);
    }

    // =========================================================================
    // OWNER FUNCTIONS
    // =========================================================================

    /// @notice Withdraw excess tokens (above cashback liability)
    /// @dev Only after sale completion. Enforces solvency.
    /// @param to Recipient address
    /// @param amount Tokens to withdraw
    function withdrawExcessTokens(
        address to,
        uint256 amount
    ) external onlyOwner nonReentrant {
        // === CHECKS ===

        if (!saleFinished()) revert SaleNotFinished();
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        uint256 excess = getExcessTokens();
        if (amount > excess) {
            revert InsufficientExcessTokens(amount, excess);
        }

        // Double-check solvency invariant
        uint256 currentBalance = token.balanceOf(address(this));
        uint256 balanceAfter = currentBalance - amount;
        uint256 liability = getCashbackLiability();

        if (balanceAfter < liability) {
            revert SolvencyViolation(balanceAfter, liability);
        }

        // === INTERACTIONS ===

        token.safeTransfer(to, amount);
    }

    // =========================================================================
    // VIEW FUNCTIONS — SALE STATUS
    // =========================================================================

    /// @notice Tokens still available for purchase
    function tokensLeftForSale() public view returns (uint256) {
        if (tokensSold >= TOKENS_FOR_SALE) return 0;
        return TOKENS_FOR_SALE - tokensSold;
    }

    /// @notice Whether all tokens have been sold
    function saleFinished() public view returns (bool) {
        return tokensSold >= TOKENS_FOR_SALE;
    }

    /// @notice Current cashback rate for next token (0-20)
    function currentCashbackRate() external view returns (uint256) {
        return _getCashbackRateAt(tokensSold);
    }

    /// @notice Current stage number (1-5)
    function currentStage() external view returns (uint256) {
        return _getStageAt(tokensSold);
    }

    // =========================================================================
    // VIEW FUNCTIONS — BUYER INFORMATION
    // =========================================================================

    /// @notice Cashback available for withdrawal
    /// @param buyer Address to check
    function getWithdrawableCashback(address buyer) public view returns (uint256) {
        return cashbackAccrued[buyer] - cashbackClaimed[buyer];
    }

    // =========================================================================
    // VIEW FUNCTIONS — CONTRACT STATE
    // =========================================================================

    /// @notice Contract's current token balance
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /// @notice Total unpaid cashback obligations
    function getCashbackLiability() public view returns (uint256) {
        return totalCashbackAccrued - totalCashbackClaimed;
    }

    /// @notice Tokens owner can withdraw (excess over liability)
    /// @dev Returns 0 if sale not finished
    function getExcessTokens() public view returns (uint256) {
        if (!saleFinished()) return 0;

        uint256 balance = getTokenBalance();
        uint256 liability = getCashbackLiability();

        if (balance <= liability) return 0;
        return balance - liability;
    }

    // =========================================================================
    // VIEW FUNCTIONS — UX HELPERS (for block explorer interface)
    // =========================================================================

    /// @notice Tokens remaining at current cashback rate before tier change
    function getRemainingAtCurrentRate() external view returns (uint256) {
        if (tokensSold >= TOKENS_FOR_SALE) return 0;
        if (tokensSold < STAGE1_END) return STAGE1_END - tokensSold;
        if (tokensSold < STAGE2_END) return STAGE2_END - tokensSold;
        if (tokensSold < STAGE3_END) return STAGE3_END - tokensSold;
        if (tokensSold < STAGE4_END) return STAGE4_END - tokensSold;
        return TOKENS_FOR_SALE - tokensSold;
    }

    /// @notice Minimum tokens needed to fully fund the contract
    /// @return Always returns MINIMUM_FUNDING (1,035,550)
    function getMinimumFundingRequired() external pure returns (uint256) {
        return MINIMUM_FUNDING;
    }

    /// @notice Preview cashback for a hypothetical purchase
    /// @dev Does not modify state. Useful for UI preview.
    /// @param amount Tokens to simulate purchasing
    /// @return cashback Expected cashback for this purchase
    function estimateCashback(uint256 amount) external view returns (uint256 cashback) {
        if (amount == 0) return 0;

        uint256 available = tokensLeftForSale();
        if (amount > available) {
            amount = available;  // Cap at remaining
        }

        return _calculateCashback(amount, tokensSold);
    }

    /// @notice Check if contract is sufficiently funded for remaining sale
    /// @return funded True if balance covers remaining sale + liability
    /// @return shortfall Amount of additional tokens needed (0 if funded)
    function checkFundingStatus() external view returns (bool funded, uint256 shortfall) {
        uint256 balance = getTokenBalance();
        uint256 required = tokensLeftForSale() + getCashbackLiability();

        if (balance >= required) {
            return (true, 0);
        }
        return (false, required - balance);
    }

    // =========================================================================
    // INTERNAL — CASHBACK CALCULATION (struct-based for elegance)
    // =========================================================================

    /// @dev Calculates cashback using tier-splitting logic
    function _calculateCashback(
        uint256 amount,
        uint256 soldBefore
    ) private pure returns (uint256) {
        uint256 cashback = 0;
        uint256 remaining = amount;
        uint256 position = soldBefore;

        // Define stages as struct array for clarity and maintainability
        Stage[5] memory stages = [
                        Stage(STAGE1_END,      RATE_STAGE1),
                        Stage(STAGE2_END,      RATE_STAGE2),
                        Stage(STAGE3_END,      RATE_STAGE3),
                        Stage(STAGE4_END,      RATE_STAGE4),
                        Stage(TOKENS_FOR_SALE, RATE_STAGE5)
            ];

        for (uint256 i = 0; i < 5; i++) {
            if (remaining == 0) break;
            if (position >= stages[i].endPosition) continue;

            uint256 capacityInStage = stages[i].endPosition - position;
            uint256 tokensInStage = remaining < capacityInStage
                ? remaining
                : capacityInStage;

            if (stages[i].ratePercent > 0) {
                cashback += (tokensInStage * stages[i].ratePercent) / 100;
            }

            position += tokensInStage;
            remaining -= tokensInStage;
        }

        return cashback;
    }

    /// @dev Returns cashback rate at given position
    function _getCashbackRateAt(uint256 position) private pure returns (uint256) {
        if (position < STAGE1_END) return RATE_STAGE1;
        if (position < STAGE2_END) return RATE_STAGE2;
        if (position < STAGE3_END) return RATE_STAGE3;
        if (position < STAGE4_END) return RATE_STAGE4;
        return RATE_STAGE5;
    }

    /// @dev Returns stage number at given position
    function _getStageAt(uint256 position) private pure returns (uint256) {
        if (position < STAGE1_END) return 1;
        if (position < STAGE2_END) return 2;
        if (position < STAGE3_END) return 3;
        if (position < STAGE4_END) return 4;
        return 5;
    }

    // =========================================================================
    // ETH REJECTION
    // =========================================================================

    /// @notice Rejects ETH transfers
    receive() external payable {
        revert("ETH not accepted");
    }

    /// @notice Rejects unknown calls
    fallback() external payable {
        revert("Unknown call");
    }
}
