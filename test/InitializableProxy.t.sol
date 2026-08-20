// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { InitializableProxy } from "../contracts/proxy/InitializableProxy.sol";

contract ProxyImplV1 {
    uint256 public value;

    function initialize(uint256 v) external {
        value = v;
    }

    function setValue(uint256 v) external {
        value = v;
    }

    function version() external pure virtual returns (uint256) {
        return 1;
    }
}

contract ProxyImplV2 is ProxyImplV1 {
    function version() external pure override returns (uint256) {
        return 2;
    }
}

contract InitializableProxyTest is Test {
    InitializableProxy proxy;
    ProxyImplV1 implV1;
    ProxyImplV2 implV2;

    address admin = address(0xAD0411);
    address attacker = address(0xBAD);

    function setUp() public {
        implV1 = new ProxyImplV1();
        implV2 = new ProxyImplV2();
        proxy = new InitializableProxy();
        proxy.initializeProxy("v1 proxy", admin, address(implV1), abi.encodeCall(ProxyImplV1.initialize, (42)));
    }

    function test_initState() public view {
        assertEq(proxy.admin(), admin);
        assertEq(proxy.implementation(), address(implV1));
        assertEq(proxy.proxyDescription(), "v1 proxy");
        assertEq(ProxyImplV1(address(proxy)).value(), 42);
        assertEq(ProxyImplV1(address(proxy)).version(), 1);
    }

    function test_revert_doubleInit() public {
        vm.expectRevert("ALREADY_INITIALIZED");
        proxy.initializeProxy("x", admin, address(implV1), "");
    }

    function test_delegateCall_setValue() public {
        ProxyImplV1(address(proxy)).setValue(99);
        assertEq(ProxyImplV1(address(proxy)).value(), 99);
    }

    function test_upgrade_preservesStorage() public {
        vm.prank(admin);
        proxy.upgradeToAndCall(address(implV2), "");
        assertEq(proxy.implementation(), address(implV2));
        assertEq(ProxyImplV1(address(proxy)).version(), 2);
        assertEq(ProxyImplV1(address(proxy)).value(), 42); // storage preserved across upgrade
    }

    function test_revert_upgrade_nonAdmin() public {
        vm.prank(attacker);
        vm.expectRevert("NOT_ADMIN");
        proxy.upgradeToAndCall(address(implV2), "");
    }

    function test_revert_upgrade_toEOA() public {
        vm.prank(admin);
        vm.expectRevert(); // ERC1967InvalidImplementation (no code)
        proxy.upgradeToAndCall(attacker, "");
    }

    function test_changeAdmin() public {
        address newAdmin = address(0xBEEF);
        vm.prank(admin);
        proxy.changeAdmin(newAdmin);
        assertEq(proxy.admin(), newAdmin);
    }

    function test_revert_changeAdmin_nonAdmin() public {
        vm.prank(attacker);
        vm.expectRevert("NOT_ADMIN");
        proxy.changeAdmin(attacker);
    }

    function test_changeDescription() public {
        vm.prank(admin);
        proxy.changeDescription("updated");
        assertEq(proxy.proxyDescription(), "updated");
    }

    function test_revert_changeDescription_nonAdmin() public {
        vm.prank(attacker);
        vm.expectRevert("NOT_ADMIN");
        proxy.changeDescription("x");
    }
}
