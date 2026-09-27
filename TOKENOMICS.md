# ChaiCoin ($CHAI) — Tokenomics

Status: **Draft — testnet stage. No mainnet supply exists yet.** This document is the single source of truth for token economics and will be updated (with a changelog entry) if anything changes before mainnet.

## 1. Summary

| Parameter | Value |
|---|---|
| Name | ChaiCoin |
| Ticker | CHAI |
| Standard | ERC-20 (OpenZeppelin `ERC20`, `ERC20Burnable`, `Ownable`) |
| Chain | Polygon PoS (testnet: Amoy) — see `research/trends/blockchain-comparison.md` |
| Total supply | 100,000,000,000 CHAI (100 billion), **fixed at deployment** |
| Decimals | 18 |
| Mint function | **None post-deployment.** The full supply is minted once in the constructor. There is no `mint()` function in the contract — see `blockchain/contracts/ChaiCoin.sol`. |
| Burn function | Public `burn`/`burnFrom` (OpenZeppelin `ERC20Burnable`) — any holder may burn their own tokens; nobody can burn someone else's without an approved allowance, and the treasury has no special burn privilege over others' balances. |
| Contract ownership | `Ownable`, owner can only: (a) transfer ownership, (b) trigger the one-time initial distribution described below if not done in the constructor. **Owner cannot mint, cannot pause transfers, cannot blacklist addresses, cannot alter balances.** Ownership is transferred to the Treasury multisig immediately after deployment and initial distribution are verified on-chain, then documented here with the transaction hash. |
| Transaction tax | **None.** Every transfer moves exactly the amount sent; no hidden fee-on-transfer logic. This is a deliberate anti-honeypot design choice. |

## 2. Allocation

| Bucket | % of supply | Tokens | Purpose | Lockup / vesting |
|---|---|---|---|---|
| Community & Ecosystem Rewards | 40% | 40,000,000,000 | Quest rewards, contest prizes, airdrops to genuine early participants, future utility features (see §5) | Released in tranches per `community/rewards/` schedule; no tranche is released without a corresponding public announcement of what it funded |
| Liquidity | 30% | 30,000,000,000 | Seeding a DEX pool (QuickSwap/Uniswap on Polygon) — **only after explicit human approval per the master project rules; not deployed with real funds automatically** | LP tokens, once created, are to be time-locked via a third-party locker contract; lock details published here and on the website before any liquidity is called "live" |
| Treasury | 20% | 20,000,000,000 | Development costs, verification/infra costs, future audits, contingency | Held in a Gnosis Safe multisig (≥2-of-3 signers); every disbursement logged publicly (`analytics/treasury-log.md`, to be created once the multisig exists) |
| Team | 10% | 10,000,000,000 | Compensates whoever does ongoing engineering/community/ops work | **12-month linear vesting with a 3-month cliff**, enforced by a vesting contract before any team tokens are liquid — no team tokens are liquid at launch |

No allocation is hidden. If this table ever changes, the change is recorded in `CHANGELOG.md` and `DECISIONS.md` with a reason, before the corresponding on-chain action.

## 3. Wallet structure (to be created; addresses published here once they exist)

1. **Deployer wallet** — used only to deploy the contract and perform the one-time initial distribution transaction. Emptied of any admin privilege immediately after by transferring `Ownable` ownership to the Treasury multisig.
2. **Treasury multisig** (Gnosis Safe, Polygon) — holds the Treasury and Liquidity allocations until liquidity is approved for deployment. Signers and threshold to be published here before mainnet.
3. **Community Rewards wallet** — holds the Community & Ecosystem allocation; every outbound transaction should correspond to a documented quest/contest result.
4. **Team vesting contract** — holds the Team allocation; releases per the vesting schedule above, address published once deployed.

## 4. Anti-honeypot / transparency guarantees

- No mint function exists after constructor — total supply is provably fixed on-chain (verifiable via any block explorer once verified — see `blockchain/verification/`).
- No transfer tax, no blacklist, no pause switch, no owner-only "special" transfer path. The contract has no function that can move tokens out of a holder's wallet without their signature/approval.
- No admin function can alter balances directly.
- Ownership renounced or moved to a multisig (never held by a single private key) before any real liquidity is added.
- Full contract source is published and intended to be verified on the relevant block explorer before any public announcement calls it "live."

## 5. Utility (non-speculative, see master brief §12)

ChaiCoin's utility is a **reputation and light governance layer** built on top of the "chai break" social ritual (see `docs/BRAND.md`):

- **Kadak Points** — an off-chain (later potentially on-chain, e.g. Soulbound/attestation-based) reputation score earned by participating in community quests, contests, and moderation work. Not transferable, not sellable, not a security — pure reputation.
- **Chai Panchayat** — informal community polls (Telegram/Discord native polls initially; a lightweight on-chain snapshot-style vote is a documented future milestone in `ROADMAP.md`, not a launch-day promise) where CHAI holders and Kadak-Point holders can weigh in on non-binding community decisions (e.g., which contest theme to run next, what feature to prioritize).
- **Digital collectibles ("Chai Cups")** — badge-style recognition for contribution milestones. Explicitly not marketed as an investment; if ever implemented as NFTs, this repo will document the mechanism plainly and add the standard risk disclaimers.

None of this utility is required to be purchased with CHAI to access — participation-based rewards, not pay-to-win — because the goal is genuine community-building, not creating artificial buy pressure.

## 6. What this document deliberately does NOT contain

- No price prediction.
- No promised listing on any exchange.
- No guaranteed liquidity depth or guaranteed liquidity timeline.
- No staking-yield-in-fiat-terms promise.

## 7. Change log for this document
- 2026-09-27 — Initial draft created during autonomous project setup (testnet stage, no addresses exist yet).
