// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IInitializableProxy {
    function initializeProxy(address newAdmin, address newImplementation, bytes memory data) external payable;

    function changeAdmin(address newAdmin) external;

    function upgradeToAndCall(address newImplementation, bytes memory data) external payable;

    function admin() external returns (address);

    function implementation() external returns (address);
}
