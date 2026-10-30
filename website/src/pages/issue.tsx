import type {ReactNode} from 'react';
import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import IssueAndAccept from '@site/src/components/issuance/IssueAndAccept';

export default function IssuePage(): ReactNode {
    return (
        <Layout title="Issue and accept" description="Draw electronic bills of exchange and accept them">
            <main className="container">
                {/* The page talks to the visitor's wallet and to the blockchain: only the browser can. */}
                <BrowserOnly fallback={<div style={{minHeight: '60vh'}}/>}>
                    {() => <IssueAndAccept/>}
                </BrowserOnly>
            </main>
        </Layout>
    );
}
