// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { EnumerableSet } from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import { IBlacklistOracle } from '../interfaces/IBlacklistOracle.sol';
import { Ownable } from '../libraries/Ownable.sol';
import { InitializableERC20 } from './InitializableERC20.sol';

/// @title Arowana Gold Token
/// @notice ERC20 pegged with gold reserves
/// @dev Uses standard OpenZeppelin ERC20 implementation
contract GoldToken is InitializableERC20, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    IBlacklistOracle public blacklistOracle;

    EnumerableSet.AddressSet private _minters;

    event BlacklistOracleChanged(address _blacklistOracle);
    event AddMinter(address newMinter);
    event RemoveMinter(address oldMinter);

    error BlacklistedAddress(address addr);

    function initializeGoldToken(address _initOwner, address _blacklistOracle) public {
        initializeToken('Arowana Gold Token', 'AGT', 18, 0);

        _minters.add(_initOwner);
        emit AddMinter(_initOwner);

        if (_blacklistOracle != address(0)) {
            changeBlacklistOracle(_blacklistOracle);
        }
        _transferOwnership(_initOwner);
    }

    /**
     * Blacklist related functions
     */
    function _update(address from, address to, uint256 value) internal virtual override {
        if (address(blacklistOracle) != address(0)) {
            address[] memory _black = new address[](2);

            _black[0] = from;
            _black[1] = to;

            (bool _blacklisted, uint256 _blackIndex) = blacklistOracle.areBlacklisted(_black);

            if (_blacklisted) {
                revert BlacklistedAddress(_black[_blackIndex]);
            }
        }

        super._update(from, to, value);
    }

    function changeBlacklistOracle(address _blacklistOracle) public virtual onlyOwner {
        blacklistOracle = IBlacklistOracle(_blacklistOracle);
        emit BlacklistOracleChanged(_blacklistOracle);
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
