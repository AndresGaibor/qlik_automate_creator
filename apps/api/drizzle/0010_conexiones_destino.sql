-- Conexiones de destino configurables por organización y tipo (Impala, PostgreSQL, BigQuery, SFTP).
-- Mantiene las columnas heredadas impala_* en tenants_qlik para compatibilidad temporal.

CREATE TABLE IF NOT EXISTS "conexiones_destino" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organizacion_id" uuid NOT NULL REFERENCES "organizaciones"("id") ON DELETE CASCADE,
  "tenant_qlik_id" uuid REFERENCES "tenants_qlik"("id") ON DELETE SET NULL,
  "tipo" text NOT NULL CHECK ("tipo" IN ('impala', 'postgres', 'bigquery', 'sftp')),
  "nombre" text NOT NULL,
  "config" jsonb NOT NULL DEFAULT '{}',
  "secreto_refs" jsonb NOT NULL DEFAULT '{}',
  "estado" text NOT NULL DEFAULT 'activo' CHECK ("estado" IN ('activo', 'error', 'desconectado')),
  "mensaje_error" text,
  "creado_en" timestamptz NOT NULL DEFAULT now(),
  "actualizado_en" timestamptz NOT NULL DEFAULT now()
);--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "uq_conexion_por_org_nombre"
  ON "conexiones_destino"("organizacion_id", "tipo", "nombre");--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_conexiones_tipo"
  ON "conexiones_destino"("tipo");--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_conexiones_estado"
  ON "conexiones_destino"("estado");--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_conexiones_tenant"
  ON "conexiones_destino"("tenant_qlik_id")
  WHERE "tenant_qlik_id" IS NOT NULL;
