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

// Public explorer APIs rate-limit bursts of requests (HTTP 429): retry a few times before giving up.
const VERIFICATION_ATTEMPTS = 3;
const RATE_LIMIT_BACKOFF_MS = 20_000;

// Blockscout also takes verified sources from the shared Verifier Alliance database (which
// Sourcify feeds), so a contract may become fully verified there even when our own submission
// keeps hitting HTTP 429. Before reporting a failure, ask Blockscout for the contract's status.
const BLOCKSCOUT_STATUS_CHECKS = 3;
const BLOCKSCOUT_STATUS_INTERVAL_MS = 15_000;

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

    const failedProviders = await verifyOnExplorers(publicClient.chain.id, contractAddress);
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
async function verifyOnExplorers(chainId: number, contractAddress: string): Promise<string[]> {
    const failedProviders: string[] = [];
    for (const provider of VERIFICATION_PROVIDERS) {
        if (await verifyOnExplorerWithRetries(contractAddress, provider)) {
            continue;
        }
        if (provider === "blockscout" && await isFullyVerifiedOnBlockscout(chainId, contractAddress)) {
            console.log("✅ Our submission to Blockscout failed, but Blockscout already shows the contract " +
                "as fully verified (it obtained the sources from the shared database).");
            continue;
        }
        failedProviders.push(provider);
    }
    return failedProviders;
}

async function verifyOnExplorerWithRetries(
    contractAddress: string,
    provider: (typeof VERIFICATION_PROVIDERS)[number],
): Promise<boolean> {
    for (let attempt = 1; attempt <= VERIFICATION_ATTEMPTS; attempt++) {
        try {
            return await verifyContract(
                {contract: FULLY_QUALIFIED_CONTRACT_NAME, address: contractAddress, constructorArgs: [], provider},
                hre,
            );
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const isRateLimited = message.includes("429");
            if (!isRateLimited || attempt === VERIFICATION_ATTEMPTS) {
                console.error(`❌ ${provider} verification error:`, message);
                return false;
            }
            console.log(`⏳ ${provider} rate-limited the request; retrying in ${RATE_LIMIT_BACKOFF_MS / 1000} s ` +
                `(attempt ${attempt + 1} of ${VERIFICATION_ATTEMPTS})`);
            await sleep(RATE_LIMIT_BACKOFF_MS);
        }
    }
    return false;
}

/** A partial match does not count: only `is_fully_verified` means the sources match exactly. */
async function isFullyVerifiedOnBlockscout(chainId: number, contractAddress: string): Promise<boolean> {
    const blockscout = hre.config.chainDescriptors.get(BigInt(chainId))?.blockExplorers.blockscout;
    if (blockscout === undefined) {
        console.error(`❌ No Blockscout explorer is known for chain ${chainId}.`);
        return false;
    }
    const statusUrl = `${blockscout.url}/api/v2/smart-contracts/${contractAddress}`;

    // The import from the shared database may lag behind, so check a few times before giving up.
    for (let check = 1; check <= BLOCKSCOUT_STATUS_CHECKS; check++) {
        console.log(`⏳ Checking the contract's status on Blockscout (check ${check} of ${BLOCKSCOUT_STATUS_CHECKS})`);
        try {
            const response = await fetch(statusUrl);
            if (response.ok) {
                const status = (await response.json()) as { is_fully_verified?: boolean };
                if (status.is_fully_verified === true) {
                    return true;
                }
            } else {
                console.log(`   Blockscout answered HTTP ${response.status}.`);
            }
        } catch (error: unknown) {
            console.error("   Blockscout status request failed:", error instanceof Error ? error.message : error);
        }
        if (check < BLOCKSCOUT_STATUS_CHECKS) {
            await sleep(BLOCKSCOUT_STATUS_INTERVAL_MS);
        }
    }
    return false;
}

function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

main().catch((error: unknown) => {
    console.error("❌", error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
