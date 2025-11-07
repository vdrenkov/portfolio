# Valentin Drenkov — Developer Portfolio

Source code for [vdrenkov.dev](https://vdrenkov.dev) — a single‑page portfolio showcasing projects, tech stack, and experience.

## Features

- Accessible, semantic HTML5 structure with clear landmarks (`header`, `main`, `footer`).
- Navigation highlights the section in view (IntersectionObserver + `aria-current`).
- Smooth in‑page scrolling with sticky header offset; hero remains unhighlighted on top.
- Cards for Projects, Experience, Skills, and Education with consistent visual language.
- Footer‑integrated Contacts with icon‑only links wrapped in `address` and hidden text labels.
- SEO and social previews via Open Graph/Twitter meta (including `og:image:alt` and `twitter:image:alt`).

## Project Structure

```text
.
├── index.html                # Portfolio content and markup
├── script.js                 # Smooth scrolling + active nav highlighting + helpers
├── css/
│   ├── styles.css            # Core styles (colors, layout, sections, components)
│   └── media-queries.css     # Responsive breakpoints & tweaks
├── public/
│   └── favicon.ico
├── CNAME                     # Custom domain (GitHub Pages)
└── .gitignore
```

## Accessibility

- Semantic lists in navigation; `nav` has `aria-label="Primary"`.
- In‑page nav sets `aria-current="page"` for the active link.
- Contact icons include visually hidden labels via `.sr-only`; contact links live inside an `address`.
- Decorative emoji/icons rely on adjacent labels (icons can be marked `aria-hidden="true"`).
- Headings and section structure are linear and screen‑reader‑friendly.

## Browser Support

- Modern evergreen browsers (Chromium, Firefox, Safari, Edge). Subgrid is used in Skills as progressive enhancement and is supported in current major browsers; layout degrades gracefully where unsupported.

## License

This is Valentin Drenkov’s personal developer portfolio. The contents are provided solely for his own use, deployment, and representation as a professional hub. Please do not reuse or redistribute without explicit permission.
