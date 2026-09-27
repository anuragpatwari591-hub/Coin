# Decision Log

Chronological record of significant project decisions. Newest first. See linked research/docs for full reasoning.

---

### 2026-09-27 — Selected concept: ChaiCoin ($CHAI)
Chosen from 10 generated concepts on non-divisiveness, mascot strength, natural non-speculative utility, international legibility, and buildability at near-zero budget. Full reasoning: `research/concept-selection.md`. Alternatives considered: Jugaad, VadaPav, Filter Coffee, Thela, Adda, Momo, Auto, Masala, Tapri (`research/concepts.md`).

### 2026-09-27 — Selected blockchain: Polygon PoS (testnet: Amoy)
Chosen over Ethereum L1, BNB Chain, Base, and Solana on cost (~$20–50 total vs. $100–2000+ for alternatives), full EVM compatibility (allows OpenZeppelin audited contracts), MetaMask-native wallet support, and mature DEX ecosystem for a future liquidity step. Solana rejected specifically because its non-EVM toolchain (Rust/Anchor) would add real security/testing risk for a first release. Full reasoning: `research/trends/blockchain-comparison.md`.

### 2026-09-27 — Tokenomics: fixed supply, no mint, no tax, no pause/blacklist
Total supply 100,000,000,000 CHAI fixed at deployment via constructor mint only. Explicit anti-honeypot design: no post-deploy mint function, no transfer tax, no owner pause/blacklist capability, no ability for any privileged address to move another holder's balance. Allocation: 40% community/ecosystem, 30% liquidity (not deployed without human approval), 20% treasury (multisig), 10% team (12-month vest, 3-month cliff). Full detail: `TOKENOMICS.md`.

### 2026-09-27 — Utility: reputation + governance layer, not pay-to-win
Utility ("Kadak Points" reputation, "Chai Panchayat" community polls, "Chai Cups" collectible badges) is earned through participation, not purchased with CHAI — avoids making the token's value proposition dependent on speculative buy pressure. Full detail: `TOKENOMICS.md` §5.

### 2026-09-27 — Repository architecture established
Adopted the directory structure specified in the master project brief (blockchain/, website/, tokenomics/, research/, security/, community/, marketing/, PR/, social/, analytics/, docs/, scripts/, tests/, .github/) without modification — research did not surface a reason to deviate.

### 2026-09-27 — Compliance guardrails adopted from India VDA research
Every public marketing asset must carry the ASCI-mandated disclaimer and avoid restricted vocabulary ("currency," "securities," "custodian," "depositories"); no promised returns anywhere; treasury/multisig addresses to be published for transparency once created. Full detail: `research/regulations/india-vda-compliance.md` §5.
