// Deploys ChaiCoin (and, optionally, the ChaiVesting contract for the Team
// allocation) to whichever network Hardhat is pointed at.
//
// This script is never run automatically — it only executes when a human
// invokes it explicitly, e.g.:
//   npx hardhat run scripts/deploy.js --network polygonAmoy
// or via the npm script:
//   npm run deploy:amoy
//
// With no --network flag it targets Hardhat's local in-memory network,
// which is not a real deployment. TESTNET ONLY: this repository provides
// no mainnet deployment path (see blockchain/README.md) — deploying real
// funds is a separate, human-approved process outside this script.
//
// All configuration comes from environment variables (loaded from a local
// .env file via dotenv — see .env.example). No secret is hardcoded here.

require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  if (!deployer) {
    throw new Error(
      "No signer available. Set DEPLOYER_PRIVATE_KEY in your .env file " +
        "(see .env.example) before deploying to a live network."
    );
  }

  // initialHolder / initialOwner default to the deployer's own address if
  // not explicitly overridden in .env — this matches TOKENOMICS.md, where
  // the deployer wallet is the address that performs the one-time initial
  // distribution before ownership is later transferred to the Treasury
  // multisig.
  const initialHolder = process.env.INITIAL_HOLDER_ADDRESS || deployer.address;
  const initialOwner = process.env.INITIAL_OWNER_ADDRESS || deployer.address;

  console.log("Network:          ", hre.network.name);
  console.log("Deployer address: ", deployer.address);
  console.log("initialHolder:    ", initialHolder);
  console.log("initialOwner:     ", initialOwner);
  console.log("");

  console.log("Deploying ChaiCoin...");
  const ChaiCoin = await ethers.getContractFactory("ChaiCoin");
  const chai = await ChaiCoin.deploy(initialHolder, initialOwner);
  await chai.waitForDeployment();
  const chaiAddress = await chai.getAddress();

  const totalSupply = await chai.totalSupply();
  const holderBalance = await chai.balanceOf(initialHolder);
  const name = await chai.name();
  const symbol = await chai.symbol();
  const decimals = await chai.decimals();

  console.log("");
  console.log("ChaiCoin deployed.");
  console.log("  Address:          ", chaiAddress);
  console.log("  Name / Symbol:    ", `${name} / ${symbol}`);
  console.log("  Decimals:         ", decimals.toString());
  console.log(
    "  Total supply:     ",
    ethers.formatUnits(totalSupply, decimals),
    symbol
  );
  console.log(
    "  initialHolder bal:",
    ethers.formatUnits(holderBalance, decimals),
    symbol
  );
  console.log(
    "  (manually verify the above against TOKENOMICS.md before proceeding)"
  );

  // --- Optional: deploy the Team vesting contract -----------------------
  // Only runs if TEAM_BENEFICIARY_ADDRESS is set in .env. This is a
  // separate, opt-in step so ChaiCoin can be deployed on its own; the
  // Team allocation itself is only transferred into the vesting contract
  // by a later, human-approved transaction (per TOKENOMICS.md — this
  // contract does not auto-fund itself).
  const teamBeneficiary = process.env.TEAM_BENEFICIARY_ADDRESS;
  if (teamBeneficiary) {
    console.log("");
    console.log("TEAM_BENEFICIARY_ADDRESS set — deploying ChaiVesting...");

    const MONTH = 30 * 24 * 60 * 60; // 30-day month, matches the test suite
    const cliffDuration = Number(process.env.VESTING_CLIFF_SECONDS) || 3 * MONTH;
    const totalDuration = Number(process.env.VESTING_DURATION_SECONDS) || 12 * MONTH;
    const startTimestamp =
      Number(process.env.VESTING_START_TIMESTAMP) ||
      Math.floor(Date.now() / 1000);

    const ChaiVesting = await ethers.getContractFactory("ChaiVesting");
    const vesting = await ChaiVesting.deploy(
      teamBeneficiary,
      startTimestamp,
      cliffDuration,
      totalDuration
    );
    await vesting.waitForDeployment();
    const vestingAddress = await vesting.getAddress();

    console.log("");
    console.log("ChaiVesting deployed.");
    console.log("  Address:          ", vestingAddress);
    console.log("  Beneficiary:      ", teamBeneficiary);
    console.log(
      "  Start:            ",
      new Date(startTimestamp * 1000).toISOString()
    );
    console.log("  Cliff (seconds):  ", cliffDuration);
    console.log("  Duration (secs):  ", totalDuration);
    console.log(
      "  NOTE: this contract holds no CHAI yet — the Team allocation " +
        "(10,000,000,000 CHAI) must be transferred to this address in a " +
        "separate, human-approved transaction from the initial holder / " +
        "Treasury, per TOKENOMICS.md."
    );
  } else {
    console.log("");
    console.log(
      "TEAM_BENEFICIARY_ADDRESS not set — skipping ChaiVesting deployment."
    );
  }

  console.log("");
  console.log("Done. Remember to:");
  console.log(
    "  1. Verify the deployed source on Polygonscan (npm run verify:amoy)."
  );
  console.log(
    "  2. Perform the initial distribution as separate, logged " +
      "transactions per TOKENOMICS.md's allocation table — this script " +
      "does not do that automatically."
  );
  console.log(
    "  3. Transfer/renounce ownership to the Treasury multisig only once " +
      "everything above is verified on-chain."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
