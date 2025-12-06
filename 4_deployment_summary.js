const AccessControl = artifacts.require("AccessControl");
const BaseInventoryManagement = artifacts.require("BaseInventoryManagement");
const ComplexInventoryManagement = artifacts.require("ComplexInventoryManagement");

module.exports = async function(deployer, network, accounts) {
  console.log("\n----- DEPLOYMENT SUMMARY -----");
  
  try {
    // Check if contracts were deployed
    const accessControlDeployed = await AccessControl.deployed().then(() => true).catch(() => false);
    const baseInventoryDeployed = await BaseInventoryManagement.deployed().then(() => true).catch(() => false);
    const complexInventoryDeployed = await ComplexInventoryManagement.deployed().then(() => true).catch(() => false);
    
    console.log("Contract Deployment Status:");
    console.log(`- AccessControl: ${accessControlDeployed ? '✅ Deployed' : '❌ Not deployed'}`);
    console.log(`- BaseInventoryManagement: ${baseInventoryDeployed ? '✅ Deployed' : '❌ Not deployed'}`);
    console.log(`- ComplexInventoryManagement: ${complexInventoryDeployed ? '✅ Deployed' : '❌ Not deployed'}`);
    
    console.log("\nContract Addresses:");
    if (accessControlDeployed) console.log(`- AccessControl: ${AccessControl.address}`);
    if (baseInventoryDeployed) console.log(`- BaseInventoryManagement: ${BaseInventoryManagement.address}`);
    if (complexInventoryDeployed) console.log(`- ComplexInventoryManagement: ${ComplexInventoryManagement.address}`);
    
  } catch (error) {
    console.error("❌ Error generating deployment summary:", error.message);
  }
  
  console.log("----------------------------\n");
};