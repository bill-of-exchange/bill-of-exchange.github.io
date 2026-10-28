// Configuration of the wagmi CLI, which writes src/generated.ts: the typed ABI and React hooks
// bound to the contract addresses. https://wagmi.sh/cli/getting-started
//
// Run through `npm run contracts:sync` (automatically before `npm start` and `npm run build`).
//
// The ABI comes from src/deployments.json, that is from the records of actual deployments, never from
// the Hardhat artifacts: those follow the source code, which may already hold an undeployed version.

import {defineConfig} from '@wagmi/cli';
import {react} from '@wagmi/cli/plugins';
import type {Abi} from 'viem';
import deploymentRecords from './deployments.json';
import {deployments} from './constants';

export default defineConfig({
    out: 'src/generated.ts',
    contracts: [
        {
            name: 'BillsOfExchange',
            abi: deploymentRecords.BillsOfExchange.abi as Abi,
            address: deployments.BillsOfExchange,
        },
    ],
    plugins: [react()],
});
