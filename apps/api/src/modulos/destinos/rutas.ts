import { Hono } from "hono";
import { ClienteDestinos } from "../../infraestructura/destinos-api/cliente.js";

export const destinosRouter = new Hono();

const getClienteDestinos = () =>
  new ClienteDestinos(
    process.env.REMOTE_API_URL ?? "",
    process.env.REMOTE_API_KEY ?? "",
  );

destinosRouter.get("/bases-datos", async (c) => {
  const cliente = getClienteDestinos();

  try {
    const databases = await cliente.listarDatabases();
    return c.json({ success: true, data: databases });
  } catch (error) {
    return c.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al listar bases de datos",
      },
      400,
    );
  }
});

destinosRouter.get("/bases-datos/:database/tablas", async (c) => {
  const { database } = c.req.param();
  const cliente = getClienteDestinos();

  try {
    const tablas = await cliente.listarTablas(database);
    return c.json({ success: true, data: tablas });
  } catch (error) {
    return c.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Error al listar tablas",
      },
      400,
    );
  }
});

destinosRouter.get("/bases-datos/:database/tablas/:tabla/columnas", async (c) => {
  const { database, tabla } = c.req.param();
  const cliente = getClienteDestinos();

  try {
    const columnas = await cliente.listarColumnas(database, tabla);
    return c.json({ success: true, data: columnas });
  } catch (error) {
    return c.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Error al listar columnas",
      },
      400,
    );
  }
});

destinosRouter.get("/dataflows", async (c) => {
  const cliente = getClienteDestinos();

  try {
    const dataflows = await cliente.listarDataflows();
    return c.json({ success: true, data: dataflows });
  } catch (error) {
    return c.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Error al listar dataflows",
      },
      400,
    );
  }
});
