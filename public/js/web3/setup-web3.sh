#!/bin/bash
echo "WEBTERMUX OMNI V33 - Genius Web3 Suite Setup"
pkg install nodejs-lts -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox \
    @openzeppelin/contracts @openzeppelin/contracts-upgradeable \
    @openzeppelin/hardhat-upgrades \
    @nomicfoundation/hardhat-verify ethers

npx hardhat

echo "Genius suite ready! Run: npx hardhat run scripts/deploy-all.js --network sepolia"
echo "Get API keys from Alchemy/Infura + Etherscan for verification."
