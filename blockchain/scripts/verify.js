// Verifies already-deployed contract source on Polygonscan (Amoy) using
// hardhat-verify (bundled in @nomicfoundation/hardhat-toolbox).
//
// Run after scripts/deploy.js has deployed the contract(s) and you have
// noted their addresses and constructor arguments:
//   npx hardhat run scripts/verify.js --network polygonAmoy
// or:
//   npm run verify:amoy
//
// Configuration (all from environment variables / .env — see
// .env.example): POLYGONSCAN_API_KEY, plus the deployed addresses and the
// exact constructor arguments used at deploy time. Nothing here is
// hardcoded, and this script performs no deployment of its own.

require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const chaiCoinAddress = process.env.CHAICOIN_ADDRESS;
  const initialHolder = process.env.INITIAL_HOLDER_ADDRESS;
  const initialOwner = process.env.INITIAL_OWNER_ADDRESS;

  if (!chaiCoinAddress) {
    throw new Error(
      "Set CHAICOIN_ADDRESS in your .env file to the deployed ChaiCoin " +
        "contract address before running verification."
    );
  }
  if (!initialHolder || !initialOwner) {
    throw new Error(
      "Set INITIAL_HOLDER_ADDRESS and INITIAL_OWNER_ADDRESS in your .env " +
        "file to the exact constructor arguments used when ChaiCoin was " +
        "deployed — verification will fail if these don't match on-chain " +
        "bytecode."
    );
  }

  console.log("Verifying ChaiCoin at", chaiCoinAddress, "on", hre.network.name);
  await hre.run("verify:verify", {
    address: chaiCoinAddress,
    constructorArguments: [initialHolder, initialOwner],
  });
  console.log("ChaiCoin verified.");

  // Optional: verify ChaiVesting too, if its address and constructor args
  // are provided.
  const chaiVestingAddress = process.env.CHAIVESTING_ADDRESS;
  if (chaiVestingAddress) {
    const teamBeneficiary = process.env.TEAM_BENEFICIARY_ADDRESS;
    const startTimestamp = process.env.VESTING_START_TIMESTAMP;
    const cliffDuration = process.env.VESTING_CLIFF_SECONDS;
    const totalDuration = process.env.VESTING_DURATION_SECONDS;

    if (!teamBeneficiary || !startTimestamp || !cliffDuration || !totalDuration) {
      console.warn(
        "CHAIVESTING_ADDRESS is set but one of TEAM_BENEFICIARY_ADDRESS / " +
          "VESTING_START_TIMESTAMP / VESTING_CLIFF_SECONDS / " +
          "VESTING_DURATION_SECONDS is missing — skipping ChaiVesting " +
          "verification. These must match the exact values used at " +
          "deploy time."
      );
    } else {
      console.log(
        "Verifying ChaiVesting at",
        chaiVestingAddress,
        "on",
        hre.network.name
      );
      await hre.run("verify:verify", {
        address: chaiVestingAddress,
        constructorArguments: [
          teamBeneficiary,
          Number(startTimestamp),
          Number(cliffDuration),
          Number(totalDuration),
        ],
      });
      console.log("ChaiVesting verified.");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
