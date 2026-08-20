// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Test, console2 } from "forge-std/Test.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IAccessControl } from "@openzeppelin/contracts/access/IAccessControl.sol";
import { ERC20Mock } from "../../contracts/tokens/ERC20Mock.sol";
import { GoldMinter } from "../../contracts/GoldMinter.sol";
import { IGoldMinter } from "../../contracts/interfaces/IGoldMinter.sol";
import { Errors } from "../../contracts/libraries/Errors.sol";
import { GoldStreamVerifier } from "../../contracts/oracles/GoldStreamVerifier.sol";
import { ReportV8 } from "../../contracts/interfaces/DataStreamsReports.sol";
import { MockGoldToken } from "./E2EGoldMinter.t.sol";

// ─────────────────────────────────────────────────────────────────────────────
// Malicious tokens — attempt reentry into GoldMinter from transferFrom callbacks.
// ─────────────────────────────────────────────────────────────────────────────

/// @dev Malicious stablecoin posing as USDT: reenters requestMint during transferFrom.
contract ReentrantUSD is ERC20Mock {
    GoldMinter public minter;
    bool public armed;

    constructor() ERC20Mock("EvilUSD", "EUSD", 6, 0) { }

    function arm(GoldMinter m) external {
        minter = m;
        armed = true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        if (armed) {
            armed = false; // single attempt
            // reentry while requestMint is in flight — nonReentrant must block
            minter.requestMint(address(this), 1, 0, "", IGoldMinter.TradeWindow(address(0), 0, 0, 0), bytes(""));
        }
        return super.transferFrom(from, to, amount);
    }
}

/// @dev Malicious gold token: reenters requestBurn during burn transferFrom.
contract ReentrantGold is ERC20 {
    GoldMinter public minter;
    bool public armed;

    constructor() ERC20("EvilGold", "EGLD") { }

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

    function arm(GoldMinter m) external {
        minter = m;
        armed = true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        if (armed) {
            armed = false;
            minter.requestBurn(address(0), 1, 0, "", IGoldMinter.TradeWindow(address(0), 0, 0, 0), bytes(""));
        }
        return super.transferFrom(from, to, amount);
    }
}

/// @dev Cross-function reentry (mint -> requestBurn); the single global nonReentrant slot must block it.
contract CrossReentrantUSD is ERC20Mock {
    GoldMinter public minter;
    bool public armed;

    constructor() ERC20Mock("EvilUSD2", "EUSD2", 6, 0) { }

    function arm(GoldMinter m) external {
        minter = m;
        armed = true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        if (armed) {
            armed = false;
            minter.requestBurn(address(this), 1, 0, "", IGoldMinter.TradeWindow(address(0), 0, 0, 0), bytes("")); // reenter via a different function
        }
        return super.transferFrom(from, to, amount);
    }
}

/**
 * @title SecurityAttacks
 * @notice Fork tests (Arbitrum One) proving defenses against attacker moves: reentrancy,
 *         report reuse, KYC forgery/replay, permit theft, LINK drain, unauthorized settlement.
 */
contract SecurityAttacks is Test {
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

    address user;
    uint256 userPk;
    address victim;
    uint256 victimPk;
    address attacker;
    uint256 attackerPk;
    address kycUser;
    uint256 kycUserPk;
    address kycManager;
    uint256 kycManagerPk;

    function setUp() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (user, userPk) = makeAddrAndKey("user");
        (victim, victimPk) = makeAddrAndKey("victim");
        (attacker, attackerPk) = makeAddrAndKey("attacker");
        (kycUser, kycUserPk) = makeAddrAndKey("kycUser");
        (kycManager, kycManagerPk) = makeAddrAndKey("kycManager");

        gold = new MockGoldToken();
        usdt = new ERC20Mock("Tether", "USDT", 6, 0);
        usdc = new ERC20Mock("USD Coin", "USDC", 6, 0);

        (minter, verifier) = _deployStack(address(gold), address(usdt), address(usdc));

        minter.setLevel(user, IGoldMinter.Levels.APPROVED);

        usdt.mint(usdRecipient, 100_000_000e6);
        vm.prank(usdRecipient);
        usdt.approve(address(minter), type(uint256).max);
    }

    /// @dev Deploys and wires a verifier + minter stack (reused for malicious-token injection).
    function _deployStack(address goldTok, address usdtTok, address usdcTok)
        internal
        returns (GoldMinter m, GoldStreamVerifier v)
    {
        GoldStreamVerifier vImpl = new GoldStreamVerifier();
        v = GoldStreamVerifier(
            address(
                new ERC1967Proxy(
                    address(vImpl),
                    abi.encodeCall(GoldStreamVerifier.initialize, (address(this), VERIFIER_PROXY, LINK, XAU))
                )
            )
        );
        v.setMaxReportAge(2 minutes); // max allowed window (anti-cherry-pick ceiling)
        deal(LINK, address(v), 1000e18);

        GoldMinter mImpl = new GoldMinter();
        m = GoldMinter(
            address(
                new ERC1967Proxy(
                    address(mImpl),
                    abi.encodeCall(
                        GoldMinter.initializeGoldMinter,
                        (goldTok, usdtTok, usdcTok, address(v), usdRecipient, feeRecipient, address(this), true)
                    )
                )
            )
        );
        v.setGoldMinter(address(m));

        m.grantRole(m.PARAMETER_MANAGER_ROLE(), address(this));
        m.grantRole(m.KYC_MANAGER_ROLE(), address(this));
        m.grantRole(m.KYC_MANAGER_ROLE(), kycManager);
        m.grantRole(m.SETTLER_ROLE(), address(this));
        m.updateMinGoldFee(0.1 ether);
        m.updateMinGoldFeeAmount(1 ether);
        m.updateMinMintAmount(1 ether);
        m.updateMinRedeemAmount(1 ether);
    }

    // ──────────────────────────── helpers ────────────────────────────

    function _price8(bytes memory report) internal pure returns (uint256, uint32) {
        (, bytes memory rd) = abi.decode(report, (bytes32[3], bytes));
        ReportV8 memory h = abi.decode(rd, (ReportV8));
        return (uint256(int256(h.midPrice)) / 1e10, h.observationsTimestamp);
    }

    function _report(string memory file) internal returns (bytes memory report, uint256 price8) {
        report = vm.parseBytes(vm.readFile(string.concat("test/fixtures/xau/", file)));
        uint32 obs;
        (price8, obs) = _price8(report);
        vm.warp(uint256(obs) + 1);
    }

    function _minterDomainSeparator(GoldMinter m) internal view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("GoldMinter")),
                keccak256(bytes("1")),
                block.chainid,
                address(m)
            )
        );
    }

    function _usdPermitSig(address owner, uint256 ownerPk, uint256 value, uint256 deadline)
        internal
        view
        returns (bytes memory)
    {
        bytes32 ph = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
        bytes32 structHash = keccak256(abi.encode(ph, owner, address(minter), value, usdt.nonces(owner), deadline));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", usdt.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerPk, digest);
        return abi.encodePacked(r, s, v);
    }

    function _kycMintSig(IGoldMinter.KYCMintRequest memory req, uint256 signerPk) internal view returns (bytes memory) {
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
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", _minterDomainSeparator(minter), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, digest);
        return abi.encodePacked(r, s, v);
    }

    function _net(GoldMinter m, address usdToken, uint256 usdAmt, uint256 price8) internal view returns (uint256) {
        uint256 gross = m.quoteGoldAmount(usdToken, usdAmt, price8);
        return gross - m.calculateGoldFee(gross, true);
    }

    uint256 internal _twNonce;

    /// @dev Valid business-hours window signed by kycManager (holds KYC_MANAGER_ROLE on every
    ///      stack via _deployStack). Parametrized by instance since tests use both `minter` and `m`.
    function _mintTW(GoldMinter m, address user_)
        internal
        returns (IGoldMinter.TradeWindow memory tw, bytes memory sig)
    {
        tw = IGoldMinter.TradeWindow({ user: user_, validAfter: 0, validBefore: type(uint64).max, nonce: _twNonce++ });
        bytes32 sh = keccak256(abi.encode(m.TRADE_WINDOW_TYPEHASH(), tw.user, tw.validAfter, tw.validBefore, tw.nonce));
        bytes32 d = keccak256(abi.encodePacked("\x19\x01", _minterDomainSeparator(m), sh));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(kycManagerPk, d);
        sig = abi.encodePacked(r, s, v);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 1 — reentrancy: malicious USD token reenters requestMint mid-mint
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_reentrancy_usd_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        // separate stack with the malicious USD registered as USDT
        ReentrantUSD evil = new ReentrantUSD();
        (GoldMinter m, GoldStreamVerifier v) = _deployStack(address(gold), address(evil), address(usdc));
        m.setLevel(user, IGoldMinter.Levels.APPROVED);
        minter = m; // repoint helpers
        verifier = v;

        (bytes memory report, uint256 price8) = _report("report_01.hex");

        uint256 usdAmt = 200e6;
        evil.mint(user, usdAmt);
        vm.prank(user);
        evil.approve(address(m), type(uint256).max);

        uint256 net = _net(m, address(evil), usdAmt, price8);
        evil.arm(m); // reenter on next transferFrom

        // nonReentrant must block reentry at fund-pull time
        (IGoldMinter.TradeWindow memory _tw1, bytes memory _twSig1) = _mintTW(m, user);
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSignature("ReentrancyGuardReentrantCall()"));
        m.requestMint(address(evil), usdAmt, net, report, _tw1, _twSig1);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 2 — reentrancy: malicious gold token reenters requestBurn mid-burn
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_reentrancy_gold_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        ReentrantGold evil = new ReentrantGold();
        (GoldMinter m,) = _deployStack(address(evil), address(usdt), address(usdc));
        m.setLevel(user, IGoldMinter.Levels.APPROVED);
        minter = m;

        // let usdRecipient fund settlements
        vm.prank(usdRecipient);
        usdt.approve(address(m), type(uint256).max);

        (bytes memory report, uint256 price8) = _report("report_01.hex");

        uint256 goldAmount = 50 ether;
        evil.mint(user, goldAmount);
        vm.prank(user);
        evil.approve(address(m), type(uint256).max);

        uint256 fee = m.calculateGoldFee(goldAmount, false);
        uint256 expectedUsd = m.quoteUsdAmount(address(usdt), goldAmount - fee, price8);
        evil.arm(m);

        (IGoldMinter.TradeWindow memory _tw2, bytes memory _twSig2) = _mintTW(m, user);
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSignature("ReentrancyGuardReentrantCall()"));
        m.requestBurn(address(usdt), goldAmount, expectedUsd, report, _tw2, _twSig2);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 3 — pinning a favorable price with an old report
    //   Global replay watermark removed: reusing a *fresh* report is harmless (each request
    //   deposits new USD, pays fees, at a fresh price). Real defense = maxReportAge.
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_staleReportCherryPick_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report, uint256 price8) = _report("report_01.hex"); // warps to obs+1
        uint256 usdAmt = 200e6;
        usdt.mint(user, usdAmt * 3);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);
        uint256 net = _net(minter, address(usdt), usdAmt, price8);

        // fresh-report reuse allowed (harmless): mints twice, doubling balance
        (IGoldMinter.TradeWindow memory _tw3, bytes memory _twSig3) = _mintTW(minter, user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmt, net, report, _tw3, _twSig3);
        (IGoldMinter.TradeWindow memory _tw4, bytes memory _twSig4) = _mintTW(minter, user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmt, net, report, _tw4, _twSig4);
        assertEq(gold.balanceOf(user), net * 2, "fresh replay is harmless");

        // but past maxReportAge (2 min) the same report is rejected
        vm.warp(block.timestamp + 6 minutes);
        (IGoldMinter.TradeWindow memory _tw5, bytes memory _twSig5) = _mintTW(minter, user);
        vm.prank(user);
        vm.expectRevert(Errors.ReportTooOld.selector);
        minter.requestMint(address(usdt), usdAmt, net, report, _tw5, _twSig5);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 4 — KYC forgery: attacker signs an approval with their own key
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_kycForgery_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report,) = _report("report_01.hex");
        usdt.mint(attacker, 200e6);
        vm.prank(attacker);
        usdt.approve(address(minter), type(uint256).max);

        IGoldMinter.KYCMintRequest memory kyc = IGoldMinter.KYCMintRequest({
            user: attacker,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 1,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            usdAmount: 200e6,
            minGoldAmount: 0
        });
        // signed by the attacker, not KYC_MANAGER_ROLE
        bytes memory forged = _kycMintSig(kyc, attackerPk);

        (IGoldMinter.TradeWindow memory _tw6, bytes memory _twSig6) = _mintTW(minter, attacker);
        vm.prank(attacker);
        vm.expectRevert(Errors.InvalidSignature.selector);
        minter.requestMintWithKYC(kyc, forged, "", report, _tw6, _twSig6);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 5 — KYC signature replay
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_kycReplay_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report, uint256 price8) = _report("report_01.hex");
        uint256 usdAmt = 200e6;
        usdt.mint(kycUser, usdAmt * 2);
        vm.prank(kycUser);
        usdt.approve(address(minter), type(uint256).max);

        uint256 net = _net(minter, address(usdt), usdAmt, price8);
        IGoldMinter.KYCMintRequest memory kyc = IGoldMinter.KYCMintRequest({
            user: kycUser,
            kycLevel: uint8(IGoldMinter.Levels.APPROVED),
            nonce: 1,
            deadline: block.timestamp + 1 hours,
            usdToken: address(usdt),
            usdAmount: usdAmt,
            minGoldAmount: net
        });
        bytes memory sig = _kycMintSig(kyc, kycManagerPk);

        // first use: ok (consumes nonce 1)
        (IGoldMinter.TradeWindow memory _tw7, bytes memory _twSig7) = _mintTW(minter, kycUser);
        vm.prank(kycUser);
        minter.requestMintWithKYC(kyc, sig, "", report, _tw7, _twSig7);

        // replay: rejected on nonce mismatch (KYC check runs before report verification)
        (IGoldMinter.TradeWindow memory _tw8, bytes memory _twSig8) = _mintTW(minter, kycUser);
        vm.prank(kycUser);
        vm.expectRevert(Errors.InvalidSignature.selector);
        minter.requestMintWithKYC(kyc, sig, "", report, _tw8, _twSig8);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 6 — permit theft: attacker submits victim's USD permit signature
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_stolenPermit_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report,) = _report("report_01.hex");
        uint256 deadline = block.timestamp + 1 hours;

        // permit signed by victim (owner = victim)
        bytes memory victimSig = _usdPermitSig(victim, victimPk, 200e6, deadline);

        // attacker splices it into their own call -> permit owner mismatch fails,
        // and with no allowance the call reverts with InsufficientAllowance
        (IGoldMinter.TradeWindow memory _tw9, bytes memory _twSig9) = _mintTW(minter, attacker);
        vm.prank(attacker);
        vm.expectRevert(Errors.InsufficientAllowance.selector);
        minter.requestMintPermit(address(usdt), 200e6, 0, deadline, victimSig, report, _tw9, _twSig9);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 6b — permit front-run griefing: user's request must survive an attacker
    //   submitting the signature first (try/catch + allowance fallback)
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_permitFrontRun_survivable() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report, uint256 price8) = _report("report_01.hex");
        uint256 usdAmt = 200e6;
        usdt.mint(user, usdAmt);
        uint256 deadline = block.timestamp + 1 hours;
        bytes memory sig = _usdPermitSig(user, userPk, usdAmt, deadline);

        // attacker front-runs the permit -> consumes nonce + sets allowance(user->minter)
        (uint8 v, bytes32 r, bytes32 s) = _split(sig);
        vm.prank(attacker);
        usdt.permit(user, address(minter), usdAmt, deadline, v, r, s);

        // user's requestMintPermit: inner permit reverts (nonce used) but try/catch swallows it
        // and the already-set allowance carries the request through
        uint256 net = _net(minter, address(usdt), usdAmt, price8);
        (IGoldMinter.TradeWindow memory _tw10, bytes memory _twSig10) = _mintTW(minter, user);
        vm.prank(user);
        minter.requestMintPermit(address(usdt), usdAmt, net, deadline, sig, report, _tw10, _twSig10);

        assertEq(gold.balanceOf(user), net, "request survives permit front-run");
        assertEq(usdt.balanceOf(user), 0, "usd pulled");
    }

    /// @dev Splits a 65-byte packed (r,s,v) signature (for direct token.permit by front-runner).
    function _split(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        assembly {
            r := mload(add(sig, 0x20))
            s := mload(add(sig, 0x40))
            v := byte(0, mload(add(sig, 0x60)))
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 7 — LINK drain: calling the verifier directly to burn fees
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_linkDrain_directVerifier_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report,) = _report("report_01.hex");
        // only goldMinter may consume reports -> outsiders cannot burn LINK
        vm.prank(attacker);
        vm.expectRevert(Errors.NotGoldMinter.selector);
        verifier.verifyAndGetPrice(report);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 8 — unauthorized settlement (no SETTLER_ROLE)
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_unauthorizedSettle_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        bytes32 role = minter.SETTLER_ROLE();
        vm.prank(attacker);
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, attacker, role)
        );
        minter.settleMint(0);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 9 — cross-function reentry (requestBurn during mint)
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_crossFunctionReentrancy_blocked() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        CrossReentrantUSD evil = new CrossReentrantUSD();
        (GoldMinter m,) = _deployStack(address(gold), address(evil), address(usdc));
        m.setLevel(user, IGoldMinter.Levels.APPROVED);
        minter = m;

        (bytes memory report, uint256 price8) = _report("report_01.hex");

        uint256 usdAmt = 200e6;
        evil.mint(user, usdAmt);
        vm.prank(user);
        evil.approve(address(m), type(uint256).max);
        uint256 net = _net(m, address(evil), usdAmt, price8);
        evil.arm(m);

        // single global guard also blocks mint->burn cross entry
        (IGoldMinter.TradeWindow memory _tw11, bytes memory _twSig11) = _mintTW(m, user);
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSignature("ReentrancyGuardReentrantCall()"));
        m.requestMint(address(evil), usdAmt, net, report, _tw11, _twSig11);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 10 — settle-time price manipulation (settle uses request-time locked amounts only)
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_settlePriceLocked_noManipulation() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        minter.updateAutoSettle(); // true -> false (manual settlement)

        (bytes memory report, uint256 price8) = _report("report_01.hex");
        uint256 usdAmt = 200e6;
        usdt.mint(user, usdAmt);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);

        uint256 net = _net(minter, address(usdt), usdAmt, price8);
        (IGoldMinter.TradeWindow memory _tw12, bytes memory _twSig12) = _mintTW(minter, user);
        vm.prank(user);
        minter.requestMint(address(usdt), usdAmt, net, report, _tw12, _twSig12);
        assertEq(gold.balanceOf(user), 0, "not settled yet");

        // price changes later are irrelevant: settle takes no report -> nothing to manipulate
        vm.warp(block.timestamp + 10 days);
        minter.settleMint(0);

        // settles at the amount locked at request time
        assertEq(gold.balanceOf(user), net, "settled at request-time locked price");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 11 — blacklist bypass (blacklisted user tries to mint)
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_blacklistedUser_cannotMint() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report, uint256 price8) = _report("report_01.hex");
        minter.setAMLBlacklist(user, true);

        usdt.mint(user, 200e6);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);
        uint256 net = _net(minter, address(usdt), 200e6, price8);

        (IGoldMinter.TradeWindow memory _tw13, bytes memory _twSig13) = _mintTW(minter, user);
        vm.prank(user);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.requestMint(address(usdt), 200e6, net, report, _tw13, _twSig13);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 12 — blacklisted after request (pending order must be blocked at settlement)
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_blacklistAfterRequest_blocksSettle() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        minter.updateAutoSettle(); // manual settlement

        (bytes memory report, uint256 price8) = _report("report_01.hex");
        usdt.mint(user, 200e6);
        vm.prank(user);
        usdt.approve(address(minter), type(uint256).max);
        uint256 net = _net(minter, address(usdt), 200e6, price8);

        (IGoldMinter.TradeWindow memory _tw14, bytes memory _twSig14) = _mintTW(minter, user);
        vm.prank(user);
        minter.requestMint(address(usdt), 200e6, net, report, _tw14, _twSig14); // create pending order

        // blacklist before settlement -> settlement authorization must reject
        minter.setAMLBlacklist(user, true);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.settleMint(0);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Attack 13 — eligibility checks run before the oracle call
    //   A blacklisted user is rejected with AMLBlocked even for an empty/invalid report;
    //   had the oracle run first, decoding would have thrown a *different* error.
    // ══════════════════════════════════════════════════════════════════════════
    function test_attack_permissionCheckedBeforeOracle() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        minter.setAMLBlacklist(user, true); // APPROVED but blacklisted

        bytes memory emptyReport = ""; // would revert in decode if the oracle ran first
        (IGoldMinter.TradeWindow memory _tw15, bytes memory _twSig15) = _mintTW(minter, user);
        vm.prank(user);
        vm.expectRevert(Errors.AMLBlocked.selector);
        minter.requestMint(address(usdt), 200e6, 0, emptyReport, _tw15, _twSig15);
    }

    /// @dev Invariant I6 — a reverting request consumes no verifier LINK (EVM atomicity).
    ///      The pre-verify eligibility gate is fail-fast hygiene, not LINK protection: even a
    ///      request that reaches VerifierProxy.verify() (fee path included) and dies on slippage
    ///      must roll back LINK movement. A future try/catch around verify would break this.
    function test_attack_failedRequestConsumesNoLink() public {
        if (VERIFIER_PROXY.code.length == 0) return;

        (bytes memory report,) = _report("report_01.hex");
        uint256 linkBefore = ERC20(LINK).balanceOf(address(verifier));

        usdt.mint(user, 200_000e6);
        (IGoldMinter.TradeWindow memory _tw16, bytes memory _twSig16) = _mintTW(minter, user);
        vm.startPrank(user);
        usdt.approve(address(minter), type(uint256).max);
        // valid fresh report + unsatisfiable minGold -> reverts on slippage after verify
        vm.expectRevert(Errors.Underpriced.selector);
        minter.requestMint(address(usdt), 100_000e6, type(uint256).max, report, _tw16, _twSig16);
        vm.stopPrank();

        assertEq(ERC20(LINK).balanceOf(address(verifier)), linkBefore, "reverted request must not consume LINK");
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Invariant (fuzz) — a mint->burn round trip can never profit
    //   spread + fees guarantee refunded USD <= deposited USD
    //   (quote functions only — no oracle cost, so many runs are cheap)
    // ══════════════════════════════════════════════════════════════════════════
    function testFuzz_roundTripNeverProfits(uint256 usdAmt, uint256 price8) public view {
        usdAmt = bound(usdAmt, 100e6, 1_000_000e6); // $100 ~ $1M
        price8 = bound(price8, 500e8, 10_000e8); // valid gold price range

        uint256 gross = minter.quoteGoldAmount(address(usdt), usdAmt, price8);
        uint256 mintFee = minter.calculateGoldFee(gross, true);
        if (gross <= mintFee) return; // skip extreme dust corner
        uint256 net = gross - mintFee;

        uint256 burnFee = minter.calculateGoldFee(net, false);
        if (net <= burnFee) return;
        uint256 usdBack = minter.quoteUsdAmount(address(usdt), net - burnFee, price8);

        assertLe(usdBack, usdAmt, "round trip must not refund more than deposited");
    }
}
