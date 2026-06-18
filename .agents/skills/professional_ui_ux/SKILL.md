---
name: professional_ui_ux
description: "Guidelines and instructions to build premium, professional UI/UX, avoiding generic templates, cookie-cutter layouts, and 'AI slop' aesthetics in web development."
---

# Professional UI/UX & Non-AI-Slop Development Guide

This guide ensures that all UI/UX designs implemented in this repository are premium, functional, and free from the generic design choices typical of unguided AI generation (often termed "AI slop").

## 1. Visual Polish & Color Harmony
*   **Avoid Generic Colors**: Do not use raw primary CSS or Tailwind colors like `bg-blue-500`, `text-red-600`, etc.
*   **Curate Color Palettes**: Use Tailwind v4's modern palette or custom HSL/OKLCH color tokens that align with professional design systems (e.g., slate/zinc neutrals, coupled with a deep indigo, violet, emerald, or amber accent).
*   **Premium Gradients**: If gradients are used, keep them subtle and directional. Avoid noisy, chaotic, or overly saturated multi-color gradients that feel outdated or randomly generated.
*   **Glassmorphism & Shadows**: Use elevation layers cleanly. Combine subtle borders (`border-white/10` or `border-neutral-800`), backdrop blur (`backdrop-blur-md`), and soft shadows to create modern glassmorphic overlays.

## 2. Typography & Hierarchy
*   **Font Selection**: Never use default browser system sans-serif fonts. Configure premium typography (e.g., *Inter*, *Outfit*, *Plus Jakarta Sans*, or *Geist Sans*) in your main layout or Tailwind settings.
*   **Contrast & Readability**: Maintain WCAG AA standard contrast ratios. Never use light gray text on white backgrounds or dark gray on black. Use semantic classes like `text-neutral-100`, `text-neutral-400`, or `text-neutral-500`.
*   **Scale**: Establish a clear typography hierarchy:
    *   Main Heading (H1): Bold, large tracking-tight (`tracking-tight text-3xl md:text-5xl`).
    *   Subheadings (H2, H3): Semi-bold, readable tracking (`text-xl md:text-2xl`).
    *   Body text: Highly legible, line-height matching (`leading-relaxed text-sm md:text-base`).

## 3. Dynamic Interactions (Preventing "Static" AI Designs)
*   **Interactive Hover States**: Every button, link, and card must have a smooth hover transition (`transition-all duration-300 hover:scale-[1.01] hover:brightness-110`).
*   **Focus Rings**: Ensure clear keyboard navigation with customized focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:outline-none`).
*   **Micro-animations**: Use subtle transitions on state changes (e.g., menu toggle, loading states, dropdowns, input field activation).

## 4. Structuring Layouts (Avoiding Cookie-Cutter Layouts)
*   **Purpose-Driven Layout**: Avoid repetitive grid lists of "features" or "cards" that are standard in AI-generated templates.
*   **Asymmetric Grids & Layering**: Break the monotony by layering elements, using asymmetric split sections (e.g., 60/40 or 30/70 grids), and adding organic white space to let elements "breathe."
*   **Real Media vs. Placeholders**: Use custom SVG shapes or high-quality assets. Avoid AI-generated stock illustrations that feel cartoonish or abstractly generic.

## 5. Implementation in Tailwind CSS v4 & Next.js
*   **Clean CSS Files**: Define your design system values (colors, custom borders, fonts) in `src/app/globals.css` or Tailwind configs.
*   **Interactive Components**: Use client-side components (`"use client"`) for rich interactive widgets, ensuring they handle edge cases like loading, empty, and error states gracefully.
