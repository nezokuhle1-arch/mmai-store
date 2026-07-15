# AGENTS.md

## Cursor Cloud specific instructions

MMAI is a single frontend web app: **Vite + React + React Router**. Products are
served from mock data (`src/data/products.json`); there is no backend service to
run. Shopify (commerce) and Supabase (identity) are external integrations that
are stubbed until later phases — the app runs fully without them.

Standard commands live in `package.json` (`dev`, `build`, `preview`, `lint`) and
setup is documented in `README.md`. Non-obvious notes:

- **Dev server**: `npm run dev` serves on `http://localhost:5173`. This is the
  only service to run.
- **Env vars are optional for running.** `src/api/supabaseClient.js` only logs a
  console warning when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are unset;
  Home/Shop/Product pages render with mock data regardless. Copy `.env.example`
  to `.env` only when working on Supabase auth features (the `.env` file is
  gitignored and not recreated by the update script).
- **`npm run lint` currently fails**: the repo has no ESLint config file
  (ESLint 8 flat/legacy config is missing), so `eslint .` exits with
  "couldn't find a configuration file". This is a pre-existing repo gap, not an
  environment problem — add an `.eslintrc`/`eslint.config.js` before relying on
  lint.
- Product detail routes use a product `handle` (e.g.
  `/product/oversized-identity-hoodie`); handles come from `products.json`.
