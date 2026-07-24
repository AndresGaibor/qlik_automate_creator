import type { Context } from "hono";
import { ErrorAplicacion } from "../errores/error-aplicacion.js";

export async function leerJson<T = unknown>(c: Context): Promise<T> {
  const tipoContenido = c.req.header("content-type")?.toLowerCase() ?? "";
  if (!tipoContenido.includes("application/json")) {
    throw new ErrorAplicacion(
      "TIPO_CONTENIDO_INVALIDO",
      "La solicitud debe usar Content-Type application/json",
      415,
    );
  }

  try {
    return (await c.req.json()) as T;
  } catch {
    throw new ErrorAplicacion(
      "JSON_INVALIDO",
      "El cuerpo de la solicitud no contiene un JSON válido",
      400,
    );
  }
}
