import React from 'react';
import {WagmiProvider} from 'wagmi';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {wagmiConfig} from '../wagmiConfig';

const queryClient = new QueryClient();

export default function Root({children}) {
    return (
        <WagmiProvider
            config={wagmiConfig}
            //
            // https://wagmi.sh/react/api/WagmiProvider#reconnectonmount
            reconnectOnMount={true}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
