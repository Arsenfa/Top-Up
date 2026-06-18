# TopUpKu UI/UX Redesign — PAPER (Light Editorial)

**Date:** 2026-06-19
**Scope:** Fase 1 — halaman publik saja (homepage, game detail + checkout, cek order, order status, header, footer)
**Branch:** `redesign/ui-ux-cleanup`
**Backup:** tarball `_backups/topup-redesign-backup-20260619-002736.tar.gz` + git checkpoint `9c316cf` di `main`

## Goal

Redesign UI/UX agar jauh lebih clean dan tidak terbaca sebagai "AI slop". Responsive & smooth untuk desktop, tablet, dan mobile.

## Root cause "AI slop" saat ini

1. Glassmorphism berlebihan (`.glass` + `backdrop-blur` di mana-mana)
2. Gradient text di semua heading
3. Glow blobs / radial blur di background hero
4. Neon chip warna per-kategori
5. Universal `card-hover` (scale + translateY)
6. Framer-motion berlebihan (ticker, stagger, entrance tiap section)
7. Dot-grid background pattern
8. `uppercase tracking-widest` eyebrow labels di tiap section

## Design decisions

- **Palet:** PAPER (light editorial) — warm off-white `#FAF8F5`
- **Text ink:** near-black `#17181C` (bukan pure black)
- **Aksen:** Burnt Sienna `#C2410C` (CTA, link, focus ring saja)
- **Semantic:** deep/sunken versions — success `#15803D`, warning `#B45309`, danger `#B91C1C`, info `#1D4ED8`

## Color tokens

```css
:root {
  --bg-primary:   #FAF8F5;
  --bg-secondary: #FFFFFF;
  --bg-tertiary:  #F4F1EC;
  --bg-overlay:   #FFFFFF;
  --border-color:  #E8E5DF;
  --border-subtle: #F0EDE7;
  --border-strong: #D6D2CA;
  --text-primary:   #17181C;
  --text-secondary: #52525B;
  --text-muted:     #8B8B92;
  --foreground:     #17181C;
  --background:     #FAF8F5;
  --accent:       #C2410C;
  --accent-hover: #9A3412;
  --accent-light: #FED7AA;
  --accent-dim:   rgba(194, 65, 12, 0.08);
  --success: #15803D;
  --warning: #B45309;
  --danger:  #B91C1C;
  --info:    #1D4ED8;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
}
```

## Typography

- Sans: Inter; Display: Plus Jakarta Sans (dipertahankan)
- h1: `clamp(2rem, 4vw, 3rem)` 700 -0.02em (solid ink, NO gradient)
- h2: 1.5–2rem 700
- h3: 1.125rem 600
- body: 15px / 1.65 / 400
- caption: 13px / 1.5 / 500 text-secondary
- Eyebrow: `text-xs font-semibold text-secondary` (NO uppercase tracking-widest)

## Spacing & container

- 8px base scale: 4/8/12/16/24/32/48/64/96
- Section padding: `py-16 sm:py-24`
- Container: `max-w-6xl` (lebih fokus dari max-w-7xl)

## What gets removed

- `.glass`, `.glass-sm`, `.glass-strong` → flat surface + border 1px
- `.gradient-text`, `.gradient-text-amber`, `.gradient-bg-primary`
- Glow blobs, dot-grid background, `card-hover` scale animation
- Framer-motion: ticker, stagger children, universal entrance → keep only for search dropdown, modal, state transitions
- Neon category chips → single neutral chip + text label
- `section-label` pill → plain eyebrow text

## What gets kept

- Inter + Plus Jakarta Sans fonts
- Checkout 4-step stepper flow (logic intact)
- Midtrans payment integration (unchanged)
- Server actions, prisma, routing, API routes (zero logic changes)

## Per-page changes

| Page | Changes |
|------|---------|
| Header | Flat `bg-primary/80` + border-b hairline on scroll, no blur/glow. Keep logo & nav. Mobile drawer simplified |
| Homepage Hero | Remove dot-grid, glow blob, featured-stack carousel, live ticker. 2-col: copy left, stat strip right. Flat search |
| Stats section | Flat number cards |
| Game grid | Flat white cards + 1px border. Hover: border → accent, no scale. No stagger |
| Why choose / payment / testimonials / FAQ / CTA | Flat cards, hairline borders, plain eyebrows |
| Game detail + checkout | Stepper kept, cards flat, nominal buttons flat |
| Cek order | Simple flat form |
| Order status | Status badges with deep semantic colors |
| Footer | Flat, remove value-props glass strip, simple 4-col links |

## Responsive & smoothness

- Mobile-first breakpoints: sm 640, md 768, lg 1024, xl 1280
- All transitions: `transition-colors duration-200` (cheap, GPU-friendly)
- No layout-thrashing animations (transform/opacity only where needed)
- Touch targets ≥ 40px on mobile
- Admin panel & auth pages — out of scope (Fase 2)
