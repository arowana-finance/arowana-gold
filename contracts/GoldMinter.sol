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

    IERC20Mintable public goldToken;

    IERC20Exp public USDT;
    IERC20Exp public USDC;

    IPriceFeed public goldPriceFeed;

    mapping(address => uint8) public levels;
    mapping(address => bool) public amlBlacklist;
    mapping(address => uint256) public kycNonces;

    // EIP-712 type hashes
    bytes32 public constant KYC_MINT_REQUEST_TYPEHASH =
        keccak256("KYCMintRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 usdAmount,uint256 minGoldAmount)");

    bytes32 public constant KYC_BURN_REQUEST_TYPEHASH =
        keccak256("KYCBurnRequest(address user,uint8 kycLevel,uint256 nonce,uint256 deadline,address usdToken,uint256 goldAmount,uint256 minUsdAmount)");

    IGoldMinter.MintOrder[] public mintOrders;
    IGoldMinter.BurnOrder[] public burnOrders;

    IGoldMinter.Levels public tradeLevel = IGoldMinter.Levels.DEFAULT;

    uint16 public slippage = 500;
    /// @dev Basis Point, 0.5%
    uint16 public fees = 50;

    uint256 public minGoldAmount = 0.02 ether;
    uint256 public minGoldFee = 0.01 ether;
    uint256 public minGoldFeeAmount = 1 ether;

    bool public autoSettle = true;

    /// @dev Address to receive USDC / USDT from customers (to buy gold and replenish reserves)
    address public usdRecipient;

    /// @dev Oracle price validation parameters
    uint256 public constant MAX_PRICE_AGE = 10 minutes;
    uint256 public constant MIN_GOLD_PRICE = 50000000000; // $500 (8 decimals)
    uint256 public constant MAX_GOLD_PRICE = 1000000000000; // $10,000 (8 decimals)

    /// @dev Temporary approach to avoid stack too deep error
    function _emitInitialize() internal {
        emit UpdateSlippage(slippage);
        emit UpdateFees(fees);
        emit UpdateMinGold(minGoldAmount);
        emit UpdateMinGoldFee(minGoldFee);
        emit UpdateMinGoldFeeAmount(minGoldFeeAmount);
        emit UpdateAutoSettle(autoSettle);

        emit UpdateTradingLevel(tradeLevel);
        emit UpdateRecipient(usdRecipient);

        emit Initialized(
            address(goldToken),
            goldToken.decimals(),
            address(USDT),
            USDT.decimals(),
            address(USDC),
            USDC.decimals(),
            address(goldPriceFeed)
        );
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

        goldToken = IERC20Mintable(_goldToken);

        USDT = IERC20Exp(_USDT);
        USDC = IERC20Exp(_USDC);

        goldPriceFeed = IPriceFeed(_goldPriceFeed);

        slippage = 500; // 5%
        fees = 50; // 0.5%
        minGoldAmount = 0.02 ether;
        minGoldFee = 0.01 ether;
        minGoldFeeAmount = 1 ether;
        autoSettle = _autoSettle;
        //tradeLevel = IGoldMinter.Levels.APPROVED;

        usdRecipient = _usdRecipient;

        __ReentrancyGuard_init();
        __Pausable_init();
        __EIP712_init("GoldMinter", "1");
        _initializeSettler(_owner);
        _emitInitialize();
    }

    function _getValidatedPrice() internal view returns (uint256, uint8) {
        (, int256 price, , uint256 updatedAt, ) = goldPriceFeed.latestRoundData();

        if (price <= 0) revert Errors.InvalidPrice();
        if (price < int256(MIN_GOLD_PRICE) || price > int256(MAX_GOLD_PRICE)) {
            revert Errors.PriceOutOfRange();
        }
        if (block.timestamp - updatedAt > MAX_PRICE_AGE) {
            revert Errors.StalePrice();
        }

        return (uint256(price), goldPriceFeed.decimals());
    }

    function getGoldAmount(address usdToken, uint256 usdAmount) public view returns (uint256) {
        (uint256 latestPrice, uint8 priceOracleDecimals) = _getValidatedPrice();
        uint8 goldDecimals = goldToken.decimals();
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();
        // (10 ** 6) * (10 ** 10) / 299315000000
        return (usdAmount * 10 ** (priceOracleDecimals + goldDecimals - usdDecimals)) / latestPrice;
    }

    function getUsdAmount(address usdToken, uint256 goldAmount) public view returns (uint256) {
        (uint256 latestPrice, uint8 priceOracleDecimals) = _getValidatedPrice();
        uint8 goldDecimals = goldToken.decimals();
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();
        // (10 ** 8 * 299315000000 / 10 ** 10)
        return (goldAmount * latestPrice) / 10 ** (priceOracleDecimals + goldDecimals - usdDecimals);
    }

    function canBurn(IERC20Exp usdToken, uint256 usdAmount) public view returns (bool) {
        return usdToken.balanceOf(usdRecipient) >= usdAmount;
    }

    /// @dev Return fee amount in Gold
    function calculateGoldFee(uint256 _goldAmount) public view returns (uint256) {
        if (_goldAmount < minGoldFeeAmount) {
            return minGoldFee;
        }
        return (_goldAmount * fees) / 10000;
    }

    function _verifyKYCMintSignature(
        IGoldMinter.KYCMintRequest memory request,
        bytes memory signature
    ) internal view returns (bool) {
        if (request.deadline < block.timestamp) return false;
        if (request.nonce <= kycNonces[request.user]) return false;

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
        if (request.deadline < block.timestamp) return false;
        if (request.nonce <= kycNonces[request.user]) return false;

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

    /// @notice Request mint with pre-set KYC level (requires approval in advance)
    function requestMint(
        address _usdToken,
        uint256 _usdAmount,
        uint256 _minGoldAmount
    ) public nonReentrant whenNotPaused {
        // Apply maximum 5% slippage
        uint256 expectedOutput = getGoldAmount(_usdToken, _usdAmount);

        if (
            !(((expectedOutput * (10000 + slippage)) / 10000) >= _minGoldAmount &&
                _minGoldAmount >= ((expectedOutput * (10000 - slippage)) / 10000))
        ) revert Errors.Underpriced();
        if (_minGoldAmount < minGoldAmount) revert Errors.SmallAmount();
        // commented out here to allow overbooking over reserves
        if (levels[msg.sender] < uint(tradeLevel)) revert Errors.Underlevel();
        if (amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

        IERC20Exp usdToken = _usdToken == address(USDT) ? USDT : USDC;

        usdToken.safeTransferFrom(msg.sender, usdRecipient, _usdAmount);

        uint256 mintNonce = mintOrders.length;

        mintOrders.push(
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

        if (autoSettle) {
            _settleMint(mintNonce, expectedOutput);
        }
    }


    /// @notice Request mint with KYC signature and optional permit (recommended flow)
    function requestMintWithKYC(
        IGoldMinter.KYCMintRequest memory kycRequest,
        bytes memory kycSignature,
        bytes memory permitSignature
    ) external whenNotPaused {
        if (msg.sender != kycRequest.user) revert Errors.InvalidSignature();
        if (amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

        // Verify KYC signature from backend (optional)
        if (kycSignature.length > 0) {
            if (!_verifyKYCMintSignature(kycRequest, kycSignature)) {
                revert Errors.InvalidSignature();
            }

            // Update KYC level and nonce
            levels[msg.sender] = kycRequest.kycLevel;
            kycNonces[msg.sender] = kycRequest.nonce;

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

        // Handle permit if provided
        if (permitSignature.length > 0) {
            (uint8 v, bytes32 r, bytes32 s) = permitSignature.toVRS();
            IERC20Exp usdToken = kycRequest.usdToken == address(USDT) ? USDT : USDC;
            usdToken.permit(msg.sender, address(this), kycRequest.usdAmount, kycRequest.deadline, v, r, s);
        }

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
        if (amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

        (uint8 v, bytes32 r, bytes32 s) = _signature.toVRS();
        IERC20Exp usdToken = _usdToken == address(USDT) ? USDT : USDC;
        usdToken.permit(msg.sender, address(this), _usdAmount, _sigDeadline, v, r, s);

        requestMint(_usdToken, _usdAmount, _minGoldAmount);
    }

    function settleMint(uint256 mintNonce, uint256 goldAmount) public onlySettlers {
        _settleMint(mintNonce, goldAmount);
    }

    function _settleMint(uint256 mintNonce, uint256 goldAmount) internal {
        if (mintNonce >= mintOrders.length) revert Errors.InvalidNonce();
        if (mintOrders[mintNonce].isSettled) revert Errors.AlreadySettled();

        bool success = goldAmount >= mintOrders[mintNonce].minGoldAmount;

        // Issue refund if deposited usd is insufficient
        if (!success) {
            (IERC20Exp usdToken, uint256 usdAmount) = (
                mintOrders[mintNonce].usdToken,
                mintOrders[mintNonce].usdAmount
            );

            usdToken.safeTransferFrom(usdRecipient, mintOrders[mintNonce].buyer, usdAmount);

            // Mint desired gold amount
        } else {
            mintOrders[mintNonce].goldAmount = goldAmount;

            uint256 feeAmount = calculateGoldFee(goldAmount);

            goldToken.mint(usdRecipient, feeAmount);
            goldToken.mint(mintOrders[mintNonce].buyer, goldAmount - feeAmount);
        }

        mintOrders[mintNonce].success = success;
        mintOrders[mintNonce].isSettled = true;

        emit SettleMint(mintNonce, goldAmount, success);
    }

    /// @notice Request burn with pre-set KYC level (requires approval in advance)
    function requestBurn(
        address _usdToken,
        uint256 _goldAmount,
        uint256 _minUsdAmount
    ) public nonReentrant whenNotPaused {
        // Apply maximum 5% slippage
        uint256 expectedOutput = getUsdAmount(_usdToken, _goldAmount);

        if (
            !(((expectedOutput * (10000 + slippage)) / 10000) >= _minUsdAmount &&
                _minUsdAmount >= ((expectedOutput * (10000 - slippage)) / 10000))
        ) revert Errors.Underpriced();
        if (_goldAmount < minGoldAmount) revert Errors.SmallAmount();
        if (levels[msg.sender] < uint(tradeLevel)) revert Errors.Underlevel();
        if (amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

        goldToken.safeTransferFrom(msg.sender, address(this), _goldAmount);

        uint256 burnNonce = burnOrders.length;

        burnOrders.push(
            IGoldMinter.BurnOrder({
                seller: msg.sender,
                usdToken: IERC20Exp(_usdToken),
                goldAmount: _goldAmount,
                minUsdAmount: _minUsdAmount,
                usdAmount: 0,
                success: false,
                isSettled: false
            })
        );

        emit RequestBurn(burnNonce, msg.sender, _usdToken, _goldAmount, _minUsdAmount);

        if (autoSettle && canBurn(IERC20Exp(_usdToken), expectedOutput)) {
            _settleBurn(burnNonce, expectedOutput);
        }
    }


    /// @notice Request burn with KYC signature and optional permit (recommended flow)
    function requestBurnWithKYC(
        IGoldMinter.KYCBurnRequest memory kycRequest,
        bytes memory kycSignature,
        bytes memory permitSignature
    ) external whenNotPaused {
        if (msg.sender != kycRequest.user) revert Errors.InvalidSignature();
        if (amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

        // Verify KYC signature from backend (optional)
        if (kycSignature.length > 0) {
            if (!_verifyKYCBurnSignature(kycRequest, kycSignature)) {
                revert Errors.InvalidSignature();
            }

            // Update KYC level and nonce
            levels[msg.sender] = kycRequest.kycLevel;
            kycNonces[msg.sender] = kycRequest.nonce;

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

        // Handle permit if provided
        if (permitSignature.length > 0) {
            (uint8 v, bytes32 r, bytes32 s) = permitSignature.toVRS();
            goldToken.permit(msg.sender, address(this), kycRequest.goldAmount, kycRequest.deadline, v, r, s);
        }

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
        if (amlBlacklist[msg.sender]) revert Errors.AMLBlocked();

        (uint8 v, bytes32 r, bytes32 s) = _signature.toVRS();
        goldToken.permit(msg.sender, address(this), _goldAmount, _sigDeadline, v, r, s);

        requestBurn(_usdToken, _goldAmount, _minUsdAmount);
    }

    function settleBurn(uint256 burnNonce, uint256 usdAmount) public onlySettlers {
        _settleBurn(burnNonce, usdAmount);
    }

    function _settleBurn(uint256 burnNonce, uint256 usdAmount) internal {
        if (burnNonce >= burnOrders.length) revert Errors.InvalidNonce();
        if (burnOrders[burnNonce].isSettled) revert Errors.AlreadySettled();

        IERC20Exp usdToken = burnOrders[burnNonce].usdToken;
        uint256 goldAmount = burnOrders[burnNonce].goldAmount;

        bool success = usdAmount >= burnOrders[burnNonce].minUsdAmount && canBurn(usdToken, usdAmount);

        if (!success) {
            goldToken.safeTransfer(burnOrders[burnNonce].seller, goldAmount);
        } else {
            burnOrders[burnNonce].usdAmount = usdAmount;

            uint256 feeAmount = calculateGoldFee(goldAmount);

            goldToken.burn(goldAmount - feeAmount);
            goldToken.safeTransfer(usdRecipient, feeAmount);
            usdToken.safeTransferFrom(usdRecipient, burnOrders[burnNonce].seller, usdAmount);
        }

        burnOrders[burnNonce].success = success;
        burnOrders[burnNonce].isSettled = true;

        emit SettleBurn(burnNonce, usdAmount, success);
    }

    function setLevel(address user, IGoldMinter.Levels level) external onlySettlers {
        levels[user] = uint8(level);
        emit UpdateLevel(user, level);
    }

    function updateSlippage(uint16 _slippage) external onlyOwner {
        if (_slippage >= 1000) revert Errors.Overflow();
        slippage = _slippage;
        emit UpdateSlippage(_slippage);
    }

    function updateFees(uint16 _fees) external onlyOwner {
        if (_fees >= 1000) revert Errors.Overflow();
        fees = _fees;
        emit UpdateFees(_fees);
    }

    function updateMinGold(uint256 _minGold) external onlyOwner {
        minGoldAmount = _minGold;
        emit UpdateMinGold(_minGold);
    }

    function updateMinGoldFee(uint256 _minGoldFee) external onlyOwner {
        minGoldFee = _minGoldFee;
        emit UpdateMinGoldFee(_minGoldFee);
    }

    function updateMinGoldFeeAmount(uint256 _minGoldFeeAmount) external onlyOwner {
        minGoldFeeAmount = _minGoldFeeAmount;
        emit UpdateMinGoldFeeAmount(_minGoldFeeAmount);
    }

    function updateAutoSettle() external onlyOwner {
        autoSettle = autoSettle ? false : true;
        emit UpdateAutoSettle(autoSettle);
    }

    function updateTradingLevel(IGoldMinter.Levels level) external onlyOwner {
        tradeLevel = level;
        emit UpdateTradingLevel(level);
    }

    function updateRecipient(address _usdRecipient) external onlyOwner {
        if (_usdRecipient == address(0)) revert Errors.ZeroUSDRecipient();
        usdRecipient = _usdRecipient;
        emit UpdateRecipient(_usdRecipient);
    }

    function setAMLBlacklist(address user, bool blacklisted) external onlySettlers {
        amlBlacklist[user] = blacklisted;
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
        return amlBlacklist[user];
    }
}
