# Deployment

## Website
Static site, no build step. Deploy the `website/` directory as-is to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages). No environment variables or secrets are required for the website itself.

## Smart contracts — testnet (the only deployment path this repository provides)

**This repository intentionally has no mainnet deployment script.** Mainnet deployment is a separate, explicitly human-approved action gated by `ROADMAP.md`'s Mainnet Gate checklist — it is never something run casually or automatically.

Testnet deployment steps (Polygon Amoy):
1. `cd blockchain && npm install`
2. `npm test` — confirm all 38 tests pass before proceeding
3. Copy `blockchain/.env.example` to `blockchain/.env` and fill in:
   - `AMOY_RPC_URL` (a real Amoy RPC endpoint)
   - `DEPLOYER_PRIVATE_KEY` (a **testnet-only** wallet's key, funded with testnet MATIC from a faucet — never a wallet holding real funds)
   - `POLYGONSCAN_API_KEY` (for verification)
   - optionally `INITIAL_HOLDER_ADDRESS`, `INITIAL_OWNER_ADDRESS`, `TEAM_BENEFICIARY_ADDRESS`
4. `npm run deploy:amoy` — deploys `ChaiCoin` (and `ChaiVesting` if `TEAM_BENEFICIARY_ADDRESS` is set); prints the deployed address and total supply for manual verification against `TOKENOMICS.md`
5. `npm run verify:amoy` — verifies the source on Polygonscan (Amoy)
6. Manually perform the 4-way initial distribution as separate, logged transactions per `TOKENOMICS.md`'s allocation table — this is not automated, by design, so each transfer is a deliberate, auditable action
7. Update `website/contract.html` and `PROJECT_STATUS.md` with the real testnet address and verification link
8. Only after all of the above is confirmed on-chain: consider transferring/renouncing `Ownable` ownership to a multisig, per `TOKENOMICS.md` §3

## What is explicitly NOT provided
- No mainnet deploy script.
- No script that moves real funds.
- No CI step that deploys anything automatically — CI only runs tests (see `.github/workflows/`).
