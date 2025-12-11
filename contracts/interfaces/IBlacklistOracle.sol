// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IBlacklistOracle {
    // ============ Events ============
    event BlacklistInitialized(string _name);
    event BlacklistAdded(address[] addrs);
    event BlacklistRemoved(address[] addrs);

    // ============ Errors ============
    error InvalidAddress(address addr);

    function initializeOracle(string memory _name, address _initOwner) external;

    function name() external view returns (string memory);

    function addBlacklist(address[] memory _blacklist) external;

    function removeBlacklist(address[] memory _blacklist) external;

    function isBlacklisted(address addr) external view returns (bool);

    function areBlacklisted(address[] memory _addr) external view returns (bool, uint256);

    function getBlacklistCount() external view returns (uint256);

    function getBlacklist(uint256 start, uint256 end) external view returns (address[] memory);
}
