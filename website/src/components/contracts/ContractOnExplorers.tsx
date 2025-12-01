import React, {useMemo} from "react";
import {useAccount} from 'wagmi';
import {blockchainExplorerUrl, ContractName, DeployedChainId, deployments} from "@site/src/constants";
import {chains} from "@site/src/wagmiConfig";
import {useColorMode} from '@docusaurus/theme-common';
import styles from "@site/src/components/contracts/ContractOnExplorers.module.css";

type ContractOnExplorersProps = {
    contractName: ContractName;
}

export default function ContractOnExplorers(props: ContractOnExplorersProps){

    const { colorMode, setColorMode } = useColorMode();

    const { address, chain, chainId, status } = useAccount();

    const {contractAddress, blockscoutLink, etherscanLink} = useMemo(() => {

        let contractAddress;
        chainId?
            contractAddress=deployments[props.contractName][chainId as DeployedChainId]:
            // return default (first in the array) chain from Wagmi config
            contractAddress =  deployments[props.contractName][chains[0].id as DeployedChainId];

        const blockscoutLink = `${blockchainExplorerUrl.Blockscout[chainId as DeployedChainId]}address/${contractAddress}`;

        const etherscanLink = `${blockchainExplorerUrl.Etherscan[chainId as DeployedChainId]}address/${contractAddress}`;

        return {contractAddress,blockscoutLink,etherscanLink};

    }, [chainId, props.contractName]);

    const {etherscanLogo, blockscoutLogo} = useMemo(() => {

        let etherscanLogo, blockscoutLogo;
        if (colorMode === 'light'){
            etherscanLogo = "/img/brands/etherscan/etherscan-logo-circle.svg";
            blockscoutLogo = "/img/brands/blockscout/Black_BS_symbol.svg";
        } else {
            etherscanLogo = "/img/brands/etherscan/etherscan-logo-circle-light.svg";
            blockscoutLogo = "/img/brands/blockscout/Color_BS_symbol.svg";
        }
        return {etherscanLogo, blockscoutLogo};
    }, [colorMode]);

    return (
        <div className="ContractOnExplorers" style={{marginTop: "0.5rem"}}>

            <style>{`
                @media screen and (max-width: 768px) {
                    .BlockexplorerLinks.pagination-nav {
                        flex-direction: column !important;
                        gap: 1rem;
                    }

                    .BlockexplorerLinks .pagination-nav__link {
                        width: 100% !important;
                        max-width: none !important;
                    }

                    .BlockexplorerLinks .avatar__photo {
                        width: 3rem !important;
                        height: 3rem !important;
                        // display: none;
                    }

                    .BlockexplorerLinks .avatar__name {
                        font-size: 0.9rem !important;
                    }

                    .BlockexplorerLinks .avatar__subtitle {
                        font-size: 0.75rem !important;
                        word-break: break-all;
                        display: none;
                    }
                }
            `}</style>

            <div className="card">
                {/*<div className="card__header">*/}
                {/*    <h3>open on blockchain explorers</h3>*/}
                {/*</div>*/}
                <div className="card__body">

                    <nav className="BlockexplorerLinks pagination-nav docusaurus-mt-lg" style={{marginTop: 0}}>

                        <a className="EtherscanLink pagination-nav__link pagination-nav__link--prev"
                           href={etherscanLink}
                           target={"_blank"}
                           rel={"noreferrer noopener"}
                           title={"Click to open on Etherscan"}
                        >
                            <div className="avatar">
                                <img className="avatar__photo" src={etherscanLogo} alt="Etherscan logo"/>
                                <div className="avatar__intro">
                                    <div className="avatar__name">
                                        Open on Etherscan
                                    </div>
                                    <small className="avatar__subtitle">
                                        {contractAddress}
                                    </small>
                                </div>
                            </div>
                        </a>

                        <a className="BlockscoutLink pagination-nav__link pagination-nav__link--next"
                           href={blockscoutLink}
                           target={"_blank"}
                           rel={"noreferrer noopener"}
                           title={"Click to open on Blockscout"}
                        >
                            <div className="avatar">
                                <div className="avatar__intro">
                                    <div className="avatar__name">
                                        Open on Blockscout
                                    </div>
                                    <small className="avatar__subtitle">
                                        {contractAddress}
                                    </small>
                                </div>
                                <img
                                    className="avatar__photo"
                                    src={blockscoutLogo} alt={"Blockscout Logo"}/>
                            </div>
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    )
}