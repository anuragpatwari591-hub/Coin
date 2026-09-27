# ChaiCoin Website

Plain static HTML/CSS/JS site — no build step, no framework, no dependencies. This is deliberate: it keeps the site trivially reviewable, fast, and cheap to host (fits the ~₹3,000–5,000 project budget) on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

## Structure
- `index.html`, `about.html`, `lore.html`, `tokenomics.html`, `roadmap.html`, `utility.html`, `contract.html`, `community.html`, `faq.html`, `risks.html`, `documentation.html`, `disclaimer.html` — the pages required by the master project brief.
- `css/style.css` — shared stylesheet using the brand palette from `docs/BRAND.md`.
- `js/main.js` — mobile nav toggle only; the site works fully without JavaScript.

## Content policy
Every page carries the ASCI-mandated disclaimer banner (see `research/regulations/india-vda-compliance.md` §3) and links back to the canonical source documents in the repository root so the website never drifts from `TOKENOMICS.md`, `ROADMAP.md`, etc. When those root documents change, update the corresponding page here in the same commit.

## Local preview
Any static file server works, e.g.:
```
cd website && python3 -m http.server 8000
```
Then open `http://localhost:8000/index.html`.

## Before this goes live
- Replace GitHub links if the repository ever moves/renames.
- Fill in the `contract.html` page with the real verified testnet address once deployed (see `blockchain/README.md`).
- Do not add a "Buy" call-to-action anywhere until Phase 2 (Mainnet Gate) in `ROADMAP.md` is actually cleared and approved.
