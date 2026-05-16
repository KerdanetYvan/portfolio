import { pgSchema, uuid, text, timestamp } from 'drizzle-orm/pg-core';

const portfolio = pgSchema('portfolio');

export const typeDemandeEnum = portfolio.enum('type_demande', [
  'alternance',
  'mission_freelance',
  'question',
  'autre',
]);

export const statutContactEnum = portfolio.enum('statut_contact', [
  'non_lu',
  'lu',
  'repondu',
  'archive',
]);

export const contactMessages = portfolio.table('contact_messages', {
  id:               uuid('id').primaryKey().defaultRandom(),
  nom:              text('nom').notNull(),
  email:            text('email').notNull(),
  type_demande:     typeDemandeEnum('type_demande').notNull(),
  entreprise:       text('entreprise'),
  message:          text('message').notNull(),
  date_reception:   timestamp('date_reception', { withTimezone: true }).defaultNow().notNull(),
  statut:           statutContactEnum('statut').default('non_lu').notNull(),
});

export type ContactMessage    = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
