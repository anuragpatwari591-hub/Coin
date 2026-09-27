# Roadmap — ChaiCoin ($CHAI)

No dates are promised as guarantees — this is an experimental, volunteer/small-team project with a ~₹3,000–5,000 budget. Sequencing is based on dependency order (e.g., you can't verify a contract before testing it), not calendar commitments.

## Phase 0 — Foundation (this repository's current phase)
- [x] Repository architecture established
- [x] Market, regulatory, and blockchain research completed and cited
- [x] Concept generated (10 options), selected, and documented (ChaiCoin/$CHAI)
- [x] Brand identity defined
- [x] Tokenomics defined (fixed supply, no mint, no tax, vesting)
- [x] Blockchain selected (Polygon PoS / Amoy testnet)
- [ ] Smart contract implemented and unit-tested (in progress)
- [ ] Website built (informational, pre-launch)
- [ ] Community structure (Telegram/Discord docs) defined
- [ ] Marketing, PR, and community-growth plans drafted
- [ ] Security policy and CI in place

## Phase 1 — Testnet
- [ ] Deploy `ChaiCoin.sol` and `ChaiVesting.sol` to Polygon Amoy testnet
- [ ] Verify contract source on the testnet block explorer
- [ ] Test transfers, approvals, burns, and vesting release end-to-end with real (testnet) wallets
- [ ] Test website against the deployed testnet contract (read-only info, no real funds)
- [ ] Open the Telegram/Discord community hub for real (human) participants, clearly labeled as testnet-stage
- [ ] Run at least one real community "Chai Break" event and one meme contest with genuine (not fabricated) participants
- [ ] Document all testnet results, including anything that breaks

## Phase 2 — Pre-mainnet review ("Mainnet Gate")
Mainnet deployment requires ALL of the following to be true, then explicit human approval — see master project brief §27. This project will not deploy to mainnet, add real liquidity, or execute any real-money transaction without that explicit approval, however complete this checklist is.

**Technical**
- [ ] Contract fully tested (unit tests passing, edge cases covered)
- [ ] Internal security self-review completed and documented; third-party audit obtained if budget allows (disclosed either way)
- [ ] Contract verified on testnet explorer as a rehearsal
- [ ] Frontend tested against testnet deployment
- [ ] No backend components deployed with unreviewed secrets/config

**Economic**
- [ ] Tokenomics published (`TOKENOMICS.md`) and unchanged from what testnet used, or changes documented with reasons
- [ ] Allocations and vesting terms disclosed
- [ ] Liquidity plan documented (amount, DEX, lock mechanism, lock duration)
- [ ] Treasury multisig created and signers disclosed

**Legal**
- [ ] `research/regulations/india-vda-compliance.md` re-checked for any rule changes since original research date
- [ ] `LEGAL_NOTES.md` professional-review gates cleared for any action being taken (see LEGAL_NOTES.md §6)
- [ ] All marketing assets pass the ASCI-disclaimer/restricted-word checklist

**Community**
- [ ] Website live with all required pages (see `website/`)
- [ ] Community hub live with rules, onboarding, and active (real) moderation
- [ ] Documentation (this repo) publicly accessible and current

## Phase 3 — Post-launch (only after Phase 2 approval and execution)
- [ ] Launch dashboard (holder count, on-chain treasury balance, community metrics — all pulled from real, verifiable sources)
- [ ] Weekly report cadence: what happened / why / what worked / what failed / what changes next
- [ ] Ongoing security monitoring
- [ ] Growth loops (referrals, quests, contests) run continuously, always with real, disclosed mechanics

## Explicitly out of scope unless separately approved
- Presale / public sale of any kind
- Paid advertising spend
- Any custodial wallet or internal exchange feature
- Any claim of guaranteed returns, at any phase
