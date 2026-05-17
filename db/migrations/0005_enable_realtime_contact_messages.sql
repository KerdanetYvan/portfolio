-- Migration: activer Realtime sur portfolio.contact_messages
-- Ajoute la table à la publication supabase_realtime pour que les
-- événements INSERT soient diffusés aux clients connectés.
-- La RLS SELECT (admin uniquement) est déjà en place (migration 0001).

ALTER PUBLICATION supabase_realtime ADD TABLE portfolio.contact_messages;
