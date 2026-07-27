import { cors } from "hono/cors";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";

const FRONTEND_KEY = "frontend_url";

export async function crearMiddlewareCors(
  db: ConexionDb,
  origenEstatico?: string,
) {
  if (origenEstatico) {
    return cors({
      origin: new URL(origenEstatico).origin,
      credentials: true,
    });
  }

  let frontendOrigin: string | null = null;
  try {
    const fila = await db.query.appConfig.findFirst({
      where: (t, { eq }) => eq(t.clave, FRONTEND_KEY),
    });
    frontendOrigin =
      fila && typeof fila.valor === "object"
        ? ((fila.valor as Record<string, unknown>).valor as string)
        : null;
  } catch {
    frontendOrigin = null;
  }

  if (frontendOrigin) {
    return cors({
      origin: new URL(frontendOrigin).origin,
      credentials: true,
    });
  }

  return cors({
    origin: (request) => {
      const req = request as unknown as Request;
      return req.headers.get("Origin") ?? "*";
    },
    credentials: true,
  });
}
