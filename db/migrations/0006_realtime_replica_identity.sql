-- Migration: REPLICA IDENTITY FULL sur portfolio.contact_messages
-- Requis par Supabase Realtime quand le RLS est activé sur la table.
-- Sans cette configuration, le serveur Realtime ne peut pas évaluer
-- les policies RLS sur les événements INSERT/UPDATE/DELETE et les abandonne.

ALTER TABLE portfolio.contact_messages REPLICA IDENTITY FULL;
