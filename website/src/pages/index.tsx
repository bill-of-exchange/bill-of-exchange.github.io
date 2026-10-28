import type {ReactNode} from 'react';
import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import BillShowcase from '@site/src/components/bill/BillShowcase';

export default function Home(): ReactNode {
    return (
        <Layout title="Electronic bill of exchange"
                description="An electronic bill of exchange under the Bills of Exchange Act 1882, rendered from its registry on Ethereum">
            <main className="container">
                {/* The bill is read from the blockchain, which only the browser can do. */}
                <BrowserOnly fallback={<div style={{minHeight: '70vh'}}/>}>
                    {() => <BillShowcase/>}
                </BrowserOnly>
            </main>
        </Layout>
    );
}
