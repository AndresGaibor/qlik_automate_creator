import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";

export function responderDestinoNoDisponible(c: Context, error: unknown) {
  return responderError(
    c,
    error instanceof Error ? error.message : "El destino no está disponible",
    502,
    { codigo: "DESTINO_NO_DISPONIBLE" },
  );
}

export async function ejecutarDestino<T>(
  c: Context,
  operacion: () => Promise<T>,
) {
  try {
    return responderExito(c, await operacion());
  } catch (error) {
    return responderErrorAplicacion(c, error);
  }
}

export function responderErrorAplicacion(c: Context, error: unknown): Response {
  if (!(error instanceof ErrorAplicacion)) throw error;
  return responderError(
    c,
    error.message,
    error.estadoHttp as ContentfulStatusCode,
    { codigo: error.codigo, detalles: error.detalles },
  );
}
