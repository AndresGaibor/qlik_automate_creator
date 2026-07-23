import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  ClienteQlik,
  QlikApiError,
} from "../../infraestructura/qlik/cliente.js";
import { obtenerCredencialesQlik } from "../autenticacion-qlik/credenciales.js";
import { obtenerTenantDesdeSesion } from "../autenticacion-qlik/sesion.js";

export const flujosRouter = new Hono();

flujosRouter.get("/", async (c) => {
  // Derivar tenant exclusivamente desde sesión OAuth válida
  const infoSesion = await obtenerTenantDesdeSesion(c);
  if (!infoSesion) {
    return c.json({ success: false, error: "Sesión requerida" }, 401);
  }

  // Obtener credenciales descifradas desde la base de datos
  const credenciales = await obtenerCredencialesQlik(infoSesion);
  if (!credenciales) {
    return c.json(
      { success: false, error: "Credenciales Qlik no disponibles" },
      401,
    );
  }

  const cliente = new ClienteQlik(credenciales.host, credenciales.token);
  const espacioId = c.req.query("espacioId");

  try {
    const flujos = await cliente.listarFlujos(espacioId);
    return c.json({ success: true, data: flujos });
  } catch (error) {
    // Mapear errores de Qlik a status codes útiles
    if (error instanceof QlikApiError) {
      const mensajes: Record<number, string> = {
        404:
          "Recurso no encontrado en Qlik. Verifique que Data Integration está habilitado.",
        403: "Permisos insuficientes en Qlik para listar flujos.",
        401: "Token de autenticación de Qlik inválido o expirado.",
      };
      const status: ContentfulStatusCode =
        (error.statusCode >= 500 ? 502 : error.statusCode) as ContentfulStatusCode;
      return c.json(
        {
          success: false,
          error: mensajes[error.statusCode] ?? error.message,
          qlikStatus: error.statusCode,
        },
        status,
      );
    }
    return c.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Error al listar flujos",
      },
      400,
    );
  }
});
