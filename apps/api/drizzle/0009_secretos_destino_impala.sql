-- Añade almacenamiento cifrado sin eliminar las columnas heredadas. La aplicación
-- cifra y limpia los valores heredados al siguiente guardado, evitando pérdida de datos.
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "destino_api_key_cifrada" text;--> statement-breakpoint
ALTER TABLE "tenants_qlik" ADD COLUMN IF NOT EXISTS "impala_password_cifrada" text;
