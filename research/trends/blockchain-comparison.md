# Blockchain Selection Research

Compiled: 2026-09-27. Budget constraint: ₹3,000–5,000 total (~$35–58 USD at ~₹86/USD) for the entire experimental phase, covering deployment, verification, and initial (non-real, testnet) liquidity rehearsal.

## 1. Candidates compared (5+ as required)

| Chain | Est. deploy+launch cost (FACT/ESTIMATE) | EVM-compatible | Wallet support | DEX/liquidity ecosystem | Dev tooling maturity | Notes |
|---|---|---|---|---|---|---|
| Ethereum L1 | **FACT** $500–2,000+ [7BlockLabs](https://www.7blocklabs.com/blog/cost-to-deploy-smart-contract-and-how-much-does-it-cost-to-deploy-a-smart-contract-in-2026) | Yes (native) | Universal (MetaMask, Trust, Rainbow, etc.) | Deepest (Uniswap et al.) | Most mature | Cost alone rules this out for a ₹3–5k budget |
| BNB Chain (BSC) | **ESTIMATE** $100–300 total launch cost [ERC20Fees.com](https://www.erc20fees.com/erc20-fees-comparison/) | Yes | Universal | PancakeSwap, deep | Mature, huge meme-coin precedent (SHIB derivatives, Floki) | Higher per-tx cost than Polygon/L2s; reputationally saturated with meme-coin volume (good discovery, also good camouflage for scams — must lean hard on our transparency docs) |
| Base (Coinbase L2) | **ESTIMATE** $50–200 total [ERC20Fees.com](https://www.erc20fees.com/erc20-fees-comparison/) | Yes (OP-Stack EVM) | Coinbase Wallet native, MetaMask via RPC add | Uniswap v3, Aerodrome | Mature, currently trending for meme launches | Newer, less India-specific exchange/on-ramp familiarity |
| Polygon PoS | **ESTIMATE** $20–50 total; gas typically **under $0.002/tx** [7BlockLabs](https://www.7blocklabs.com/blog/cost-to-deploy-smart-contract-and-how-much-does-it-cost-to-deploy-a-smart-contract-in-2026), [Medium — Ankita](https://medium.com/@ankitacode11/unraveling-gas-fees-a-comprehensive-guide-to-transaction-costs-across-blockchains-72509f649811) | Yes (native EVM) | Universal (MetaMask default network, Trust, etc.) | QuickSwap, Uniswap v3 on Polygon, SushiSwap | Very mature (Hardhat/Foundry/OpenZeppelin all first-class) | Cheapest full-EVM option; widely supported by Indian exchanges/wallets for on/off-ramp familiarity |
| Solana | **ESTIMATE** $40–145 depending on tooling [soltokencreator.io](https://www.soltokencreator.io/blog/cheapest-blockchain-create-token), sub-cent per tx [7BlockLabs](https://www.7blocklabs.com/blog/cost-to-deploy-smart-contract-and-how-much-does-it-cost-to-deploy-a-smart-contract-in-2026) | No (SPL, not EVM) | Phantom, Solflare | Raydium, Jupiter — very deep, meme-coin-native (BONK precedent) | Mature but a different stack (Rust/Anchor, not Solidity) | Would require the team to build/test in a second, unfamiliar toolchain, raising real (not just cost) risk for a security-first, transparent, testable first release |

## 2. Comparison criteria

- **Gas/deployment cost** — must fit comfortably inside ₹3–5k with room for testnet iteration.
- **Ecosystem & liquidity** — needs a real DEX so a future (human-approved) liquidity step is possible without switching chains.
- **Wallet support** — must work with wallets an ordinary Indian retail user already has (MetaMask is the practical default).
- **Developer tooling** — Hardhat/Foundry + OpenZeppelin give us audited, battle-tested ERC-20 primitives and a mature test/CI story (`blockchain/tests`), which directly serves the "tested, documented, secure" requirement.
- **Security track record** — an ecosystem with widely-used, heavily-reviewed standard libraries (OpenZeppelin) beats a novel or less-audited path for a project whose stated first principle is being defensible to security researchers.
- **Complexity/time-to-first-testnet-deploy** — lower complexity means we spend the limited budget/time on testing and documentation, not on infrastructure debugging.

## 3. Decision

**Selected: Polygon PoS**, using Polygon Amoy testnet for all pre-mainnet work.

**Why:**
1. Lowest realistic total cost among full-EVM options (**ESTIMATE** $20–50 vs. $100–300+ for BSC/Base), leaving budget headroom for the testnet-rehearsal-liquidity step and any verification service costs.
2. Full EVM compatibility means we can use OpenZeppelin's audited ERC-20 contracts as a base rather than writing token mechanics from scratch — directly reduces smart-contract risk.
3. MetaMask (already familiar to most retail crypto users, including in India) works natively; no second wallet app needed for testers.
4. Mature DEX ecosystem (QuickSwap, Uniswap v3 on Polygon) means a future, human-approved liquidity step doesn't require a chain migration.
5. Explicitly rejected Solana despite its low cost and strong meme-coin precedent, because it requires a second, unfamiliar toolchain (Rust/Anchor) — that raises real security/testing risk for a first release under the "test everything, no shortcuts" mandate, which outweighs its cost/culture advantages.
6. Explicitly rejected Ethereum L1 on cost alone (would consume the entire budget on gas for a single deployment, leaving nothing for iteration or the rehearsal-liquidity step).
7. BNB Chain and Base remain documented fallbacks if Polygon testnet work surfaces a blocking issue (e.g., tooling regression); no code in this repo is Polygon-only at the application layer (contracts are portable to any EVM chain via `.env`-configured RPC).

This decision is recorded in `DECISIONS.md` as the canonical source; this file is the supporting research.

## Sources
- [7BlockLabs — How Much Will It Cost to Deploy a Smart Contract in 2026?](https://www.7blocklabs.com/blog/cost-to-deploy-smart-contract-and-how-much-does-it-cost-to-deploy-a-smart-contract-in-2026)
- [ERC20Fees.com — ERC20 Fees Comparison](https://www.erc20fees.com/erc20-fees-comparison/)
- [Medium — Ankita, Unraveling Gas Fees](https://medium.com/@ankitacode11/unraveling-gas-fees-a-comprehensive-guide-to-transaction-costs-across-blockchains-72509f649811)
- [soltokencreator.io — Cheapest Blockchain to Create a Token](https://www.soltokencreator.io/blog/cheapest-blockchain-create-token)
