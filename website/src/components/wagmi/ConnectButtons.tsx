// src/components/wagmi/ConnectButton.tsx

import React from 'react';
import {useAccount, useConnect, useDisconnect} from 'wagmi';
import truncateAddress from "@site/src/components/wagmi/truncateAddress";

export default function ConnectButtons() {

    // https://wagmi.sh/react/api/hooks/useConnect
    const connect = useConnect()

    // https://wagmi.sh/react/api/hooks/useAccount
    const account = useAccount();

    const { disconnect } = useDisconnect();

    if (account.isConnected) {

        // if(account.connector?.name=="MetaMask"){
        //     console.log("connector:", account.connector.name);
        //     account.connector.getProvider();
        // }

        return (
            <div className={"ConnectButtons"}>
                <div className="dropdown dropdown--hoverable nav-web3">
                    <button className="button button--primary">{account.connector?.name}{":"}{truncateAddress(account.address)}</button>
                    <ul className="dropdown__menu">
                        <li>
                            <a
                                className="dropdown__link pointerOnHover"
                                onClick={()=>disconnect()}
                                title={`Click to disconnect ${account.connector?.name}`}
                            >
                                Disconnect {account.connector?.name}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    } else return (
        <div className={"ConnectButtons"}>

            {
                connect.connectors.map(connector => {
                    return (
                        (
                            <button
                                // className={"button button--outline button--warning nav-web3"}
                                className={"button button--primary nav-web3"}
                                key={connector.id}
                                onClick={
                                    () => {
                                        connect.connect({connector});
                                        if (connect.error) {
                                            console.error(connect.error);
                                        }
                                    }
                                }
                                title={`Click to connect ${connector.name}`}
                            >
                                Connect {connector.name}
                            </button>
                        )
                    )
                })
            }

        </div>
    );
}
