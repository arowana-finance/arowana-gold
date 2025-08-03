// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { EnumerableSet } from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { ERC20Burnable } from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import { ERC20Permit } from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';

/// @title Arowana Gold Token
/// @notice ERC20 pegged with gold reserves
/// @dev Uses standard OpenZeppelin ERC20 implementation
contract GoldToken is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private _minters;

    event AddMinter(address newMinter);
    event RemoveMinter(address oldMinter);

    constructor() ERC20('Arowana Gold Token', 'AGT') ERC20Permit('Arowana Gold Token') Ownable(msg.sender) {
        _minters.add(msg.sender);
        emit AddMinter(msg.sender);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /**
     * Minting related functions
     */
    modifier onlyMinter() {
        require(_minters.contains(_msgSender()), 'FORBIDDEN');
        _;
    }

    function minters() external view returns (address[] memory) {
        return _minters.values();
    }

    function addMinter(address _minter) external onlyOwner {
        require(!_minters.contains(_minter), 'DUPLICATE_MINTER');
        _minters.add(_minter);
        emit AddMinter(_minter);
    }

    function removeMinter(address _minter) external onlyOwner {
        require(_minters.contains(_minter), 'INVALID_MINTER');
        _minters.remove(_minter);
        emit RemoveMinter(_minter);
    }

    function mint(uint256 amount) external onlyMinter {
        _mint(msg.sender, amount);
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }
}
