// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VestingWallet} from "@openzeppelin/contracts/finance/VestingWallet.sol";

/// @title ChaiVesting
/// @notice Linear-with-cliff vesting wallet for the ChaiCoin Team
///         allocation (10,000,000,000 CHAI per TOKENOMICS.md): a 3-month
///         cliff during which nothing is releasable, followed by linear
///         vesting over the remaining 9 months (12 months total).
/// @dev Built on top of OpenZeppelin's audited `VestingWallet` (v5.x)
///      rather than a bespoke contract. `VestingWallet` already provides
///      exactly the mechanics required here: a beneficiary-owned wallet,
///      a permissionless `release(address token)` that always pays the
///      beneficiary (never the caller), and a well-tested linear vesting
///      formula (`vestedAmount` / `_vestingSchedule`). The only piece
///      missing is the cliff, so this contract's sole change is
///      overriding `_vestingSchedule` to add one. Reusing an audited base
///      contract for the time-math is lower risk than writing new
///      date/percentage arithmetic from scratch for a fund-holding
///      contract.
///
///      No revocation / no clawback: `VestingWallet`'s only "owner" is the
///      beneficiary itself (its constructor calls `Ownable(beneficiary)`),
///      and neither `VestingWallet` nor this contract defines a `revoke()`
///      function or any other path for a third party (including whoever
///      deploys this contract) to reclaim or redirect unvested tokens.
///      This is intentional: TOKENOMICS.md requires the Team allocation to
///      be non-clawback-able once funded, so this contract must not be a
///      rug vector. The beneficiary may transfer their own `Ownable`
///      ownership (e.g. to a different wallet they control) but that is
///      the beneficiary reassigning their own future payouts, not a
///      third-party clawback.
///
///      To release vested CHAI, anyone may call `release(address token)`
///      (inherited from `VestingWallet`) with the CHAI token address —
///      tokens are always transferred to `owner()` (the beneficiary),
///      regardless of who calls it. The zero-argument `release()` on the
///      base contract instead releases vested native currency (MATIC/ETH)
///      and is unrelated to CHAI token vesting; this contract accepts no
///      native currency deposits as part of its intended use.
contract ChaiVesting is VestingWallet {
    /// @notice Length of the initial cliff, in seconds, during which
    ///         nothing is releasable regardless of elapsed time.
    uint64 private immutable _cliffDuration;

    /// @param beneficiaryAddress Address that will receive released tokens
    ///        (also becomes this contract's `Ownable` owner, per
    ///        `VestingWallet`, with no special powers beyond reassigning
    ///        who future releases are paid to).
    /// @param startTimestamp Unix timestamp vesting begins counting from.
    /// @param cliffDurationSeconds Length of the cliff (e.g. 3 months).
    /// @param totalDurationSeconds Total vesting duration measured from
    ///        `startTimestamp` (e.g. 12 months). Must be greater than
    ///        `cliffDurationSeconds`.
    constructor(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 cliffDurationSeconds,
        uint64 totalDurationSeconds
    ) VestingWallet(beneficiaryAddress, startTimestamp, totalDurationSeconds) {
        require(
            totalDurationSeconds > cliffDurationSeconds,
            "ChaiVesting: total duration must exceed cliff duration"
        );
        _cliffDuration = cliffDurationSeconds;
    }

    /// @notice Length of the cliff, in seconds.
    function cliffDuration() public view returns (uint256) {
        return _cliffDuration;
    }

    /// @notice Timestamp at which the cliff ends and linear release begins.
    function cliffEnd() public view returns (uint256) {
        return start() + _cliffDuration;
    }

    /// @dev Overrides `VestingWallet`'s default linear-from-start curve
    ///      with a cliff-then-linear curve:
    ///      - Before `cliffEnd()`: 0 vested.
    ///      - From `cliffEnd()` to `end()`: vests linearly over the
    ///        remaining `(totalDuration - cliffDuration)` seconds, i.e.
    ///        0% right at the cliff rising to 100% exactly at `end()`.
    ///      - At or after `end()`: fully vested.
    function _vestingSchedule(
        uint256 totalAllocation,
        uint64 timestamp
    ) internal view override returns (uint256) {
        uint256 cliffEndTs = cliffEnd();
        if (timestamp < cliffEndTs) {
            return 0;
        } else if (timestamp >= end()) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - cliffEndTs)) / (end() - cliffEndTs);
        }
    }
}
