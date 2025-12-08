// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import { EIP712Upgradeable } from '@openzeppelin/contracts-upgradeable/utils/cryptography/EIP712Upgradeable.sol';
import { ECDSA } from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import { IERC20Exp, IERC20Mintable } from './interfaces/IERC20.sol';
import { IPriceFeed } from './interfaces/IPriceFeed.sol';
import { IGoldMinter } from './interfaces/IGoldMinter.sol';
import { WithSettler } from './libraries/WithSettler.sol';
import { SigLib } from './libraries/SigLib.sol';
import { Errors } from './libraries/Errors.sol';

contract GoldMinter is WithSettler, ReentrancyGuardUpgradeable, PausableUpgradeable, EIP712Upgradeable {
    using SigLib for bytes;
    using SafeERC20 for IERC20Exp;
    using SafeERC20 for IERC20Mintable;

    // ============ Constants ============

    // EIP-712 type hashes
    bytes32 public constant KYC_MINT_REQUEST_TYPEHASH =
        keccak256("KYCMintRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 usdAmount,uint256 minGoldAmount)");

    bytes32 public constant KYC_BURN_REQUEST_TYPEHASH =
        keccak256("KYCBurnRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 goldAmount,uint256 minUsdAmount)");

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
        uint16 fees;
        uint256 minGoldAmount;
        uint256 minGoldFee;
        uint256 minGoldFeeAmount;
        bool autoSettle;
        address usdRecipient;
        uint256 maxPriceAge;
		uint256 minGoldPrice; // 500e8 (8 decimals)
  		uint256 maxGoldPrice; // 10000e8 (8 decimals)
    }

    // ============ Events ============

    event RequestMint(
        uint256 indexed nonce,
        address indexed buyer,
        address usdToken,
        uint256 usdAmount,
        uint256 minGoldAmount
    );
    event SettleMint(uint256 indexed nonce, uint256 goldAmount, bool success);
    event RequestBurn(
        uint256 indexed nonce,
        address indexed seller,
        address usdToken,
        uint256 goldAmount,
        uint256 minUsdAmount
    );
    event SettleBurn(uint256 indexed nonce, uint256 usdAmount, bool success);

    event UpdateLevel(address indexed user, IGoldMinter.Levels level);
    event UpdateSlippage(uint16 newSlippage);
    event UpdateMaxPriceAge(uint256 newMaxPriceAge);
    event UpdateFees(uint16 newFees);
    event UpdateMinGold(uint256 minGoldAmount);
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
        $.fees = 40; // 0.4%
        $.minGoldAmount = 0.02 ether;
        $.minGoldFee = 0.1 ether;
        $.minGoldFeeAmount = 1 ether;
        $.autoSettle = _autoSettle;
        $.tradeLevel = IGoldMinter.Levels.KYCD;
        $.usdRecipient = _usdRecipient;
        $.maxPriceAge = 10 minutes;
		$.minGoldPrice = 500e8;  // $500
  		$.maxGoldPrice = 10000e8; // $10,000

        __ReentrancyGuard_init();
        __Pausable_init();
        __EIP712_init("GoldMinter", "1");
        _initializeSettler(_owner);
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
        if ($.amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

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

        if ($.amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

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
        if ($.amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

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

        // Validate user permissions and AML status
        _validateUserPermissions($, IGoldMinter.Levels.DEFAULT);

        // Process Gold permit
        _processGoldPermit($, _goldAmount, _sigDeadline, _signature);

        requestBurn(_usdToken, _goldAmount, _minUsdAmount);
    }

    function setLevel(address user, IGoldMinter.Levels level) external onlySettlers {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.levels[user] = uint8(level);
        emit UpdateLevel(user, level);
    }

    function updateSlippage(uint16 _slippage) external onlyOwner {
        if (_slippage >= 500) revert Errors.Overflow();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.slippage = _slippage;
        emit UpdateSlippage(_slippage);
    }

    function updateMaxPriceAge(uint256 _age) external onlyOwner {
		if(_age < 5 minutes || _age > 30 minutes) revert Errors.InvalidPriceAge();

        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.maxPriceAge = _age;
        emit UpdateMaxPriceAge(_age);
    }

    function updateFees(uint16 _fees) external onlyOwner {
        if (_fees >= 500) revert Errors.Overflow();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.fees = _fees;
        emit UpdateFees(_fees);
    }

    function updateMinGold(uint256 _minGold) external onlyOwner {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.minGoldAmount = _minGold;
        emit UpdateMinGold(_minGold);
    }

    function updateMinGoldFee(uint256 _minGoldFee) external onlyOwner {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.minGoldFee = _minGoldFee;
        emit UpdateMinGoldFee(_minGoldFee);
    }

    function updateMinGoldFeeAmount(uint256 _minGoldFeeAmount) external onlyOwner {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.minGoldFeeAmount = _minGoldFeeAmount;
        emit UpdateMinGoldFeeAmount(_minGoldFeeAmount);
    }

    function updateAutoSettle() external onlyOwner {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.autoSettle = !$.autoSettle;
        emit UpdateAutoSettle($.autoSettle);
    }

    function updateTradingLevel(IGoldMinter.Levels level) external onlyOwner {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.tradeLevel = level;
        emit UpdateTradingLevel(level);
    }

    function updateRecipient(address _usdRecipient) external onlyOwner {
        if (_usdRecipient == address(0)) revert Errors.ZeroUSDRecipient();
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.usdRecipient = _usdRecipient;
        emit UpdateRecipient(_usdRecipient);
    }

    function setAMLBlacklist(address user, bool blacklisted) external onlySettlers {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        $.amlBlacklist[user] = blacklisted;
        emit AMLBlacklisted(user, blacklisted);
    }

    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPaused(msg.sender, true);
    }

    function emergencyUnpause() external onlyOwner {
        _unpause();
        emit EmergencyPaused(msg.sender, false);
    }

    function isAMLBlacklisted(address user) external view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return $.amlBlacklist[user];
    }

    // ============ Public Functions ============

    function settleMint(uint256 mintNonce, uint256 goldAmount) public onlyOwner {
        _settleMint(mintNonce, goldAmount);
    }

    function settleBurn(uint256 burnNonce, uint256 usdAmount) public onlyOwner {
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

        // Validate request using extracted functions
        _validateSlippage(expectedOutput, _minGoldAmount, slippage_);
        _validateMinimumAmount(_minGoldAmount, $.minGoldAmount);
        // commented out here to allow overbooking over reserves
        _validateUserPermissions($, tradeLevel_);

        IERC20Exp usdToken = _getUSDToken($, _usdToken);

        usdToken.safeTransferFrom(msg.sender, $.usdRecipient, _usdAmount);

        uint256 mintNonce = $.mintOrders.length;

        $.mintOrders.push(
            IGoldMinter.MintOrder({
                buyer: msg.sender,
                usdToken: usdToken,
                usdAmount: _usdAmount,
                minGoldAmount: _minGoldAmount,
                goldAmount: 0,
                success: false,
                isSettled: false
            })
        );

        emit RequestMint(mintNonce, msg.sender, address(usdToken), _usdAmount, _minGoldAmount);

        if ($.autoSettle) {
            _settleMint(mintNonce, expectedOutput);
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
        bool autoSettle_ = $.autoSettle;

        // Apply maximum 5% slippage
        uint256 expectedOutput = getUsdAmount(_usdToken, _goldAmount);

        // Validate request using extracted functions
        _validateSlippage(expectedOutput, _minUsdAmount, slippage_);
        _validateMinimumAmount(_goldAmount, $.minGoldAmount);
        _validateUserPermissions($, tradeLevel_);

		IERC20Exp usdToken = _getUSDToken($, _usdToken);

        $.goldToken.safeTransferFrom(msg.sender, address(this), _goldAmount);

        uint256 burnNonce = $.burnOrders.length;

        $.burnOrders.push(
            IGoldMinter.BurnOrder({
                seller: msg.sender,
                usdToken: IERC20Exp(usdToken),
                goldAmount: _goldAmount,
                minUsdAmount: _minUsdAmount,
                usdAmount: 0,
                success: false,
                isSettled: false
            })
        );

        emit RequestBurn(burnNonce, msg.sender, address(usdToken), _goldAmount, _minUsdAmount);

        if (autoSettle_ && canBurn(IERC20Exp(usdToken), expectedOutput)) {
            _settleBurn(burnNonce, expectedOutput);
        }
    }

    function getGoldAmount(address usdToken, uint256 usdAmount) public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        (uint256 latestPrice, uint8 priceOracleDecimals) = _getValidatedPrice();
        (uint8 goldDecimals, , , ) = _getTokenDecimals($);
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();
        // (10 ** 6) * (10 ** 10) / 299315000000
        return (usdAmount * 10 ** (priceOracleDecimals + goldDecimals - usdDecimals)) / latestPrice;
    }

    function getUsdAmount(address usdToken, uint256 goldAmount) public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        (uint256 latestPrice, uint8 priceOracleDecimals) = _getValidatedPrice();
        (uint8 goldDecimals, , , ) = _getTokenDecimals($);
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();
        // (10 ** 8 * 299315000000 / 10 ** 10)
        return (goldAmount * latestPrice) / 10 ** (priceOracleDecimals + goldDecimals - usdDecimals);
    }

    function canBurn(IERC20Exp usdToken, uint256 usdAmount) public view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();
        return usdToken.balanceOf($.usdRecipient) >= usdAmount;
    }

	function fees() public view returns(uint16) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return $.fees;
	}
	function goldToken() public view returns(address) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return address($.goldToken);
	}
	function USDT() public view returns(address) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return address($.USDT);
	}
	function USDC() public view returns(address) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return address($.USDC);
	}
	function slippage() public view returns(uint16) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return $.slippage;
	}
	function tradeLevel() public view returns(IGoldMinter.Levels) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return $.tradeLevel;
	}
	function minGoldAmount() public view returns(uint256) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return $.minGoldAmount;
	}
	function minGoldFee() public view returns(uint256) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return $.minGoldFee;
	}
	function minGoldFeeAmount() public view returns(uint256) {
		GoldMinterStorage storage $ = _getGoldMinterStorage();
		return $.minGoldFeeAmount;
	}

    /// @dev Return fee amount in Gold
    function calculateGoldFee(uint256 _goldAmount) public view returns (uint256) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        // Cache fee variables for efficiency
        uint256 minGoldFeeAmount_ = $.minGoldFeeAmount;
        uint256 minGoldFee_ = $.minGoldFee;
        uint16 fees_ = $.fees;

        if (_goldAmount < minGoldFeeAmount_) {
            return minGoldFee_;
        }
        return (_goldAmount * fees_) / 10000;
    }

    // ============ Internal Functions ============

    function _settleMint(uint256 mintNonce, uint256 goldAmount) internal {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (mintNonce >= $.mintOrders.length) revert Errors.InvalidNonce();
        if ($.mintOrders[mintNonce].isSettled) revert Errors.AlreadySettled();

        bool success = goldAmount >= $.mintOrders[mintNonce].minGoldAmount;

        // Issue refund if deposited usd is insufficient
        if (!success) {
            (IERC20Exp usdToken, uint256 usdAmount) = (
                $.mintOrders[mintNonce].usdToken,
                $.mintOrders[mintNonce].usdAmount
            );

            usdToken.safeTransferFrom($.usdRecipient, $.mintOrders[mintNonce].buyer, usdAmount);

            // Mint desired gold amount
        } else {
            $.mintOrders[mintNonce].goldAmount = goldAmount;

            uint256 feeAmount = calculateGoldFee(goldAmount);

            $.goldToken.mint($.usdRecipient, feeAmount);
            $.goldToken.mint($.mintOrders[mintNonce].buyer, goldAmount - feeAmount);
        }

        $.mintOrders[mintNonce].success = success;
        $.mintOrders[mintNonce].isSettled = true;

        emit SettleMint(mintNonce, goldAmount, success);
    }

    function _settleBurn(uint256 burnNonce, uint256 usdAmount) internal {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (burnNonce >= $.burnOrders.length) revert Errors.InvalidNonce();
        if ($.burnOrders[burnNonce].isSettled) revert Errors.AlreadySettled();

        IERC20Exp usdToken = $.burnOrders[burnNonce].usdToken;
        uint256 goldAmount = $.burnOrders[burnNonce].goldAmount;

        bool success = usdAmount >= $.burnOrders[burnNonce].minUsdAmount && canBurn(usdToken, usdAmount);

        if (!success) {
            $.goldToken.safeTransfer($.burnOrders[burnNonce].seller, goldAmount);
        } else {
            $.burnOrders[burnNonce].usdAmount = usdAmount;

            uint256 feeAmount = calculateGoldFee(goldAmount);

            $.goldToken.burn(goldAmount - feeAmount);
            $.goldToken.safeTransfer($.usdRecipient, feeAmount);
            usdToken.safeTransferFrom($.usdRecipient, $.burnOrders[burnNonce].seller, usdAmount);
        }

        $.burnOrders[burnNonce].success = success;
        $.burnOrders[burnNonce].isSettled = true;

        emit SettleBurn(burnNonce, usdAmount, success);
    }

    /// @dev Get cached decimals for tokens to avoid repeated calls
    function _getTokenDecimals(GoldMinterStorage storage $) internal view returns (
        uint8 goldDecimals,
        uint8 usdtDecimals,
        uint8 usdcDecimals,
        uint8 oracleDecimals
    ) {
        return (
            $.goldToken.decimals(),
            $.USDT.decimals(),
            $.USDC.decimals(),
            $.goldPriceFeed.decimals()
        );
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
    function _validateSlippage(
        uint256 expectedOutput,
        uint256 minAmount,
        uint16 slippage_
    ) internal pure {
        if (
            !(((expectedOutput * (10000 + slippage_)) / 10000) >= minAmount &&
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
    function _getUSDToken(
        GoldMinterStorage storage $,
        address usdToken
    ) internal view returns (IERC20Exp) {
        if (usdToken == address($.USDT)) return $.USDT;
        if (usdToken == address($.USDC)) return $.USDC;
        revert Errors.InvalidUSDToken();
    }

    /// @dev Temporary approach to avoid stack too deep error
    function _emitInitialize() internal {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        emit UpdateSlippage($.slippage);
        emit UpdateFees($.fees);
        emit UpdateMinGold($.minGoldAmount);
        emit UpdateMinGoldFee($.minGoldFee);
        emit UpdateMinGoldFeeAmount($.minGoldFeeAmount);
        emit UpdateAutoSettle($.autoSettle);

        emit UpdateTradingLevel($.tradeLevel);
        emit UpdateRecipient($.usdRecipient);

        (uint8 goldDecimals, uint8 usdtDecimals, uint8 usdcDecimals, ) = _getTokenDecimals($);
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

    function _getValidatedPrice() internal view returns (uint256, uint8) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        (, int256 price, , uint256 updatedAt, ) = $.goldPriceFeed.latestRoundData();

        if (price <= 0) revert Errors.InvalidPrice();

		if (uint256(price) < $.minGoldPrice || uint256(price) > $.maxGoldPrice) {
          revert Errors.PriceOutOfRange();
      	}
		
        if (block.timestamp - updatedAt > $.maxPriceAge) {
            revert Errors.StalePrice();
        }

        (, , , uint8 oracleDecimals) = _getTokenDecimals($);
        return (uint256(price), oracleDecimals);
    }

    function _verifyKYCMintSignature(
        IGoldMinter.KYCMintRequest memory request,
        bytes memory signature
    ) internal view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (request.deadline < block.timestamp) return false;
        if (request.nonce != $.kycNonces[request.user] + 1) return false;

        bytes32 structHash = keccak256(abi.encode(
            KYC_MINT_REQUEST_TYPEHASH,
            request.user,
            request.kycLevel,
            request.nonce,
            request.deadline,
            request.usdToken,
            request.usdAmount,
            request.minGoldAmount
        ));

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signature);

        return isSettler(signer);
    }

    function _verifyKYCBurnSignature(
        IGoldMinter.KYCBurnRequest memory request,
        bytes memory signature
    ) internal view returns (bool) {
        GoldMinterStorage storage $ = _getGoldMinterStorage();

        if (request.deadline < block.timestamp) return false;
        if (request.nonce != $.kycNonces[request.user] + 1) return false;

        bytes32 structHash = keccak256(abi.encode(
            KYC_BURN_REQUEST_TYPEHASH,
            request.user,
            request.kycLevel,
            request.nonce,
            request.deadline,
            request.usdToken,
            request.goldAmount,
            request.minUsdAmount
        ));

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signature);

        return isSettler(signer);
    }

    // ============ Private Functions ============

    function _getGoldMinterStorage() private pure returns (GoldMinterStorage storage $) {
        assembly {
            $.slot := GoldMinterStorageLocation
        }
    }
}