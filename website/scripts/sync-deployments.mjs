// Collects, from the records written by smart-contracts/scripts/viem-deploy-verify.ts, the latest
// deployment of every contract on every chain, together with its ABI, and saves them to
// src/deployments.json.
//
// The website takes contract addresses and ABIs from that file only. They describe the code that is
// deployed, not the current source in smart-contracts/contracts: a new contract version can be
// developed there without changing the site until it is deployed. `npm start` and `npm run build`
// run this script first.
//
// Usage (from website/): node scripts/sync-deployments.mjs

import {readdirSync, readFileSync, writeFileSync} from "node:fs";
import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";
import {isDeepStrictEqual} from "node:util";

const websiteDirectory = join(dirname(fileURLToPath(import.meta.url)), "..");
const recordsDirectory = join(websiteDirectory, "..", "smart-contracts", "deployments");
const outputFile = join(websiteDirectory, "src", "deployments.json");

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;

function readRecord(fileName) {
    const record = JSON.parse(readFileSync(join(recordsDirectory, fileName), "utf8"));
    const problems = [
        typeof record.contractName !== "string" && "contractName",
        !Number.isInteger(record.chainId) && "chainId",
        !ADDRESS_PATTERN.test(record.contractAddress) && "contractAddress",
        Number.isNaN(Date.parse(record.time)) && "time",
        !(Array.isArray(record.abi) && record.abi.length > 0) && "abi",
    ].filter(Boolean);
    if (problems.length > 0) {
        // A malformed record must stop the build: silently skipping it could publish an old address.
        throw new Error(`Deployment record ${fileName} has missing or invalid fields: ${problems.join(", ")}`);
    }
    return {...record, fileName};
}

const records = readdirSync(recordsDirectory)
    .filter((fileName) => fileName.endsWith(".json"))
    .map(readRecord);
if (records.length === 0) {
    throw new Error(`No deployment records in ${recordsDirectory}: the website would have no contract to show.`);
}

// contractName → chainId → the most recent record on that chain.
const latestRecords = {};
for (const record of records) {
    const recordsByChain = (latestRecords[record.contractName] ??= {});
    const current = recordsByChain[record.chainId];
    if (current === undefined || Date.parse(record.time) > Date.parse(current.time)) {
        recordsByChain[record.chainId] = record;
    }
}

const output = {};
for (const [contractName, recordsByChain] of Object.entries(latestRecords)) {
    const [firstRecord, ...otherRecords] = Object.values(recordsByChain);
    // The site binds one ABI to a contract name on all chains, so the deployments in use must share it.
    const recordWithOtherAbi = otherRecords.find((record) => !isDeepStrictEqual(record.abi, firstRecord.abi));
    if (recordWithOtherAbi !== undefined) {
        throw new Error(
            `${contractName}: the latest deployments have different ABIs ` +
            `(${firstRecord.fileName} and ${recordWithOtherAbi.fileName}); redeploy so that all chains run the same version.`,
        );
    }
    output[contractName] = {
        abi: firstRecord.abi,
        chains: Object.fromEntries(Object.entries(recordsByChain).map(([chainId, record]) => [chainId, {
            address: record.contractAddress,
            blockNumber: record.blockNumber,
            deploymentTx: record.deploymentTx,
            time: record.time,
            record: record.fileName,
        }])),
    };
}

writeFileSync(outputFile, JSON.stringify(output, null, 2) + "\n");
for (const [contractName, {chains}] of Object.entries(output)) {
    for (const [chainId, deployment] of Object.entries(chains)) {
        console.log(`${contractName} on chain ${chainId}: ${deployment.address} (${deployment.record})`);
    }
}
