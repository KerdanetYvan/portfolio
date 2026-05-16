import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({ path: '.env.local' });

export default defineConfig({
  schema:       './db/schemas/**/*.ts',
  out:          './db/migrations',
  dialect:      'postgresql',
  schemaFilter: ['portfolio'],
  dbCredentials: {
    url: process.env.DIRECT_URL!, // URL directe (pas le pooler) pour les migrations
  },
});
