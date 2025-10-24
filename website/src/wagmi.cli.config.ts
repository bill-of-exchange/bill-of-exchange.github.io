
// this is a config for Wagmi CLI
// https://wagmi.sh/cli/getting-started

// npx wagmi init
// creates  wagmi.cli.config.ts, if not exists

// run:
// npx wagmi generate
// wagmi generate --config wagmi.cli.config.ts

import {defineConfig} from '@wagmi/cli';
import {hardhat, HardhatConfig, react} from '@wagmi/cli/plugins';
import {deployments} from "@site/src/constants";

const hardhatConfig: HardhatConfig= {
    project: '../smart-contracts',
    include: [
        'contracts/BillsOfExchange.sol/BillsOfExchange.json',
    ],
    deployments: deployments,
};

export default defineConfig({
    out: 'src/generated.ts',
    contracts: [],
    plugins: [
        hardhat(hardhatConfig),
        react(),
    ],
});
