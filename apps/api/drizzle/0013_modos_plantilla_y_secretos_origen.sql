ALTER TABLE "tenants_qlik"
  -- ADD COLUMN "automatizacion_plantilla_modo_1_id_qlik" text
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_1_id_qlik" text,
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_1_nombre" text,
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_2_id_qlik" text,
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_2_nombre" text;--> statement-breakpoint

UPDATE "tenants_qlik"
SET
  "automatizacion_plantilla_modo_1_id_qlik" = COALESCE("automatizacion_plantilla_modo_1_id_qlik", "automatizacion_base_id_qlik"),
  "automatizacion_plantilla_modo_1_nombre" = COALESCE("automatizacion_plantilla_modo_1_nombre", "automatizacion_base_nombre");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "configuraciones_plataforma" (
  "id" integer PRIMARY KEY CHECK ("id" = 1),
  "modo_automatizacion_activo" smallint NOT NULL DEFAULT 1 CHECK ("modo_automatizacion_activo" IN (1, 2)),
  "actualizado_en" timestamptz NOT NULL DEFAULT now(),
  "actualizado_por_usuario_id" uuid REFERENCES "usuarios"("id") ON DELETE SET NULL
);--> statement-breakpoint

INSERT INTO "configuraciones_plataforma" ("id", "modo_automatizacion_activo")
VALUES (1, 1)
ON CONFLICT DO NOTHING;--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "secretos_conexion_origen" (
  "conexion_origen_id" uuid NOT NULL REFERENCES "conexiones_origen"("id") ON DELETE CASCADE,
  "nombre" text NOT NULL,
  "valor_cifrado" text NOT NULL,
  "creado_en" timestamptz NOT NULL DEFAULT now(),
  "actualizado_en" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "uq_secreto_conexion_origen_nombre" UNIQUE ("conexion_origen_id", "nombre")
);
