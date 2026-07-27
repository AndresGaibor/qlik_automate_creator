CREATE TABLE IF NOT EXISTS "configuraciones_oauth_qlik" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_qlik_id" uuid NOT NULL,
	"cliente_id" text NOT NULL,
	"cliente_secreto_cifrado" text NOT NULL,
	"scopes" text[] DEFAULT '{}' NOT NULL,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"verificada_en" timestamp,
	"ultimo_error" text,
	"creado_por_usuario_id" uuid,
	"actualizado_por_usuario_id" uuid,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL
);
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
	CONSTRAINT "solicitudes_idempotentes_unique" UNIQUE("organizacion_id","alcance","clave")
);
--> statement-breakpoint
ALTER TABLE "organizaciones" ADD COLUMN IF NOT EXISTS "creado_en" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organizaciones" ADD COLUMN IF NOT EXISTS "actualizado_en" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sesiones_usuario" ADD COLUMN IF NOT EXISTS "tenant_qlik_activo_id" uuid;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "es_principal" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "automatizacion_base_id_qlik" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "automatizacion_base_nombre" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "destino_api_url" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "destino_api_key" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "destino_base_datos" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "impala_host" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "impala_port" integer;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "impala_auth_mechanism" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "impala_user" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "impala_password" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "impala_database" text;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "es_superadmin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuraciones_oauth_qlik" ADD CONSTRAINT "configuraciones_oauth_qlik_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuraciones_oauth_qlik" ADD CONSTRAINT "configuraciones_oauth_qlik_creado_por_usuario_id_usuarios_id_fk" FOREIGN KEY ("creado_por_usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuraciones_oauth_qlik" ADD CONSTRAINT "configuraciones_oauth_qlik_actualizado_por_usuario_id_usuarios_id_fk" FOREIGN KEY ("actualizado_por_usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "solicitudes_idempotentes" ADD CONSTRAINT "solicitudes_idempotentes_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_configuracion_oauth_por_tenant" ON "configuraciones_oauth_qlik" USING btree ("tenant_qlik_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_eventos_outbox_pendientes" ON "eventos_outbox" USING btree ("publicado_en","ocurrido_en");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_eventos_outbox_agregado" ON "eventos_outbox" USING btree ("agregado_tipo","agregado_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_solicitudes_idempotentes_expira" ON "solicitudes_idempotentes" USING btree ("expira_en");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sesiones_usuario" ADD CONSTRAINT "sesiones_usuario_tenant_qlik_activo_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_activo_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uq_tenant_principal_por_organizacion" ON "tenants_qlik" USING btree ("organizacion_id") WHERE "tenants_qlik"."es_principal" = true;