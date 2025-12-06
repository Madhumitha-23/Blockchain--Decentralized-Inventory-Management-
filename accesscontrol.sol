// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AccessControl {
    address public admin;
    mapping(address => bool) public warehouseManagers;

    event WarehouseManagerAdded(address indexed manager);
    event WarehouseManagerRemoved(address indexed manager);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    constructor() {
        admin = msg.sender; // Set the contract deployer as the admin
    }

    function addWarehouseManager(address _manager) public onlyAdmin {
        warehouseManagers[_manager] = true;
        emit WarehouseManagerAdded(_manager);
    }

    function removeWarehouseManager(address _manager) public onlyAdmin {
        warehouseManagers[_manager] = false;
        emit WarehouseManagerRemoved(_manager);
    }

    function isWarehouseManager(address _manager) public view returns (bool) {
        return warehouseManagers[_manager];
    }
}