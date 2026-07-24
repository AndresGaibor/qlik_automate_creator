import { crearAplicacion } from "../app.js";
import { cargarConfiguracion } from "../plataforma/configuracion/entorno.js";

const configuracion = cargarConfiguracion();
const app = crearAplicacion({ configuracion });
const puerto = configuracion.PORT;

Bun.serve({
  fetch: app.fetch,
  port: puerto,
});

console.info(`API ejecutándose en http://localhost:${puerto}`);
