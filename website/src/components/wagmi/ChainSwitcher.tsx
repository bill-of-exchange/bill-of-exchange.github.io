// src/components/wagmi/ChainSwitcher.tsx
import React, {useEffect} from 'react';
import {useAccount, useSwitchChain} from 'wagmi';
import {mode} from '../../constants';

export default function ChainSwitcher (){

    const {chains, switchChain} = useSwitchChain()

    const account = useAccount();

    // Log from an effect, not from render: effects never run during static site
    // generation (so `docusaurus build` stays quiet), and they fire once per
    // connection change instead of on every re-render.
    useEffect(() => {
        if (mode !== 'dev') return;
        if (account.isConnected) {
            console.log('account connected: ', account.address);
        } else {
            console.log('no account connected');
        }
    }, [account.isConnected, account.address]);

    if (!account.isConnected) {
        return null;
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
