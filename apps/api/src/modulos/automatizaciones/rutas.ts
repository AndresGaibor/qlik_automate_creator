import { Hono } from "hono";
import { z } from "zod";
import { ClienteDestinos } from "../../infraestructura/destinos-api/cliente.js";
import { ClienteQlik } from "../../infraestructura/qlik/cliente.js";
import { ServicioAutomatizaciones } from "./servicio.js";

export const automatizacionesRouter = new Hono();

const getClienteDestinos = () =>
  new ClienteDestinos(
    process.env.REMOTE_API_URL ?? "",
    process.env.REMOTE_API_KEY ?? "",
  );

const getClienteQlik = (c: any) => {
  const host = c.req.header("x-qlik-host") ?? process.env.QLIK_API_HOST;
  const token = c.req.header("x-qlik-token") ?? process.env.QLIK_API_TOKEN;
  if (!host || !token) {
    throw new Error("Qlik credentials not available. TODO: Implement session-based credential retrieval from DB.");
  }
  return new ClienteQlik(host, token);
};

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
  const tenantQlikId = c.req.header("x-tenant-id");
  if (!tenantQlikId) {
    return c.json({ success: false, error: "Tenant ID requerido" }, 400);
  }

  const servicio = new ServicioAutomatizaciones(
    getClienteQlik(c),
    getClienteDestinos(),
  );

  const configs = await servicio.listar(tenantQlikId);
  return c.json({ success: true, data: configs });
});

automatizacionesRouter.post("/", async (c) => {
  const body = await c.req.json();
  const input = CrearAutomatizacionSchema.parse(body);

  const tenantQlikId = c.req.header("x-tenant-id") ?? "tenant-id";
  const usuarioId = c.req.header("x-usuario-id") ?? "usuario-id";
  const organizacionId = c.req.header("x-organizacion-id") ?? "organizacion-id";

  const servicio = new ServicioAutomatizaciones(
    getClienteQlik(c),
    getClienteDestinos(),
  );

  try {
    const resultado = await servicio.crear(
      input,
      usuarioId,
      tenantQlikId,
      organizacionId,
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
  const { id } = c.req.param();
  const servicio = new ServicioAutomatizaciones(
    getClienteQlik(c),
    getClienteDestinos(),
  );

  const config = await servicio.obtener(id);
  if (!config) {
    return c.json({ success: false, error: "No encontrado" }, 404);
  }
  return c.json({ success: true, data: config });
});

automatizacionesRouter.post("/:id/ejecutar", async (c) => {
  const { id } = c.req.param();
  const usuarioId = c.req.header("x-usuario-id") ?? "usuario-id";
  const organizacionId = c.req.header("x-organizacion-id") ?? "organizacion-id";

  const servicio = new ServicioAutomatizaciones(
    getClienteQlik(c),
    getClienteDestinos(),
  );

  try {
    const resultado = await servicio.ejecutar(id, usuarioId, organizacionId);
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
