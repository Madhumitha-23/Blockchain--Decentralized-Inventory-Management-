// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./baseinventorymanagement.sol"; // Import the BaseInventoryManagement contract

contract ComplexInventoryManagement is BaseInventoryManagement {
    struct Shipment {
        uint256 id;
        address warehouse;
        uint256 itemId;
        uint256 quantity;
        bool isDelivered;
    }

    mapping(uint256 => Shipment) public shipments;
    uint256 public shipmentCount;

    event ShipmentCreated(uint256 indexed shipmentId, address indexed warehouse, uint256 itemId, uint256 quantity);
    event ShipmentDelivered(uint256 indexed shipmentId);

    function createShipment(address _warehouse, uint256 _itemId, uint256 _quantity) public onlyWarehouse {
        require(_quantity > 0, "Quantity must be greater than zero.");
        require(warehouses[_warehouse].items[_itemId].quantity >= _quantity, "Not enough items in stock.");

        uint256 shipmentId = shipmentCount++;
        shipments[shipmentId] = Shipment(shipmentId, _warehouse, _itemId, _quantity, false);
        emit ShipmentCreated(shipmentId, _warehouse, _itemId, _quantity);
    }

    function markShipmentAsDelivered(uint256 _shipmentId) public onlyWarehouse {
        Shipment storage shipment = shipments[_shipmentId];
        require(!shipment.isDelivered, "Shipment already delivered.");
        shipment.isDelivered = true;

        // Update inventory
        warehouses[shipment.warehouse].items[shipment.itemId].quantity -= shipment.quantity;
        emit ShipmentDelivered(_shipmentId);
    }

    function returnItem(uint256 _itemId, uint256 _quantity) public onlyWarehouse {
        require(_quantity > 0, "Quantity must be greater than zero.");
        warehouses[msg.sender].items[_itemId].quantity += _quantity;
    }
}