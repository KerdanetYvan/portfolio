import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env' });

export default defineConfig({
  schema:       './db/schemas/**/*.ts',
  out:          './db/migrations',
  dialect:      'postgresql',
  schemaFilter: ['portfolio', 'cv', 'applications'],
  dbCredentials: {
    url: process.env.DIRECT_URL!, // URL directe (pas le pooler) pour les migrations
  },
});
