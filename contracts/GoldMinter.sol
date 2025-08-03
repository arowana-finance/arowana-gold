// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import { IERC20Exp, IERC20Mintable } from './interfaces/IERC20.sol';
import { IPriceFeed } from './interfaces/IPriceFeed.sol';
import { WithSettler } from './libraries/WithSettler.sol';
import { SigLib } from './libraries/SigLib.sol';

contract GoldMinter is WithSettler, ReentrancyGuardUpgradeable {
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

    event UpdateLevel(address indexed user, Levels level);
    event UpdateSlippage(uint16 newSlippage);
    event UpdateFees(uint16 newFees);
    event UpdateMinGold(uint256 minGoldAmount);
    event UpdateMinGoldFee(uint256 minGoldFee);
    event UpdateMinGoldFeeAmount(uint256 minGoldFeeAmount);

    event UpdateTradingLevel(Levels level);
    event UpdateRecipient(address newRecipient);

    event Initialized(
        address goldToken,
        uint8 goldTokenDecimals,
        address USDT,
        uint8 USDTDecimals,
        address USDC,
        uint8 USDCDecimals,
        address goldPriceFeed,
        address goldReserveFeed
    );

    IERC20Mintable public goldToken;

    IERC20Exp public USDT;
    IERC20Exp public USDC;

    IPriceFeed public goldPriceFeed;
    IPriceFeed public goldReserveFeed;

    /// @dev Account Level
    enum Levels {
        DEFAULT, // 0
        KYCD, // 1
        APPROVED // 2
    }

    mapping(address => uint8) public levels;

    Levels public tradeLevel = Levels.DEFAULT;

    uint16 public slippage = 500;
    /// @dev Basis Point, 0.5%
    uint16 public fees = 50;

    uint256 public minGoldAmount = 0.02 ether;
    uint256 public minGoldFee = 0.01 ether;
    uint256 public minGoldFeeAmount = 1 ether;

    /// @dev Address to receive USDC / USDT from customers (to buy gold and replenish reserves)
    address public usdRecipient;

    struct MintOrder {
        address buyer; // Buyer address
        IERC20Exp usdToken; // USDT / USDC address
        uint256 usdAmount; // Buying Gold with this amount
        uint256 minGoldAmount; // Minimum gold output that customers desire
        uint256 goldAmount; // Paid gold amount
        bool success; // Mark if order is complete with expected output
        bool isSettled; // Mark if order is processed by backend
    }
    MintOrder[] public mintOrders;

    struct BurnOrder {
        address seller;
        IERC20Exp usdToken; // USDT / USDC address
        uint256 goldAmount;
        uint256 minUsdAmount;
        uint256 usdAmount;
        bool success;
        bool isSettled;
    }
    BurnOrder[] public burnOrders;

    /// @dev Temporary approach to avoid stack too deep error
    function _emitInitialize() internal {
        emit UpdateSlippage(slippage);
        emit UpdateFees(fees);
        emit UpdateMinGold(minGoldAmount);
        emit UpdateMinGoldFee(minGoldFee);
        emit UpdateMinGoldFeeAmount(minGoldFeeAmount);

        emit UpdateTradingLevel(tradeLevel);
        emit UpdateRecipient(usdRecipient);

        emit Initialized(
            address(goldToken),
            goldToken.decimals(),
            address(USDT),
            USDT.decimals(),
            address(USDC),
            USDC.decimals(),
            address(goldPriceFeed),
            address(goldReserveFeed)
        );
    }

    function initializeGoldMinter(
        address _goldToken,
        address _USDT,
        address _USDC,
        address _goldPriceFeed,
        address _goldReserveFeed,
        address _usdRecipient,
        address _owner
    ) public virtual initializer {
        super._initialize(_owner);
        __ReentrancyGuard_init();

        goldToken = IERC20Mintable(_goldToken);

        USDT = IERC20Exp(_USDT);
        USDC = IERC20Exp(_USDC);

        goldPriceFeed = IPriceFeed(_goldPriceFeed);
        goldReserveFeed = IPriceFeed(_goldReserveFeed);

        slippage = 500; // 5%
        fees = 50; // 0.5%
        minGoldAmount = 0.02 ether;
        minGoldFee = 0.01 ether;
        minGoldFeeAmount = 1 ether;
        //tradeLevel = Levels.APPROVED;

        usdRecipient = _usdRecipient;

        _emitInitialize();
    }

    function getGoldAmount(address usdToken, uint256 usdAmount) public view returns (uint256) {
        (uint256 latestPrice, uint8 priceOracleDecimals) = (
            uint256(goldPriceFeed.latestAnswer()),
            goldPriceFeed.decimals()
        );
        uint8 goldDecimals = goldToken.decimals();
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();
        // (10 ** 6) * (10 ** 10) / 299315000000
        return (usdAmount * 10 ** (priceOracleDecimals + goldDecimals - usdDecimals)) / latestPrice;
    }

    function getUsdAmount(address usdToken, uint256 goldAmount) public view returns (uint256) {
        (uint256 latestPrice, uint8 priceOracleDecimals) = (
            uint256(goldPriceFeed.latestAnswer()),
            goldPriceFeed.decimals()
        );
        uint8 goldDecimals = goldToken.decimals();
        uint8 usdDecimals = IERC20Exp(usdToken).decimals();
        // (10 ** 8 * 299315000000 / 10 ** 10)
        return (goldAmount * latestPrice) / 10 ** (priceOracleDecimals + goldDecimals - usdDecimals);
    }

    function canMint(uint256 goldAmount) public view returns (bool) {
        uint256 tokenSupply = goldToken.totalSupply();
        uint8 tokenDecimals = goldToken.decimals();
        uint8 goldDecimals = goldReserveFeed.decimals();
        uint256 goldReserves = uint256(goldReserveFeed.latestAnswer()) * 10 ** (tokenDecimals - goldDecimals);
        return goldReserves >= (tokenSupply + goldAmount);
    }

    /// @dev Return fee amount in Gold
    function calculateGoldFee(uint256 _goldAmount) public view returns (uint256) {
        if (_goldAmount < minGoldFeeAmount) {
            return minGoldFee;
        }
        return (_goldAmount * fees) / 10000;
    }

    function requestMint(address _usdToken, uint256 _usdAmount, uint256 _minGoldAmount) public nonReentrant {
        // Apply maximum 5% slippage
        uint256 expectedOutput = getGoldAmount(_usdToken, _usdAmount);

        require(
            ((expectedOutput * (10000 + slippage)) / 10000) > _minGoldAmount &&
                _minGoldAmount > ((expectedOutput * (10000 - slippage)) / 10000),
            'Underpriced'
        );
        require(_minGoldAmount >= minGoldAmount, 'SmallAmount');
        // commented out here to allow overbooking over reserves
        //require(canMint(_minGoldAmount), 'Oversupply');
        require(levels[msg.sender] >= uint(tradeLevel), 'Underlevel');

        IERC20Exp usdToken = _usdToken == address(USDT) ? USDT : USDC;

        usdToken.safeTransferFrom(msg.sender, usdRecipient, _usdAmount);

        mintOrders.push(
            MintOrder({
                buyer: msg.sender,
                usdToken: usdToken,
                usdAmount: _usdAmount,
                minGoldAmount: _minGoldAmount,
                goldAmount: 0,
                success: false,
                isSettled: false
            })
        );

        emit RequestMint(mintOrders.length - 1, msg.sender, address(usdToken), _usdAmount, _minGoldAmount);
    }

    function requestMintPermit(
        address _usdToken,
        uint256 _usdAmount,
        uint256 _minGoldAmount,
        uint256 _sigDeadline,
        bytes calldata _signature
    ) external {
        (uint8 v, bytes32 r, bytes32 s) = _signature.toVRS();
        IERC20Exp usdToken = _usdToken == address(USDT) ? USDT : USDC;
        usdToken.permit(msg.sender, address(this), _usdAmount, _sigDeadline, v, r, s);

        requestMint(_usdToken, _usdAmount, _minGoldAmount);
    }

    function settleMint(uint256 mintNonce, uint256 goldAmount) public onlySettlers {
        require(mintNonce < mintOrders.length, 'Invalid nonce');
        require(!mintOrders[mintNonce].isSettled, 'Already settled');

        bool success = goldAmount >= mintOrders[mintNonce].minGoldAmount && canMint(goldAmount);

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

    function requestBurn(address _usdToken, uint256 _goldAmount, uint256 _minUsdAmount) public nonReentrant {
        // Apply maximum 5% slippage
        uint256 expectedOutput = getUsdAmount(_usdToken, _goldAmount);

        require(
            ((expectedOutput * (10000 + slippage)) / 10000) >= _minUsdAmount &&
                _minUsdAmount > ((expectedOutput * (10000 - slippage)) / 10000),
            'Underpriced'
        );
        require(_goldAmount >= minGoldAmount, 'SmallAmount');
        require(levels[msg.sender] >= uint(tradeLevel), 'Underlevel');

        goldToken.safeTransferFrom(msg.sender, address(this), _goldAmount);

        burnOrders.push(
            BurnOrder({
                seller: msg.sender,
                usdToken: IERC20Exp(_usdToken),
                goldAmount: _goldAmount,
                minUsdAmount: _minUsdAmount,
                usdAmount: 0,
                success: false,
                isSettled: false
            })
        );

        emit RequestBurn(burnOrders.length - 1, msg.sender, address(_usdToken), _goldAmount, _minUsdAmount);
    }

    function requestBurnPermit(
        address _usdToken,
        uint256 _goldAmount,
        uint256 _minUsdAmount,
        uint256 _sigDeadline,
        bytes calldata _signature
    ) external {
        (uint8 v, bytes32 r, bytes32 s) = _signature.toVRS();
        goldToken.permit(msg.sender, address(this), _goldAmount, _sigDeadline, v, r, s);

        requestBurn(_usdToken, _goldAmount, _minUsdAmount);
    }

    function settleBurn(uint256 burnNonce, uint256 usdAmount) public onlySettlers {
        require(burnNonce < burnOrders.length, 'Invalid nonce');
        require(!burnOrders[burnNonce].isSettled, 'Already settled');

        uint256 goldAmount = burnOrders[burnNonce].goldAmount;
        bool success = usdAmount >= burnOrders[burnNonce].minUsdAmount;

        if (!success) {
            goldToken.safeTransfer(burnOrders[burnNonce].seller, goldAmount);
        } else {
            burnOrders[burnNonce].usdAmount = usdAmount;

            IERC20Exp usdToken = burnOrders[burnNonce].usdToken;
            uint256 feeAmount = calculateGoldFee(goldAmount);

            goldToken.burn(goldAmount - feeAmount);
            goldToken.safeTransfer(usdRecipient, feeAmount);
            usdToken.safeTransferFrom(usdRecipient, burnOrders[burnNonce].seller, usdAmount);
        }

        burnOrders[burnNonce].success = success;
        burnOrders[burnNonce].isSettled = true;

        emit SettleBurn(burnNonce, usdAmount, success);
    }

    function setLevel(address user, Levels level) external onlySettlers {
        levels[user] = uint8(level);
        emit UpdateLevel(user, level);
    }

    function updateSlippage(uint8 _slippage) external onlyOwner {
        require(_slippage < 1000, 'OVERFLOW');
        slippage = _slippage;
        emit UpdateSlippage(_slippage);
    }

    function updateFees(uint8 _fees) external onlyOwner {
        require(_fees < 1000, 'OVERFLOW');
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

    function updateTradingLevel(Levels level) external onlyOwner {
        tradeLevel = level;
        emit UpdateTradingLevel(level);
    }

    function updateRecipient(address _usdRecipient) external onlyOwner {
        usdRecipient = _usdRecipient;
        emit UpdateRecipient(_usdRecipient);
    }
}
