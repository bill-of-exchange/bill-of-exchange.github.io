import React from "react";
import DescriptionBoF from "@site/src/components/contracts/bof/DescriptionBoF";
import ContractOnExplorers from "@site/src/components/contracts/ContractOnExplorers";
import BalanceBof from "@site/src/components/contracts/bof/BalanceBoF";

export default function BillsOfExchangeContract() {

    const contractName = "BillsOfExchange";

    return (
        <div className={"container"}>
            <ContractOnExplorers contractName={contractName}/>
            <DescriptionBoF/>
            <BalanceBof/>
        </div>
    );
}