import {createConfig, http} from 'wagmi';
import {mainnet, sepolia} from 'wagmi/chains';
import {metaMask} from '@wagmi/connectors';

// see:
// https://wagmi.sh/react/api/createConfig

export const wagmiConfig = createConfig({
    chains: [mainnet, sepolia],
    connectors: [
        metaMask(),        // MetaMask connector
        // injected(),        // Fallback for other injected wallets <- not needed
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
    //
    // https://wagmi.sh/react/api/createConfig#ssr
    // https://wagmi.sh/react/guides/ssr
    ssr: true, // <— important for SSR/static sites like Docusaurus
});
