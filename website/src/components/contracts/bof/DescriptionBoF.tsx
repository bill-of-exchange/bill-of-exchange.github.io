import React from "react";
import {useReadBillsOfExchangeDescription} from "../../../generated";

export default function DescriptionBoF(){

    let description:string|undefined = useReadBillsOfExchangeDescription().data;

    if(!description||description==""){
        description="Contract not deployed on this chain/address. Switch to another chain/address";
    }

    return (
        <div className="DescriptionBoF" style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
            <div className={"container"}>
                <div className="row">
                    <div className="col col--12">
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
                    </div>
                    </div>
                </div>
            </div>
            );

            };