
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

mkdir -p smart-contracts && cd "$_" || exit

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
# https://www.npmjs.com/package/wagmi
# https://www.npmjs.com/package/viem
npm install wagmi viem@2.x @tanstack/react-query

# if "Module not found: Error: Can't resolve '@react-native-async-storage/async-storage'
npm install @react-native-async-storage/async-storage

# create Wagmi config
# https://wagmi.sh/react/getting-started#create-config
# https://wagmi.sh/react/typescript
touch ./src/wagmiConfig.ts

# Wagmi CLI
# https://wagmi.sh/cli/why
# https://wagmi.sh/cli/installation
npm install --save-dev @wagmi/cli

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

# Fontawesome
# see: https://docusaurus.community/knowledge/design/icons/fontawesome/
#
# https://fontawesome.com/docs/web/use-with/react/
# https://fontawesome.com/docs/web/use-with/react/style
#
# https://fontawesome.com/search?f=classic&s=solid&ic=free&o=r (1,407 Icons)
# https://fontawesome.com/search?f=classic&s=regular&ic=free&o=r (169 icons)
# https://fontawesome.com/search?p=3&ip=brands&ic=free&o=r (513 Icons)
npm install --save @fortawesome/react-fontawesome@latest @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons

# clsx (included in Docusaurus)
# https://www.npmjs.com/package/clsx
# https://github.com/lukeed/clsx
npm install --save clsx

# react-currency-input-field
# https://www.npmjs.com/package/react-currency-input-field
npm install --save react-currency-input-field
