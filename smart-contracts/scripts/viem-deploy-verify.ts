// Deploys the BillsOfExchange contract and verifies its source code on Etherscan and Blockscout.
//
// Usage:
//   npx hardhat run scripts/viem-deploy-verify.ts --network sepolia
//
// The target network comes from the --network option, not from the script: programmatic
// verification runs through the Hardhat Runtime Environment, which is bound to the network
// chosen on the command line and cannot switch networks mid-script.
//
// On a simulated network (e.g. --network hardhatMainnet) the script only deploys:
// there is no explorer to verify on and no deployment worth recording.
//
// Manual re-verification, if needed (the constructor takes no arguments):
//   npx hardhat verify --network sepolia <contract address>

import hre from "hardhat";
import {verifyContract} from "@nomicfoundation/hardhat-verify/verify";
import {mkdirSync, writeFileSync} from "node:fs";

const CONTRACT_NAME = "BillsOfExchange";
const FULLY_QUALIFIED_CONTRACT_NAME = `contracts/${CONTRACT_NAME}.sol:${CONTRACT_NAME}`;

// Explorers index a new contract only after a few blocks; verifying earlier fails.
const CONFIRMATIONS_BEFORE_VERIFICATION = 3;

// Deployment records are kept under version control. ./artifacts would be the wrong place:
// it is git-ignored and wiped by `npx hardhat clean`.
const DEPLOYMENTS_DIRECTORY = "./deployments";

const VERIFICATION_PROVIDERS = ["etherscan", "blockscout"] as const;

async function main(): Promise<void> {
    const networkConnection = await hre.network.connect();
    const {networkName} = networkConnection;
    const isSimulatedNetwork = networkConnection.networkConfig.type === "edr-simulated";

    const [deployerWalletClient] = await networkConnection.viem.getWalletClients();
    if (deployerWalletClient === undefined) {
        throw new Error(`No deployer account configured for network "${networkName}".`);
    }
    const publicClient = await networkConnection.viem.getPublicClient();

    console.log(`Deploying ${CONTRACT_NAME} to ${networkName} from ${deployerWalletClient.account.address}`);

    // The v0.1.0 constructor takes no arguments: the parties are compile-time constants,
    // and no bills exist until the drawer calls draw().
    const artifact = await hre.artifacts.readArtifact(CONTRACT_NAME);
    const deploymentTxHash = await deployerWalletClient.deployContract({
        abi: artifact.abi,
        bytecode: artifact.bytecode as `0x${string}`,
        args: [], // viem requires `args` when the ABI type is generic, even if empty
    });

    console.log(`⏳ Waiting for confirmation of tx ${deploymentTxHash}`);
    const receipt = await publicClient.waitForTransactionReceipt({
        hash: deploymentTxHash,
        confirmations: isSimulatedNetwork ? 1 : CONFIRMATIONS_BEFORE_VERIFICATION,
    });
    const contractAddress = receipt.contractAddress;
    if (!contractAddress) {
        throw new Error(`Deployment tx ${deploymentTxHash} did not create a contract.`);
    }
    console.log(`✅ Deployed ${CONTRACT_NAME} on ${networkName} at ${contractAddress}`);

    if (isSimulatedNetwork) {
        console.log("Simulated network: deployment record and source verification skipped.");
        return;
    }

    saveDeploymentRecord({
        contractName: CONTRACT_NAME,
        networkName,
        chainId: publicClient.chain.id,
        contractAddress,
        deploymentTx: deploymentTxHash,
        blockNumber: receipt.blockNumber.toString(),
        deployer: deployerWalletClient.account.address,
        time: new Date().toISOString(),
    });

    const failedProviders = await verifyOnExplorers(contractAddress);
    if (failedProviders.length > 0) {
        // The deployment itself succeeded; the address is printed above and saved in the record.
        throw new Error(`Source verification failed on: ${failedProviders.join(", ")}`);
    }
}

function saveDeploymentRecord(record: Record<string, string | number>): void {
    mkdirSync(DEPLOYMENTS_DIRECTORY, {recursive: true});
    // A sortable timestamp prefix keeps the records in deployment order.
    const timestamp = String(record.time).replace(/[:.]/g, "-");
    const filePath = `${DEPLOYMENTS_DIRECTORY}/${timestamp}_${record.networkName}_${record.contractAddress}.json`;
    writeFileSync(filePath, JSON.stringify(record, null, 2) + "\n");
    console.log(`Deployment record saved to ${filePath}`);
}

/** Tries every provider, even after a failure, and returns the names of those that failed. */
async function verifyOnExplorers(contractAddress: string): Promise<string[]> {
    const failedProviders: string[] = [];
    for (const provider of VERIFICATION_PROVIDERS) {
        try {
            const isVerified = await verifyContract(
                {contract: FULLY_QUALIFIED_CONTRACT_NAME, address: contractAddress, constructorArgs: [], provider},
                hre,
            );
            if (!isVerified) {
                failedProviders.push(provider);
            }
        } catch (error: unknown) {
            console.error(`❌ ${provider} verification error:`, error instanceof Error ? error.message : error);
            failedProviders.push(provider);
        }
    }
    return failedProviders;
}

main().catch((error: unknown) => {
    console.error("❌", error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
