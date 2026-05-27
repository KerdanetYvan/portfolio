# Changelog

Toutes les modifications notables de ce projet sont documentées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [2.1.4] — 2026-05-27

Migration de la génération PDF de Puppeteer vers PDFShift (SaaS). Suppression de ~150 Mo de dépendances Chromium du bundle Vercel, ce qui résout les erreurs de dépassement de mémoire en production.

### Ajouté

- `lib/cv/pdf-service.ts` — helper `generatePdfFromHtml(html, sandbox?)` qui isole l'appel PDFShift. Remplacer uniquement cette fonction pour switcher vers un webhook n8n à l'avenir.
- Route de test `/api/cv/generate/test` refondée : appelle PDFShift en mode `sandbox: true` (watermark, quota non consommé) pour valider l'intégration sans gaspiller le free tier.
- Gestion fine des erreurs PDFShift côté serveur : 401 (clé invalide), 402 (quota dépassé), 422 (HTML invalide), timeout 30 s, 5xx (service indisponible).
- Toast de succès "PDF v{N} généré" et toasts d'erreur dans `CvConfigClient` — remplacement de l'affichage inline.
- Bouton "Exporter PDF" affiche la version après génération : "Régénérer PDF (v2)".

### Modifié

- `app/api/cv/generate/route.ts` — bloc Puppeteer remplacé par `generatePdfFromHtml()`. Même flux : auth → données CV → HTML → PDF → upload Supabase Storage.
- `lib/cv/cv-template.ts` — commentaire mis à jour (suppression référence Puppeteer).

### Supprimé

- Dépendances `puppeteer`, `puppeteer-core`, `@sparticuz/chromium-min` (~150 Mo) — gain significatif sur le bundle Vercel et la mémoire disponible.
- Variable d'env `CHROME_EXECUTABLE_PATH` (plus utilisée).
- Logique de détection dev/prod pour le lancement de Chromium.

---

## [2.1.3] — 2026-02-01

Système complet de gestion du CV et de suivi des candidatures, accessible depuis le dashboard privé.

### Ajouté

- **Schéma BDD `cv`** (migration 0007) : tables `cv.profile`, `cv.experiences`, `cv.formations`, `cv.competences`, `cv.soft_skills`, `cv.langues`, `cv.certifications`, `cv.centres_interet`, `cv.projets_meta`. RLS strict admin-only.
- **Schéma BDD `applications`** (migrations 0007 + 0008) : tables `applications.candidatures`, `applications.candidature_cv`, `applications.entretiens`, `applications.events`. Timeline événementielle (created/sent/status_changed/entretien_scheduled/…).
- **Page `/dashboard/cv`** : interface CRUD pour toutes les sections du CV. Navigation par `?section=`. Composants dédiés par section (ExperiencesSection, CompetencesSection, etc.) avec modals inline, toggle visible, réordonnancement flèches.
- **Page `/dashboard/candidatures`** : tableau de suivi des candidatures. Filtres par statut (`?filter=`), sélection par `?id=`, layout 2 colonnes (liste 400px + détail). Modals création/édition et programmation d'entretiens.
- **Page `/dashboard/candidatures/[id]/cv`** : générateur de CV personnalisé par candidature. Extraction de mots-clés depuis l'offre d'emploi, scoring des items CV, sélection par checkboxes, réordonnancement des sections. Aperçu HTML en iframe (local, instantané). Génération PDF via Puppeteer → upload Supabase Storage.
- `lib/cv/keyword-extraction.ts` — `extractKeywords()` et `computeScore()` : matching tag-based intentionnellement simple.
- `lib/cv/cv-matching.ts` — `generateInitialConfig()` : génération automatique de la config CV à partir des mots-clés de l'offre.
- `lib/cv/cv-template.ts` — `generateCvHtml()` : template HTML self-contained (ATS-friendly, 2 colonnes, polices système + Google Fonts).
- `lib/cv/types.ts` — types partagés : `SectionId`, `ItemConfig`, `SectionConfig`, `CvConfig`.
- `lib/supabase/storage.ts` — helpers `uploadCvPdf`, `getSignedCvPdfUrl`, `deleteCvPdf` pour le bucket privé `cv-pdfs`.
- Supabase Storage bucket `cv-pdfs` (migration 0009) : privé, 10 Mo max, PDF uniquement, policies RLS admin-only.
- Composants réutilisables : `app/components/ui/TagInput.tsx`, `app/components/ui/DateRangeInput.tsx`.
- Card "Relances à faire" sur `/dashboard` home (candidatures avec `date_relance <= aujourd'hui`).
- Badge "candidatures actives" dans la sidebar dashboard.
- `db/queries/candidatures.ts` : `getAllCandidatures`, `getCandidatureById`, `getRelancesAFaire`, `getCandidaturesCounts`, `getActiveCandidaturesCount`.
- `db/queries/cv.ts` : `getProfile`, `getAllExperiences`, `getAllFormations`, `getAllCompetences`, `getAllSoftSkills`, `getAllLangues`, `getAllCertifications`, `getAllCentresInteret`, `getAllProjetsMeta`.

### Modifié

- Sidebar dashboard : ordre mis à jour (1-Home, 2-CV, 3-Candidatures, 4-Personnaliser, 5-Messages).
- `saveCvConfig` utilise SELECT + UPDATE/INSERT (pas DELETE+INSERT) pour préserver `nom_fichier` (chemin PDF en BDD).

---

## [2.1.2] — 2025-11-01

Dashboard privé complet : pages de gestion, actions serveur, formulaire de contact en BDD et observabilité.

### Ajouté

- **`/dashboard` home** : "morning briefing" — résumé messages non lus, statut actif, items en apprentissage.
- **`/dashboard/personnalize`** : CRUD statuts de disponibilité (activation unique, preview couleur) + CRUD items "En apprentissage" (filtre par statut, modal add/edit, mark as done).
- **`/dashboard/contact_message`** : inbox 3 colonnes (filtres | liste | détail). Optimistic updates sur lecture. Action "Répondre" ouvre `mailto:` avec citation. Filtres par type et statut. URL bookmarkable via `replaceState`.
- **Server Actions** dans `app/dashboard/actions/` : `status.ts`, `learning.ts`, `messages.ts`. Pattern `requireAdmin()` + `revalidatePath` systématique.
- **Schéma BDD `portfolio`** (migrations 0001–0006) : tables `contact_messages`, `status`, `learning_items`. RLS configuré (SELECT public, mutations admin uniquement).
- Formulaire `/contact` branché en BDD (`app/api/contact/route.ts`). Honeypot anti-spam, validation double couche, états bouton animés.
- Statut de disponibilité affiché sur `/contact` depuis `getActiveStatus()`.
- Section "En apprentissage" sur `/skills` depuis `getCurrentLearningItems()`.
- Composants partagés : `Sidebar.tsx`, `DashboardHeader.tsx`, `ToastProvider.tsx`, `ConfirmModal.tsx`, `KeyboardShortcuts.tsx`.
- `app/ConditionalNav.tsx` — Header/Footer masqués sur `/dashboard/*`.
- **Vercel Web Analytics** (`@vercel/analytics`) + **Speed Insights** (`@vercel/speed-insights`) : cookieless, RGPD-compliant, exclu sur `/dashboard/*`. Event custom `contact_form_submitted`.

### Modifié

- `app/layout.tsx` : délègue à `ConditionalNav` pour masquer Header/Footer sur les pages admin.
- `data/learning.ts` migré vers la BDD (`portfolio.learning_items`).

---

## [2.1.1] — 2025-10-01

Intégration Supabase et Drizzle ORM, authentification GitHub OAuth mono-utilisateur.

### Ajouté

- **Authentification** : Supabase Auth + GitHub OAuth, whitelist par UUID (`ADMIN_USER_ID`). `proxy.ts` (remplace `middleware.ts`, déprécié en Next.js 16+) protège `/dashboard/*`. Redirect `/login?error=unauthorized` si UUID non whitelisté.
- **Page `/login`** : bouton "Se connecter avec GitHub", `LoginForm.tsx` client, `LogoutButton.tsx` réutilisable.
- `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/proxy.ts` — clients Supabase pour chaque contexte (browser, server, proxy).
- `app/auth/callback/route.ts` — échange le code OAuth contre une session, redirige vers `/dashboard`.
- **Drizzle ORM** configuré : connexion pooler PostgreSQL (`DATABASE_URL`), direct URL pour migrations (`DIRECT_URL`). Schémas dans `db/schemas/`, migrations dans `db/migrations/`.
- Commandes `db:generate`, `db:migrate`, `db:studio` dans `package.json`.

---

## [2.1.0] — 2025-09-01

Refonte complète du portfolio : migration vers Next.js 16 App Router, TypeScript strict, Tailwind CSS v4 et design system cohérent (tokens CSS, thème clair/sombre).

### Ajouté

- Design system complet : tokens CSS (`--surface`, `--accent`, `--pop-*`), thème clair/sombre persisté via cookie (sans flash).
- Page `/projects` : liste live des dépôts GitHub (propres + contributions), filtres par langage, détail par dépôt (`/projects/[owner]/[repo]`).
- Page `/skills` : grille de compétences par catégorie avec badges de niveau, stats GitHub, détection automatique des frameworks via `package.json`.
- Section "En apprentissage" sur `/skills` (données statiques `data/learning.ts`).
- Page `/about` : intro typewriter façon terminal (sessionStorage, prefers-reduced-motion) + timeline, méthodes de travail, langues, loisirs, credo.
- Support `?lang=` sur `/projects` pour pré-filtrer depuis `/skills`.
- Accessibilité : `<main id="main-content">`, landmarks ARIA, labels explicites.

### Modifié

- Migration complète vers TypeScript (`.ts` / `.tsx`).
- Remplacement de Tailwind CSS v3 + `tailwind.config.js` par Tailwind CSS v4 via `@tailwindcss/postcss`.
- Page `/about` : réécriture complète.
- `/blog` désactivé : redirige vers `/`.

### Supprimé

- Ancien système de projets statiques (`public/projets.json`) remplacé par l'API GitHub.
- Page `/blog` et `/blog/[url]` (conservées mais redirigées).

---

## [1.0.0] — 2024-09-01

Première version publique du portfolio.

### Ajouté

- Pages : accueil, à propos, projets (JSON statique), blog (JSON statique), contact.
- Stack : Next.js 14, JavaScript, Tailwind CSS v3, Framer Motion.
- Timeline parcours, compétences statiques, liens sociaux.
