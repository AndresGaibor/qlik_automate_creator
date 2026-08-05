CREATE TABLE IF NOT EXISTS "conexiones_origen" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "organizacion_id" uuid NOT NULL REFERENCES "organizaciones"("id") ON DELETE CASCADE,
  "tipo" text NOT NULL CHECK ("tipo" IN ('jdbc', 'sftp')),
  "nombre" text NOT NULL,
  "config" jsonb NOT NULL DEFAULT '{}',
  "creado_en" timestamptz NOT NULL DEFAULT now(),
  "actualizado_en" timestamptz NOT NULL DEFAULT now()
);--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "uq_conexion_origen_por_org_nombre"
  ON "conexiones_origen"("organizacion_id", "tipo", "nombre");--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "idx_conexiones_origen_organizacion"
  ON "conexiones_origen"("organizacion_id");
