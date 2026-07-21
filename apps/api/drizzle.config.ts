import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infraestructura/base-datos/esquema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
