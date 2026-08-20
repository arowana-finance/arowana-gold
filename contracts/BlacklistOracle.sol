// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { EnumerableSet } from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import { Ownable2Step } from "./libraries/Ownable2Step.sol";
import { Errors } from "./libraries/Errors.sol";

/**
 * @title On-chain Blacklist Oracle Contract
 * @notice Address oracle similar to Chainalysis SanctionsList
 */
contract BlacklistOracle is Ownable2Step {
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
        if (_initOwner == address(0)) revert Errors.ZeroOwner();
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();

        $._name = _name;

        // Canonical parent init chain (upgrades-core error-001): behaviorally identical
        // to the previous direct _transferOwnership, but keeps future OZ init logic.
        __Ownable_init(_initOwner);
        emit BlacklistInitialized(_name);
    }

    // ============ External Functions ============

    function name() external view virtual returns (string memory) {
        return _getBlacklistOracleStorage()._name;
    }

    // ============ Public Functions ============

    /// @dev Idempotent: already-listed addresses are skipped (EnumerableSet.add
    ///      returns false) so an emergency batch never reverts wholesale on a
    ///      single duplicate, persisting the rest of the entries.
    function addBlacklist(address[] memory _blacklist) public virtual onlyOwner {
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();

        for (uint256 i; i < _blacklist.length; ++i) {
            $._blacklist.add(_blacklist[i]);
        }

        emit BlacklistAdded(_blacklist);
    }

    /// @dev Idempotent: absent addresses are skipped (EnumerableSet.remove
    ///      returns false) so a batch never reverts wholesale on a single
    ///      already-absent entry.
    function removeBlacklist(address[] memory _blacklist) public virtual onlyOwner {
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();

        for (uint256 i; i < _blacklist.length; ++i) {
            $._blacklist.remove(_blacklist[i]);
        }

        emit BlacklistRemoved(_blacklist);
    }

    function isBlacklisted(address addr) public view virtual returns (bool) {
        return _getBlacklistOracleStorage()._blacklist.contains(addr);
    }

    function areBlacklisted(address[] memory _addr) public view virtual returns (bool[] memory) {
        BlacklistOracleStorage storage $ = _getBlacklistOracleStorage();
        bool[] memory results = new bool[](_addr.length);

        for (uint256 i; i < _addr.length; ++i) {
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

        for (uint256 i; i < _blacklist.length; ++i) {
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
