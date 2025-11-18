# Valentin Drenkov — Developer Portfolio

Source code for [vdrenkov.dev](https://vdrenkov.dev), a handcrafted single-page portfolio that highlights projects, experience, and research interests across Java, Spring, JavaScript, React, and blockchain.

## Overview

The site is a static bundle (HTML, CSS, vanilla JS) optimized for GitHub Pages. It focuses on:

- clear, semantic content hierarchy
- fast navigation with a sticky header that adapts to screen size
- accessible interactions whether or not JavaScript is available
- polished visuals with modern CSS (Grid, custom properties, motion-reduced fallbacks)

## Highlights

- **Sticky navigation** — The header stays pinned, offsets are applied to in-page scroll targets, and the hamburger variant retains full functionality even if JavaScript is disabled.
- **Smooth-yet-accessible scrolling** — Scroll behavior honors `prefers-reduced-motion` and compensates for the sticky header height so anchors never sit under the nav.
- **Content cards** — Projects, experience, skills, and education all share the same card language for visual consistency.
- **SEO & sharing** — Comprehensive metadata (description, canonical, Open Graph, Twitter, `og:image:alt`) ensures rich previews on social platforms.
- **Performance-first assets** — Single CSS/JS files, preconnects for fonts, and lean SVG/emoji-based iconography.

## Tech Stack

- **Markup:** Semantic HTML5 with landmark elements and accessible navigation labels.
- **Styling:** A single `styles.css` file using CSS custom properties, Grid, Flexbox, subgrid fallbacks, and responsive media queries.
- **Behavior:** `script.js` manages smooth scrolling (with sticky-header offsets), reduced-motion handling, equalized card headers, and mobile nav toggling.
- **Tooling:** No build pipeline required.

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
├── TODO                # Personal task list
└── .gitignore
```

## Accessibility & UX Notes

- Navigation uses semantic lists with `aria-label="Primary"` and remains usable without JavaScript thanks to the `.no-js` class that reveals the menu by default.
- Interactive emoji/SVG icons either include visible labels or are marked `aria-hidden="true"` with accompanying text.
- Motion-sensitive users benefit from `prefers-reduced-motion` handling in both CSS (`scroll-behavior`) and JS (`scrollTo`).
- Grids that rely on `subgrid` include `@supports` fallbacks so Safari/older Chromium retain proper alignment.

## License

This is Valentin Drenkov’s personal developer portfolio. The contents are provided solely for his own use, deployment, and representation as a professional hub. Please do not reuse or redistribute without explicit permission.
