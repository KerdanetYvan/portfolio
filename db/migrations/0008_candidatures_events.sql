-- Migration 0008 : ajout colonnes candidatures + table events

-- 1. Nouvelles colonnes sur candidatures
ALTER TABLE applications.candidatures ADD COLUMN IF NOT EXISTS detail_offre     text;
ALTER TABLE applications.candidatures ADD COLUMN IF NOT EXISTS contact_nom      text;
ALTER TABLE applications.candidatures ADD COLUMN IF NOT EXISTS contact_email    text;
ALTER TABLE applications.candidatures ADD COLUMN IF NOT EXISTS contact_linkedin text;
ALTER TABLE applications.candidatures ADD COLUMN IF NOT EXISTS relance_effectuee boolean NOT NULL DEFAULT false;

-- 2. Enum pour le type d'événement timeline
CREATE TYPE applications.event_type AS ENUM (
  'created',
  'sent',
  'status_changed',
  'entretien_scheduled',
  'entretien_done',
  'relance_done',
  'note_added'
);

-- 3. Table events (timeline historisée)
CREATE TABLE IF NOT EXISTS applications.events (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  candidature_id uuid        NOT NULL REFERENCES applications.candidatures(id) ON DELETE CASCADE,
  type           applications.event_type NOT NULL,
  description    text,
  date           timestamptz NOT NULL DEFAULT now(),
  metadata       jsonb
);

-- 4. RLS
ALTER TABLE applications.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_only_events"
  ON applications.events
  FOR ALL
  TO authenticated
  USING  (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid)
  WITH CHECK (auth.uid() = '4c833b4d-a6d4-4420-b2d9-f453571f9e80'::uuid);
