import { Hono } from "hono";
import { z } from "zod";
import { ClienteDestinos } from "../../infraestructura/destinos-api/cliente.js";
import {
  ClienteQlik,
  QlikApiError,
} from "../../infraestructura/qlik/cliente.js";
import { obtenerCredencialesQlik } from "../autenticacion-qlik/credenciales.js";
import { obtenerTenantDesdeSesion } from "../autenticacion-qlik/sesion.js";
import { ServicioAutomatizaciones } from "./servicio.js";

export const automatizacionesRouter = new Hono();

const getClienteDestinos = () =>
  new ClienteDestinos(
    process.env.REMOTE_API_URL ?? "",
    process.env.REMOTE_API_KEY ?? "",
  );

const CrearAutomatizacionSchema = z.object({
  nombre: z.string().min(1),
  flujoIdQlik: z.string(),
  flujoNombre: z.string(),
  flujoEspacioId: z.string().optional(),
  destinoProveedor: z.string(),
  destinoIdExterno: z.string(),
  destinoNombre: z.string(),
  programacion: z
    .object({
      tipo: z.enum(["manual", "intervalo", "cron", "qlik"]),
      expresionCron: z.string().optional(),
      zonaHoraria: z.string().optional(),
    })
    .optional(),
  claveIdempotencia: z.string().optional(),
});

automatizacionesRouter.get("/", async (c) => {
  // Derivar tenant exclusivamente desde sesión OAuth válida
  const infoSesion = await obtenerTenantDesdeSesion(c);
  if (!infoSesion) {
    return c.json({ success: false, error: "Sesión requerida" }, 401);
  }

  const credenciales = await obtenerCredencialesQlik(infoSesion);
  if (!credenciales) {
    return c.json(
      { success: false, error: "Credenciales Qlik no disponibles" },
      401,
    );
  }

  const cliente = new ClienteQlik(credenciales.host, credenciales.token);

  try {
    // Listar automatizaciones reales desde la API de Qlik
    const automatizaciones = await cliente.listarAutomatizaciones();
    return c.json({ success: true, data: automatizaciones });
  } catch (error) {
    if (error instanceof QlikApiError) {
      const mensajes: Record<number, string> = {
        404:
          "Recurso no encontrado en Qlik. Verifique que Automations está habilitado.",
        403: "Permisos insuficientes en Qlik para listar automatizaciones.",
        401: "Token de autenticación de Qlik inválido o expirado.",
      };
      const status =
        (error.statusCode >= 500
          ? 502
          : error.statusCode) as import("hono/utils/http-status").ContentfulStatusCode;
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
          error instanceof Error
            ? error.message
            : "Error al listar automatizaciones",
      },
      400,
    );
  }
});

automatizacionesRouter.post("/", async (c) => {
  // Derivar identidad/tenant/organización desde sesión — no aceptar headers
  const infoSesion = await obtenerTenantDesdeSesion(c);
  if (!infoSesion) {
    return c.json({ success: false, error: "Sesión requerida" }, 401);
  }

  const credenciales = await obtenerCredencialesQlik(infoSesion);
  if (!credenciales) {
    return c.json(
      { success: false, error: "Credenciales Qlik no disponibles" },
      401,
    );
  }

  const body = await c.req.json();
  const input = CrearAutomatizacionSchema.parse(body);

  const servicio = new ServicioAutomatizaciones(
    new ClienteQlik(credenciales.host, credenciales.token),
    getClienteDestinos(),
  );

  try {
    const resultado = await servicio.crear(
      input,
      infoSesion.usuarioId,
      infoSesion.tenantUuid,
      infoSesion.organizacionId,
    );
    return c.json({ success: true, data: resultado }, 201);
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error al crear",
      },
      400,
    );
  }
});

automatizacionesRouter.get("/:id", async (c) => {
  // Derivar credenciales desde sesión
  const infoSesion = await obtenerTenantDesdeSesion(c);
  if (!infoSesion) {
    return c.json({ success: false, error: "Sesión requerida" }, 401);
  }

  const credenciales = await obtenerCredencialesQlik(infoSesion);
  if (!credenciales) {
    return c.json(
      { success: false, error: "Credenciales Qlik no disponibles" },
      401,
    );
  }

  const { id } = c.req.param();
  const servicio = new ServicioAutomatizaciones(
    new ClienteQlik(credenciales.host, credenciales.token),
    getClienteDestinos(),
  );

  const config = await servicio.obtener(id);
  if (!config) {
    return c.json({ success: false, error: "No encontrado" }, 404);
  }
  return c.json({ success: true, data: config });
});

automatizacionesRouter.post("/:id/ejecutar", async (c) => {
  // Derivar identidad/organización desde sesión — no aceptar headers
  const infoSesion = await obtenerTenantDesdeSesion(c);
  if (!infoSesion) {
    return c.json({ success: false, error: "Sesión requerida" }, 401);
  }

  const credenciales = await obtenerCredencialesQlik(infoSesion);
  if (!credenciales) {
    return c.json(
      { success: false, error: "Credenciales Qlik no disponibles" },
      401,
    );
  }

  const { id } = c.req.param();
  const servicio = new ServicioAutomatizaciones(
    new ClienteQlik(credenciales.host, credenciales.token),
    getClienteDestinos(),
  );

  try {
    const resultado = await servicio.ejecutar(
      id,
      infoSesion.usuarioId,
      infoSesion.organizacionId,
    );
    return c.json({ success: true, data: resultado });
  } catch (error) {
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error al ejecutar",
      },
      400,
    );
  }
});
