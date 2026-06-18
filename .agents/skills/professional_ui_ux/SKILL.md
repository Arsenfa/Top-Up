---
name: professional_ui_ux
description: "Guidelines and instructions to build premium, professional UI/UX, avoiding generic templates, cookie-cutter layouts, and 'AI slop' aesthetics in web development."
---

# Professional UI/UX & Anti-AI-Slop Development Guide

This guide ensures that all UI/UX designs implemented in this repository are premium, functional, and free from the generic design choices typical of unguided AI generation (often termed "AI slop").

---

## 0. BRIEF INFERENCE (Read the Room First)

Before writing code, **infer what the user actually wants**. Most LLM design output is bad because the model jumps to a default aesthetic instead of reading the room.

### 0.A Read these signals first
1. **Page kind** - landing (SaaS / consumer / agency / event), portfolio, redesign (preserve vs overhaul), editorial.
2. **Vibe words** - "minimalist", "calm", "Linear-style", "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful", "dark tech".
3. **Audience** - B2B procurement vs. design-conscious consumer vs. recruiter scanning a portfolio. The audience picks the aesthetic, not your default taste.
4. **Brand assets** - logo, color, type, photography (e.g. Paper design system: light editorial theme with burnt sienna accent `#C2410C`).
5. **Quiet constraints** - accessibility, trust-first commerce.

### 0.B Output a one-line "Design Read" before generating
Before writing code, state in one line: 
**"Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <design system or aesthetic family>."**

### 0.C Anti-Default Discipline
Do not default to: AI-purple gradients, centered hero over dark mesh, three equal feature cards, generic glassmorphism, infinite-loop micro-animations everywhere, Inter + slate-900. Reach past them deliberately based on the design read.

---

## 1. THE THREE DIALS (Core Configuration)

Set three dials to gate every layout, motion, and density decision:

*   **`DESIGN_VARIANCE`** (1 = Perfect Symmetry, 10 = Artsy Chaos) - Default: **8**
*   **`MOTION_INTENSITY`** (1 = Static, 10 = Cinematic / Physics) - Default: **6**
*   **`VISUAL_DENSITY`** (1 = Art Gallery / Airy, 10 = Cockpit / Packed Data) - Default: **4**

### 1.A Dial Inference Chart
| Signal / Vibe | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| "minimalist / clean / calm / editorial / Linear-style" | 5-6 | 3-4 | 2-3 |
| "premium consumer / Apple-y / luxury / brand" | 7-8 | 5-7 | 3-4 |
| "playful / wild / Awwwards / experimental / agency" | 9-10 | 8-10 | 3-4 |
| "landing page / portfolio / marketing site (default)" | 7-9 | 6-8 | 3-5 |
| "trust-first / public-sector / accessibility-critical" | 3-4 | 2-3 | 4-5 |

---

## 2. DEFAULT ARCHITECTURE & CONVENTIONS

### 2.A Stack & Framework
*   **Framework**: Next.js. Keep Server Components (RSC) by default.
*   **RSC Safety**: Wrap global state/providers in `"use client"`.
*   **Interactivity Isolation**: Any component using animations, scroll listeners, or pointer physics must be an isolated leaf with `'use client'` at the top. Server Components render static layouts only.
*   **Styling**: Tailwind CSS v4. Use native `@theme` directives instead of PostCSS configs where appropriate.
*   **Animation**: `motion/react` (formerly `framer-motion`). Use `useMotionValue` or `useScroll` instead of local `useState` for tracking continuous pointer/scroll physics.

### 2.B Icons & Emoji
*   **Allowed Libraries**: `@phosphor-icons/react`, `hugeicons-react`, `@radix-ui/react-icons`, `@tabler/icons-react`. Avoid `lucide-react` unless required. Use a single icon family per project and standardize `strokeWidth` globally.
*   **Emoji**: Do not use emojis in code, markup, or comments unless explicitly requested for a playful/social-native vibe.

### 2.C Responsiveness & Viewports
*   **Viewport Stability**: NEVER use `h-screen` for full-height sections. Use `min-h-[100dvh]` to prevent layout jumping on mobile (Safari address bar).
*   **Grid over Flex-Math**: Use CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`) instead of complex flexbox percentage calculations (`w-[calc(33%-1rem)]`).

---

## 3. DESIGN ENGINEERING DIRECTIVES (Anti-Slop Rules)

### 3.1 Typography & Pairings
*   **Display**: Bold, tracking-tight, large (`text-4xl md:text-6xl tracking-tighter leading-none`).
*   **Body**: Highly legible, line-height matching (`leading-relaxed text-sm md:text-base text-neutral-600 max-w-[65ch]`).
*   **Sans Font Selection**: Do not default to `Inter`. Prefer modern display sans (e.g., *Outfit*, *Plus Jakarta Sans*, *Geist Sans*, *Cabinet Grotesk*, or *Satoshi*).
*   **Serif Discipline**: Serif is discouraged as a default. Use only when the brand identity is genuinely vintage, artisan, or publication-oriented. Avoid `Fraunces` and `Instrument Serif` as defaults.
*   **Emphasis**: Use italic or bold of the **same font family** for emphasis. Do not mix sans and serif families in the same headline.
*   **Italic Descenders**: When italic text has descenders (`y g j p q`), ensure `leading-[1.1]` minimum and add a bottom padding margin (`pb-1`) to prevent clipping.

### 3.2 Color Calibration
*   **Avoid Generic Colors**: Do not use raw primary CSS or Tailwind colors like `bg-blue-500` or `text-red-600`. Use custom HSL/OKLCH color tokens (like the Paper design system's burnt sienna accent `#C2410C` and cream backgrounds).
*   **The Lila Rule**: Avoid the default "AI purple glow" mesh gradient slop. Choose one primary accent color and stick to it.
*   **Color Consistency Lock**: Once an accent color is chosen for a page, use it consistently across all sections. Do not switch accents midway.
*   **Premium-Consumer Palette Ban**: Do not default to warm beige/cream background + brass/clay accent + espresso text for every consumer brief. Rotate palettes (e.g., Cold Luxury: silver-grey + chrome, Forest: deep green + bone + amber).

### 3.3 Layout & Structure
*   **Anti-Center Bias**: Centered Hero sections are avoided when `DESIGN_VARIANCE > 4`. Use Split Screen (50/50), Left-aligned text/right-aligned assets, or asymmetric grid layouts.
*   **Shape Consistency Lock**: Pick one corner-radius scale for the page (e.g., all-sharp radius 0, or all-soft radius 12-16px, or all-pill). Do not mix sharp cards with rounded buttons.
*   **Section-Layout-Repetition Ban**: A landing page with multiple sections must use at least 4 different layout families. Do not stack identical layouts.
*   **Zigzag Alternation Cap**: Alternating left-image/right-text then left-text/right-image zigzag patterns is banal. Max 2 sections in a row with this pattern; break it with a full-width banner, bento grid, or marquee.
*   **Eyebrow Restraint**: Max 1 uppercase/monospace tracking eyebrow label per 3 page sections. The headline alone is usually enough.

### 3.4 Bento Grids
*   **Rhythm & Asymmetry**: Vary bento tile sizes and placements. At least 2-3 cells in a bento grid must have visual variation (e.g., a real image, a clean background color tint, or a subtle pattern).
*   **Bento Cell Count Rule**: A bento grid must contain exactly as many cells as you have content for. Do not leave blank or empty filler cells.

### 3.5 Interactive UI States
*   **Feedback Loops**: Always implement skeletal loaders (no generic circular spinners), beautiful empty states, and inline error states. On `:active` states, use micro-scaling (`scale-[0.98]`) or translations (`-translate-y-[0.5px]`) for tactile feedback.
*   **Button Contrast Check**: Verify button text contrast against its background matches WCAG AA (minimum 4.5:1, or 3:1 for large text).
*   **CTA Button Wrap Ban**: Button text must fit on one line at desktop. Keep labels short (2-3 words max).
*   **No Duplicate CTA Intent**: Do not mix multiple labels for the same action (e.g., "Contact us" and "Get in touch" on the same page). Choose one label and use it consistently.

### 3.6 Image & Visual Asset Strategy
*   **Real Visuals**: A pure-text page is not minimalism. Ensure there are real images where visual elements are needed.
*   **Image Sources**: Use the `generate_image` tool first to create customized mockups, photography, or textures. When using placeholders, use picsum photos with a descriptive seed (`https://picsum.photos/seed/{seed}/{w}/{h}`) or Simple Icons (`https://cdn.simpleicons.org/{slug}/{color}`) for brand logos.
*   **No Div-Based Fake Screenshots**: Do not build fake mockups using generic divs, lines, and boxes. Use a real screenshot, a live mini-component preview, or generated images.

---

## 4. CONTENT DENSITY & COPY SELF-AUDIT

*   **Ruthless Cutting**: Keep section headers short (≤ 8 words) and sub-paragraphs brief (≤ 25 words).
*   **Copy Self-Audit**: Before declaring a task complete, audit all copy. Rewrite strings that are grammatically broken, contain AI-isms (like "delve", "testament", "furthermore"), or sound like a robot trying to be poetic.
*   **No Fake-Precise Numbers**: Do not invent fake metrics (e.g., `98.2%` or `4.1x`) unless they are explicitly provided as mock/example data or real project data.
