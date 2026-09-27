require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { subtask } = require("hardhat/config");
const {
  TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD,
} = require("hardhat/builtin-tasks/task-names");

const SOLC_VERSION = "0.8.24";

// By default Hardhat downloads the solc binary for the configured version
// from binaries.soliditylang.org on first compile. Some CI/sandboxed
// environments restrict outbound access to that host. To keep `compile`
// and `test` working in those environments (and to make builds more
// reproducible in general), this overrides solc resolution to use the
// `solc` npm package (the official solc-js/wasm build, installed as an
// ordinary devDependency from the npm registry) instead of reaching out
// to binaries.soliditylang.org. If that package isn't installed for some
// reason, this falls back to Hardhat's normal download behavior.
subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, async (args, hre, runSuper) => {
  if (args.solcVersion === SOLC_VERSION) {
    try {
      const compilerPath = require.resolve("solc/soljson.js");
      return {
        compilerPath,
        isSolcJs: true,
        version: args.solcVersion,
        longVersion: `${args.solcVersion}+commit.local-npm-solc`,
      };
    } catch (e) {
      // `solc` npm package not installed — fall through to default behavior.
    }
  }
  return runSuper(args);
});

// All network/API-key configuration is read from environment variables so
// this file never contains secrets and never crashes when a var is unset
// (e.g. when someone only wants to compile/test locally without any
// deployment credentials configured).
const AMOY_RPC_URL = process.env.AMOY_RPC_URL || "";
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

// Only pass an account list to a network if we actually have a private key;
// hardhat rejects a malformed/empty key, so this keeps `npx hardhat compile`
// and `npx hardhat test` working with no .env present at all.
const amoyAccounts = /^0x[0-9a-fA-F]{64}$/.test(DEPLOYER_PRIVATE_KEY)
  ? [DEPLOYER_PRIVATE_KEY]
  : [];

/** @type {import("hardhat/config").HardhatUserConfig} */
module.exports = {
  paths: {
    tests: "./tests",
  },
  solidity: {
    version: SOLC_VERSION,
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      // Local, in-memory network used for the test suite. No real funds,
      // no deployment happens here unless a script is explicitly run
      // against it.
      chainId: 31337,
    },
    polygonAmoy: {
      url: AMOY_RPC_URL || "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: amoyAccounts,
    },
  },
  etherscan: {
    // hardhat-verify (bundled in hardhat-toolbox) reads this for the
    // `verify` task. Polygonscan uses the same "etherscan" config shape.
    apiKey: {
      polygonAmoy: POLYGONSCAN_API_KEY,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com",
        },
      },
    ],
  },
};
