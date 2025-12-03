// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.28;

import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BillsOfExchange is ERC20, ERC20Burnable, Ownable, ERC1363, ERC20Permit {

    constructor(address _draweeEthereumAddress)
        ERC20("BillsOfExchange", unicode"₪")
        Ownable(msg.sender)
        ERC20Permit("BillsOfExchange")
    {
        issuedOnUnixTime = block.timestamp;
        draweeEthereumAddress = _draweeEthereumAddress;
        // decimals = 2;
        _mint(msg.sender, 10000 * 10 ** 2); // TODO: change in production
    }

    function decimals() public pure override returns (uint8){
        return 2;
    }

    // every ERC-20 (https://eips.ethereum.org/EIPS/eip-20) token in this smart-contract represents a bill of exchange
    // as defined in UK Bills of Exchange Act 1882 (https://www.legislation.gov.uk/ukpga/Vict/45-46/61/section/3):
    // an unconditional order in writing, addressed by one person (drawer) to another (drawee), signed by the person giving it,
    // requiring the person to whom it is addressed to pay on demand a sum certain in money to bearer
    string public description = "Every token (ERC-20) in this smart contract is a bill of exchange in blank - payable to bearer (bearer is the owner of the Ethereum address witch holds the tokens, or the person he/she represents), but not to order - that means no endorsement possible and the token holder can only transfer the token (bill of exchange in blank) itself. In the case of the Ethereum blockchain fork, the blockchain that has the highest hashrate is considered valid, and all others are not considered a valid registry; bill payment settles bill even if valid blockchain (hashrate) changes after the payment. All Ethereum test networks are not valid registries";

    // written order as
    string public order = "Pay to bearer (tokenholder), but not to order, the sum of 0.01 Israeli new shekel";

    /*  a statement of the time of payment
    *  we use string to make possible variants like: '01 Jan 2026', 'at sight', 'at sight but not before 2026-12-31'
    *  '10 days after sight' etc.,
    * see https://www.jus.uio.no/lm/bills.of.exchange.and.promissory.notes.convention.1930/doc.html#109
    */
    string public timeOfPayment = "at sight";

    // A statement of the date (Unix time) and of the place where the bill is issued
    uint256 public issuedOnUnixTime;
    string public placeWhereTheBillIsIssued = "London, UK"; //  for example: "London, U.K."

    /**
    * Legal name of a person who issues the bill (drawer)
    * This can be a name of a company/organization or of a physical person
    */
    string public drawer = "Drawer LTD., 10 Main Street, London, UK";
    address public drawerEthereumAddress;

    // a statement of the place where payment is to be made;
    // usually it is an address of the payer
    string public placeWherePaymentIsToBeMade = "12 Main Street, London, UK";

    // https://en.wikipedia.org/wiki/ISO_4217
    string public currency = "ILS"; // for example: "EUR", "USD"
    string public sumToBePaidForEveryToken = "0.01"; // for example: 1 (one) US dollar per token

    /**
    * The name of the person who is to pay (drawee)
    */
    string public drawee = "Drawee Bank, 12 Main Street, London, UK";
    address public draweeEthereumAddress;
    uint256 public acceptedOnUnixTime;

    /**
    * Drawee can accept only all bills in the smart contract, or not accept at all
    * @param acceptedOnUnixTime Time when drawee accepted bills
    */
    event Acceptance(
        uint256 acceptedOnUnixTime
    );

    /**
    * function for drawee to accept bill of exchange
    * see:
    * http://www.legislation.gov.uk/ukpga/Vict/45-46/61/section/17
    * https://www.jus.uio.no/lm/bills.of.exchange.and.promissory.notes.convention.1930/doc.html#69
    */
    function accept() external returns (bool success) {

        /*
        * this should be called only by address, previously indicated as drawee's address by the drawer
        */
        require(
            msg.sender == draweeEthereumAddress,
            "Not authorized to accept"
        );

        require(
            acceptedOnUnixTime == 0,
            "Accepted already"
        );

        acceptedOnUnixTime = block.timestamp;

        emit Acceptance(acceptedOnUnixTime);

        return true;
    }

}
