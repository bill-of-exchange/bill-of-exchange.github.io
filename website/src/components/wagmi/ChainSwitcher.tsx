// src/components/wagmi/ChainSwitcher.tsx
import React from 'react';
import {useAccount, useSwitchChain} from 'wagmi';
import {mode} from '../../constants';

export default function ChainSwitcher (){

    const {chains, switchChain} = useSwitchChain()

    const account = useAccount();

    if (!account||!account.isConnected) {
        mode == 'dev'?console.log('no account connected'):null;
        return null;
    } else {
        mode == 'dev'?console.log('account connected: ', account.address):null;
    }

    return (
        <div className={"ChainSwitcher"}>
            <div className="dropdown dropdown--hoverable nav-web3">
                <button className="button button--primary" title={"Switch chain"}>
                    {account.chain?.name}
                </button>
                <ul className="dropdown__menu">

                    {chains.map((chain) => (
                        <li key={chain.name + "_option"}>
                            <a
                                className="dropdown__link pointerOnHover"
                                // href="#"
                                onClick={()=> switchChain({chainId:chain.id})}
                                title={`Click to switch to ${chain.name} `}
                            >
                                {chain.name}
                            </a>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
}
