import { pgSchema, uuid, text, date, integer, timestamp } from 'drizzle-orm/pg-core';

const applications = pgSchema('applications');

export const statutCandidatureEnum = applications.enum('statut', [
  'a_envoyer',
  'envoyee',
  'entretien_programme',
  'en_cours',
  'acceptee',
  'refusee',
  'ghosted',
]);

export const typePosteEnum = applications.enum('type_poste', [
  'presentiel',
  'remote',
  'hybride',
]);

export const candidatures = applications.table('candidatures', {
  id:               uuid('id').primaryKey().defaultRandom(),
  entreprise:       text('entreprise').notNull(),
  poste:            text('poste').notNull(),
  type_poste:       typePosteEnum('type_poste').notNull(),
  localisation:     text('localisation'),
  url_offre:        text('url_offre'),
  statut:           statutCandidatureEnum('statut').default('a_envoyer').notNull(),
  date_candidature: date('date_candidature'),
  date_relance:     date('date_relance'),
  salaire_cible:    integer('salaire_cible'),   // en k€/an
  notes:            text('notes'),
  created_at:       timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at:       timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Candidature    = typeof candidatures.$inferSelect;
export type NewCandidature = typeof candidatures.$inferInsert;
