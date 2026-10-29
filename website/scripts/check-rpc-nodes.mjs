// Checks the blockchain nodes the website reads from (src/rpcNodes.json). A node passes when it
//   - serves the expected chain,
//   - lets a browser on the site call it (CORS): without that it fails for every visitor, even
//     though a server-side test would succeed,
//   - answers the read the site itself makes, at least REQUIRED_SUCCESSES times out of ATTEMPTS.
// Prints a table (also to the GitHub Actions job summary) and exits with code 1 if any node fails.
// It never reorders the list: the order is a decision for a person (website/README.md).
//
// Usage: node website/scripts/check-rpc-nodes.mjs   (no dependencies: Node.js 18+)

import {appendFileSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const sourceDirectory = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const {nodeTimeoutMs, networks} = JSON.parse(readFileSync(join(sourceDirectory, 'rpcNodes.json'), 'utf8'));
const deployments = JSON.parse(readFileSync(join(sourceDirectory, 'deployments.json'), 'utf8'));

const SITE_ORIGIN = 'https://bills-of-exchange.com';
const ATTEMPTS = 5;
// One dropped request out of five is tolerated: public nodes are not perfect, and a red run should
// mean a node that is really unusable, not a single hiccup.
const REQUIRED_SUCCESSES = 4;
// DESCRIPTION(), the getter the site reads for the bill; selector as listed by Blockscout.
const DESCRIPTION_SELECTOR = '0xf1ae8856';

async function rpc(url, method, params) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json', origin: SITE_ORIGIN},
        body: JSON.stringify({jsonrpc: '2.0', id: 1, method, params}),
        signal: AbortSignal.timeout(nodeTimeoutMs),
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const answer = await response.json();
    if (answer.error) {
        throw new Error(answer.error.message);
    }
    return answer.result;
}

/** Asks the node, as a browser would before a cross-site POST, whether the site may call it. */
async function allowsSiteOrigin(url) {
    const response = await fetch(url, {
        method: 'OPTIONS',
        headers: {
            origin: SITE_ORIGIN,
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
        },
        signal: AbortSignal.timeout(nodeTimeoutMs),
    });
    const allowedOrigin = response.headers.get('access-control-allow-origin');
    return allowedOrigin === '*' || allowedOrigin === SITE_ORIGIN;
}

/** The site's read: DESCRIPTION() on the deployed contract, or the block number if none is deployed. */
function siteRead(chainId) {
    const contractAddress = deployments.BillsOfExchange?.chains?.[chainId]?.address;
    if (contractAddress === undefined) {
        return {method: 'eth_blockNumber', params: [], isValid: (result) => /^0x[0-9a-f]+$/i.test(result)};
    }
    return {
        method: 'eth_call',
        params: [{to: contractAddress, data: DESCRIPTION_SELECTOR}, 'latest'],
        // An ABI-encoded non-empty string is far longer than "0x": a short answer means no contract there.
        isValid: (result) => typeof result === 'string' && result.length > 130,
    };
}

async function checkNode(node, chainId) {
    const report = {...node, chain: '—', cors: '—', reads: `0/${ATTEMPTS}`, medianMs: '—', problems: []};
    try {
        const servedChainId = Number(await rpc(node.url, 'eth_chainId', []));
        report.chain = servedChainId === chainId ? 'ok' : `wrong (${servedChainId})`;
        if (servedChainId !== chainId) report.problems.push(`serves chain ${servedChainId}`);
    } catch (error) {
        report.chain = 'no answer';
        report.problems.push(`eth_chainId: ${error.message}`);
    }
    try {
        report.cors = (await allowsSiteOrigin(node.url)) ? 'ok' : 'blocked';
        if (report.cors === 'blocked') report.problems.push('does not allow calls from the site (CORS)');
    } catch (error) {
        report.cors = 'no answer';
        report.problems.push(`CORS check: ${error.message}`);
    }

    const read = siteRead(chainId);
    const timings = [];
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
        const started = performance.now();
        try {
            const result = await rpc(node.url, read.method, read.params);
            if (!read.isValid(result)) throw new Error(`unexpected answer ${String(result).slice(0, 20)}`);
            timings.push(performance.now() - started);
        } catch (error) {
            report.problems.push(`${read.method} #${attempt}: ${error.message}`);
        }
    }
    timings.sort((a, b) => a - b);
    report.reads = `${timings.length}/${ATTEMPTS}`;
    if (timings.length > 0) report.medianMs = Math.round(timings[Math.floor(timings.length / 2)]);

    report.passed = report.chain === 'ok' && report.cors === 'ok' && timings.length >= REQUIRED_SUCCESSES;
    return report;
}

const lines = [`# Blockchain nodes of the website (${new Date().toISOString().slice(0, 10)})`, ''];
let failures = 0;
for (const [networkName, {chainId, nodes}] of Object.entries(networks)) {
    lines.push(`## ${networkName} (chain ${chainId})`, '',
        '| # | Node | Operator | Chain | Browser access (CORS) | Reads | Median, ms | Result |',
        '|---|---|---|---|---|---|---|---|');
    const problems = [];
    for (const [index, node] of nodes.entries()) {
        const report = await checkNode(node, chainId);
        if (!report.passed) failures++;
        lines.push(`| ${index + 1} | \`${report.url}\` | ${report.operator} | ${report.chain} | ${report.cors} | ` +
            `${report.reads} | ${report.medianMs} | ${report.passed ? 'pass' : '**FAIL**'} |`);
        problems.push(...report.problems.map((problem) => `- \`${report.url}\`: ${problem}`));
    }
    lines.push('', ...(problems.length > 0 ? ['Problems:', '', ...problems] : ['No problems.']), '');
}
lines.push(failures === 0
    ? 'All nodes pass. Their order is unchanged; review it only if the medians differ a lot.'
    : `${failures} node(s) failed: replace or reorder them in website/src/rpcNodes.json (see website/README.md).`);

const report = lines.join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
}
process.exitCode = failures === 0 ? 0 : 1;
