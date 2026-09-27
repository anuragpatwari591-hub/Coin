# Architecture

## Repository layout
The directory structure follows the master project brief exactly (no deviation was found to be warranted by research):

```
blockchain/   Solidity contracts, Hardhat config, tests, deploy/verify scripts
website/      Static, dependency-free HTML/CSS/JS public site
frontend/     Reserved for a future dApp frontend (wallet connect, on-chain reads) — not yet needed at testnet-info stage
backend/      Reserved for a future API layer (e.g. serving analytics) — not yet needed
dashboard/    Reserved for the post-launch analytics dashboard (ROADMAP.md Phase 3)
tokenomics/   Reserved for machine-readable tokenomics data (e.g. allocation JSON) if/when the website needs to consume it dynamically; canonical human-readable spec lives in root TOKENOMICS.md
research/     Cited market/regulatory/technical research
docs/         Brand identity and supporting docs
security/     Supplementary security material beyond root SECURITY.md
community/    Telegram/Discord structure, rules, moderation, events, rewards
marketing/    Strategy, calendars, content
PR/           Media kit, press releases, outreach, FAQ
social/       Platform-specific draft content
analytics/    Reserved for real analytics exports once there's real traffic
.github/      CI workflows, issue/PR templates
```

## Why no frontend/backend framework yet
The website is informational only at this stage (no wallet connection, no on-chain reads/writes needed to serve the required pages). Introducing a framework (React/Next.js) before there's a genuine need would add build complexity and dependency surface without benefit — violates the "no gratuitous abstraction" engineering principle this project follows. `frontend/` and `backend/` are reserved and will be filled in when a real feature (e.g., a live testnet holder dashboard) requires them.

## Smart contract architecture
- `ChaiCoin.sol` — minimal ERC-20 (OpenZeppelin `ERC20` + `ERC20Burnable` + `Ownable`), fixed supply minted once in the constructor, no mint/pause/blacklist/tax functions. See NatSpec in the file and `TOKENOMICS.md` for rationale.
- `ChaiVesting.sol` — one per beneficiary, built on OpenZeppelin `VestingWallet` with an added cliff. Deployed independently per beneficiary; not a factory (only one beneficiary — the team allocation — exists per `TOKENOMICS.md` at this stage).
- No proxy/upgradeability pattern is used. An immutable, non-upgradeable contract is a deliberate transparency choice: what's verified on the explorer is what will always run — no admin key can silently change token behavior later. If this becomes limiting, any change would require a new contract and a documented migration, not a silent upgrade.

## Data flow (current, informational-only stage)
Website pages are static and link to the GitHub repository for canonical documents (tokenomics, roadmap, etc.) rather than duplicating data that could drift. Once a testnet contract is deployed, `contract.html` will be updated with the address (see `website/README.md`).

## Chain choice
Polygon PoS (testnet: Amoy). Full comparison and reasoning: `research/trends/blockchain-comparison.md`, decision recorded in `DECISIONS.md`.
