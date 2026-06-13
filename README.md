# MMAI Online Store — Phase 1 Scaffold

Palette: **Slate Noir** · Stack: Vite + React + React Router + Shopify Storefront API + Supabase

This is the Phase 1 foundation. Drop this folder into your project root,
install dependencies, and open in Cursor to continue into Phase 2.

---

## 1. Install dependencies

```bash
npm install
```

## 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in:

- `VITE_SHOPIFY_DOMAIN` / `VITE_SHOPIFY_TOKEN` — from Shopify Admin →
  Settings → Apps and sales channels → Develop apps → create a Storefront API token.
  **Not required for Phase 1–3** — mock data (`src/data/products.json`) is used until Phase 4.

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — from your Supabase
  project → Settings → API. **Required for sign-up/sign-in pages (Phase 2)**.

## 3. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the SQL Editor and run `sql/001_customers_and_barcode.sql`
3. This creates the `customers` table and the trigger that auto-generates
   barcode IDs in the format `MMAI-<Name>-<001>`

## 4. Run the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173`

## 5. Deploy (when ready)

Push to GitHub, then import the repo into [vercel.com](https://vercel.com).
Vercel auto-detects Vite — build command `vite build`, output `dist`.
Add the same environment variables in Vercel's project settings.

---

## What's in this scaffold

```
mmai-store/
├── src/
│   ├── pages/                 — 6 route shells (Home, Shop, Product, Customize, Cart, Checkout)
│   ├── components/
│   │   └── NavBar.jsx          — basic nav, Slate Noir styled
│   ├── context/
│   │   ├── CartContext.jsx     — cart state: items, customization, qty
│   │   └── DropContext.jsx     — active drop + products (mock for now)
│   ├── styles/
│   │   ├── tokens.css          — Slate Noir design tokens (THE palette)
│   │   ├── reset.css
│   │   └── typography.css      — Playfair Display / DM Sans / DM Mono
│   ├── api/
│   │   ├── shopify.js          — Storefront API connector (stubs, Phase 4)
│   │   └── supabaseClient.js   — identity layer: signup, barcode lookup
│   ├── data/
│   │   └── products.json       — 4 mock products with customization options
│   ├── hooks/                  — (empty, Phase 2+)
│   └── utils/                  — (empty, Phase 2+)
├── sql/
│   └── 001_customers_and_barcode.sql  — run in Supabase SQL editor
├── .env.example
└── package.json
```

---

## Design tokens — Slate Noir (no gold)

| Token | Hex | Role |
|---|---|---|
| `--color-offwhite` | `#EDEDEB` | page backgrounds, light surfaces |
| `--color-steel` | `#B0B4BC` | borders, dividers, secondary text |
| `--color-slate` | `#6A7180` | muted UI, placeholders |
| `--color-navy-mid` | `#2E3344` | hover states, cards on dark |
| `--color-navy-deep` | `#171C2B` | primary dark backgrounds (nav, hero) |
| `--color-void` | `#09090F` | deepest contrast, CTAs |

Hierarchy comes from **contrast and inversion**, not an accent color —
e.g. a primary button is off-white text on void-black, or the reverse.

Fonts: `Playfair Display` (display/headings), `DM Sans` (UI/body),
`DM Mono` (barcodes, identity tags) — loaded via `typography.css`.

---

## Architecture recap

```
React frontend (this app, deployed on Vercel)
   ├── Shopify Storefront API  → products, cart, checkout, payments
   └── Supabase                → customer identity, barcode IDs, membership tiers
```

- **Shopify** = commerce backend (you manage products/orders in Shopify Admin)
- **Supabase** = identity backend (sign up generates a unique `MMAI-Name-001`
  barcode via a database trigger — see `sql/001_customers_and_barcode.sql`)
- Customization data (name badge, quote, placement, barcode) attaches to
  Shopify cart line items as **attributes** (see `addToCart()` in `shopify.js`)

---

## Next: Phase 2

With this scaffold running, the next step is building out the real UI for
each page — Homepage hero, product grid, product detail with size selector,
and the cart drawer — using the Slate Noir tokens already in place.
