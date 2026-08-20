// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test, console2 } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import { ERC20Mock } from "../../contracts/tokens/ERC20Mock.sol";
import { GoldMinter } from "../../contracts/GoldMinter.sol";
import { IGoldMinter } from "../../contracts/interfaces/IGoldMinter.sol";
import { IMulticall3 } from "../../contracts/interfaces/IMultiCall3.sol";
import { Errors } from "../../contracts/libraries/Errors.sol";
import { GoldStreamVerifier } from "../../contracts/oracles/GoldStreamVerifier.sol";
import { ReportV8 } from "../../contracts/interfaces/DataStreamsReports.sol";

contract BatchExecutor {
    struct Call {
        address target;
        uint256 value;
        bytes data;
    }

    error NotSelf();

    function execute(Call[] calldata calls) external payable {
        if (msg.sender != address(this)) revert NotSelf();

        for (uint256 i = 0; i < calls.length; ++i) {
            (bool ok, bytes memory ret) = calls[i].target.call{ value: calls[i].value }(calls[i].data);
            if (!ok) {
                assembly {
                    revert(add(ret, 0x20), mload(ret))
                }
            }
        }
    }
}

contract MockGoldToken is ERC20, ERC20Permit {
    constructor() ERC20("Ontorium Gold", "OXAU") ERC20Permit("Ontorium Gold") { }

    function mint(address to, uint256 a) external {
        _mint(to, a);
    }

    function burn(uint256 v) external {
        _burn(msg.sender, v);
    }

    function burnFrom(address acc, uint256 v) external {
        _spendAllowance(acc, msg.sender, v);
        _burn(acc, v);
    }

    function blacklistOracle() external pure returns (address) {
        return address(0);
    }
}

contract E2EGoldMinter is Test {
    address constant VERIFIER_PROXY = 0x478Aa2aC9F6D65F84e09D9185d126c3a17c2a93C;
    address constant LINK = 0xf97f4df75117a78c1A5a0DBb814Af92458539FB4;
    bytes32 constant XAU = 0x0008991d4caf73e8e05f6671ef43cee5e8c5c3652a35fde0b0942e44a77b0e89;

    GoldMinter minter;
    GoldStreamVerifier verifier;
    MockGoldToken gold;
    ERC20Mock usdt;
    ERC20Mock usdc;

    address usdRecipient = makeAddr("usdRecipient");
    address feeRecipient = makeAddr("feeRecipient");

    // signing actors (address + private key)
    address user;
    uint256 userPk;
    address kycUser;
    uint256 kycUserPk;
    address kycManager; // backend signer holding KYC_MANAGER_ROLE
    uint256 kycManagerPk;

    // Permit2 unordered nonce counter for the business-hours trade-window gate.
    // The trade-window signer reuses kycManager (already KYC_MANAGER_ROLE).
    uint256 internal _twNonce;

    function setUp() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (user, userPk) = makeAddrAndKey("user");
        (kycUser, kycUserPk) = makeAddrAndKey("kycUser");
        (kycManager, kycManagerPk) = makeAddrAndKey("kycManager");
        gold = new MockGoldToken();
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);

        GoldStreamVerifier vImpl = new GoldStreamVerifier();
        verifier = GoldStreamVerifier(
            address(
                new ERC1967Proxy(
                    address(vImpl),
                    abi.encodeCall(GoldStreamVerifier.initialize, (address(this), VERIFIER_PROXY, LINK, XAU))
                )
            )
        );
        verifier.setMaxReportAge(2 minutes); // ceiling (MAX_MAX_REPORT_AGE)
        deal(LINK, address(verifier), 1000e18);

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
                            true
                        )
                    )
                )
            )
        );
        verifier.setGoldMinter(address(minter));

        minter.grantRole(minter.PARAMETER_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), address(this));
        minter.grantRole(minter.KYC_MANAGER_ROLE(), kycManager);
        minter.updateMinGoldFee(0.1 ether);
        minter.updateMinGoldFeeAmount(1 ether);
        minter.updateMinMintAmount(1 ether);
        minter.updateMinRedeemAmount(1 ether);
        minter.setLevel(user, IGoldMinter.Levels.APPROVED);

        usdt.mint(usdRecipient, 100_000_000e6);
        vm.prank(usdRecipient);
        usdt.approve(address(minter), type(uint256).max);
    }

    function _price8(bytes memory report) internal pure returns (uint256, uint32) {
        (, bytes memory rd) = abi.decode(report, (bytes32[3], bytes));
        ReportV8 memory h = abi.decode(rd, (ReportV8));
        return (uint256(int256(h.midPrice)) / 1e10, h.observationsTimestamp);
    }

    function _usdPermitSig(address owner, uint256 ownerPk, uint256 value, uint256 deadline)
        internal
        view
        returns (bytes memory)
    {
        bytes32 permitTypehash =
            keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
        bytes32 structHash =
            keccak256(abi.encode(permitTypehash, owner, address(minter), value, usdt.nonces(owner), deadline));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", usdt.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPk, digest);
        return abi.encodePacked(r, s, v); // order SigLib.toVRS expects
    }

    function _minterDomainSeparator() internal view returns (bytes32) {
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

    function _kycMintSig(IGoldMinter.KYCMintRequest memory req) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(
                minter.KYC_MINT_REQUEST_TYPEHASH(),
                req.user,
                req.kycLevel,
                req.nonce,
                req.deadline,
                req.usdToken,
                req.usdAmount,
                req.minGoldAmount
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _minterDomainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(kycManagerPk, digest);
        return abi.encodePacked(r, s, v);
    }

    function _goldPermitSig(address owner, uint256 ownerPk, uint256 value, uint256 deadline)
        internal
        view
        returns (bytes memory)
    {
        bytes32 permitTypehash =
            keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
        bytes32 structHash =
            keccak256(abi.encode(permitTypehash, owner, address(minter), value, gold.nonces(owner), deadline));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", gold.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPk, digest);
        return abi.encodePacked(r, s, v);
    }

    /// @dev Backend (KYC_MANAGER_ROLE) signature over a KYCBurnRequest.
    function _kycBurnSig(IGoldMinter.KYCBurnRequest memory req) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(
            abi.encode(
                minter.KYC_BURN_REQUEST_TYPEHASH(),
                req.user,
                req.kycLevel,
                req.nonce,
                req.deadline,
                req.usdToken,
                req.goldAmount,
                req.minUsdAmount
            )
        );
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _minterDomainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(kycManagerPk, digest);
        return abi.encodePacked(r, s, v);
    }

    /// @dev Business-hours trade-window signing helper. Signs EIP-712 as kycManager
    ///      (KYC_MANAGER_ROLE), always issuing an open window (validAfter=0, validBefore=max)
    ///      with an incrementing nonce. Calls minter.TRADE_WINDOW_TYPEHASH() (external view) — issue before prank.
    function _mintTW(address user_) internal returns (IGoldMinter.TradeWindow memory tw, bytes memory sig) {
        tw = IGoldMinter.TradeWindow({ user: user_, validAfter: 0, validBefore: type(uint64).max, nonce: _twNonce++ });
        bytes32 structHash =
            keccak256(abi.encode(minter.TRADE_WINDOW_TYPEHASH(), tw.user, tw.validAfter, tw.validBefore, tw.nonce));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _minterDomainSeparator(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(kycManagerPk, digest);
        sig = abi.encodePacked(r, s, v);
    }

    function test_Mint() public {
        bytes memory report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_01.hex"));

        (uint256 reportPrice, uint32 reportObs) = _price8(report);

        // Mint
        vm.warp(uint256(reportObs) + 1);
        uint256 usdAmt = 200e6; // $200
        usdt.mint(user, usdAmt);

        vm.startPrank(user);
        usdt.approve(address(minter), usdAmt);
        vm.stopPrank();

        uint256 grossGold = minter.quoteGoldAmount(address(usdt), usdAmt, reportPrice);
        uint256 netGold = grossGold - minter.calculateGoldFee(grossGold, true);
        uint256 beforeOXAUBalance = gold.balanceOf(user);

        console2.log("Expected gross Gold Token OXAU :", grossGold);
        console2.log("Expected net Gold Token Fee OXAU :", grossGold - netGold);
        console2.log("Before User OXAU Blance :", beforeOXAUBalance);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.startPrank(user);
        minter.requestMint(address(usdt), usdAmt, netGold, report, _tw, _twSig);
        vm.stopPrank();

        uint256 afterOXAUBalance = gold.balanceOf(user);
        console2.log("After User OXAU Blance :", afterOXAUBalance);

        assertEq(afterOXAUBalance, netGold);
    }

    function test_Mint_Permit() public {
        bytes memory report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_01.hex"));

        (uint256 reportPrice, uint32 reportObs) = _price8(report);

        vm.warp(uint256(reportObs) + 1);
        uint256 usdAmt = 200e6; // $200
        usdt.mint(user, usdAmt);

        uint256 grossGold = minter.quoteGoldAmount(address(usdt), usdAmt, reportPrice);
        uint256 netGold = grossGold - minter.calculateGoldFee(grossGold, true);

        uint256 deadline = block.timestamp + 1 hours;
        bytes memory permitSig = _usdPermitSig(user, userPk, usdAmt, deadline);

        console2.log("Expected gross OXAU :", grossGold);
        console2.log("Expected net   OXAU :", netGold);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestMintPermit(address(usdt), usdAmt, netGold, deadline, permitSig, report, _tw, _twSig);

        console2.log("After User OXAU Balance :", gold.balanceOf(user));

        assertEq(gold.balanceOf(user), netGold, "net gold received via permit");
        assertEq(usdt.balanceOf(user), 0, "usd pulled via permit");
        assertEq(usdt.allowance(user, address(minter)), 0, "permit allowance fully consumed");
    }

    function test_Mint_KYCWithPermit() public {
        bytes memory report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_01.hex"));

        (uint256 reportPrice, uint32 reportObs) = _price8(report);

        vm.warp(uint256(reportObs) + 1);
        uint256 usdAmt = 200e6; // $200
        usdt.mint(kycUser, usdAmt);

        uint256 grossGold = minter.quoteGoldAmount(address(usdt), usdAmt, reportPrice);
        uint256 netGold = grossGold - minter.calculateGoldFee(grossGold, true);

        uint256 deadline = block.timestamp + 1 hours;

        // Backend-signed KYC approval. kycUser is new, so nonce = 1.
        IGoldMinter.KYCMintRequest memory kyc = IGoldMinter.KYCMintRequest({
            user: kycUser,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 1,
            deadline: deadline,
            usdToken: address(usdt),
            usdAmount: usdAmt,
            minGoldAmount: netGold
        });
        bytes memory kycSig = _kycMintSig(kyc);

        // User-signed USD permit (no prior approve() needed).
        bytes memory permitSig = _usdPermitSig(kycUser, kycUserPk, usdAmt, deadline);

        console2.log("Expected gross OXAU :", grossGold);
        console2.log("Expected net   OXAU :", netGold);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(kycUser);
        vm.prank(kycUser);
        minter.requestMintWithKYC(kyc, kycSig, permitSig, report, _tw, _twSig);

        console2.log("After kycUser OXAU Balance :", gold.balanceOf(kycUser));

        assertEq(gold.balanceOf(kycUser), netGold, "net gold received");
        assertEq(usdt.balanceOf(kycUser), 0, "usd pulled via permit");
    }

    function test_7702_batchThreeMints() public {
        IMulticall3 multicall = IMulticall3(0xcA11bde05977b3631167028862bE2a173976CA11);
        BatchExecutor impl = new BatchExecutor();

        // A batch consumes 3 reports in one block, so their obs must all fit within
        // maxReportAge (2 min). report_04/05 are 2 s apart; the third reuses 05
        // (fresh-report reuse is harmless — watermark removed). Captured fixtures are
        // minutes apart, so 3 distinct reports can't share one 2-min window.
        bytes memory r1 = vm.parseBytes(vm.readFile("test/fixtures/xau/report_04.hex"));
        bytes memory r2 = vm.parseBytes(vm.readFile("test/fixtures/xau/report_05.hex"));
        bytes memory r3 = vm.parseBytes(vm.readFile("test/fixtures/xau/report_05.hex"));
        (, uint32 obs3) = _price8(r3); // latest obs (05)

        vm.warp(uint256(obs3) + 1);
        (uint256 r1Price,) = _price8(r1);
        (uint256 r2Price,) = _price8(r2);
        (uint256 r3Price,) = _price8(r3);
        console2.log("Report V1 Gold Oz Price :", r1Price);
        console2.log("Report V2 Gold Oz Price :", r2Price);
        console2.log("Report V3 Gold Oz Price :", r3Price);

        uint256 usdAmt = 200e6; // $200 each

        IMulticall3.Call3[] memory multicalls = new IMulticall3.Call3[](3);
        multicalls[0] = IMulticall3.Call3({
            target: address(minter),
            allowFailure: false,
            callData: abi.encodeCall(minter.quoteGoldAmount, (address(usdt), usdAmt, r1Price))
        });
        multicalls[1] = IMulticall3.Call3({
            target: address(minter),
            allowFailure: false,
            callData: abi.encodeCall(minter.quoteGoldAmount, (address(usdt), usdAmt, r2Price))
        });
        multicalls[2] = IMulticall3.Call3({
            target: address(minter),
            allowFailure: false,
            callData: abi.encodeCall(minter.quoteGoldAmount, (address(usdt), usdAmt, r3Price))
        });

        IMulticall3.Result[] memory res = multicall.aggregate3(multicalls);

        IMulticall3.Call3[] memory multicalls2 = new IMulticall3.Call3[](3);

        multicalls2[0] = IMulticall3.Call3({
            target: address(minter),
            allowFailure: false,
            callData: abi.encodeCall(minter.calculateGoldFee, (abi.decode(res[0].returnData, (uint256)), true))
        });
        multicalls2[1] = IMulticall3.Call3({
            target: address(minter),
            allowFailure: false,
            callData: abi.encodeCall(minter.calculateGoldFee, (abi.decode(res[1].returnData, (uint256)), true))
        });
        multicalls2[2] = IMulticall3.Call3({
            target: address(minter),
            allowFailure: false,
            callData: abi.encodeCall(minter.calculateGoldFee, (abi.decode(res[2].returnData, (uint256)), true))
        });

        IMulticall3.Result[] memory res2 = multicall.aggregate3(multicalls2);

        console2.log(
            "r1 Expected Gold Amount:",
            abi.decode(res[0].returnData, (uint256)),
            "Fee Amount :",
            abi.decode(res2[0].returnData, (uint256))
        );

        console2.log(
            "r2 Expected Gold Amount:",
            abi.decode(res[1].returnData, (uint256)),
            "Fee Amount :",
            abi.decode(res2[1].returnData, (uint256))
        );

        console2.log(
            "r3 Expected Gold Amount:",
            abi.decode(res[2].returnData, (uint256)),
            "Fee Amount :",
            abi.decode(res2[2].returnData, (uint256))
        );

        usdt.mint(user, usdAmt * 3);

        BatchExecutor.Call[] memory calls = new BatchExecutor.Call[](4);
        calls[0] = BatchExecutor.Call({
            target: address(usdt), value: 0, data: abi.encodeCall(usdt.approve, (address(minter), usdAmt * 3))
        });
        (IGoldMinter.TradeWindow memory _twE1, bytes memory _twSigE1) = _mintTW(user);
        calls[1] = BatchExecutor.Call({
            target: address(minter),
            value: 0,
            data: abi.encodeCall(
                minter.requestMint,
                (
                    address(usdt),
                    usdAmt,
                    abi.decode(res[0].returnData, (uint256)) - abi.decode(res2[0].returnData, (uint256)),
                    r1,
                    _twE1,
                    _twSigE1
                )
            )
        });
        (IGoldMinter.TradeWindow memory _twE2, bytes memory _twSigE2) = _mintTW(user);
        calls[2] = BatchExecutor.Call({
            target: address(minter),
            value: 0,
            data: abi.encodeCall(
                minter.requestMint,
                (
                    address(usdt),
                    usdAmt,
                    abi.decode(res[1].returnData, (uint256)) - abi.decode(res2[1].returnData, (uint256)),
                    r2,
                    _twE2,
                    _twSigE2
                )
            )
        });
        (IGoldMinter.TradeWindow memory _twE3, bytes memory _twSigE3) = _mintTW(user);
        calls[3] = BatchExecutor.Call({
            target: address(minter),
            value: 0,
            data: abi.encodeCall(
                minter.requestMint,
                (
                    address(usdt),
                    usdAmt,
                    abi.decode(res[2].returnData, (uint256)) - abi.decode(res2[2].returnData, (uint256)),
                    r3,
                    _twE3,
                    _twSigE3
                )
            )
        });

        vm.signAndAttachDelegation(address(impl), userPk);

        vm.prank(user);
        BatchExecutor(payable(user)).execute(calls);

        assertGt(gold.balanceOf(user), 0, "gold minted to the EOA itself");
        assertEq(usdt.balanceOf(user), 0, "all usd pulled from the EOA");
    }

    // A report older than maxReportAge inside the batch reverts with ReportTooOld,
    // and the 7702 batch is atomic so everything rolls back. (Replay watermark removed —
    // freshness is the real defense.)
    // setUp sets maxReportAge to 2 min, so warp past that.
    function test_revert_7702_batchStaleReport() public {
        BatchExecutor impl = new BatchExecutor();

        bytes memory report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_03.hex"));
        (uint256 reportPrice, uint32 obs3) = _price8(report);

        // warp past maxReportAge (2 min) -> report too old
        vm.warp(uint256(obs3) + 6 minutes);
        console2.log("Report V1 Gold Oz Price :", reportPrice);

        uint256 usdAmt = 200e6; // $200 each

        uint256 grossGoldAmount = minter.quoteGoldAmount(address(usdt), usdAmt, reportPrice);

        uint256 netGoldAmt = minter.calculateGoldFee(grossGoldAmount, true);

        console2.log("r1 Expected Gold Amount:", grossGoldAmount, "Fee Amount :", netGoldAmt);

        usdt.mint(user, usdAmt * 3);

        BatchExecutor.Call[] memory calls = new BatchExecutor.Call[](4);
        calls[0] = BatchExecutor.Call({
            target: address(usdt), value: 0, data: abi.encodeCall(usdt.approve, (address(minter), usdAmt * 3))
        });
        (IGoldMinter.TradeWindow memory _twE4, bytes memory _twSigE4) = _mintTW(user);
        calls[1] = BatchExecutor.Call({
            target: address(minter),
            value: 0,
            data: abi.encodeCall(
                minter.requestMint, (address(usdt), usdAmt, grossGoldAmount - netGoldAmt, report, _twE4, _twSigE4)
            )
        });
        (IGoldMinter.TradeWindow memory _twE5, bytes memory _twSigE5) = _mintTW(user);
        calls[2] = BatchExecutor.Call({
            target: address(minter),
            value: 0,
            data: abi.encodeCall(
                minter.requestMint, (address(usdt), usdAmt, grossGoldAmount - netGoldAmt, report, _twE5, _twSigE5)
            )
        });
        (IGoldMinter.TradeWindow memory _twE6, bytes memory _twSigE6) = _mintTW(user);
        calls[3] = BatchExecutor.Call({
            target: address(minter),
            value: 0,
            data: abi.encodeCall(
                minter.requestMint, (address(usdt), usdAmt, grossGoldAmount - netGoldAmt, report, _twE6, _twSigE6)
            )
        });

        vm.signAndAttachDelegation(address(impl), userPk);

        vm.prank(user);
        vm.expectRevert(Errors.ReportTooOld.selector);
        BatchExecutor(payable(user)).execute(calls);

        assertEq(gold.balanceOf(user), 0, "atomic rollback: no gold minted");
        assertEq(usdt.balanceOf(user), usdAmt * 3, "atomic rollback: usd untouched");
    }

    // ═════════════════════════════════════════════════════════════════════════
    // Burn — symmetric to the mint suite (plain / permit / KYC+permit)
    // ═════════════════════════════════════════════════════════════════════════

    function test_Burn() public {
        bytes memory report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_01.hex"));
        (uint256 reportPrice, uint32 reportObs) = _price8(report);
        vm.warp(uint256(reportObs) + 1);

        uint256 goldAmount = 50 ether; // 50 grams
        gold.mint(user, goldAmount);

        uint256 fee = minter.calculateGoldFee(goldAmount, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), goldAmount - fee, reportPrice);
        uint256 usdBefore = usdt.balanceOf(user);

        console2.log("Burn gold (grams e18) :", goldAmount);
        console2.log("Expected USD out (e6) :", expectedUsd);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.startPrank(user);
        gold.approve(address(minter), goldAmount);
        minter.requestBurn(address(usdt), goldAmount, expectedUsd, report, _tw, _twSig);
        vm.stopPrank();

        assertEq(gold.balanceOf(user), 0, "all gold pulled from seller");
        assertEq(gold.balanceOf(feeRecipient), fee, "gold fee to feeRecipient");
        assertEq(usdt.balanceOf(user) - usdBefore, expectedUsd, "usd paid out");
    }

    function test_Burn_Permit() public {
        bytes memory report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_01.hex"));
        (uint256 reportPrice, uint32 reportObs) = _price8(report);
        vm.warp(uint256(reportObs) + 1);

        uint256 goldAmount = 50 ether;
        gold.mint(user, goldAmount);

        uint256 fee = minter.calculateGoldFee(goldAmount, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), goldAmount - fee, reportPrice);

        uint256 deadline = block.timestamp + 1 hours;
        bytes memory permitSig = _goldPermitSig(user, userPk, goldAmount, deadline);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(user);
        vm.prank(user);
        minter.requestBurnPermit(address(usdt), goldAmount, expectedUsd, deadline, permitSig, report, _tw, _twSig);

        assertEq(gold.balanceOf(user), 0, "gold pulled via permit");
        assertEq(usdt.balanceOf(user), expectedUsd, "usd paid out");
    }

    function test_Burn_KYCWithPermit() public {
        bytes memory report = vm.parseBytes(vm.readFile("test/fixtures/xau/report_01.hex"));
        (uint256 reportPrice, uint32 reportObs) = _price8(report);
        vm.warp(uint256(reportObs) + 1);

        uint256 goldAmount = 50 ether;
        gold.mint(kycUser, goldAmount);

        uint256 fee = minter.calculateGoldFee(goldAmount, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), goldAmount - fee, reportPrice);

        uint256 deadline = block.timestamp + 1 hours;

        IGoldMinter.KYCBurnRequest memory kyc = IGoldMinter.KYCBurnRequest({
            user: kycUser,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 1,
            deadline: deadline,
            usdToken: address(usdt),
            goldAmount: goldAmount,
            minUsdAmount: expectedUsd
        });
        bytes memory kycSig = _kycBurnSig(kyc);
        bytes memory permitSig = _goldPermitSig(kycUser, kycUserPk, goldAmount, deadline);

        (IGoldMinter.TradeWindow memory _tw, bytes memory _twSig) = _mintTW(kycUser);
        vm.prank(kycUser);
        minter.requestBurnWithKYC(kyc, kycSig, permitSig, report, _tw, _twSig);

        assertEq(gold.balanceOf(kycUser), 0, "gold pulled via permit");
        assertEq(usdt.balanceOf(kycUser), expectedUsd, "usd paid out");
    }

    function test_E2E_UserJourney() public {
        bytes memory mintReport = vm.parseBytes(vm.readFile("test/fixtures/xau/report_03.hex"));
        bytes memory burnReport = vm.parseBytes(vm.readFile("test/fixtures/xau/report_04.hex"));
        (uint256 mintPrice, uint32 mintObs) = _price8(mintReport);
        (uint256 burnPrice, uint32 burnObs) = _price8(burnReport);

        // Each report must be fresh vs its own obs at use time (maxReportAge 2 min).
        // mint and burn are separate blocks, so warp to each report's obs per step.
        vm.warp(uint256(mintObs) + 1);

        // ── 1) mint: deposit $600 USDT -> gold ──
        uint256 usdIn = 600e6;
        usdt.mint(user, usdIn);

        uint256 grossGold = minter.quoteGoldAmount(address(usdt), usdIn, mintPrice);
        uint256 netGold = grossGold - minter.calculateGoldFee(grossGold, true);

        (IGoldMinter.TradeWindow memory _twMint, bytes memory _twMintSig) = _mintTW(user);
        vm.startPrank(user);
        usdt.approve(address(minter), usdIn);
        minter.requestMint(address(usdt), usdIn, netGold, mintReport, _twMint, _twMintSig);
        vm.stopPrank();

        assertEq(gold.balanceOf(user), netGold, "step 1: gold received");
        assertEq(usdt.balanceOf(user), 0, "step 1: usd spent");
        console2.log("Journey mint  USD/oz :", mintPrice / 1e8);
        console2.log("Journey gold held    :", gold.balanceOf(user));

        // ── 2) burn: redeem half the gold to USDT at a fresher price ──
        // warp to the burn report (later obs) so it becomes fresh
        vm.warp(uint256(burnObs) + 1);
        uint256 burnGold = netGold / 2;
        uint256 burnFee = minter.calculateGoldFee(burnGold, false);
        uint256 expectedUsd = minter.quoteUsdAmount(address(usdt), burnGold - burnFee, burnPrice);

        (IGoldMinter.TradeWindow memory _twBurn, bytes memory _twBurnSig) = _mintTW(user);
        vm.startPrank(user);
        gold.approve(address(minter), burnGold);
        minter.requestBurn(address(usdt), burnGold, expectedUsd, burnReport, _twBurn, _twBurnSig);
        vm.stopPrank();

        assertEq(gold.balanceOf(user), netGold - burnGold, "step 2: half gold left");
        assertEq(usdt.balanceOf(user), expectedUsd, "step 2: usd back");
        console2.log("Journey burn  USD/oz :", burnPrice / 1e8);
        console2.log("Journey usd back (e6):", expectedUsd);
        console2.log("Journey gold remaining:", gold.balanceOf(user));
    }
}
