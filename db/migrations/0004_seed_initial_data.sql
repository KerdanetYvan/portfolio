-- Seeding des données initiales
-- Les INSERTs passent en superuser (postgres) via DATABASE_URL pooler → bypass RLS automatique

-- 1. portfolio.status — 4 statuts, 1 seul actif à la fois
INSERT INTO portfolio.status (statut_code, libelle, couleur, actif) VALUES
  ('recherche', '🟢 En recherche active d''alternance (Nov. 2026) — boîte mail grande ouverte', 'vert',  true),
  ('cale',      '🟡 Alternance calée — toujours partant pour échanger',                         'jaune', false),
  ('occupe',    '🟡 En stage / en projet — réponses possibles mais plus lentes',                'jaune', false),
  ('pause',     '🔴 Tranquillement en pause',                                                    'rouge', false);

-- 2. portfolio.learning_items — 3 items en cours
INSERT INTO portfolio.learning_items (nom, categorie, description, date_debut, lien, statut, ordre) VALUES
  ('PostgreSQL avancé', 'Backend', 'Index, transactions, requêtes complexes et optimisation des performances.', '2025-03-01', NULL, 'en_cours', 1),
  ('Auth.js',           'Backend', 'Authentification JWT par credentials pour protéger les routes /dashboard.',  '2025-05-01', NULL, 'en_cours', 2),
  ('Three.js',          'Frontend', 'Scènes 3D interactives dans le navigateur avec WebGL, géométries et shaders de base.', '2025-04-01', NULL, 'en_cours', 3);