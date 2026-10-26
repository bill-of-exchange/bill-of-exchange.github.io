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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const billsOfExchangeAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'holder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
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
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'holder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BurnOfUnaccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Draw',
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
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferOfUnaccepted',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'CONTRACT_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CURRENCY',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DESCRIPTION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DRAWEE_ETH_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DRAWEE_NAME',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DRAWER_ETH_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DRAWER_NAME',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'KYC_AND_AML_NOTICE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LEGAL_SIGNATURE_STATEMENT',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ORDER',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SUM_PER_BILL',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TIME_OF_PAYMENT',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'accept',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'holder', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'acceptOn',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOfUnaccepted',
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
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'burnOfUnaccepted',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'draw',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupplyOfUnaccepted',
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
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferOfUnaccepted',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const billsOfExchangeAddress = {
  1: '0x0000000000000000000000000000000000000000',
  11155111: '0x1Cb4B349C67cda9B28358cE7C6Ed2fa1761c2224',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchange = /*#__PURE__*/ createUseReadContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"CONTRACT_VERSION"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeContractVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'CONTRACT_VERSION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"CURRENCY"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeCurrency =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'CURRENCY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"DESCRIPTION"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeDescription =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'DESCRIPTION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"DRAWEE_ETH_ADDRESS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeDraweeEthAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'DRAWEE_ETH_ADDRESS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"DRAWEE_NAME"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeDraweeName =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'DRAWEE_NAME',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"DRAWER_ETH_ADDRESS"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeDrawerEthAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'DRAWER_ETH_ADDRESS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"DRAWER_NAME"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeDrawerName =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'DRAWER_NAME',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"KYC_AND_AML_NOTICE"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeKycAndAmlNotice =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'KYC_AND_AML_NOTICE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"LEGAL_SIGNATURE_STATEMENT"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeLegalSignatureStatement =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'LEGAL_SIGNATURE_STATEMENT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"ORDER"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeOrder = /*#__PURE__*/ createUseReadContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
  functionName: 'ORDER',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"SUM_PER_BILL"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeSumPerBill =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'SUM_PER_BILL',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"TIME_OF_PAYMENT"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeTimeOfPayment =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'TIME_OF_PAYMENT',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"allowance"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"balanceOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeBalanceOfUnaccepted =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'balanceOfUnaccepted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"decimals"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"name"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeName = /*#__PURE__*/ createUseReadContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeSymbol = /*#__PURE__*/ createUseReadContract(
  {
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'symbol',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"totalSupply"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"totalSupplyOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useReadBillsOfExchangeTotalSupplyOfUnaccepted =
  /*#__PURE__*/ createUseReadContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'totalSupplyOfUnaccepted',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchange = /*#__PURE__*/ createUseWriteContract({
  abi: billsOfExchangeAbi,
  address: billsOfExchangeAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"accept"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchangeAccept =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'accept',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"acceptOn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchangeAcceptOn =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'acceptOn',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchangeBurnFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"burnOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchangeBurnOfUnaccepted =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burnOfUnaccepted',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"draw"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchangeDraw = /*#__PURE__*/ createUseWriteContract(
  {
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'draw',
  },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchangeTransferFromAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferFromAndCall',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWriteBillsOfExchangeTransferOfUnaccepted =
  /*#__PURE__*/ createUseWriteContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferOfUnaccepted',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useSimulateBillsOfExchangeAccept =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'accept',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"acceptOn"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useSimulateBillsOfExchangeAcceptOn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'acceptOn',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"approve"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useSimulateBillsOfExchangeBurnFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burnFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"burnOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useSimulateBillsOfExchangeBurnOfUnaccepted =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'burnOfUnaccepted',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"draw"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useSimulateBillsOfExchangeDraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'draw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useSimulateBillsOfExchangeTransferFromAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferFromAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `functionName` set to `"transferOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useSimulateBillsOfExchangeTransferOfUnaccepted =
  /*#__PURE__*/ createUseSimulateContract({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    functionName: 'transferOfUnaccepted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWatchBillsOfExchangeApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"BurnOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWatchBillsOfExchangeBurnOfUnacceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'BurnOfUnaccepted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"Draw"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWatchBillsOfExchangeDrawEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'Draw',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"Transfer"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWatchBillsOfExchangeTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link billsOfExchangeAbi}__ and `eventName` set to `"TransferOfUnaccepted"`
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x0000000000000000000000000000000000000000)
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x1cb4b349c67cda9b28358ce7c6ed2fa1761c2224)
 */
export const useWatchBillsOfExchangeTransferOfUnacceptedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: billsOfExchangeAbi,
    address: billsOfExchangeAddress,
    eventName: 'TransferOfUnaccepted',
  })
