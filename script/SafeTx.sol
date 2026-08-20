// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Script } from "forge-std/Script.sol";

interface ISafe {
    function nonce() external view returns (uint256);
    function getTransactionHash(
        address to,
        uint256 value,
        bytes calldata data,
        uint8 operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address refundReceiver,
        uint256 _nonce
    ) external view returns (bytes32);
    function approveHash(bytes32 hashToApprove) external;
    function execTransaction(
        address to,
        uint256 value,
        bytes calldata data,
        uint8 operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes calldata signatures
    ) external payable returns (bool success);
}

/// @title SafeScript
/// @notice Forge-native Safe multisig execution — replaces the cast-based step*.sh flow.
///         Each owner key broadcasts `approveHash`, then one broadcasts `execTransaction`
///         with approved-hash signatures (r = owner address, s = 0, v = 1) sorted by
///         signer address ascending, as the Safe contract requires.
abstract contract SafeScript is Script {
    /// @dev Executes `to.call(data)` through `safe` using `pks` owner keys (>= threshold).
    function _safeExec(address safe, address to, bytes memory data, uint256[] memory pks) internal {
        bytes32 h = ISafe(safe).getTransactionHash(
            to, 0, data, 0, 0, 0, 0, address(0), address(0), ISafe(safe).nonce()
        );

        address[] memory owners = new address[](pks.length);
        for (uint256 i; i < pks.length; ++i) {
            owners[i] = vm.addr(pks[i]);
            vm.startBroadcast(pks[i]);
            ISafe(safe).approveHash(h);
            vm.stopBroadcast();
        }

        // insertion sort ascending (n <= threshold, tiny)
        for (uint256 i = 1; i < owners.length; ++i) {
            address key = owners[i];
            uint256 j = i;
            while (j > 0 && owners[j - 1] > key) {
                owners[j] = owners[j - 1];
                --j;
            }
            owners[j] = key;
        }

        bytes memory sigs;
        for (uint256 i; i < owners.length; ++i) {
            sigs = abi.encodePacked(sigs, bytes32(uint256(uint160(owners[i]))), bytes32(0), uint8(1));
        }

        vm.startBroadcast(pks[0]);
        ISafe(safe).execTransaction(to, 0, data, 0, 0, 0, 0, address(0), payable(address(0)), sigs);
        vm.stopBroadcast();
    }

    /// @dev Owner keys from env SAFE_PK1..3 (owner Safe threshold = 3).
    function _safePks() internal view returns (uint256[] memory pks) {
        pks = new uint256[](3);
        pks[0] = vm.envUint("SAFE_PK1");
        pks[1] = vm.envUint("SAFE_PK2");
        pks[2] = vm.envUint("SAFE_PK3");
    }
}
