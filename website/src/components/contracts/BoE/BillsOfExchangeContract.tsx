import React from "react";
// https://docusaurus.io/docs/advanced/ssg#browseronly
import BrowserOnly from '@docusaurus/BrowserOnly';
import DescriptionBoE from "@site/src/components/contracts/BoE/DescriptionBoE";
import ContractOnExplorers from "@site/src/components/contracts/ContractOnExplorers";
import BalanceBoE from "@site/src/components/contracts/BoE/BalanceBoE";
import YourBalanceBoE from "@site/src/components/contracts/BoE/YourBalanceBoE";
import TransferBoE from "@site/src/components/contracts/BoE/TransferBoE";
import TotalSupplyBoE from "@site/src/components/contracts/BoE/TotalSupplyBoE";

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
                    <DescriptionBoE/>
                </div>
            </div>

            <div className="row row--eq"  style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
                <div className="col col--6">
                    <YourBalanceBoE/>
                </div>

                <div className="col col--6">
                    <BalanceBoE/>
                </div>
            </div>

            <TransferBoE/>

        </div>
    );
}