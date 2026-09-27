# Changelog

All notable changes to this project are documented here. Format: date, area, what changed, why (or link to the relevant `DECISIONS.md` entry).

## 2026-09-27 — Initial project setup
- Established full repository architecture per the master project brief.
- Added research: meme-token market trends, India VDA/FIU/ASCI regulatory research, 5-chain blockchain comparison — all cited (`research/`).
- Generated 10 original project concepts, selected ChaiCoin ($CHAI) with documented criteria (`research/concepts.md`, `research/concept-selection.md`).
- Defined brand identity (`docs/BRAND.md`) and tokenomics: fixed 100,000,000,000 CHAI supply, no mint function, no transaction tax, 40/30/20/10 allocation with vesting (`TOKENOMICS.md`).
- Selected Polygon PoS (Amoy testnet) as the deployment chain (`research/trends/blockchain-comparison.md`).
- Implemented and tested smart contracts: `ChaiCoin.sol` (ERC-20, no mint/pause/blacklist) and `ChaiVesting.sol` (non-revocable cliff+linear vesting) — 38/38 tests passing.
- Added env-driven testnet deploy/verify scripts (Polygon Amoy only; no mainnet path provided).
- Built the full 12-page responsive public website (plain HTML/CSS/JS).
- Documented the community system, marketing plan, PR plan, and starter social content.
- Added `SECURITY.md`, `LEGAL_NOTES.md`, `.gitignore`, `.env.example`, `ROADMAP.md` (with an explicit Mainnet Gate), `DECISIONS.md`, and this file.
- Added GitHub repository configuration: root docs, CI workflow (contract test suite on every PR), issue/PR templates.

No mainnet deployment, real funds, or account creation has occurred as of this entry — see `PROJECT_STATUS.md` for current blockers.
