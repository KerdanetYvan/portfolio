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

- `/dashboard/*` — privé, protégé par Supabase Auth + GitHub OAuth (mono-utilisateur). `/dashboard/money` pour le suivi financier multi-banques.

### Structure de la page `/about`

Page en deux temps : `Terminal.tsx` (client, animation typewriter, sessionStorage une fois par session, prefers-reduced-motion) → scroll vers `AboutClient.tsx` (timeline, méthodes de travail, au-delà du dev, langues, loisirs, credo).

- **Easter egg futur** : rendre le terminal interactif avec de vraies commandes (`help`, `skills`, `contact`, `projects`…).

### Queries BDD (`/db/queries/`)

Pattern : une fonction par domaine, erreur loggée côté serveur, fallback propre retourné au lieu du crash.

- `db/queries/status.ts` → `getActiveStatus()` — retourne `StatusRow | null`
- `db/queries/learning.ts` → `getCurrentLearningItems()` — retourne `LearningItem[]` triés par `ordre`
- `db/queries/dashboard.ts` → `getDashboardOverview()` + `getUnreadMessagesCount()` — agrégation dashboard home
- `db/queries/personnalize.ts` → `getAllStatuses()` (triés couleur vert>jaune>rouge puis date_modif desc) + `getAllLearningItems(filter?)` — pour /dashboard/personnalize

Utiliser ces helpers dans les Server Components publics (pas `useEffect`). Le client Drizzle est le `db` direct de `@/db` (connexion pooler PostgreSQL, bypass RLS — suffisant pour les SELECT publics).

### Server Actions (`/app/dashboard/actions/`)

Pattern pour toutes les mutations du dashboard :

```ts
'use server';
// 1. Auth check défense en profondeur (en plus du proxy.ts et layout)
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  if (process.env.ADMIN_USER_ID && user.id !== process.env.ADMIN_USER_ID) throw new Error('Forbidden');
}
// 2. Mutation Drizzle
// 3. revalidatePath systématique pour cohérence des caches
```

**`revalidatePath` obligatoire après chaque mutation :**

- Mutations statut → `/dashboard`, `/dashboard/personnalize`, `/contact`
- Mutations learning → `/dashboard`, `/dashboard/personnalize`, `/skills`
- Mutations messages → `/dashboard`, `/dashboard/contact_message`

**Ordre insertion learning_items :** utiliser `max(learningItems.ordre) + 1` pour calculer le prochain `ordre` avant INSERT.

**Mapping couleur enum → classes Tailwind :** centralisé dans `lib/colors.ts` (`COULEUR_CLASSES`, type `Couleur`). À réutiliser partout (dashboard + pages publiques).

### Page `/contact`

Formulaire branché en BDD (`app/api/contact/route.ts` → `portfolio.contact_messages` via Drizzle). Honeypot anti-spam côté client + serveur. Validation double couche (client HTML5 + serveur regex/enum). États bouton animés (idle / loading / success / error — auto-reset error après 3s). Statut de disponibilité affiché depuis `getActiveStatus()`.

**Attention nommage :** le formulaire envoie `nom`, `email`, `type_demande`, `entreprise`, `_honeypot` — ces noms correspondent aux colonnes BDD. Le champ HTML `name="type"` est mappé côté JS avant le fetch.

**À implémenter plus tard :**

- Rate limiting (1 message / minute / IP) pour éviter le spam massif
- Notification temps réel dashboard quand un nouveau message arrive (Supabase Realtime)
- Lecture et gestion des messages depuis `/dashboard/contact_message` (déjà implémenté)

### Base de données

- **Hébergement** : Supabase (PostgreSQL managé)
- **ORM** : Drizzle — schémas dans `db/schemas/`, migrations dans `db/migrations/`
- **Organisation** : par schéma métier (`portfolio`, `finance` futur, `tasks` futur) — pas par plateforme, pour permettre le partage avec de futures apps Flutter
- **Sécurité** : Row Level Security (RLS) activé sur toutes les tables
- **Connexion** : toujours utiliser le **pooler URL** (`DATABASE_URL`) pour les requêtes runtime ; le **direct URL** (`DIRECT_URL`) est réservé aux migrations Drizzle
- Variables sensibles dans `.env.local` strict — `SUPABASE_SERVICE_ROLE_KEY` jamais exposée côté client

**À chaque nouveau schéma métier, 4 étapes obligatoires :**

1. Créer le schéma Postgres (via migration Drizzle ou SQL direct) : `CREATE SCHEMA IF NOT EXISTS <nom>;`
2. **Exposer le schéma dans Supabase** : Dashboard > Project Settings > API > champ "Exposed schemas" → ajouter le nom. Sans cette étape, `supabase-js` renvoie `"schema not exposed"` ou `"relation does not exist"`.
3. Définir les tables Drizzle avec `pgSchema('<nom>').table(...)` (déjà fait pour `portfolio`)
4. Activer RLS manuellement sur chaque table (l'auto-RLS Supabase ne couvre que le schéma `public`)

**Schéma `portfolio` (tables existantes) :**

- `contact_messages` — messages du formulaire /contact
- `status` — bandeau de disponibilité (une seule ligne `actif=true` à la fois)
- `learning_items` — éléments "en apprentissage" de /skills

**Schéma `cv` (migration 0007) — données CV master, RLS strict admin-only :**

- `cv.profile` — informations générales (nom, prénom, titre, email, bio…)
- `cv.experiences` — expériences professionnelles (technos: `text[]`, date_fin null = en cours)
- `cv.formations` — formations / diplômes
- `cv.competences` — compétences techniques (enum catégorie + niveau)
- `cv.soft_skills` — compétences comportementales
- `cv.langues` — langues + niveau CECRL
- `cv.centres_interet` — centres d'intérêt
- `cv.certifications` — certifications
- `cv.projets_meta` — métadonnées projets pour CV (distinct de /projects GitHub)

Enums `cv.*` : `competence_categorie` (frontend/backend/bdd/devops/autres), `competence_niveau` (daily_driver/comfortable/familiar/exploring), `langue_niveau` (A1→C2/natif).

**Schéma `applications` (migrations 0007 + 0008) — suivi candidatures, RLS strict admin-only :**

- `applications.candidatures` — suivi candidatures avec champs : statut, type_poste, detail_offre, contact_nom/email/linkedin, date_candidature (=envoi), date_relance (=relance prévue), relance_effectuee, salaire_cible, notes
- `applications.candidature_cv` — snapshot JSON du CV envoyé par candidature (FK cascade)
- `applications.entretiens` — entretiens liés à une candidature (FK cascade)
- `applications.events` — timeline historisée (migration 0008) : type enum (created/sent/status_changed/entretien_scheduled/entretien_done/relance_done/note_added), description, date, metadata jsonb

Enums `applications.*` : `statut` (a_envoyer/envoyee/entretien_programme/en_cours/acceptee/refusee/ghosted), `type_poste` (presentiel/remote/hybride), `entretien_type` (telephone/visio/presentiel), `entretien_status` (prevu/fait/annule), `event_type`.

**Fichiers Drizzle TypeScript :** `db/schemas/cv/` (9 fichiers + index.ts) et `db/schemas/applications/` (4 fichiers + index.ts dont events.ts). Tous re-exportés depuis `db/index.ts`.

**Policies RLS :** une policy `FOR ALL TO authenticated` par table — `USING` + `WITH CHECK` sur `auth.uid() = '4c833b4d-...'::uuid`. Toutes les tables cv et applications sont admin-only (aucun accès public).

**Action Supabase requise :** Dashboard > Project Settings > API > Exposed schemas → ajouter `cv` et `applications`.

**Seed initial (migration 0004) :** 4 statuts + 3 learning items déjà insérés en BDD. Pour modifier ces données, passer par `/dashboard/personnalize`, pas par une nouvelle migration.

**Commandes Drizzle :**

```bash
npm run db:generate   # Génère les fichiers de migration depuis les schémas
npm run db:migrate    # Applique les migrations sur la BDD
npm run db:studio     # Interface Drizzle Studio locale
```

**Policies RLS à configurer dans Supabase Studio :**

- `contact_messages` : INSERT public, SELECT/UPDATE/DELETE owner uniquement
- `status` : SELECT public, UPDATE owner uniquement
- `learning_items` : SELECT public, INSERT/UPDATE/DELETE owner uniquement

### Authentification

**Stack** : Supabase Auth + GitHub OAuth, mono-utilisateur, whitelist par UUID.

**Fichiers créés :**

- `proxy.ts` (racine) — **utiliser `proxy.ts`, PAS `middleware.ts` qui est déprécié en Next.js 16+**. Exporte `function proxy(request: NextRequest)`. Matcher sur `/dashboard/:path*`.
- `lib/supabase/client.ts` — `createBrowserClient` (composants client)
- `lib/supabase/server.ts` — `createServerClient` avec `cookies()` (composants serveur)
- `lib/supabase/proxy.ts` — `updateSession()` helper pour proxy.ts, rafraîchit la session
- `app/auth/callback/route.ts` — échange le code OAuth contre une session, redirige vers `/dashboard`
- `app/login/page.tsx` + `app/login/LoginForm.tsx` — page de connexion, bouton GitHub OAuth
- `app/components/auth/LogoutButton.tsx` — bouton déconnexion réutilisable

**Logique de sécurité dans `proxy.ts` :**

1. Si `ADMIN_USER_ID` est vide → refus immédiat (sécurité par défaut)
2. Si pas de session → redirect `/login`
3. Si `user.id !== ADMIN_USER_ID` → `supabase.auth.signOut()` + redirect `/login?error=unauthorized`

**Variable d'env requise :**

```env
ADMIN_USER_ID=  # UUID Supabase de l'admin — récupérer dans Auth > Users > User UID
```

**Configuration Supabase requise (une seule fois) :**

- Dashboard > Authentication > Providers > GitHub → activer, renseigner Client ID + Secret
- Dashboard > Authentication > URL Configuration → ajouter `{origin}/auth/callback` dans "Redirect URLs"

### Dashboard (`/dashboard/*`)

Interface de travail privée (desktop-first, 90% des usages). Layout : sidebar collapsible (60px → 220px au hover) + header compact + zone principale.

**Structure :**

```text
app/dashboard/
├── layout.tsx              — Auth check (createClient server) + sidebar + header
├── page.tsx                — Home "morning briefing" (messages, statut, learning)
├── components/
│   ├── Sidebar.tsx         — Sidebar Lucide icons, unreadCount badge
│   ├── DashboardHeader.tsx — Salutation + date + dot statut actif
│   ├── ToastProvider.tsx   — Context toast (succès/erreur, 3s, bas-droite)
│   ├── ConfirmModal.tsx    — Modal confirmation actions destructives
│   └── KeyboardShortcuts.tsx — g+d/p/m navigation, Esc ferme modals
├── actions/
│   ├── status.ts           — activateStatus, createStatus, updateStatus, deleteStatus
│   ├── learning.ts         — createLearningItem, updateLearningItem, deleteLearningItem, markLearningDone
│   └── messages.ts         — markMessageRead/Unread/Replied, archiveMessage, deleteMessage
├── personnalize/
│   ├── page.tsx            — Server fetch statuses + items, passe à PersonnalizeClient
│   ├── PersonnalizeClient.tsx — Tabs internes (Statut / Currently Learning)
│   ├── StatusSection.tsx   — CRUD statuts, preview actif, activation unique
│   └── LearningSection.tsx — CRUD items, filtre par statut, modal add/edit
├── cv/
│   ├── page.tsx            — Server Component, async searchParams `?section=X`, switch sur SectionContent
│   ├── actions.ts          — 'use server', ~30 fonctions CRUD (upsertProfile, createX/updateX/deleteX/toggleXVisible)
│   └── components/
│       ├── CvSidebar.tsx         — 9 sections, navigation par ?section=, lien actif avec bar accent
│       ├── ProfileSection.tsx    — Formulaire singleton (upsert), fieldsets Identité/Contact/Liens/Accroche
│       ├── ExperiencesSection.tsx — CRUD + DateRangeInput + TagInput technologies + visible toggle
│       ├── FormationsSection.tsx  — CRUD + DateRangeInput + visible toggle
│       ├── CompetencesSection.tsx — CRUD groupé par catégorie, filtre chips, badge niveau coloré
│       ├── LanguesSection.tsx     — CRUD, badge niveau coloré (A1/A2 gris, B1/B2 jaune, C1/C2 vert, natif accent)
│       ├── SoftSkillsSection.tsx  — CRUD libelle simple, affichage pills
│       ├── CertificationsSection.tsx — CRUD + date_obtention + url optionnel + visible toggle
│       ├── CentresInteretSection.tsx — CRUD libelle simple, affichage pills
│       └── ProjetsSection.tsx    — CRUD + TagInput technologies + url_demo + url_repo + visible toggle
├── candidatures/
│   ├── page.tsx              — Server Component, fetch list + counts + detail (si ?id=), passe à CandidaturesClient
│   ├── actions.ts            — 'use server', createCandidature/updateCandidature/deleteCandidature/changeStatus/markAsSent/markRelanceDone/scheduleEntretien/updateEntretienStatus
│   ├── CandidaturesClient.tsx — Layout 2 colonnes : liste filtrée (400px) + détail. Filtre client-side via replaceState, sélection via router.push
│   └── components/
│       ├── CandidatureModal.tsx  — Formulaire create/edit (4 sections : L'offre/Localisation/Contact/Suivi)
│       ├── CandidatureDetail.tsx — Panneau droit : header + offre + contact + entretiens + timeline + CV + notes + actions rapides
│       └── EntretienModal.tsx    — Modal programmation entretien (type, datetime-local, interlocuteur, notes)
└── contact_message/
    ├── page.tsx            — Server fetch tous les messages (getAllMessages), passe initialFilter/initialId depuis searchParams
    └── MessageInbox.tsx    — Inbox 3 colonnes : FilterSidebar | MessageList | MessageDetail
```

**Page `/dashboard/candidatures` :**

- URL : `?filter=all|a_envoyer|en_cours|relance|acceptee|refusee|ghosted` + `?id=<uuid>`
- Filtres côté client (replaceState) pour rapidité ; sélection d'une candidature via `router.push` (server re-render pour charger le détail avec events + entretiens)
- Statut badge dans le détail est cliquable → dropdown inline pour changer le statut
- Relance auto : `markAsSent()` calcule `date_relance = date_envoi + 7 jours` si non renseignée
- Timeline dans `applications.events` : chaque action significative insère un événement (created/sent/status_changed/…)

**Card relances sur `/dashboard` home :**

- `RelancesCard` (`app/dashboard/components/RelancesCard.tsx`) : affichée seulement si relances > 0
- Candidatures avec `date_relance <= aujourd'hui AND relance_effectuee = false AND statut NOT IN (acceptee/refusee/ghosted)`
- Max 3 affichées + lien "Voir tout" → `/dashboard/candidatures?filter=relance`
- Bouton "Fait" inline appelle `markRelanceDone(id)` + router.refresh()

**DB queries candidatures (`db/queries/candidatures.ts`) :**

- `getAllCandidatures()` → triées par `updated_at DESC`
- `getCandidatureById(id)` → avec entretiens + events + cv (Promise.all)
- `getRelancesAFaire()` → date_relance <= today AND relance_effectuee = false AND statut non terminal
- `getCandidaturesCounts()` → compteurs par filtre (tout calculé JS depuis fetch unique)
- `getActiveCandidaturesCount()` → pour le badge sidebar (statut NOT IN acceptee/refusee/ghosted)

**Sidebar globale mise à jour :** ordre 1-Home 2-CV 3-Candidatures (badge actives) 4-Personnaliser 5-Messages 6-disabled. `layout.tsx` passe `activeCandidaturesCount` via `getActiveCandidaturesCount()`.

**Page `/dashboard/cv` :**

- URL : `?section=profile|experiences|formations|competences|soft-skills|langues|projets|certifications|centres-interet`
- `SectionContent` async server component : fetch les données de la section active, rend le composant correspondant
- `Suspense key={section}` pour reset le skeleton à chaque changement de section
- Toutes les mutations passent par `app/dashboard/cv/actions.ts` avec `requireAdmin()` + `revalidatePath('/dashboard/cv')`

**DB queries CV (`db/queries/cv.ts`) :**

- `getProfile()` → `Profile | null`
- `getAllExperiences/Formations/Competences/SoftSkills/Langues/Certifications/CentresInteret/ProjetsMeta()` → tableau trié par `asc(table.ordre)`

**Patterns communs sections CV :**

- Modal inline `fixed inset-0 z-40 bg-black/60 backdrop-blur-sm` + `max-w-lg rounded-lg border border-[#262626] bg-[#111] p-6`
- `run()` helper : `startTransition(async () => { await fn(); showToast(msg); router.refresh(); })`
- Optimistic toggle visible : `setItems(prev => prev.map(...))` sans attendre le serveur
- Composants réutilisables : `app/components/ui/TagInput.tsx` + `app/components/ui/DateRangeInput.tsx`

**Inbox messages `/dashboard/contact_message` :**

- Layout 3 colonnes : filtres (180px) | liste (340px) | détail (flex-1)
- Filtres : non_lu, tous, par type (alternance/mission_freelance/question/autre), archivés
- URL bookmarkable via `window.history.replaceState` (pas de server re-render sur changement de filtre) — `?filter=X` + `?id=Y`
- Optimistic updates : lecture auto à l'ouverture + rollback sur erreur
- Action "Répondre" : ouvre `mailto:` avec sujet + citation du message original (préfixée `>`), marque automatiquement `repondu`
- `markMessageReplied` disponible dans `actions/messages.ts`
- Statuts messages : `non_lu` → `lu` → `repondu` → `archive`

**Futures améliorations (ne pas implémenter sans demande) :**

- Supabase Realtime sur `portfolio.contact_messages` pour apparition en temps réel
- Recherche textuelle dans les messages
- Tags/labels custom
- Export CSV/JSON
- Client mail intégré

**Routing sans Header/Footer :** `app/ConditionalNav.tsx` (client) wrappe Header+main+Footer uniquement hors `/dashboard/*`. Le root layout `app/layout.tsx` délègue à ConditionalNav.

**Auth dans le layout :** `createClient()` de `@/lib/supabase/server` + `supabase.auth.getUser()` → redirect `/login` si non authentifié ou non admin.

**À implémenter plus tard (ne pas réorganiser le layout pour ça) :**

- Drag & drop réorganisation des `learning_items` par champ `ordre`
- Modules Planning, Tâches, Argent/Stats (icônes "bientôt" déjà dans la sidebar)
- Card Analytics sur `/dashboard` (placeholder réservé, brancher sur stats visiteurs)
- Notifications push (PWA, mail, Discord webhook)
- Optimisation mobile : pas prioritaire, à reprendre avec le design de l'app Flutter

### Navigation

`app/components/Header.tsx` — sticky, backdrop-blur, responsive (hamburger sur mobile). Les liens de navigation sont définis dans le tableau `navLinks` en haut du fichier. Le lien Blog est commenté.

## Conventions clés

- Largeur max du contenu : `max-w-6xl mx-auto px-4` (utilisé dans Header/Footer, à appliquer uniformément)
- `<main id="main-content">` sémantique encapsule le contenu des pages (WCAG / skip-to-main)
- Pas de section contact dans les pages — le `<Footer>` partagé gère les liens sociaux
- Bandeaux hero : `h-[200px] md:h-[400px] lg:h-[600px]` avec `bg-cover bg-center` et overlay `bg-black/40 backdrop-blur`
- Config du dé Three.js dans `config/roles.js` (à créer) — ajouter une entrée = ajouter une face au dé

### Analytics

- **Vercel Web Analytics** activé (`@vercel/analytics`) — cookieless, RGPD-compliant, pas de bandeau cookies
- **Vercel Speed Insights** activé (`@vercel/speed-insights`) — Core Web Vitals en production
- Composants injectés dans `app/layout.tsx`, après `</Providers>` dans le `<body>`
- Exclusion du tracking sur `/dashboard/*` via `beforeSend` : les pages admin ne sont pas trackées
- **Custom events** (via `track()` de `@vercel/analytics`) :
  - `contact_form_submitted` — envoi formulaire /contact (succès uniquement)
- Pattern pour nouveaux events : `import { track } from '@vercel/analytics'` + `track('nom_event')` dans les handlers client
- Données accessibles sur vercel.com → projet → onglet Analytics
- ⚠️ Activer manuellement sur Vercel Dashboard : onglet "Analytics" → Enable, onglet "Speed Insights" → Enable
- Future amélioration : analytics DIY dans Supabase intégré au /dashboard pour croiser avec les messages
