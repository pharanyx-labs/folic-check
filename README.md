# Folic-Alert

A mobile-first web app for checking whether a UK food product likely contains added folic acid under the new
mandatory fortification rules (full compliance 13 Dec 2026). Search by product name or barcode, get an
evidence-based verdict with the exact ingredient text that drove it, and personalize guidance to your own risk
profile. General information only — not medical advice.

## Features

- Product search (name or barcode) and camera barcode scanning, backed by the [Open Food Facts](https://world.openfoodfacts.org) API
- A rules-based, unit-tested classifier (`src/domain/classifier`) that explains its evidence rather than asserting a bare verdict
- Personalized guidance from a stored risk profile (age band, pregnancy/TTC, B12 issues, adenoma history), with multi-profile support for a household
- Safe-foods browser, label-reading tips, and a balanced policy/science page with a fortification timeline
- Side-by-side product comparison, a recipe risk checker, a daily intake tracker, and printable reports
- Installable PWA with offline support for the app shell and safe-foods reference
- Dark mode, keyboard-accessible, mobile-first throughout

## Development

Requires Node.js 22+.

```bash
npm install
npm run dev       # start the dev server
npm run test      # run the Vitest suite
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Known limitations

- **Open Food Facts is called directly from the browser.** Browsers cannot set a custom `User-Agent` header, so
  OFF's request-identification best practice can't be fully honored client-side. If rate-limiting or abuse
  becomes an issue, the documented upgrade path is a small serverless proxy (Cloudflare Worker/Netlify Function)
  that forwards requests with a proper `User-Agent` — not needed for the current scale of this app.
- **Product data is crowd-sourced and can lag real-world labels**, especially during the fortification rollout.
  Always check the physical product label before making a decision.
- **The classifier is a heuristic**, not a legal or medical determination. It reads ingredient text for known
  UK labelling phrases; unusual phrasing, translated labels, or incomplete Open Food Facts entries can result in
  an `unknown` or `incomplete_data` verdict rather than a wrong one — by design, it is built to hedge rather than
  guess.

## Deployment

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main` (tests must pass before the
build runs). In the repo's Settings → Pages, set Source to "GitHub Actions". The app uses `HashRouter`, so no
server-side rewrite rules are needed for deep links.

## Data attribution

Product data © [Open Food Facts](https://world.openfoodfacts.org) contributors, [Open Database License](https://opendatacommons.org/licenses/odbl/).
