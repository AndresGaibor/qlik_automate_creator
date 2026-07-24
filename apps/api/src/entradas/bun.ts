import { crearAplicacion } from "../app.js";
import { cargarConfiguracion } from "../plataforma/configuracion/entorno.js";
import { asegurarEsquemaTablas } from "../plataforma/persistencia/conexion.js";

const configuracion = cargarConfiguracion();
await asegurarEsquemaTablas();

const app = crearAplicacion({ configuracion });
const puerto = configuracion.PORT;

Bun.serve({
  fetch: app.fetch,
  port: puerto,
});

console.info(`API ejecutándose en http://localhost:${puerto}`);
