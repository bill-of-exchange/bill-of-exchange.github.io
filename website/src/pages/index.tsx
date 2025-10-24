import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import styles from './index.module.css';
//
import ConnectButtons from "@site/src/components/wagmi/ConnectButtons";
import ConnectionInfo from "@site/src/components/wagmi/ConnectionInfo";
import ChainSwitcher from "@site/src/components/wagmi/ChainSwitcher";

//
import {useReadBillsOfExchangeDescription} from "../generated";

function HomepageHeader() {

    const {siteConfig} = useDocusaurusContext();

    const description:string|undefined = useReadBillsOfExchangeDescription()?.data?.toString();
    // console.log(description);

    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                {/*<div className={styles.buttons}>*/}
                {/*  <Link*/}
                {/*    className="button button--secondary button--lg"*/}
                {/*    to="/docs/intro">*/}
                {/*    Docusaurus Tutorial - 5min ⏱️*/}
                {/*  </Link>*/}
                {/*</div>*/}
                <div className={styles.buttons}>
                    <Link
                        style={{margin:"0.5rem"}}
                        className="button button--secondary button--lg"
                        to="/docs/intro">
                        Buy
                    </Link>
                    <Link
                        style={{margin:"0.5rem"}}
                        className="button button--secondary button--lg"
                        to="/manage/">
                        Manage
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <HomepageHeader />
            <div>
                <div title={"Our UI elements to test"}>Our elements</div>
                <hr/>
                <div>
                    <button className="button button--outline" style={{background:"transparent"}}>Outline</button>
                    <button className="button button--outline button--primary">Primary</button>
                    <button className="button button--outline button--secondary">Secondary</button>
                    <button className="button button--outline button--success">Success</button>
                    <button className="button button--outline button--info">Info</button>
                    <button className="button button--outline button--warning">Warning</button>
                    <button className="button button--outline button--danger">Danger</button>
                </div>
                <hr/>
                <ChainSwitcher/>
                <hr/>
                <ConnectionInfo/>
                <hr/>
                <div>
                    Description: {useReadBillsOfExchangeDescription()?.data?.toString()}
                </div>
                <br/>
                <ConnectButtons/>
            </div>
            <main>
                <HomepageFeatures/>
            </main>
        </Layout>
    );
}
