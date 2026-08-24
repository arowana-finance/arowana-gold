// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test, stdStorage, StdStorage } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { ERC20Mock } from "../contracts/tokens/ERC20Mock.sol";
import { Errors } from "../contracts/libraries/Errors.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";
import { IGoldMinter } from "../contracts/interfaces/IGoldMinter.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { ReportV8 } from "../contracts/interfaces/DataStreamsReports.sol";
import { IVerifierProxy } from "../contracts/interfaces/IVerifierProxy.sol";
import { MockGoldToken } from "./GoldMinterStreams.t.sol";

/// @title GoldMinterCancelTest
/// @notice Deploys with autoSettle=false to create pending orders and verify the escape hatch.
contract GoldMinterCancelTest is Test {
    using stdStorage for StdStorage;

    GoldMinter minter;
    GoldStreamVerifier verifier;
    MockGoldToken gold;
    ERC20Mock usdt;
    ERC20Mock usdc;
    ERC20Mock link;

    address verifierProxy = makeAddr("verifierProxy");
    address usdRecipient = makeAddr("usdRecipient");
    address feeRecipient = makeAddr("feeRecipient");
    address user = makeAddr("user");
    address attacker = makeAddr("attacker");

    address twSigner;
    uint256 twSignerPk;

    bytes32 constant FEED_ID = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;
    uint256 constant PRICE8 = 2000e8;

    function setUp() public {
        vm.warp(1_000_000);

        gold = new MockGoldToken();
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);
        link = new ERC20Mock("Chainlink", "LINK", 18, 0);

        GoldStreamVerifier vImpl = new GoldStreamVerifier();
        verifier = GoldStreamVerifier(
            address(
                new ERC1967Proxy(
                    address(vImpl),
                    abi.encodeCall(
                        GoldStreamVerifier.initialize, (address(this), verifierProxy, address(link), FEED_ID)
                    )
                )
            )
        );

        // autoSettle=false — manual settlement so orders stay pending (only T8 toggles it)
        GoldMinter mImpl = new GoldMinter();
        minter = GoldMinter(
            address(
                new ERC1967Proxy(
                    address(mImpl),
                    abi.encodeCall(
                        GoldMinter.initializeGoldMinter,
                        (
                            address(gold),
                            address(usdt),
                            address(usdc),
                            address(verifier),
                            usdRecipient,
                            feeRecipient,
                            address(this),
                            false
                        )
                    )
                )
            )
        );

        verifier.setGoldMinter(address(minter));

        (twSigner, twSignerPk) = makeAddrAndKey("twSigner");
        minter.grantRole(minter.PARAMETER_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), twSigner);
        minter.grantRole(minter.SETTLER_ROLE(), address(this));
        minter.updateMinGoldFee(0);
        minter.updateMinMintAmount(1);
        minter.updateMinRedeemAmount(1);
        minter.setLevel(user, IGoldMinter.Levels.APPROVED);

        usdt.mint(usdRecipient, 1_000_000e6);
        vm.prank(usdRecipient);
        usdt.approve(address(minter), type(uint256).max);
    }

    // ---- helpers ----

    function _freshReport(int192 midPrice) internal returns (bytes memory unverified) {
        vm.warp(block.timestamp + 12);
        uint32 obs = uint32(block.timestamp);
        ReportV8 memory r = ReportV8({
            feedId: FEED_ID,
            validFromTimestamp: obs,
            observationsTimestamp: obs,
            nativeFee: 0,
            linkFee: 0,
            expiresAt: uint32(block.timestamp + 1 hours),
            lastUpdateTimestamp: uint64(obs),
            midPrice: midPrice,
            marketStatus: 2
        });
        bytes memory verified = abi.encode(r);
        bytes32[3] memory ctx;
        unverified = abi.encode(ctx, verified);
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.s_feeManager.selector), abi.encode(address(0)));
        vm.mockCall(verifierProxy, abi.encodeWithSelector(IVerifierProxy.verify.selector), abi.encode(verified));
    }

    /// @dev Creates a pending mint order (autoSettle off) — returns (nonce, usdAmount).
    function _pendingMint() internal returns (uint256 nonce, uint256 usdAmount) {
        usdAmount = 100_000e6;
        usdt.mint(user, usdAmount);
        vm.startPrank(user);
        usdt.approve(address(minter), type(uint256).max);
        uint256 gross = minter.quoteGoldAmount(address(usdt), usdAmount, PRICE8);
        uint256 net = gross - minter.calculateGoldFee(gross, true);
        vm.stopPrank();
        bytes memory report = _freshReport(2000e18);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmount, net, report, _tw, _twSig);
        nonce = 0;
    }

    /// @dev Creates a pending burn order — returns (nonce, goldAmount).
    function _pendingBurn() internal returns (uint256 nonce, uint256 goldAmount) {
        goldAmount = 500e18;
        gold.mint(user, goldAmount);
        vm.prank(user);
        gold.approve(address(minter), type(uint256).max);
        uint256 net = goldAmount - minter.calculateGoldFee(goldAmount, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), net, PRICE8);
        bytes memory report = _freshReport(2000e18);
        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestBurn(address(usdt), goldAmount, expectedUsd, report, _tw, _twSig);
        nonce = 0;
    }

    function _warpPastTTL() internal {
        vm.warp(block.timestamp + uint256(minter.orderTTL()) + 1);
    }

    uint256 internal _twNonce;

    /// @dev EIP-712 domain separator matching GoldMinter's `__EIP712_init("GoldMinter", "1")`.
    function _domainSeparator() internal view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("GoldMinter")),
                keccak256(bytes("1")),
                block.chainid,
                address(minter)
            )
        );
    }

    /// @dev Mint a VALID (always-open, single-use) trade window signed by a KYC_MANAGER.
    function _mintTW(address user_) internal returns (IGoldMinter.TradeWindow memory tw, bytes memory sig) {
        tw = IGoldMinter.TradeWindow({ user: user_, validAfter: 0, validBefore: type(uint64).max, nonce: _twNonce++ });
        bytes32 structHash =
            keccak256(abi.encode(minter.TRADE_WINDOW_TYPEHASH(), tw.user, tw.validAfter, tw.validBefore, tw.nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _domainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(twSignerPk, digest);
        sig = abi.encodePacked(r, s, v);
    }

    // ---- T1: cancel before TTL is rejected ----

    function test_revert_cancelBeforeTTL() public {
        (uint256 nonce,) = _pendingMint();
        vm.prank(user);
        vm.expectRevert(Errors.NotExpired.selector);
        minter.cancelExpiredMint(nonce);
    }

    // ---- T2: mint cancel after TTL -> escrowed USD refunded ----

    function test_cancelExpiredMint_refundsEscrow() public {
        (uint256 nonce, uint256 usdAmount) = _pendingMint();
        assertEq(usdt.balanceOf(address(minter)), usdAmount, "USD escrowed in minter");
        assertEq(minter.getUserPendingMintCount(user), 1);

        _warpPastTTL();
        vm.expectEmit(true, true, false, true);
        emit GoldMinter.CancelMint(nonce, user, usdAmount);
        vm.prank(user);
        minter.cancelExpiredMint(nonce);

        assertEq(usdt.balanceOf(user), usdAmount, "escrow refunded to buyer");
        assertEq(usdt.balanceOf(address(minter)), 0, "no USD left in minter");
        assertEq(minter.getUserPendingMintCount(user), 0, "pending count decremented");
        uint256[] memory nn = new uint256[](1);
        nn[0] = nonce;
        IGoldMinter.MintOrder memory order = minter.getMintOrdersByNonces(nn)[0];
        assertTrue(order.isSettled, "order closed");
        assertFalse(order.success, "closed as failure (I3 exactly-once)");
    }

    // ---- T3: burn cancel after TTL -> escrowed gold returned ----

    function test_cancelExpiredBurn_returnsGold() public {
        (uint256 nonce, uint256 goldAmount) = _pendingBurn();
        assertEq(gold.balanceOf(address(minter)), goldAmount, "gold escrowed in minter");

        _warpPastTTL();
        vm.expectEmit(true, true, false, true);
        emit GoldMinter.CancelBurn(nonce, user, goldAmount);
        vm.prank(user);
        minter.cancelExpiredBurn(nonce);

        assertEq(gold.balanceOf(user), goldAmount, "gold returned to seller");
        assertEq(gold.balanceOf(address(minter)), 0);
        assertEq(minter.getUserPendingBurnCount(user), 0);
    }

    // ---- T4: non-owner call rejected ----

    function test_revert_cancel_notOwner() public {
        (uint256 nonce,) = _pendingMint();
        _warpPastTTL();
        vm.prank(attacker);
        vm.expectRevert(Errors.NotOrderOwner.selector);
        minter.cancelExpiredMint(nonce);
    }

    // ---- T5: blocked (sanctioned/under-level) users cannot self-cancel — resolve path only ----

    function test_revert_cancel_amlBlocked() public {
        (uint256 nonce,) = _pendingMint();
        _warpPastTTL();
        minter.setAMLBlacklist(user, true);
        vm.prank(user);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.cancelExpiredMint(nonce);
    }

    function test_revert_cancel_underlevel() public {
        (uint256 nonce,) = _pendingBurn();
        _warpPastTTL();
        minter.setLevel(user, IGoldMinter.Levels.DEFAULT);
        vm.prank(user);
        vm.expectRevert(Errors.Underlevel.selector);
        minter.cancelExpiredBurn(nonce);
    }

    // ---- T6: settler settlement always wins (cancel is only an escape hatch) ----

    function test_settlerSettleWins_evenAfterTTL() public {
        (uint256 nonce,) = _pendingMint();
        _warpPastTTL();

        minter.settleMint(nonce); // SETTLER may still settle after TTL
        assertGt(gold.balanceOf(user), 0, "settled: buyer got gold");

        vm.prank(user);
        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.cancelExpiredMint(nonce);
    }

    // ---- T7: no double cancel / no settle after cancel (I3 single-shot) ----

    function test_revert_doubleCancel_andSettleAfterCancel() public {
        (uint256 nonce,) = _pendingMint();
        _warpPastTTL();
        vm.prank(user);
        minter.cancelExpiredMint(nonce);

        vm.prank(user);
        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.cancelExpiredMint(nonce);

        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.settleMint(nonce);
    }

    // ---- T8: autoSettle orders settle on creation — nothing left to cancel ----

    function test_autoSettledOrder_notCancellable() public {
        minter.updateAutoSettle(); // on
        (uint256 nonce,) = _pendingMint(); // settles immediately
        _warpPastTTL();
        vm.prank(user);
        vm.expectRevert(Errors.AlreadySettled.selector);
        minter.cancelExpiredMint(nonce);
    }

    // ---- T9: orderTTL default, bounds, auth ----

    function test_orderTTL_default_bounds_and_auth() public {
        assertEq(minter.orderTTL(), 4 days, "default TTL");

        vm.expectRevert(Errors.InvalidOrderTTL.selector);
        minter.updateOrderTTL(6 hours - 1);
        vm.expectRevert(Errors.InvalidOrderTTL.selector);
        minter.updateOrderTTL(30 days + 1);

        vm.prank(attacker);
        vm.expectRevert();
        minter.updateOrderTTL(12 hours);

        vm.expectEmit(false, false, false, true);
        emit GoldMinter.UpdateOrderTTL(12 hours);
        minter.updateOrderTTL(12 hours);
        assertEq(minter.orderTTL(), 12 hours);
    }

    // ---- T10: legacy orders (requestTime==0) cannot be cancelled retroactively ----

    function test_legacyOrder_requestTimeZero_notCancellable() public {
        (uint256 nonce,) = _pendingMint();
        assertGt(minter.mintRequestTime(nonce), 0, "new orders record requestTime");

        // simulate a pre-upgrade order: zero out the requestTime slot
        stdstore.target(address(minter)).sig("mintRequestTime(uint256)").with_key(nonce).checked_write(uint256(0));
        assertEq(minter.mintRequestTime(nonce), 0, "legacy order simulated");

        vm.warp(block.timestamp + 365 days); // no matter how old
        vm.prank(user);
        vm.expectRevert(Errors.NotExpired.selector);
        minter.cancelExpiredMint(nonce);
    }
}
