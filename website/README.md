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
| `src/pages/` | pages: `index.tsx` (home: the bill and the registry figures), `manage.tsx` (the contract cards), `playground.tsx` (hidden, see below) |
| `src/components/bill/` | the bill rendered from the contract (`Bill.tsx`), the statements recorded with it shown as contract text (`ContractTerms.tsx`), the hooks that read them (`useBillTerms.ts`), the home page showcase |
| `src/components/contracts/` | contract interface components; `BoE/` holds the BillsOfExchange cards; `useDisplayedContract.ts` decides which chain and address a page shows |
| `src/components/wagmi/` | wallet connection, chain switcher, address helpers |
| `src/components/docs/` | components used inside documentation pages |
| `src/theme/Root.tsx` | wraps the whole site in the wagmi and React Query providers |
| `src/wagmiConfig.ts` | wagmi configuration: chains, connectors, transports |
| `src/constants.ts` | site-wide constants: chains, contract addresses, explorers, decimals |
| `src/deployments.json` | **generated**: latest deployment per contract and chain |
| `src/generated.ts` | **generated**: typed ABI and React hooks bound to the contract addresses |
| `src/wagmi.cli.config.ts` | configuration of the wagmi CLI that writes `src/generated.ts` |
| `scripts/sync-deployments.mjs` | writes `src/deployments.json` |
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

## Conventions

- **Amounts.** One smallest unit of the token is one bill of 0.01 ILS; `TOKEN_DECIMALS = 2` in `src/constants.ts`
  must equal the contract's `decimals()`. Convert with viem's `parseUnits` / `formatUnits` and keep amounts as
  `bigint`; never multiply floats (`0.29 * 100 === 28.999999999999996`).
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
