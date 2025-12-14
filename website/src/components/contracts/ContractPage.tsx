import React from "react";
import ContractHeader from "@site/src/components/contracts/ContractHeader";
import BillsOfExchangeContract from "@site/src/components/contracts/BoE/BillsOfExchangeContract";

type ContractPageProps = {
    contractName?: string;
    contractDescription?: string;
};

export default function ContractPage (props: ContractPageProps) {

    return (

        <div className={"ContractPage"}>

            <ContractHeader contractName={props.contractName} contractDescription={props.contractDescription} />

            <BillsOfExchangeContract/>

        </div>
    );
}
