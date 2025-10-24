import React, {useEffect, useMemo, useState} from "react";
import {useAccount} from 'wagmi';
import {type Address, formatUnits} from "viem";
import {useReadBillsOfExchangeDescription,useReadBillsOfExchangeBalanceOf} from "../../../generated";
import {blockchainExplorer, DeployedChainId, deployments} from "@site/src/constants";
import {chains} from "@site/src/wagmiConfig";

export default function BalanceBof(){

    const { address, chain, chainId, status } = useAccount();

    const [addressForRequest, setAddressForRequest] = useState<string>("");
    const [lastCheckedAddress, setLastCheckedAddress] = useState<string>("");
    const [balance, setBalance] = useState<string>("no data");
    const [isWorking, setIsWorking] = useState<boolean>(false);

    // Call the hook at the component level
    // React hooks (including Wagmi’s generated hooks) must run at the top level of a function component
    // (or inside a custom hook) — never inside handleClick
    const { data, refetch } = useReadBillsOfExchangeBalanceOf({
        args: [addressForRequest as Address],
        query: {
            enabled: false, // Don't run automatically on mount ← key part
        }
    });

    const handleClick = async (event: React.FormEvent) => {
        event.preventDefault()
        if (!addressForRequest) return

        setIsWorking(true);
        setLastCheckedAddress(addressForRequest);

        try {
            const { data: raw } = await refetch()
            console.log("raw:", raw);
            // ERC-20 balances are bigint; don't `Number()` (overflow risk). Format properly:
            const formatted = raw ? formatUnits(raw as bigint, /* token decimals, e.g. */ 18) : 'no data'
            setBalance(formatted);
        } finally {
            setIsWorking(false);
        }
    }

    return (
        <div className={"BalanceBoF"} style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
            <div className={"container"}>
                <div className="row">
                    <div className="col col--6">

                        <div className="card">

                            <div className="card__header">
                                <h3>Check balance of:</h3>
                            </div>

                            <div className="card__body">
                                <div>
                                    <p>
                                        {lastCheckedAddress.length>0&&!isWorking?`${lastCheckedAddress}: ${balance}`:null}
                                    </p>
                                    <label>
                                        Address to Check Balance:<br/>
                                        <input
                                            width={"10rem"}
                                            type="text"
                                            value={addressForRequest}
                                            onChange={(e) => setAddressForRequest(e.target.value)}
                                            placeholder="0x..."
                                            style={{ width: '80%', fontSize: '1rem' }}
                                        />
                                        <button
                                            onClick={(e)=>setAddressForRequest("")}
                                            style={{ width: '20%', fontSize: '1rem' }}
                                        >
                                            clear
                                        </button>
                                    </label>
                                </div>
                            </div>

                            <div className="card__footer">
                                <button className="button button--secondary button--block"
                                        onClick={handleClick}
                                        disabled={isWorking}
                                >
                                    Get/refresh
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};