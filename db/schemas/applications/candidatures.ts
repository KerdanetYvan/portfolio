import { pgSchema, uuid, text, date, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

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
  id:                uuid('id').primaryKey().defaultRandom(),
  entreprise:        text('entreprise').notNull(),
  poste:             text('poste').notNull(),
  type_poste:        typePosteEnum('type_poste').notNull(),
  localisation:      text('localisation'),
  url_offre:         text('url_offre'),
  detail_offre:      text('detail_offre'),
  statut:            statutCandidatureEnum('statut').default('a_envoyer').notNull(),
  date_candidature:  date('date_candidature'),       // date d'envoi
  date_relance:      date('date_relance'),            // date relance prévue
  relance_effectuee: boolean('relance_effectuee').default(false).notNull(),
  contact_nom:       text('contact_nom'),
  contact_email:     text('contact_email'),
  contact_linkedin:  text('contact_linkedin'),
  salaire_cible:     integer('salaire_cible'),        // en k€/an
  notes:             text('notes'),
  created_at:        timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at:        timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Candidature    = typeof candidatures.$inferSelect;
export type NewCandidature = typeof candidatures.$inferInsert;
