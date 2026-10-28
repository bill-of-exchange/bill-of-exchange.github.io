import React from 'react';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {contractFieldUrl, contractUrl, verifiedSourceLinks} from '@site/src/components/contracts/contractLinks';
import truncateAddress from '@site/src/components/wagmi/truncateAddress';
import {type BillTerms, useBillTerms} from './useBillTerms';
import styles from './ContractTerms.module.css';

// The statements a paper bill would carry on its back. An electronic bill has no back, so they are
// shown as what they are: text stored in the contract, the same for every bill it records.
const RECORDED_STATEMENTS: readonly { title: string; getter: keyof BillTerms }[] = [
    {title: 'Description', getter: 'DESCRIPTION'},
    {title: 'Electronic signature', getter: 'LEGAL_SIGNATURE_STATEMENT'},
    {title: 'KYC and AML', getter: 'KYC_AND_AML_NOTICE'},
];

/** The terms recorded in the smart contract, word for word, marked as contract data. */
export default function ContractTerms() {
    const contract = useDisplayedContract('BillsOfExchange');
    const termsResult = useBillTerms();
    // Without a contract or after a failed read there is nothing to show; the bill itself says why.
    if (termsResult.status === 'not-deployed' || termsResult.status === 'error') {
        return null;
    }
    const terms = termsResult.status === 'ready' ? termsResult.terms : undefined;

    return (
        <section className={styles.card} aria-labelledby="contract-terms-heading">
            <header className={styles.header}>
                <h2 id="contract-terms-heading" className={styles.heading}>Terms recorded in the smart contract</h2>
                <p className={styles.intro}>
                    Shown word for word as stored in the contract{' '}
                    <a href={contractUrl(contract.chainId, contract.address)} target="_blank"
                       rel="noreferrer noopener" title={contract.address}>
                        <code>{truncateAddress(contract.address)}</code>
                    </a>{' '}
                    on {contract.chain.name}. They are the same for
                    every bill in this registry, accepted or not.
                </p>
            </header>

            <div className={styles.statements}>
                {RECORDED_STATEMENTS.map((statement) => (
                    <section key={statement.getter} className={styles.statement}>
                        <h3 className={styles.statementTitle}>{statement.title}</h3>
                        <div className={styles.getter}>
                            contract field{' '}
                            <a href={contractFieldUrl(contract.chainId, contract.address, statement.getter)}
                               target="_blank" rel="noreferrer noopener"
                               title={`Read ${statement.getter} from the contract on Blockscout`}>
                                <code>{statement.getter}</code>
                            </a>
                        </div>
                        {terms === undefined
                            ? <div className={styles.placeholder} aria-label="Loading"/>
                            : <blockquote className={styles.text}>{terms[statement.getter]}</blockquote>}
                    </section>
                ))}
            </div>

            <p className={styles.sourceLinks}>
                Verified source code of the contract on:{' '}
                {verifiedSourceLinks(contract.chainId, contract.address).map((link, index) => (
                    <React.Fragment key={link.name}>
                        {index > 0 ? ', ' : null}
                        <a href={link.url} target="_blank" rel="noreferrer noopener">{link.name}</a>
                    </React.Fragment>
                ))}
            </p>
        </section>
    );
}
