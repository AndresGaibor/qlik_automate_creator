import type { Hono } from "hono";

interface EnlaceHyperdrive {
  connectionString: string;
}

interface EntornoWorker {
  HYPERDRIVE?: EnlaceHyperdrive;
  [clave: string]: unknown;
}

let aplicacion: Hono | undefined;

async function obtenerAplicacion(entorno: EntornoWorker): Promise<Hono> {
  if (aplicacion) return aplicacion;

  aplicarEntorno(entorno);
  const [{ crearAplicacion }, { cargarConfiguracion }] = await Promise.all([
    import("../app.js"),
    import("../plataforma/configuracion/entorno.js"),
  ]);
  aplicacion = await crearAplicacion({ configuracion: cargarConfiguracion() });
  return aplicacion;
}

function aplicarEntorno(entorno: EntornoWorker): void {
  for (const [clave, valor] of Object.entries(entorno)) {
    if (typeof valor === "string") process.env[clave] = valor;
  }
  if (entorno.HYPERDRIVE?.connectionString) {
    process.env.DATABASE_URL = entorno.HYPERDRIVE.connectionString;
  }
}

export default {
  async fetch(request: Request, entorno: EntornoWorker): Promise<Response> {
    return (await obtenerAplicacion(entorno)).fetch(request);
  },
};
