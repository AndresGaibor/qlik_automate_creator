import { z } from "zod";

export const esquemaEstadoRequisitoConexion = z.enum([
  "faltante",
  "incompleta",
  "sin_probar",
  "disponible",
  "error",
]);

export const esquemaRequisitoConexionOrigen = z.object({
  tipo: z.enum(["jdbc", "sftp"]),
  nombre: z.string().min(1),
  estado: esquemaEstadoRequisitoConexion,
  conexionId: z.string().uuid().nullable(),
  probadaEn: z.string().datetime().nullable(),
  mensaje: z.string().nullable(),
});

export const esquemaDestinoPostgresPreflight = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  estado: z.enum(["activo", "error", "desconectado"]),
  probadoEn: z.string().datetime().nullable(),
  mensaje: z.string().nullable(),
});

export const esquemaPreflightAutomatizacion = z.object({
  flujo: z.object({ id: z.string(), nombre: z.string() }),
  conexionesRequeridas: z.array(esquemaRequisitoConexionOrigen),
  destinosPostgres: z.array(esquemaDestinoPostgresPreflight),
});

export const esquemaEntradaCrearModo1 = z.object({
  nombre: z.string().trim().min(1).max(255),
  flujoId: z.string().min(1),
  destinoId: z.string().uuid(),
  espacioIdQlik: z.string().optional(),
  claveIdempotencia: z.string().trim().min(8).max(255).optional(),
});

export type RequisitoConexionOrigen = z.infer<
  typeof esquemaRequisitoConexionOrigen
>;
export type PreflightAutomatizacion = z.infer<
  typeof esquemaPreflightAutomatizacion
>;
export type EntradaCrearModo1 = z.infer<typeof esquemaEntradaCrearModo1>;
