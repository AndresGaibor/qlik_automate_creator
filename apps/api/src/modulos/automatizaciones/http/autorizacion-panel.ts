import type { Context } from "hono";
import type { DependenciasRutasPanel } from "./tipos-rutas-panel.js";

export function responderEspacioNoAutorizado(c: Context) {
  return c.json(
    {
      exito: false,
      error: {
        mensaje: "No tienes acceso a este recurso",
        codigo: "ESPACIO_NO_AUTORIZADO",
      },
    },
    403,
  );
}

export function crearObtenerAutomatizacionAutorizada(
  dependencias: DependenciasRutasPanel,
) {
  return async (c: Context, id: string) => {
    const qlik = await dependencias.resolverQlik(c);
    const automatizacion = await qlik.obtenerAutomatizacion(id);
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    return {
      qlik,
      automatizacion,
      autorizada:
        !politica?.restringida || politica.puedeVer(automatizacion.spaceId),
    };
  };
}

export type ObtenerAutomatizacionAutorizada = ReturnType<
  typeof crearObtenerAutomatizacionAutorizada
>;
