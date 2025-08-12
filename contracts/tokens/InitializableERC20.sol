// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20Upgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import { ERC20BurnableUpgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol';
import { ERC20PermitUpgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol';

contract InitializableERC20 is ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PermitUpgradeable {
    uint8 private _decimals;

    function initializeToken(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 supply_
    ) public initializer {
        __ERC20_init(name_, symbol_);
        __ERC20Permit_init(name_);
        _decimals = decimals_;

        if (supply_ != 0) {
            _mint(msg.sender, supply_);
        }
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
