import {useAccount, useConnect, useDisconnect} from 'wagmi'
import truncateAddress from "@site/src/components/wagmi/truncateAddress";

const ConnectionInfo = ()=>{

    // https://wagmi.sh/react/api/hooks/useConnect
    const { connectors, connect, error } = useConnect();

    // https://wagmi.sh/react/api/hooks/useAccount
    const account = useAccount();

    // https://wagmi.sh/react/api/hooks/useDisconnect
    const { disconnect } = useDisconnect();

    return (

        <div id={"connectionInfo"} className={"container"}>

            <div className={"row"}>

                <div id={"connectionStatus"} className={"col"}>
                    {/*{account.status && account.status != "connected" && account.status != "disconnected"?`wallet: ${account.status}`:null}*/}
                    {account.status}
                </div>

                <div id={"connectionChainName"} className={"col"}>
                    {account.isConnected?`chain: ${account?.chain?.name}`:null}
                </div>

                <div id={"connectedAddress"} className={"col"}>
                    {account.addresses?`address: ${truncateAddress(account.address)}`:null}
                </div>

                {account.isConnected ?
                    <div id={"disconnectButton"} className={"col"}>
                        <button
                            className="button button--success"
                            onClick={()=>disconnect()}
                            title={"Click to disconnect"}
                        >
                            {account?.connector?.name}{":"}{truncateAddress(account.address)}
                        </button>
                    </div>:

                    connectors.map(connector => (
                        <div key={connector.id} className={"col"}>
                            <button
                               className={"button button--secondary"}
                                // disabled={!connector.ready}
                                onClick={() => connect({connector})}

                                title={connector.name ? `Click to connect ${connector.name}` : `${connector.name} is not ready`}
                            >
                                Connect: [{connector?.name}]
                            </button>
                        </div>
                    ))

                }
                </div>

            {error?
                <div className={"row"}>
                    <div id={"connectionErrorMessage"} className={"col"} style={{color: 'red'}}>
                        {error?`error: ${error}`:null}
                    </div>
                </div>:null}

        </div>

    )
};

export default ConnectionInfo;