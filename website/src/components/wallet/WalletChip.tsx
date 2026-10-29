import React from 'react';
import {useAccount, useDisconnect} from 'wagmi';
import truncateAddress from '@site/src/components/wagmi/truncateAddress';
import styles from './MyBills.module.css';

/**
 * The connected wallet and network, with a way to disconnect. On phones the navbar hides the
 * wallet button inside the menu; this keeps the connection visible on the page itself.
 */
export default function WalletChip() {
    const {address, isConnected, connector, chain, chainId} = useAccount();
    const {disconnect} = useDisconnect();
    if (!isConnected || address === undefined) {
        return null;
    }
    return (
        <div className={styles.walletChip}>
            <span>
                {connector?.name ?? 'Wallet'} · <code title={address}>{truncateAddress(address)}</code> ·{' '}
                {chain?.name ?? `chain ${chainId}`}
            </span>
            <button type="button" className="button button--sm button--secondary" onClick={() => disconnect()}>
                Disconnect
            </button>
        </div>
    );
}
