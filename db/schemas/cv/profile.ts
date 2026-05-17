import { pgSchema, uuid, text, timestamp } from 'drizzle-orm/pg-core';

const cv = pgSchema('cv');

export const profile = cv.table('profile', {
  id:            uuid('id').primaryKey().defaultRandom(),
  nom:           text('nom').notNull(),
  prenom:        text('prenom').notNull(),
  titre:         text('titre').notNull(),
  email:         text('email').notNull(),
  telephone:     text('telephone'),
  localisation:  text('localisation'),
  linkedin_url:  text('linkedin_url'),
  github_url:    text('github_url'),
  portfolio_url: text('portfolio_url'),
  bio:           text('bio'),
  updated_at:    timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Profile    = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
