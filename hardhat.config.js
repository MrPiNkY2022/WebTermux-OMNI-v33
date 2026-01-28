require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 1000000 },
      viaIR: true
    }
  },
  networks: {
    hardhat: { chainId: 31337 },
    sepolia: { url: "YOUR_ALCHEMY_SEPOLIA_URL", accounts: ["YOUR_PRIVATE_KEY"] },
    base: { url: "https://mainnet.base.org", accounts: ["YOUR_PRIVATE_KEY"] },
    arbitrum: { url: "https://arb1.arbitrum.io/rpc", accounts: ["YOUR_PRIVATE_KEY"] }
  },
  etherscan: { apiKey: { sepolia: "YOUR_ETHERSCAN_KEY" } },
  gasReporter: { enabled: true }
};
