ALTER TABLE "usuarios"
  ADD COLUMN IF NOT EXISTS "es_superadmin" boolean DEFAULT false NOT NULL;

ALTER TABLE "configuraciones_oauth_qlik"
  ADD COLUMN IF NOT EXISTS "secreto_sufijo" text;

UPDATE "configuraciones_oauth_qlik"
SET "secreto_sufijo" = '????'
WHERE "secreto_sufijo" IS NULL;

ALTER TABLE "configuraciones_oauth_qlik"
  ALTER COLUMN "secreto_sufijo" SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE "configuraciones_oauth_qlik"
    ADD CONSTRAINT "configuraciones_oauth_estado_check"
    CHECK ("estado" IN ('pendiente', 'verificada', 'error', 'desactivada'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "uq_configuracion_oauth_por_tenant"
  ON "configuraciones_oauth_qlik" USING btree ("tenant_qlik_id");