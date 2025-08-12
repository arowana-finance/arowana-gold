// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { EnumerableSet } from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import { Ownable } from './Ownable.sol';

contract WithSettler is Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    event AddSettler(address newSettler);
    event RemoveSettler(address oldSettler);

    /// @dev Backend Settlers to settle order with specific condition
    EnumerableSet.AddressSet private _settlers;

    modifier onlySettlers() {
        require(_settlers.contains(msg.sender), 'NOT_SETTLER');
        _;
    }

    function _initializeSettler(address _initOwner) internal {
        if (_initOwner == address(0)) {
            _initOwner = msg.sender;
        }
        __Ownable_init(_initOwner);
        _settlers.add(_initOwner);
        emit AddSettler(_initOwner);
    }

    function initializeSettler(address _initOwner) public virtual initializer {
        _initializeSettler(_initOwner);
    }

    function settlers() external view returns (address[] memory) {
        return _settlers.values();
    }

    function addSettler(address _settler) external onlyOwner {
        require(!_settlers.contains(_settler), 'DUPLICATE_SETTLER');
        _settlers.add(_settler);
        emit AddSettler(_settler);
    }

    function removeSettler(address _settler) external onlyOwner {
        require(_settlers.contains(_settler), 'INVALID_SETTLER');
        _settlers.remove(_settler);
        emit RemoveSettler(_settler);
    }
}
