# Changelog

Toutes les modifications notables de ce projet sont documentées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [2.0.0] — 2025-09-01

Refonte complète du portfolio : migration vers Next.js 16 App Router, TypeScript, Tailwind CSS v4 et design system cohérent (tokens CSS, thème clair/sombre).

### Ajouté

- Design system complet : tokens CSS (`--surface`, `--accent`, `--pop-*`), thème clair/sombre persisté via cookie (sans flash)
- Page `/projects` : liste live des dépôts GitHub (propres + contributions), filtres par langage, détail par dépôt (`/projects/[owner]/[repo]`)
- Page `/skills` : grille de compétences par catégorie avec badges de niveau, stats GitHub (nombre de repos, dernière activité, repos liés au survol), détection automatique des frameworks via `package.json`
- Section "En apprentissage" sur `/skills` (données statiques dans `data/learning.ts`)
- Page `/about` : intro typewriter façon terminal (sessionStorage, prefers-reduced-motion) + timeline git-log, méthodes de travail, langues, loisirs, credo
- Support `?lang=` sur `/projects` pour pré-filtrer depuis `/skills`
- Accessibilité : `<main id="main-content">`, landmarks ARIA, labels explicites

### Modifié

- Migration complète vers TypeScript (`.ts` / `.tsx`)
- Remplacement de Tailwind CSS v3 + `tailwind.config.js` par Tailwind CSS v4 via `@tailwindcss/postcss`
- Page `/about` : réécriture complète (suppression des dépendances v1 : stone-700, framer-motion inline, contacts embarqués)
- `/blog` désactivé : redirige vers `/`

### Supprimé

- Ancien système de projets statiques (`public/projets.json`) remplacé par l'API GitHub
- Page `/blog` et `/blog/[url]` (conservées mais redirigées)

---

## [1.0.0] — 2024-09-01

Première version publique du portfolio.

### Ajouté

- Pages : accueil, à propos, projets (JSON statique), blog (JSON statique), contact
- Stack : Next.js 14, JavaScript, Tailwind CSS v3, Framer Motion
- Timeline parcours, compétences statiques, liens sociaux
