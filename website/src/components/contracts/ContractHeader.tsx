import React from 'react'
import clsx from 'clsx';
import Heading from '@theme/Heading'; // Docusaurus
import styles from "@site/src/components/contracts/ContractHeader.module.css";

type ContractHeaderProps = {
    contractName?: string;
    contractDescription?: string;
};

export default function ContractHeader(props: ContractHeaderProps){
    return(
        <div className={"'ContractHeader'"}>

            <header className={clsx('hero hero--primary', styles.heroBanner)}>

                <div className="container">

                    <Heading as="h1" className={clsx("hero__title", styles.hero__title)}>
                        {props.contractName?props.contractName:null}
                    </Heading>

                    <p className={clsx("hero__subtitle", styles.hero__subtitle)}>
                        {props.contractDescription?props.contractDescription:null}
                    </p>

                </div>
            </header>
        </div>
    );
}