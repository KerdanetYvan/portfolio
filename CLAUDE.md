# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js 16 + Turbopack) on http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Stack

- **Next.js 16** (App Router, fullstack) + **React 19**
- **Tailwind CSS v4** (PostCSS via `@tailwindcss/postcss` — no `tailwind.config.js`, configured in `globals.css`)
- **next-themes** for light/dark mode (class-based, cookie-persisted)
- **Three.js** + `@react-three/fiber` + `@react-three/drei` (die animation on homepage — in progress)
- **Recharts** (dashboard money — in progress)
- **Framer Motion** for animations

## Architecture

### App Router structure
All pages are under `app/`. Shared layout (`app/layout.js`) wraps every page with `<Providers>` (next-themes), `<Header>`, and `<Footer>`. The layout reads a `theme` cookie server-side to set the initial `dark` class on `<html>` before hydration (no flash).

### Theme system
- `app/globals.css` — source file (not compiled output). Starts with `@import "tailwindcss"`, defines `@custom-variant dark`, registers CSS custom properties as Tailwind utilities via `@theme`.
- `app/providers.jsx` — wraps `NextThemesProvider` (attribute="class", defaultTheme="system"). Contains `CookieSync` which writes `document.cookie` on theme change for SSR persistence.
- `app/components/ThemeToggle.jsx` — sun/moon toggle, uses `useTheme`, `mounted` guard against hydration mismatch.

### Design tokens (CSS custom properties)
Defined in `:root` / `.dark` in `globals.css`, registered in `@theme` for Tailwind utility generation:

| Token | Tailwind utility | Purpose |
|---|---|---|
| `--surface` | `bg-surface` | Page background |
| `--surface-raised` | `bg-surface-raised` | Cards, subtle sections |
| `--on-surface` | `text-on-surface` | Primary text |
| `--muted` | `text-muted` | Secondary text |
| `--border` | `border-border` (or just `border`) | Borders |
| `--accent` | `bg-accent` / `text-accent` | CTA buttons, links |
| `--accent-hover` | `bg-accent-hover` | Button hover state |
| `--pop-blue/purple/green/pink/orange` | `text-pop-*` / `bg-pop-*` | Accent color pops |

Light palette is GitHub-inspired (`#0d1117` dark bg, `#0969da` accent). Use `dark:` prefix only for exceptions not covered by the token system.

### Data layer (current — transitioning to DB)
Static JSON files in `public/`:
- `public/projets.json` — portfolio projects (id, name, url, description, tech[], status, fonctionnalites[], defis[], evolution[], images[], site, github, date ISO)
- `public/articles.json` — blog articles (currently empty `[]`)

Article markdown content lives under `public/articles/<url>/`.

### Planned pages (in progress)
- `/projects` — replaces `/portfolio`, will pull live from GitHub API (owner + contributor public repos) using a personal access token in env vars
- `/dashboard/*` — private, protected by NextAuth v5 (credentials, single-user, no registration). `/dashboard/money` for multi-bank finance tracking.
- `/blog` — disabled for now, will use a private editor + DB when activated

### Auth (to implement)
NextAuth v5 + Credentials provider. Login/password stored as hashed env vars. JWT sessions. Middleware protects all `/dashboard/*` routes. No user creation flow.

### Navigation
`app/components/Header.jsx` — sticky, backdrop-blur, responsive (hamburger on mobile). Nav links are defined as a `navLinks` array at the top of the file — add/remove links there. The blog link is currently visible but the page will be hidden/disabled.

## Key conventions

- Max content width: `max-w-6xl mx-auto px-4` (used in Header/Footer, apply consistently to all page sections)
- Semantic `<main id="main-content">` wraps page content (for skip-to-main / WCAG)
- No inline contact sections in pages — the shared `<Footer>` handles social links
- Page hero banners: `h-[200px] md:h-[400px] lg:h-[600px]` with `bg-cover bg-center` and a `bg-black/40 backdrop-blur` overlay
- Die config lives in `config/roles.js` (to create) — adding an entry auto-adds a face to the Three.js die
