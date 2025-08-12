// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IInitializableProxy {
    function initializeProxy(
        string memory _description,
        address newAdmin,
        address newImplementation,
        bytes memory data
    ) external payable;

    function changeAdmin(address newAdmin) external;

    function upgradeToAndCall(address newImplementation, bytes memory data) external payable;

    function admin() external view returns (address);

    function implementation() external view returns (address);

    function proxyDescription() external view returns (bytes memory);
}
