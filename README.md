# EasyOffice Website

## Project

EasyOffice website rebuild.

## Current Phase

Phase 2 — Complete Frontend Development (mock/static data, Bahasa Indonesia).

No CMS, page editor, booking system, or payment is implemented yet.

## Technology

- Next.js (App Router)
- React
- TypeScript (strict mode)
- Tailwind CSS
- ESLint
- Poppins (`next/font/google`)
- Payload CMS — planned (Phase 3)
- PostgreSQL — planned (Phase 3)
- Puck Editor — planned (Phase 4)

## Run locally

```bash
npm install
npm run dev
```

Additional scripts:

```bash
npm run lint
npm run build
```

## Current scope

Phase 2 provides the full public frontend with mock data in
`lib/data/mock-data.ts`:

- Routes: `/`, `/layanan/[service]`,
  `/layanan/[service]/[location]` (VO × Bandung/Jakarta/Bekasi,
  Coworking × Bandung, Meeting Room × Bandung), `/promo`,
  `/tentang-kami`, `/kontak`, plus `not-found`
- Old `/virtual-office`, `/coworking-space/*`, `/meeting-room/*`
  redirect permanently to their `/layanan` equivalents
- Sections: header + Layanan dropdown + mobile nav, hero, breadcrumbs,
  location selector, services, location cards, pricing, facilities,
  comparison table, testimonials, FAQ accordion,
  promos, WhatsApp CTA, footer, floating WhatsApp button
- All CTAs link to WhatsApp via `lib/whatsapp.ts` with per-location
  sample numbers (Bandung `...7890`, Jakarta `...7891`,
  Bekasi `...7892` — replace before launch)
- Prices, promos, testimonials, addresses, and contact details are
  SAMPLE data, each marked in code and UI

Phase 1 provided:

- Next.js + App Router + TypeScript + Tailwind + ESLint
- Poppins font loading in `app/layout.tsx`
- `@/*` path alias
- Brand tokens (Navy `#0A1750` + White `#FFFFFF`)
  as Tailwind v4 `@theme` variables in `app/globals.css`.
  Gold is NOT a brand color. Neutral grays use Tailwind defaults.
- Folder architecture (`components/`, `lib/`, `types/`, `payload/`, `puck/`, `public/images/`)
- `.env.example` placeholders for future integrations
- Empty architectural placeholders for `payload/` and `puck/`
  (NOT implemented — Phases 3 and 4)
