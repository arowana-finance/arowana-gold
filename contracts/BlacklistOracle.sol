// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { EnumerableSet } from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import { Ownable } from './libraries/Ownable.sol';

/**
 * @title On-chain Blacklist Oracle Contract
 * @notice Address oracle similar to Chainalysis SanctionsList
 */
contract BlacklistOracle is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    // ============ Constants ============

    /// @dev keccak256(abi.encode(uint256(keccak256("BlacklistOracle")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant BlacklistOracleStorageLocation =
        0xeafe955e3e9fca9f405034e3cbb9179eaee502fc8f327276b976c4cf4b4aeb00;

    // ============ Storage ============

    struct BlacklistOracleStorage {
        string _name;
        EnumerableSet.AddressSet _blacklist;
    }

    // ============ Events ============

    event BlacklistInitialized(string _name);
    event BlacklistAdded(address[] addrs);
    event BlacklistRemoved(address[] addrs);

    // ============ Errors ============

    error InvalidAddress(address addr);

    // ============ Constructor ============

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	// ============ Initializer ============

    function initializeOracle(string memory _name, address _initOwner) public initializer {
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();

        $._name = _name;

        _transferOwnership(_initOwner);
        emit BlacklistInitialized(_name);
    }

    // ============ External Functions ============

    function name() external view virtual returns (string memory) {
        return _getBlacklistOracleStorage()._name;
    }

    // ============ Public Functions ============

    function addBlacklist(address[] memory _blacklist) public virtual onlyOwner {
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();

        for (uint i; i < _blacklist.length; ++i) {
            address _black = _blacklist[i];

            if ($._blacklist.contains(_black)) {
                revert InvalidAddress(_black);
            }

            $._blacklist.add(_black);
        }

        emit BlacklistAdded(_blacklist);
    }

    function removeBlacklist(address[] memory _blacklist) public virtual onlyOwner {
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();

        for (uint i; i < _blacklist.length; ++i) {
            address _black = _blacklist[i];

            if (!$._blacklist.contains(_black)) {
                revert InvalidAddress(_black);
            }

            $._blacklist.remove(_black);
        }

        emit BlacklistRemoved(_blacklist);
    }

    function isBlacklisted(address addr) public view virtual returns (bool) {
        return _getBlacklistOracleStorage()._blacklist.contains(addr);
    }

    function areBlacklisted(address[] memory _addr) public view virtual returns (bool[] memory) {
		BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();
		bool[] memory results = new bool[](_addr.length);

		for (uint i; i < _addr.length; ++i) {
			results[i] = $._blacklist.contains(_addr[i]);
		}

		return results;
	}

    function getBlacklistCount() public view virtual returns (uint256) {
        return _getBlacklistOracleStorage()._blacklist.length();
    }

    function getBlacklist(uint256 start, uint256 end) public view virtual returns (address[] memory) {
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();

        address[] memory _blacklist = new address[](end - start);

        for (uint i; i < _blacklist.length; ++i) {
            _blacklist[i] = $._blacklist.at(i + start);
        }

        return _blacklist;
    }

    // ============ Internal Functions ============
	
    function _getBlacklistOracleStorage() internal pure returns (BlacklistOracleStorage storage $) {
        assembly {
            $.slot := BlacklistOracleStorageLocation
        }
    }
}
