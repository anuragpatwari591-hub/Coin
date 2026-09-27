# India: Virtual Digital Asset (VDA) Regulatory & Compliance Research

Compiled: 2026-09-27. This is **research, not legal advice**. Where professional review is required, this is marked explicitly. Labeling key as in `research/market/meme-token-market-2026.md`.

## 1. Taxation (Income Tax Act — Section 115BBH / 194S)

- **FACT.** Profits from transfer of VDAs are taxed at a flat 30% under Section 115BBH (plus 4% health & education cess), with no deduction allowed except cost of acquisition, and losses cannot be set off against other income or carried forward. [ClearTax](https://cleartax.in/s/cryptocurrency-taxation-guide), [CryptoTimes](https://www.cryptotimes.io/2026/09/21/india-crypto-tax-2026-30-vda-levy-1-tds-stay-as-section-285baa-reporting-goes-live/)
- **FACT.** Section 194S imposes 1% TDS on the full transfer consideration (gross sale value, not net profit). Threshold: ₹50,000/year aggregate for "specified persons" (e.g., individuals without business income below tax-audit turnover limits); ₹10,000/year for everyone else. [ClearTax](https://cleartax.in/s/cryptocurrency-taxation-guide)
- **FACT.** For FY 2025-26 / AY 2026-27, crypto gains are reported under **Schedule VDA** in ITR-2 (capital gains treatment) or ITR-3 (business income treatment). [Kunal Chowdhury](https://www.kunal-chowdhury.com/2026/08/understanding-crypto-taxes-in-india.html)
- **FACT.** A new Section 285BAA reporting duty is now enforceable: prescribed "reporting entities" must report specified crypto-asset transaction information to the Income Tax Department. As of the most recent coverage, there is **no confirmed additional 2% TDS** beyond the existing 1% — claims to that effect circulating online are explicitly disputed by reporting. [CryptoTimes](https://www.cryptotimes.io/2026/09/21/india-crypto-tax-2026-30-vda-levy-1-tds-stay-as-section-285baa-reporting-goes-live/), [International News & Views](https://www.internationalnewsandviews.com/crypto-tax-india-2026-2-percent-tds-claim-vda-rules-409353-2/)
- **PROFESSIONAL LEGAL/TAX REVIEW REQUIRED** before this project, any contributor, or any community member treats this document as their personal tax guidance, and before the project itself undertakes any transaction (e.g., funding a treasury wallet, providing liquidity) that could constitute a "transfer" under these sections.

## 2. Anti-Money-Laundering / FIU-IND (PMLA)

- **FACT.** Since a March 7, 2023 Ministry of Finance notification, entities providing VDA-related services are "reporting entities" under PMLA, 2002. [Legal500](https://www.legal500.com/developments/thought-leadership/the-requirement-of-fiu-ind-registration-and-its-ramifications-for-the-virtual-digital-asset-industry/)
- **FACT.** A July 4, 2024 notification mandates that all VDA service providers (domestic *and offshore* serving Indian users) register with FIU-IND. [Legal500](https://www.legal500.com/developments/thought-leadership/the-requirement-of-fiu-ind-registration-and-its-ramifications-for-the-virtual-digital-asset-industry/)
- **FACT.** The operative registration/AML-CFT framework has been revised multiple times, most recently via guidelines dated January 8, 2026, and a September 15, 2025 circular describing registration as requiring in-person review, cybersecurity audit material, and live compliance-system demonstrations. [CryptoSlate](https://cryptoslate.com/crypto-laws/india-fiu-ind-aml-cft-guidelines-vda-service-providers/), [Legal500](https://www.legal500.com/developments/thought-leadership/the-requirement-of-fiu-ind-registration-and-its-ramifications-for-the-virtual-digital-asset-industry/)
- **INTERPRETATION.** This project, as currently scoped (a self-custody token with a community treasury, no exchange, no custodial wallet service, no fiat on/off ramp, no swap/brokerage service operated by us), does **not** itself operate as a "VDA service provider" under the plain description above. **This interpretation is not a legal conclusion.** If the project ever operates anything resembling a custodial wallet, an internal exchange/swap feature, or acts as an intermediary moving VDAs on behalf of others, **PROFESSIONAL LEGAL REVIEW REQUIRED** before launch of that feature.

## 3. Advertising (ASCI Guidelines for VDAs)

- **FACT.** ASCI's guidelines for advertising VDAs and linked services took effect April 1, 2022 and apply to all VDA-related ads published after that date. [Mondaq](https://www.mondaq.com/india/fin-tech/1178270/virtual-digital-assets-complying-with-the-asci-guidelines)
- **FACT — mandatory disclaimer.** All VDA ads must carry: *"Crypto products and NFTs are unregulated and can be highly risky. There may be no regulatory recourse for any loss from such transactions."* [Mondaq](https://www.mondaq.com/india/fin-tech/1178270/virtual-digital-assets-complying-with-the-asci-guidelines)
- **FACT — restricted words.** Ads may not use words like "currency," "securities," "custodian," or "depositories," since these terms are associated with regulated products the token is not. [Mondaq](https://www.mondaq.com/india/fin-tech/1178270/virtual-digital-assets-complying-with-the-asci-guidelines)
- **DECISION.** Every public-facing marketing asset produced by this project (website, social posts, PR materials) must carry the ASCI disclaimer verbatim and avoid the restricted vocabulary. This is enforced as a checklist item in `PR/FAQ/` and `marketing/strategy/`.

## 4. Consumer protection / securities-law considerations

- **INTERPRETATION.** No token issued by this project promises returns, profit-sharing, or investment-contract-like features (no staking yield promised in INR/fiat terms, no buy-back guarantee, no "invest and earn" language). This is a deliberate design constraint to stay clear of securities-law grey areas, **not a guarantee that regulators would agree** — **PROFESSIONAL LEGAL REVIEW REQUIRED** before any claim is made that the token is "definitely not a security."

## 5. Compliance checklist derived from this research

- [ ] ASCI disclaimer present on every public marketing asset (website footer, every social post that mentions the token, PR one-pagers).
- [ ] No use of restricted words ("currency," "securities," "custodian," "depositories") in marketing copy.
- [ ] No promises of returns, price appreciation, or guaranteed profit anywhere (README, website, socials, PR).
- [ ] `LEGAL_NOTES.md` links this document and states TDS/30%-tax obligations apply to any individual who transacts, not to the project.
- [ ] No custodial wallet, swap, or exchange feature is built without a prior "PROFESSIONAL LEGAL REVIEW REQUIRED" gate being cleared.
- [ ] Treasury wallet address and multisig signers publicly disclosed (see `TOKENOMICS.md`) to support the "no hidden mechanism" transparency principle, independent of AML status.

## Sources
- [ClearTax — Guide to Crypto Taxes in India 2026](https://cleartax.in/s/cryptocurrency-taxation-guide)
- [CryptoTimes — India Crypto Tax 2026: 30% VDA Levy, 1% TDS Stay as Section 285BAA Reporting Goes Live](https://www.cryptotimes.io/2026/09/21/india-crypto-tax-2026-30-vda-levy-1-tds-stay-as-section-285baa-reporting-goes-live/)
- [International News & Views — No Official 2% Extra TDS Yet](https://www.internationalnewsandviews.com/crypto-tax-india-2026-2-percent-tds-claim-vda-rules-409353-2/)
- [Kunal Chowdhury — Understanding Crypto Taxes in India (2026)](https://www.kunal-chowdhury.com/2026/08/understanding-crypto-taxes-in-india.html)
- [Legal500 — FIU-IND Registration and the VDA Industry](https://www.legal500.com/developments/thought-leadership/the-requirement-of-fiu-ind-registration-and-its-ramifications-for-the-virtual-digital-asset-industry/)
- [CryptoSlate — India FIU-IND AML/CFT Guidelines for VDA Service Providers](https://cryptoslate.com/crypto-laws/india-fiu-ind-aml-cft-guidelines-vda-service-providers/)
- [Mondaq — Virtual Digital Assets: Complying With The ASCI Guidelines](https://www.mondaq.com/india/fin-tech/1178270/virtual-digital-assets-complying-with-the-asci-guidelines)
