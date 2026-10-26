// Demonstrates, in the terminal, the full life cycle of an electronic bill of exchange:
// draw → transfer before acceptance → acceptance → circulation → redemption.
//
// Usage:
//   npx hardhat run scripts/demo-lifecycle.ts --network hardhatMainnet   # rehearsal on a fresh local contract
//   npx hardhat run scripts/demo-lifecycle.ts --network sepolia          # live demo on the deployed contract
//
// On a real network the script uses the latest record in ./deployments for that network,
// and the configured account must be the drawer/drawee address hard-coded in the contract.
// For screen recording, slow the demo down: DEMO_PAUSE_MS=4000 npx hardhat run ...

import hre from "hardhat";
import {readdirSync, readFileSync} from "node:fs";
import {
    getAddress,
    keccak256,
    parseEther,
    parseEventLogs,
    toHex,
    zeroAddress,
    type Address,
    type Hash,
} from "viem";

const CONTRACT_NAME = "BillsOfExchange";
const DEPLOYMENTS_DIRECTORY = "./deployments";
const PAUSE_BETWEEN_STEPS_MS = Number(process.env.DEMO_PAUSE_MS ?? 0);

const TX_EXPLORERS_BY_CHAIN_ID: Record<number, string[]> = {
    11155111: ["https://sepolia.etherscan.io/tx/", "https://eth-sepolia.blockscout.com/tx/"],
};

// Counterparties from the 2020 trade-finance ("bananas") scenario. Their addresses are derived
// from the labels, so nobody holds their keys: they can receive bills but never act on them.
const BANANAS_SELLER = "Bananas Seller";
const BANANAS_PRODUCER = "Bananas Producer";
const addressForLabel = (label: string): Address => getAddress(`0x${keccak256(toHex(label)).slice(-40)}`);

// One raw unit is one bill of 0.01 ILS (decimals = 2), so amounts below are counts of bills.
const DRAWN_BILLS = 1000n;
const BILLS_SENT_TO_SELLER = 400n;
const BILLS_ACCEPTED_ON_OWN_BALANCE = 300n;
const BILLS_PAID_TO_PRODUCER = 100n;
const ACCEPTED_BILLS_REDEEMED = 50n;
const UNACCEPTED_BILLS_DESTROYED = 50n;

const style = {
    bold: (text: string) => `\x1b[1m${text}\x1b[0m`,
    dim: (text: string) => `\x1b[2m${text}\x1b[0m`,
    green: (text: string) => `\x1b[32m${text}\x1b[0m`,
    cyan: (text: string) => `\x1b[36m${text}\x1b[0m`,
    yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
};

// Exact bigint formatting with both agorot digits (₪10.00, not ₪10): one bill = one agora.
const shekels = (bills: bigint) => `₪${bills / 100n}.${(bills % 100n).toString().padStart(2, "0")}`;
const pause = () => new Promise((resolve) => setTimeout(resolve, PAUSE_BETWEEN_STEPS_MS));

async function main(): Promise<void> {
    const connection = await hre.network.connect();
    const {viem, networkName} = connection;
    const isSimulatedNetwork = connection.networkConfig.type === "edr-simulated";
    const publicClient = await viem.getPublicClient();

    const contractAddress = isSimulatedNetwork
        ? (await viem.deployContract(CONTRACT_NAME)).address
        : latestDeployedAddress(networkName);
    const readOnlyBills = await viem.getContractAt(CONTRACT_NAME, contractAddress);

    // In the demonstration build the drawer and the drawee are one address (spec §1.2).
    const party = await readOnlyBills.read.DRAWER_ETH_ADDRESS();
    const partyWallet = isSimulatedNetwork
        ? await impersonateOnSimulatedNetwork(viem, party)
        : await configuredWalletOf(viem, party);
    const bills = await viem.getContractAt(CONTRACT_NAME, contractAddress, {client: {wallet: partyWallet}});

    const holders = [
        {label: "Drawer & Drawee", address: party},
        {label: BANANAS_SELLER, address: addressForLabel(BANANAS_SELLER)},
        {label: BANANAS_PRODUCER, address: addressForLabel(BANANAS_PRODUCER)},
    ];
    const labelOf = (address: string) =>
        address.toLowerCase() === zeroAddress ? "0x0 (destroyed)" : holders.find((holder) => holder.address.toLowerCase() === address.toLowerCase())?.label ?? address;

    const totalBills = async () =>
        (await bills.read.totalSupplyOfUnaccepted()) + (await bills.read.totalSupply());

    async function printLedger(): Promise<void> {
        console.log(style.dim("    holder                 unaccepted         accepted"));
        for (const holder of holders) {
            const unaccepted = await bills.read.balanceOfUnaccepted([holder.address]);
            const accepted = await bills.read.balanceOf([holder.address]);
            console.log(`    ${holder.label.padEnd(20)} ${shekels(unaccepted).padStart(12)} ${shekels(accepted).padStart(16)}`);
        }
        const unacceptedTotal = await bills.read.totalSupplyOfUnaccepted();
        const acceptedTotal = await bills.read.totalSupply();
        console.log(style.bold(`    ${"Total".padEnd(20)} ${shekels(unacceptedTotal).padStart(12)} ${shekels(acceptedTotal).padStart(16)}`));
        console.log(style.dim(`    bills in existence: ${shekels(unacceptedTotal + acceptedTotal)}`));
    }

    async function step(number: number, title: string, explanation: string, sendTransaction: () => Promise<Hash>): Promise<void> {
        console.log(`\n${style.bold(style.cyan(`Step ${number}. ${title}`))}`);
        console.log(style.dim(`    ${explanation}`));

        const hash = await sendTransaction();
        const receipt = await publicClient.waitForTransactionReceipt({hash});
        if (receipt.status !== "success") {
            throw new Error(`Transaction ${hash} reverted`);
        }

        for (const event of parseEventLogs({abi: bills.abi, logs: receipt.logs})) {
            const args = Object.entries(event.args as Record<string, unknown>)
                .map(([name, value]) => `${name}=${typeof value === "bigint" ? shekels(value) : labelOf(String(value))}`)
                .join(", ");
            console.log(`    ${style.yellow("event")} ${event.eventName}(${args})`);
        }
        for (const explorer of TX_EXPLORERS_BY_CHAIN_ID[publicClient.chain.id] ?? []) {
            console.log(style.dim(`    ${explorer}${hash}`));
        }

        await printLedger();
        await pause();
    }

    console.log(style.bold(`\nElectronic bills of exchange — live demonstration on ${networkName}`));
    console.log(`    Contract  ${contractAddress}  (version ${await bills.read.CONTRACT_VERSION()})`);
    console.log(`    Order     ${await bills.read.ORDER()}`);
    console.log(`    Drawer    ${await bills.read.DRAWER_NAME()}`);
    console.log(`    Drawee    ${await bills.read.DRAWEE_NAME()}`);
    console.log(`    Payable   ${await bills.read.TIME_OF_PAYMENT()}, in ${await bills.read.CURRENCY()}`);
    console.log("\n  Ledger before the demonstration:");
    await printLedger();
    const billsBefore = await totalBills();
    await pause();

    await step(1, `Drawing ${DRAWN_BILLS} bills (${shekels(DRAWN_BILLS)})`,
        "The drawer signs the order to pay (BoEA 1882 s.3). Only the drawer is liable so far.",
        () => bills.write.draw([DRAWN_BILLS]));

    await step(2, `Transferring ${shekels(BILLS_SENT_TO_SELLER)} of unaccepted bills to the ${BANANAS_SELLER}`,
        "Bearer bills pass by delivery (s.31(2)) — no bank account is needed to receive them.",
        () => bills.write.transferOfUnaccepted([addressForLabel(BANANAS_SELLER), BILLS_SENT_TO_SELLER]));

    await step(3, `Accepting the ${shekels(BILLS_SENT_TO_SELLER)} held by the ${BANANAS_SELLER}`,
        "The drawee signs acceptance (s.17) and becomes primarily liable. Note: no ERC-20 Transfer event — " +
        "acceptance changes the state of a bill, not the set of bills.",
        () => bills.write.acceptOn([addressForLabel(BANANAS_SELLER), BILLS_SENT_TO_SELLER]));

    await step(4, `Accepting ${shekels(BILLS_ACCEPTED_ON_OWN_BALANCE)} on the drawee's own balance`,
        "Accepted bills now circulate as a standard ERC-20 token, usable in any Ethereum wallet.",
        () => bills.write.accept([BILLS_ACCEPTED_ON_OWN_BALANCE]));

    await step(5, `Paying the ${BANANAS_PRODUCER} ${shekels(BILLS_PAID_TO_PRODUCER)} in accepted bills`,
        "Accepted bills are used as means of payment, wallet to wallet.",
        () => bills.write.transfer([addressForLabel(BANANAS_PRODUCER), BILLS_PAID_TO_PRODUCER]));

    await step(6, `Redeeming ${shekels(ACCEPTED_BILLS_REDEEMED)} of accepted bills`,
        "Paid bills are destroyed, like a paper bill surrendered on payment.",
        () => bills.write.burn([ACCEPTED_BILLS_REDEEMED]));

    await step(7, `Destroying ${shekels(UNACCEPTED_BILLS_DESTROYED)} of unaccepted bills`,
        "The holder of unaccepted bills may destroy them, reducing the drawer's liability.",
        () => bills.write.burnOfUnaccepted([UNACCEPTED_BILLS_DESTROYED]));

    // Conservation of bills (spec §5): only drawing creates bills, only burning destroys them.
    const expectedChange = DRAWN_BILLS - ACCEPTED_BILLS_REDEEMED - UNACCEPTED_BILLS_DESTROYED;
    const actualChange = (await totalBills()) - billsBefore;
    if (actualChange !== expectedChange) {
        throw new Error(`Conservation of bills violated: expected ${shekels(expectedChange)}, got ${shekels(actualChange)}`);
    }
    console.log(style.green(style.bold(
        `\n✔ Conservation of bills holds: drawn ${shekels(DRAWN_BILLS)} − destroyed ` +
        `${shekels(ACCEPTED_BILLS_REDEEMED + UNACCEPTED_BILLS_DESTROYED)} = ${shekels(actualChange)} in existence`,
    )));
}

/** Reads the address of the most recent deployment recorded by viem-deploy-verify.ts. */
function latestDeployedAddress(networkName: string): Address {
    // Record file names start with an ISO timestamp, so lexicographic order is chronological.
    const records = readdirSync(DEPLOYMENTS_DIRECTORY)
        .filter((fileName) => fileName.endsWith(".json"))
        .sort()
        .map((fileName) => JSON.parse(readFileSync(`${DEPLOYMENTS_DIRECTORY}/${fileName}`, "utf8")))
        .filter((record) => record.networkName === networkName && record.contractName === CONTRACT_NAME);
    const latest = records.at(-1);
    if (latest === undefined) {
        throw new Error(`No ${CONTRACT_NAME} deployment recorded for "${networkName}" in ${DEPLOYMENTS_DIRECTORY}`);
    }
    return getAddress(latest.contractAddress);
}

type Viem = Awaited<ReturnType<typeof hre.network.connect>>["viem"];

/** On a simulated network nobody holds the hard-coded party's key, so we impersonate it. */
async function impersonateOnSimulatedNetwork(viem: Viem, party: Address) {
    const testClient = await viem.getTestClient();
    await testClient.impersonateAccount({address: party});
    await testClient.setBalance({address: party, value: parseEther("1")});
    return viem.getWalletClient(party);
}

/** On a real network the configured account must be the party; anything else would revert anyway. */
async function configuredWalletOf(viem: Viem, party: Address) {
    const [walletClient] = await viem.getWalletClients();
    if (walletClient === undefined || getAddress(walletClient.account.address) !== getAddress(party)) {
        throw new Error(`The configured account must be the drawer/drawee ${party}`);
    }
    return walletClient;
}

main().catch((error: unknown) => {
    console.error("❌", error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
