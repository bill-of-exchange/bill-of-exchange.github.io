import {type Address, type Chain, zeroAddress} from 'viem';
import {useAccount} from 'wagmi';
import {type ContractName, type DeployedChainId, deployments, isDeployedChainId} from '@site/src/constants';
import {chains} from '@site/src/wagmiConfig';

export type DisplayedContract = {
    chainId: DeployedChainId;
    chain: Chain;
    address: Address;
    /** False when the contract has no deployment on this chain (its address is the zero address). */
    isDeployed: boolean;
};

/**
 * The chain whose contract the interface shows, and the contract's address there.
 *
 * It is the wallet's chain when the wallet is connected to a supported chain; otherwise (no wallet,
 * or an unsupported chain) it is wagmi's default chain, the first in `chains`: Sepolia while `mode`
 * is 'dev'. Everything shown on a page must come from this one chain, so that the bill, the
 * registry figures and the explorer links never mix two deployments.
 */
export function useDisplayedContract(contractName: ContractName): DisplayedContract {
    const {chainId: walletChainId} = useAccount();
    const chainId: DeployedChainId = isDeployedChainId(walletChainId)
        ? walletChainId
        : chains[0].id as DeployedChainId;
    const chain = chains.find((candidate) => candidate.id === chainId) ?? chains[0];
    const address = deployments[contractName][chainId];
    return {chainId, chain, address, isDeployed: address !== zeroAddress};
}
