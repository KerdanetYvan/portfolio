-- Migration: Création des schémas cv et applications
-- Système de suivi des candidatures + données CV master
-- RLS strict admin-only sur toutes les tables (PII sensibles)

-- ─── Schémas Postgres ─────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS cv;
CREATE SCHEMA IF NOT EXISTS applications;

-- ─── Enums schéma cv ──────────────────────────────────────────────────────────

CREATE TYPE cv.competence_categorie AS ENUM (
  'frontend', 'backend', 'bdd', 'devops', 'autres'
);

CREATE TYPE cv.competence_niveau AS ENUM (
  'daily_driver', 'comfortable', 'familiar', 'exploring'
);

CREATE TYPE cv.langue_niveau AS ENUM (
  'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'natif'
);

-- ─── Enums schéma applications ────────────────────────────────────────────────

CREATE TYPE applications.statut AS ENUM (
  'a_envoyer', 'envoyee', 'entretien_programme', 'en_cours', 'acceptee', 'refusee', 'ghosted'
);

CREATE TYPE applications.type_poste AS ENUM (
  'presentiel', 'remote', 'hybride'
);

CREATE TYPE applications.entretien_type AS ENUM (
  'telephone', 'visio', 'presentiel'
);

CREATE TYPE applications.entretien_status AS ENUM (
  'prevu', 'fait', 'annule'
);

-- ─── Tables schéma cv ─────────────────────────────────────────────────────────

CREATE TABLE cv.profile (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nom           text        NOT NULL,
  prenom        text        NOT NULL,
  titre         text        NOT NULL,
  email         text        NOT NULL,
  telephone     text,
  localisation  text,
  linkedin_url  text,
  github_url    text,
  portfolio_url text,
  bio           text,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cv.experiences (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise    text    NOT NULL,
  poste         text    NOT NULL,
  description   text    NOT NULL,
  date_debut    date    NOT NULL,
  date_fin      date,
  localisation  text,
  technologies  text[],
  ordre         integer NOT NULL DEFAULT 0,
  visible       boolean NOT NULL DEFAULT true
);

CREATE TABLE cv.formations (
  id             uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  etablissement  text    NOT NULL,
  diplome        text    NOT NULL,
  domaine        text,
  date_debut     date    NOT NULL,
  date_fin       date,
  ordre          integer NOT NULL DEFAULT 0,
  visible        boolean NOT NULL DEFAULT true
);

CREATE TABLE cv.competences (
  id        uuid                    PRIMARY KEY DEFAULT gen_random_uuid(),
  nom       text                    NOT NULL,
  categorie cv.competence_categorie NOT NULL,
  niveau    cv.competence_niveau    NOT NULL,
  ordre     integer                 NOT NULL DEFAULT 0,
  visible   boolean                 NOT NULL DEFAULT true
);

CREATE TABLE cv.soft_skills (
  id      uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle text    NOT NULL,
  ordre   integer NOT NULL DEFAULT 0
);

CREATE TABLE cv.langues (
  id     uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  langue text             NOT NULL,
  niveau cv.langue_niveau NOT NULL,
  ordre  integer          NOT NULL DEFAULT 0
);

CREATE TABLE cv.centres_interet (
  id      uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  libelle text    NOT NULL,
  ordre   integer NOT NULL DEFAULT 0
);

CREATE TABLE cv.certifications (
  id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  nom             text    NOT NULL,
  organisme       text    NOT NULL,
  date_obtention  date    NOT NULL,
  url             text,
  ordre           integer NOT NULL DEFAULT 0,
  visible         boolean NOT NULL DEFAULT true
);

CREATE TABLE cv.projets_meta (
  id           uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  nom          text    NOT NULL,
  description  text    NOT NULL,
  technologies text[],
  url_demo     text,
  url_repo     text,
  ordre        integer NOT NULL DEFAULT 0,
  visible      boolean NOT NULL DEFAULT true
);

-- ─── Tables schéma applications ───────────────────────────────────────────────

CREATE TABLE applications.candidatures (
  id               uuid                    PRIMARY KEY DEFAULT gen_random_uuid(),
  entreprise       text                    NOT NULL,
  poste            text                    NOT NULL,
  type_poste       applications.type_poste NOT NULL,
  localisation     text,
  url_offre        text,
  statut           applications.statut     NOT NULL DEFAULT 'a_envoyer',
  date_candidature date,
  date_relance     date,
  salaire_cible    integer,
  notes            text,
  created_at       timestamptz             NOT NULL DEFAULT now(),
  updated_at       timestamptz             NOT NULL DEFAULT now()
);

CREATE TABLE applications.candidature_cv (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  candidature_id uuid        NOT NULL REFERENCES applications.candidatures(id) ON DELETE CASCADE,
  contenu_json   jsonb       NOT NULL,
  nom_fichier    text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE applications.entretiens (
  id             uuid                          PRIMARY KEY DEFAULT gen_random_uuid(),
  candidature_id uuid                          NOT NULL REFERENCES applications.candidatures(id) ON DELETE CASCADE,
  type           applications.entretien_type   NOT NULL,
  status         applications.entretien_status NOT NULL DEFAULT 'prevu',
  date_entretien timestamptz                   NOT NULL,
  contact        text,
  notes          text,
  created_at     timestamptz                   NOT NULL DEFAULT now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE cv.profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.experiences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.formations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.competences      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.soft_skills      ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.langues          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.centres_interet  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.certifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv.projets_meta     ENABLE ROW LEVEL SECURITY;

ALTER TABLE applications.candidatures   ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications.candidature_cv ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications.entretiens     ENABLE ROW LEVEL SECURITY;

-- ─── Policies admin-only ──────────────────────────────────────────────────────
-- Une policy FOR ALL par table couvre SELECT/INSERT/UPDATE/DELETE.
-- USING      : filtre les lignes accessibles en lecture.
-- WITH CHECK : valide les données écrites en INSERT/UPDATE.

CREATE POLICY "admin_all_cv_profile" ON cv.profile
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_experiences" ON cv.experiences
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_formations" ON cv.formations
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_competences" ON cv.competences
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_soft_skills" ON cv.soft_skills
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_langues" ON cv.langues
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_centres_interet" ON cv.centres_interet
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_certifications" ON cv.certifications
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_cv_projets_meta" ON cv.projets_meta
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_candidatures" ON applications.candidatures
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_candidature_cv" ON applications.candidature_cv
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);

CREATE POLICY "admin_all_entretiens" ON applications.entretiens
  FOR ALL TO authenticated
  USING      (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);
