import React from "react";
import {useReadBillsOfExchangeDescription} from "../../../generated";

export default function DescriptionBoE(){

    let description:string|undefined = useReadBillsOfExchangeDescription().data;

    if(!description||description==""){
        description="Contract not deployed on this chain/address. Switch to another chain/address";
    }

    return (
        <div className="card">
            <div className="card__header">
                <h3>Description:</h3>
            </div>
            <div className="card__body">
                <p>
                    {description}
                </p>
            </div>
        </div>
    );
};