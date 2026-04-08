// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { AccessControlEnumerableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol';
import { IBlacklistOracle } from '../interfaces/IBlacklistOracle.sol';
import { InitializableERC20 } from './InitializableERC20.sol';

/// @notice ERC20 pegged with gold reserves
/// @dev Uses standard OpenZeppelin ERC20 implementation
contract GoldToken is InitializableERC20, AccessControlEnumerableUpgradeable {

	// ============ Constants ============

	/// @notice MINTER_ROLE - token minting authority
	/// keccak256("MINTER_ROLE")
	bytes32 public constant MINTER_ROLE = 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6;

	// keccak256(abi.encode(uint256(keccak256("arowana.storage.GoldToken")) - 1)) & ~bytes32(uint256(0xff))
	bytes32 private constant GoldTokenStorageLocation =
		0xe44905d6e4ba5747df952e0c03f8ea1240c6d09b5d1d9bb0f13150edec015800;

	// ============ EIP-7201 Storage ============

    /// @custom:storage-location erc7201:arowana.storage.GoldToken
	struct GoldTokenStorage {
		IBlacklistOracle blacklistOracle;
	}

	// ============ Events ============

	event BlacklistOracleChanged(address _blacklistOracle);
    event AddMinter(address newMinter);
    event RemoveMinter(address oldMinter);

	// ============ Errors ============

    error BlacklistedAddress(address[] addrs);
	error AlreadyMinter(address minter);
    error NotMinter(address minter);

	// ============ Constructor ============

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	// ============ Initializer ============

    function initializeGoldToken(address _initOwner, address _blacklistOracle) public initializer {
        initializeToken('Ontorium Gold Token', 'OXAU', 18, 0);
		__AccessControl_init();

		GoldTokenStorage storage $ = _getGoldTokenStorage();

        if (_blacklistOracle != address(0)) {
            $.blacklistOracle = IBlacklistOracle(_blacklistOracle);
			emit BlacklistOracleChanged(_blacklistOracle);
        }

		_grantRole(DEFAULT_ADMIN_ROLE, _initOwner);
    }

	// ============ External Functions ============

    function addMinter(address _minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
		if (hasRole(MINTER_ROLE, _minter)) revert AlreadyMinter(_minter);

		_grantRole(MINTER_ROLE, _minter);
		emit AddMinter(_minter);
	}

    function removeMinter(address _minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
		if (!hasRole(MINTER_ROLE, _minter)) revert NotMinter(_minter);

		_revokeRole(MINTER_ROLE, _minter);
		emit RemoveMinter(_minter);
	}

	function minters() external view returns (address[] memory) {
		uint256 count = getRoleMemberCount(MINTER_ROLE);
		address[] memory result = new address[](count);
		for (uint256 i = 0; i < count; i++) {
			result[i] = getRoleMember(MINTER_ROLE, i);
		}
		return result;
	}

	// ============ Public Functions ============

	function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
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

	function changeBlacklistOracle(address _blacklistOracle) public virtual onlyRole(DEFAULT_ADMIN_ROLE) {
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
