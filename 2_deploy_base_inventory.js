const BaseInventoryManagement = artifacts.require("BaseInventoryManagement");

module.exports = async function(deployer, network, accounts) {
  console.log("\n----- DEPLOYING BASE INVENTORY CONTRACT -----");
  console.log(`Network: ${network}`);
  console.log(`Deployer account: ${accounts[0]}`);
  
  try {
    console.log("Starting BaseInventoryManagement deployment...");
    await deployer.deploy(BaseInventoryManagement, { gas: 4500000 }); // Explicitly set higher gas limit
    const instance = await BaseInventoryManagement.deployed();
    console.log(`✅ BaseInventoryManagement successfully deployed:`);
    console.log(`   - Address: ${instance.address}`);
    console.log(`   - Transaction Hash: ${instance.transactionHash}`);
    
    // Verify contract code exists on-chain
    const code = await web3.eth.getCode(instance.address);
    if (code !== '0x' && code !== '0x0') {
      console.log(`   - Status: Contract verified on-chain ✓`);
    } else {
      console.log(`   - Status: ⚠️ WARNING: Contract code not found!`);
    }
  } catch (error) {
    console.error("❌ BaseInventoryManagement deployment failed:");
    console.error(`   - Error: ${error.message}`);
    if (error.stack) {
      console.error("   - Stack trace:");
      console.error(error.stack);
    }
  }
  
  console.log("--------------------------------------------\n");
};