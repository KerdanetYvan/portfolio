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

- **Next.js 16** (App Router) + **React 19**. **Front-end uniquement** —
  aucune base de données ni backend propre à ce dépôt (voir « Données »
  ci-dessous). Ne pas réintroduire Supabase/Drizzle ici : ce projet a été
  volontairement dépouillé du dashboard privé, qui vit maintenant dans
  [Ipse-web](https://github.com/KerdanetYvan/Ipse-web).
- **TypeScript** — tous les fichiers sont `.ts` / `.tsx`, jamais `.js` / `.jsx`
- **Tailwind CSS v4** (PostCSS via `@tailwindcss/postcss` — pas de `tailwind.config.js`, configuré dans `globals.css`)
- **next-themes** pour le mode clair/sombre (class-based, persisté en cookie)
- **Three.js** + `@react-three/fiber` + `@react-three/drei` — animation du dé
  sur l'accueil (`app/components/home/Die.tsx`, faces configurées dans
  `config/roles.ts`)
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

### Données

**Ce dépôt n'a pas de base de données.** Les deux seules opérations qui
touchent à des données persistantes passent par l'API publique minimale
d'[Ipse-back](https://github.com/KerdanetYvan/Ipse-back)
(`NEXT_PUBLIC_API_URL`, jamais de clé secrète côté client) :

- `lib/api/blog.ts` → `getBlogPosts()` / `getBlogPost(slug)` — `GET
  /blog/posts[/:slug]`, `cache: 'no-store'` (contenu qui doit rester frais),
  erreurs avalées en fallback vide/`null` plutôt que de crasher la page.
- `app/contact/ContactForm.tsx` → `POST /contact` sur Ipse-back.

Pas d'autre écriture, pas d'autre lecture dynamique. Le suivi de
candidatures, le générateur de CV, le dashboard privé et l'authentification
(anciennement Supabase Auth + GitHub OAuth, `proxy.ts`, `lib/supabase/*`) ont
été **retirés** de ce dépôt (commit `6b7fc46`, voir `CHANGELOG.md` [3.0.0]) —
ils font désormais partie d'Ipse-web, qui parle à la même API.

Données statiques restantes, en attendant qu'Ipse-web les gère dynamiquement :

- `data/skills.ts` — catégories de compétences, niveaux, hints de détection GitHub
- `data/learning.ts` — éléments "en apprentissage"
- `data/status.ts` — statut de disponibilité affiché sur `/contact`
- `public/projets.json` — liste curatée pour `/portfolio/[url]` (distincte des
  dépôts GitHub live de `/projects`)

### Pages existantes

- `/` — accueil
- `/projects` — dépôts GitHub live (propres + contributions, `GITHUB_TOKEN` en env). Paramètre `?lang=` pour pré-filtrer par langage (utilisé depuis `/skills`).
- `/projects/[owner]/[repo]` — détail d'un dépôt GitHub
- `/portfolio/[url]` — détail d'un projet curaté (`public/projets.json`) ; `/portfolio` redirige vers `/`
- `/skills` — grille de compétences avec stats GitHub. Détection en 3 couches : `githubLanguage` → `githubTopics` → `package.json` parsé via l'API Contents (cache 24h).
- `/about` — intro terminal + contenu stylisé (voir section dédiée)
- `/contact` — formulaire de contact → `POST /contact` sur Ipse-back
- `/blog`, `/blog/[url]` — liste et détail des articles publiés, lus depuis Ipse-back ; masqué (redirige) tant qu'aucun article n'est publié
- `/legal` — mentions légales

### Structure de la page `/about`

Page en deux temps : `Terminal.tsx` (client, animation typewriter, sessionStorage une fois par session, prefers-reduced-motion) → scroll vers `AboutClient.tsx` (timeline, méthodes de travail, au-delà du dev, langues, loisirs, credo).

- **Easter egg futur** : rendre le terminal interactif avec de vraies commandes (`help`, `skills`, `contact`, `projects`…).

### Page `/contact`

Formulaire → `POST /contact` sur Ipse-back (`app/contact/ContactForm.tsx`).
Honeypot anti-spam côté client + serveur. Validation double couche (client
HTML5 + serveur côté Ipse-back). États bouton animés (idle / loading /
success / error — auto-reset error après 3s). Statut de disponibilité
affiché depuis `data/status.ts` (statique).

**Attention nommage :** le formulaire envoie `nom`, `email`, `type_demande`,
`entreprise`, `_honeypot` — ces noms correspondent aux champs attendus par
Ipse-back. Le champ HTML `name="type"` est mappé côté JS avant le fetch.

**Gestion des messages** (lecture, lu/non-lu, réponse) se fait désormais
côté Ipse-web, pas ici — ce dépôt ne fait qu'envoyer.

### Navigation

`app/components/Header.tsx` — sticky, backdrop-blur, responsive (hamburger sur mobile). Les liens de navigation sont définis dans `BASE_NAV_LINKS` ; le lien Blog n'est ajouté que si `showBlog` (masqué tant qu'aucun article n'est publié, voir `/blog`).

## Conventions clés

- Largeur max du contenu : `max-w-6xl mx-auto px-4` (utilisé dans Header/Footer, à appliquer uniformément)
- `<main id="main-content">` sémantique encapsule le contenu des pages (WCAG / skip-to-main)
- Pas de section contact dans les pages — le `<Footer>` partagé gère les liens sociaux
- Bandeaux hero : `h-[200px] md:h-[400px] lg:h-[600px]` avec `bg-cover bg-center` et overlay `bg-black/40 backdrop-blur`
- Config du dé Three.js dans `config/roles.ts` (`app/components/home/Die.tsx`) — ajouter une entrée = ajouter une face au dé

### Analytics

- **Vercel Web Analytics** activé (`@vercel/analytics`) — cookieless, RGPD-compliant, pas de bandeau cookies
- **Vercel Speed Insights** activé (`@vercel/speed-insights`) — Core Web Vitals en production
- Composants injectés dans `app/layout.tsx`, après `</Providers>` dans le `<body>`
- **Custom events** (via `track()` de `@vercel/analytics`) :
  - `contact_form_submitted` — envoi formulaire /contact (succès uniquement)
  - `article_viewed` — chargement d'une page /blog/[url] (slug en propriété)
- Pattern pour nouveaux events : `import { track } from '@vercel/analytics'` + `track('nom_event')` dans les handlers client
- Données accessibles sur vercel.com → projet → onglet Analytics
- ⚠️ Activer manuellement sur Vercel Dashboard : onglet "Analytics" → Enable, onglet "Speed Insights" → Enable
