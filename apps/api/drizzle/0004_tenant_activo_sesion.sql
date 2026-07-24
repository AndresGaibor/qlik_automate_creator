ALTER TABLE "sesiones_usuario"
  ADD COLUMN IF NOT EXISTS "tenant_qlik_activo_id" uuid;
--> statement-breakpoint
UPDATE "sesiones_usuario" s
SET "tenant_qlik_activo_id" = i."tenant_qlik_id"
FROM "identidades_qlik" i
WHERE i."id" = s."identidad_qlik_id"
  AND s."tenant_qlik_activo_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "sesiones_usuario"
  ALTER COLUMN "tenant_qlik_activo_id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sesiones_usuario" ADD CONSTRAINT "sesiones_tenant_activo_fk"
 FOREIGN KEY ("tenant_qlik_activo_id") REFERENCES "tenants_qlik"("id") ON DELETE cascade;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
