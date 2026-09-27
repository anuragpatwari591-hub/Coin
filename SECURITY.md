# Security Policy — ChaiCoin ($CHAI)

## Reporting a vulnerability

If you find a security issue in this repository (smart contract, website, backend, or infrastructure config), please **do not** open a public GitHub issue. Instead:

1. Open a private security advisory via GitHub's "Report a vulnerability" feature on this repository, or
2. If that is unavailable, contact the maintainer through a private channel listed on the project website's Community page once it is live.

We will acknowledge reports and, once a fix is available, credit the reporter (with permission) in `CHANGELOG.md`. This project has no bug-bounty budget at this stage; recognition, not payment, is what we can currently offer, and we say so plainly rather than implying otherwise.

## Threat model

| Asset | Threat | Mitigation |
|---|---|---|
| Smart contract token supply | Hidden mint function inflating supply | No mint function exists post-deployment; full supply minted once in constructor; verifiable in published source (`blockchain/contracts/ChaiCoin.sol`) |
| Holder balances | Owner-gated function moving/freezing balances (rug pull) | Contract has no pause, no blacklist, no forced-transfer function of any kind; see `TOKENOMICS.md` §4 |
| Contract ownership | Single private key controlling privileged functions | Ownership transferred to a multisig (Gnosis Safe, ≥2-of-3) before any real liquidity is added; deployer key discarded of privilege immediately after setup |
| Team/Community allocations | Early unlock / no vesting | Team allocation locked in a non-revocable vesting contract (3-month cliff, 12-month total); Community allocation released only in documented tranches tied to public announcements |
| Liquidity | Rug pull via LP token withdrawal | LP tokens time-locked via a third-party locker once real liquidity is added (post human approval); lock contract/address published |
| Website/frontend | XSS, dependency vulnerabilities, secret leakage in client bundle | No secrets in frontend code (see `.env.example` policy below); dependency updates tracked via GitHub Dependabot (`.github/`); standard framework escaping used, no `dangerouslySetInnerHTML`/`v-html` with unsanitized input |
| API/backend (if/when built) | Injection, auth bypass, secret leakage | Parameterized queries only; secrets via environment variables, never committed; input validation at all external boundaries |
| Repository secrets | Committing private keys, seed phrases, API secrets | `.gitignore` blocks `.env*` (except `.env.example`), wallet/keystore file patterns, and common secret file names; every `.env.example` contains placeholders only, never real values; pre-push self-check: `git diff --cached` reviewed before any commit that touches config |
| Dependency supply chain | Malicious/compromised npm package | Lockfiles committed once dependencies are installed; `npm audit` / Dependabot alerts reviewed before merging dependency bumps |

## What we do NOT claim

- We do not claim the smart contract is "unhackable" or "100% secure." No software is.
- We have not (yet) commissioned a professional third-party audit — this is disclosed on the website's Risks page and in `LEGAL_NOTES.md`. If/when a budget exists for an audit, it will be documented here with the auditor's name and report link.
- Community members should treat this, and any experimental token, as high-risk, and never invest more than they can afford to lose.

## Secret management rules (binding for all contributors)

1. No private key, seed phrase, password, or API secret is ever committed to this repository, in any branch, at any time.
2. Every component that needs secrets ships a `.env.example` with placeholder values and documentation of what each variable does.
3. `.gitignore` is the enforcement backstop — see root `.gitignore`.
4. If a secret is ever accidentally committed: rotate/invalidate it immediately (treat it as compromised even after a history rewrite), then document the incident under "Incident Log" below.

## Incident response

1. **Detect** — via code review, Dependabot/security alerts, or community report.
2. **Contain** — rotate any exposed credential immediately; if a contract vulnerability, do not add liquidity/pause community activity around the affected feature until assessed.
3. **Assess** — scope what was exposed/affected and who needs to be told.
4. **Communicate** — post a plain-language update in the community hub and on the website; no minimizing language, no silence.
5. **Fix & document** — patch, test, then record the incident and fix in `CHANGELOG.md` and, if it changes the threat model, update this file.

## Incident log
_No incidents recorded as of 2026-09-27._

## Static/security tooling used
- Solidity: OpenZeppelin's audited base contracts used wherever possible instead of custom logic (see `blockchain/contracts/`).
- JS/TS: `npm audit` and GitHub Dependabot alerts (once repository security features are enabled by the repo owner).
- CI runs the test suite on every PR (`.github/workflows/`) — a failing test blocks merge.
