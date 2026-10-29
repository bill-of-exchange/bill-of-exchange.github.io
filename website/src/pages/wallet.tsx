import type {ReactNode} from 'react';
import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import MyBills from '@site/src/components/wallet/MyBills';

export default function WalletPage(): ReactNode {
    return (
        <Layout title="My bills" description="See, send and receive your electronic bills of exchange">
            <main className="container">
                {/* The page talks to the visitor's wallet and to the blockchain: only the browser can. */}
                <BrowserOnly fallback={<div style={{minHeight: '60vh'}}/>}>
                    {() => <MyBills/>}
                </BrowserOnly>
            </main>
        </Layout>
    );
}
