// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { ProxyFactory } from "../contracts/proxy/ProxyFactory.sol";
import { InitializableProxy } from "../contracts/proxy/InitializableProxy.sol";
import { BlacklistOracle } from "../contracts/BlacklistOracle.sol";

/// @notice MED 3 — proves the atomic-deploy factory closes the InitializableProxy
///         front-running window, and demonstrates the bare two-step path is unsafe.
contract ProxyFactoryTest is Test {
    ProxyFactory factory;
    BlacklistOracle impl;
    address admin = makeAddr("admin");
    address attacker = makeAddr("attacker");
    bytes32 salt = keccak256("ontorium.blacklist.v1");

    function setUp() public {
        factory = new ProxyFactory();
        impl = new BlacklistOracle();
    }

    function _initData() internal view returns (bytes memory) {
        return abi.encodeCall(BlacklistOracle.initializeOracle, ("Sanctions", admin));
    }

    function test_factory_atomicDeploy_setsAdminAndInit() public {
        address proxy = factory.deployProxy(salt, "blacklist", admin, address(impl), _initData());

        assertEq(InitializableProxy(payable(proxy)).admin(), admin, "admin set atomically");
        assertEq(InitializableProxy(payable(proxy)).implementation(), address(impl), "impl set");
        assertEq(BlacklistOracle(proxy).owner(), admin, "init ran");
        assertEq(BlacklistOracle(proxy).name(), "Sanctions");
    }

    function test_factory_predict_matchesDeployedAddress() public {
        address predicted = factory.predict(address(this), salt);
        address deployed = factory.deployProxy(salt, "blacklist", admin, address(impl), _initData());
        assertEq(predicted, deployed, "CREATE2 address is deterministic");
    }

    /// @dev Salt is namespaced by caller: the same salt yields different addresses for
    ///      different deployers, so an attacker cannot pre-occupy our deterministic
    ///      address by front-running deployProxy with the same salt.
    function test_factory_saltNamespacedByCaller() public {
        address mine = factory.predict(address(this), salt);
        address theirs = factory.predict(attacker, salt);
        assertTrue(mine != theirs, "same salt -> different address per deployer");

        // Attacker deploying with the same salt does NOT collide with our address.
        vm.prank(attacker);
        address attackerProxy = factory.deployProxy(salt, "x", attacker, address(impl), _initData());
        assertEq(attackerProxy, theirs);
        address deployed = factory.deployProxy(salt, "blacklist", admin, address(impl), _initData());
        assertEq(deployed, mine, "our deploy still succeeds at our own address");
    }

    /// @dev The vulnerability MED 3 describes: a bare proxy deployed in one tx and
    ///      left uninitialized can be seized by anyone who calls initializeProxy first.
    function test_bareProxy_isFrontRunnable() public {
        InitializableProxy proxy = new InitializableProxy();
        // Attacker front-runs the legitimate initializer.
        vm.prank(attacker);
        proxy.initializeProxy("evil", attacker, address(impl), "");
        assertEq(proxy.admin(), attacker, "bare two-step proxy seized by front-runner");

        // The legitimate deployer's later init reverts — the seizure is irreversible.
        vm.expectRevert(bytes("ALREADY_INITIALIZED"));
        proxy.initializeProxy("blacklist", admin, address(impl), "");
    }

    function test_revert_factory_doubleSaltCollision() public {
        factory.deployProxy(salt, "blacklist", admin, address(impl), _initData());
        // Re-using the salt reverts (CREATE2 address already deployed).
        vm.expectRevert();
        factory.deployProxy(salt, "blacklist", admin, address(impl), _initData());
    }
}
