// SPDX-License-Identifier: MIT
// Fork of an ERC-1363 implementation adapted to the forked ERC20 in this repository.
pragma solidity ^0.8.20;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC20} from "./ERC20.sol";

interface IERC1363 is IERC165 {
    function transferAndCall(address to, uint256 value) external returns (bool);

    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);

    function transferFromAndCall(address from, address to, uint256 value) external returns (bool);

    function transferFromAndCall(address from, address to, uint256 value, bytes calldata data) external returns (bool);

    function approveAndCall(address spender, uint256 value) external returns (bool);

    function approveAndCall(address spender, uint256 value, bytes calldata data) external returns (bool);
}

interface IERC1363Receiver is IERC165 {
    function onTransferReceived(address operator, address from, uint256 value, bytes calldata data) external returns (bytes4);
}

interface IERC1363Spender is IERC165 {
    function onApprovalReceived(address owner, uint256 value, bytes calldata data) external returns (bytes4);
}

/**
 * @dev ERC-1363 implementation that builds on the forked ERC20.
 */
abstract contract ERC1363 is ERC20, IERC1363 {
    using Address for address;

    bytes4 private constant _INTERFACE_ID_ERC1363 = 0xb0202a11;
    bytes4 private constant _INTERFACE_ID_ERC1363_RECEIVER = 0x88a7ca5c;
    bytes4 private constant _INTERFACE_ID_ERC1363_SPENDER = 0x7b04a2d0;

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == _INTERFACE_ID_ERC1363 || interfaceId == type(IERC165).interfaceId;
    }

    function transferAndCall(address to, uint256 value) public virtual override returns (bool) {
        return transferAndCall(to, value, "");
    }

    function transferAndCall(address to, uint256 value, bytes memory data) public virtual override returns (bool) {
        transfer(to, value);
        require(_checkOnTransferReceived(_msgSender(), _msgSender(), to, value, data), "ERC1363: transfer to non ERC1363Receiver implementer");
        return true;
    }

    function transferFromAndCall(address from, address to, uint256 value) public virtual override returns (bool) {
        return transferFromAndCall(from, to, value, "");
    }

    function transferFromAndCall(address from, address to, uint256 value, bytes memory data) public virtual override returns (bool) {
        transferFrom(from, to, value);
        require(_checkOnTransferReceived(_msgSender(), from, to, value, data), "ERC1363: transfer to non ERC1363Receiver implementer");
        return true;
    }

    function approveAndCall(address spender, uint256 value) public virtual override returns (bool) {
        return approveAndCall(spender, value, "");
    }

    function approveAndCall(address spender, uint256 value, bytes memory data) public virtual override returns (bool) {
        approve(spender, value);
        require(_checkOnApprovalReceived(spender, value, data), "ERC1363: approval to non ERC1363Spender implementer");
        return true;
    }

    function _checkOnTransferReceived(
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) internal returns (bool) {
        if (!to.isContract()) {
            return true;
        }

        try IERC1363Receiver(to).onTransferReceived(operator, from, value, data) returns (bytes4 retval) {
            return retval == _INTERFACE_ID_ERC1363_RECEIVER;
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                return false;
            } else {
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }

    function _checkOnApprovalReceived(address spender, uint256 value, bytes memory data) internal returns (bool) {
        if (!spender.isContract()) {
            return true;
        }

        try IERC1363Spender(spender).onApprovalReceived(_msgSender(), value, data) returns (bytes4 retval) {
            return retval == _INTERFACE_ID_ERC1363_SPENDER;
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                return false;
            } else {
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }
}
