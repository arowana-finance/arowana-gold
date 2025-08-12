// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

/// @dev This also inherits Initializable, ContextUpgradeable
abstract contract Ownable is OwnableUpgradeable {
    function _checkOwner() internal view virtual override {
        address _owner = owner();

        if (_owner != address(0) && _owner != msg.sender) {
            revert OwnableUnauthorizedAccount(msg.sender);
        }
    }
}
