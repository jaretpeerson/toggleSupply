# Toggle Supply

A growing collection of hand-coded UI components, animations, and interactions for modern web development.

**[toggle.supply](https://toggle.supply)**

## About

Toggle Supply is a CSS-first component library featuring production-ready components built with vanilla HTML, CSS, and JavaScript. Each component is framework-agnostic — copy the code and it works, no dependencies required.

### Principles

- **CSS-First** — JavaScript handles logic, CSS handles expression. Animations use GPU-accelerated transitions for smooth performance.
- **Production-Ready** — Copy the HTML, CSS, and JavaScript. It just works.
- **Lightweight** — Minimal JavaScript, no frameworks. CSS transitions stay smooth even when the main thread is busy.

## Tech Stack

- [Astro](https://astro.build) — Static site generator
- Vanilla CSS & JavaScript
- [GSAP](https://gsap.com) — Used selectively for complex sequence-based animations
- [Vercel](https://vercel.com) — Analytics & deployment

## Components

18 published components across categories including:

- **Navigation** — Hover reveal menus, interactive nav patterns
- **Marquees** — Scroll-direction-aware infinite marquees
- **Accordions** — Smooth expand/collapse with CSS transitions
- **Page Transitions** — Pixelated reveals, box-based transitions
- **Carousels & Galleries** — Manual carousels, lightboxes with controls, staggered grids with clip-path masking
- **Scroll** — Scroll snap sections, scroll-driven animations
- **Forms** — Validation with visual feedback
- **Buttons** — Staggered letter animations and hover effects

## Project Structure

```
src/
├── pages/                # Astro pages (file-based routing)
│   └── components/       # Individual component showcase pages
├── components/           # Reusable Astro components (nav, footer, grid)
├── layouts/              # Base layout with head/metadata
├── styles/               # Global + component CSS
│   └── components/       # One CSS file per component
└── config.ts             # Site configuration
public/
├── scripts/              # Client-side vanilla JS
│   └── components/       # One JS file per component
├── data/                 # JSON data for content grids
└── assets/               # Images, SVGs, thumbnails, textures
```

Each component follows a consistent pattern:

| Layer | File |
|-------|------|
| Structure | `src/pages/components/{name}.astro` |
| Styles | `src/styles/components/{name}.css` |
| Interactivity | `public/scripts/components/{name}.js` |
| Metadata | `public/data/content-components.json` |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Links

- **Website** — [toggle.supply](https://toggle.supply)
- **GitHub** — [toggleSupply](https://github.com/toggleSupply)
- **X** — [@togglesupply](https://x.com/togglesupply)
- **Instagram** — [@toggle.supply](https://instagram.com/toggle.supply)
- **Contact** — hello@toggle.supply
