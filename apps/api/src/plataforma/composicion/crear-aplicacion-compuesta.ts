import type { Hono } from "hono";
import { crearDependenciasRutas } from "./crear-dependencias-rutas.js";
import { crearNucleoComposicion } from "./crear-nucleo-composicion.js";
import { montarAplicacion } from "./montar-aplicacion.js";
import type { DependenciasAplicacion } from "./tipos.js";

export async function crearAplicacionCompuesta(
  dependencias: DependenciasAplicacion = {},
): Promise<Hono> {
  const nucleo = await crearNucleoComposicion(dependencias);
  const dependenciasRutas = await crearDependenciasRutas(nucleo);
  return montarAplicacion(dependenciasRutas);
}
