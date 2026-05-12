# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler dans ce dépôt.

## Documentation

Toute la documentation du projet (README, CHANGELOG, commentaires de code, messages de commit) est rédigée en **français**.

## Commandes

```bash
npm run dev      # Serveur de développement (Next.js 16 + Turbopack) — http://localhost:3000
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
```

## Stack

- **Next.js 16** (App Router, fullstack) + **React 19**
- **TypeScript** — tous les fichiers sont `.ts` / `.tsx`, jamais `.js` / `.jsx`
- **Tailwind CSS v4** (PostCSS via `@tailwindcss/postcss` — pas de `tailwind.config.js`, configuré dans `globals.css`)
- **next-themes** pour le mode clair/sombre (class-based, persisté en cookie)
- **Three.js** + `@react-three/fiber` + `@react-three/drei` (animation dé sur l'accueil — en cours)
- **Recharts** (dashboard argent — en cours)
- **Framer Motion** pour les animations

## Architecture

### Structure App Router

Toutes les pages sont dans `app/`. Le layout partagé (`app/layout.tsx`) encapsule chaque page avec `<Providers>` (next-themes), `<Header>`, et `<Footer>`. Le layout lit un cookie `theme` côté serveur pour définir la classe `dark` sur `<html>` avant l'hydratation (pas de flash).

### Système de thème

- `app/globals.css` — fichier source (pas un fichier compilé). Commence par `@import "tailwindcss"`, définit `@custom-variant dark`, enregistre les propriétés CSS comme utilitaires Tailwind via `@theme`.
- `app/providers.tsx` — encapsule `NextThemesProvider` (attribute="class", defaultTheme="system"). Contient `CookieSync` qui écrit `document.cookie` au changement de thème.
- `app/components/ThemeToggle.tsx` — toggle soleil/lune, utilise `useTheme`, guard `mounted` contre les erreurs d'hydratation.

### Tokens de design (CSS custom properties)

Définis dans `:root` / `.dark` dans `globals.css`, enregistrés dans `@theme` pour la génération des utilitaires Tailwind :

| Token | Utilitaire Tailwind | Rôle |
| --- | --- | --- |
| `--surface` | `bg-surface` | Fond de page |
| `--surface-raised` | `bg-surface-raised` | Cartes, sections subtiles |
| `--on-surface` | `text-on-surface` | Texte principal |
| `--muted` | `text-muted` | Texte secondaire |
| `--border` | `border-border` | Bordures |
| `--accent` | `bg-accent` / `text-accent` | Boutons CTA, liens |
| `--accent-hover` | `bg-accent-hover` | État hover des boutons |
| `--pop-blue/purple/green/pink/orange` | `text-pop-*` / `bg-pop-*` | Couleurs d'accentuation |

La palette claire est inspirée de GitHub (`#0d1117` fond sombre, `#0969da` accent). N'utiliser le préfixe `dark:` que pour les exceptions non couvertes par les tokens.

### Couche de données

- `data/skills.ts` — catégories de compétences, niveaux, hints de détection GitHub
- `data/learning.ts` — éléments "en apprentissage" (statique, migration BDD prévue)
- `public/articles.json` — articles de blog (vide `[]`, blog désactivé)

### Pages existantes

- `/` — accueil
- `/projects` — dépôts GitHub live (propres + contributions, `GITHUB_TOKEN` en env). Paramètre `?lang=` pour pré-filtrer par langage (utilisé depuis `/skills`).
- `/projects/[owner]/[repo]` — détail d'un dépôt
- `/skills` — grille de compétences avec stats GitHub. Détection en 3 couches : `githubLanguage` → `githubTopics` → `package.json` parsé via l'API Contents (cache 24h).
- `/about` — intro terminal + contenu stylisé (voir section dédiée)
- `/contact` — formulaire de contact
- `/legal` — mentions légales
- `/blog` — désactivé, redirige vers `/`

### Pages à venir

- `/dashboard/*` — privé, protégé par NextAuth v5 (credentials, mono-utilisateur). `/dashboard/money` pour le suivi financier multi-banques.

### Structure de la page `/about`

Page en deux temps : `Terminal.tsx` (client, animation typewriter, sessionStorage une fois par session, prefers-reduced-motion) → scroll vers `AboutClient.tsx` (timeline, méthodes de travail, au-delà du dev, langues, loisirs, credo).

- **Easter egg futur** : rendre le terminal interactif avec de vraies commandes (`help`, `skills`, `contact`, `projects`…).

### Migration à prévoir

- `data/learning.ts` → table BDD `learning_items` éditée via un futur back-office admin.

### Page `/contact`

Formulaire avec honeypot anti-spam, états bouton animés (idle / loading / success / error), endpoint mock dans `app/api/contact/route.ts`. Statut de disponibilité configurable dans `data/status.ts`.

**À implémenter plus tard :**

- Endpoint `/api/contact` : persistance en BDD dans une table `contact_messages` (champs : `nom`, `email`, `type_demande`, `entreprise` nullable, `message`, `date_reception`, `statut` — non lu / lu / répondu / archivé)
- Lecture et gestion des messages depuis `/dashboard`
- Bandeau de disponibilité éditable depuis le dashboard (migration `data/status.ts` → BDD)
- Alternative temporaire si besoin de fonctionnel rapide : service tiers type Formspree ou Resend

### Authentification (à implémenter)

NextAuth v5 + Credentials provider. Login/mot de passe stockés en variables d'env hashées. Sessions JWT. Middleware protège toutes les routes `/dashboard/*`. Pas de création de compte.

### Navigation

`app/components/Header.tsx` — sticky, backdrop-blur, responsive (hamburger sur mobile). Les liens de navigation sont définis dans le tableau `navLinks` en haut du fichier. Le lien Blog est commenté.

## Conventions clés

- Largeur max du contenu : `max-w-6xl mx-auto px-4` (utilisé dans Header/Footer, à appliquer uniformément)
- `<main id="main-content">` sémantique encapsule le contenu des pages (WCAG / skip-to-main)
- Pas de section contact dans les pages — le `<Footer>` partagé gère les liens sociaux
- Bandeaux hero : `h-[200px] md:h-[400px] lg:h-[600px]` avec `bg-cover bg-center` et overlay `bg-black/40 backdrop-blur`
- Config du dé Three.js dans `config/roles.js` (à créer) — ajouter une entrée = ajouter une face au dé
