import { serve } from "@hono/node-server";
import { crearAplicacion } from "../app.js";
import { cargarConfiguracion } from "../plataforma/configuracion/entorno.js";
import {
  asegurarEsquemaTablas,
  cerrarConexion,
} from "../plataforma/persistencia/conexion.js";

const configuracion = cargarConfiguracion();
await asegurarEsquemaTablas();
const app = await crearAplicacion({ configuracion });
const puerto = configuracion.PORT;
const servidor = serve({ fetch: app.fetch, port: puerto });
console.info(`API ejecutándose en http://localhost:${puerto}`);

let cerrando = false;
async function cerrarOrdenadamente(senal: string): Promise<void> {
  if (cerrando) return;
  cerrando = true;
  console.info(`Recibida ${senal}; cerrando API ordenadamente`);
  const limite = setTimeout(() => process.exit(1), 10_000);
  try {
    await new Promise<void>((resolver, rechazar) => {
      servidor.close((error) => (error ? rechazar(error) : resolver()));
    });
    await cerrarConexion();
    process.exitCode = 0;
  } catch (error) {
    console.error("No se pudo cerrar la API ordenadamente", error);
    process.exitCode = 1;
  } finally {
    clearTimeout(limite);
  }
}

process.once("SIGTERM", () => void cerrarOrdenadamente("SIGTERM"));
process.once("SIGINT", () => void cerrarOrdenadamente("SIGINT"));
