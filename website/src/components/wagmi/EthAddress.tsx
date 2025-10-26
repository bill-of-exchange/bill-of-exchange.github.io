import React, {useMemo} from "react";
import {type Address} from "viem";
import {useAccount} from 'wagmi';
import {blockchainExplorer, DeployedChainId} from "@site/src/constants";
import CopyIcon from "@site/src/components/ui/CopyIcon";

type EthAddressProps = {
    ethAddress: Address;
}

export default function EthAddress(props: EthAddressProps) {

    const {chainId} = useAccount();

    const {blockscoutLink, etherscanLink} = useMemo(() => {
        const blockscoutLink = `${blockchainExplorer.Blockscout[chainId as DeployedChainId]}address/${props.ethAddress}`;
        const etherscanLink = `${blockchainExplorer.Etherscan[chainId as DeployedChainId]}address/${props.ethAddress}`;
        return {blockscoutLink,etherscanLink};
    }, [chainId, props.ethAddress]);

    return (
        <span className={"EthAddress"}>
            <a href={etherscanLink}
               target={"_blank"}
               rel={"noreferrer noopener"}
               title={"Click to open on Etherscan"}
            >
                {props.ethAddress}{" "}
            </a>
            {" "}
            <CopyIcon dataToCopy={props.ethAddress} />
        </span>
    );
}