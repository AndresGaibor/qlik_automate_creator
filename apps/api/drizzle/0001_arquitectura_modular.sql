CREATE TABLE IF NOT EXISTS "solicitudes_idempotentes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "organizacion_id" uuid NOT NULL,
  "alcance" text NOT NULL,
  "clave" text NOT NULL,
  "hash_solicitud" text NOT NULL,
  "estado" text DEFAULT 'procesando' NOT NULL,
  "estado_http" integer,
  "respuesta" jsonb,
  "expira_en" timestamp NOT NULL,
  "creado_en" timestamp DEFAULT now() NOT NULL,
  "actualizado_en" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "solicitudes_idempotentes_unique" UNIQUE("organizacion_id", "alcance", "clave"),
  CONSTRAINT "solicitudes_idempotentes_estado_check" CHECK ("estado" IN ('procesando', 'completada', 'fallida'))
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_solicitudes_idempotentes_expira" ON "solicitudes_idempotentes" ("expira_en");
--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "solicitudes_idempotentes"
    ADD CONSTRAINT "solicitudes_idempotentes_organizacion_id_organizaciones_id_fk"
    FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id")
    ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "eventos_outbox" (
  "id" uuid PRIMARY KEY NOT NULL,
  "agregado_tipo" text NOT NULL,
  "agregado_id" text NOT NULL,
  "tipo" text NOT NULL,
  "version" integer DEFAULT 1 NOT NULL,
  "datos" jsonb NOT NULL,
  "metadatos" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "ocurrido_en" timestamp NOT NULL,
  "publicado_en" timestamp,
  "intentos" integer DEFAULT 0 NOT NULL,
  "ultimo_error" text,
  "creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_eventos_outbox_pendientes" ON "eventos_outbox" ("publicado_en", "ocurrido_en");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_eventos_outbox_agregado" ON "eventos_outbox" ("agregado_tipo", "agregado_id");
