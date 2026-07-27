CREATE TABLE IF NOT EXISTS "app_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clave" text NOT NULL,
	"valor" jsonb NOT NULL,
	"actualizado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_config_clave_unique" UNIQUE("clave")
);

ALTER TABLE "tenants_qlik"
  ADD COLUMN IF NOT EXISTS "destino_api_key_cifrada" text,
  ADD COLUMN IF NOT EXISTS "impala_password_cifrada" text;

ALTER TABLE "tenants_qlik"
  DROP COLUMN IF EXISTS "destino_api_key",
  DROP COLUMN IF EXISTS "impala_password";
