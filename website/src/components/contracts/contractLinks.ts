import {type Address, toFunctionSelector} from 'viem';
import {
    blockchainExplorerUrl,
    defaultBlockchainExplorer,
    type DeployedChainId,
    SOURCIFY_REPOSITORY_URL,
} from '@site/src/constants';

export type NamedLink = { name: string; url: string };

/**
 * The contract itself. Sourcify, not a block explorer: it shows the verified source code, and from
 * there links on to the contract on Etherscan and Blockscout.
 */
export function contractUrl(chainId: DeployedChainId, address: Address): string {
    return `${SOURCIFY_REPOSITORY_URL}${chainId}/${address}`;
}

/**
 * The current value of a public getter of the contract, read from the chain by the explorer.
 * Blockscout's "Read/Write contract" tab opens and reads the method named by its selector in the
 * URL fragment (the same link Blockscout copies from the method's link icon); Sourcify cannot read
 * values at all. Hence Blockscout here, whatever the default explorer is.
 */
export function contractFieldUrl(chainId: DeployedChainId, address: Address, getterName: string): string {
    const selector = toFunctionSelector(`function ${getterName}()`);
    return `${blockchainExplorerUrl.Blockscout[chainId]}address/${address}?tab=read_write_contract#${selector}`;
}

/** An account (or any address that is not this contract) on the site's default block explorer. */
export function explorerAddressUrl(chainId: DeployedChainId, address: Address): string {
    return `${blockchainExplorerUrl[defaultBlockchainExplorer][chainId]}address/${address}`;
}

/** Where anyone can read the verified source code of a contract, in the order the site lists them. */
export function verifiedSourceLinks(chainId: DeployedChainId, address: Address): NamedLink[] {
    // Each service opens its verified-source view with a different URL shape.
    return [
        {name: 'Sourcify', url: contractUrl(chainId, address)},
        {name: 'Etherscan', url: `${blockchainExplorerUrl.Etherscan[chainId]}address/${address}#code`},
        {name: 'Blockscout', url: `${blockchainExplorerUrl.Blockscout[chainId]}address/${address}?tab=contract`},
    ];
}

/** A transaction on the site's default block explorer. */
export function explorerTransactionUrl(chainId: DeployedChainId, transactionHash: string): string {
    return `${blockchainExplorerUrl[defaultBlockchainExplorer][chainId]}tx/${transactionHash}`;
}

/** Where a holder can see the full history of their transfers of this contract's bills. */
export function holderHistoryLinks(chainId: DeployedChainId, holder: Address, contract: Address): NamedLink[] {
    return [
        {name: 'Blockscout', url: `${blockchainExplorerUrl.Blockscout[chainId]}address/${holder}?tab=token_transfers`},
        // Etherscan's token page filtered to one holder ("?a=").
        {name: 'Etherscan', url: `${blockchainExplorerUrl.Etherscan[chainId]}token/${contract}?a=${holder}`},
    ];
}

/**
 * Blockscout's API for a holder's transfers of one token, newest first. Blockscout indexes the chain,
 * so this works however long ago the contract was deployed, unlike reading the logs from a node.
 */
export function holderTransfersApiUrl(chainId: DeployedChainId, holder: Address, contract: Address): string {
    return `${blockchainExplorerUrl.Blockscout[chainId]}api/v2/addresses/${holder}/token-transfers?type=ERC-20&token=${contract}`;
}
