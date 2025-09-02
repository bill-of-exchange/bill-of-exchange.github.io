
## update nmv
# https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm --version
nvm install node # Install the latest available version
npm install -g npm@latest

npm init -y

# edit root package.js :
#  "workspaces": [
#    "./smart-contracts",
#    "./website"
#  ],

## =========== Hardhat

mkdir -p smart-contracts
cd ./smart-contracts

# https://hardhat.org/docs/getting-started#installation
npx hardhat --init

# https://docs.openzeppelin.com/contracts/5.x/#hardhat_npm
npm install @openzeppelin/contracts

# to clean project:
#  rm -rf node_modules/ smart-contracts/ website/ package.json package-lock.json

## =========== Docusaurus

npx create-docusaurus@latest ./website classic --typescript
cd ./website

# https://wagmi.sh/react/getting-started#manual-installation
npm install wagmi viem@2.x @tanstack/react-query

# create Wagmi config
# https://wagmi.sh/react/getting-started#create-config
touch ./src/wagmiConfig.ts

# ======= Docusaurus swizzling
# https://docusaurus.io/docs/swizzling

## Wrapping site with <Root>
# Docusaurus allows you to wrap the entire app in a custom root component.
# Create src/theme/Root.js
# see Docusaurus docs on swizzling: https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root
# In Root.js, wrap the children with <WagmiProvider> (and a React Query provider, since Wagmi uses TanStack Query internally)
#
# npm run swizzle @docusaurus/theme-classic Root # < does not work: Root is not a theme component; it’s a special extension point in Docusaurus
#
mkdir -p ./src/theme && touch ./src/theme/Root.tsx

npm run swizzle @docusaurus/theme-classic Navbar/Content -- --wrap
npm run swizzle @docusaurus/theme-classic Footer -- --eject
