import React from 'react';
import {useBillTerms, useRegistryTotals} from './useBillTerms';
import {currencySymbol, formatBillCount, formatBillsSum} from './formatBills';
import styles from './RegistrySummary.module.css';

/** How many bills exist in each ledger of the registry, and what they are worth. */
export default function RegistrySummary() {
    const totals = useRegistryTotals();
    const termsResult = useBillTerms();
    const symbol = termsResult.status === 'ready' ? currencySymbol(termsResult.terms.CURRENCY) : undefined;

    const figures = [
        {title: 'In circulation', bills: totals?.accepted, note: 'accepted bills: the drawee is liable'},
        {title: 'Not yet accepted', bills: totals?.unaccepted, note: 'drawn bills: only the drawer is liable'},
    ];

    return (
        <div className={styles.summary}>
            {figures.map((figure) => (
                <div key={figure.title} className={styles.figure}>
                    <div className={styles.title}>{figure.title}</div>
                    {figure.bills === undefined || symbol === undefined ? (
                        <div className={styles.value}>—</div>
                    ) : (
                        <div className={styles.value}>
                            {formatBillsSum(figure.bills, symbol)}
                            <span className={styles.count}> · {formatBillCount(figure.bills)} bills</span>
                        </div>
                    )}
                    <div className={styles.note}>{figure.note}</div>
                </div>
            ))}
        </div>
    );
}
