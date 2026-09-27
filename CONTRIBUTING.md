# Contributing to ChaiCoin

Thank you for considering contributing. This is a small, experimental, transparency-first project — please read this before opening a PR.

## Ground rules
- No fabricated claims, ever: no fake partnerships, users, endorsements, price predictions, or guaranteed returns in any content you contribute (docs, marketing copy, code comments).
- No secrets in commits — see `SECURITY.md`. If you accidentally commit one, tell us immediately so it can be rotated, don't just force-push it away.
- Smart-contract changes must come with tests. A PR touching `blockchain/contracts/` without corresponding changes in `blockchain/tests/` will not be merged.
- Marketing/PR/social content must follow `marketing/strategy/style-guide.md` (ASCI disclaimer, no restricted words, no hype language).

## Branches
- `main` — stable, always deployable/publishable.
- `develop` — integration branch for in-progress work (if/when the project scales beyond direct-to-main contributions).
- `feature/*`, `fix/*`, `release/*` — topic branches.

## Workflow
1. Fork or branch.
2. Make your change.
3. For contract changes: `cd blockchain && npm install && npm test` — all tests must pass.
4. For website changes: preview locally (`cd website && python3 -m http.server 8000`) and check it renders correctly at both desktop and mobile widths.
5. Open a PR describing what changed and why. Reference the relevant doc (e.g., `TOKENOMICS.md`, `DECISIONS.md`) if your change affects project decisions — update that doc in the same PR.
6. If your change affects tokenomics, security posture, or brand, add an entry to `DECISIONS.md` and `CHANGELOG.md`.

## Reporting bugs / requesting features
Use GitHub Issues with the provided templates (`.github/ISSUE_TEMPLATE/`). For security vulnerabilities, follow `SECURITY.md` instead of opening a public issue.

## Code style
- Solidity: NatSpec comments on public contracts, prefer OpenZeppelin base contracts over custom logic where one exists.
- JS/tests: match the existing Hardhat/Mocha/Chai style in `blockchain/tests/`.
- Docs/marketing: plain, honest, no hype — see the style guide.
