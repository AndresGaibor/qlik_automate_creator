import { Hono } from "hono";
import { crearObtenerAutomatizacionAutorizada } from "./autorizacion-panel.js";
import { registrarRutaCrearDesdePlantilla } from "./registrar-ruta-crear-desde-plantilla.js";
import { registrarRutaPreflight } from "./registrar-ruta-preflight.js";
import { registrarRutasComandosPanel } from "./registrar-rutas-comandos-panel.js";
import { registrarRutasConsultaPanel } from "./registrar-rutas-consulta-panel.js";
import type { DependenciasRutasPanel } from "./tipos-rutas-panel.js";

export type { DependenciasRutasPanel } from "./tipos-rutas-panel.js";

export function crearRutasPanelAutomatizaciones(
  dependencias: DependenciasRutasPanel,
) {
  const rutas = new Hono();
  const obtenerAutomatizacionAutorizada =
    crearObtenerAutomatizacionAutorizada(dependencias);

  registrarRutasConsultaPanel(
    rutas,
    dependencias,
    obtenerAutomatizacionAutorizada,
  );
  registrarRutaPreflight(rutas, dependencias);
  registrarRutaCrearDesdePlantilla(rutas, dependencias);
  registrarRutasComandosPanel(
    rutas,
    dependencias,
    obtenerAutomatizacionAutorizada,
  );

  return rutas;
}
