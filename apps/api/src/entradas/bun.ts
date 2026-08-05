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

const servidor = Bun.serve({
  fetch: app.fetch,
  port: puerto,
});

console.log(`\n🚀 API en http://localhost:${puerto}\n`);

let cerrando = false;
async function cerrarOrdenadamente(senal: string): Promise<void> {
  if (cerrando) return;
  cerrando = true;
  console.info(`\n👋 Cerrando API...`);
  servidor.stop();
  await cerrarConexion();
  process.exit(0);
}

process.once("SIGTERM", () => void cerrarOrdenadamente("SIGTERM"));
process.once("SIGINT", () => void cerrarOrdenadamente("SIGINT"));
