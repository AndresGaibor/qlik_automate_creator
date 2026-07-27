import { cors } from "hono/cors";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";

const FRONTEND_KEY = "frontend_url";
let cachedOrigin: string | null = null;

export function crearMiddlewareCors(db: ConexionDb, origenEstatico?: string) {
  if (origenEstatico) {
    return cors({ origin: new URL(origenEstatico).origin, credentials: true });
  }

  return cors({
    origin: async (request) => {
      if (cachedOrigin) return cachedOrigin;
      try {
        const fila = await db.query.appConfig.findFirst({
          where: (t, { eq }) => eq(t.clave, FRONTEND_KEY),
        });
        cachedOrigin =
          fila && typeof fila.valor === "object"
            ? ((fila.valor as Record<string, unknown>).valor as string)
            : "http://localhost:5173";
      } catch {
        cachedOrigin = "http://localhost:5173";
      }
      return cachedOrigin;
    },
    credentials: true,
  });
}
