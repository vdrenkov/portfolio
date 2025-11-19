# Valentin Drenkov — Developer Portfolio

Source code for [vdrenkov.dev](https://vdrenkov.dev), a handcrafted single-page portfolio that highlights projects, experience, and research interests across Java, Spring, JavaScript, React, and blockchain.

## Overview

The site is a static bundle (HTML, CSS, vanilla JS) optimized for GitHub Pages. It focuses on a semantic content hierarchy, fast navigation, accessible interactions with or without JavaScript, and polished visuals driven entirely by modern CSS features.

## Features

### Navigation & Scrolling

- Sticky header that adapts to viewport changes using `ResizeObserver` (with a throttled resize fallback).
- Each in-page anchor defines its own `scroll-margin-top`, and the JavaScript layer reads that exact computed value before scrolling. This ensures every section (especially contrast panels) lands with a comfortable gap beneath the header instead of relying on a single hard-coded offset.
- Smooth scrolling respects `prefers-reduced-motion`; when reduced motion is enabled, the page falls back to instant jumps without layout shifts.
- Mobile navigation preserves accessibility: the hamburger control keeps `aria-expanded` state in sync, and `.no-js` users see the menu by default.

### Visual System

- All content sections (projects, experience, skills, education) reuse the same “contrast panel” treatment for consistency.
- CSS custom properties govern spacing, typography, elevation, and gradients; swapping a token propagates through the entire layout.
- Responsive grids scale from large desktop layouts down to single-column stacks with minimal overrides.
- Subgrid is used where available for the education cards, with safe fallbacks when the browser lacks support.

### Meta & Performance

- Comprehensive SEO/social metadata (description, canonical URL, Open Graph, Twitter, image alt text) for rich previews.
- Single CSS/JS payloads plus preconnect hints keep requests minimal; icons rely on inline SVGs or emoji to avoid extra downloads.

## Tech Stack

- **Markup:** Semantic HTML5 with landmark elements and accessible navigation labels.
- **Styling:** Single `styles.css` file using CSS custom properties, Grid, Flexbox, subgrid fallbacks, and responsive media queries.
- **Behavior:** `script.js` manages sticky-header measurements, computed scroll offsets per target, reduced-motion handling, equalized card headers, and mobile nav toggling.
- **Tooling:** No build step required; the repo deploys directly to GitHub Pages.

## Project Structure

```text
.
├── index.html          # Page content and metadata
├── styles.css          # Tokens, layouts, components, and media queries
├── script.js           # Sticky header logic, smooth scroll, helpers
├── public/
│   ├── favicon.ico
│   └── dropdown-menu-icon.svg
├── CNAME               # Custom domain configuration for GitHub Pages
├── README.md
└── .gitignore
```

## Accessibility & UX Notes

- Navigation uses semantic lists with `aria-label="Primary"` and remains usable without JavaScript thanks to the `.no-js` class that reveals the menu by default.
- Interactive emoji/SVG icons either include visible labels or are marked `aria-hidden="true"` with accompanying text.
- Motion-sensitive users benefit from `prefers-reduced-motion` handling in both CSS (`scroll-behavior`) and JS (`scrollTo` logic that switches to instant jumps).
- Grids that rely on `subgrid` include `@supports` fallbacks so Safari/older Chromium retain proper alignment.

## License

This is Valentin Drenkov’s personal developer portfolio. The contents are provided solely for his own use, deployment, and representation as a professional hub. Please do not reuse or redistribute without explicit permission.
