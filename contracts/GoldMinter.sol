// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {
    ReentrancyGuardTransientUpgradeable
} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardTransientUpgradeable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import { EIP712Upgradeable } from "@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import { ERC1967Utils } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils.sol";
import { IERC20Exp, IERC20Mintable } from "./interfaces/IERC20.sol";
import { IPriceFeed } from "./interfaces/IPriceFeed.sol";
import { GoldStreamVerifier } from "./oracles/GoldStreamVerifier.sol";
import { IGoldMinter } from "./interfaces/IGoldMinter.sol";
import { GoldMinterLib } from "./libraries/GoldMinterLib.sol";
import { MinterShared } from "./libraries/MinterShared.sol";
import { MintLogic } from "./libraries/MintLogic.sol";
import { BurnLogic } from "./libraries/BurnLogic.sol";
import { Errors } from "./libraries/Errors.sol";

/// @dev Core logic lives in linked external libraries (MintLogic, BurnLogic, GoldMinterLib)
///      that operate on this contract's storage via delegatecall, keeping the deployed
///      bytecode under the 24KB limit. The upgrade validator cannot check linked libraries,
///      so the annotation below skips them; that is safe only while every such library
///      declares no state of its own (constants only) and touches storage solely through the
///      passed-in storage pointer.
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract GoldMinter is
    AccessControlUpgradeable,
    ReentrancyGuardTransientUpgradeable,
    PausableUpgradeable,
    EIP712Upgradeable
{
    using SafeERC20 for IERC20Exp;
    using SafeERC20 for IERC20Mintable;

    // ============ Constants ============

    // Unit conversion constants — single source in MinterShared, re-exposed for ABI compat.
    uint256 public constant GRAMS_PER_OUNCE = MinterShared.GRAMS_PER_OUNCE;
    uint256 public constant CONVERSION_PRECISION = MinterShared.CONVERSION_PRECISION;

    // order-TTL bounds for self-cancel
    uint64 public constant MIN_ORDER_TTL = 6 hours;
    uint64 public constant MAX_ORDER_TTL = 30 days;

    // ============ Role Constants ============

    /// @notice SETTLER_ROLE - order settlement execution authority (settleMint, settleBurn)
    /// keccak256("SETTLER_ROLE")
    bytes32 public constant SETTLER_ROLE = 0x6666bf5bfee463d10a7fc50448047f8a53b7762d7e28fbc5c643182785f3fd3f;

    /// @notice PARAMETER_MANAGER_ROLE - transaction parameter management authority
    /// keccak256("PARAMETER_MANAGER_ROLE")
    bytes32 public constant PARAMETER_MANAGER_ROLE = 0xf7e61c4e74c42df4eeae815b78ea28052584091f2e136a00ad566b99fd705839;

    /// @notice INFRA_MANAGER_ROLE - oracle/Infrastructure Configuration Permissions
    /// keccak256("INFRA_MANAGER_ROLE")
    bytes32 public constant INFRA_MANAGER_ROLE = 0x38e3514d14a43b32346641d4cce38d023dcec3c7e11e9c363aa96dd6981420ee;

    /// @notice KYC_MANAGER_ROLE - KYC/AML management authority
    /// keccak256("KYC_MANAGER_ROLE")
    bytes32 public constant KYC_MANAGER_ROLE = 0x6f35daacd116f0f629c42d5459fd6842d505964e6828899d889573dc5bc51cf8;

    // EIP-712 type hashes — single source of truth in GoldMinterLib (the code that
    // actually recovers signers), re-exposed here for ABI/off-chain consumers. This
    // prevents the two definitions silently diverging (a keccak string mismatch would
    // break every KYC signature and the compiler cannot catch it).
    bytes32 public constant KYC_MINT_REQUEST_TYPEHASH = GoldMinterLib.KYC_MINT_REQUEST_TYPEHASH;
    bytes32 public constant KYC_BURN_REQUEST_TYPEHASH = GoldMinterLib.KYC_BURN_REQUEST_TYPEHASH;
    bytes32 public constant TRADE_WINDOW_TYPEHASH = GoldMinterLib.TRADE_WINDOW_TYPEHASH;

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.GoldMinter")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant GoldMinterStorageLocation =
        0x8cf47ae6e29ccadec338e18318c0b2861b9691ac34e27ee5f7478ced79517b00;

    // ============ Storage ============

    /// @custom:storage-location erc7201:openzeppelin.storage.GoldMinter
    struct GoldMinterStorage {
        IERC20Mintable goldToken;
        IERC20Exp USDT;
        IERC20Exp USDC;
        IPriceFeed _deprecatedGoldPriceFeed; // formerly goldPriceFeed; never read post Data Streams migration. DO NOT reuse.
        mapping(address => uint8) levels;
        mapping(address => bool) amlBlacklist;
        mapping(address => uint256) kycNonces;
        IGoldMinter.MintOrder[] mintOrders;
        IGoldMinter.BurnOrder[] burnOrders;
        IGoldMinter.Levels tradeLevel;
        uint16 slippage;
        uint16 mintSpread; // Spread for mint (e.g., 150 = 1.5%)
        uint16 redeemSpread; // Spread for redeem (e.g., 150 = 1.5%)
        uint16 mintFee; // Fee for mint (e.g., 25 = 0.25%)
        uint16 redeemFee; // Fee for redeem (e.g., 25 = 0.25%)
        uint256 minMintAmount; // Minimum gold amount for mint (e.g., 1 ether = 1 gram)
        uint256 minRedeemAmount; // Minimum gold amount for redeem (e.g., 1 ether = 1 gram)
        uint256 tradeUnit; // 0 = disabled (free amount), >0 = enforced unit (e.g., 1000 ether = 1kg)
        address feeRecipient; // Gold fee recipient (separate from usdRecipient)
        uint256 minGoldFee;
        uint256 minGoldFeeAmount;
        bool autoSettle;
        address usdRecipient;
        uint256 maxPriceAge; // DEPRECATED dead slot: staleness now enforced by report.expiresAt
        uint256 minGoldPrice; // DEPRECATED dead slot: sanity band is now MinterShared.MIN_GOLD_PRICE (compile-time). DO NOT reuse.
        uint256 maxGoldPrice; // DEPRECATED dead slot: sanity band is now MinterShared.MAX_GOLD_PRICE (compile-time). DO NOT reuse.
        // User mint tracking
        mapping(address => uint256[]) userMintNonces;
        mapping(address => uint256) userPendingMintCount;
        // User burn tracking
        mapping(address => uint256[]) userBurnNonces;
        mapping(address => uint256) userPendingBurnCount;
        // Chainlink Data Streams (pull) price oracle. Appended at struct end to
        // preserve ERC-7201 layout on upgrade. `goldPriceFeed` above is now a
        // DEPRECATED dead slot (no longer read).
        GoldStreamVerifier goldStreamVerifier;
        // order-TTL escape hatch. Appended at struct end (ERC-7201).
        // orderTTL == 0 => cancel disabled (safe default on upgraded legacy proxies until
        // updateOrderTTL is called). Legacy orders have requestTime == 0 => never cancellable.
        uint64 orderTTL;
        mapping(uint256 => uint64) mintRequestTime;
        mapping(uint256 => uint64) burnRequestTime;
        // Business-hours trade-window gate (R8): Permit2-style unordered nonce bitmap.
        // Appended at struct end (ERC-7201 append-only). user => wordPos => 256-bit map.
        // No dates/holidays stored on-chain — the backend (KYC_MANAGER) issues a signed
        // window only during business hours; on-chain we verify signer+time+nonce.
        mapping(address => mapping(uint256 => uint256)) tradeWindowNonceBitmap;
    }

    // ============ Events ============

    event RequestMint(
        uint256 indexed nonce, address indexed buyer, address usdToken, uint256 usdAmount, uint256 minGoldAmount
    );
    event SettleMint(uint256 indexed nonce, uint256 goldAmount, uint256 feeAmount, bool success);
    event RequestBurn(
        uint256 indexed nonce, address indexed seller, address usdToken, uint256 goldAmount, uint256 minUsdAmount
    );
    event SettleBurn(uint256 indexed nonce, uint256 usdAmount, uint256 feeAmount, bool success);

    /// @dev Emitted when a SETTLER resolves a mint order trapped by the settlement
    ///      permission gate. `refunded` = USD returned to buyer; otherwise retained
    ///      at the treasury (sanctioned buyer).
    event ResolveMint(uint256 indexed nonce, address indexed buyer, bool refunded, uint256 usdAmount);
    /// @dev Emitted when a SETTLER resolves a burn order trapped by the settlement
    ///      permission gate. The custodied gold is sent to `to` — the seller
    ///      (under-level) or a compliance/treasury address (sanctioned seller).
    event ResolveBurn(uint256 indexed nonce, address indexed seller, address indexed to, uint256 goldAmount);

    /// @dev Owner self-cancel of a TTL-expired pending order (escrow returned).
    event CancelMint(uint256 indexed nonce, address indexed buyer, uint256 usdAmount);
    event CancelBurn(uint256 indexed nonce, address indexed seller, uint256 goldAmount);
    event UpdateOrderTTL(uint64 orderTTL);

    event UpdateLevel(address indexed user, IGoldMinter.Levels level);
    event UpdateSlippage(uint16 newSlippage);
    event UpdateGoldStreamVerifier(address newVerifier);
    event UpdateMintSpread(uint16 newMintSpread);
    event UpdateRedeemSpread(uint16 newRedeemSpread);
    event UpdateMintFee(uint16 newMintFee);
    event UpdateRedeemFee(uint16 newRedeemFee);
    event UpdateMinMintAmount(uint256 minMintAmount);
    event UpdateMinRedeemAmount(uint256 minRedeemAmount);
    event UpdateMinGoldFee(uint256 minGoldFee);
    event UpdateMinGoldFeeAmount(uint256 minGoldFeeAmount);
    event UpdateAutoSettle(bool settle);
    event UpdateTradingLevel(IGoldMinter.Levels level);
    event UpdateRecipient(address newRecipient);
    event UpdateFeeRecipient(address newFeeRecipient);
    event UpdateTradeUnit(uint256 tradeUnit);

    event AMLBlacklisted(address indexed user, bool blacklisted);
    event EmergencyPaused(address indexed by, bool paused);

    event KYCMintRequested(
        address indexed user,
        IGoldMinter.Levels newLevel,
        uint256 indexed nonce,
        address usdToken,
        uint256 usdAmount,
        uint256 minGoldAmount
    );
    event KYCBurnRequested(
        address indexed user,
        IGoldMinter.Levels newLevel,
        uint256 indexed nonce,
        address usdToken,
        uint256 goldAmount,
        uint256 minUsdAmount
    );

    event Initialized(
        address goldToken,
        uint8 goldTokenDecimals,
        address USDT,
        uint8 USDTDecimals,
        address USDC,
        uint8 USDCDecimals,
        address goldStreamVerifier
    );

    // ============ Constructor ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initializeGoldMinter(
        address _goldToken,
        address _USDT,
        address _USDC,
        address _goldStreamVerifier,
        address _usdRecipient,
        address _feeRecipient,
        address _owner,
        bool _autoSettle
    ) public virtual initializer {
        if (_goldToken == address(0)) revert Errors.ZeroGoldToken();
        if (_USDT == address(0)) revert Errors.ZeroUSDT();
        if (_USDC == address(0)) revert Errors.ZeroUSDC();
        if (_goldStreamVerifier == address(0)) revert Errors.ZeroVerifier();
        if (_usdRecipient == address(0)) revert Errors.ZeroRecipient();
        if (_feeRecipient == address(0)) revert Errors.ZeroRecipient();
        if (_owner == address(0)) revert Errors.ZeroOwner();

        GoldMinterStorage storage $ = _getGoldMinterStorage();

        $.goldToken = IERC20Mintable(_goldToken);
        $.USDT = IERC20Exp(_USDT);
        $.USDC = IERC20Exp(_USDC);
        $.goldStreamVerifier = GoldStreamVerifier(_goldStreamVerifier);

        $.slippage = 500; // 5%
        $.mintSpread = 150; // 1.5%
        $.redeemSpread = 150; // 1.5%
        $.mintFee = 25; // 0.25%
        $.redeemFee = 25; // 0.25%
        $.minMintAmount = 1000 ether; // 1kg
        $.minRedeemAmount = 1000 ether; // 1kg
        $.minGoldFee = 2.5 ether; // 2.5 gram
        $.minGoldFeeAmount = 1000 ether; // 1kg
        $.autoSettle = _autoSettle;
        $.tradeLevel = IGoldMinter.Levels.KYCD;
        $.usdRecipient = _usdRecipient;
        $.feeRecipient = _feeRecipient;
        // maxPriceAge intentionally left unset (0): it is a deprecated dead slot.
        // Report staleness is enforced by GoldStreamVerifier (report.expiresAt + maxReportAge).
        // minGoldPrice/maxGoldPrice are also dead slots now — the sanity band is a
        // compile-time constant in MinterShared, so nothing to set here.
        $.orderTTL = 4 days; // user self-cancel window (0 would disable cancel)

        // transient (EIP-1153) guard — the old ReentrancyGuardUpgradeable's
        // ERC-7201 namespace (openzeppelin.storage.ReentrancyGuard) remains a dead namespace.
        __ReentrancyGuardTransient_init();
        __Pausable_init();
        __EIP712_init("GoldMinter", "1");
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, _owner);

        _emitInitialize();
    }

    // ============ External Functions ============

    /// @notice Request mint with KYC signature and optional permit (recommended flow)
    function requestMintWithKYC(
        IGoldMinter.KYCMintRequest memory kycRequest,
        bytes memory kycSignature,
        bytes memory permitSignature,
        bytes calldata report,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature
    ) external nonReentrant whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        if (msg.sender != kycRequest.user) revert Errors.InvalidSignature();
        if (kycSignature.length == 0) revert Errors.ZeroSignature();

        _processKYC($, kycRequest, kycSignature);

        _processUSDPermit($, kycRequest.usdToken, kycRequest.usdAmount, kycRequest.deadline, permitSignature);

        _gateRequestMint(
            $, tradeWindow, tradeWindowSignature, kycRequest.usdToken, kycRequest.usdAmount, kycRequest.minGoldAmount, report
        );
    }

    /// @notice Request mint with ERC-2612 permit (no KYC update, requires pre-set KYC level)
    function requestMintPermit(
        address _usdToken,
        uint256 _usdAmount,
        uint256 _minGoldAmount,
        uint256 _sigDeadline,
        bytes memory _signature,
        bytes calldata report,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature
    ) external nonReentrant whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        _processUSDPermit($, _usdToken, _usdAmount, _sigDeadline, _signature);

        _gateRequestMint($, tradeWindow, tradeWindowSignature, _usdToken, _usdAmount, _minGoldAmount, report);
    }

    /// @notice Request burn with KYC signature and optional permit (recommended flow)
    function requestBurnWithKYC(
        IGoldMinter.KYCBurnRequest memory kycRequest,
        bytes memory kycSignature,
        bytes memory permitSignature,
        bytes calldata report,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature
    ) external nonReentrant whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (msg.sender != kycRequest.user) revert Errors.InvalidSignature();
        if (kycSignature.length == 0) revert Errors.ZeroSignature();

        _processKYCBurn($, kycRequest, kycSignature);

        _processGoldPermit($, kycRequest.goldAmount, kycRequest.deadline, permitSignature);

        _gateRequestBurn(
            $, tradeWindow, tradeWindowSignature, kycRequest.usdToken, kycRequest.goldAmount, kycRequest.minUsdAmount, report
        );
    }

    /// @notice Request burn with ERC-2612 permit (no KYC update, requires pre-set KYC level)
    function requestBurnPermit(
        address _usdToken,
        uint256 _goldAmount,
        uint256 _minUsdAmount,
        uint256 _sigDeadline,
        bytes memory _signature,
        bytes calldata report,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature
    ) external nonReentrant whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        _processGoldPermit($, _goldAmount, _sigDeadline, _signature);

        _gateRequestBurn($, tradeWindow, tradeWindowSignature, _usdToken, _goldAmount, _minUsdAmount, report);
    }

    function setLevel(address user, IGoldMinter.Levels level) external onlyRole(KYC_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.levels[user] = uint8(level);
        $.kycNonces[user]++;
        emit UpdateLevel(user, level);
    }

    function updateSlippage(uint16 _slippage) external onlyRole(PARAMETER_MANAGER_ROLE) {
        if (_slippage > 500) revert Errors.Overflow();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.slippage = _slippage;
        emit UpdateSlippage(_slippage);
    }

    function updateGoldStreamVerifier(address _goldStreamVerifier) external onlyRole(INFRA_MANAGER_ROLE) {
        if (_goldStreamVerifier == address(0)) revert Errors.ZeroVerifier();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.goldStreamVerifier = GoldStreamVerifier(_goldStreamVerifier);
        emit UpdateGoldStreamVerifier(_goldStreamVerifier);
    }

    /// @notice One-time setter for upgrades from the legacy push-feed layout.
    function setGoldStreamVerifierOnce(address _goldStreamVerifier) external onlyRole(INFRA_MANAGER_ROLE) {
        if (_goldStreamVerifier == address(0)) revert Errors.ZeroVerifier();

        GoldMinterStorage storage $ = _getGoldMinterStorage();
        if (address($.goldStreamVerifier) != address(0)) revert Errors.VerifierAlreadySet();
        $.goldStreamVerifier = GoldStreamVerifier(_goldStreamVerifier);
        emit UpdateGoldStreamVerifier(_goldStreamVerifier);
    }

    /// @notice Post-upgrade migration (legacy Functions/Automation → Data Streams): sets the
    ///         verifier + order-TTL atomically so no zero-verifier window (which reverts every
    ///         request) is ever observable on-chain.
    /// @dev reinitializer(2) runs exactly once (legacy `initialize` took slot 1) and does NOT
    ///      re-run the parent inits (EIP-712/AccessControl/Pausable) already set on the live
    ///      proxy; the transient guard is stateless. reinitializer authenticates nothing, so the
    ///      proxy-admin check below is the real gate: this must run as the delegatecall `data` of
    ///      `upgradeToAndCall` (ifAdmin). A data-less upgrade that leaves it uncalled would let
    ///      anyone inject a malicious verifier and, via autoSettle, mint at a chosen price — same
    ///      class as the ProxyFactory atomic-init fix. See script/Upgrade.s.sol.
    function migrateToDataStreams(address _verifier, uint64 _orderTTL) external reinitializer(2) {
        if (msg.sender != ERC1967Utils.getAdmin()) revert Errors.NotProxyAdmin(); // gate — see @dev
        if (_verifier == address(0)) revert Errors.ZeroVerifier();
        if (_orderTTL < MIN_ORDER_TTL || _orderTTL > MAX_ORDER_TTL) revert Errors.InvalidOrderTTL();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.goldStreamVerifier = GoldStreamVerifier(_verifier);
        $.orderTTL = _orderTTL;
        emit UpdateGoldStreamVerifier(_verifier);
        emit UpdateOrderTTL(_orderTTL);
    }

    function updateMintSpread(uint16 _mintSpread) external onlyRole(PARAMETER_MANAGER_ROLE) {
        if (_mintSpread > 300) revert Errors.Overflow(); // Max 3%
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.mintSpread = _mintSpread;
        emit UpdateMintSpread(_mintSpread);
    }

    function updateRedeemSpread(uint16 _redeemSpread) external onlyRole(PARAMETER_MANAGER_ROLE) {
        if (_redeemSpread > 300) revert Errors.Overflow(); // Max 3%
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.redeemSpread = _redeemSpread;
        emit UpdateRedeemSpread(_redeemSpread);
    }

    function updateMintFee(uint16 _mintFee) external onlyRole(PARAMETER_MANAGER_ROLE) {
        if (_mintFee > 100) revert Errors.Overflow(); // Max 1%
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.mintFee = _mintFee;
        emit UpdateMintFee(_mintFee);
    }

    function updateRedeemFee(uint16 _redeemFee) external onlyRole(PARAMETER_MANAGER_ROLE) {
        if (_redeemFee > 100) revert Errors.Overflow(); // Max 1%
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.redeemFee = _redeemFee;
        emit UpdateRedeemFee(_redeemFee);
    }

    function updateMinMintAmount(uint256 _minMintAmount) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        _validateFeeVsMinimum($.minGoldFee, _minMintAmount);
        $.minMintAmount = _minMintAmount;
        emit UpdateMinMintAmount(_minMintAmount);
    }

    function updateMinRedeemAmount(uint256 _minRedeemAmount) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        _validateFeeVsMinimum($.minGoldFee, _minRedeemAmount);
        $.minRedeemAmount = _minRedeemAmount;
        emit UpdateMinRedeemAmount(_minRedeemAmount);
    }

    function updateMinGoldFee(uint256 _minGoldFee) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        _validateFeeVsMinimum(_minGoldFee, $.minMintAmount);
        _validateFeeVsMinimum(_minGoldFee, $.minRedeemAmount);
        if ($.tradeUnit > 0) _validateFeeVsMinimum(_minGoldFee, $.tradeUnit);
        $.minGoldFee = _minGoldFee;
        emit UpdateMinGoldFee(_minGoldFee);
    }

    function updateMinGoldFeeAmount(uint256 _minGoldFeeAmount) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        _validateFeeVsMinimum($.minGoldFee, _minGoldFeeAmount);
        $.minGoldFeeAmount = _minGoldFeeAmount;
        emit UpdateMinGoldFeeAmount(_minGoldFeeAmount);
    }

    function updateAutoSettle() external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.autoSettle = !$.autoSettle;
        emit UpdateAutoSettle($.autoSettle);
    }

    /// @notice Self-cancel TTL. Bounds: [MIN_ORDER_TTL, MAX_ORDER_TTL].
    ///         Lower bound prevents a free "observe the price, then cancel" option; upper bound keeps the escape hatch effective.
    function updateOrderTTL(uint64 _orderTTL) external onlyRole(PARAMETER_MANAGER_ROLE) {
        if (_orderTTL < MIN_ORDER_TTL || _orderTTL > MAX_ORDER_TTL) revert Errors.InvalidOrderTTL();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.orderTTL = _orderTTL;
        emit UpdateOrderTTL(_orderTTL);
    }

    function updateTradingLevel(IGoldMinter.Levels level) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.tradeLevel = level;
        emit UpdateTradingLevel(level);
    }

    function updateRecipient(address _usdRecipient) external onlyRole(INFRA_MANAGER_ROLE) {
        if (_usdRecipient == address(0)) revert Errors.ZeroUSDRecipient();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.usdRecipient = _usdRecipient;
        emit UpdateRecipient(_usdRecipient);
    }

    function updateFeeRecipient(address _feeRecipient) external onlyRole(INFRA_MANAGER_ROLE) {
        if (_feeRecipient == address(0)) revert Errors.ZeroRecipient();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.feeRecipient = _feeRecipient;
        emit UpdateFeeRecipient(_feeRecipient);
    }

    function updateTradeUnit(uint256 _tradeUnit) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        if (_tradeUnit > 0) _validateFeeVsMinimum($.minGoldFee, _tradeUnit);
        $.tradeUnit = _tradeUnit;
        emit UpdateTradeUnit(_tradeUnit);
    }

    function setAMLBlacklist(address user, bool blacklisted) external onlyRole(KYC_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.amlBlacklist[user] = blacklisted;
        emit AMLBlacklisted(user, blacklisted);
    }

    function emergencyPause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit EmergencyPaused(msg.sender, true);
    }

    function emergencyUnpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyPaused(msg.sender, false);
    }

    function isAMLBlacklisted(address user) external view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.amlBlacklist[user];
    }

    /// @notice Get total mint count for a user
    function getUserMintCount(address user) external view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.userMintNonces[user].length;
    }

    /// @notice Get pending mint count for a user
    function getUserPendingMintCount(address user) external view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.userPendingMintCount[user];
    }

    /// @notice Get mint nonces for a user with pagination
    /// @param user The user address
    /// @param offset Starting index
    /// @param limit Maximum number of nonces to return
    function getUserMintNonces(address user, uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        uint256[] storage nonces = $.userMintNonces[user];
        uint256 total = nonces.length;

        if (offset >= total) {
            return new uint256[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256[] memory result = new uint256[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = nonces[i];
        }

        return result;
    }

    /// @notice Get mint orders by nonces
    /// @param nonces Array of mint nonces to query
    function getMintOrdersByNonces(uint256[] calldata nonces) external view returns (IGoldMinter.MintOrder[] memory) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        uint256 len = nonces.length;
        IGoldMinter.MintOrder[] memory orders = new IGoldMinter.MintOrder[](len);

        for (uint256 i = 0; i < len; i++) {
            if (nonces[i] < $.mintOrders.length) {
                orders[i] = $.mintOrders[nonces[i]];
            }
        }

        return orders;
    }

    /// @notice Get total burn count for a user
    function getUserBurnCount(address user) external view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.userBurnNonces[user].length;
    }

    /// @notice Get pending burn count for a user
    function getUserPendingBurnCount(address user) external view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.userPendingBurnCount[user];
    }

    /// @notice Get burn nonces for a user with pagination
    /// @param user The user address
    /// @param offset Starting index
    /// @param limit Maximum number of nonces to return
    function getUserBurnNonces(address user, uint256 offset, uint256 limit) external view returns (uint256[] memory) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        uint256[] storage nonces = $.userBurnNonces[user];
        uint256 total = nonces.length;

        if (offset >= total) {
            return new uint256[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        uint256[] memory result = new uint256[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = nonces[i];
        }

        return result;
    }

    /// @notice Get burn orders by nonces
    /// @param nonces Array of burn nonces to query
    function getBurnOrdersByNonces(uint256[] calldata nonces) external view returns (IGoldMinter.BurnOrder[] memory) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        uint256 len = nonces.length;
        IGoldMinter.BurnOrder[] memory orders = new IGoldMinter.BurnOrder[](len);

        for (uint256 i = 0; i < len; i++) {
            if (nonces[i] < $.burnOrders.length) {
                orders[i] = $.burnOrders[nonces[i]];
            }
        }

        return orders;
    }

    // ============ Public Functions ============

    function settleMint(uint256 mintNonce) public nonReentrant onlyRole(SETTLER_ROLE) {
        MintLogic.settleMint(_getGoldMinterStorage(), mintNonce);
    }

    function settleBurn(uint256 burnNonce) public nonReentrant onlyRole(SETTLER_ROLE) {
        BurnLogic.settleBurn(_getGoldMinterStorage(), burnNonce);
    }

    /// @notice Resolve a mint order that can never be settled because the buyer
    ///         fails the settlement permission gate (AML/blacklist/under-level).
    ///         Without this, the buyer's USD — moved to `usdRecipient` at request
    ///         time — would be trapped forever (the settle path reverts before its
    ///         refund branch). The blocking policy itself is preserved; this only
    ///         gives SETTLER an explicit lever to release or retain the funds.
    /// @dev The outcome is determined by the block reason, NOT by settler discretion:
    ///      an AML-blocked (sanctioned) buyer's USD is retained at the treasury; a
    ///      merely under-level (non-sanctioned) buyer is refunded. To seize a buyer's
    ///      funds, formally AML-blacklist them first (KYC_MANAGER) — this keeps seizure
    ///      behind a separate role and prevents an innocent under-level user being harmed.
    function resolveBlockedMint(uint256 mintNonce) external nonReentrant onlyRole(SETTLER_ROLE) {
        MintLogic.resolveBlockedMint(_getGoldMinterStorage(), mintNonce);
    }

    /// @notice Owner self-cancel of an unsettled mint order past its TTL (refunds escrowed USD).
    ///         Escape hatch when no settler is available. Blocked (sanctioned/under-level) users must use the resolve path only.
    /// @dev Intentionally no pause gate — like resolve, the escape hatch must always remain operational.
    function cancelExpiredMint(uint256 mintNonce) external nonReentrant {
        MintLogic.cancelExpiredMint(_getGoldMinterStorage(), mintNonce);
    }

    /// @notice Resolve a burn order that can never be settled because the seller
    ///         fails the settlement permission gate. The seller's gold sits in this
    ///         contract; without this it would be trapped forever. SETTLER sends it
    ///         to `to` — the seller (under-level) or a compliance/treasury address
    ///         (sanctioned seller). Returning gold to a sanctioned seller is blocked.
    function resolveBlockedBurn(uint256 burnNonce, address to) external nonReentrant onlyRole(SETTLER_ROLE) {
        BurnLogic.resolveBlockedBurn(_getGoldMinterStorage(), burnNonce, to);
    }

    /// @notice Owner self-cancel of an unsettled burn order past its TTL (returns escrowed gold).
    ///         Escape hatch when no settler is available. Blocked (sanctioned/under-level) users must use the resolve path only.
    /// @dev Intentionally no pause gate — like resolve, the escape hatch must always remain operational.
    function cancelExpiredBurn(uint256 burnNonce) external nonReentrant {
        BurnLogic.cancelExpiredBurn(_getGoldMinterStorage(), burnNonce);
    }

    /// @notice Request mint with pre-set KYC level (requires approval in advance)
    /// @dev When tradeUnit > 0 (unit mode): _minGoldAmount = gross gold amount (must be tradeUnit multiple),
    ///      _usdAmount = maximum USD willing to pay. When tradeUnit == 0 (free mode): current behavior.
    function requestMint(
        address _usdToken,
        uint256 _usdAmount,
        uint256 _minGoldAmount,
        bytes calldata report,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature
    ) public nonReentrant whenNotPaused {
        _gateRequestMint(
            _getGoldMinterStorage(), tradeWindow, tradeWindowSignature, _usdToken, _usdAmount, _minGoldAmount, report
        );
    }

    /// @notice Request burn with pre-set KYC level (requires approval in advance)
    function requestBurn(
        address _usdToken,
        uint256 _goldAmount,
        uint256 _minUsdAmount,
        bytes calldata report,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature
    ) public nonReentrant whenNotPaused {
        _gateRequestBurn(
            _getGoldMinterStorage(), tradeWindow, tradeWindowSignature, _usdToken, _goldAmount, _minUsdAmount, report
        );
    }

    /// @notice Gold amount for a given USD amount at a supplied 8-decimal ounce price.
    /// @dev Pure quote (price supplied by caller). The request path locks the price
    ///      from a verified Data Streams report; off-chain callers pass a quoted price.
    function quoteGoldAmount(address usdToken, uint256 usdAmount, uint256 price8) public view returns (uint256) {
        return MinterShared.quoteGoldAmount(_getGoldMinterStorage(), usdToken, usdAmount, price8);
    }

    /// @notice Inverse of quoteGoldAmount: required USD for a given gold amount (with mintSpread, ceiling).
    function quoteRequiredUsd(address usdToken, uint256 goldAmount, uint256 price8) public view returns (uint256) {
        return MinterShared.quoteRequiredUsd(_getGoldMinterStorage(), usdToken, goldAmount, price8);
    }

    /// @notice USD amount for a given gold amount at a supplied 8-decimal ounce price (with redeemSpread).
    function quoteUsdAmount(address usdToken, uint256 goldAmount, uint256 price8) public view returns (uint256) {
        return MinterShared.quoteUsdAmount(_getGoldMinterStorage(), usdToken, goldAmount, price8);
    }

    function canBurn(IERC20Exp usdToken, uint256 usdAmount) public view returns (bool) {
        return MinterShared.canBurn(_getGoldMinterStorage(), usdToken, usdAmount);
    }

    function mintSpread() public view returns (uint16) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.mintSpread;
    }

    function redeemSpread() public view returns (uint16) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.redeemSpread;
    }

    function mintFee() public view returns (uint16) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.mintFee;
    }

    function redeemFee() public view returns (uint16) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.redeemFee;
    }

    function goldToken() public view returns (address) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return address($.goldToken);
    }

    function USDT() public view returns (address) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return address($.USDT);
    }

    function USDC() public view returns (address) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return address($.USDC);
    }

    function slippage() public view returns (uint16) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.slippage;
    }

    function tradeLevel() public view returns (IGoldMinter.Levels) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.tradeLevel;
    }

    function minMintAmount() public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.minMintAmount;
    }

    function minRedeemAmount() public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.minRedeemAmount;
    }

    function tradeUnit() public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.tradeUnit;
    }

    function orderTTL() public view returns (uint64) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.orderTTL;
    }

    /// @notice The active Data Streams verifier (price source). 0 until migration/init.
    function goldStreamVerifier() public view returns (address) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return address($.goldStreamVerifier);
    }

    /// @notice Request timestamps for the TTL escape hatch (0 = legacy/pre-upgrade order).
    function mintRequestTime(uint256 nonce) public view returns (uint64) {
        return _getGoldMinterStorage().mintRequestTime[nonce];
    }

    function burnRequestTime(uint256 nonce) public view returns (uint64) {
        return _getGoldMinterStorage().burnRequestTime[nonce];
    }

    function feeRecipient() public view returns (address) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.feeRecipient;
    }

    function minGoldFee() public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.minGoldFee;
    }

    function minGoldFeeAmount() public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.minGoldFeeAmount;
    }

    function kycNonces(address _target) public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.kycNonces[_target];
    }

    /// @notice Whether a business-hours trade-window nonce has been consumed for a user.
    /// @dev Permit2-style unordered bitmap: nonce = (wordPos << 8) | bitPos.
    function isTradeWindowNonceUsed(address user, uint256 nonce) external view returns (bool) {
        uint256 wordPos = nonce >> 8;
        uint256 bit = 1 << (nonce & 0xff);
        return (_getGoldMinterStorage().tradeWindowNonceBitmap[user][wordPos] & bit) != 0;
    }

    function levels(address _target) public view returns (uint8) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.levels[_target];
    }

    /// @dev Return fee amount in Gold
    /// @notice Fee is calculated based on 1 OXAU price (gold price ± spread)
    /// @param _goldAmount Amount of gold to calculate fee for
    /// @param isMint True for mint fee, false for redeem fee
    function calculateGoldFee(uint256 _goldAmount, bool isMint) public view returns (uint256) {
        return MinterShared.calculateGoldFee(_getGoldMinterStorage(), _goldAmount, isMint);
    }

    // ============ Internal Functions ============

    /// @dev Business-hours funnel — all 3 mint entry points converge here, so the gate is
    ///      enforced in ONE place. No future entry point can bypass it as long as it routes
    ///      through this funnel. `report` stays calldata end-to-end (no memory copy).
    function _gateRequestMint(
        GoldMinterStorage storage $,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature,
        address usdToken,
        uint256 usdAmount,
        uint256 minGoldAmount,
        bytes calldata report
    ) internal {
        _consumeTradeWindow($, tradeWindow, tradeWindowSignature);
        MintLogic.requestMint($, usdToken, usdAmount, minGoldAmount, report);
    }

    /// @dev Business-hours funnel — all 3 burn entry points converge here (see _gateRequestMint).
    function _gateRequestBurn(
        GoldMinterStorage storage $,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory tradeWindowSignature,
        address usdToken,
        uint256 goldAmount,
        uint256 minUsdAmount,
        bytes calldata report
    ) internal {
        _consumeTradeWindow($, tradeWindow, tradeWindowSignature);
        BurnLogic.requestBurn($, usdToken, goldAmount, minUsdAmount, report);
    }

    /// @dev Enforce the business-hours trade window: a KYC_MANAGER-signed EIP-712 window
    ///      bound to msg.sender, valid only within [validAfter, validBefore], single-use.
    ///      Hours/holidays live off-chain — the backend simply does not sign when closed.
    ///      The time window is bound INTO the signature (Permit2 pattern), so a public
    ///      Data Streams report cannot be paired with a stale window to trade off-hours.
    function _consumeTradeWindow(
        GoldMinterStorage storage $,
        IGoldMinter.TradeWindow memory tradeWindow,
        bytes memory signature
    ) internal {
        if (signature.length == 0) revert Errors.ZeroSignature();
        if (tradeWindow.user != msg.sender) revert Errors.InvalidSignature();
        if (block.timestamp < tradeWindow.validAfter || block.timestamp > tradeWindow.validBefore) {
            revert Errors.TradeWindowClosed();
        }
        if (
            !hasRole(
                KYC_MANAGER_ROLE, GoldMinterLib.recoverTradeWindowSigner(_domainSeparatorV4(), tradeWindow, signature)
            )
        ) {
            revert Errors.InvalidTradeWindowSigner();
        }
        _useTradeWindowNonce($, tradeWindow.user, tradeWindow.nonce);
    }

    /// @dev Permit2-style unordered nonce: nonce = (wordPos << 8) | bitPos. XOR-toggles the
    ///      bit; if the toggle clears it, the nonce was already used. Unordered so a user's
    ///      concurrent requests never contend on a single sequential counter.
    function _useTradeWindowNonce(GoldMinterStorage storage $, address user, uint256 nonce) private {
        uint256 wordPos = nonce >> 8;
        uint256 bit = 1 << (nonce & 0xff);
        uint256 flipped = $.tradeWindowNonceBitmap[user][wordPos] ^= bit;
        if ((flipped & bit) == 0) revert Errors.TradeWindowNonceUsed();
    }

    function _validateFeeVsMinimum(uint256 fee, uint256 minimum) internal pure {
        if (fee >= minimum) revert Errors.FeeExceedsMinimum();
    }

    /// @dev Process KYC verification and update user level
    function _processKYC(
        GoldMinterStorage storage $,
        IGoldMinter.KYCMintRequest memory kycRequest,
        bytes memory kycSignature
    ) internal {
        if (kycSignature.length > 0) {
            if (!_verifyKYCMintSignature(kycRequest, kycSignature)) {
                revert Errors.InvalidSignature();
            }

            $.levels[msg.sender] = kycRequest.kycLevel;
            $.kycNonces[msg.sender] = kycRequest.nonce;

            emit UpdateLevel(msg.sender, IGoldMinter.Levels(kycRequest.kycLevel));
            emit KYCMintRequested(
                msg.sender,
                IGoldMinter.Levels(kycRequest.kycLevel),
                kycRequest.nonce,
                kycRequest.usdToken,
                kycRequest.usdAmount,
                kycRequest.minGoldAmount
            );
        }
    }

    /// @dev Process KYC verification for burn requests
    function _processKYCBurn(
        GoldMinterStorage storage $,
        IGoldMinter.KYCBurnRequest memory kycRequest,
        bytes memory kycSignature
    ) internal {
        if (kycSignature.length > 0) {
            if (!_verifyKYCBurnSignature(kycRequest, kycSignature)) {
                revert Errors.InvalidSignature();
            }

            $.levels[msg.sender] = kycRequest.kycLevel;
            $.kycNonces[msg.sender] = kycRequest.nonce;

            emit UpdateLevel(msg.sender, IGoldMinter.Levels(kycRequest.kycLevel));
            emit KYCBurnRequested(
                msg.sender,
                IGoldMinter.Levels(kycRequest.kycLevel),
                kycRequest.nonce,
                kycRequest.usdToken,
                kycRequest.goldAmount,
                kycRequest.minUsdAmount
            );
        }
    }

    /// @dev Process ERC20 permit for USD tokens.
    ///      The permit() may revert if it was front-run (a third party extracted the
    ///      signature from the mempool and submitted it first, consuming the nonce).
    ///      That MUST NOT grief the request: we swallow the permit revert and fall
    ///      through to an allowance check — if the front-run already established the
    ///      allowance, the request proceeds; otherwise we fail with a clear error.
    function _processUSDPermit(
        GoldMinterStorage storage $,
        address usdToken,
        uint256 amount,
        uint256 deadline,
        bytes memory permitSignature
    ) internal {
        if (permitSignature.length > 0) {
            GoldMinterLib.ensurePermit(
                address(MinterShared.getUSDToken($, usdToken)),
                msg.sender,
                address(this),
                amount,
                deadline,
                permitSignature
            );
        }
    }

    /// @dev Process ERC20 permit for gold token. Front-run resistant (see
    ///      `_processUSDPermit`): permit failure falls through to an allowance check.
    function _processGoldPermit(
        GoldMinterStorage storage $,
        uint256 amount,
        uint256 deadline,
        bytes memory permitSignature
    ) internal {
        if (permitSignature.length > 0) {
            GoldMinterLib.ensurePermit(
                address($.goldToken), msg.sender, address(this), amount, deadline, permitSignature
            );
        }
    }

    /// @dev Temporary approach to avoid stack too deep error
    function _emitInitialize() internal {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        emit UpdateSlippage($.slippage);
        emit UpdateMintSpread($.mintSpread);
        emit UpdateRedeemSpread($.redeemSpread);
        emit UpdateMintFee($.mintFee);
        emit UpdateRedeemFee($.redeemFee);
        emit UpdateMinMintAmount($.minMintAmount);
        emit UpdateMinRedeemAmount($.minRedeemAmount);
        emit UpdateMinGoldFee($.minGoldFee);
        emit UpdateMinGoldFeeAmount($.minGoldFeeAmount);
        emit UpdateAutoSettle($.autoSettle);
        emit UpdateOrderTTL($.orderTTL);

        emit UpdateTradingLevel($.tradeLevel);
        emit UpdateRecipient($.usdRecipient);
        emit UpdateFeeRecipient($.feeRecipient);

        uint8 goldDecimals = $.goldToken.decimals();
        uint8 usdtDecimals = $.USDT.decimals();
        uint8 usdcDecimals = $.USDC.decimals();

        emit Initialized(
            address($.goldToken),
            goldDecimals,
            address($.USDT),
            usdtDecimals,
            address($.USDC),
            usdcDecimals,
            address($.goldStreamVerifier)
        );
    }

    function _verifyKYCMintSignature(IGoldMinter.KYCMintRequest memory request, bytes memory signature)
        internal
        view
        returns (bool)
    {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (request.deadline < block.timestamp) return false;
        if (request.nonce != $.kycNonces[request.user] + 1) return false;

        return hasRole(KYC_MANAGER_ROLE, GoldMinterLib.recoverMintSigner(_domainSeparatorV4(), request, signature));
    }

    function _verifyKYCBurnSignature(IGoldMinter.KYCBurnRequest memory request, bytes memory signature)
        internal
        view
        returns (bool)
    {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (request.deadline < block.timestamp) return false;
        if (request.nonce != $.kycNonces[request.user] + 1) return false;

        return hasRole(KYC_MANAGER_ROLE, GoldMinterLib.recoverBurnSigner(_domainSeparatorV4(), request, signature));
    }

    // ============ Private Functions ============

    function _getGoldMinterStorage() private pure returns (GoldMinterStorage storage $) {
        assembly {
            $.slot := GoldMinterStorageLocation
        }
    }
}
