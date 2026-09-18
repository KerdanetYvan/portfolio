# Portfolio — Yvan Kerdanet

Portfolio personnel construit avec Next.js 16 App Router. Présente les projets récupérés en direct depuis GitHub, les compétences avec statistiques d'usage, une page à propos avec intro façon terminal, un formulaire de contact et un blog.

**Front-end uniquement** : ce projet ne possède plus de base de données ni de backend propres. Les deux seules opérations qui touchent à des données persistantes (`POST /contact`, `GET /blog/posts`) passent par l'API publique minimale d'[Ipse-back](https://github.com/KerdanetYvan/Ipse-back) (`NEXT_PUBLIC_API_URL`). Le suivi de candidatures, le générateur de CV, le suivi d'apprentissage et le statut de disponibilité ont été retirés de ce dépôt — ils font partie du projet [Ipse](https://github.com/KerdanetYvan/Ipse) (app personnelle), à l'exception du statut et du "currently learning" qui restent ici en données statiques (`data/status.ts`, `data/learning.ts`) en attendant qu'Ipse-web les gère dynamiquement.

---

## Pages

| Route | Description |
| --- | --- |
| `/` | Accueil — hero + points forts |
| `/projects` | Dépôts GitHub (API live), filtrables par langage |
| `/projects/[owner]/[repo]` | Détail d'un dépôt |
| `/portfolio/[url]` | Détail d'un projet curaté (`public/projets.json`) ; `/portfolio` redirige vers `/` |
| `/skills` | Grille de compétences avec stats GitHub + Currently Learning (statique) |
| `/about` | Intro terminal + timeline, méthodes de travail, loisirs |
| `/contact` | Formulaire de contact → `POST /contact` sur Ipse-back |
| `/blog` | Liste des articles publiés → `GET /blog/posts` sur Ipse-back |
| `/blog/[url]` | Détail d'un article → `GET /blog/posts/:slug` sur Ipse-back |
| `/legal` | Mentions légales |

---

## Stack

### Front-end

- **Framework** : Next.js 16 (App Router) + React 19
- **Langage** : TypeScript — uniquement `.ts` / `.tsx`
- **Styles** : Tailwind CSS v4 (configuré via `globals.css`, sans `tailwind.config.js`)
- **Thème** : `next-themes` — clair/sombre, class-based, persisté en cookie (sans flash)
- **3D** : Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animations** : Framer Motion
- **Icônes** : `lucide-react` + `react-icons`

### Données

- **API** : [Ipse-back](https://github.com/KerdanetYvan/Ipse-back) — deux routes publiques uniquement (`POST /contact`, `GET /blog/posts[/:slug]`), jamais d'accès direct à une base de données depuis ce dépôt
- **API GitHub** : REST API (repos, contents) pour `/projects` et `/skills`

### Observabilité

- **Analytics** : Vercel Web Analytics — cookieless, RGPD-compliant
- **Performance** : Vercel Speed Insights — Core Web Vitals en production

---

## Démarrage

```bash
# 1. Cloner
git clone https://github.com/KerdanetYvan/portfolio.git
cd portfolio

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement (voir ci-dessous)

# 4. Lancer le serveur de développement
npm run dev        # http://localhost:3000
```

### Variables d'environnement

```env
# .env

# GitHub — PAT pour l'API repos/skills (scopes : public_repo, read:user)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx

# Ipse-back — API publique minimale (contact, blog)
NEXT_PUBLIC_API_URL=https://api.kerdanetyvan.dev
```

---

## Commandes

```bash
npm run dev      # Serveur de développement (Turbopack) — http://localhost:3000
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
```

---

## Contact

[kerdanety@gmail.com](mailto:kerdanety@gmail.com) · [LinkedIn](https://linkedin.com/in/yvankerdanet) · [GitHub](https://github.com/KerdanetYvan)
