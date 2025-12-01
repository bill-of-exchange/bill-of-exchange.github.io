import {type Address} from 'viem';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faShekelSign} from '@fortawesome/free-solid-svg-icons';

// TODO: change in production
export const mode:'dev' | 'production' = 'dev';

export const currencySymbolSVG = faShekelSign;
export const currencySymbolString = "₪";
export const decimals = 18; // TODO: change

export const CHAINS = [1, 11155111] as const;
export type DeployedChainId = typeof CHAINS[number];

export const isDeployedChainId = (x: number | undefined): x is DeployedChainId =>
    x === 1 || x === 11155111

export type ContractName = 'BillsOfExchange';

// this is used in Wagmi CLI config, as well as in React components
export const deployments = {
    BillsOfExchange: {
        1:"0x0000000000000000000000000000000000000000" as Address,
        11155111: "0xdd5d36c9cce7893ebfc35c4390511281cab3da85" as Address, // Sepolia
    }
} as const satisfies Record<ContractName, Partial<Record<DeployedChainId, Address>>>

// --- Blockchain explorers
export const explorerNames = ["Blockscout", "Etherscan"] as const;
export type BlockchainExplorer = typeof explorerNames[number];
export const defaultBlockchainExplorer: BlockchainExplorer = explorerNames[1];
export const blockchainExplorerUrl = {
    Blockscout: {
        1: "https://www.blockscout.com/" as string,
        11155111: "https://eth-sepolia.blockscout.com/" as string,
    },
    Etherscan: {
        1: "https://www.etherscan.io/" as string,
        11155111: "https://sepolia.etherscan.io/" as string,
    }
} as const satisfies Record<BlockchainExplorer, Partial<Record<DeployedChainId, string>>>

export const TOKEN_DECIMALS = 2; // TODO: change if needed