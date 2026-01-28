async function main() {
  const [deployer] = await ethers.getSigners();

  // Deploy Token (upgradable)
  const Token = await ethers.getContractFactory("OmniToken");
  const token = await upgrades.deployProxy(Token, [1000000], { initializer: "initialize" });
  await token.waitForDeployment();
  console.log("OmniToken deployed to:", await token.getAddress());

  // Deploy NFT
  const NFT = await ethers.getContractFactory("OmniNFT");
  const nft = await upgrades.deployProxy(NFT, [], { initializer: "initialize" });
  console.log("OmniNFT deployed to:", await nft.getAddress());

  // Deploy Timelock
  const Timelock = await ethers.getContractFactory("@openzeppelin/contracts/governance/TimelockController.sol:TimelockController");
  const timelock = await Timelock.deploy(3600, [deployer.address], [deployer.address], deployer.address);
  console.log("Timelock deployed to:", await timelock.getAddress());

  // Deploy Governor
  const Governor = await ethers.getContractFactory("OmniGovernor");
  const governor = await Governor.deploy(await token.getAddress(), await timelock.getAddress());
  console.log("OmniGovernor deployed to:", await governor.getAddress());

  // Deploy Staking
  const Staking = await ethers.getContractFactory("StakingRewards");
  const staking = await Staking.deploy(await token.getAddress(), await token.getAddress());
  console.log("StakingRewards deployed to:", await staking.getAddress());
}

main();
