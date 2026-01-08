// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { EnumerableSet } from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import { Ownable } from './Ownable.sol';

contract WithSettler is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

	// ============ Constants ============

	// keccak256(abi.encode(uint256(keccak256("arowana.storage.WithSettler")) - 1)) & ~bytes32(uint256(0xff))
	bytes32 private constant WithSettlerStorageLocation =
		0x7338c697e3704c9b7376ef3421ddd55c9af78fb70ba2f537a061b9fcceca8800;

	// ============ EIP-7201 Storage ============

	/// @custom:storage-location erc7201:arowana.storage.WithSettler
	struct WithSettlerStorage {
		/// @dev Backend Settlers to settle order with specific condition
		EnumerableSet.AddressSet _settlers;
	}
	
	// ============ Events ============

	event AddSettler(address newSettler);
	event RemoveSettler(address oldSettler);

	// ============ Erros ============
	
	error NotSettler();

    // ============ Modifiers ============

	modifier onlySettlers() {
		WithSettlerStorage storage $ = _getWithSettlerStorage();
		if(!$._settlers.contains(_msgSender())) revert NotSettler();
		_;
	}

    // ============ Initializer ============

	function _initializeSettler(address _initOwner) internal {
		if (_initOwner == address(0)) {
			_initOwner = _msgSender();
		}
		__Ownable_init(_initOwner);

		WithSettlerStorage storage $ = _getWithSettlerStorage();
		$._settlers.add(_initOwner);
		emit AddSettler(_initOwner);
	}


    // ============ External Functions ============

	function addSettler(address _settler) external onlyOwner {
		WithSettlerStorage storage $ = _getWithSettlerStorage();
		require(!$._settlers.contains(_settler), 'DUPLICATE_SETTLER');
		$._settlers.add(_settler);
		emit AddSettler(_settler);
	}

	function removeSettler(address _settler) external onlyOwner {
		WithSettlerStorage storage $ = _getWithSettlerStorage();
		require($._settlers.contains(_settler), 'INVALID_SETTLER');
		$._settlers.remove(_settler);
		emit RemoveSettler(_settler);
	}

	function settlers() external view returns (address[] memory) {
		WithSettlerStorage storage $ = _getWithSettlerStorage();
		return $._settlers.values();
	}

	// ============ Public Functions ============

	function initializeSettler(address _initOwner) public virtual initializer {
		_initializeSettler(_initOwner);
	}

	// ============ Internal Functions ============

	function isSettler(address _settler) internal view returns (bool) {
		WithSettlerStorage storage $ = _getWithSettlerStorage();
		return $._settlers.contains(_settler);
	}

	// ============ Private Functions ============

	function _getWithSettlerStorage() private pure returns (WithSettlerStorage storage $) {
          assembly {
              $.slot := WithSettlerStorageLocation
          }
      }
}
