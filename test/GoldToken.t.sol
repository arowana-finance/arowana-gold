// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { GoldToken } from "../contracts/tokens/GoldToken.sol";
import { BlacklistOracle } from "../contracts/BlacklistOracle.sol";

/// @dev Exercises GoldToken + InitializableERC20 + the blacklist `_update` path
///      against a REAL BlacklistOracle (not a mock), covering the production token.
contract GoldTokenTest is Test {
    GoldToken gold;
    BlacklistOracle oracle;

    address owner = address(this); // DEFAULT_ADMIN + MINTER
    address alice = address(0xA11CE);
    address bob = address(0xB0B);
    address bad = address(0xBAD);

    function setUp() public {
        oracle = BlacklistOracle(
            address(
                new ERC1967Proxy(
                    address(new BlacklistOracle()),
                    abi.encodeCall(BlacklistOracle.initializeOracle, ("OXAU Blacklist", owner))
                )
            )
        );
        gold = GoldToken(
            address(
                new ERC1967Proxy(
                    address(new GoldToken()), abi.encodeCall(GoldToken.initializeGoldToken, (owner, address(oracle)))
                )
            )
        );
        gold.addMinter(owner);
    }

    function _ban(address x) internal {
        address[] memory a = new address[](1);
        a[0] = x;
        oracle.addBlacklist(a);
    }

    /// @dev Expect the next call to revert with BlacklistedAddress([x]).
    function _expectBan(address x) internal {
        address[] memory a = new address[](1);
        a[0] = x;
        vm.expectRevert(abi.encodeWithSelector(GoldToken.BlacklistedAddress.selector, a));
    }

    // ---- metadata / init (InitializableERC20) ----

    function test_metadata() public view {
        assertEq(gold.name(), "Ontorium Gold Token");
        assertEq(gold.symbol(), "OXAU");
        assertEq(gold.decimals(), 18);
        assertEq(address(gold.blacklistOracle()), address(oracle));
    }

    function test_revert_reinit() public {
        vm.expectRevert();
        gold.initializeGoldToken(owner, address(oracle));
    }

    // ---- minter management ----

    function test_mint_onlyMinter() public {
        gold.mint(alice, 100e18);
        assertEq(gold.balanceOf(alice), 100e18);
        assertEq(gold.totalSupply(), 100e18);
    }

    function test_revert_mint_nonMinter() public {
        vm.prank(bob);
        vm.expectRevert();
        gold.mint(alice, 1e18);
    }

    function test_addRemoveMinter() public {
        gold.addMinter(bob);
        assertTrue(gold.hasRole(gold.MINTER_ROLE(), bob));
        address[] memory ms = gold.minters();
        bool found;
        for (uint256 i; i < ms.length; ++i) {
            if (ms[i] == bob) found = true;
        }
        assertTrue(found);
        gold.removeMinter(bob);
        assertFalse(gold.hasRole(gold.MINTER_ROLE(), bob));
    }

    function test_revert_addMinter_duplicate() public {
        vm.expectRevert(abi.encodeWithSelector(GoldToken.AlreadyMinter.selector, owner));
        gold.addMinter(owner);
    }

    function test_revert_removeMinter_notMinter() public {
        vm.expectRevert(abi.encodeWithSelector(GoldToken.NotMinter.selector, bob));
        gold.removeMinter(bob);
    }

    function test_revert_addMinter_onlyAdmin() public {
        vm.prank(bob);
        vm.expectRevert();
        gold.addMinter(alice);
    }

    // ---- transfers ----

    function test_transfer() public {
        gold.mint(alice, 100e18);
        vm.prank(alice);
        gold.transfer(bob, 40e18);
        assertEq(gold.balanceOf(bob), 40e18);
        assertEq(gold.balanceOf(alice), 60e18);
    }

    function test_transferFrom() public {
        gold.mint(alice, 100e18);
        vm.prank(alice);
        gold.approve(bob, 50e18);
        vm.prank(bob);
        gold.transferFrom(alice, bob, 50e18);
        assertEq(gold.balanceOf(bob), 50e18);
    }

    // ---- blacklist enforcement (_update + overrides) ----

    function test_revert_transfer_blacklistedSender() public {
        gold.mint(bad, 10e18);
        _ban(bad);
        vm.prank(bad);
        _expectBan(bad);
        gold.transfer(alice, 1e18);
    }

    function test_revert_transfer_blacklistedRecipient() public {
        gold.mint(alice, 10e18);
        _ban(bob);
        vm.prank(alice);
        _expectBan(bob);
        gold.transfer(bob, 1e18);
    }

    function test_revert_transferFrom_blacklistedSpender() public {
        gold.mint(alice, 10e18);
        vm.prank(alice);
        gold.approve(bad, 5e18);
        _ban(bad);
        vm.prank(bad);
        _expectBan(bad);
        gold.transferFrom(alice, alice, 5e18);
    }

    // ---- burns ----

    function test_burn() public {
        gold.mint(alice, 10e18);
        vm.prank(alice);
        gold.burn(4e18);
        assertEq(gold.balanceOf(alice), 6e18);
    }

    function test_burnFrom() public {
        gold.mint(alice, 10e18);
        vm.prank(alice);
        gold.approve(bob, 5e18);
        vm.prank(bob);
        gold.burnFrom(alice, 5e18);
        assertEq(gold.balanceOf(alice), 5e18);
    }

    function test_revert_burnFrom_blacklistedSpender() public {
        gold.mint(alice, 10e18);
        vm.prank(alice);
        gold.approve(bad, 5e18);
        _ban(bad);
        vm.prank(bad);
        _expectBan(bad);
        gold.burnFrom(alice, 5e18);
    }

    // ---- blacklist oracle swap ----

    function test_changeBlacklistOracle_toZero_disablesChecks() public {
        _ban(bob);
        gold.changeBlacklistOracle(address(0));
        assertEq(address(gold.blacklistOracle()), address(0));
        gold.mint(alice, 10e18);
        vm.prank(alice);
        gold.transfer(bob, 1e18); // previously banned, now allowed
        assertEq(gold.balanceOf(bob), 1e18);
    }

    function test_changeBlacklistOracle_toNew() public {
        BlacklistOracle o2 = BlacklistOracle(
            address(
                new ERC1967Proxy(
                    address(new BlacklistOracle()), abi.encodeCall(BlacklistOracle.initializeOracle, ("o2", owner))
                )
            )
        );
        gold.changeBlacklistOracle(address(o2));
        assertEq(address(gold.blacklistOracle()), address(o2));
    }

    function test_revert_changeBlacklistOracle_onlyAdmin() public {
        vm.prank(bob);
        vm.expectRevert();
        gold.changeBlacklistOracle(address(0));
    }
}
