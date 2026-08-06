CREATE TABLE IF NOT EXISTS "configuracion_espacios_visibles" (
  "tenant_qlik_id" uuid PRIMARY KEY NOT NULL,
  "permitir_recursos_sin_espacio" boolean DEFAULT false NOT NULL,
  "actualizado_en" timestamp DEFAULT now() NOT NULL,
  "actualizado_por_usuario_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "espacios_visibles_usuario_final" (
  "tenant_qlik_id" uuid NOT NULL,
  "espacio_id_qlik" text NOT NULL,
  "creado_en" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "espacios_visibles_usuario_final_unique" UNIQUE("tenant_qlik_id", "espacio_id_qlik")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuracion_espacios_visibles" ADD CONSTRAINT "configuracion_espacios_visibles_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "configuracion_espacios_visibles" ADD CONSTRAINT "configuracion_espacios_visibles_actualizado_por_usuario_id_usuarios_id_fk" FOREIGN KEY ("actualizado_por_usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "espacios_visibles_usuario_final" ADD CONSTRAINT "espacios_visibles_usuario_final_tenant_qlik_id_tenants_qlik_id_fk" FOREIGN KEY ("tenant_qlik_id") REFERENCES "public"."tenants_qlik"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null; END $$;
