import { serve } from "@hono/node-server";
import { crearAplicacion } from "../app.js";
import { cargarConfiguracion } from "../plataforma/configuracion/entorno.js";

const configuracion = cargarConfiguracion();
const app = await crearAplicacion({ configuracion });
const puerto = configuracion.PORT;
serve({ fetch: app.fetch, port: puerto });
console.info(`API ejecutándose en http://localhost:${puerto}`);
