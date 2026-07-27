import type { MiddlewareHandler } from "hono";
import { responderError } from "../respuestas.js";

const METODOS_INSEGUROS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Las mutaciones autenticadas por cookies solo se aceptan desde el frontend.
 * No hay excepción genérica para clientes no navegador.
 */
export function crearMiddlewareOrigenCsrf(
  frontendUrl: string,
): MiddlewareHandler {
  const origenPermitido = new URL(frontendUrl).origin;

  return async (c, siguiente) => {
    if (!METODOS_INSEGUROS.has(c.req.method)) return siguiente();

    const origen = c.req.header("origin");
    if (!origen || origen !== origenPermitido) {
      return responderError(c, "Origen de solicitud no permitido", 403, {
        codigo: "ORIGEN_NO_PERMITIDO",
      });
    }

    return siguiente();
  };
}
