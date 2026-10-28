import React from 'react';
import type {Address} from 'viem';
import {type Chain, mainnet, sepolia} from 'viem/chains';
import deploymentRecords from '@site/src/deployments.json';
import {isDeployedChainId} from '@site/src/constants';
import {type NamedLink, verifiedSourceLinks} from '@site/src/components/contracts/contractLinks';

type ContractName = keyof typeof deploymentRecords;
type Deployment = { address: Address; blockNumber: string; time: string };

const KNOWN_CHAINS: readonly Chain[] = [mainnet, sepolia];

function sourceLinks(chainId: number, address: Address): NamedLink[] {
    return isDeployedChainId(chainId) ? verifiedSourceLinks(chainId, address) : [];
}

/** The current deployment of a contract on every chain, read from src/deployments.json at build time. */
export default function DeploymentsTable({contractName}: { contractName: ContractName }) {
    // scripts/sync-deployments.mjs has checked every address against the 0x… format.
    const deploymentsByChain = deploymentRecords[contractName].chains as Record<string, Deployment>;

    return (
        <table>
            <thead>
            <tr>
                <th>Network</th>
                <th>Address</th>
                <th>Deployed</th>
                <th>Verified source</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(deploymentsByChain).map(([chainIdText, deployment]) => {
                const chainId = Number(chainIdText);
                const chain = KNOWN_CHAINS.find((knownChain) => knownChain.id === chainId);
                return (
                    <tr key={chainIdText}>
                        <td>{chain?.name ?? `Chain ${chainId}`}{chain?.testnet ? ' (test network)' : ''}</td>
                        <td><code>{deployment.address}</code></td>
                        <td>{deployment.time.slice(0, 10)}, block {deployment.blockNumber}</td>
                        <td>
                            {sourceLinks(chainId, deployment.address).map((explorer, index) => (
                                <React.Fragment key={explorer.name}>
                                    {index > 0 ? ' · ' : null}
                                    <a href={explorer.url} target="_blank" rel="noreferrer noopener">{explorer.name}</a>
                                </React.Fragment>
                            ))}
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}
