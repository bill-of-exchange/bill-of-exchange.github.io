import type {ReactNode} from 'react';
import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import BillShowcase from '@site/src/components/bill/BillShowcase';
import BillsOfExchangeAct from '@site/src/components/law/BillsOfExchangeAct';
import ElectronicTradeDocumentsAct from '@site/src/components/law/ElectronicTradeDocumentsAct';
import styles from './index.module.css';

export default function Home(): ReactNode {
    return (
        <Layout title="Legally valid electronic bills of exchange"
                description="Legally valid electronic bills of exchange under the UK Electronic Trade Documents Act 2023 and Bills of Exchange Act 1882, for banks, trade finance and cross-border B2B payments. Working prototype.">
            <main className="container">
                {/* Outside BrowserOnly on purpose: this text is in the static HTML, so search engines and AI agents
                    that do not run JavaScript still read what the project is. The bill below is not. */}
                <header className={styles.intro}>
                    <h1 className={styles.heading}>Digital Bills of Exchange</h1>
                    <p className={styles.lede}>
                        Legally valid electronic bills of exchange. Under the UK <ElectronicTradeDocumentsAct/>, a bill
                        held and transferred as a token can carry the same rights as a paper bill under
                        the <BillsOfExchangeAct/> — and every bill’s legal terms are stored in the smart contract, and its
                        signature, acceptance and transfer are recorded on-chain. Built for banks, trade finance and
                        cross-border B2B payments. Stage: working prototype on the Ethereum Sepolia test network (shown
                        below).
                    </p>
                </header>
                {/* The bill is read from the blockchain, which only the browser can do. */}
                <BrowserOnly fallback={<div style={{minHeight: '70vh'}}/>}>
                    {() => <BillShowcase/>}
                </BrowserOnly>
            </main>
        </Layout>
    );
}
