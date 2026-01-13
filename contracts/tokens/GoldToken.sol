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

	// ============ Constants ============

	// keccak256(abi.encode(uint256(keccak256("arowana.storage.GoldToken")) - 1)) & ~bytes32(uint256(0xff))
	bytes32 private constant GoldTokenStorageLocation =
		0xe44905d6e4ba5747df952e0c03f8ea1240c6d09b5d1d9bb0f13150edec015800;

	// ============ EIP-7201 Storage ============

    /// @custom:storage-location erc7201:arowana.storage.GoldToken
	struct GoldTokenStorage {
		IBlacklistOracle blacklistOracle;
		EnumerableSet.AddressSet _minters;
	}

	// ============ Events ============

	event BlacklistOracleChanged(address _blacklistOracle);
    event AddMinter(address newMinter);
    event RemoveMinter(address oldMinter);

	// ============ Errors ============

    error BlacklistedAddress(address[] addrs);
	error ForbiddenAddress();
	error DuplicateMinter();
	error InvalidMinter();

	// ============ Modifiers ============

	modifier onlyMinter() {
		GoldTokenStorage storage $ = _getGoldTokenStorage();
		if (!$._minters.contains(_msgSender())) revert ForbiddenAddress();
        _;
    }

	// ============ Constructor ============

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	// ============ Initializer ============

    function initializeGoldToken(address _initOwner, address _blacklistOracle) public initializer {
        initializeToken('Arowana Gold Token', 'AGT', 18, 0);

		GoldTokenStorage storage $ = _getGoldTokenStorage();

        $._minters.add(_initOwner);
		emit AddMinter(_initOwner);

        if (_blacklistOracle != address(0)) {
            $.blacklistOracle = IBlacklistOracle(_blacklistOracle);
			emit BlacklistOracleChanged(_blacklistOracle);
        }
        _transferOwnership(_initOwner);
    }

	// ============ External Functions ============

    function addMinter(address _minter) external onlyOwner {
		GoldTokenStorage storage $ = _getGoldTokenStorage();
		if ($._minters.contains(_minter)) revert DuplicateMinter();
		$._minters.add(_minter);
		emit AddMinter(_minter);
	}

    function removeMinter(address _minter) external onlyOwner {
		GoldTokenStorage storage $ = _getGoldTokenStorage();
		if(!$._minters.contains(_minter)) revert InvalidMinter();
		$._minters.remove(_minter);
		emit RemoveMinter(_minter);
	}

	function minters() external view returns (address[] memory) {
		GoldTokenStorage storage $ = _getGoldTokenStorage();
		return $._minters.values();
	}

	// ============ Public Functions ============

	function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }

	/**
	 * @notice Override transferFrom to also check if spender is blacklisted
	 * @dev Prevents blacklisted addresses from executing transferFrom on behalf of others
	 */
	function transferFrom(address from, address to, uint256 value) public virtual override returns (bool) {
		address spender = _msgSender();
		_checkBlacklisted(spender);
		_spendAllowance(from, spender, value);
		_transfer(from, to, value);
		return true;
	}

	/**
	 * @notice Override burnFrom to also check if spender is blacklisted
	 * @dev Prevents blacklisted addresses from burning tokens on behalf of others
	 */
	function burnFrom(address account, uint256 value) public virtual override {
		address spender = _msgSender();
		_checkBlacklisted(spender);
		_spendAllowance(account, spender, value);
		_burn(account, value);
	}

	function changeBlacklistOracle(address _blacklistOracle) public virtual onlyOwner {
		GoldTokenStorage storage $ = _getGoldTokenStorage();
		$.blacklistOracle = IBlacklistOracle(_blacklistOracle);
		emit BlacklistOracleChanged(_blacklistOracle);
	}

	function blacklistOracle() public view returns (IBlacklistOracle) {
		GoldTokenStorage storage $ = _getGoldTokenStorage();
		return $.blacklistOracle;
	}

	// ============ Internal Functions ============

	/**
	 * @notice Check if a single address is blacklisted and revert if so
	 * @param addr The address to check
	 */
	function _checkBlacklisted(address addr) internal view {
		GoldTokenStorage storage $ = _getGoldTokenStorage();
		if (address($.blacklistOracle) != address(0) && $.blacklistOracle.isBlacklisted(addr)) {
			address[] memory _blacklisted = new address[](1);
			_blacklisted[0] = addr;
			revert BlacklistedAddress(_blacklisted);
		}
	}

	/**
	 * @notice Override _update to check if from and to addresses are blacklisted
	 */
	function _update(address from, address to, uint256 value) internal virtual override {
		GoldTokenStorage storage $ = _getGoldTokenStorage();

		if (address($.blacklistOracle) != address(0)) {
			address[] memory _addrs = new address[](2);
			_addrs[0] = from;
			_addrs[1] = to;

			bool[] memory _results = $.blacklistOracle.areBlacklisted(_addrs);

			uint256 count = 0;
			for (uint i; i < _results.length; ++i) {
				if (_results[i]) count++;
			}

			if (count > 0) {
				address[] memory _blacklisted = new address[](count);
				uint256 j = 0;
				for (uint i; i < _results.length; ++i) {
					if (_results[i]) {
						_blacklisted[j++] = _addrs[i];
					}
				}
				revert BlacklistedAddress(_blacklisted);
			}
		}

		super._update(from, to, value);
	}

	// ============ Private Functions ============

	function _getGoldTokenStorage() private pure returns (GoldTokenStorage storage $) {
		assembly {
			$.slot := GoldTokenStorageLocation
		}
	}
}
