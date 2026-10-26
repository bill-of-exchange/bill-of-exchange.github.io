#!/usr/bin/env bash
# Regenerates src/generated.ts (typed ABI and React hooks) from the Hardhat artifacts.
#
# `wagmi` is a local dev dependency, hoisted to the repository root's node_modules,
# so it is not on PATH: call it through npx, which finds it there.
# wagmi overwrites the output file itself; deleting the file beforehand would only
# leave the site without it whenever generation fails.
set -euo pipefail
cd "$(dirname "$0")"
npx wagmi generate --config ./src/wagmi.cli.config.ts
