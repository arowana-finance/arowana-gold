// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import { Errors } from "./Errors.sol";

/// @dev Two-step ownership variant of the project's custom {Ownable}.
///      `transferOwnership` only proposes a new owner; the proposed account must
///      call `acceptOwnership` to take control, preventing an irreversible
///      fat-finger transfer to a wrong/unreachable address. `renounceOwnership`
///      is disabled so config control (and any held LINK) can never be stranded
///      by setting the owner to the zero address.
///
///      Mirrors the zero-owner guard of {Ownable}: a zeroed owner can never pass
///      `_checkOwner`. Also inherits Initializable, ContextUpgradeable.
abstract contract Ownable2Step is Ownable2StepUpgradeable {
    function _checkOwner() internal view virtual override {
        address _owner = owner();

        if (_owner == address(0) || _owner != msg.sender) {
            revert OwnableUnauthorizedAccount(msg.sender);
        }
    }

    /// @dev Renouncing ownership is disabled: it would zero the owner and freeze
    ///      all owner-gated configuration permanently.
    function renounceOwnership() public view override onlyOwner {
        revert Errors.RenounceDisabled();
    }
}
