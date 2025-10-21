// src/components/ChainSwitcher.tsx
import React, {useEffect} from 'react';
import {useAccount, useSwitchChain} from 'wagmi';
import {mainnet, sepolia} from '@wagmi/core/chains';
import {mode} from '../../constants';

const ChainSwitcher: React.FC = () => {

    const {chains, switchChain} = useSwitchChain()

    const account = useAccount();

    if (!account || !account.isConnected) {
        // console.log('no account connected');
        return null;
    }

    return (
        <div className="dropdown dropdown--hoverable nav-web3">
            <button className="button button--success" title={"Switch chain"}>
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
    );
};

export default ChainSwitcher;
