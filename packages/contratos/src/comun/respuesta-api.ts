import { z } from "zod";

export const esquemaErrorApi = z.object({
  codigo: z.string().optional(),
  mensaje: z.string(),
  detalles: z.unknown().optional(),
  trazaId: z.string().optional(),
});

export type ErrorApi = z.infer<typeof esquemaErrorApi>;

export type RespuestaApi<T> =
  | { exito: true; datos: T; meta?: Record<string, unknown> }
  | { exito: false; error: ErrorApi };

export const respuestaExitosa = <T>(
  datos: T,
  meta?: Record<string, unknown>,
): RespuestaApi<T> => ({ exito: true, datos, ...(meta ? { meta } : {}) });

export const respuestaFallida = (
  mensaje: string,
  opciones: Omit<ErrorApi, "mensaje"> = {},
): RespuestaApi<never> => ({
  exito: false,
  error: { mensaje, ...opciones },
});
