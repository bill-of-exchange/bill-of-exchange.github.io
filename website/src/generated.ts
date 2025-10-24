import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BillsOfExchange
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const billsOfExchangeAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_draweeEthereumAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1363ApproveFailed',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1363InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC1363InvalidSpender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1363TransferFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1363TransferFromFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'deadline', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC2612ExpiredSignature',
  },
  {
    type: 'error',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC2612InvalidSigner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'acceptedOnUnixTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Acceptance',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'accept',
    outputs: [{ name: 'success', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'acceptedOnUnixTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveAndCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'approveAndCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currency',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'description',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'drawee',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'draweeEthereumAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'drawer',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'drawerEthereumAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'issuedOnUnixTime',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'order',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'placeWherePaymentIsToBeMade',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'placeWhereTheBillIsIssued',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'sumToBePaidForEveryToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'timeOfPayment',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferAndCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'transferAndCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'transferFromAndCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFromAndCall',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const billsOfExchangeAddress = {
  1: '0x0000000000000000000000000000000000000000',
  11155111: '0xDd5D36c9cCe7893EbFC35c4390511281cAb3Da85',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const billsOfExchangeConfig = {
  address: billsOfExchangeAddress,
  abi: billsOfExchangeAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchange = /*#__PURE__*/ createUseReadContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"acceptedOnUnixTime"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeAcceptedOnUnixTime =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'acceptedOnUnixTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"balanceOf"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"currency"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeCurrency =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'currency',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"description"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeDescription =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'description',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"drawee"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeDrawee = /*#__PURE__*/ createUseReadContract(
  {
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'drawee',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"draweeEthereumAddress"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeDraweeEthereumAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'draweeEthereumAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"drawer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeDrawer = /*#__PURE__*/ createUseReadContract(
  {
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'drawer',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"drawerEthereumAddress"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeDrawerEthereumAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'drawerEthereumAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"eip712Domain"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeEip712Domain =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"issuedOnUnixTime"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeIssuedOnUnixTime =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'issuedOnUnixTime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeName = /*#__PURE__*/ createUseReadContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"nonces"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeNonces = /*#__PURE__*/ createUseReadContract(
  {
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'nonces',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"order"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeOrder = /*#__PURE__*/ createUseReadContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
  functionName: 'order',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"owner"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeOwner = /*#__PURE__*/ createUseReadContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"placeWherePaymentIsToBeMade"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangePlaceWherePaymentIsToBeMade =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'placeWherePaymentIsToBeMade',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"placeWhereTheBillIsIssued"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangePlaceWhereTheBillIsIssued =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'placeWhereTheBillIsIssued',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"sumToBePaidForEveryToken"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeSumToBePaidForEveryToken =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'sumToBePaidForEveryToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"symbol"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeSymbol = /*#__PURE__*/ createUseReadContract(
  {
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'symbol',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"timeOfPayment"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeTimeOfPayment =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'timeOfPayment',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useReadBillsOfExchangeTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchange = /*#__PURE__*/ createUseWriteContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"accept"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeAccept =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'accept',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"approveAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeApproveAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'approveAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeBurn = /*#__PURE__*/ createUseWriteContract(
  {
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burn',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"burnFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeBurnFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangePermit =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeTransferAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferFromAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeTransferFromAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferFromAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWriteBillsOfExchangeTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchange =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"accept"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeAccept =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'accept',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"approveAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeApproveAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'approveAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"burn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"burnFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeBurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"permit"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangePermit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeTransferAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferFrom"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferFromAndCall"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeTransferFromAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferFromAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useSimulateBillsOfExchangeTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWatchBillsOfExchangeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"Acceptance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWatchBillsOfExchangeAcceptanceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'Acceptance',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"Approval"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWatchBillsOfExchangeApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWatchBillsOfExchangeEip712DomainChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWatchBillsOfExchangeOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xdd5d36c9cce7893ebfc35c4390511281cab3da85)
 */
export const useWatchBillsOfExchangeTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'Transfer',
  })
