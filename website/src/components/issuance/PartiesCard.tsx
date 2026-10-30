import React from 'react';
import {type Address, getAddress, isAddressEqual} from 'viem';
import {useAccount} from 'wagmi';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {explorerAddressUrl} from '@site/src/components/contracts/contractLinks';
import {useBillTerms} from '@site/src/components/bill/useBillTerms';
import {type BillDenomination, currencySymbol, formatBillCount, formatBillsSum} from '@site/src/components/bill/formatBills';
import RegistrySummary from '@site/src/components/bill/RegistrySummary';
import {useHolderBills} from '@site/src/components/wallet/useHolderBills';
import styles from '@site/src/components/wallet/MyBills.module.css';

/** Who draws and who accepts, what each holds now, and the totals of both ledgers. Needs no wallet. */
export default function PartiesCard() {
    const termsResult = useBillTerms();

    if (termsResult.status !== 'ready') {
        return (
            <section className={styles.panel}>
                <h2 className={styles.panelTitle}>The parties</h2>
                <p className={styles.hint}>
                    {termsResult.status === 'not-deployed' ? 'The contract is not deployed on this network.'
                        : termsResult.status === 'error' ? 'The contract could not be read right now.' : 'Loading…'}
                </p>
            </section>
        );
    }

    const {terms} = termsResult;
    const denomination: BillDenomination = {symbol: currencySymbol(terms.CURRENCY), decimals: termsResult.decimals};
    const drawer = getAddress(terms.DRAWER_ETH_ADDRESS);
    const drawee = getAddress(terms.DRAWEE_ETH_ADDRESS);

    return (
        <section className={styles.panel} aria-labelledby="parties-heading">
            <h2 id="parties-heading" className={styles.panelTitle}>The parties</h2>
            <div className={styles.parties}>
                <Party role="Drawer" name={terms.DRAWER_NAME} address={drawer} denomination={denomination}
                       duty="Draws the bills and is liable on them until they are accepted."/>
                <Party role="Drawee" name={terms.DRAWEE_NAME} address={drawee} denomination={denomination}
                       duty="Accepts the bills and becomes liable to pay them to the bearer."/>
            </div>
            {isAddressEqual(drawer, drawee) && (
                <p className={styles.hint}>
                    In this demonstration deployment the drawer and the drawee use the same address, so one wallet
                    can draw and accept. Where drawer and drawee are the same person, the holder may treat the
                    instrument either as a bill of exchange or as a promissory note (Bills of Exchange Act 1882,
                    s.5(2)).
                </p>
            )}
            <RegistrySummary/>
        </section>
    );
}

type PartyProps = { role: string; name: string; address: Address; denomination: BillDenomination; duty: string };

function Party({role, name, address, denomination, duty}: PartyProps) {
    const {chainId} = useDisplayedContract('BillsOfExchange');
    const {address: account} = useAccount();
    const {bills} = useHolderBills(address);
    const isYou = account !== undefined && isAddressEqual(account, address);

    return (
        <div className={styles.party}>
            <div className={styles.partyRole}>{role}{isYou && ' · your wallet'}</div>
            <div className={styles.partyName}>{name}</div>
            <a className={styles.mono} href={explorerAddressUrl(chainId, address)} target="_blank"
               rel="noreferrer noopener">{address}</a>
            <div className={styles.hint}>{duty}</div>
            <dl className={styles.summary}>
                <dt>Unaccepted</dt>
                <dd>{bills === undefined ? '—' : describeBills(bills.unaccepted, denomination)}</dd>
                <dt>Accepted</dt>
                <dd>{bills === undefined ? '—' : describeBills(bills.accepted, denomination)}</dd>
            </dl>
        </div>
    );
}

function describeBills(bills: bigint, denomination: BillDenomination): string {
    return `${formatBillCount(bills)} bills · ${formatBillsSum(bills, denomination)}`;
}
