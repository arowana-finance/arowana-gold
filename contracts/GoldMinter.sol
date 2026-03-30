// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import { EIP712Upgradeable } from '@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol';
import { AccessControlUpgradeable } from '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import { ECDSA } from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import { IERC20Exp, IERC20Mintable } from './interfaces/IERC20.sol';
import { IPriceFeed } from './interfaces/IPriceFeed.sol';
import { IGoldMinter } from './interfaces/IGoldMinter.sol';
import { SigLib } from './libraries/SigLib.sol';
import { Errors } from './libraries/Errors.sol';

contract GoldMinter is AccessControlUpgradeable, ReentrancyGuardUpgradeable, PausableUpgradeable, EIP712Upgradeable {
    using SigLib for bytes;
    using SafeERC20 for IERC20Exp;
    using SafeERC20 for IERC20Mintable;

    // ============ Constants ============

    // Unit conversion constants for ounce to gram conversion (8 decimals matches Oracle precision)
    uint256 public constant GRAMS_PER_OUNCE = 3110347680; // 31.1034768 * 1e8 (8 decimal precision)
    uint256 public constant CONVERSION_PRECISION = 1e8;

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

    // EIP-712 type hashes
    bytes32 public constant KYC_MINT_REQUEST_TYPEHASH =
        keccak256(
            'KYCMintRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 usdAmount,uint256 minGoldAmount)'
        );

    bytes32 public constant KYC_BURN_REQUEST_TYPEHASH =
        keccak256(
            'KYCBurnRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 goldAmount,uint256 minUsdAmount)'
        );

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.GoldMinter")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant GoldMinterStorageLocation =
        0x8cf47ae6e29ccadec338e18318c0b2861b9691ac34e27ee5f7478ced79517b00;

    // ============ Storage ============

    /// @custom:storage-location erc7201:openzeppelin.storage.GoldMinter
    struct GoldMinterStorage {
        IERC20Mintable goldToken;
        IERC20Exp USDT;
        IERC20Exp USDC;
        IPriceFeed goldPriceFeed;
        mapping(address => uint8) levels;
        mapping(address => bool) amlBlacklist;
        mapping(address => uint256) kycNonces;
        IGoldMinter.MintOrder[] mintOrders;
        IGoldMinter.BurnOrder[] burnOrders;
        IGoldMinter.Levels tradeLevel;
        uint16 slippage;
        uint16 mintSpread;      // Spread for mint (e.g., 75 = 0.75%)
        uint16 redeemSpread;    // Spread for redeem (e.g., 75 = 0.75%)
        uint16 mintFee;         // Fee for mint (e.g., 25 = 0.25%)
        uint16 redeemFee;       // Fee for redeem (e.g., 25 = 0.25%)
        uint256 minMintAmount;  // Minimum gold amount for mint (e.g., 1 ether = 1 gram)
        uint256 minRedeemAmount; // Minimum gold amount for redeem (e.g., 1 ether = 1 gram)
        uint256 minGoldFee;
        uint256 minGoldFeeAmount;
        bool autoSettle;
        address usdRecipient;
        uint256 maxPriceAge;
        uint256 minGoldPrice; // 500e8 (8 decimals)
        uint256 maxGoldPrice; // 10000e8 (8 decimals)
        // User mint tracking
        mapping(address => uint256[]) userMintNonces;
        mapping(address => uint256) userPendingMintCount;
        // User burn tracking
        mapping(address => uint256[]) userBurnNonces;
        mapping(address => uint256) userPendingBurnCount;
    }

    // ============ Events ============

    event RequestMint(
        uint256 indexed nonce,
        address indexed buyer,
        address usdToken,
        uint256 usdAmount,
        uint256 minGoldAmount
    );
    event SettleMint(uint256 indexed nonce, uint256 goldAmount, uint256 feeAmount, bool success);
    event RequestBurn(
        uint256 indexed nonce,
        address indexed seller,
        address usdToken,
        uint256 goldAmount,
        uint256 minUsdAmount
    );
    event SettleBurn(uint256 indexed nonce, uint256 usdAmount, uint256 feeAmount, bool success);

    event UpdateLevel(address indexed user, IGoldMinter.Levels level);
    event UpdateSlippage(uint16 newSlippage);
    event UpdatePriceFeed(address newPriceFeed);
    event UpdateMaxPriceAge(uint256 newMaxPriceAge);
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
        address goldPriceFeed
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
        address _goldPriceFeed,
        address _usdRecipient,
        address _owner,
        bool _autoSettle
    ) public virtual initializer {
        if (_goldToken == address(0)) revert Errors.ZeroGoldToken();
        if (_USDT == address(0)) revert Errors.ZeroUSDT();
        if (_USDC == address(0)) revert Errors.ZeroUSDC();
        if (_goldPriceFeed == address(0)) revert Errors.ZeroPriceFeed();
        if (_usdRecipient == address(0)) revert Errors.ZeroRecipient();
        if (_owner == address(0)) revert Errors.ZeroOwner();

        GoldMinterStorage storage $ = _getGoldMinterStorage();

        $.goldToken = IERC20Mintable(_goldToken);
        $.USDT = IERC20Exp(_USDT);
        $.USDC = IERC20Exp(_USDC);
        $.goldPriceFeed = IPriceFeed(_goldPriceFeed);

        $.slippage = 500; // 5%
        $.mintSpread = 75; // 0.75%
        $.redeemSpread = 75; // 0.75%
        $.mintFee = 25; // 0.25%
        $.redeemFee = 25; // 0.25%
        $.minMintAmount = 1 ether; // 1 gram
        $.minRedeemAmount = 1 ether; // 1 gram
        $.minGoldFee = 0.01 ether; // 0.01 gram
        $.minGoldFeeAmount = 1 ether; // 1 gram
        $.autoSettle = _autoSettle;
        $.tradeLevel = IGoldMinter.Levels.KYCD;
        $.usdRecipient = _usdRecipient;
        $.maxPriceAge = 10 minutes;
        // Oracle price validation limits (ounce-based, matches Oracle format)
        $.minGoldPrice = 500e8; // $500/ounce
        $.maxGoldPrice = 10000e8; // $10,000/ounce

        __ReentrancyGuard_init();
        __Pausable_init();
        __EIP712_init('GoldMinter', '1');
        __AccessControl_init();

        // Grant admin role (admin can grant other roles after deployment)
        _grantRole(DEFAULT_ADMIN_ROLE, _owner);

        _emitInitialize();
    }

    // ============ External Functions ============

    /// @notice Request mint with KYC signature and optional permit (recommended flow)
    function requestMintWithKYC(
        IGoldMinter.KYCMintRequest memory kycRequest,
        bytes memory kycSignature,
        bytes memory permitSignature
    ) external whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        if (msg.sender != kycRequest.user) revert Errors.InvalidSignature();
        if (kycSignature.length == 0) revert Errors.ZeroSignature();

        // Verify KYC signature from backend (optional)
        _processKYC($, kycRequest, kycSignature);

        // Handle permit if provided
        _processUSDPermit($, kycRequest.usdToken, kycRequest.usdAmount, kycRequest.deadline, permitSignature);

        // Proceed with mint request
        requestMint(kycRequest.usdToken, kycRequest.usdAmount, kycRequest.minGoldAmount);
    }

    /// @notice Request mint with ERC-2612 permit (no KYC update, requires pre-set KYC level)
    function requestMintPermit(
        address _usdToken,
        uint256 _usdAmount,
        uint256 _minGoldAmount,
        uint256 _sigDeadline,
        bytes memory _signature
    ) external whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        _processUSDPermit($, _usdToken, _usdAmount, _sigDeadline, _signature);

        requestMint(_usdToken, _usdAmount, _minGoldAmount);
    }

    /// @notice Request burn with KYC signature and optional permit (recommended flow)
    function requestBurnWithKYC(
        IGoldMinter.KYCBurnRequest memory kycRequest,
        bytes memory kycSignature,
        bytes memory permitSignature
    ) external whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (msg.sender != kycRequest.user) revert Errors.InvalidSignature();
        if (kycSignature.length == 0) revert Errors.ZeroSignature();

        // Verify KYC signature from backend (optional)
        _processKYCBurn($, kycRequest, kycSignature);

        // Handle permit if provided
        _processGoldPermit($, kycRequest.goldAmount, kycRequest.deadline, permitSignature);

        // Proceed with burn request
        requestBurn(kycRequest.usdToken, kycRequest.goldAmount, kycRequest.minUsdAmount);
    }

    /// @notice Request burn with ERC-2612 permit (no KYC update, requires pre-set KYC level)
    function requestBurnPermit(
        address _usdToken,
        uint256 _goldAmount,
        uint256 _minUsdAmount,
        uint256 _sigDeadline,
        bytes memory _signature
    ) external whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        // Process Gold permit
        _processGoldPermit($, _goldAmount, _sigDeadline, _signature);

        requestBurn(_usdToken, _goldAmount, _minUsdAmount);
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

    function updatePriceFeed(address _goldPriceFeed) external onlyRole(INFRA_MANAGER_ROLE) {
        if (_goldPriceFeed == address(0)) revert Errors.ZeroPriceFeed();
		GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.goldPriceFeed = IPriceFeed(_goldPriceFeed);
        emit UpdatePriceFeed(_goldPriceFeed);
    }

    function updateMaxPriceAge(uint256 _age) external onlyRole(INFRA_MANAGER_ROLE) {
        if (_age < 5 minutes || _age > 30 minutes) revert Errors.InvalidPriceAge();

        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.maxPriceAge = _age;
        emit UpdateMaxPriceAge(_age);
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
        $.minMintAmount = _minMintAmount;
        emit UpdateMinMintAmount(_minMintAmount);
    }

    function updateMinRedeemAmount(uint256 _minRedeemAmount) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.minRedeemAmount = _minRedeemAmount;
        emit UpdateMinRedeemAmount(_minRedeemAmount);
    }

    function updateMinGoldFee(uint256 _minGoldFee) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.minGoldFee = _minGoldFee;
        emit UpdateMinGoldFee(_minGoldFee);
    }

    function updateMinGoldFeeAmount(uint256 _minGoldFeeAmount) external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.minGoldFeeAmount = _minGoldFeeAmount;
        emit UpdateMinGoldFeeAmount(_minGoldFeeAmount);
    }

    function updateAutoSettle() external onlyRole(PARAMETER_MANAGER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.autoSettle = !$.autoSettle;
        emit UpdateAutoSettle($.autoSettle);
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
    function getUserMintNonces(
        address user,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
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
    function getMintOrdersByNonces(
        uint256[] calldata nonces
    ) external view returns (IGoldMinter.MintOrder[] memory) {
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
    function getUserBurnNonces(
        address user,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
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
    function getBurnOrdersByNonces(
        uint256[] calldata nonces
    ) external view returns (IGoldMinter.BurnOrder[] memory) {
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

    function settleMint(uint256 mintNonce) public onlyRole(SETTLER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        if (mintNonce >= $.mintOrders.length) revert Errors.InvalidNonce();

        // Use gold amount calculated at request time
        uint256 goldAmount = $.mintOrders[mintNonce].goldAmount;
        _settleMint(mintNonce, goldAmount);
    }

    function settleBurn(uint256 burnNonce) public onlyRole(SETTLER_ROLE) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        if (burnNonce >= $.burnOrders.length) revert Errors.InvalidNonce();

        // Use USD amount calculated at request time
        uint256 usdAmount = $.burnOrders[burnNonce].usdAmount;
        _settleBurn(burnNonce, usdAmount);
    }

    /// @notice Request mint with pre-set KYC level (requires approval in advance)
    function requestMint(
        address _usdToken,
        uint256 _usdAmount,
        uint256 _minGoldAmount
    ) public nonReentrant whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        // Cache frequently used variables to reduce storage reads
        uint16 slippage_ = $.slippage;
        IGoldMinter.Levels tradeLevel_ = $.tradeLevel;

        // Apply maximum 5% slippage
        uint256 expectedOutput = getGoldAmount(_usdToken, _usdAmount);
        uint256 feeAmount = calculateGoldFee(expectedOutput, true);

        // Validate request using extracted functions
        _validateSlippage(expectedOutput - feeAmount, _minGoldAmount, slippage_);
        // Validate gross minted amount >= minMintAmount (user may receive less after fee)
        _validateMinimumAmount(expectedOutput, $.minMintAmount);
        // commented out here to allow overbooking over reserves
        _validateUserPermissions($, tradeLevel_);

        IERC20Exp usdToken = _getUSDToken($, _usdToken);

        uint256 mintNonce = $.mintOrders.length;

        usdToken.safeTransferFrom(msg.sender, $.usdRecipient, _usdAmount);

        $.mintOrders.push(
            IGoldMinter.MintOrder({
                buyer: msg.sender,
                usdToken: address(usdToken),
                usdAmount: _usdAmount,
                minGoldAmount: _minGoldAmount,
                goldAmount: expectedOutput,
                feeAmount: feeAmount,
                success: false,
                isSettled: false
            })
        );

        $.userMintNonces[msg.sender].push(mintNonce);

        emit RequestMint(mintNonce, msg.sender, address(usdToken), _usdAmount, _minGoldAmount);

        if ($.autoSettle) {
            _settleMint(mintNonce, expectedOutput);
        } else {
            $.userPendingMintCount[msg.sender]++;
        }
    }

    /// @notice Request burn with pre-set KYC level (requires approval in advance)
    function requestBurn(
        address _usdToken,
        uint256 _goldAmount,
        uint256 _minUsdAmount
    ) public nonReentrant whenNotPaused {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        // Cache frequently used variables to reduce storage reads
        uint16 slippage_ = $.slippage;
        IGoldMinter.Levels tradeLevel_ = $.tradeLevel;

        // Calculate expected USD after fee deduction at request time
        uint256 feeAmount = calculateGoldFee(_goldAmount, false);
        uint256 expectedOutput = getUsdAmount(_usdToken, _goldAmount - feeAmount);

        // Validate request using extracted functions
        _validateSlippage(expectedOutput, _minUsdAmount, slippage_);
        _validateMinimumAmount(_goldAmount, $.minRedeemAmount);
        _validateUserPermissions($, tradeLevel_);

        IERC20Exp usdToken = _getUSDToken($, _usdToken);

        uint256 burnNonce = $.burnOrders.length;

        $.burnOrders.push(
            IGoldMinter.BurnOrder({
                seller: msg.sender,
                usdToken: address(usdToken),
                goldAmount: _goldAmount,
                minUsdAmount: _minUsdAmount,
                usdAmount: expectedOutput,
                feeAmount: feeAmount,
                success: false,
                isSettled: false
            })
        );

        $.userBurnNonces[msg.sender].push(burnNonce);

        $.goldToken.safeTransferFrom(msg.sender, address(this), _goldAmount);

        emit RequestBurn(burnNonce, msg.sender, address(usdToken), _goldAmount, _minUsdAmount);

        if ($.autoSettle && canBurn(IERC20Exp(usdToken), expectedOutput)) {
            _settleBurn(burnNonce, expectedOutput);
        } else {
            $.userPendingBurnCount[msg.sender]++;
        }
    }

    function getGoldAmount(address usdToken, uint256 usdAmount) public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        (uint256 latestPrice, uint8 priceOracleDecimals) = _getValidatedPrice();
        (uint8 goldDecimals, , , ) = _getTokenDecimals($);
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();

        // Apply mintSpread: price increases by mintSpread% (user gets less gold)
        // Formula: goldAmount = usdAmount / (price * (1 + spread))
        uint256 spreadAdjustedPrice = (latestPrice * (10000 + $.mintSpread)) / 10000;

        return (usdAmount * 10 ** (priceOracleDecimals + goldDecimals - usdDecimals)) / spreadAdjustedPrice;
    }

    function getUsdAmount(address usdToken, uint256 goldAmount) public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        (uint256 latestPrice, uint8 priceOracleDecimals) = _getValidatedPrice();
        (uint8 goldDecimals, , , ) = _getTokenDecimals($);
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();

        // Apply redeemSpread: price decreases by redeemSpread% (user gets less USD)
        // Formula: usdAmount = goldAmount * price * (1 - spread)
        uint256 spreadAdjustedPrice = (latestPrice * (10000 - $.redeemSpread)) / 10000;

        return (goldAmount * spreadAdjustedPrice) / 10 ** (priceOracleDecimals + goldDecimals - usdDecimals);
    }

    function canBurn(IERC20Exp usdToken, uint256 usdAmount) public view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
         return usdToken.balanceOf($.usdRecipient) >= usdAmount &&
             usdToken.allowance($.usdRecipient, address(this)) >= usdAmount;
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
    function levels(address _target) public view returns (uint8) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.levels[_target];
    }

    /// @dev Return fee amount in Gold
    /// @notice Fee is calculated based on 1 AGT price (gold price ± spread)
    /// @param _goldAmount Amount of gold to calculate fee for
    /// @param isMint True for mint fee, false for redeem fee
    function calculateGoldFee(uint256 _goldAmount, bool isMint) public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        // Cache fee variables for efficiency
        uint256 minGoldFeeAmount_ = $.minGoldFeeAmount;
        uint256 minGoldFee_ = $.minGoldFee;
        uint16 fee = isMint ? $.mintFee : $.redeemFee;

        if (_goldAmount < minGoldFeeAmount_) {
            return minGoldFee_;
        }
        return (_goldAmount * fee) / 10000;
    }

    // ============ Internal Functions ============

    function _settleMint(uint256 mintNonce, uint256 goldAmount) internal {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (mintNonce >= $.mintOrders.length) revert Errors.InvalidNonce();
        if ($.mintOrders[mintNonce].isSettled) revert Errors.AlreadySettled();
		if ($.amlBlacklist[$.mintOrders[mintNonce].buyer]) revert Errors.AMLBlocked();

		uint256 feeAmount = $.mintOrders[mintNonce].feeAmount;
  		uint256 netGoldAmount = goldAmount - feeAmount;
  		bool success = netGoldAmount >= $.mintOrders[mintNonce].minGoldAmount;

        // Issue refund if deposited usd is insufficient
        if (!success) {
            (IERC20Exp usdToken, uint256 usdAmount) = (
                IERC20Exp($.mintOrders[mintNonce].usdToken),
                $.mintOrders[mintNonce].usdAmount
            );

            usdToken.safeTransferFrom($.usdRecipient, $.mintOrders[mintNonce].buyer, usdAmount);

            // Mint desired gold amount
        } else {
            $.mintOrders[mintNonce].goldAmount = goldAmount;
            $.goldToken.mint($.usdRecipient, feeAmount);
            $.goldToken.mint($.mintOrders[mintNonce].buyer, netGoldAmount);
        }

        $.mintOrders[mintNonce].success = success;
        $.mintOrders[mintNonce].isSettled = true;

        address buyer = $.mintOrders[mintNonce].buyer;
        if ($.userPendingMintCount[buyer] > 0) {
            $.userPendingMintCount[buyer]--;
        }

        emit SettleMint(mintNonce, goldAmount,feeAmount, success);
    }

    function _settleBurn(uint256 burnNonce, uint256 usdAmount) internal {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (burnNonce >= $.burnOrders.length) revert Errors.InvalidNonce();
        if ($.burnOrders[burnNonce].isSettled) revert Errors.AlreadySettled();
		if ($.amlBlacklist[$.burnOrders[burnNonce].seller]) revert Errors.AMLBlocked();

        IERC20Exp usdToken = IERC20Exp($.burnOrders[burnNonce].usdToken);
        uint256 goldAmount = $.burnOrders[burnNonce].goldAmount;

		uint256 feeAmount = $.burnOrders[burnNonce].feeAmount;
  		bool success = usdAmount >= $.burnOrders[burnNonce].minUsdAmount && canBurn(usdToken, usdAmount);

        if (!success) {
            $.goldToken.safeTransfer($.burnOrders[burnNonce].seller, goldAmount);
        } else {
            $.goldToken.burn(goldAmount - feeAmount);
            $.goldToken.safeTransfer($.usdRecipient, feeAmount);
            usdToken.safeTransferFrom($.usdRecipient, $.burnOrders[burnNonce].seller, usdAmount);
        }

        $.burnOrders[burnNonce].success = success;
        $.burnOrders[burnNonce].isSettled = true;

        address seller = $.burnOrders[burnNonce].seller;
		
        if ($.userPendingBurnCount[seller] > 0) {
            $.userPendingBurnCount[seller]--;
        }

        emit SettleBurn(burnNonce, usdAmount,feeAmount, success);
    }

    /// @dev Get cached decimals for tokens to avoid repeated calls
    function _getTokenDecimals(
        GoldMinterStorage storage $
    )
        internal
        view
        returns (uint8 goldDecimals, uint8 usdtDecimals, uint8 usdcDecimals, uint8 oracleDecimals)
    {
        return ($.goldToken.decimals(), $.USDT.decimals(), $.USDC.decimals(), $.goldPriceFeed.decimals());
    }

    /// @dev Common validation logic for user permissions
    function _validateUserPermissions(
        GoldMinterStorage storage $,
        IGoldMinter.Levels requiredLevel
    ) internal view {
        if ($.levels[msg.sender] < uint(requiredLevel)) revert Errors.Underlevel();
        if ($.amlBlacklist[msg.sender]) revert Errors.AMLBlocked();
    }

    /// @dev Common slippage validation logic
    function _validateSlippage(uint256 expectedOutput, uint256 minAmount, uint16 slippage_) internal pure {
        if (
          !(expectedOutput >= minAmount &&
              minAmount >= ((expectedOutput * (10000 - slippage_)) / 10000))
      ) revert Errors.Underpriced();
    }

    /// @dev Common minimum amount validation
    function _validateMinimumAmount(uint256 amount, uint256 minRequired) internal pure {
        if (amount < minRequired) revert Errors.SmallAmount();
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

            // Update KYC level and nonce
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

            // Update KYC level and nonce
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

    /// @dev Process ERC20 permit for USD tokens
    function _processUSDPermit(
        GoldMinterStorage storage $,
        address usdToken,
        uint256 amount,
        uint256 deadline,
        bytes memory permitSignature
    ) internal {
        if (permitSignature.length > 0) {
            (uint8 v, bytes32 r, bytes32 s) = permitSignature.toVRS();
            IERC20Exp token = _getUSDToken($, usdToken);
            token.permit(msg.sender, address(this), amount, deadline, v, r, s);
        }
    }

    /// @dev Process ERC20 permit for gold token
    function _processGoldPermit(
        GoldMinterStorage storage $,
        uint256 amount,
        uint256 deadline,
        bytes memory permitSignature
    ) internal {
        if (permitSignature.length > 0) {
            (uint8 v, bytes32 r, bytes32 s) = permitSignature.toVRS();
            $.goldToken.permit(msg.sender, address(this), amount, deadline, v, r, s);
        }
    }

    /// @dev Helper function to get USD token (USDT or USDC)
    function _getUSDToken(GoldMinterStorage storage $, address usdToken) internal view returns (IERC20Exp) {
        if (usdToken == address($.USDT)) return $.USDT;
        if (usdToken == address($.USDC)) return $.USDC;
        revert Errors.InvalidUSDToken();
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

        emit UpdateTradingLevel($.tradeLevel);
        emit UpdateRecipient($.usdRecipient);

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
            address($.goldPriceFeed)
        );
    }

    /// @dev Convert ounce-based price to gram-based price
    function _convertOunceToGramPrice(uint256 ouncePrice) internal pure returns (uint256) {
        return (ouncePrice * CONVERSION_PRECISION) / GRAMS_PER_OUNCE;
    }

    function _getValidatedPrice() internal view returns (uint256, uint8) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        (, int256 price, , uint256 updatedAt, ) = $.goldPriceFeed.latestRoundData();

        if (price <= 0) revert Errors.InvalidPrice();

        // Validate ounce-based Oracle price against ounce-based limits
        if (uint256(price) < $.minGoldPrice || uint256(price) > $.maxGoldPrice) {
            revert Errors.PriceOutOfRange();
        }

        if (updatedAt > block.timestamp || block.timestamp - updatedAt > $.maxPriceAge) {
            revert Errors.StalePrice();
        }

        // Convert ounce-based Oracle price to gram-based price for calculations
        uint256 gramPrice = _convertOunceToGramPrice(uint256(price));

        (, , , uint8 oracleDecimals) = _getTokenDecimals($);
        return (gramPrice, oracleDecimals);
    }

    function _verifyKYCMintSignature(
        IGoldMinter.KYCMintRequest memory request,
        bytes memory signature
    ) internal view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (request.deadline < block.timestamp) return false;
        if (request.nonce != $.kycNonces[request.user] + 1) return false;

        bytes32 structHash = keccak256(
            abi.encode(
                KYC_MINT_REQUEST_TYPEHASH,
                request.user,
                request.kycLevel,
                request.nonce,
                request.deadline,
                request.usdToken,
                request.usdAmount,
                request.minGoldAmount
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signature);

        return hasRole(KYC_MANAGER_ROLE, signer);
    }

    function _verifyKYCBurnSignature(
        IGoldMinter.KYCBurnRequest memory request,
        bytes memory signature
    ) internal view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (request.deadline < block.timestamp) return false;
        if (request.nonce != $.kycNonces[request.user] + 1) return false;

        bytes32 structHash = keccak256(
            abi.encode(
                KYC_BURN_REQUEST_TYPEHASH,
                request.user,
                request.kycLevel,
                request.nonce,
                request.deadline,
                request.usdToken,
                request.goldAmount,
                request.minUsdAmount
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signature);

        return hasRole(KYC_MANAGER_ROLE, signer);
    }

    // ============ Private Functions ============

    function _getGoldMinterStorage() private pure returns (GoldMinterStorage storage $) {
        assembly {
            $.slot := GoldMinterStorageLocation
        }
    }
}
