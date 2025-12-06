let web3;
let account;
let baseinventorymanagementContract;
let accessControlContract;
let complexInventorymanagementContract;

// Updated paths to ABI files
const inventoryContractABIPath = "./contracts/BaseInventoryManagement.json";
const accessControlABIPath = "./contracts/AccessControl.json";
const complexInventoryABIPath = "./contracts/ComplexInventoryManagement.json";

// Contract addresses (you'll need to update these after deployment)
let baseinventoryAddress = "0x6Cf2Ccc821d7b1eFb441Ec63415679833358Fdcc";
let accessControlAddress = "0xaa314aCCD36315051a249Fa2259E36ab65Bb195B";
let complexInventoryAddress = "0x07408d0872B6D2591da796ABcc7f3Fc7faD08E51";

// Status display area
const statusArea = document.createElement('div');
statusArea.id = 'wallet-status';
statusArea.style.padding = '10px';
statusArea.style.margin = '10px 0';
statusArea.style.border = '1px solid #ccc';
statusArea.style.borderRadius = '5px';
statusArea.style.backgroundColor = '#f8f9fa';
statusArea.innerHTML = 'Waiting for MetaMask connection...';
document.body.insertBefore(statusArea, document.body.firstChild);

// Function to update wallet connection status
function updateWalletStatus(isConnected, walletAddress = '') {
    const statusArea = document.getElementById('wallet-status');
    if (isConnected) {
        statusArea.style.backgroundColor = '#d4edda';
        statusArea.style.borderColor = '#c3e6cb';
        statusArea.style.color = '#155724';
        statusArea.innerHTML = `
            <strong>✅ Connected to MetaMask</strong><br>
            <span>Wallet Address: ${walletAddress}</span>
        `;
    } else {
        statusArea.style.backgroundColor = '#f8d7da';
        statusArea.style.borderColor = '#f5c6cb';
        statusArea.style.color = '#721c24';
        statusArea.innerHTML = `
            <strong>❌ Not connected to MetaMask</strong><br>
            <span>Please connect your wallet to use this DApp</span>
        `;
    }
}

async function loadContracts() {
    try {
        // Fetch the contract ABIs
        const inventoryResponse = await fetch(inventoryContractABIPath);
        const accessControlResponse = await fetch(accessControlABIPath);
        
        const inventoryData = await inventoryResponse.json();
        const accessControlData = await accessControlResponse.json();
        
        // Get deployed network data
        const networkId = await web3.eth.net.getId();
        
        // Get contract addresses from the deployed networks
        accessControlAddress = accessControlData.networks[networkId].address;
        baseinventoryAddress = inventoryData.networks[networkId].address;
        
        // Create contract instances
        inventoryContract = new web3.eth.Contract(inventoryData.abi, baseinventoryAddress);
        accessControlContract = new web3.eth.Contract(accessControlData.abi, accessControlAddress);
        
        console.log("Contracts loaded successfully");
        showMessage("Contracts loaded successfully!", "success");
    } catch (error) {
        console.error("Error loading contracts:", error);
        showMessage("Error loading contracts: " + error.message, "error");
    }
}

window.addEventListener("load", async () => {
    if (window.ethereum) {
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            
            await loadContracts();
            
            // Update wallet status with the connected address
            updateWalletStatus(true, account);
            showMessage("Connected to MetaMask successfully!", "success");
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', function (accounts) {
                account = accounts[0];
                updateWalletStatus(true, account);
                showMessage("Account changed to: " + account, "info");
            });
            
            // Listen for network changes
            window.ethereum.on('chainChanged', function (networkId) {
                window.location.reload();
            });
            
        } catch (error) {
            updateWalletStatus(false);
            showMessage("Error connecting to MetaMask: " + error.message, "error");
        }
    } else {
        updateWalletStatus(false);
        showMessage("MetaMask not found! Please install MetaMask to use this DApp.", "error");
    }
});

function showMessage(msg, type = "success") {
    const el = document.getElementById("statusMessage");
    el.innerText = msg;
    el.className = type;
}

async function addManager() {
    const manager = document.getElementById("managerAddress").value;
    try {
        await accessControlContract.methods.addWarehouseManager(manager).send({ from: account });
        showMessage("Warehouse manager added successfully!");
    } catch (err) {
        showMessage("Error adding manager: " + err.message, "error");
    }
}

async function registerWarehouse() {
    const name = document.getElementById("warehouseName").value;
    const location = document.getElementById("warehouseLocation").value;
    try {
        await inventoryContract.methods.registerWarehouse(name, location).send({ from: account });
        showMessage("Warehouse registered successfully!");
    } catch (err) {
        showMessage("Error registering warehouse: " + err.message, "error");
    }
}

async function addItem() {
    const name = document.getElementById("itemName").value;
    const qty = parseInt(document.getElementById("itemQty").value);
    const price = web3.utils.toWei(document.getElementById("itemPrice").value, "ether"); // Convert to wei
    try {
        await inventoryContract.methods.addItem(name, qty, price).send({ from: account });
        showMessage("Item added successfully!");
    } catch (err) {
        showMessage("Error adding item: " + err.message, "error");
    }
}

async function createShipment() {
    const warehouse = document.getElementById("shipWarehouse").value;
    const itemId = parseInt(document.getElementById("shipItemId").value);
    const qty = parseInt(document.getElementById("shipQty").value);
    try {
        // Using the complex inventory contract for shipments
        const complexResponse = await fetch(complexInventoryABIPath);
        const complexData = await complexResponse.json();
        const networkId = await web3.eth.net.getId();
        complexInventoryAddress = complexData.networks[networkId].address;
        const complexContract = new web3.eth.Contract(complexData.abi, complexInventoryAddress);
        
        await complexContract.methods.createShipment(warehouse, itemId, qty).send({ from: account });
        showMessage("Shipment created successfully!");
    } catch (err) {
        showMessage("Error creating shipment: " + err.message, "error");
    }
}

async function deliverShipment() {
    const shipmentId = parseInt(document.getElementById("shipmentId").value);
    try {
        // Using the complex inventory contract for shipments
        const complexResponse = await fetch(complexInventoryABIPath);
        const complexData = await complexResponse.json();
        const networkId = await web3.eth.net.getId();
        complexInventoryAddress = complexData.networks[networkId].address;
        const complexContract = new web3.eth.Contract(complexData.abi, complexInventoryAddress);
        
        await complexContract.methods.markShipmentAsDelivered(shipmentId).send({ from: account });
        showMessage("Shipment marked as delivered successfully!");
    } catch (err) {
        showMessage("Error delivering shipment: " + err.message, "error");
    }
}