import {type Address} from 'viem';

// TODO: change in production
export const mode:'dev' | 'production' = 'dev';

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

export const ExplorerNames = ["Blockscout", "Etherscan"] as const;
export type BlockchainExplorer = typeof ExplorerNames[number];

export const blockchainExplorer = {
    Blockscout: {
        1: "https://www.blockscout.com/" as string,
        11155111: "https://eth-sepolia.blockscout.com/" as string,
    },
    Etherscan: {
        1: "https://www.etherscan.io/" as string,
        11155111: "https://sepolia.etherscan.io/" as string,
    }
} as const satisfies Record<BlockchainExplorer, Partial<Record<DeployedChainId, string>>>