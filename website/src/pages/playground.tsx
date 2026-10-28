import type {ReactNode} from 'react';
import React from 'react';
import Head from "@docusaurus/Head";
import BillsOfExchangePlayground from "@site/src/components/contracts/BoE/PlayGroundBoE";

export default function Playground():ReactNode {
    // A developer tool, reachable only by its URL: it is not linked from the menu, it is left
    // out of the sitemap (docusaurus.config.ts) and search engines are asked not to index it.
    // This hides the page; it does not protect it: the contract itself enforces who may do what.
    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow"/>
            </Head>
            <BillsOfExchangePlayground/>
        </>
    );
}