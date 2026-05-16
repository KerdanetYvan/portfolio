# Portfolio — Yvan Kerdanet

Portfolio personnel construit avec Next.js 16 App Router. Présente les projets récupérés en direct depuis GitHub, les compétences avec statistiques d'usage, et une page à propos avec une intro façon terminal.

**Version actuelle** : v2.1.0

---

## Pages

| Route | Description |
| --- | --- |
| `/` | Accueil — hero + points forts |
| `/projects` | Dépôts GitHub (API live), filtrables par langage |
| `/projects/[owner]/[repo]` | Détail d'un dépôt |
| `/skills` | Grille de compétences avec stats GitHub par technologie |
| `/about` | Intro terminal + timeline, méthodes de travail, loisirs |
| `/contact` | Formulaire de contact |
| `/legal` | Mentions légales |

> `/blog` est désactivé — redirige vers `/`.

---

## Stack

- **Framework** : Next.js 16 (App Router) + React 19
- **Langage** : TypeScript
- **Styles** : Tailwind CSS v4 (configuré via `globals.css`, sans `tailwind.config.js`)
- **Thème** : `next-themes` — clair/sombre, class-based, persisté en cookie (sans flash)
- **3D** : Three.js + `@react-three/fiber` + `@react-three/drei`
- **Animations** : Framer Motion
- **Graphiques** : Recharts *(dashboard — en cours)*
- **Icônes** : `react-icons`
- **Données** : GitHub REST API (repos, contents) + fichiers statiques dans `data/`

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
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx   # PAT GitHub — scopes : public_repo, read:user
```

Générer un token sur <https://github.com/settings/tokens>.

---

## Commandes

```bash
npm run dev      # Serveur de développement (Turbopack)
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # ESLint
```

---

## Contact

[kerdanety@gmail.com](mailto:kerdanety@gmail.com) · [LinkedIn](https://linkedin.com/in/yvankerdanet) · [GitHub](https://github.com/KerdanetYvan)
