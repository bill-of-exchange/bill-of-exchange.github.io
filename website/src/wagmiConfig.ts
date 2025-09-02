import {createConfig, http} from 'wagmi';
import {mainnet, sepolia} from 'wagmi/chains';
import {metaMask} from 'wagmi/connectors';

export const wagmiConfig = createConfig({
    chains: [mainnet, sepolia],
    connectors: [metaMask()],  // Enable MetaMask (and injected) wallet
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
});
