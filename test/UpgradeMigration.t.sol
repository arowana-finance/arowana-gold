// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test } from "forge-std/Test.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { InitializableProxy } from "../contracts/proxy/InitializableProxy.sol";
import { ProxyFactory } from "../contracts/proxy/ProxyFactory.sol";
import { GoldMinter } from "../contracts/GoldMinter.sol";
import { IGoldMinter } from "../contracts/interfaces/IGoldMinter.sol";
import { GoldStreamVerifier } from "../contracts/oracles/GoldStreamVerifier.sol";
import { Errors } from "../contracts/libraries/Errors.sol";
import { ERC20Mock } from "../contracts/tokens/ERC20Mock.sol";

/// @dev Byte-exact replica of the LEGACY (audit-certik) GoldMinterStorage — same
///      ERC-7201 namespace slot, same 30 fields in the same order/types. Used to write
///      pre-upgrade state into a proxy and prove the new implementation preserves it.
///      Field #4 is `goldPriceFeed` (legacy name); the new impl renames it to
///      `_deprecatedGoldPriceFeed` (same type => same slot).
contract LegacyGoldMinterHarness is Initializable {
    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.GoldMinter")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant SLOT = 0x8cf47ae6e29ccadec338e18318c0b2861b9691ac34e27ee5f7478ced79517b00;

    struct LegacyStorage {
        address goldToken; // IERC20Mintable
        address USDT; // IERC20Exp
        address USDC; // IERC20Exp
        address goldPriceFeed; // IPriceFeed  <-- becomes dead slot
        mapping(address => uint8) levels;
        mapping(address => bool) amlBlacklist;
        mapping(address => uint256) kycNonces;
        IGoldMinter.MintOrder[] mintOrders;
        IGoldMinter.BurnOrder[] burnOrders;
        IGoldMinter.Levels tradeLevel;
        uint16 slippage;
        uint16 mintSpread;
        uint16 redeemSpread;
        uint16 mintFee;
        uint16 redeemFee;
        uint256 minMintAmount;
        uint256 minRedeemAmount;
        uint256 tradeUnit;
        address feeRecipient;
        uint256 minGoldFee;
        uint256 minGoldFeeAmount;
        bool autoSettle;
        address usdRecipient;
        uint256 maxPriceAge;
        uint256 minGoldPrice;
        uint256 maxGoldPrice;
        mapping(address => uint256[]) userMintNonces;
        mapping(address => uint256) userPendingMintCount;
        mapping(address => uint256[]) userBurnNonces;
        mapping(address => uint256) userPendingBurnCount;
    }

    function _s() private pure returns (LegacyStorage storage $) {
        assembly {
            $.slot := SLOT
        }
    }

    /// @dev Mimics the legacy initialize (initializer => consumes slot 1), so the new
    ///      impl's `migrateToDataStreams` (reinitializer(2)) is valid afterwards.
    function initializeLegacy(address goldToken, address usdt, address usdc, address priceFeed) external initializer {
        LegacyStorage storage $ = _s();
        $.goldToken = goldToken;
        $.USDT = usdt;
        $.USDC = usdc;
        $.goldPriceFeed = priceFeed;
        $.slippage = 500;
        $.mintSpread = 150;
        $.redeemSpread = 150;
        $.mintFee = 25;
        $.redeemFee = 25;
        $.minMintAmount = 1000 ether;
        $.minRedeemAmount = 1000 ether;
        $.minGoldFee = 2.5 ether;
        $.minGoldFeeAmount = 1000 ether;
        $.autoSettle = false;
        $.tradeLevel = IGoldMinter.Levels.KYCD;
        $.maxPriceAge = 10 minutes;
        $.minGoldPrice = 500e8;
        $.maxGoldPrice = 10000e8; // legacy ceiling
    }

    /// @dev Seed representative live state to check preservation across the upgrade.
    function seedState(address user, uint8 level, address feeRecip, address usdRecip) external {
        LegacyStorage storage $ = _s();
        $.levels[user] = level;
        $.kycNonces[user] = 7;
        $.feeRecipient = feeRecip;
        $.usdRecipient = usdRecip;
        $.tradeUnit = 1000 ether;
        $.userPendingMintCount[user] = 1;
        $.userMintNonces[user].push(0);
        $.mintOrders
            .push(
                IGoldMinter.MintOrder({
                    buyer: user,
                    usdToken: $.USDT,
                    usdAmount: 123_456e6,
                    minGoldAmount: 42 ether,
                    goldAmount: 43 ether,
                    feeAmount: 1 ether,
                    success: false,
                    isSettled: false
                })
            );
    }
}

contract UpgradeMigrationTest is Test {
    ProxyFactory factory;
    address proxyAdmin = makeAddr("proxyAdmin");
    address owner = address(this); // role admin on the proxy
    address user = makeAddr("user");

    ERC20Mock goldToken;
    ERC20Mock usdt;
    ERC20Mock usdc;
    address legacyPriceFeed = makeAddr("legacyDataFeed");
    address verifier = makeAddr("verifier"); // migration only stores the pointer

    function setUp() public {
        factory = new ProxyFactory();
        goldToken = new ERC20Mock("Gold", "OXAU", 18, 0);
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);
    }

    /// @dev Full legacy→v2 migration: deploy proxy on legacy impl, seed state, then
    ///      upgradeToAndCall into the new GoldMinter with migrateToDataStreams.
    function _deployLegacyAndUpgrade(uint64 ttl) internal returns (GoldMinter minter) {
        // 1) proxy on the LEGACY implementation, legacy initialize (consumes slot 1)
        address proxy = factory.deployProxy(
            keccak256("legacy.goldminter"),
            "Legacy GoldMinter",
            proxyAdmin,
            address(new LegacyGoldMinterHarness()),
            abi.encodeCall(
                LegacyGoldMinterHarness.initializeLegacy,
                (address(goldToken), address(usdt), address(usdc), legacyPriceFeed)
            )
        );
        LegacyGoldMinterHarness(proxy)
            .seedState(user, uint8(IGoldMinter.Levels.APPROVED), makeAddr("fee"), makeAddr("usd"));

        // 2) upgrade the SAME proxy to the new impl + atomic migration
        GoldMinter newImpl = new GoldMinter();
        vm.prank(proxyAdmin);
        InitializableProxy(payable(proxy))
            .upgradeToAndCall(address(newImpl), abi.encodeCall(GoldMinter.migrateToDataStreams, (verifier, ttl)));
        minter = GoldMinter(proxy);
    }

    // ---- storage preservation (the CRITICAL upgrade-safety property) ----

    function test_upgrade_preservesLegacyState() public {
        GoldMinter minter = _deployLegacyAndUpgrade(4 days);

        // fields the new impl reads at the same slots must survive verbatim
        assertEq(minter.levels(user), uint8(IGoldMinter.Levels.APPROVED), "levels preserved");
        assertEq(minter.kycNonces(user), 7, "kycNonces preserved");
        assertEq(minter.slippage(), 500, "slippage preserved");
        assertEq(minter.mintSpread(), 150, "mintSpread preserved");
        assertEq(minter.mintFee(), 25, "mintFee preserved");
        assertEq(minter.minMintAmount(), 1000 ether, "minMintAmount preserved");
        assertEq(minter.tradeUnit(), 1000 ether, "tradeUnit preserved");
        assertEq(minter.getUserPendingMintCount(user), 1, "pending count preserved");
        assertEq(address(minter.goldToken()), address(goldToken), "goldToken preserved");
        assertEq(minter.USDT(), address(usdt), "USDT preserved");

        // the seeded order survives at nonce 0 with all fields intact
        uint256[] memory nn = new uint256[](1);
        nn[0] = 0;
        IGoldMinter.MintOrder memory o = minter.getMintOrdersByNonces(nn)[0];
        assertEq(o.buyer, user, "order.buyer preserved");
        assertEq(o.usdAmount, 123_456e6, "order.usdAmount preserved");
        assertEq(o.goldAmount, 43 ether, "order.goldAmount preserved");
        assertFalse(o.isSettled, "order.isSettled preserved");
    }

    // ---- migration set the new state atomically ----

    function test_upgrade_setsVerifierAndTTL() public {
        GoldMinter minter = _deployLegacyAndUpgrade(4 days);
        assertEq(minter.goldStreamVerifier(), verifier, "verifier set by migration");
        assertEq(minter.orderTTL(), 4 days, "orderTTL set by migration");
    }

    // ---- Q3: the sanity ceiling auto-moves to $20k (constant, not the legacy storage $10k) ----

    function test_upgrade_priceBandCeilingIsNow20k() public {
        GoldMinter minter = _deployLegacyAndUpgrade(4 days);
        // legacy storage still holds maxGoldPrice = 10000e8 at its (now dead) slot, but the
        // new code reads the compile-time constant 20000e8 — a $15k/oz quote is IN band.
        // (pure quote path, no oracle call needed)
        uint256 q = minter.quoteGoldAmount(address(usdt), 1000e6, 15_000e8);
        assertGt(q, 0, "15k/oz is within the new $20k ceiling");
    }

    // ---- migration is one-shot (reinitializer(2)) ----

    function test_upgrade_migrationCannotRunTwice() public {
        GoldMinter minter = _deployLegacyAndUpgrade(4 days);
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        minter.migrateToDataStreams(verifier, 4 days);
    }

    // ---- CRITICAL (audit): data-less upgrade must NOT let an attacker seize the oracle ----

    /// @dev Reproduces the audited attack: an operator performs a data-less upgrade (no
    ///      migrate calldata), then an unauthorized caller tries to front-run the migration
    ///      to inject a malicious verifier. The proxy-admin check must block it, while the
    ///      real admin can still recover by calling migrate directly.
    function test_upgrade_dataLessUpgrade_attackerMigrateBlocked() public {
        // deploy legacy proxy + seed (reuse the helper's first half via a bare legacy deploy)
        address proxy = factory.deployProxy(
            keccak256("legacy.goldminter"),
            "Legacy GoldMinter",
            proxyAdmin,
            address(new LegacyGoldMinterHarness()),
            abi.encodeCall(
                LegacyGoldMinterHarness.initializeLegacy,
                (address(goldToken), address(usdt), address(usdc), legacyPriceFeed)
            )
        );

        // operator mistake: upgrade WITHOUT the migrate calldata → new impl live, verifier==0,
        // _initialized still 1 so reinitializer(2) is satisfiable by anyone.
        GoldMinter newImpl = new GoldMinter();
        vm.prank(proxyAdmin);
        InitializableProxy(payable(proxy)).upgradeToAndCall(address(newImpl), "");

        // attacker tries to seize the price oracle — MUST revert on the proxy-admin gate.
        address attacker = makeAddr("attacker");
        address evilVerifier = makeAddr("evilVerifier");
        vm.prank(attacker);
        vm.expectRevert(Errors.NotProxyAdmin.selector);
        GoldMinter(proxy).migrateToDataStreams(evilVerifier, 6 hours);

        // legitimate recovery: the real proxy admin can still migrate directly (msg.sender == admin).
        vm.prank(proxyAdmin);
        GoldMinter(proxy).migrateToDataStreams(verifier, 4 days);
        assertEq(GoldMinter(proxy).goldStreamVerifier(), verifier, "admin recovery migrate works");
        assertEq(GoldMinter(proxy).orderTTL(), 4 days);
    }

    // ---- migration validates its inputs ----

    function test_upgrade_revert_zeroVerifier() public {
        address proxy = factory.deployProxy(
            keccak256("legacy.goldminter"),
            "Legacy GoldMinter",
            proxyAdmin,
            address(new LegacyGoldMinterHarness()),
            abi.encodeCall(
                LegacyGoldMinterHarness.initializeLegacy,
                (address(goldToken), address(usdt), address(usdc), legacyPriceFeed)
            )
        );
        GoldMinter newImpl = new GoldMinter();
        vm.prank(proxyAdmin);
        vm.expectRevert(Errors.ZeroVerifier.selector);
        InitializableProxy(payable(proxy))
            .upgradeToAndCall(address(newImpl), abi.encodeCall(GoldMinter.migrateToDataStreams, (address(0), 4 days)));
    }

    function test_upgrade_revert_ttlOutOfBounds() public {
        address proxy = factory.deployProxy(
            keccak256("legacy.goldminter"),
            "Legacy GoldMinter",
            proxyAdmin,
            address(new LegacyGoldMinterHarness()),
            abi.encodeCall(
                LegacyGoldMinterHarness.initializeLegacy,
                (address(goldToken), address(usdt), address(usdc), legacyPriceFeed)
            )
        );
        GoldMinter newImpl = new GoldMinter();
        vm.prank(proxyAdmin);
        vm.expectRevert(Errors.InvalidOrderTTL.selector);
        InitializableProxy(payable(proxy))
            .upgradeToAndCall(address(newImpl), abi.encodeCall(GoldMinter.migrateToDataStreams, (verifier, 1 hours)));
    }
}
