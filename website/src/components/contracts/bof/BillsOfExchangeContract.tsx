import React from "react";
import DescriptionBoF from "@site/src/components/contracts/bof/DescriptionBoF";
import ContractOnExplorers from "@site/src/components/contracts/ContractOnExplorers";
import BalanceBof from "@site/src/components/contracts/bof/BalanceBoF";
import YourBalanceBoF from "@site/src/components/contracts/bof/YourBalanceBoF";

export default function BillsOfExchangeContract() {

    const contractName = "BillsOfExchange";

    return (
        <div className={"container"}>

            <div className="row" style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
                <div className="col col--12">
                    <ContractOnExplorers contractName={contractName}/>
                </div>
            </div>

            <div className="row" style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
                <div className="col col--12">
                    <DescriptionBoF/>
                </div>
            </div>

            <div className="row row--eq"  style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>

                <div className="col col--6">
                    <YourBalanceBoF/>
                </div>

                <div className="col col--6">
                    <BalanceBof/>
                </div>

            </div>

        </div>
    );
}