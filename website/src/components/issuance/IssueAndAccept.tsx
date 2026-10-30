import React from 'react';
import Link from '@docusaurus/Link';
import WalletGate from '@site/src/components/wallet/WalletGate';
import WalletChip from '@site/src/components/wallet/WalletChip';
import AboutContract from '@site/src/components/wallet/AboutContract';
import PartiesCard from './PartiesCard';
import IssuanceSteps from './IssuanceSteps';
import styles from '@site/src/components/wallet/MyBills.module.css';

/**
 * The page of the drawer and the drawee: drawing bills, delivering them to the drawee, accepting them.
 * Anyone may open it; the contract lets only the drawer's and the drawee's addresses act, and the page
 * says so instead of hiding the steps, because its first readers are partners watching a demonstration.
 */
export default function IssueAndAccept() {
    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Issue and accept</h1>
                <WalletChip/>
            </header>
            <p className={styles.lede}>
                A bill comes into being in three acts, each signed by a transaction from the party's own address.
                The drawer draws the bills; the drawer delivers them to the drawee; the drawee accepts them. Only
                accepted bills circulate: their holders send and receive them on <Link to="/wallet">My bills</Link>.
            </p>
            <PartiesCard/>
            <WalletGate connectPrompt={
                'Connect the drawer\'s or the drawee\'s wallet to draw, deliver or accept bills. ' +
                'Every action needs confirmation in the wallet itself.'
            }>
                {(account) => <IssuanceSteps account={account}/>}
            </WalletGate>
            <AboutContract/>
        </div>
    );
}
