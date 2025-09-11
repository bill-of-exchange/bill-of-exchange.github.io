import type {HardhatUserConfig} from "hardhat/config";
import {configVariable} from "hardhat/config";

import hardhatVerify from "@nomicfoundation/hardhat-verify";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
    plugins: [
        hardhatToolboxViemPlugin,
        hardhatVerify
    ],
    solidity: {
        profiles: {
            default: {
                //   version: "0.8.28", // << keep only one profile, for verification to work
                // },
                // production: {
                version: "0.8.28",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        },
    },
    networks: {
        hardhatMainnet: {
            type: "edr-simulated",
            chainType: "l1",
        },
        hardhatOp: {
            type: "edr-simulated",
            chainType: "op",
        },
        sepolia: {
            type: "http",
            chainType: "l1",
            url: configVariable("SEPOLIA_RPC_URL"),
            accounts: [configVariable("ETH_DEV_PRIVATE_KEY")],
        },
    },
    verify: {
        etherscan: {
            apiKey: configVariable("ETHERSCAN_API_KEY"),
        },
        blockscout: {
            // To verify contracts on Blockscout, you don't need to set an API key, nor any config.
            enabled: true,
        },
    },
};

export default config;
