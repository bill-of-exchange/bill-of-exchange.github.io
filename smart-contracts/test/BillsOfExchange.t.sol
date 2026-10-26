// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;

import {Test, Vm} from "forge-std/Test.sol";
import {IERC20Errors} from "@openzeppelin/contracts/interfaces/draft-IERC6093.sol";
import {BillsOfExchange} from "../contracts/BillsOfExchange.sol";

/// @notice Minimal test suite for BillsOfExchange v0.1.0.
/// @dev Each section maps to a section of BillOfExchange_Specification.v.0.1.0.md.
///      In the demonstration build the drawer and the drawee are the same address,
///      so both roles are exercised through `party`.
contract BillsOfExchangeTest is Test {
    BillsOfExchange internal bills;

    address internal party;
    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");
    address internal stranger = makeAddr("stranger");

    bytes32 internal constant TRANSFER_EVENT_SIGNATURE = keccak256("Transfer(address,address,uint256)");

    function setUp() public {
        bills = new BillsOfExchange();
        party = bills.DRAWER_ETH_ADDRESS();
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    function _drawAsParty(uint256 amount) internal {
        vm.prank(party);
        bills.draw(amount);
    }

    /// @dev Total number of bills in existence, whatever their ledger (spec §5, invariant 1).
    function _totalBillsInExistence() internal view returns (uint256) {
        return bills.totalSupplyOfUnaccepted() + bills.totalSupply();
    }

    // ---------------------------------------------------------------------
    // §3: constants and metadata
    // ---------------------------------------------------------------------

    function test_metadataAndConstants() public view {
        assertEq(bills.CONTRACT_VERSION(), "0.1.0");
        assertEq(bills.decimals(), 2);
        assertEq(bills.CURRENCY(), "ILS");
        assertEq(bills.TIME_OF_PAYMENT(), "at sight");
        assertEq(bills.totalSupply(), 0, "no bills may exist after deployment");
        assertEq(bills.totalSupplyOfUnaccepted(), 0, "no bills may exist after deployment");
    }

    // ---------------------------------------------------------------------
    // §4.2: drawing
    // ---------------------------------------------------------------------

    function test_draw_creditsUnacceptedLedgerOfDrawer() public {
        vm.expectEmit(address(bills));
        emit BillsOfExchange.Draw(100);
        _drawAsParty(100);

        assertEq(bills.balanceOfUnaccepted(party), 100);
        assertEq(bills.totalSupplyOfUnaccepted(), 100);
        assertEq(bills.balanceOf(party), 0, "drawing must not touch the accepted (ERC-20) ledger");
    }

    function test_draw_revertsForNonDrawer() public {
        vm.prank(stranger);
        vm.expectRevert(bytes("BOE: Only drawer can draw"));
        bills.draw(100);
    }

    function test_draw_revertsForZeroAmount() public {
        vm.prank(party);
        vm.expectRevert(bytes("BOE: Amount must be positive"));
        bills.draw(0);
    }

    // ---------------------------------------------------------------------
    // §4.3 and §4.4: unaccepted ledger
    // ---------------------------------------------------------------------

    function test_transferOfUnaccepted_movesBillsWithoutTouchingErc20() public {
        _drawAsParty(100);

        vm.expectEmit(address(bills));
        emit BillsOfExchange.TransferOfUnaccepted(party, alice, 40);
        vm.prank(party);
        bills.transferOfUnaccepted(alice, 40);

        assertEq(bills.balanceOfUnaccepted(party), 60);
        assertEq(bills.balanceOfUnaccepted(alice), 40);
        assertEq(bills.totalSupplyOfUnaccepted(), 100, "a transfer must not change the number of bills");
        assertEq(bills.totalSupply(), 0);
    }

    function test_transferOfUnaccepted_revertsOnInsufficientBalance() public {
        _drawAsParty(10);
        vm.prank(party);
        vm.expectRevert(bytes("BOE: Insufficient unaccepted balance"));
        bills.transferOfUnaccepted(alice, 11);
    }

    function test_transferOfUnaccepted_revertsToZeroAddress() public {
        _drawAsParty(10);
        vm.prank(party);
        vm.expectRevert(bytes("BOE: Transfer to zero address"));
        bills.transferOfUnaccepted(address(0), 1);
    }

    function test_unacceptedBillsCannotMoveThroughErc20() public {
        _drawAsParty(10);
        vm.prank(party);
        vm.expectRevert(abi.encodeWithSelector(IERC20Errors.ERC20InsufficientBalance.selector, party, 0, 1));
        bills.transfer(alice, 1);
    }

    function test_burnOfUnaccepted_destroysBills() public {
        _drawAsParty(100);
        vm.prank(party);
        bills.transferOfUnaccepted(alice, 30);

        vm.expectEmit(address(bills));
        emit BillsOfExchange.BurnOfUnaccepted(alice, 30);
        vm.prank(alice);
        bills.burnOfUnaccepted(30);

        assertEq(bills.balanceOfUnaccepted(alice), 0);
        assertEq(bills.totalSupplyOfUnaccepted(), 70);
    }

    // ---------------------------------------------------------------------
    // §4.5: acceptance — the key legal event
    // ---------------------------------------------------------------------

    function test_accept_movesBillsOfDraweeBetweenLedgers() public {
        _drawAsParty(100);

        vm.expectEmit(address(bills));
        emit BillsOfExchange.Acceptance(party, 60);
        vm.prank(party);
        bills.accept(60);

        assertEq(bills.balanceOfUnaccepted(party), 40);
        assertEq(bills.balanceOf(party), 60);
        assertEq(_totalBillsInExistence(), 100, "acceptance must not create bills");
    }

    function test_acceptOn_acceptsBillsHeldByAnotherHolder() public {
        _drawAsParty(100);
        vm.prank(party);
        bills.transferOfUnaccepted(alice, 50);

        vm.prank(party);
        bills.acceptOn(alice, 50);

        assertEq(bills.balanceOfUnaccepted(alice), 0);
        assertEq(bills.balanceOf(alice), 50, "accepted bills stay with their holder");
        assertEq(_totalBillsInExistence(), 100);
    }

    /// @dev Spec §4.5.3: acceptance changes the state of a bill, not the set of bills,
    ///      so no ERC-20 Transfer (mint) event may be emitted.
    function test_acceptance_emitsNoErc20TransferEvent() public {
        _drawAsParty(100);
        vm.prank(party);
        bills.transferOfUnaccepted(alice, 100);

        vm.recordLogs();
        vm.prank(party);
        bills.acceptOn(alice, 100);

        Vm.Log[] memory logs = vm.getRecordedLogs();
        for (uint256 i = 0; i < logs.length; i++) {
            assertTrue(logs[i].topics[0] != TRANSFER_EVENT_SIGNATURE, "acceptance emitted an ERC-20 Transfer event");
        }
    }

    function test_acceptance_revertsForNonDrawee() public {
        _drawAsParty(10);
        vm.prank(stranger);
        vm.expectRevert(bytes("BOE: Only drawee can accept"));
        bills.accept(1);

        vm.prank(stranger);
        vm.expectRevert(bytes("BOE: Only drawee can accept"));
        bills.acceptOn(party, 1);
    }

    function test_acceptance_revertsBeyondUnacceptedBalance() public {
        _drawAsParty(10);
        vm.prank(party);
        vm.expectRevert(bytes("BOE: Insufficient unaccepted balance"));
        bills.accept(11);
    }

    // ---------------------------------------------------------------------
    // §4.6: accepted bills behave as a standard ERC-20 token
    // ---------------------------------------------------------------------

    function test_acceptedBillsCirculateAndBurnAsErc20() public {
        _drawAsParty(100);
        vm.prank(party);
        bills.accept(100);

        vm.prank(party);
        assertTrue(bills.transfer(bob, 25));
        assertEq(bills.balanceOf(bob), 25);

        vm.prank(bob);
        bills.burn(5);
        assertEq(bills.balanceOf(bob), 20);
        assertEq(_totalBillsInExistence(), 95);
    }

    // ---------------------------------------------------------------------
    // Ether rejection
    // ---------------------------------------------------------------------

    function test_rejectsEtherAndUnknownCalls() public {
        vm.deal(address(this), 1 ether);

        (bool etherAccepted,) = address(bills).call{value: 1}("");
        assertFalse(etherAccepted, "contract must reject plain Ether");

        (bool unknownCallAccepted,) = address(bills).call(abi.encodeWithSignature("doesNotExist()"));
        assertFalse(unknownCallAccepted, "contract must reject unknown calls");
    }

    // ---------------------------------------------------------------------
    // §5: conservation of bills (fuzzed)
    // ---------------------------------------------------------------------

    /// @dev Bills in existence = drawn − burned, whatever moves between ledgers in between.
    function testFuzz_conservationOfBills(
        uint256 drawnAmount,
        uint256 acceptedAmount,
        uint256 burnedUnacceptedAmount,
        uint256 burnedAcceptedAmount
    ) public {
        drawnAmount = bound(drawnAmount, 1, type(uint128).max);
        acceptedAmount = bound(acceptedAmount, 0, drawnAmount);
        burnedUnacceptedAmount = bound(burnedUnacceptedAmount, 0, drawnAmount - acceptedAmount);
        burnedAcceptedAmount = bound(burnedAcceptedAmount, 0, acceptedAmount);

        _drawAsParty(drawnAmount);

        vm.startPrank(party);
        if (acceptedAmount > 0) bills.accept(acceptedAmount);
        if (burnedUnacceptedAmount > 0) bills.burnOfUnaccepted(burnedUnacceptedAmount);
        if (burnedAcceptedAmount > 0) bills.burn(burnedAcceptedAmount);
        vm.stopPrank();

        assertEq(_totalBillsInExistence(), drawnAmount - burnedUnacceptedAmount - burnedAcceptedAmount);
        assertEq(bills.totalSupply(), acceptedAmount - burnedAcceptedAmount);
    }
}
