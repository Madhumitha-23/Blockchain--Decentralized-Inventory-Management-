// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BaseInventoryManagement {
    struct InventoryItem {
        uint256 id;
        string name;
        uint256 quantity;
        uint256 price; // Price in wei
    }

    struct Warehouse {
        string name;
        string location;
        mapping(uint256 => InventoryItem) items; // Mapping for inventory items
        uint256 itemCount; // Count of items in the warehouse
    }

    mapping(address => Warehouse) public warehouses; // Mapping of warehouses by address
    address[] public warehouseAddresses; // List of warehouse addresses

    event ItemAdded(address indexed warehouse, uint256 itemId, string itemName, uint256 quantity, uint256 price);
    event ItemUpdated(address indexed warehouse, uint256 itemId, uint256 newQuantity);
    event ItemRemoved(address indexed warehouse, uint256 itemId);

    modifier onlyWarehouse() {
        require(bytes(warehouses[msg.sender].name).length > 0, "Only registered warehouses can perform this action.");
        _;
    }

    modifier onlyExistingWarehouse(address _warehouse) {
        require(bytes(warehouses[_warehouse].name).length > 0, "Warehouse does not exist.");
        _;
    }

    function registerWarehouse(string memory _name, string memory _location) public {
        require(bytes(warehouses[msg.sender].name).length == 0, "Warehouse already registered.");
        Warehouse storage warehouse = warehouses[msg.sender];
        warehouse.name = _name;
        warehouse.location = _location;
        warehouse.itemCount = 0; // Initialize item count
        warehouseAddresses.push(msg.sender); // Add warehouse address to the list
    }

    function addItem(string memory _name, uint256 _quantity, uint256 _price) public onlyWarehouse {
        Warehouse storage warehouse = warehouses[msg.sender];
        uint256 itemId = warehouse.itemCount++; // Increment item count and get the new item ID
        warehouse.items[itemId] = InventoryItem(itemId, _name, _quantity, _price); // Add item to the warehouse
        emit ItemAdded(msg.sender, itemId, _name, _quantity, _price); // Emit event
    }

    function updateItem(uint256 _itemId, uint256 _newQuantity) public onlyWarehouse {
        Warehouse storage warehouse = warehouses[msg.sender];
        require(_itemId < warehouse.itemCount, "Item does not exist."); // Check if item exists
        require(_newQuantity > 0, "Quantity must be greater than zero."); // Ensure new quantity is valid
        warehouse.items[_itemId].quantity = _newQuantity; // Update item quantity
        emit ItemUpdated(msg.sender, _itemId, _newQuantity); // Emit event
    }

    function removeItem(uint256 _itemId) public onlyWarehouse {
        Warehouse storage warehouse = warehouses[msg.sender];
        require(_itemId < warehouse.itemCount, "Item does not exist."); // Check if item exists
        delete warehouse.items[_itemId]; // Remove item from the warehouse
        emit ItemRemoved(msg.sender, _itemId); // Emit event
    }

    function getItem(address _warehouse, uint256 _itemId) public view onlyExistingWarehouse(_warehouse) returns (InventoryItem memory) {
        require(_itemId < warehouses[_warehouse].itemCount, "Item does not exist."); // Check if item exists
        return warehouses[_warehouse].items[_itemId]; // Return item details
    }

    function getWarehouseInfo(address _warehouse) public view onlyExistingWarehouse(_warehouse) returns (string memory, string memory, uint256) {
        Warehouse storage warehouse = warehouses[_warehouse];
        return (warehouse.name, warehouse.location, warehouse.itemCount); // Return warehouse details
    }

    function getAllWarehouses() public view returns (address[] memory) {
        return warehouseAddresses; // Return list of all warehouse addresses
    }
}