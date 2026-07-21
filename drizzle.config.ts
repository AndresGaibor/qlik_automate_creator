import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/api/src/infraestructura/base-datos/esquema.ts",
  out: "./apps/api/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://localhost:5432/qlik_automatizaciones",
  },
});
