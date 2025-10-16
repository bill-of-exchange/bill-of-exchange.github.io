import type {PropsWithChildren} from 'react';
import React from 'react';
import {WagmiProvider} from 'wagmi';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {config} from '../wagmiConfig';

const queryClient = new QueryClient();

// Wrapping your Docusaurus site with <Root>
// https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
//
export default function Root({ children }: PropsWithChildren) {
    return (
        <WagmiProvider
            config={config}
            // https://wagmi.sh/react/api/WagmiProvider#reconnectonmount
            reconnectOnMount={true}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>

        </WagmiProvider>
    );
}
