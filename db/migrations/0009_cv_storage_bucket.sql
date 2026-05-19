-- Création du bucket Supabase Storage pour les PDF de CV
-- Policies RLS : à créer manuellement depuis Supabase SQL Editor
-- (le rôle de migration n'a pas les droits sur storage.objects)
-- Note : le service role key bypass RLS, les policies sont optionnelles

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-pdfs',
  'cv-pdfs',
  false,
  10485760,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;
