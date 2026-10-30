import {type Address, zeroAddress} from 'viem';
// The latest deployment of each contract on each chain, with its ABI, collected from
// smart-contracts/deployments by scripts/sync-deployments.mjs (run before `npm start` and `npm run build`).
import deploymentRecords from './deployments.json';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faShekelSign} from '@fortawesome/free-solid-svg-icons';

// TODO: change in production
export const mode:'dev' | 'production' = 'dev';

export const currencySymbolSVG = faShekelSign;
export const currencySymbolString = "₪";
// Must equal BillsOfExchange.decimals(): one smallest unit = one bill = 0.01 ILS (one agora).
// Used only by the old /manage components (src/components/contracts/BoE), kept until they are deleted.
// Everything else reads decimals() from the contract: see useBillDenomination.
export const TOKEN_DECIMALS = 2;

export const CHAINS = [1, 11155111] as const;
export type DeployedChainId = typeof CHAINS[number];

export const isDeployedChainId = (x: number | undefined): x is DeployedChainId =>
    x === 1 || x === 11155111

export type ContractName = 'BillsOfExchange';

type DeploymentRecords = Partial<Record<ContractName, { chains: Partial<Record<string, { address: Address }>> }>>;

/** Chains without a deployment get the zero address, which the UI treats as "not deployed". */
function addressesOf(contractName: ContractName): Record<DeployedChainId, Address> {
    const deploymentsByChain = (deploymentRecords as DeploymentRecords)[contractName]?.chains ?? {};
    return Object.fromEntries(
        CHAINS.map((chainId) => [chainId, deploymentsByChain[chainId]?.address ?? zeroAddress]),
    ) as Record<DeployedChainId, Address>;
}

// Used by the Wagmi CLI config (and, through generated.ts, by the hooks) and by React components.
export const deployments = {
    BillsOfExchange: addressesOf('BillsOfExchange'),
} satisfies Record<ContractName, Record<DeployedChainId, Address>>;

// --- Blockchain explorers
export const explorerNames = ["Blockscout", "Etherscan"] as const;
export type BlockchainExplorer = typeof explorerNames[number];
// Where links to accounts and transactions lead (links to the contract itself go to Sourcify: see
// src/components/contracts/contractLinks.ts).
export const defaultBlockchainExplorer: BlockchainExplorer = 'Blockscout';
export const blockchainExplorerUrl = {
    Blockscout: {
        1: "https://eth.blockscout.com/" as string,
        11155111: "https://eth-sepolia.blockscout.com/" as string,
    },
    Etherscan: {
        1: "https://www.etherscan.io/" as string,
        11155111: "https://sepolia.etherscan.io/" as string,
    }
} as const satisfies Record<BlockchainExplorer, Partial<Record<DeployedChainId, string>>>

// Sourcify keeps verified sources for every chain under one address: <repository>/<chainId>/<address>.
export const SOURCIFY_REPOSITORY_URL = 'https://repo.sourcify.dev/';
