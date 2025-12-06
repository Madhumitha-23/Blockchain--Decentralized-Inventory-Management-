const ComplexInventoryManagement = artifacts.require("ComplexInventoryManagement");

module.exports = async function(deployer, network, accounts) {
  console.log("\n----- DEPLOYING COMPLEX INVENTORY CONTRACT -----");
  console.log(`Network: ${network}`);
  console.log(`Deployer account: ${accounts[0]}`);
  
  try {
    console.log("Starting ComplexInventoryManagement deployment...");
    await deployer.deploy(ComplexInventoryManagement, { gas: 5500000 }); // Explicitly set higher gas limit
    const instance = await ComplexInventoryManagement.deployed();
    console.log(`✅ ComplexInventoryManagement successfully deployed:`);
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
    console.error("❌ ComplexInventoryManagement deployment failed:");
    console.error(`   - Error: ${error.message}`);
    if (error.stack) {
      console.error("   - Stack trace:");
      console.error(error.stack);
    }
  }
  
  console.log("-----------------------------------------------\n");
};