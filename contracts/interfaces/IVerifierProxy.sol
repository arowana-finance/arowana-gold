// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal Chainlink Data Streams VerifierProxy interface.
/// @dev Declared locally because the upstream llo-feeds source pins an exact
///      solc 0.8.19 pragma incompatible with this project's 0.8.28.
interface IVerifierProxy {
    function verify(bytes calldata payload, bytes calldata parameterPayload)
        external
        payable
        returns (bytes memory verifierResponse);

    /// @dev Real return type is IVerifierFeeManager; ABI-compatible with address.
    function s_feeManager() external view returns (address);
}
