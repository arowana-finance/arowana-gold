// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { WithSettler } from "../contracts/libraries/WithSettler.sol";

/// @dev Concrete harness to exercise the abstract WithSettler library.
contract WithSettlerHarness is WithSettler {
    function settlerAction() external view onlySettlers returns (bool) {
        return true;
    }
}

contract WithSettlerTest is Test {
    WithSettlerHarness h;
    address owner = address(this);
    address s1 = address(0x51);
    address attacker = address(0xBAD);

    function setUp() public {
        h = new WithSettlerHarness();
        h.initializeSettler(owner);
    }

    function test_init_ownerIsSettler() public view {
        assertEq(h.owner(), owner);
        address[] memory ss = h.settlers();
        assertEq(ss.length, 1);
        assertEq(ss[0], owner);
    }

    function test_revert_reinit() public {
        vm.expectRevert();
        h.initializeSettler(owner);
    }

    function test_initZeroOwner_defaultsToSender() public {
        WithSettlerHarness h2 = new WithSettlerHarness();
        h2.initializeSettler(address(0)); // _initOwner = msg.sender = this
        assertEq(h2.owner(), address(this));
        assertEq(h2.settlers()[0], address(this));
    }

    function test_onlySettlers_owner() public view {
        assertTrue(h.settlerAction());
    }

    function test_addSettler() public {
        h.addSettler(s1);
        assertEq(h.settlers().length, 2);
        vm.prank(s1);
        assertTrue(h.settlerAction());
    }

    function test_revert_addSettler_duplicate() public {
        vm.expectRevert(bytes("DUPLICATE_SETTLER"));
        h.addSettler(owner);
    }

    function test_revert_addSettler_onlyOwner() public {
        vm.prank(attacker);
        vm.expectRevert();
        h.addSettler(s1);
    }

    function test_removeSettler() public {
        h.addSettler(s1);
        h.removeSettler(s1);
        vm.prank(s1);
        vm.expectRevert(WithSettler.NotSettler.selector);
        h.settlerAction();
    }

    function test_revert_removeSettler_notSettler() public {
        vm.expectRevert(bytes("INVALID_SETTLER"));
        h.removeSettler(s1);
    }

    function test_revert_removeSettler_onlyOwner() public {
        vm.prank(attacker);
        vm.expectRevert();
        h.removeSettler(owner);
    }

    function test_revert_onlySettlers_nonSettler() public {
        vm.prank(attacker);
        vm.expectRevert(WithSettler.NotSettler.selector);
        h.settlerAction();
    }
}
