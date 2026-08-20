// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {
    ReentrancyGuardTransientUpgradeable
} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardTransientUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable2Step } from "../libraries/Ownable2Step.sol";
import { Errors } from "../libraries/Errors.sol";
import { Asset, ReportV8, ReportV3 } from "../interfaces/DataStreamsReports.sol";
import { IVerifierProxy } from "../interfaces/IVerifierProxy.sol";
import { IDataStreamsFeeManager } from "../interfaces/IDataStreamsFeeManager.sol";

/**
 * @title GoldStreamVerifier
 * @notice Pull-based gold price oracle backed by Chainlink Data Streams.
 *         Verifies a signed report on-chain,
 *         enforces report freshness (expiresAt + maxReportAge) and market-open,
 *         and returns an 8-decimal price for `GoldMinter` to consume at request
 *         time. No replay watermark by design — see verifyAndGetPrice.
 * @dev Canonical Chainlink pattern (separate consumer contract). Only the
 *      configured `goldMinter` may consume reports, so no one can drain the
 *      contract's LINK by replaying valid reports.
 */
contract GoldStreamVerifier is Ownable2Step, ReentrancyGuardTransientUpgradeable {
    using SafeERC20 for IERC20;

    // keccak256(abi.encode(uint256(keccak256("ontorium.storage.GoldStreamVerifier")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant GoldStreamVerifierStorageLocation =
        0x0c9a3be3cfb6d68f46ef8a8d719d0d4f91c0b0580b394fa83f7e89420dac6c00;

    /// @dev Data Streams marketStatus: 0 = Unknown, 1 = Closed, 2 = Open.
    uint32 internal constant MARKET_STATUS_OPEN = 2;

    /// @dev Output precision; matches `DataFeed.decimals` and GoldMinter's
    ///      ounce-based bound checks (e.g. minGoldPrice = 500e8).
    uint8 internal constant FEED_DECIMALS = 8;

    /// @dev Bounds for maxReportAge — the primary anti-stale/anti-cherry-pick
    ///      defense (see verifyAndGetPrice), so the ceiling stays tight.
    uint32 internal constant MIN_MAX_REPORT_AGE = 1 minutes;
    uint32 internal constant MAX_MAX_REPORT_AGE = 2 minutes;

    /// @dev Report price precision is bounded to [FEED_DECIMALS, 18]. Data Streams
    ///      v8/v3 midPrice is 18-decimal; the ceiling is pinned to that source
    ///      precision because setting `reportDecimals` ABOVE it silently over-divides
    ///      the price by a power of ten (a value of 19 makes an $X price scale to
    ///      $X/10, which can still pass GoldMinter's [500e8,10000e8] bound at high
    ///      gold prices → severe under-collateralization).
    uint8 internal constant MAX_REPORT_DECIMALS = 18;

    /// @custom:storage-location erc7201:ontorium.storage.GoldStreamVerifier
    struct GoldStreamVerifierStorage {
        address verifierProxy;
        address linkToken;
        bytes32 feedId;
        address goldMinter;
        /// @dev Source precision of the report's midPrice. Default 18; settable
        ///      because the exact RWA stream precision must be confirmed against
        ///      the live feed.
        uint8 reportDecimals;
        /// @dev Consumer-side freshness bound (seconds since observation).
        ///      Default 90s, bounded to [1 min, 2 min].
        uint32 maxReportAge;
        /// @dev Accept v3 (crypto) reports. Default false: v3 has no market status
        ///      (forced Open), so a gold (v8) deployment must not silently accept it.
        bool allowV3;
    }

    // ============ Events ============

    event GoldMinterUpdated(address indexed goldMinter);
    event VerifierProxyUpdated(address indexed verifierProxy);
    event FeedIdUpdated(bytes32 indexed feedId);
    event LinkTokenUpdated(address indexed linkToken);
    event ReportDecimalsUpdated(uint8 reportDecimals);
    event MaxReportAgeUpdated(uint32 maxReportAge);
    event AllowV3Updated(bool allowed);
    event PriceVerified(uint256 price8, uint32 observationsTimestamp, uint32 marketStatus);

    // ============ Modifiers ============

    modifier onlyGoldMinter() {
        if (msg.sender != _getStorage().goldMinter) {
            revert Errors.NotGoldMinter();
        }
        _;
    }

    // ============ Initializer ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner, address _verifierProxy, address _linkToken, bytes32 _feedId)
        public
        initializer
    {
        if (_owner == address(0)) revert Errors.ZeroOwner();
        if (_verifierProxy == address(0)) revert Errors.ZeroVerifier();
        if (_linkToken == address(0)) revert Errors.ZeroLinkToken();
        if (_feedId == bytes32(0)) revert Errors.ZeroFeedId();

        __Ownable_init(_owner);
        // transient (EIP-1153) guard — the old guard namespace is dead.
        __ReentrancyGuardTransient_init();

        GoldStreamVerifierStorage storage $ = _getStorage();
        $.verifierProxy = _verifierProxy;
        $.linkToken = _linkToken;
        $.feedId = _feedId;
        $.reportDecimals = 18;
        $.maxReportAge = 90 seconds;
    }

    // ============ Core ============

    /**
     * @notice Verify a signed Data Streams report and return the gold price.
     * @param unverifiedReport The full signed report blob from the Data Streams API.
     * @return price8 Gold price scaled to 8 decimals (ounce-based, as the prior feed).
     * @return observationsTimestamp When the DON observed the price.
     * @return marketStatus 2 = Open (enforced); reverts otherwise.
     * @return expiresAt Report expiry (already enforced > block.timestamp).
     */
    function verifyAndGetPrice(bytes calldata unverifiedReport)
        external
        onlyGoldMinter
        nonReentrant
        returns (uint256 price8, uint32 observationsTimestamp, uint32 marketStatus, uint32 expiresAt)
    {
        GoldStreamVerifierStorage storage $ = _getStorage();

        // Split the blob into (reportContext, reportData); fees are quoted on reportData.
        (, bytes memory reportData) = abi.decode(unverifiedReport, (bytes32[3], bytes));

        // Schema version = first 2 bytes of reportData (== feedId prefix): 0x0008 = v8 (RWA/gold), 0x0003 = v3 (crypto).
        uint16 reportVersion = (uint16(uint8(reportData[0])) << 8) | uint16(uint8(reportData[1]));

        // Fee handling. If a FeeManager is set, quote the LINK fee and approve the
        // RewardManager (it pulls LINK from this contract during verify()).
        address feeManager = IVerifierProxy($.verifierProxy).s_feeManager();
        address link = $.linkToken;
        address rewardManager;
        bytes memory parameterPayload;
        if (feeManager != address(0)) {
            (Asset memory fee,,) = IDataStreamsFeeManager(feeManager).getFeeAndReward(address(this), reportData, link);
            if (fee.amount > 0) {
                rewardManager = IDataStreamsFeeManager(feeManager).i_rewardManager();
                IERC20(link).forceApprove(rewardManager, fee.amount);
            }
            parameterPayload = abi.encode(link);
        }

        bytes memory verified = IVerifierProxy($.verifierProxy).verify(unverifiedReport, parameterPayload);

        // Clear any residual allowance. The RewardManager pulls exactly the fee
        // during verify(); zeroing defends against a partial pull by a misbehaving
        // fee contract leaving a lingering approval.
        if (rewardManager != address(0)) {
            IERC20(link).forceApprove(rewardManager, 0);
        }

        // Decode by schema version into common fields. v3 (crypto) has no market
        // status — crypto trades 24/7, so it is treated as Open.
        bytes32 feedId;
        uint32 validFrom;
        int192 rawPrice;
        if (reportVersion == 8) {
            ReportV8 memory r = abi.decode(verified, (ReportV8));
            feedId = r.feedId;
            validFrom = r.validFromTimestamp;
            observationsTimestamp = r.observationsTimestamp;
            expiresAt = r.expiresAt;
            rawPrice = r.midPrice;
            marketStatus = r.marketStatus;
        } else if (reportVersion == 3) {
            // v3 (crypto) has no market status; reject unless explicitly enabled so a
            // gold (v8) deployment cannot silently accept it.
            if (!$.allowV3) revert Errors.InvalidReportVersion();
            ReportV3 memory r = abi.decode(verified, (ReportV3));
            feedId = r.feedId;
            validFrom = r.validFromTimestamp;
            observationsTimestamp = r.observationsTimestamp;
            expiresAt = r.expiresAt;
            rawPrice = r.price;
            marketStatus = MARKET_STATUS_OPEN; // crypto: always tradeable
        } else {
            revert Errors.InvalidReportVersion();
        }

        // Report-specific checks the Verifier does not perform for us.
        if (feedId != $.feedId) revert Errors.InvalidReportFeed();
        if (rawPrice <= 0) revert Errors.InvalidPrice();
        if (block.timestamp < validFrom) revert Errors.ReportNotYetValid();
        if (block.timestamp > expiresAt) revert Errors.ReportExpired();
        // Consumer-side freshness bound (independent of Chainlink's expiresAt) and
        // the PRIMARY anti-cherry-pick / anti-stale defense: reject any report
        // observed more than `maxReportAge` ago. There is intentionally no global
        // replay watermark — re-using a still-fresh report is harmless (each
        // request deposits fresh funds and pays its own fee), and a shared
        // watermark would let anyone front-run/grief honest callers.
        if (block.timestamp > uint256(observationsTimestamp) + $.maxReportAge) {
            revert Errors.ReportTooOld();
        }
        if (marketStatus != MARKET_STATUS_OPEN) revert Errors.MarketClosed();

        // rawPrice > 0 is enforced above, so the int192 -> uint256 cast cannot truncate.
        // forge-lint: disable-next-line(unsafe-typecast)
        price8 = _scaleTo8(uint256(int256(rawPrice)), $.reportDecimals);
        if (price8 == 0) revert Errors.InvalidPrice(); // defense-in-depth: scaling could truncate a tiny price to 0

        emit PriceVerified(price8, observationsTimestamp, marketStatus);
    }

    /// @dev Scale a raw report price from `reportDecimals` to FEED_DECIMALS (8).
    function _scaleTo8(uint256 raw, uint8 reportDecimals) internal pure returns (uint256) {
        if (reportDecimals > FEED_DECIMALS) {
            return raw / (10 ** (reportDecimals - FEED_DECIMALS));
        }
        if (reportDecimals < FEED_DECIMALS) {
            return raw * (10 ** (FEED_DECIMALS - reportDecimals));
        }
        return raw;
    }

    // ============ Views ============

    function config()
        external
        view
        returns (
            address verifierProxy,
            address linkToken,
            bytes32 feedId,
            address goldMinter,
            uint8 reportDecimals,
            uint32 maxReportAge
        )
    {
        GoldStreamVerifierStorage storage $ = _getStorage();
        return ($.verifierProxy, $.linkToken, $.feedId, $.goldMinter, $.reportDecimals, $.maxReportAge);
    }

    // ============ Owner Setters ============

    function setGoldMinter(address _goldMinter) external onlyOwner {
        if (_goldMinter == address(0)) revert Errors.ZeroGoldMinter();
        _getStorage().goldMinter = _goldMinter;
        emit GoldMinterUpdated(_goldMinter);
    }

    function setVerifierProxy(address _verifierProxy) external onlyOwner {
        if (_verifierProxy == address(0)) revert Errors.ZeroVerifier();
        _getStorage().verifierProxy = _verifierProxy;
        emit VerifierProxyUpdated(_verifierProxy);
    }

    function setFeedId(bytes32 _feedId) external onlyOwner {
        if (_feedId == bytes32(0)) revert Errors.ZeroFeedId();
        _getStorage().feedId = _feedId;
        emit FeedIdUpdated(_feedId);
    }

    function setLinkToken(address _linkToken) external onlyOwner {
        if (_linkToken == address(0)) revert Errors.ZeroLinkToken();
        _getStorage().linkToken = _linkToken;
        emit LinkTokenUpdated(_linkToken);
    }

    function setReportDecimals(uint8 _reportDecimals) external onlyOwner {
        // [FEED_DECIMALS, 18] — see MAX_REPORT_DECIMALS for the over-divide hazard.
        if (_reportDecimals < FEED_DECIMALS || _reportDecimals > MAX_REPORT_DECIMALS) {
            revert Errors.InvalidReportDecimals();
        }
        _getStorage().reportDecimals = _reportDecimals;
        emit ReportDecimalsUpdated(_reportDecimals);
    }

    function setMaxReportAge(uint32 _maxReportAge) external onlyOwner {
        if (_maxReportAge < MIN_MAX_REPORT_AGE || _maxReportAge > MAX_MAX_REPORT_AGE) revert Errors.InvalidPriceAge();
        _getStorage().maxReportAge = _maxReportAge;
        emit MaxReportAgeUpdated(_maxReportAge);
    }

    /// @notice Enable/disable acceptance of v3 (crypto) reports. Default false.
    ///         Keep false for gold (v8) deployments.
    function setAllowV3(bool _allowed) external onlyOwner {
        _getStorage().allowV3 = _allowed;
        emit AllowV3Updated(_allowed);
    }

    /// @notice Whether v3 (crypto) reports are currently accepted.
    function allowV3() external view returns (bool) {
        return _getStorage().allowV3;
    }

    /// @notice Withdraw LINK held for verification fees.
    function withdrawLink(address to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert Errors.ZeroRecipient();
        IERC20(_getStorage().linkToken).safeTransfer(to, amount);
    }

    // ============ Private ============

    function _getStorage() private pure returns (GoldStreamVerifierStorage storage $) {
        assembly {
            $.slot := GoldStreamVerifierStorageLocation
        }
    }
}
