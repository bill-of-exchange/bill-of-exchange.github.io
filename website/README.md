# Website

The project website, [bills-of-exchange.com](https://bills-of-exchange.com): documentation, blog and a web interface
to the `BillsOfExchange` smart contract in [`../smart-contracts`](../smart-contracts).
It is a [Docusaurus](https://docusaurus.io/) site; the contract interface uses
[wagmi](https://wagmi.sh/) and [viem](https://viem.sh/).

This file is for developers of the site. How the contract works and how to use it is in the site's own
documentation (`docs/`, published under *Documentation*).

## Quick start

The repository is an npm workspace (`smart-contracts`, `website`). Install once, from the repository root:

```shell
npm install
```

Then, in `website/`:

| Command | What it does |
|---|---|
| `npm start` | development server at http://localhost:3000 |
| `npm run build` | production build into `build/` |
| `npm run serve` | serves `build/` locally |
| `npm run typecheck` | TypeScript check |
| `npm run contracts:sync` | refreshes contract addresses and the generated ABI (runs automatically before `start` and `build`) |

`start` and `build` never compile the contracts: the site uses the ABI saved with each deployment (see below).

## Layout

| Path | Contents |
|---|---|
| `docs/`, `blog/` | documentation and blog (Markdown/MDX) |
| `src/pages/` | pages: `index.tsx` (home: the bill and the registry figures), `issue.tsx` ("Issue and accept", the drawer's and the drawee's page), `wallet.tsx` ("My bills", the holder's page), `manage.tsx` (redirects old links to `/wallet/`), `playground.tsx` (hidden, see below) |
| `src/components/wallet/` | the holder's page: `WalletGate` (connect / switch network / content), holdings, send, receive, recent transfers, verify another holder; and what every action on bills shares: `BillsActionForm` (enter → review → progress), `useBillsTransaction` (write and receipt), `billAmount` (parsing amounts) |
| `src/components/issuance/` | the drawer's and the drawee's page: the parties and the registry, the steps draw, deliver and accept |
| `src/components/bill/` | the bill rendered from the contract (`Bill.tsx`), the statements recorded with it shown as contract text (`ContractTerms.tsx`), the hooks that read them (`useBillTerms.ts`), the home page showcase |
| `src/components/contracts/` | contract interface components; `BoE/` holds the BillsOfExchange cards; `useDisplayedContract.ts` decides which chain and address a page shows |
| `src/components/wagmi/` | wallet connection, chain switcher, address helpers |
| `src/components/docs/` | components used inside documentation pages |
| `src/theme/Root.tsx` | wraps the whole site in the wagmi and React Query providers |
| `src/wagmiConfig.ts` | wagmi configuration: chains, connectors, transports |
| `src/constants.ts` | site-wide constants: chains, contract addresses, explorers |
| `src/deployments.json` | **generated**: latest deployment per contract and chain |
| `src/generated.ts` | **generated**: typed ABI and React hooks bound to the contract addresses |
| `src/wagmi.cli.config.ts` | configuration of the wagmi CLI that writes `src/generated.ts` |
| `scripts/sync-deployments.mjs` | writes `src/deployments.json` |
| `src/rpcNodes.json` | the blockchain nodes the site reads from, in order (see Blockchain nodes) |
| `scripts/check-rpc-nodes.mjs` | checks those nodes; run monthly by `.github/workflows/check-rpc-nodes.yml` |
| `build/` | the built site; **committed**, because GitHub Pages serves it as is (see Publishing) |

Never edit the generated files by hand: the next `start` or `build` overwrites them.

## How the site finds the contract

The contract address and ABI are never typed in by hand. They flow from the deployment to the site:

```text
smart-contracts/scripts/viem-deploy-verify.ts
    → smart-contracts/deployments/<time>_<network>_<address>.json     one record per deployment, with its ABI
scripts/sync-deployments.mjs
    → src/deployments.json                                            latest deployment per contract and chain
src/constants.ts (addresses) + src/wagmi.cli.config.ts (ABI)
    → wagmi generate
    → src/generated.ts                                                ABI + hooks bound to the addresses
    → components
```

`npm run contracts:sync` runs the last three steps and is run automatically before `npm start` and `npm run build`.
So after deploying a new contract, rebuilding the site is all it takes.

Rules:

- For each chain, the record with the latest `time` wins. To roll back to an earlier deployment, delete the newer
  record.
- A malformed record, or no records at all, stops the build: publishing a site with a stale or missing address
  must not happen silently.
- Chains listed in `CHAINS` (`src/constants.ts`) that have no deployment get the zero address, which the interface
  treats as "not deployed on this network".
- The site follows the **deployed** code, not the source. The ABI comes from the deployment record, never from the
  Hardhat artifacts, so a new contract version can be developed in `../smart-contracts` without any effect on the
  site until it is deployed.
- All current deployments of a contract (one per chain) must share one ABI, because the site binds one ABI to a
  contract name. If they differ, the sync stops with an error: redeploy so that all chains run the same version.
- The documentation page *Smart contract → Deployments* renders `src/deployments.json` directly, so it always
  shows the address the site uses.

## Networks

- `CHAINS` in `src/constants.ts` lists the supported chains (Ethereum Mainnet and Sepolia).
- `mode` in `src/constants.ts` decides the default chain (`src/wagmiConfig.ts`): Sepolia in `'dev'`, Mainnet in
  `'production'`.
- Without a connected wallet, or with a wallet on an unsupported chain, the interface shows the contract on the
  default chain (for example the block explorer links in `ContractOnExplorers.tsx`).

## Blockchain nodes

The site reads the blockchain (the terms of the bill, the registry figures, balances) through public JSON-RPC
nodes. The nodes and their order are listed in `src/rpcNodes.json`, together with the time each node is given
(`nodeTimeoutMs`); `src/wagmiConfig.ts` builds the connection from that file, in `transports`, one entry per chain:
a node serves one chain only, so every chain has its own list. `scripts/check-rpc-nodes.mjs` checks the same file,
so the site and the check can never disagree about which nodes are in use.

These nodes serve **reads only**. A visitor's transactions (drawing, accepting, transferring bills) are sent by the
visitor's wallet through the node configured in the wallet; this list has no effect on them.

### Sepolia: a fallback list

Sepolia uses viem's `fallback` transport over these nodes, in this order:

| # | Node | Operator | Why here |
|---|---|---|---|
| 1 | `https://ethereum-sepolia-rpc.publicnode.com` | PublicNode (Allnodes) | among the two fastest in the test below; presents itself as "privacy first" |
| 2 | `https://sepolia.gateway.tenderly.co` | Tenderly | the fastest in the test; a commercial developer platform |
| 3 | `https://rpc.sepolia.ethpandaops.io` | ethPandaOps (operations of the Ethereum test networks) | independent of the two above; slower; test networks only |
| 4 | `https://11155111.rpc.thirdweb.com` | thirdweb | the node the site used before (viem's default for Sepolia at the time), written out explicitly |
| 5 | `http()` without a URL | whoever viem names | last resort, see below |

How the fallback behaves (viem 2.57, `node_modules/viem/_esm/clients/transports/fallback.js`):

- Every request goes to node 1. Only if it fails does the same request go to node 2, and so on. With `rank: false`
  the order above is kept as written, and viem does not probe the nodes in the background.
- A node "fails" on a network error, an HTTP error or a timeout. An answer from the contract itself, such as a
  reverted call, is **not** a node failure: it is passed to the page as it is, without trying other nodes.
- Each node gets 5 seconds (`nodeTimeoutMs` in `src/rpcNodes.json`) and no retries of its own (`retryCount: 0`):
  the next node in the list is the retry. A node that is down usually refuses at once; the 5 seconds matter only for a node that hangs.
- When every node has failed, the fallback does not start a second round (`retryCount: 0` on the fallback). The page
  then shows its error state ("The bill could not be read … Try again"). React Query, which drives the wagmi hooks,
  still retries a failed query a few times with growing pauses before the page gives up.

**The last resort, `http()` without a URL**, is viem's own default node for Sepolia. It is there on purpose, as one
more independent chance, with a known trade-off: unlike nodes 1–4, it is chosen by the authors of viem and may change
whenever viem is updated. With viem 2.57.11 it is `https://11155111.rpc.thirdweb.com`, the same as node 4; after an
update it may become a different node, which is exactly the point of keeping it. The explicit nodes 1–4 never change
with viem: a URL given to `http(url)` is always used as written.

### Mainnet: viem's default

Mainnet still uses `http()`: the contract is not deployed there yet, so the site hardly reads it. With viem 2.57.11
that node is `https://ethereum.reth.rs/rpc`. Before a Mainnet deployment, give Mainnet its own explicit list in the
same way: test nodes as described below. ethPandaOps does not serve Mainnet; the Mainnet URLs of the other operators
differ from the Sepolia ones.

### Privacy

Any public node sees the IP address of the visitor whose browser asks it. With the fallback, nodes 2–5 see a visitor
only when the nodes before them fail, so in normal operation one operator, PublicNode, sees the requests. The site
does not use the private relay 1RPC, which claims not to keep any data or metadata
([docs](https://docs.1rpc.io/web3-relay/zero-tracking)), because it was three to ten times slower in the test. If
visitor privacy becomes more important than speed, put `https://1rpc.io/sepolia` first.

### How the list was chosen (test of 2026-10-29)

From a browser on bills-of-exchange.com (so that the nodes' CORS rules were tested as well), each node was sent the
call the site makes, `DESCRIPTION()` on the demo contract, three times. Times in milliseconds; the first request also
opens the connection.

| Node | Result | ms |
|---|---|---|
| `ethereum-sepolia-rpc.publicnode.com` | works | 398 / 84 / 91 |
| `sepolia.gateway.tenderly.co` | works | 224 / 73 / 76 |
| `rpc.sepolia.ethpandaops.io` | works | 515 / 150 / 537 |
| `11155111.rpc.thirdweb.com` | works | 333 / 234 / 389 |
| `1rpc.io/sepolia` | works, slow | 1847 / 822 / 919 |
| `sepolia.drpc.org` | refused: "chain is not available on free plan" | — |
| `rpc.sepolia.org` | no answer within 8 s | — |
| `eth-sepolia.public.blastapi.io` | not reachable from a browser | — |

### Checking the nodes

Public nodes come and go, so they are checked automatically: the GitHub Actions workflow
`.github/workflows/check-rpc-nodes.yml` runs `scripts/check-rpc-nodes.mjs` on the 1st of every month, and on demand
("Run workflow" in the repository's Actions tab). Locally: `node website/scripts/check-rpc-nodes.mjs` (no
dependencies).

For every node in `src/rpcNodes.json` the script checks that it

1. serves the expected chain (`eth_chainId`);
2. lets a browser on bills-of-exchange.com call it (the CORS preflight). On a server nothing enforces this, so a
   node can pass every server-side test and still fail for every visitor; the script asks for it explicitly;
3. answers the site's own read, `DESCRIPTION()` on the deployed contract (`eth_blockNumber` on a chain without a
   deployment), at least 4 times out of 5, within `nodeTimeoutMs` each time.

It writes a table (chain, CORS, reads, median response time) to the run's summary page and fails the run if any node
fails. GitHub then sends a notification of the failed run; for scheduled runs, by GitHub's rules, to the user who last
changed the `cron` line of the workflow.

**What to do with the results.** The run only reports; a person decides:

- **A node fails.** Look at the "Problems" list under the table. A single bad month can be chance: run the workflow
  again. If the node keeps failing, move it down or replace it in `src/rpcNodes.json` (test a candidate by adding it
  and running the workflow), then rebuild and publish the site.
- **All nodes pass.** Leave the order alone. It is not a ranking by speed: PublicNode is first partly for privacy and
  ethPandaOps is there for independence from the commercial operators. The medians are measured from GitHub's
  servers, mostly in the US, not from where the visitors are, so a difference of tens of milliseconds means nothing;
  speed only decides between otherwise equal nodes.

The last resort, viem's default node, is not checked: it is not in the list, and the site does not choose it.

GitHub disables scheduled workflows in a public repository after 60 days without activity in it. If the repository
goes quiet, check the Actions tab and re-enable the workflow there.

## Conventions

- **Amounts.** One smallest unit of the token is one bill; a bill is worth 10^-decimals of the currency
  (specification §3.3). The site reads `decimals()` from the contract together with the terms of the bill
  (`useBillTerms`) and offers it as `useBillDenomination()`: the currency symbol and the decimals. Every sum shown
  and every face value typed goes through it (`formatBillsSum`, `parseAmount`, `amountText`), so a contract with
  other decimals needs no change on the site. `TOKEN_DECIMALS` in `src/constants.ts` is left only for the old
  `/manage` components. Convert with viem's `parseUnits` / `formatUnits` and keep amounts as `bigint`; never
  multiply floats (`0.29 * 100 === 28.999999999999996`).
- **Rendering the bill.** Whatever shows the terms of the bill must read them from the contract, never keep a copy.
  The contract constants it relies on are a stable interface: specification §3.6
  ([`BillOfExchange_Specification.v.0.1.0.md`](../smart-contracts/contracts/BillOfExchange_Specification.v.0.1.0.md)).
  The only exceptions are field labels ("The drawer") and the two owner-approved legal labels marked
  `OWNER_APPROVED_…` in `Bill.tsx`.
- **One chain per page.** Everything a page shows about the contract comes from `useDisplayedContract`: the wallet's
  chain if supported, else the default chain. Never resolve the chain or the address anywhere else.
- **Links** are built in `src/components/contracts/contractLinks.ts`, never by hand:
  - the contract itself → Sourcify (`contractUrl`): verified source, with links on to Etherscan and Blockscout;
  - the current value of a contract field → Blockscout's Read/Write tab with the getter's selector in the fragment
    (`contractFieldUrl`): Blockscout opens that method and reads it; Sourcify cannot read values;
  - accounts and transactions → `defaultBlockchainExplorer` in `src/constants.ts` (currently Blockscout): Sourcify
    has no pages for them;
  - lists of verified source code (Sourcify, Etherscan, Blockscout) → `verifiedSourceLinks`.
- **The bill's layout.** `Bill.module.css` draws a 1100 px design scaled to the container (`--px` is one design
  pixel); at 899 px and narrower the bill is laid out vertically. The breakpoint is also in `Bill.tsx`, which sizes the
  guilloche frame: change both together.
- **Fonts** are self-hosted from `@fontsource` packages: no request to a font service. EB Garamond has no ₪ sign, so
  the font stack falls back to Frank Ruhl Libre for that glyph.
- **Permissions.** The site holds no secrets and enforces nothing: who may draw or accept bills is enforced by the
  contract. Interface checks only spare users failing transactions.

## The holder's page ("My bills")

`/wallet/` is the page of the holder (bearer) of accepted bills. In order:

- **Gate** (`WalletGate.tsx`). No wallet connected → a "Connect your wallet" panel. A wallet on a network without
  the contract → "Switch to Sepolia". Only a wallet on the bills' network sees the content, so no action can be sent to
  a network where the contract does not exist (there its address is the zero address, and a transfer "to" it would
  succeed without doing anything).
- **Holdings**: the number of accepted bills, their face value, and who is liable on them (`DRAWEE_NAME` from the
  contract); unaccepted bills only if the holder has any. Refreshed every 15 seconds, and at once after the holder's
  own transfer. Buttons: Send, Receive, Add to MetaMask (`wallet_watchAsset`).
- **Send** (`SendPanel.tsx`, built on `BillsActionForm`, like every action on the issuance page): enter (amount as face value or as a number of bills, "Max", recipient) → review (summary, and a note that
  the transfer is final) → progress (confirm in the wallet → submitted → **confirmed in block N** or **failed**). The
  outcome comes from the transaction receipt, not from the wallet's "submitted": only a receipt says whether the
  transfer happened. The receipt is awaited with viem's `waitForTransactionReceipt`, not wagmi's
  `useWaitForTransactionReceipt`: wagmi's throws on a reverted transaction instead of returning its receipt, and
  the page would show a vague error after several seconds of retries instead of "failed in block N". Deliberately absent, for the demonstration: checks against the balance, the holder's own
  address or the contract's address (a failing transfer shows how a failure looks).
- **Receive**: the holder's address as text, as a QR code (`qrcode.react`) and through the system share sheet.
- **Recent transfers**: the last five, from Blockscout's API (an indexer, so it works however old the contract is),
  with links to the full history on Blockscout and Etherscan. Acceptance moves no tokens and emits no `Transfer`
  event, so it does not appear here.
- **Verify another holder** and **About this contract**: collapsed.

## The drawer's and the drawee's page ("Issue and accept")

`/issue/` shows how a bill comes into being. It is public and in the menu, because its first readers are partners
watching a demonstration; the contract, not the page, decides who may act.

- **The parties** (no wallet needed): the drawer and the drawee as recorded in the contract (`DRAWER_NAME`,
  `DRAWEE_NAME`, their addresses), what each holds in each ledger, and the registry totals (`RegistrySummary`, as on
  the home page). When the two addresses are the same, as in the demonstration deployment, the page says so and
  cites BEA 1882 s.5(2).
- **Gate**: the same `WalletGate` as "My bills", with its own prompt.
- **Step 1, Draw** (`draw(amount)`): shown as a form only to the drawer's address.
- **Step 2, Deliver to the drawee** (`transferOfUnaccepted(drawee, amount)`): the recipient is always the drawee, the
  path the model intends for unaccepted bills; the contract itself would accept any recipient. When drawer and drawee
  are the same address, the step explains that there is nothing to deliver.
- **Step 3, Accept** (`acceptOn(holder, amount)`): shown as a form only to the drawee's address. The holder defaults
  to the drawee; another address may be entered, because the contract lets the drawee accept bills held elsewhere.
  `acceptOn` is used rather than `accept`: `accept(amount)` is `acceptOn(msg.sender, amount)`, so one call covers both.
- Every step that the connected wallet cannot take says which address can, instead of disappearing: a visitor sees the
  whole procedure. After any transaction is in a block, all contract reads on the page are refreshed.

## Hidden pages

`/playground` is a developer tool. It is not linked from the menu, it is excluded from the sitemap
(`sitemap.ignorePatterns` in `docusaurus.config.ts`) and asks search engines not to index it. This hides the page;
it does not restrict access: anyone who knows the URL can open it, which is harmless for the reason above.

## Build notes

Wallet libraries pulled in by wagmi import optional packages needed only by features this site never uses
(`pino-pretty`; `@x402/*` from `@coinbase/cdp-sdk`). The bundler fails on such imports when the packages are not
installed, so `docusaurus.config.ts` resolves them to an empty module (`UNUSED_OPTIONAL_DEPENDENCIES`). If a
dependency update brings a new "Module not found" error from such a library, check that the import is reachable only
from an unused feature, then add the package to that list.

## Publishing

The site is served by GitHub Pages from the committed `website/build` directory: the workflow
`.github/workflows/static.yml` runs on every push to `master` and uploads that directory without building anything.

`git-push.sh` in the repository root does the whole cycle: it builds the site (which syncs the contract data first),
commits `website/build` and pushes to GitHub. If the build fails, it stops before committing or pushing.

Consequence: a push without a fresh build republishes the previous build. Run `git-push.sh`, or `npm run build`
and commit `website/build`, whenever a change should reach the live site.

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `wagmi: command not found` | the wagmi CLI is a local dependency: run it through `npm run contracts:sync` or `npx wagmi` |
| `Deployment record … has missing or invalid fields` | a file in `smart-contracts/deployments/` is malformed (for example, has no `abi`); fix or delete it |
| `the latest deployments have different ABIs` | two chains run different contract versions; see "How the site finds the contract" |
| `Module not found` inside a wallet library | see Build notes |
