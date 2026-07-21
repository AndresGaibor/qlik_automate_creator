import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/infraestructura/base-datos/esquema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: DATABASE_URL is required for drizzle CLI
    url: process.env.DATABASE_URL!,
  },
});
