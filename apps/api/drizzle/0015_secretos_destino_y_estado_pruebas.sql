ALTER TABLE "conexiones_origen"
  ADD COLUMN IF NOT EXISTS "estado" text NOT NULL DEFAULT 'sin_probar';

ALTER TABLE "conexiones_origen"
  ADD COLUMN IF NOT EXISTS "probada_en" timestamp;

ALTER TABLE "conexiones_origen"
  ADD COLUMN IF NOT EXISTS "mensaje_error" text;

ALTER TABLE "conexiones_destino"
  ADD COLUMN IF NOT EXISTS "probada_en" timestamp;

CREATE TABLE IF NOT EXISTS "secretos_conexion_destino" (
  "conexion_destino_id" uuid NOT NULL REFERENCES "conexiones_destino"("id") ON DELETE CASCADE,
  "nombre" text NOT NULL,
  "valor_cifrado" text NOT NULL,
  "creado_en" timestamp NOT NULL DEFAULT now(),
  "actualizado_en" timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_secreto_conexion_destino_nombre"
  ON "secretos_conexion_destino" ("conexion_destino_id", "nombre");
