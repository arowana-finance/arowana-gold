// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { EnumerableSet } from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import { Ownable } from '../libraries/Ownable.sol';
import { InitializableERC20 } from './InitializableERC20.sol';

/// @title Arowana Gold Token
/// @notice ERC20 pegged with gold reserves
/// @dev Uses standard OpenZeppelin ERC20 implementation
contract GoldToken is InitializableERC20, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    EnumerableSet.AddressSet private _minters;

    event AddMinter(address newMinter);
    event RemoveMinter(address oldMinter);

    function initializeGoldToken(address _initOwner) public {
        initializeToken('Arowana Gold Token', 'AGT', 18, 0);

        _minters.add(_initOwner);
        emit AddMinter(_initOwner);

        _transferOwnership(_initOwner);
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

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }
}
