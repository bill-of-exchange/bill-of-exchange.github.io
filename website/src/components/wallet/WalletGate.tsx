import React, {type ReactNode} from 'react';
import {type Address, zeroAddress} from 'viem';
import {useAccount, useConnect, useSwitchChain} from 'wagmi';
import {deployments, isDeployedChainId} from '@site/src/constants';
import {chains} from '@site/src/wagmiConfig';
import styles from './MyBills.module.css';

// The chain the bills live on: the first chain of the site's configuration with a deployment.
const BILLS_CHAIN = chains.find((chain) =>
    isDeployedChainId(chain.id) && deployments.BillsOfExchange[chain.id] !== zeroAddress);

const HOLDER_CONNECT_PROMPT =
    'Connect the wallet that holds your bills to see them and send them. The site only reads from your ' +
    'wallet: every transfer needs your confirmation in the wallet itself.';

type WalletGateProps = {
    /** Rendered only for a connected wallet on the chain the bills live on. */
    children: (account: Address) => ReactNode;
    /** What connecting the wallet is for, on this page. */
    connectPrompt?: string;
};

/**
 * Shows the holder's content only when it can work: a wallet is connected, and it is on the chain
 * where the contract is deployed. Otherwise it says what to do. This is what keeps every action from
 * being sent to a chain without the contract.
 */
export default function WalletGate({children, connectPrompt = HOLDER_CONNECT_PROMPT}: WalletGateProps) {
    const {address, isConnected, chainId, chain} = useAccount();

    if (!isConnected || address === undefined) {
        return <ConnectPanel prompt={connectPrompt}/>;
    }
    const isOnBillsChain = isDeployedChainId(chainId) && deployments.BillsOfExchange[chainId] !== zeroAddress;
    if (!isOnBillsChain) {
        return <WrongNetworkPanel walletChainName={chain?.name ?? `chain ${chainId}`}/>;
    }
    return <>{children(address)}</>;
}

function ConnectPanel({prompt}: { prompt: string }) {
    const {connectors, connect, isPending, error} = useConnect();
    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Connect your wallet</h2>
            <p>{prompt}</p>
            <div className={styles.actions}>
                {connectors.map((connector) => (
                    <button key={connector.uid} type="button" className="button button--primary"
                            disabled={isPending} onClick={() => connect({connector})}>
                        Connect {connector.name}
                    </button>
                ))}
            </div>
            {error && <p className={styles.errorText}>{error.message}</p>}
        </section>
    );
}

function WrongNetworkPanel({walletChainName}: { walletChainName: string }) {
    const {switchChain, isPending, error} = useSwitchChain();
    if (BILLS_CHAIN === undefined) {
        return <section className={styles.panel}><p>The contract is not deployed on any network yet.</p></section>;
    }
    return (
        <section className={styles.panel}>
            <h2 className={styles.panelTitle}>Switch to {BILLS_CHAIN.name}</h2>
            <p>Your wallet is on {walletChainName}; the bills are on {BILLS_CHAIN.name}.</p>
            <div className={styles.actions}>
                <button type="button" className="button button--primary" disabled={isPending}
                        onClick={() => switchChain({chainId: BILLS_CHAIN.id})}>
                    Switch to {BILLS_CHAIN.name}
                </button>
            </div>
            {error && <p className={styles.errorText}>{error.message}</p>}
        </section>
    );
}
