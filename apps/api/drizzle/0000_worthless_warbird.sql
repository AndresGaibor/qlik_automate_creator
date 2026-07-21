CREATE TABLE IF NOT EXISTS "auditoria_eventos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid,
	"usuario_id" uuid,
	"accion" text NOT NULL,
	"entidad_tipo" text,
	"entidad_id" text,
	"resultado" text NOT NULL,
	"datos_anteriores" jsonb,
	"datos_nuevos" jsonb,
	"codigo_error" text,
	"mensaje_error" text,
	"ip" text,
	"agente_usuario" text,
	"id_solicitud" text,
	"creado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "automatizaciones_qlik_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_qlik_id" uuid NOT NULL,
	"automatizacion_id_qlik" text NOT NULL,
	"espacio_id_qlik" text,
	"propietario_id_qlik" text,
	"nombre" text NOT NULL,
	"estado" text,
	"modo_ejecucion" text,
	"ultimo_estado_ejecucion" text,
	"ultima_ejecucion_en" timestamp,
	"creada_en_qlik" timestamp,
	"modificada_en_qlik" timestamp,
	"metadatos" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"sincronizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp,
	CONSTRAINT "automatizaciones_unique" UNIQUE("tenant_qlik_id","automatizacion_id_qlik")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "configuraciones_automatizacion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"tenant_qlik_id" uuid NOT NULL,
	"creado_por_usuario_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"flujo_id_qlik" text NOT NULL,
	"flujo_nombre_snapshot" text NOT NULL,
	"flujo_espacio_id_qlik" text,
	"destino_proveedor" text NOT NULL,
	"destino_id_externo" text NOT NULL,
	"destino_nombre_snapshot" text NOT NULL,
	"automatizacion_id_qlik" text,
	"automatizacion_nombre_snapshot" text,
	"programar" boolean DEFAULT false NOT NULL,
	"estado" text DEFAULT 'pendiente' NOT NULL,
	"mensaje_error" text,
	"clave_idempotencia" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "configuraciones_automatizacion_clave_idempotencia_unique" UNIQUE("clave_idempotencia")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "credenciales_qlik" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identidad_qlik_id" uuid NOT NULL,
	"token_acceso_cifrado" text NOT NULL,
	"token_refresco_cifrado" text,
	"scopes" text[] DEFAULT '{}' NOT NULL,
	"token_expira_en" timestamp NOT NULL,
	"estado" text DEFAULT 'activa' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "credenciales_qlik_identidad_qlik_id_unique" UNIQUE("identidad_qlik_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "destinos_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"proveedor" text NOT NULL,
	"id_externo" text NOT NULL,
	"conexion_externa_id" text,
	"nombre_conexion" text,
	"base_datos" text,
	"esquema" text,
	"tabla" text NOT NULL,
	"nombre_mostrado" text NOT NULL,
	"metadatos" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"hash_contenido" text,
	"activo" boolean DEFAULT true NOT NULL,
	"sincronizado_en" timestamp DEFAULT now() NOT NULL,
	"expira_cache_en" timestamp,
	CONSTRAINT "destinos_unique" UNIQUE("organizacion_id","proveedor","id_externo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "espacios_qlik_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_qlik_id" uuid NOT NULL,
	"espacio_id_qlik" text NOT NULL,
	"nombre" text NOT NULL,
	"tipo" text,
	"propietario_id_qlik" text,
	"metadatos" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"modificado_en_qlik" timestamp,
	"sincronizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp,
	CONSTRAINT "espacios_unique" UNIQUE("tenant_qlik_id","espacio_id_qlik")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flujos_qlik_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_qlik_id" uuid NOT NULL,
	"flujo_id_qlik" text NOT NULL,
	"espacio_id_qlik" text,
	"nombre" text NOT NULL,
	"propietario_id_qlik" text,
	"url_qlik" text,
	"tipo_recurso" text,
	"metadatos" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"modificado_en_qlik" timestamp,
	"sincronizado_en" timestamp DEFAULT now() NOT NULL,
	"eliminado_en" timestamp,
	CONSTRAINT "flujos_unique" UNIQUE("tenant_qlik_id","flujo_id_qlik")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "identidades_qlik" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"tenant_qlik_id" uuid NOT NULL,
	"usuario_id_qlik" text NOT NULL,
	"sujeto_qlik" text,
	"nombre_qlik" text,
	"correo_qlik" text,
	"avatar_qlik" text,
	"estado_qlik" text,
	"sincronizado_en" timestamp DEFAULT now() NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "identidades_unique" UNIQUE("tenant_qlik_id","usuario_id_qlik")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "intentos_oauth_qlik" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"host_tenant" text NOT NULL,
	"hash_estado" text NOT NULL,
	"verificador_pkce_cifrado" text NOT NULL,
	"ruta_retorno" text DEFAULT '/' NOT NULL,
	"expira_en" timestamp NOT NULL,
	"consumido_en" timestamp,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "intentos_oauth_qlik_hash_estado_unique" UNIQUE("hash_estado")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "membresias_organizacion" (
	"organizacion_id" uuid NOT NULL,
	"usuario_id" uuid NOT NULL,
	"rol" text DEFAULT 'usuario' NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "membresias_pk" UNIQUE("organizacion_id","usuario_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizaciones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"estado" text DEFAULT 'activa' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "programaciones_automatizacion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"configuracion_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"expresion_cron" text,
	"zona_horaria" text DEFAULT 'America/Guayaquil' NOT NULL,
	"programacion_id_qlik" text,
	"activa" boolean DEFAULT true NOT NULL,
	"proxima_ejecucion_en" timestamp,
	"ultima_ejecucion_en" timestamp,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "programaciones_automatizacion_configuracion_id_unique" UNIQUE("configuracion_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sesiones_usuario" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"identidad_qlik_id" uuid NOT NULL,
	"token_sesion_hash" text NOT NULL,
	"ip_creacion" text,
	"agente_usuario" text,
	"expira_en" timestamp NOT NULL,
	"revocada_en" timestamp,
	"creada_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sesiones_usuario_token_sesion_hash_unique" UNIQUE("token_sesion_hash")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants_qlik" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organizacion_id" uuid NOT NULL,
	"tenant_id_qlik" text NOT NULL,
	"host" text NOT NULL,
	"nombre" text,
	"estado" text DEFAULT 'activo' NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_tenant_id_unique" UNIQUE("tenant_id_qlik"),
	CONSTRAINT "tenants_host_unique" UNIQUE("host")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"correo" text,
	"avatar_url" text,
	"estado" text DEFAULT 'activo' NOT NULL,
	"ultimo_acceso_en" timestamp,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditoria_eventos" ADD CONSTRAINT "auditoria_eventos_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditoria_eventos" ADD CONSTRAINT "auditoria_eventos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "automatizaciones_qlik_cache" ADD CONSTRAINT "automatizaciones_qlik_cache_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuraciones_automatizacion" ADD CONSTRAINT "configuraciones_automatizacion_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuraciones_automatizacion" ADD CONSTRAINT "configuraciones_automatizacion_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuraciones_automatizacion" ADD CONSTRAINT "configuraciones_automatizacion_creado_por_usuario_id_usuarios_id_fk" FOREIGN KEY ("creado_por_usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "credenciales_qlik" ADD CONSTRAINT "credenciales_qlik_identidad_qlik_id_identidades_qlik_id_fk" FOREIGN KEY ("identidad_qlik_id") REFERENCES "public"."identidades_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "destinos_cache" ADD CONSTRAINT "destinos_cache_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "espacios_qlik_cache" ADD CONSTRAINT "espacios_qlik_cache_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "flujos_qlik_cache" ADD CONSTRAINT "flujos_qlik_cache_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "identidades_qlik" ADD CONSTRAINT "identidades_qlik_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "identidades_qlik" ADD CONSTRAINT "identidades_qlik_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "membresias_organizacion" ADD CONSTRAINT "membresias_organizacion_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "membresias_organizacion" ADD CONSTRAINT "membresias_organizacion_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "programaciones_automatizacion" ADD CONSTRAINT "programaciones_automatizacion_configuracion_id_configuraciones_automatizacion_id_fk" FOREIGN KEY ("configuracion_id") REFERENCES "public"."configuraciones_automatizacion"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sesiones_usuario" ADD CONSTRAINT "sesiones_usuario_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sesiones_usuario" ADD CONSTRAINT "sesiones_usuario_identidad_qlik_id_identidades_qlik_id_fk" FOREIGN KEY ("identidad_qlik_id") REFERENCES "public"."identidades_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tenants_qlik" ADD CONSTRAINT "tenants_qlik_organizacion_id_organizaciones_id_fk" FOREIGN KEY ("organizacion_id") REFERENCES "public"."organizaciones"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_auditoria_org_fecha" ON "auditoria_eventos" USING btree ("organizacion_id","creado_en");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_auditoria_usuario_fecha" ON "auditoria_eventos" USING btree ("usuario_id","creado_en");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_configuraciones_tenant" ON "configuraciones_automatizacion" USING btree ("tenant_qlik_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_configuraciones_flujo" ON "configuraciones_automatizacion" USING btree ("tenant_qlik_id","flujo_id_qlik");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_configuraciones_automatizacion" ON "configuraciones_automatizacion" USING btree ("tenant_qlik_id","automatizacion_id_qlik");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_intentos_oauth_expira" ON "intentos_oauth_qlik" USING btree ("expira_en");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sesiones_usuario_usuario" ON "sesiones_usuario" USING btree ("usuario_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sesiones_usuario_expira" ON "sesiones_usuario" USING btree ("expira_en");