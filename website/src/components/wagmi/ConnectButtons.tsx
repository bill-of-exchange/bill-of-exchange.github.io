// src/components/ConnectButton.tsx

import React from 'react';
import {useAccount, useConnect, useDisconnect} from 'wagmi';
import truncateAddress from "@site/src/components/wagmi/truncateAddress";


export default function ConnectButtons() {

    // https://wagmi.sh/react/api/hooks/useConnect
    // const { connectors, connect, error } = useConnect();
    const connect = useConnect()

    // https://wagmi.sh/react/api/hooks/useAccount
    // const { address, isConnected } = useAccount();
    const account = useAccount();

    const { disconnect } = useDisconnect();

    if (account.isConnected) {
        return (
            // <div>
            //     {/*<span className="badge badge--primary" title={account.address}>{truncateAddress(account.address)}</span>*/}
            //     <button
            //         className={"button button--success"}
            //         onClick={()=>disconnect()}
            //         title={`Click to disconnect ${account.connector.name}`}
            //     >
            //         {account.connector.name}{":"}{truncateAddress(account.address)}
            //     </button>
            // </div>

            <div className="dropdown dropdown--hoverable nav-web3">
                <button className="button button--success">{account.connector.name}{":"}{truncateAddress(account.address)}</button>
                <ul className="dropdown__menu">
                    <li>
                        <a
                            className="dropdown__link pointerOnHover"
                            // href="#"
                            onClick={()=>disconnect()}
                            title={`Click to disconnect ${account.connector.name}`}
                        >
                            Disconnect {account.connector.name}
                        </a>
                    </li>
                </ul>
            </div>
        );
    }

    return (
        <>
            {connect.connectors.map(connector => (
                <button
                    className={"button button--outline button--warning nav-web3"}
                    key={connector.id}
                    onClick={
                        () => {
                            connect.connect({connector});
                            if (connect.error) {
                                console.error(connect.error);
                                // console.error(connect.error.message);
                            }
                          }
                        }
                        // title={connector.ready?"":`${connector.name} is not ready`}
                        title={`Click to connect ${connector.name}`}
                    >
                    Connect {connector.name}
                    </button>
            ))}
            {/*{error && <div style={{color: 'red'}}>Error: {error.message}</div>}*/}
        </>
    );
}
