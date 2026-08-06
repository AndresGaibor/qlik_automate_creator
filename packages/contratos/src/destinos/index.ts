import { z } from "zod";

export const esquemaTipoDestino = z.enum([
  "impala",
  "postgres",
  "bigquery",
  "sftp",
]);
export type TipoDestino = z.infer<typeof esquemaTipoDestino>;

export const esquemaCapacidadesDestino = z.object({
  listarRecursos: z.boolean(),
  esquema: z.boolean(),
  conteoRegistros: z.boolean(),
  vistaPrevia: z.boolean(),
  escritura: z.boolean(),
});
export type CapacidadesDestino = z.infer<typeof esquemaCapacidadesDestino>;

export const esquemaRecursoDestino = z.object({
  id: z.string(),
  nombre: z.string(),
  tipo: z.enum(["tabla", "dataset", "archivo", "carpeta"]),
  espacioDeNombres: z.string().optional(),
  ruta: z.string().optional(),
  columnas: z
    .array(z.object({ nombre: z.string(), tipo: z.string() }))
    .optional(),
  metadatos: z.record(z.unknown()).default({}),
});
export type RecursoDestino = z.infer<typeof esquemaRecursoDestino>;

export const esquemaDetalleRecursoDestino = esquemaRecursoDestino.extend({
  totalFilas: z.number().optional(),
  actualizadoEn: z.string(),
});
export type DetalleRecursoDestino = z.infer<
  typeof esquemaDetalleRecursoDestino
>;

export const esquemaConexionDestino = z.object({
  id: z.string(),
  tipo: esquemaTipoDestino,
  nombre: z.string(),
  estado: z.enum(["activo", "error", "desconectado"]),
  mensajeError: z.string().nullable().optional(),
  probadaEn: z.string().datetime().nullable().optional(),
});
export type ConexionDestino = z.infer<typeof esquemaConexionDestino>;

export const esquemaCrearConexionDestino = z.object({
  tipo: esquemaTipoDestino,
  nombre: z.string().min(1).max(255),
  config: z.record(z.unknown()),
});
export type CrearConexionDestino = z.infer<typeof esquemaCrearConexionDestino>;

export const esquemaConfigImpala = z.object({
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535).default(21050),
  authMechanism: z
    .enum(["NOSASL", "PLAIN", "LDAP", "KERBEROS"])
    .default("NOSASL"),
  user: z.string().optional(),
  password: z.string().optional(),
  database: z.string().default("default"),
});

export const esquemaConfigPostgres = z.object({
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535).default(5432),
  ssl: z.boolean().default(false),
  database: z.string().min(1),
  user: z.string().min(1),
  password: z.string(),
  schema: z.string().default("public"),
});

export const esquemaConfigBigQuery = z.object({
  projectId: z.string().min(1),
  dataset: z.string().min(1),
  keyFilename: z.string().optional(),
});

export const esquemaConfigSftp = z.object({
  host: z.string().min(1),
  port: z.number().int().min(1).max(65535).default(22),
  user: z.string().min(1),
  password: z.string().optional(),
  privateKey: z.string().optional(),
  rutaBase: z.string().default("/"),
});
