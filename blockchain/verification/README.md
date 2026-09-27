# Contract verification

"Verified source" means a block explorer (here, Polygonscan for Amoy —
https://amoy.polygonscan.com) has compiled the exact Solidity source in
this repository with the exact compiler version and settings used at
deployment, and confirmed the resulting bytecode matches what is actually
deployed at the contract's address on-chain.

Once verified, anyone — not just this team — can open the contract's page
on the explorer and read the real, human-readable source directly,
without trusting any claim made about it elsewhere (a README, a tweet, a
website). They can confirm for themselves things like:

- There is no `mint()` function anywhere in the deployed code, so the
  100,000,000,000 CHAI total supply is provably fixed.
- There is no pause switch, blacklist, or owner-only function that can
  move a holder's balance without their signature.
- There is no transfer tax / fee-on-transfer logic.
- The vesting contract has no clawback/revoke function.

This is a core part of ChaiCoin's anti-honeypot, transparency-first design
per `TOKENOMICS.md` §4: "Full contract source is published and intended
to be verified on the relevant block explorer before any public
announcement calls it 'live.'" Run `npm run verify:amoy` (see
`../README.md`) after deployment to perform this step.
