import type { MiddlewareHandler } from "hono";
import { responderError } from "../respuestas.js";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";

const METODOS_INSEGUROS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const FRONTEND_KEY = "frontend_url";

export function crearMiddlewareOrigenCsrf(
  db: ConexionDb,
  frontendUrl?: string,
): MiddlewareHandler {
  return async (c, siguiente) => {
    if (!METODOS_INSEGUROS.has(c.req.method)) return siguiente();

    let origenPermitido: string | null = frontendUrl
      ? new URL(frontendUrl).origin
      : null;

    if (!origenPermitido) {
      try {
        const fila = await db.query.appConfig.findFirst({
          where: (t, { eq }) => eq(t.clave, FRONTEND_KEY),
        });
        origenPermitido =
          fila && typeof fila.valor === "object"
            ? new URL((fila.valor as Record<string, unknown>).valor as string).origin
            : null;
      } catch {
        origenPermitido = null;
      }
    }

    if (!origenPermitido) {
      const origen = c.req.header("origin");
      if (!origen) return responderError(c, "Origen de solicitud no permitido", 403, {
        codigo: "ORIGEN_NO_PERMITIDO",
      });
      return siguiente();
    }

    const origen = c.req.header("origin");
    if (!origen || origen !== origenPermitido) {
      return responderError(c, "Origen de solicitud no permitido", 403, {
        codigo: "ORIGEN_NO_PERMITIDO",
      });
    }

    return siguiente();
  };
}
