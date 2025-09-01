
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


