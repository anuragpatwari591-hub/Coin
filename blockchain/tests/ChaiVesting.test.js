const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const TOTAL_SUPPLY = 100_000_000_000n * 10n ** 18n;
const TEAM_ALLOCATION = 10_000_000_000n * 10n ** 18n;

const MONTH = 30 * 24 * 60 * 60; // 30-day "month" used for schedule math
const CLIFF_DURATION = 3 * MONTH; // 3-month cliff
const TOTAL_DURATION = 12 * MONTH; // 12-month total vesting

describe("ChaiVesting", function () {
  async function deployFixture() {
    const [deployer, treasury, beneficiary, other] =
      await ethers.getSigners();

    const ChaiCoin = await ethers.getContractFactory("ChaiCoin");
    const chai = await ChaiCoin.deploy(treasury.address, deployer.address);
    await chai.waitForDeployment();
    const chaiAddress = await chai.getAddress();

    const start = await time.latest();

    const ChaiVesting = await ethers.getContractFactory("ChaiVesting");
    const vesting = await ChaiVesting.deploy(
      beneficiary.address,
      start,
      CLIFF_DURATION,
      TOTAL_DURATION
    );
    await vesting.waitForDeployment();
    const vestingAddress = await vesting.getAddress();

    // Fund the vesting contract with the Team allocation, as the treasury
    // would in a real, human-approved distribution transaction.
    await chai.connect(treasury).transfer(vestingAddress, TEAM_ALLOCATION);

    return {
      chai,
      chaiAddress,
      vesting,
      vestingAddress,
      start,
      deployer,
      treasury,
      beneficiary,
      other,
    };
  }

  describe("Configuration", function () {
    it("stores the correct beneficiary, start, cliff and duration", async function () {
      const { vesting, beneficiary, start } = await deployFixture();
      expect(await vesting.owner()).to.equal(beneficiary.address); // beneficiary == VestingWallet owner
      expect(await vesting.start()).to.equal(start);
      expect(await vesting.cliffDuration()).to.equal(CLIFF_DURATION);
      expect(await vesting.duration()).to.equal(TOTAL_DURATION);
      expect(await vesting.cliffEnd()).to.equal(start + CLIFF_DURATION);
      expect(await vesting.end()).to.equal(start + TOTAL_DURATION);
    });

    it("holds the full team allocation after funding", async function () {
      const { chai, vestingAddress } = await deployFixture();
      expect(await chai.balanceOf(vestingAddress)).to.equal(TEAM_ALLOCATION);
    });

    it("reverts construction if total duration does not exceed cliff duration", async function () {
      const [, , beneficiary] = await ethers.getSigners();
      const ChaiVesting = await ethers.getContractFactory("ChaiVesting");
      const start = await time.latest();
      await expect(
        ChaiVesting.deploy(beneficiary.address, start, CLIFF_DURATION, CLIFF_DURATION)
      ).to.be.revertedWith(
        "ChaiVesting: total duration must exceed cliff duration"
      );
    });
  });

  describe("Vesting schedule", function () {
    it("has nothing releasable before the cliff", async function () {
      const { vesting, chaiAddress, start } = await deployFixture();

      // Right at deployment.
      expect(
        await vesting["releasable(address)"](chaiAddress)
      ).to.equal(0n);

      // Just before the cliff ends.
      await time.increaseTo(start + CLIFF_DURATION - 60);
      expect(
        await vesting["releasable(address)"](chaiAddress)
      ).to.equal(0n);

      // Exactly at the cliff: still 0 (the linear phase starts *from*
      // this instant, so 0% has vested at the boundary itself).
      await time.increaseTo(start + CLIFF_DURATION);
      expect(
        await vesting["releasable(address)"](chaiAddress)
      ).to.equal(0n);
    });

    it("releases the correct linear amount at cliff + 1 month", async function () {
      const { vesting, chaiAddress, start } = await deployFixture();
      await time.increaseTo(start + CLIFF_DURATION + MONTH);

      // Remaining linear period is 9 months; 1 of those 9 months elapsed.
      const expected = (TEAM_ALLOCATION * 1n) / 9n;
      const vested = await vesting["vestedAmount(address,uint64)"](
        chaiAddress,
        start + CLIFF_DURATION + MONTH
      );
      expect(vested).to.equal(expected);
    });

    it("releases the correct linear amount at cliff + 4.5 months (50% of the linear phase)", async function () {
      const { vesting, chaiAddress, start } = await deployFixture();
      const halfwayThroughLinearPhase =
        start + CLIFF_DURATION + Math.floor(4.5 * MONTH);
      await time.increaseTo(halfwayThroughLinearPhase);

      const vested = await vesting["vestedAmount(address,uint64)"](
        chaiAddress,
        halfwayThroughLinearPhase
      );
      // 4.5 / 9 months = exactly 50%.
      const expected = TEAM_ALLOCATION / 2n;
      expect(vested).to.equal(expected);
    });

    it("is fully releasable after the full 12-month duration", async function () {
      const { vesting, chaiAddress, start } = await deployFixture();
      await time.increaseTo(start + TOTAL_DURATION);
      expect(
        await vesting["releasable(address)"](chaiAddress)
      ).to.equal(TEAM_ALLOCATION);

      // Staying fully vested well past the end doesn't over-vest.
      await time.increaseTo(start + TOTAL_DURATION + 30 * 24 * 60 * 60);
      expect(
        await vesting["vestedAmount(address,uint64)"](
          chaiAddress,
          start + TOTAL_DURATION + 30 * 24 * 60 * 60
        )
      ).to.equal(TEAM_ALLOCATION);
    });

    it("cannot release more than what has vested at any point in time", async function () {
      const { vesting, chai, chaiAddress, beneficiary, start } =
        await deployFixture();

      // `setNextBlockTimestamp` pins the timestamp of the *release
      // transaction's own block* exactly, instead of `increaseTo` (which
      // mines an intermediate block and leaves the following tx's block
      // to pick up whatever timestamp automining assigns next).
      const releaseTimestamp = start + CLIFF_DURATION + 2 * MONTH;
      await time.setNextBlockTimestamp(releaseTimestamp);
      await vesting["release(address)"](chaiAddress);
      const expected = (TEAM_ALLOCATION * 2n) / 9n;
      expect(await chai.balanceOf(beneficiary.address)).to.equal(expected);

      // Immediately calling release again (same timestamp/block) should
      // release (~)nothing further since nothing new has vested.
      const releasableRightAfter = await vesting["releasable(address)"](
        chaiAddress
      );
      expect(releasableRightAfter).to.equal(0n);
    });
  });

  describe("release()", function () {
    it("can be called by anyone but always pays the beneficiary, not the caller", async function () {
      const { vesting, chai, chaiAddress, beneficiary, other, start } =
        await deployFixture();
      const releaseTimestamp = start + CLIFF_DURATION + MONTH;
      await time.setNextBlockTimestamp(releaseTimestamp);

      const expected = (TEAM_ALLOCATION * 1n) / 9n;

      // `other` (not the beneficiary) calls release.
      await expect(vesting.connect(other)["release(address)"](chaiAddress))
        .to.emit(vesting, "ERC20Released")
        .withArgs(chaiAddress, expected);

      expect(await chai.balanceOf(beneficiary.address)).to.equal(expected);
      expect(await chai.balanceOf(other.address)).to.equal(0n);
    });

    it("accumulates released() correctly across multiple calls", async function () {
      const { vesting, chai, chaiAddress, beneficiary, start } =
        await deployFixture();

      await time.increaseTo(start + CLIFF_DURATION + MONTH);
      await vesting["release(address)"](chaiAddress);
      const releasedAfterFirst = await vesting["released(address)"](
        chaiAddress
      );

      await time.increaseTo(start + CLIFF_DURATION + 2 * MONTH);
      await vesting["release(address)"](chaiAddress);
      const releasedAfterSecond = await vesting["released(address)"](
        chaiAddress
      );

      expect(releasedAfterSecond).to.be.gt(releasedAfterFirst);
      expect(await chai.balanceOf(beneficiary.address)).to.equal(
        releasedAfterSecond
      );
    });
  });

  describe("No revocation / no clawback", function () {
    it("exposes no revoke-style function in the ABI", async function () {
      const { vesting } = await deployFixture();
      const functionNames = vesting.interface.fragments
        .filter((f) => f.type === "function")
        .map((f) => f.name.toLowerCase());

      for (const pattern of ["revoke", "clawback", "reclaim", "sweep"]) {
        expect(
          functionNames.some((name) => name.includes(pattern))
        ).to.equal(false, `Found a clawback-style function: ${pattern}`);
      }
    });

    it("the deployer (non-owner, non-beneficiary) has no special power over the vesting contract", async function () {
      const { vesting, deployer, chaiAddress } = await deployFixture();
      // The deployer is neither the VestingWallet owner (beneficiary) nor
      // has any admin role on this contract, so any Ownable-gated call
      // from the deployer must revert exactly like it would for a
      // random unrelated account.
      await expect(
        vesting.connect(deployer).transferOwnership(deployer.address)
      ).to.be.revertedWithCustomError(vesting, "OwnableUnauthorizedAccount");
    });
  });
});
