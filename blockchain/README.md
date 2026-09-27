# ChaiCoin ($CHAI) — Smart Contracts

Smart-contract layer for the ChaiCoin community meme-token project. See
`../TOKENOMICS.md` and `../DECISIONS.md` in the repository root for the
full spec and rationale behind every design choice made here.

**Status: testnet stage only.** Nothing here has been deployed to
mainnet, and no mainnet deployment script is provided — see
"Mainnet" below.

## What's here

- `contracts/ChaiCoin.sol` — the ERC-20 token. Fixed supply of
  100,000,000,000 CHAI, minted once in the constructor to `initialHolder`.
  No `mint()` function exists after construction. Burnable
  (`ERC20Burnable`: `burn`/`burnFrom`, standard allowance semantics only).
  `Ownable` only for `transferOwnership`/`renounceOwnership` — there is no
  owner-gated function that can pause transfers, blacklist addresses, or
  move another holder's tokens. No transfer tax.
- `contracts/ChaiVesting.sol` — a linear-with-cliff vesting wallet for the
  Team allocation (10,000,000,000 CHAI): 3-month cliff, then linear
  vesting over the remaining 9 months (12 months total). Built on
  OpenZeppelin's `VestingWallet`. No revoke/clawback function exists.
- `tests/` — the Hardhat/Mocha/Chai test suite for both contracts.
- `scripts/deploy.js` — deploys ChaiCoin (and optionally ChaiVesting) to
  whichever network Hardhat is pointed at.
- `scripts/verify.js` — verifies deployed contract source on Polygonscan.
- `hardhat.config.js` — network and compiler configuration.
- `verification/` — notes on what block-explorer verification means and
  why it matters here.

## Install

```bash
cd blockchain
npm install
```

This installs Hardhat, `@nomicfoundation/hardhat-toolbox`,
`@openzeppelin/contracts`, and `dotenv`. It also installs the `solc` npm
package as a devDependency: `hardhat.config.js` prefers that
locally-installed compiler over Hardhat's normal behavior of downloading a
solc binary from `binaries.soliditylang.org` on first compile, so
`compile`/`test` also work in network-restricted environments (e.g. some
CI/sandboxes) — see the comment above the `subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD, ...)`
override in `hardhat.config.js`. If `solc` somehow isn't installed, it
falls back to Hardhat's normal download path automatically.

## Run tests

```bash
npm test
# or
npx hardhat test
```

Also available: `npm run compile` (`npx hardhat compile`).

## Configure

```bash
cp .env.example .env
```

Then fill in `.env` with your own values. **Never commit `.env`** (already
covered by the repo's root `.gitignore`) and never put a real private key
anywhere that gets committed. See `.env.example` for every variable this
project reads and what each one is for.

## Deploy to testnet (Polygon Amoy)

This is **TESTNET ONLY**. Requirements:

1. A funded Amoy testnet wallet (get test MATIC from
   https://faucet.polygon.technology/).
2. `.env` filled in with `AMOY_RPC_URL`, `DEPLOYER_PRIVATE_KEY`, and
   (optionally) `INITIAL_HOLDER_ADDRESS` / `INITIAL_OWNER_ADDRESS` (these
   default to the deployer's own address if unset).

```bash
npm run deploy:amoy
```

This deploys `ChaiCoin` and prints its address, name/symbol/decimals,
total supply, and the initial holder's balance for manual verification
against `TOKENOMICS.md`. It does **not** perform the 4-way allocation
split from `TOKENOMICS.md` §2 — that is a set of separate, human-approved
transactions run manually by whoever controls the initial holder wallet,
exactly as `TOKENOMICS.md` specifies. It also does **not** run unless you
explicitly pass `--network polygonAmoy` (directly or via this npm
script) — running it with no `--network` flag targets Hardhat's local,
in-memory network only.

If `TEAM_BENEFICIARY_ADDRESS` is also set in `.env`, the script will
additionally deploy `ChaiVesting` for the Team allocation (still without
funding it — funding is, again, a separate human-approved transfer).

### Mainnet

There is no mainnet deployment script in this repository, and none should
be run without explicit human sign-off per the project's mainnet gate
process (see the root `DECISIONS.md` / master project rules). Do not
adapt `scripts/deploy.js` to target Polygon mainnet without that
sign-off.

## Verify on Polygonscan

After deployment, fill in `CHAICOIN_ADDRESS` (and, if applicable,
`CHAIVESTING_ADDRESS` plus its constructor arguments) and
`POLYGONSCAN_API_KEY` in `.env`, then:

```bash
npm run verify:amoy
```

This submits the contract source to Polygonscan's Amoy explorer so anyone
can confirm the deployed bytecode matches this published source — see
`verification/README.md` for why that matters.
