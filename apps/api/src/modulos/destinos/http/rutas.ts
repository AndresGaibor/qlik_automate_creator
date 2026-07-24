import { type Context, Hono } from "hono";
import { z } from "zod";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { ConsultarDestinos } from "../aplicacion/casos-de-uso/consultar-destinos.js";
import type { PuertoCatalogoDestinos } from "../aplicacion/puertos/puerto-catalogo-destinos.js";

const parametroNombre = z.string().trim().min(1).max(255);

export type ResolverCatalogoDestinos =
  | PuertoCatalogoDestinos
  | ((c: Context) => Promise<PuertoCatalogoDestinos>);

async function obtenerCatalogo(
  resolver: ResolverCatalogoDestinos,
  c: Context,
): Promise<PuertoCatalogoDestinos> {
  if (typeof resolver === "function") {
    return await resolver(c);
  }
  return resolver;
}

export function crearRutasDestinos(resolver: ResolverCatalogoDestinos) {
  const rutas = new Hono();

  rutas.get("/bases-datos", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    return responderExito(c, await new ConsultarDestinos(catalogo).listarBasesDatos());
  });

  rutas.get("/bases-datos/:baseDatos/tablas", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    const baseDatos = parametroNombre.parse(c.req.param("baseDatos"));
    const nombres = await new ConsultarDestinos(catalogo).listarTablas(baseDatos);
    return responderExito(c, nombres.map((nombre) => ({ nombre })));
  });

  rutas.get("/bases-datos/:baseDatos/tablas/:tabla/columnas", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    const baseDatos = parametroNombre.parse(c.req.param("baseDatos"));
    const tabla = parametroNombre.parse(c.req.param("tabla"));
    return responderExito(
      c,
      await new ConsultarDestinos(catalogo).obtenerEsquemaTabla(baseDatos, tabla),
    );
  });

  rutas.get("/flujos-datos", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    return responderExito(c, await new ConsultarDestinos(catalogo).listarFlujosDatos());
  });

  return rutas;
}
