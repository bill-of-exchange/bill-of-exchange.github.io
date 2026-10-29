import React from 'react';
import type {Address} from 'viem';
import {useQuery} from '@tanstack/react-query';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {
    explorerAddressUrl,
    explorerTransactionUrl,
    holderHistoryLinks,
    holderTransfersApiUrl,
} from '@site/src/components/contracts/contractLinks';
import truncateAddress from '@site/src/components/wagmi/truncateAddress';
import {useBillTerms} from '@site/src/components/bill/useBillTerms';
import {currencySymbol, formatBillCount, formatBillsSum} from '@site/src/components/bill/formatBills';
import styles from './MyBills.module.css';

const SHOWN_TRANSFERS = 5;

/** The fields of Blockscout's token-transfer items that are used here. */
type BlockscoutTransfer = {
    timestamp: string;
    transaction_hash: string;
    log_index: number;
    from: { hash: Address };
    to: { hash: Address };
    total: { value: string };
};

/** The holder's last transfers of these bills, in and out, with links to the full history. */
export default function ActivityCard({holder}: { holder: Address }) {
    const contract = useDisplayedContract('BillsOfExchange');
    const termsResult = useBillTerms();
    const symbol = termsResult.status === 'ready' ? currencySymbol(termsResult.terms.CURRENCY) : '';

    const {data: transfers, status} = useQuery({
        queryKey: ['holder-transfers', contract.chainId, contract.address, holder],
        queryFn: async (): Promise<BlockscoutTransfer[]> => {
            const response = await fetch(holderTransfersApiUrl(contract.chainId, holder, contract.address));
            if (!response.ok) throw new Error(`Blockscout answered HTTP ${response.status}`);
            const {items} = await response.json() as { items: BlockscoutTransfer[] };
            return items.slice(0, SHOWN_TRANSFERS);
        },
        // Blockscout indexes a new block within seconds; this keeps the list current after a transfer.
        refetchInterval: 30_000,
    });

    return (
        <section className={styles.panel} aria-labelledby="activity-heading">
            <h2 id="activity-heading" className={styles.panelTitle}>Recent transfers</h2>
            {status === 'pending' && <p className={styles.hint}>Loading…</p>}
            {status === 'error' && <p className={styles.hint}>The history is not available right now.</p>}
            {transfers !== undefined && transfers.length === 0 && <p className={styles.hint}>No transfers yet.</p>}
            {transfers !== undefined && transfers.length > 0 && (
                <ul className={styles.activity}>
                    {transfers.map((transfer) => {
                        const incoming = transfer.to.hash.toLowerCase() === holder.toLowerCase();
                        const counterparty = incoming ? transfer.from.hash : transfer.to.hash;
                        const bills = BigInt(transfer.total.value);
                        return (
                            <li key={`${transfer.transaction_hash}-${transfer.log_index}`} className={styles.activityItem}>
                                <span className={styles.activityDate}>{new Date(transfer.timestamp).toLocaleString()}</span>
                                <span className={styles.activityParty}>
                                    {incoming ? 'Received from' : 'Sent to'}{' '}
                                    <a href={explorerAddressUrl(contract.chainId, counterparty)} target="_blank"
                                       rel="noreferrer noopener"><code>{truncateAddress(counterparty)}</code></a>
                                </span>
                                <span className={styles.activityAmount}>
                                    {incoming ? '+' : '−'}{formatBillCount(bills)} bills · {formatBillsSum(bills, symbol)}
                                </span>
                                <a className={styles.activityLink}
                                   href={explorerTransactionUrl(contract.chainId, transfer.transaction_hash)}
                                   target="_blank" rel="noreferrer noopener">transaction</a>
                            </li>
                        );
                    })}
                </ul>
            )}
            <p className={styles.hint}>
                Full history on:{' '}
                {holderHistoryLinks(contract.chainId, holder, contract.address).map((link, index) => (
                    <React.Fragment key={link.name}>
                        {index > 0 ? ', ' : null}
                        <a href={link.url} target="_blank" rel="noreferrer noopener">{link.name}</a>
                    </React.Fragment>
                ))}
            </p>
        </section>
    );
}
