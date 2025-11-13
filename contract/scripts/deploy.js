const hre = require("hardhat");

async function main() {
  console.log("Deploying CredentialsRegistry contract...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH/MATIC");
  
  // Deploy contract
  const CredentialsRegistry = await hre.ethers.getContractFactory("CredentialsRegistry");
  const contract = await CredentialsRegistry.deploy();
  
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  console.log("\n✅ CredentialsRegistry deployed to:", contractAddress);
  console.log("\n📝 Update your frontend/.env with:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
  
  console.log("\n🔍 Verify contract with:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress}`);
  
  // Wait for a few block confirmations
  console.log("\n⏳ Waiting for block confirmations...");
  await contract.deploymentTransaction().wait(5);
  console.log("✅ Confirmed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
