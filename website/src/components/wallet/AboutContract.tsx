import React from 'react';
import Link from '@docusaurus/Link';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {contractUrl, verifiedSourceLinks} from '@site/src/components/contracts/contractLinks';
import truncateAddress from '@site/src/components/wagmi/truncateAddress';
import styles from './MyBills.module.css';

/** Where the bills come from: the bill itself, its recorded terms, and the contract's code. */
export default function AboutContract() {
    const contract = useDisplayedContract('BillsOfExchange');
    return (
        <details className={styles.collapsible}>
            <summary className={styles.collapsibleSummary}>About this contract</summary>
            <ul className={styles.aboutList}>
                <li><Link to="/">The bill</Link>, as recorded in the contract, and the terms recorded with it</li>
                <li>
                    The contract{' '}
                    <a href={contractUrl(contract.chainId, contract.address)} target="_blank" rel="noreferrer noopener">
                        <code>{truncateAddress(contract.address)}</code>
                    </a>{' '}
                    on {contract.chain.name}
                </li>
                <li>
                    Verified source code on:{' '}
                    {verifiedSourceLinks(contract.chainId, contract.address).map((link, index) => (
                        <React.Fragment key={link.name}>
                            {index > 0 ? ', ' : null}
                            <a href={link.url} target="_blank" rel="noreferrer noopener">{link.name}</a>
                        </React.Fragment>
                    ))}
                </li>
            </ul>
        </details>
    );
}
