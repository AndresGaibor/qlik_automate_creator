import { Hono } from "hono";
import { ClienteQlik } from "../../infraestructura/qlik/cliente.js";

export const flujosRouter = new Hono();

flujosRouter.get("/", async (c) => {
  const tenantQlikId = c.req.header("x-tenant-id");
  if (!tenantQlikId) {
    return c.json({ success: false, error: "Tenant ID requerido" }, 400);
  }

  const host = c.req.header("x-qlik-host") ?? process.env.QLIK_API_HOST;
  const token = c.req.header("x-qlik-token") ?? process.env.QLIK_API_TOKEN;

  if (!host || !token) {
    return c.json({ success: false, error: "Qlik credentials not available. TODO: Implement session-based credential retrieval." }, 401);
  }

  const cliente = new ClienteQlik(host, token);
  const espacioId = c.req.query("espacioId");

  try {
    const flujos = await cliente.listarFlujos(espacioId);
    return c.json({ success: true, data: flujos });
  } catch (error) {
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
