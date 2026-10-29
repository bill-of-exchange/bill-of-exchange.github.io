import {createConfig, fallback, http} from 'wagmi';
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

// --- Blockchain nodes (JSON-RPC) from which the site reads the contract.
// Why these nodes, in this order, with these settings: README.md, "Blockchain nodes".
// They serve reads only; a visitor's transactions go through the node set in the visitor's wallet.

// Sepolia nodes in order of preference; each is asked only if all those before it failed.
const SEPOLIA_NODES = [
    'https://ethereum-sepolia-rpc.publicnode.com', // PublicNode (Allnodes)
    'https://sepolia.gateway.tenderly.co',         // Tenderly
    'https://rpc.sepolia.ethpandaops.io',          // ethPandaOps (Ethereum testnet operations)
    'https://11155111.rpc.thirdweb.com',           // thirdweb (viem's default for Sepolia when chosen)
] as const;

// Give up on a node quickly and let the next one answer: the next node *is* the retry.
const NODE_OPTIONS = {timeout: 5_000, retryCount: 0} as const;

const sepoliaTransport = fallback(
    [
        ...SEPOLIA_NODES.map((url) => http(url, NODE_OPTIONS)),
        // Last resort, kept on purpose: viem's own default Sepolia node. Unlike the nodes above,
        // it is chosen by the authors of viem and may change when viem is updated.
        http(undefined, NODE_OPTIONS),
    ],
    {
        rank: false,      // keep the order above; no background latency probing of the nodes
        retryCount: 0,    // no second round once every node has failed: the page offers "Try again"
    },
);

export const config = createConfig({
    chains: chains,
    connectors: [
        metaMask({
            // The MetaMask SDK sends anonymous usage events (an "sdk_initialized" event with an
            // anonymous id on every page load) to mm-sdk-analytics.api.cx.metamask.io unless told not to.
            // This site does not ask its visitors to consent to third-party analytics, so it is off.
            enableAnalytics: false,
            // Shown in MetaMask when a visitor connects (wagmi's default name is 'wagmi').
            dappMetadata: {name: 'Bills of Exchange'},
        }),
        // injected(),        // Fallback for other injected wallets <- not needed
    ],
    transports: {
        // No contract on Mainnet yet: viem's default node is enough until then.
        [mainnet.id]: http(),
        [sepolia.id]: sepoliaTransport,
    },

    // https://wagmi.sh/react/api/createConfig#ssr
    // https://wagmi.sh/react/guides/ssr
    ssr: true, // <— important for SSR/static sites like Docusaurus
});
