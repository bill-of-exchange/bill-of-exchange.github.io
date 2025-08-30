
## update nmv
# https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm --version
nvm install node # Install the latest available version
npm install -g npm@latest

npm init -y

mkdir -p smart-contracts && mkdir -p website

# edit root package.js :
#  "workspaces": [
#    "./smart-contracts",
#    "./website"
#  ],


cd ./smart-contracts

npx hardhat@next --init
npm install @openzeppelin/contracts

# to clean project:
#  rm -rf node_modules/ smart-contracts/ website/ package.json package-lock.json