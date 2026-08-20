// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ERC20Mock } from "../contracts/tokens/ERC20Mock.sol";

/// @notice Smoke test that verifies the Foundry toolchain (build + test + deps)
/// is wired correctly. Not a functional test of the protocol.
contract ScaffoldSmokeTest is Test {
    function test_scaffold_deploysMockToken() public {
        ERC20Mock token = new ERC20Mock("Mock USD", "mUSD", 6, 1_000_000e6);

        assertEq(token.name(), "Mock USD");
        assertEq(token.symbol(), "mUSD");
        assertEq(token.decimals(), 6);
        assertEq(token.totalSupply(), 1_000_000e6);
        assertEq(token.balanceOf(address(this)), 1_000_000e6);
    }
}
