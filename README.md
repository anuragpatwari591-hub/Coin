# ChaiCoin ($CHAI) 🍵

> Brewed by the community, for the community.

**Status: Testnet-preparation stage.** No mainnet token exists. No funds have been raised. Nothing is for sale. See [`PROJECT_STATUS.md`](PROJECT_STATUS.md) for the live, current state of every workstream.

> Crypto products and NFTs are unregulated and can be highly risky. There may be no regulatory recourse for any loss from such transactions.

## What this is

ChaiCoin is an experimental, transparent, community-run token project inspired by the universal ritual of the chai break. It is built with:
- a **fixed supply** of 100,000,000,000 CHAI with **no mint function** after deployment,
- **no pause switch, no blacklist, no transfer tax** — nobody, including the team, can freeze a wallet or move someone else's balance,
- a **participation-based utility layer** (Kadak Points reputation, Chai Panchayat governance polls) that never requires buying the token,
- and a policy of never fabricating partnerships, users, media coverage, or price predictions — see [`LEGAL_NOTES.md`](LEGAL_NOTES.md).

Read [`docs/BRAND.md`](docs/BRAND.md) for the brand/lore, [`TOKENOMICS.md`](TOKENOMICS.md) for the full token design, and [`DECISIONS.md`](DECISIONS.md) for why every major choice was made the way it was.

## Repository map

| Path | Contents |
|---|---|
| `blockchain/` | Solidity contracts, Hardhat tests, deploy/verify scripts (Polygon Amoy testnet) |
| `website/` | The full public website (plain HTML/CSS/JS, no build step) |
| `research/` | Market, regulatory, and blockchain-selection research, all cited |
| `docs/` | Brand identity and other supporting documentation |
| `community/` | Telegram/Discord structure, rules, moderation, events, rewards |
| `marketing/` | Strategy, style guide, content calendars, meme/video content |
| `PR/` | Media kit, press releases, journalist outreach, FAQ |
| `social/` | Platform-specific draft content (X, Instagram, YouTube, Reddit) |
| `security/` | Supplementary security material (see also root `SECURITY.md`) |
| `.github/` | CI workflows, issue/PR templates |

Root planning documents: [`ROADMAP.md`](ROADMAP.md) · [`TOKENOMICS.md`](TOKENOMICS.md) · [`SECURITY.md`](SECURITY.md) · [`LEGAL_NOTES.md`](LEGAL_NOTES.md) · [`MARKETING_PLAN.md`](MARKETING_PLAN.md) · [`PR_PLAN.md`](PR_PLAN.md) · [`COMMUNITY_PLAN.md`](COMMUNITY_PLAN.md) · [`PROJECT_STATUS.md`](PROJECT_STATUS.md) · [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`DEPLOYMENT.md`](DEPLOYMENT.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`CHANGELOG.md`](CHANGELOG.md) · [`DECISIONS.md`](DECISIONS.md)

## Quickstart — smart contracts

```bash
cd blockchain
npm install
npm test          # 38 tests, all passing
npm run compile
```

See [`blockchain/README.md`](blockchain/README.md) for testnet deployment and verification steps (testnet only — this repo has no mainnet deployment path; see the Mainnet Gate in `ROADMAP.md`).

## Quickstart — website

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Security issues: see [`SECURITY.md`](SECURITY.md) for private reporting instructions — please don't open a public issue for a vulnerability.

## Principles this project holds itself to

Never fabricate partnerships, investors, endorsements, users, trading volume, or media coverage. Never promise or predict price appreciation or guaranteed returns. Never hide a contract mechanism that could hurt holders. Full detail: [`LEGAL_NOTES.md`](LEGAL_NOTES.md) and [`marketing/strategy/style-guide.md`](marketing/strategy/style-guide.md).
