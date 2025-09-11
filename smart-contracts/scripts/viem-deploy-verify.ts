// for verification to work, if you use Hardhat Runtime Environment (hre) object in verifyContract function:
// you can’t switch networks from inside the script. Pick Sepolia when you invoke the script
// npx hardhat run scripts/viem-deploy-verify.ts --network sepolia
// npx hardhat verify --network sepolia 0x... $ETH_DEV_ADDRESS

import {WaitForTransactionReceiptParameters} from 'viem';
import hre from "hardhat";
import {verifyContract, VerifyContractArgs} from "@nomicfoundation/hardhat-verify/verify";
import * as console from "node:console";
import * as process from "node:process";
import {writeFileSync} from "node:fs";

const contractName:string = "BillsOfExchange";
const fullyQualifiedContractName:string = `contracts/${contractName}.sol:${contractName}`; //  "fully qualified contract name"
// const constructorArgs:[`0x${string}`] = [process.env.ETH_DEV_ADDRESS];
const _draweeEthereumAddress:string|undefined = process.env.ETH_DEV_ADDRESS;
const constructorArgs:[string|undefined] = [_draweeEthereumAddress];

const chainName: string = "sepolia";

const main = async ()=>{

    const networkConnection = await hre.network.connect(chainName);

    const viemWalletClients = await networkConnection.viem.getWalletClients();

    if (viemWalletClients.length==0){
        console.error("HH can not get viem walletClient");
        return;
    }

    const walletClient = viemWalletClients[0]; // <<< if only one, or modify code
    const publicClient = await networkConnection.viem.getPublicClient();

    // ------ Deploy contract

    console.log('Deploying contract to', chainName);

    const artifact = await hre.artifacts.readArtifact(contractName);

    const txHash = await walletClient.deployContract({
        abi: artifact.abi,
        bytecode: artifact.bytecode as `0x${string}`,
        args: constructorArgs as any[],
    });

    const  waitForTransactionReceiptParameters: WaitForTransactionReceiptParameters = {
        hash:txHash,
        confirmations: 3, // default 1, but you have to wait until your contract will be on Etherscan to verify it
    };

    console.log(`⏳ Waiting for ${waitForTransactionReceiptParameters.confirmations} confirmations for tx: ${txHash}`);

    const receipt = await publicClient.waitForTransactionReceipt(waitForTransactionReceiptParameters);
    const contractAddress = receipt.contractAddress;

    if (!contractAddress) {
        throw new Error('Failed to retrieve contract address');
    }

    console.log(`✅ Deployed ${contractName} on ${chainName} at: ${contractAddress}`);

    const jsonData = {
        contractName: contractName,
        chainName: chainName,
        contractAddress: contractAddress,
        deploymentTx: txHash,
        time: new Date().toISOString()
        // deploymentTxReceipt: receipt,
    };

    // const jsonString = JSON.stringify(jsonData, null, 2);
    const serializedData = JSON.stringify(
        jsonData,
        (key, value) => {
        if (typeof value === "bigint") {
            return value.toString(); // Convert BigInt to string
        }
        return value; // Return other values as is
    },
        2
    );

    const filePath = `./artifacts/${Date.now()}_${chainName}_${contractAddress}.json`;

    try {
        writeFileSync(filePath, serializedData); // overwrites the file
        console.log("Data saved to", filePath);
    } catch (err) {
        console.error('Failed to write file:', err);
    }

    // ------ Verify contract

    // verification
    // for HH 3.0.0.-next26
    // https://github.com/NomicFoundation/hardhat/tree/hardhat%403.0.0-next.26/v-next/hardhat-verify#programmatic-verification

    // --- Etherscan
    const verifyContractArgs: VerifyContractArgs = {
        contract: fullyQualifiedContractName, //  fully qualified contract name, like "contracts/MyContract.sol:MyContract"
        address: contractAddress,
        constructorArgs: constructorArgs,
        provider: "etherscan", // or "blockscout" for Blockscout-compatible explorers
    };

    try {
        const etherscanResult = await verifyContract(
            verifyContractArgs,
            hre
        );
    } catch (error:any){
        const errorMessage = error.message || error.toString();
        console.error("❌ Etherscan verification error:");
        console.error(errorMessage);
    }

    // --- Blockscout
    verifyContractArgs.provider = "blockscout";
    try {
        const blockscoutResult = await verifyContract(
            verifyContractArgs,
            hre
        );
    } catch (error:any){
        const errorMessage = error.message || error.toString();
        console.error("❌ Blockscout verification error:");
        console.error(errorMessage);
    }
};

// Execute deployment
main()
    .then((contract) => {
        // console.log("Deployment successful!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });