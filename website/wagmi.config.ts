
// this is a config for Wagmi CLI
// https://wagmi.sh/cli/getting-started

// npx wagmi init
// creates  wagmi.config.ts, if not exists

// run:
// npx wagmi generate
// wagmi generate --config wagmi.config.ts

import { defineConfig } from '@wagmi/cli';
import { hardhat } from '@wagmi/cli/plugins';
import { react } from '@wagmi/cli/plugins'

// chain ids:
// https://wagmi.sh/core/api/chains#available-chains

const contractAddressSepolia:`0x${string}` = "0xdd5d36c9cce7893ebfc35c4390511281cab3da85";

export default defineConfig({
    out: 'src/generated.ts',
    contracts: [],
    plugins: [

        hardhat({
            project: '../smart-contracts',
            deployments: {
                BillsOfExchange: {
                     "11155111": contractAddressSepolia,
                },
            }
        }),
        react(),
    ],
});

