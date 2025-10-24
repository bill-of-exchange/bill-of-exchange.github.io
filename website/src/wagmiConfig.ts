import {createConfig, http} from 'wagmi';
import {Chain, mainnet, sepolia} from 'wagmi/chains';
import {metaMask} from '@wagmi/connectors';
import {mode} from './constants';

// https://wagmi.sh/react/typescript#declaration-merging
declare module 'wagmi' {
    interface Register {
        config: typeof config,
    }
}

// see:
// https://wagmi.sh/react/api/createConfig

// export chains or constants you’ll reuse in CLI
// see also https://wagmi.sh/core/api/chains for the list of chains
// (1) Guarantees non-empty (at least one chain) and immutability. Flexible length (you can add more chains without changing the type).
// export const chains:readonly [Chain, ...Chain[]] = [mainnet, sepolia]; //
// (2) Guarantees exactly two chains and immutability.
// (3) order matters: wagmi’s default chain is the first in this array
//
export const chains: readonly [Chain, Chain] = mode === 'production'
    ? [mainnet, sepolia]   // default = mainnet
    : [sepolia, mainnet]   // default = sepolia
// or for dev only:
// export const chains:readonly [Chain] = [sepolia]

export const config = createConfig({
    chains: chains,
    connectors: [
        metaMask(),        // MetaMask connector
        // injected(),        // Fallback for other injected wallets <- not needed
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },

    // https://wagmi.sh/react/api/createConfig#ssr
    // https://wagmi.sh/react/guides/ssr
    ssr: true, // <— important for SSR/static sites like Docusaurus
});
