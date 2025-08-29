
npm init -y

mkdir -p smart-contracts
mkdir -p website

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