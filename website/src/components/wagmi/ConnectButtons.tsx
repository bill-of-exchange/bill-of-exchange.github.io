// src/components/ConnectButton.tsx

import React from 'react';
import {useAccount, useConnect, useDisconnect} from 'wagmi';
import {InfimaButton} from "@site/src/components/ui/InfimaButton";


export default function ConnectButtons() {

    // https://wagmi.sh/react/api/hooks/useConnect
    const { connectors, connect, error } = useConnect();

    // https://wagmi.sh/react/api/hooks/useAccount
    // const { address, isConnected } = useAccount();
    const account = useAccount();
    console.log(account);

    const { disconnect } = useDisconnect();

    if (account.isConnected) {
        return (
            <div>
                {/*<span className="badge badge--primary" title={account.address}>{truncateAddress(account.address)}</span>*/}
                <InfimaButton
                    onClick={()=>disconnect()}
                    variant={"secondary"}
                >
                    Disconnect {account.connector.name}
                </InfimaButton>
            </div>
        );
    }

    return (
        <div>
            {connectors.map(connector => (
                <span>
                    <InfimaButton
                        variant={"secondary"}
                        // disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        title={connector.ready?"":`${connector.name} is not ready`}
                    >
                    Connect {connector.name}
                </InfimaButton>
                    {" "}
                </span>
            ))}
            {/*{error && <div style={{color: 'red'}}>Error: {error.message}</div>}*/}
        </div>
    );
}
