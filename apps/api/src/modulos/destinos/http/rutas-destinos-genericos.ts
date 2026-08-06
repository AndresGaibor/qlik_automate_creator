import { Hono } from "hono";
import { registrarRutasComandoDestinos } from "./registrar-rutas-comando-destinos.js";
import { registrarRutasConsultaDestinos } from "./registrar-rutas-consulta-destinos.js";
import type { DependenciasRutasDestinosGenericas } from "./tipos-rutas-destinos-genericos.js";

export type { DependenciasRutasDestinosGenericas } from "./tipos-rutas-destinos-genericos.js";

export function crearRutasDestinosGenericas(
  dependencias: DependenciasRutasDestinosGenericas,
) {
  const rutas = new Hono();
  registrarRutasConsultaDestinos(rutas, dependencias);
  registrarRutasComandoDestinos(rutas, dependencias);
  return rutas;
}
