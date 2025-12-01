import React, {useMemo} from "react";
import {type Address} from "viem";
import {useAccount} from 'wagmi';
import {blockchainExplorerUrl, defaultBlockchainExplorer, DeployedChainId} from "@site/src/constants";
import CopyIcon from "@site/src/components/ui/CopyIcon";

type EthAddressProps = {
    ethAddress: Address;
}

export default function EthAddress(props: EthAddressProps) {

    const {chainId} = useAccount();

    const linkToBlockchainExplorer:string = useMemo(
        () =>
            `${blockchainExplorerUrl[defaultBlockchainExplorer][chainId as DeployedChainId]}address/${props.ethAddress}`
        , [chainId, props.ethAddress]);

    return (
        <span className={"EthAddress"}>
            <a href={linkToBlockchainExplorer}
               target={"_blank"}
               rel={"noreferrer noopener"}
               title={`Click to open on ${defaultBlockchainExplorer}`}
            >
                {props.ethAddress}{" "}
            </a>
            {" "}
            <CopyIcon dataToCopy={props.ethAddress} />
        </span>
    );
}
