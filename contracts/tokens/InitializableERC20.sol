// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20Upgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import { ERC20BurnableUpgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol';
import { ERC20PermitUpgradeable } from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol';

contract InitializableERC20 is ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PermitUpgradeable {

	// ============ Constants ============

	// keccak256(abi.encode(uint256(keccak256("arowana.storage.InitializableERC20")) - 1)) & ~bytes32(uint256(0xff))
	bytes32 private constant InitializableERC20StorageLocation =
		0xaac01e763ae635208a55173189c6e9a732622eeb48ac68c0b95d07c183b43200;
    
	// ============ EIP-7201 Storage ============

	/// @custom:storage-location erc7201:arowana.storage.InitializableERC20
	struct InitializableERC20Storage {
		uint8 _decimals;
	}

	// ============ Initializer ============

    function initializeToken(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 supply_
    ) public {
        __ERC20_init(name_, symbol_);
      	__ERC20Burnable_init();
        __ERC20Permit_init(name_);
        
		InitializableERC20Storage storage $ = _getInitializableERC20Storage();
		$._decimals = decimals_;

        if (supply_ != 0) {
            _mint(_msgSender(), supply_);
        }
    }

	// ============ Public Functions ============

    function decimals() public view override returns (uint8) {
		InitializableERC20Storage storage $ = _getInitializableERC20Storage();
		return $._decimals;
	}

	// ============ Private Functions ============
	function _getInitializableERC20Storage() private pure returns (InitializableERC20Storage storage $) {
		assembly {
			$.slot := InitializableERC20StorageLocation
		}
	}
}
