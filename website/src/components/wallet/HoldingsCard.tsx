import React from 'react';
import {useReadContract, useWatchAsset} from 'wagmi';
import {billsOfExchangeAbi} from '@site/src/generated';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {useBillDenomination, useBillTerms} from '@site/src/components/bill/useBillTerms';
import {formatBillCount, formatBillsSum} from '@site/src/components/bill/formatBills';
import type {HolderBills} from './useHolderBills';
import styles from './MyBills.module.css';

type HoldingsCardProps = {
    bills: HolderBills | undefined;
    onSend: () => void;
    onReceive: () => void;
};

/** What the holder holds: the number of accepted bills, their face value, and who owes payment on them. */
export default function HoldingsCard({bills, onSend, onReceive}: HoldingsCardProps) {
    const termsResult = useBillTerms();
    const terms = termsResult.status === 'ready' ? termsResult.terms : undefined;
    const denomination = useBillDenomination();

    return (
        <section className={styles.holdings} aria-labelledby="holdings-heading">
            <BillThumbnail denomination={terms && denomination && `${denomination.symbol}${terms.SUM_PER_BILL}`}/>
            <div className={styles.holdingsText}>
                <h2 id="holdings-heading" className={styles.holdingsLabel}>Your bills</h2>
                <div className={styles.holdingsCount}>
                    {bills === undefined ? '—' : `${formatBillCount(bills.accepted)} bills`}
                </div>
                <div className={styles.holdingsDetail}>
                    {bills !== undefined && denomination !== undefined && `face value ${formatBillsSum(bills.accepted, denomination)} · `}
                    accepted · payable by {terms?.DRAWEE_NAME ?? 'the drawee'}
                </div>
                {/* Unaccepted bills normally never reach holders; if some did, they must not be invisible. */}
                {bills !== undefined && bills.unaccepted > 0n && (
                    <div className={styles.unacceptedNote}>
                        Also {formatBillCount(bills.unaccepted)} unaccepted bills: only the drawer is liable on them,
                        and they do not appear in wallet apps.
                    </div>
                )}
                <div className={styles.actions}>
                    <button type="button" className="button button--primary" onClick={onSend}>Send</button>
                    <button type="button" className="button button--secondary" onClick={onReceive}>Receive</button>
                    <AddToWalletButton/>
                </div>
            </div>
        </section>
    );
}

/** A small picture of one bill, to make plain that the holder holds bills, not an abstract balance. */
function BillThumbnail({denomination}: { denomination: string | undefined }) {
    return (
        <div className={styles.thumbnail} aria-hidden="true">
            <div className={styles.thumbnailTitle}>Bill of exchange</div>
            <div className={styles.thumbnailValue}>{denomination ?? ''}</div>
        </div>
    );
}

/** Asks the wallet to show the bills as a token (EIP-747, wallet_watchAsset). */
function AddToWalletButton() {
    const {address} = useDisplayedContract('BillsOfExchange');
    const {data: symbol} = useReadContract({abi: billsOfExchangeAbi, address, functionName: 'symbol'});
    const denomination = useBillDenomination();
    const {watchAsset, isPending, isSuccess, error} = useWatchAsset();
    return (
        <>
            <button type="button" className="button button--secondary" disabled={symbol === undefined || denomination === undefined || isPending}
                    onClick={() => watchAsset({type: 'ERC20', options: {address, symbol: symbol!, decimals: denomination!.decimals}})}>
                {isSuccess ? 'Added to wallet' : 'Add to MetaMask'}
            </button>
            {error && <span className={styles.errorText}>{error.message}</span>}
        </>
    );
}
