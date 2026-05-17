# Portfolio — Yvan Kerdanet

Portfolio personnel construit avec Next.js 16 App Router. Présente les projets récupérés en direct depuis GitHub, les compétences avec statistiques d'usage, une page à propos avec intro façon terminal, un formulaire de contact branché en base de données, et un dashboard d'administration privé.

**Version actuelle** : v2.1.0

---

## Pages

| Route | Description |
| --- | --- |
| `/` | Accueil — hero + points forts |
| `/projects` | Dépôts GitHub (API live), filtrables par langage |
| `/projects/[owner]/[repo]` | Détail d'un dépôt |
| `/skills` | Grille de compétences avec stats GitHub + Currently Learning (BDD) |
| `/about` | Intro terminal + timeline, méthodes de travail, loisirs |
| `/contact` | Formulaire de contact branché en base de données |
| `/legal` | Mentions légales |
| `/login` | Connexion admin (GitHub OAuth via Supabase) |
| `/dashboard` | Home dashboard — résumé messages, statut, apprentissages |
| `/dashboard/personnalize` | CRUD statuts de disponibilité + Currently Learning |
| `/dashboard/contact_message` | Inbox messages reçus (3 colonnes, filtres, actions) |

> `/blog` est désactivé — redirige vers `/`.

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

### Back-end & données

- **ORM** : Drizzle — schémas dans `db/schemas/`, migrations dans `db/migrations/`
- **Base de données** : Supabase (PostgreSQL managé), schéma métier `portfolio`
- **Auth** : Supabase Auth + GitHub OAuth — mono-utilisateur, whitelist par UUID
- **API GitHub** : REST API (repos, contents) pour `/projects` et `/skills`

### Observabilité

- **Analytics** : Vercel Web Analytics — cookieless, RGPD-compliant, exclu sur `/dashboard/*`
- **Performance** : Vercel Speed Insights — Core Web Vitals en production

---

## Démarrage

```bash
# 1. Cloner
git clone https://github.com/KerdanetYvan/portfolio.git
cd portfolio

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.local.example .env.local

# 4. Lancer le serveur de développement
npm run dev        # http://localhost:3000
```

### Variables d'environnement

```env
# .env.local

# GitHub — PAT pour l'API repos/skills (scopes : public_repo, read:user)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx

# Supabase — connexion base de données
DATABASE_URL=postgresql://...          # Pooler URL (runtime)
DIRECT_URL=postgresql://...            # Direct URL (migrations Drizzle uniquement)

# Supabase — Auth
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Dashboard — UUID de l'utilisateur admin (Auth > Users dans Supabase)
ADMIN_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## Commandes

```bash
npm run dev      # Serveur de développement (Turbopack) — http://localhost:3000
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint

npm run db:generate   # Génère les fichiers de migration depuis les schémas Drizzle
npm run db:migrate    # Applique les migrations sur la base de données
npm run db:studio     # Interface Drizzle Studio locale
```

---

## Contact

[kerdanety@gmail.com](mailto:kerdanety@gmail.com) · [LinkedIn](https://linkedin.com/in/yvankerdanet) · [GitHub](https://github.com/KerdanetYvan)
