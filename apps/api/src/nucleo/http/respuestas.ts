import { respuestaExitosa, respuestaFallida } from "@qlik/contratos/comun";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function responderExito<T>(
  c: Context,
  datos: T,
  estado: ContentfulStatusCode = 200,
  meta?: Record<string, unknown>,
) {
  return c.json(respuestaExitosa(datos, meta), estado);
}

export function responderError(
  c: Context,
  mensaje: string,
  estado: ContentfulStatusCode,
  opciones: { codigo?: string; detalles?: unknown; trazaId?: string } = {},
) {
  return c.json(respuestaFallida(mensaje, opciones), estado);
}
