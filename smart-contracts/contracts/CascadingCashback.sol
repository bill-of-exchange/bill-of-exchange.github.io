// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title CascadingCashback
/// @notice Tiered cashback token sale module following CascadingCashback_Specification_v0.2.0.
/// @dev Proof-of-concept implementation with fixed parameters and no on-chain payments.
contract CascadingCashback is Ownable, ReentrancyGuard {
    // =========================================================================
    // SALE CONSTANTS
    // =========================================================================

    uint256 public constant TOKENS_FOR_SALE = 1_000_000;
    uint256 public constant STAGE1_END = 1_000; // 20%
    uint256 public constant STAGE2_END = 10_000; // 15%
    uint256 public constant STAGE3_END = 100_000; // 10%
    uint256 public constant STAGE4_END = 600_000; // 5%

    uint256 private constant STAGE1_RATE = 20;
    uint256 private constant STAGE2_RATE = 15;
    uint256 private constant STAGE3_RATE = 10;
    uint256 private constant STAGE4_RATE = 5;
    uint256 private constant STAGE5_RATE = 0;

    // =========================================================================
    // IMMUTABLE STATE
    // =========================================================================

    /// @notice ERC-20 token being sold and used for cashback.
    IERC20 public immutable token;

    // =========================================================================
    // SALE STATE
    // =========================================================================

    /// @notice Total tokens purchased so far.
    uint256 public tokensSold;

    /// @notice Total cashback accrued across all buyers.
    uint256 public totalCashbackAccrued;

    /// @notice Total cashback already claimed across all buyers.
    uint256 public totalCashbackClaimed;

    // =========================================================================
    // PER-BUYER ACCOUNTING
    // =========================================================================

    mapping(address buyer => uint256 amount) public purchased;
    mapping(address buyer => uint256 amount) public cashbackAccrued;
    mapping(address buyer => uint256 amount) public cashbackClaimed;

    // =========================================================================
    // EVENTS
    // =========================================================================

    event SaleInitialized(address indexed token, uint256 tokensForSale);
    event TokensPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 cashbackEarned,
        address indexed initiatedBy
    );
    event CashbackRateChanged(uint256 previousRate, uint256 newRate, uint256 tokensSoldAfter);
    event SaleCompleted(uint256 totalSold, uint256 totalCashbackLiability);
    event CashbackClaimed(address indexed buyer, uint256 amount);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /// @param token_ Address of the ERC-20 token being sold.
    constructor(IERC20 token_) {
        require(address(token_) != address(0), "CCC: token is zero address");
        token = token_;

        emit SaleInitialized(address(token_), TOKENS_FOR_SALE);
    }

    // =========================================================================
    // PURCHASE FUNCTIONS
    // =========================================================================

    /// @notice Purchases tokens for the caller.
    /// @param amount Number of tokens to purchase.
    function purchase(uint256 amount) external nonReentrant {
        _executePurchase(msg.sender, msg.sender, amount);
    }

    /// @notice Owner-only purchase on behalf of a recipient (intended for backend integration).
    /// @param recipient Address receiving purchased tokens and cashback accruals.
    /// @param amount Number of tokens to purchase.
    function purchaseFor(address recipient, uint256 amount) external onlyOwner nonReentrant {
        _executePurchase(recipient, msg.sender, amount);
    }

    function _executePurchase(address buyer, address initiatedBy, uint256 amount) private {
        require(!saleFinished(), "CCC: sale finished");
        require(amount > 0, "CCC: amount is zero");
        require(buyer != address(0), "CCC: buyer is zero address");
        require(amount <= tokensLeftForSale(), "CCC: exceeds sale allocation");

        uint256 previousRate = currentCashbackRate();
        uint256 cashbackEarned = _calculateCashback(amount, tokensSold);

        tokensSold += amount;
        purchased[buyer] += amount;
        cashbackAccrued[buyer] += cashbackEarned;
        totalCashbackAccrued += cashbackEarned;

        // Interactions after state changes (CEI pattern).
        require(token.transfer(buyer, amount), "CCC: token transfer failed");

        emit TokensPurchased(buyer, amount, cashbackEarned, initiatedBy);

        uint256 newRate = currentCashbackRate();
        if (newRate != previousRate) {
            emit CashbackRateChanged(previousRate, newRate, tokensSold);
        }

        if (saleFinished()) {
            emit SaleCompleted(tokensSold, getCashbackLiability());
        }
    }

    // =========================================================================
    // CASHBACK WITHDRAWAL
    // =========================================================================

    /// @notice Withdraws a specific amount of accrued cashback.
    /// @param amount Cashback amount to withdraw.
    function withdrawCashback(uint256 amount) external nonReentrant {
        require(saleFinished(), "CCC: sale not finished");
        require(amount > 0, "CCC: amount is zero");

        uint256 withdrawable = getWithdrawableCashback(msg.sender);
        require(amount <= withdrawable, "CCC: amount exceeds cashback");

        cashbackClaimed[msg.sender] += amount;
        totalCashbackClaimed += amount;

        require(token.transfer(msg.sender, amount), "CCC: token transfer failed");

        emit CashbackClaimed(msg.sender, amount);
    }

    /// @notice Withdraws all available cashback for the caller.
    function withdrawAllCashback() external {
        withdrawCashback(getWithdrawableCashback(msg.sender));
    }

    // =========================================================================
    // OWNER FUNCTIONS
    // =========================================================================

    /// @notice Withdraws tokens that exceed cashback obligations after sale completion.
    /// @param to Recipient of excess tokens.
    /// @param amount Amount to withdraw.
    function withdrawExcessTokens(address to, uint256 amount) external onlyOwner nonReentrant {
        require(saleFinished(), "CCC: sale not finished");
        require(to != address(0), "CCC: recipient is zero address");
        require(amount > 0, "CCC: amount is zero");

        uint256 available = getExcessTokens();
        require(amount <= available, "CCC: amount exceeds excess");

        uint256 balanceAfter = getTokenBalance() - amount;
        require(balanceAfter >= getCashbackLiability(), "CCC: violates solvency");

        require(token.transfer(to, amount), "CCC: token transfer failed");
    }

    // =========================================================================
    // VIEW FUNCTIONS — SALE STATUS
    // =========================================================================

    /// @notice Returns number of tokens remaining for sale.
    function tokensLeftForSale() public view returns (uint256) {
        return TOKENS_FOR_SALE - tokensSold;
    }

    /// @notice Returns true when all tokens have been sold.
    function saleFinished() public view returns (bool) {
        return tokensSold >= TOKENS_FOR_SALE;
    }

    /// @notice Returns current cashback rate (0–20) for the next token to be sold.
    function currentCashbackRate() public view returns (uint256) {
        return _rateForPosition(tokensSold);
    }

    /// @notice Returns current stage (1–5) for the next token to be sold.
    function currentStage() external view returns (uint256) {
        return _stageForPosition(tokensSold);
    }

    // =========================================================================
    // VIEW FUNCTIONS — BUYER INFO
    // =========================================================================

    /// @notice Returns withdrawable cashback for a buyer.
    function getWithdrawableCashback(address buyer) public view returns (uint256) {
        return cashbackAccrued[buyer] - cashbackClaimed[buyer];
    }

    // =========================================================================
    // VIEW FUNCTIONS — CONTRACT STATE
    // =========================================================================

    /// @notice Returns current token balance held by the contract.
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /// @notice Returns current unpaid cashback liability.
    function getCashbackLiability() public view returns (uint256) {
        return totalCashbackAccrued - totalCashbackClaimed;
    }

    /// @notice Returns tokens that can be safely withdrawn by the owner after covering liabilities.
    function getExcessTokens() public view returns (uint256) {
        uint256 balance = getTokenBalance();
        uint256 liability = getCashbackLiability();
        if (balance <= liability) {
            return 0;
        }
        return balance - liability;
    }

    // =========================================================================
    // INTERNAL HELPERS
    // =========================================================================

    function _calculateCashback(uint256 amount, uint256 soldBefore) private pure returns (uint256) {
        uint256[5] memory stageEnds = [STAGE1_END, STAGE2_END, STAGE3_END, STAGE4_END, TOKENS_FOR_SALE];
        uint256[5] memory rates = [STAGE1_RATE, STAGE2_RATE, STAGE3_RATE, STAGE4_RATE, STAGE5_RATE];

        uint256 cashback;
        uint256 remaining = amount;
        uint256 position = soldBefore;

        for (uint256 i = 0; i < stageEnds.length && remaining > 0; i++) {
            if (position >= stageEnds[i]) {
                continue;
            }

            uint256 tokensInStage = stageEnds[i] - position;
            if (tokensInStage > remaining) {
                tokensInStage = remaining;
            }

            cashback += (tokensInStage * rates[i]) / 100;
            position += tokensInStage;
            remaining -= tokensInStage;
        }

        return cashback;
    }

    function _rateForPosition(uint256 sold) private pure returns (uint256) {
        if (sold < STAGE1_END) {
            return STAGE1_RATE;
        }
        if (sold < STAGE2_END) {
            return STAGE2_RATE;
        }
        if (sold < STAGE3_END) {
            return STAGE3_RATE;
        }
        if (sold < STAGE4_END) {
            return STAGE4_RATE;
        }
        if (sold < TOKENS_FOR_SALE) {
            return STAGE5_RATE;
        }
        // Sale finished; no next token.
        return 0;
    }

    function _stageForPosition(uint256 sold) private pure returns (uint256) {
        if (sold < STAGE1_END) {
            return 1;
        }
        if (sold < STAGE2_END) {
            return 2;
        }
        if (sold < STAGE3_END) {
            return 3;
        }
        if (sold < STAGE4_END) {
            return 4;
        }
        return 5;
    }
}
