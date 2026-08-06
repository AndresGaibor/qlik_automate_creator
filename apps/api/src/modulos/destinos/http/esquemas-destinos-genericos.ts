import { z } from "zod";

export const esquemaCrearDestino = z.object({
  tipo: z.enum(["impala", "postgres", "bigquery", "sftp"]),
  nombre: z.string().min(1).max(255),
  config: z.record(z.unknown()),
});

export const esquemaActualizarDestino = z.object({
  nombre: z.string().min(1).max(255).optional(),
  config: z.record(z.unknown()).optional(),
  estado: z.enum(["activo", "error", "desconectado"]).optional(),
});
