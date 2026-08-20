// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { InitializableProxy } from "./InitializableProxy.sol";

/// @title ProxyFactory
/// @notice Deploys an {InitializableProxy} AND initializes it (admin + implementation)
///         in a SINGLE transaction via CREATE2. This closes the front-running window
///         in {InitializableProxy.initializeProxy}, which is unprotected: a proxy
///         deployed and initialized in two separate transactions can be seized by an
///         attacker who calls `initializeProxy` first and sets themselves as admin.
///         Going through this factory, the proxy is never observable on-chain in an
///         uninitialized state, so no front-run is possible.
contract ProxyFactory {
    event ProxyDeployed(address indexed proxy, address indexed admin, address indexed implementation);

    /// @dev Defensive post-condition failure: the deployed proxy's admin is not the
    ///      expected address (should be unreachable given atomic init).
    error UnexpectedAdmin(address got, address expected);

    /// @notice Atomically deploy a proxy and initialize it.
    /// @param salt CREATE2 salt for a deterministic proxy address.
    /// @param description Human-readable proxy description.
    /// @param admin ERC-1967 admin to set (use a multisig / timelock).
    /// @param implementation Initial implementation contract.
    /// @param initData Initializer calldata delegatecalled into `implementation`.
    function deployProxy(
        bytes32 salt,
        string calldata description,
        address admin,
        address implementation,
        bytes calldata initData
    ) external returns (address proxy) {
        // Namespace the CREATE2 salt by the caller so the deterministic address
        // belongs exclusively to this deployer. Without this, an attacker who knows
        // the (predictable) salt could pre-occupy the address with their own admin
        // and force the legitimate deploy to revert / mislead a predict()-based flow.
        bytes32 actualSalt = keccak256(abi.encode(msg.sender, salt));
        InitializableProxy p = new InitializableProxy{ salt: actualSalt }();
        // Same transaction as the CREATE2 above: the uninitialized proxy is never
        // exposed, so initializeProxy cannot be front-run.
        p.initializeProxy(description, admin, implementation, initData);

        if (p.admin() != admin) revert UnexpectedAdmin(p.admin(), admin);

        proxy = address(p);
        emit ProxyDeployed(proxy, admin, implementation);
    }

    /// @notice Predict the CREATE2 address for a given deployer + salt. The salt is
    ///         namespaced by `deployer` exactly as in {deployProxy}.
    function predict(address deployer, bytes32 salt) external view returns (address) {
        bytes32 actualSalt = keccak256(abi.encode(deployer, salt));
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), actualSalt, keccak256(type(InitializableProxy).creationCode))
        );
        return address(uint160(uint256(hash)));
    }
}
