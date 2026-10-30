import React, {useState} from 'react';
import {type Address, getAddress, isAddress} from 'viem';
import {useBillDenomination} from '@site/src/components/bill/useBillTerms';
import {type BillDenomination, formatBillCount, formatBillsSum} from '@site/src/components/bill/formatBills';
import {useHolderBills} from './useHolderBills';
import styles from './MyBills.module.css';

/** The bills of any address, in both ledgers: e.g. to check a counterparty before a deal. */
export default function VerifyHolder() {
    const [input, setInput] = useState('');
    const text = input.trim();
    const address: Address | undefined = isAddress(text, {strict: false}) ? getAddress(text) : undefined;
    const {bills} = useHolderBills(address);
    const denomination = useBillDenomination();

    return (
        <details className={styles.collapsible}>
            <summary className={styles.collapsibleSummary}>Verify another holder</summary>
            <div className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="verify-address">Address</label>
                    <input id="verify-address" className={`${styles.input} ${styles.mono}`} autoComplete="off"
                           spellCheck={false} placeholder="0x…" value={input} onChange={(event) => setInput(event.target.value)}/>
                    {text !== '' && address === undefined && <div className={styles.hint}>Not a valid Ethereum address</div>}
                </div>
                {address !== undefined && (
                    <dl className={styles.summary}>
                        <dt>Accepted bills</dt>
                        <dd>{bills === undefined ? '…' : describe(bills.accepted, denomination)}</dd>
                        <dt>Unaccepted bills</dt>
                        <dd>{bills === undefined ? '…' : describe(bills.unaccepted, denomination)}</dd>
                    </dl>
                )}
            </div>
        </details>
    );
}

function describe(bills: bigint, denomination: BillDenomination | undefined): string {
    const count = formatBillCount(bills);
    return denomination === undefined ? count : `${count} · face value ${formatBillsSum(bills, denomination)}`;
}
