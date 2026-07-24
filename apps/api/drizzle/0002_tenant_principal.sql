ALTER TABLE "tenants_qlik"
  ADD COLUMN IF NOT EXISTS "es_principal" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_tenant_principal_por_organizacion"
  ON "tenants_qlik" ("organizacion_id")
  WHERE "es_principal" = true;
