-- Alinea el constraint de tipo de conexiones_destino con el dominio (TIPOS_DESTINO) y la migración 0010.
-- El constraint vigente en bases desactualizadas omitía 'impala', rechazando destinos de Impala válidos.

ALTER TABLE "conexiones_destino" DROP CONSTRAINT "conexiones_destino_tipo_check";--> statement-breakpoint

ALTER TABLE "conexiones_destino" ADD CONSTRAINT "conexiones_destino_tipo_check" CHECK ("tipo" IN ('impala', 'postgres', 'bigquery', 'sftp'));--> statement-breakpoint
