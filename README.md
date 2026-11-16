# Valentin Drenkov — Developer Portfolio

Source code for [vdrenkov.dev](https://vdrenkov.dev), a single-page portfolio highlighting projects, experience and research interests across Java, Spring Boot, TypeScript, React and blockchain.

## Overview

The site is a static bundle of HTML, CSS and vanilla JavaScript. It combines semantic content, accessible navigation and responsive layouts with a consistent visual system.

## Features

### Navigation & Scrolling

- Sticky header with section links and CSS offsets that keep headings visible.
- Section links scroll and move keyboard focus without changing the URL or browser history.
- Smooth scrolling respects reduced-motion preferences.
- Hero height adapts to the viewport, including mobile browser chrome.
- Mobile navigation supports Escape and keyboard focus across breakpoints.

### Visual System

- Distinct section panels share a dark palette with clear contrast.
- CSS custom properties define colors, typography, spacing and focus states.
- Source Sans 3 and Space Grotesk distinguish body text from headings and actions.
- Responsive Grid layouts adapt cards to desktop, tablet and mobile screens.
- Tech Stack icons and restrained hover effects complement the content.

### Meta & Performance

- Search and social metadata include a canonical URL, Open Graph and Twitter previews.
- One stylesheet and a small script keep the site lightweight; most icons use inline SVG or emoji.

## Tech Stack

- **Markup:** Semantic HTML5 with landmarks and accessible labels.
- **Styling:** CSS custom properties, Grid, Flexbox and responsive media queries.
- **Behavior:** Vanilla JavaScript for section navigation, the mobile menu, responsive keyboard focus and footer year.
- **Tooling:** No build step or package installation required.

## Project Structure

```text
.
├── index.html          # Page content and metadata
├── styles.css          # Layouts, components and responsive styles
├── script.js           # Section navigation, mobile menu and footer year
├── public/
│   ├── icons/          # Favicons and navigation assets
│   └── images/         # Social preview and shared images
├── CNAME               # Custom domain configuration
├── README.md
└── .gitignore
```

## Accessibility & UX Notes

- Native links remain usable without JavaScript; the mobile menu stays visible when scripting is unavailable.
- Icons include accessible labels or are hidden from assistive technology when decorative.
- Visible focus indicators cover navigation, menu controls, project buttons and contact links.

## License

This is Valentin Drenkov’s personal developer portfolio. The contents are provided solely for his own use, deployment, and representation as a professional hub. Please do not reuse or redistribute without explicit permission.
