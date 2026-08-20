// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { InitializableERC20 } from "../contracts/tokens/InitializableERC20.sol";

/// @dev Concrete harness exposing an initializer that forwards to initializeToken,
///      so the `supply_ != 0` mint branch can be exercised (GoldToken inits with 0).
contract InitERC20Harness is InitializableERC20 {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function init(string memory n, string memory s, uint8 d, uint256 supply) external initializer {
        initializeToken(n, s, d, supply);
    }
}

contract InitializableERC20Test is Test {
    function _deploy(string memory n, string memory s, uint8 d, uint256 supply) internal returns (InitERC20Harness) {
        InitERC20Harness impl = new InitERC20Harness();
        return InitERC20Harness(
            address(new ERC1967Proxy(address(impl), abi.encodeCall(InitERC20Harness.init, (n, s, d, supply))))
        );
    }

    function test_initWithSupply_mintsToSender() public {
        InitERC20Harness tok = _deploy("Test", "TST", 8, 1000e18);
        assertEq(tok.name(), "Test");
        assertEq(tok.symbol(), "TST");
        assertEq(tok.decimals(), 8);
        assertEq(tok.totalSupply(), 1000e18);
        assertEq(tok.balanceOf(address(this)), 1000e18, "supply minted to initializer caller");
    }

    function test_initZeroSupply_noMint() public {
        InitERC20Harness tok = _deploy("Zero", "ZRO", 18, 0);
        assertEq(tok.decimals(), 18);
        assertEq(tok.totalSupply(), 0);
    }

    function test_revert_reinit() public {
        InitERC20Harness tok = _deploy("Test", "TST", 18, 0);
        vm.expectRevert();
        tok.init("Again", "AGN", 18, 0);
    }

    /// @dev upgrades-core error-001 regression: calling initializeToken directly outside an
    ///      initialization context must revert via its own onlyInitializing guard (not by
    ///      accident of a parent guard).
    function test_revert_directInitializeToken_afterInit() public {
        InitERC20Harness tok = _deploy("Test", "TST", 18, 0);
        vm.expectRevert();
        tok.initializeToken("Hijack", "EVIL", 6, 1_000_000e18);
    }
}
