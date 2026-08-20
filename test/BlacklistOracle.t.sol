// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { BlacklistOracle } from "../contracts/BlacklistOracle.sol";
import { Errors } from "../contracts/libraries/Errors.sol";

contract BlacklistOracleTest is Test {
    BlacklistOracle oracle;
    address owner = address(this);
    address a = address(0xA);
    address b = address(0xB);
    address c = address(0xC);

    function setUp() public {
        oracle = BlacklistOracle(
            address(
                new ERC1967Proxy(
                    address(new BlacklistOracle()),
                    abi.encodeCall(BlacklistOracle.initializeOracle, ("Sanctions", owner))
                )
            )
        );
    }

    function _one(address x) internal pure returns (address[] memory r) {
        r = new address[](1);
        r[0] = x;
    }

    function test_init() public view {
        assertEq(oracle.name(), "Sanctions");
        assertEq(oracle.owner(), owner);
        assertEq(oracle.getBlacklistCount(), 0);
    }

    // ---- two-step ownership (LOW A) ----

    function test_transferOwnership_isTwoStep() public {
        oracle.transferOwnership(b);
        // step 1: ownership does NOT move yet (fat-finger protection)
        assertEq(oracle.owner(), owner, "owner unchanged until accepted");
        assertEq(oracle.pendingOwner(), b, "pending owner recorded");
        // step 2: only the pending owner can take control
        vm.prank(b);
        oracle.acceptOwnership();
        assertEq(oracle.owner(), b, "ownership transferred after accept");
        assertEq(oracle.pendingOwner(), address(0), "pending cleared");
    }

    function test_revert_acceptOwnership_notPending() public {
        oracle.transferOwnership(b);
        vm.prank(c); // not the pending owner
        vm.expectRevert();
        oracle.acceptOwnership();
    }

    function test_revert_renounceOwnership_disabled() public {
        vm.expectRevert(Errors.RenounceDisabled.selector);
        oracle.renounceOwnership();
    }

    function test_revert_init_zeroOwner() public {
        BlacklistOracle impl = new BlacklistOracle();
        vm.expectRevert(Errors.ZeroOwner.selector);
        new ERC1967Proxy(address(impl), abi.encodeCall(BlacklistOracle.initializeOracle, ("x", address(0))));
    }

    function test_revert_reinit() public {
        vm.expectRevert();
        oracle.initializeOracle("again", owner);
    }

    function test_addBlacklist() public {
        address[] memory arr = new address[](2);
        arr[0] = a;
        arr[1] = b;
        oracle.addBlacklist(arr);
        assertTrue(oracle.isBlacklisted(a));
        assertTrue(oracle.isBlacklisted(b));
        assertFalse(oracle.isBlacklisted(c));
        assertEq(oracle.getBlacklistCount(), 2);
    }

    function test_areBlacklisted() public {
        oracle.addBlacklist(_one(a));
        address[] memory q = new address[](2);
        q[0] = a;
        q[1] = c;
        bool[] memory res = oracle.areBlacklisted(q);
        assertTrue(res[0]);
        assertFalse(res[1]);
    }

    function test_addBlacklist_duplicate_idempotent() public {
        oracle.addBlacklist(_one(a));
        // Re-adding an already-listed address must NOT revert and must not duplicate.
        oracle.addBlacklist(_one(a));
        assertTrue(oracle.isBlacklisted(a));
        assertEq(oracle.getBlacklistCount(), 1);
    }

    function test_addBlacklist_mixedBatch_persistsAll() public {
        oracle.addBlacklist(_one(b)); // b already listed
        address[] memory arr = new address[](3);
        arr[0] = a;
        arr[1] = b; // duplicate in the middle must not abort the batch
        arr[2] = c;
        oracle.addBlacklist(arr);
        assertTrue(oracle.isBlacklisted(a));
        assertTrue(oracle.isBlacklisted(b));
        assertTrue(oracle.isBlacklisted(c));
        assertEq(oracle.getBlacklistCount(), 3);
    }

    function test_revert_addBlacklist_onlyOwner() public {
        vm.prank(b);
        vm.expectRevert();
        oracle.addBlacklist(_one(a));
    }

    function test_removeBlacklist() public {
        address[] memory arr = new address[](2);
        arr[0] = a;
        arr[1] = b;
        oracle.addBlacklist(arr);
        oracle.removeBlacklist(_one(a));
        assertFalse(oracle.isBlacklisted(a));
        assertTrue(oracle.isBlacklisted(b));
        assertEq(oracle.getBlacklistCount(), 1);
    }

    function test_removeBlacklist_notExist_idempotent() public {
        // Removing an absent address must NOT revert.
        oracle.removeBlacklist(_one(a));
        assertFalse(oracle.isBlacklisted(a));
        assertEq(oracle.getBlacklistCount(), 0);
    }

    function test_removeBlacklist_mixedBatch_persistsAll() public {
        address[] memory arr = new address[](2);
        arr[0] = a;
        arr[1] = b;
        oracle.addBlacklist(arr);
        address[] memory rm = new address[](3);
        rm[0] = a;
        rm[1] = c; // absent in the middle must not abort the batch
        rm[2] = b;
        oracle.removeBlacklist(rm);
        assertFalse(oracle.isBlacklisted(a));
        assertFalse(oracle.isBlacklisted(b));
        assertEq(oracle.getBlacklistCount(), 0);
    }

    function test_revert_removeBlacklist_onlyOwner() public {
        oracle.addBlacklist(_one(a));
        vm.prank(b);
        vm.expectRevert();
        oracle.removeBlacklist(_one(a));
    }

    function test_getBlacklist_fullAndSlice() public {
        address[] memory arr = new address[](3);
        arr[0] = a;
        arr[1] = b;
        arr[2] = c;
        oracle.addBlacklist(arr);

        address[] memory full = oracle.getBlacklist(0, 3);
        assertEq(full.length, 3);
        assertEq(full[0], a);
        assertEq(full[2], c);

        address[] memory slice = oracle.getBlacklist(1, 3);
        assertEq(slice.length, 2);
        assertEq(slice[0], b);
        assertEq(slice[1], c);
    }
}
