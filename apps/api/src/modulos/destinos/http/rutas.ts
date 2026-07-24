import { Hono } from "hono";
import { z } from "zod";
import { responderExito } from "../../../plataforma/http/respuestas.js";
import { ConsultarDestinos } from "../aplicacion/casos-de-uso/consultar-destinos.js";
import type { PuertoCatalogoDestinos } from "../aplicacion/puertos/puerto-catalogo-destinos.js";

const parametroNombre = z.string().trim().min(1).max(255);

export function crearRutasDestinos(catalogo: PuertoCatalogoDestinos) {
  const rutas = new Hono();
  const consultas = new ConsultarDestinos(catalogo);

  rutas.get("/bases-datos", async (c) =>
    responderExito(c, await consultas.listarBasesDatos()),
  );
  rutas.get("/bases-datos/:baseDatos/tablas", async (c) => {
    const baseDatos = parametroNombre.parse(c.req.param("baseDatos"));
    return responderExito(c, await consultas.listarTablas(baseDatos));
  });
  rutas.get("/bases-datos/:baseDatos/tablas/:tabla/columnas", async (c) => {
    const baseDatos = parametroNombre.parse(c.req.param("baseDatos"));
    const tabla = parametroNombre.parse(c.req.param("tabla"));
    return responderExito(
      c,
      await consultas.obtenerEsquemaTabla(baseDatos, tabla),
    );
  });
  rutas.get("/flujos-datos", async (c) =>
    responderExito(c, await consultas.listarFlujosDatos()),
  );

  return rutas;
}
