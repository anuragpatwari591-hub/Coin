const { expect } = require("chai");
const { ethers } = require("hardhat");

const TOTAL_SUPPLY = 100_000_000_000n * 10n ** 18n;

describe("ChaiCoin", function () {
  async function deployFixture() {
    const [deployer, initialHolder, owner, alice, bob, carol] =
      await ethers.getSigners();

    const ChaiCoin = await ethers.getContractFactory("ChaiCoin");
    const chai = await ChaiCoin.deploy(
      initialHolder.address,
      owner.address
    );
    await chai.waitForDeployment();

    return { chai, deployer, initialHolder, owner, alice, bob, carol };
  }

  describe("Deployment", function () {
    it("sets the correct name, symbol and decimals", async function () {
      const { chai } = await deployFixture();
      expect(await chai.name()).to.equal("ChaiCoin");
      expect(await chai.symbol()).to.equal("CHAI");
      expect(await chai.decimals()).to.equal(18);
    });

    it("mints the entire fixed total supply to initialHolder and nowhere else", async function () {
      const { chai, initialHolder, owner, deployer } = await deployFixture();
      expect(await chai.totalSupply()).to.equal(TOTAL_SUPPLY);
      expect(await chai.balanceOf(initialHolder.address)).to.equal(
        TOTAL_SUPPLY
      );
      // No stray balance anywhere else, including the deployer and owner.
      expect(await chai.balanceOf(deployer.address)).to.equal(0);
      expect(await chai.balanceOf(owner.address)).to.equal(0);
    });

    it("exposes TOTAL_SUPPLY as a constant matching the minted amount", async function () {
      const { chai } = await deployFixture();
      expect(await chai.TOTAL_SUPPLY()).to.equal(TOTAL_SUPPLY);
    });

    it("reverts if initialHolder is the zero address", async function () {
      const [, , owner] = await ethers.getSigners();
      const ChaiCoin = await ethers.getContractFactory("ChaiCoin");
      await expect(
        ChaiCoin.deploy(ethers.ZeroAddress, owner.address)
      ).to.be.revertedWith("ChaiCoin: initialHolder is zero address");
    });

    it("sets the correct initial owner", async function () {
      const { chai, owner } = await deployFixture();
      expect(await chai.owner()).to.equal(owner.address);
    });

    it("has no mint function in the ABI (supply cannot be inflated)", async function () {
      const { chai } = await deployFixture();
      const fragments = chai.interface.fragments
        .filter((f) => f.type === "function")
        .map((f) => f.name);
      // No function named `mint` in any form should exist.
      expect(fragments).to.not.include("mint");
      expect(
        fragments.some((name) => name.toLowerCase().includes("mint"))
      ).to.equal(false);
    });

    it("keeps total supply constant across arbitrary transfers and burns", async function () {
      const { chai, initialHolder, alice, bob } = await deployFixture();
      await chai.connect(initialHolder).transfer(alice.address, 1000n);
      await chai.connect(alice).transfer(bob.address, 400n);
      // Transfers never change total supply; only burn does (checked below).
      expect(await chai.totalSupply()).to.equal(TOTAL_SUPPLY);
    });
  });

  describe("Transfers", function () {
    it("performs a standard transfer and emits a Transfer event", async function () {
      const { chai, initialHolder, alice } = await deployFixture();
      await expect(chai.connect(initialHolder).transfer(alice.address, 1000n))
        .to.emit(chai, "Transfer")
        .withArgs(initialHolder.address, alice.address, 1000n);

      expect(await chai.balanceOf(alice.address)).to.equal(1000n);
      expect(await chai.balanceOf(initialHolder.address)).to.equal(
        TOTAL_SUPPLY - 1000n
      );
    });

    it("reverts on transfer to the zero address", async function () {
      const { chai, initialHolder } = await deployFixture();
      await expect(
        chai.connect(initialHolder).transfer(ethers.ZeroAddress, 1n)
      ).to.be.revertedWithCustomError(chai, "ERC20InvalidReceiver");
    });

    it("reverts when transferring more than the sender's balance", async function () {
      const { chai, alice, bob } = await deployFixture();
      // alice has 0 balance
      await expect(
        chai.connect(alice).transfer(bob.address, 1n)
      ).to.be.revertedWithCustomError(chai, "ERC20InsufficientBalance");
    });

    it("allows transferring the exact full balance", async function () {
      const { chai, initialHolder, alice } = await deployFixture();
      await chai.connect(initialHolder).transfer(alice.address, TOTAL_SUPPLY);
      expect(await chai.balanceOf(alice.address)).to.equal(TOTAL_SUPPLY);
      expect(await chai.balanceOf(initialHolder.address)).to.equal(0);
    });
  });

  describe("Approvals / allowances", function () {
    it("approves and allows transferFrom within the allowance", async function () {
      const { chai, initialHolder, alice, bob } = await deployFixture();
      await expect(chai.connect(initialHolder).approve(alice.address, 500n))
        .to.emit(chai, "Approval")
        .withArgs(initialHolder.address, alice.address, 500n);

      expect(
        await chai.allowance(initialHolder.address, alice.address)
      ).to.equal(500n);

      await chai
        .connect(alice)
        .transferFrom(initialHolder.address, bob.address, 300n);

      expect(await chai.balanceOf(bob.address)).to.equal(300n);
      expect(
        await chai.allowance(initialHolder.address, alice.address)
      ).to.equal(200n);
    });

    it("reverts transferFrom exceeding the allowance", async function () {
      const { chai, initialHolder, alice, bob } = await deployFixture();
      await chai.connect(initialHolder).approve(alice.address, 100n);
      await expect(
        chai
          .connect(alice)
          .transferFrom(initialHolder.address, bob.address, 101n)
      ).to.be.revertedWithCustomError(chai, "ERC20InsufficientAllowance");
    });

    it("supports re-approving to a new value (approve overwrites, not adds)", async function () {
      const { chai, initialHolder, alice } = await deployFixture();
      await chai.connect(initialHolder).approve(alice.address, 100n);
      await chai.connect(initialHolder).approve(alice.address, 50n);
      expect(
        await chai.allowance(initialHolder.address, alice.address)
      ).to.equal(50n);
    });

    it("handles a maximum uint256 approval without overflow", async function () {
      const { chai, initialHolder, alice, bob } = await deployFixture();
      const maxUint256 = ethers.MaxUint256;
      await chai.connect(initialHolder).approve(alice.address, maxUint256);
      expect(
        await chai.allowance(initialHolder.address, alice.address)
      ).to.equal(maxUint256);

      // OpenZeppelin's ERC20 treats a max-uint256 allowance as "infinite"
      // and does not decrement it on transferFrom.
      await chai
        .connect(alice)
        .transferFrom(initialHolder.address, bob.address, 1000n);
      expect(
        await chai.allowance(initialHolder.address, alice.address)
      ).to.equal(maxUint256);
    });

    it("allows approving 0 (revoking an allowance)", async function () {
      const { chai, initialHolder, alice } = await deployFixture();
      await chai.connect(initialHolder).approve(alice.address, 100n);
      await chai.connect(initialHolder).approve(alice.address, 0n);
      expect(
        await chai.allowance(initialHolder.address, alice.address)
      ).to.equal(0n);
    });
  });

  describe("Burn (ERC20Burnable)", function () {
    it("burn() reduces the caller's balance and total supply", async function () {
      const { chai, initialHolder } = await deployFixture();
      await chai.connect(initialHolder).burn(1000n);
      expect(await chai.balanceOf(initialHolder.address)).to.equal(
        TOTAL_SUPPLY - 1000n
      );
      expect(await chai.totalSupply()).to.equal(TOTAL_SUPPLY - 1000n);
    });

    it("burnFrom respects an existing allowance", async function () {
      const { chai, initialHolder, alice } = await deployFixture();
      await chai.connect(initialHolder).approve(alice.address, 500n);
      await chai.connect(alice).burnFrom(initialHolder.address, 300n);

      expect(await chai.balanceOf(initialHolder.address)).to.equal(
        TOTAL_SUPPLY - 300n
      );
      expect(await chai.totalSupply()).to.equal(TOTAL_SUPPLY - 300n);
      expect(
        await chai.allowance(initialHolder.address, alice.address)
      ).to.equal(200n);
    });

    it("burnFrom without sufficient allowance reverts", async function () {
      const { chai, initialHolder, alice } = await deployFixture();
      await expect(
        chai.connect(alice).burnFrom(initialHolder.address, 1n)
      ).to.be.revertedWithCustomError(chai, "ERC20InsufficientAllowance");
    });

    it("nobody can burn tokens they don't own or have allowance for", async function () {
      const { chai, initialHolder, alice, bob } = await deployFixture();
      await chai.connect(initialHolder).transfer(alice.address, 500n);
      await expect(
        chai.connect(bob).burnFrom(alice.address, 1n)
      ).to.be.revertedWithCustomError(chai, "ERC20InsufficientAllowance");
    });
  });

  describe("Ownership", function () {
    it("only the owner can transfer ownership; non-owners revert", async function () {
      const { chai, owner, alice, bob } = await deployFixture();
      await expect(
        chai.connect(alice).transferOwnership(bob.address)
      )
        .to.be.revertedWithCustomError(chai, "OwnableUnauthorizedAccount")
        .withArgs(alice.address);

      await expect(chai.connect(owner).transferOwnership(bob.address))
        .to.emit(chai, "OwnershipTransferred")
        .withArgs(owner.address, bob.address);

      expect(await chai.owner()).to.equal(bob.address);
    });

    it("only the owner can renounce ownership; non-owners revert", async function () {
      const { chai, owner, alice } = await deployFixture();
      await expect(chai.connect(alice).renounceOwnership())
        .to.be.revertedWithCustomError(chai, "OwnableUnauthorizedAccount")
        .withArgs(alice.address);

      await expect(chai.connect(owner).renounceOwnership())
        .to.emit(chai, "OwnershipTransferred")
        .withArgs(owner.address, ethers.ZeroAddress);

      expect(await chai.owner()).to.equal(ethers.ZeroAddress);
    });

    it("has no owner-gated function that can affect transfers or balances", async function () {
      // Enumerate every function in the ABI and confirm the only
      // owner-related entries are the two harmless Ownable functions.
      // This documents, at the ABI level, that there is no pause/
      // blacklist/mint/fee-setter/forced-transfer path an owner could use.
      const { chai } = await deployFixture();
      const functionNames = chai.interface.fragments
        .filter((f) => f.type === "function")
        .map((f) => f.name);

      const dangerousNamePatterns = [
        "pause",
        "blacklist",
        "blocklist",
        "freeze",
        "mint",
        "setFee",
        "setTax",
        "seize",
        "forceTransfer",
        "excludeFrom",
        "setMaxWallet",
        "setMaxTx",
      ];

      for (const name of functionNames) {
        const lower = name.toLowerCase();
        for (const pattern of dangerousNamePatterns) {
          expect(lower.includes(pattern.toLowerCase())).to.equal(
            false,
            `Found a suspicious function on ChaiCoin: ${name}`
          );
        }
      }

      // The only owner-facing functions are the two standard Ownable ones.
      expect(functionNames).to.include("transferOwnership");
      expect(functionNames).to.include("renounceOwnership");
    });

    it("owner and non-owner are treated identically by every user-facing token function", async function () {
      // Since there is no owner-gated function affecting transfers or
      // balances, the owner has no special power over token mechanics:
      // both the owner and an arbitrary non-owner can transfer, approve
      // and burn their own tokens the same way, and neither can call an
      // Ownable-only function without reverting in the same way.
      const { chai, initialHolder, owner, alice } = await deployFixture();
      await chai.connect(initialHolder).transfer(owner.address, 1000n);
      await chai.connect(initialHolder).transfer(alice.address, 1000n);

      // Both can transfer their own balance freely.
      await expect(chai.connect(owner).transfer(alice.address, 100n)).to.not
        .be.reverted;
      await expect(chai.connect(alice).transfer(owner.address, 100n)).to.not
        .be.reverted;

      // Both can burn their own balance freely.
      await expect(chai.connect(owner).burn(50n)).to.not.be.reverted;
      await expect(chai.connect(alice).burn(50n)).to.not.be.reverted;

      // Neither the owner acting as a "holder" nor a plain non-owner has
      // any privileged transfer path over the *other's* balance without
      // an allowance — both revert identically.
      await expect(
        chai.connect(owner).transferFrom(alice.address, owner.address, 1n)
      ).to.be.revertedWithCustomError(chai, "ERC20InsufficientAllowance");
      await expect(
        chai.connect(alice).transferFrom(owner.address, alice.address, 1n)
      ).to.be.revertedWithCustomError(chai, "ERC20InsufficientAllowance");
    });
  });

  describe("Edge cases / malicious inputs", function () {
    it("allows a self-transfer without changing the balance", async function () {
      const { chai, initialHolder } = await deployFixture();
      await chai
        .connect(initialHolder)
        .transfer(initialHolder.address, 1000n);
      expect(await chai.balanceOf(initialHolder.address)).to.equal(
        TOTAL_SUPPLY
      );
    });

    it("allows transferring 0 tokens and still emits a Transfer event", async function () {
      const { chai, initialHolder, alice } = await deployFixture();
      await expect(chai.connect(initialHolder).transfer(alice.address, 0n))
        .to.emit(chai, "Transfer")
        .withArgs(initialHolder.address, alice.address, 0n);
      expect(await chai.balanceOf(alice.address)).to.equal(0n);
    });

    // Reentrancy is not applicable to ChaiCoin: it is a plain
    // OpenZeppelin ERC20/ERC20Burnable/Ownable token with no external
    // calls, hooks, or callbacks to untrusted addresses anywhere in its
    // transfer, approve, or burn paths (no ERC777-style hooks, no
    // low-level `.call` to the recipient). There is no reentrancy surface
    // to test.
  });
});
