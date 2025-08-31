import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";
import * as process from "node:process";


export default buildModule("BillsOfExchangeModule", (m) => {

    const initialOwner = process.env.ETH_DEV_ADDRESS;

    if (!initialOwner) {
        throw new Error("Missing initialOwner constructor argument");
    }

  const contract = m.contract("BillsOfExchange", [initialOwner]);

  return { contract };

});

// npx hardhat ignition deploy --network sepolia ignition/modules/BillsOfExchange.ts

// npx hardhat verify --network sepolia <contract address> $ETH_DEV_ADDRESS
// npx hardhat verify --network sepolia 0xa53B5D3345579Ff5084eC190510289674FD88653 $ETH_DEV_ADDRESS
