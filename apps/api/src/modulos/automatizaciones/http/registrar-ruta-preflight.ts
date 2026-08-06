import type { Hono } from "hono";
import { z } from "zod";
import { leerJson } from "../../../nucleo/http/leer-json.js";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { PreflightAutomatizacion } from "../aplicacion/casos-de-uso/preflight-automatizacion.js";
import { responderEspacioNoAutorizado } from "./autorizacion-panel.js";
import type { DependenciasRutasPanel } from "./tipos-rutas-panel.js";

export function registrarRutaPreflight(
  rutas: Hono,
  dependencias: DependenciasRutasPanel,
) {
  rutas.post("/preflight", async (c) => {
    const entrada = z
      .object({ flujoId: z.string().trim().min(1) })
      .parse(await leerJson(c));
    const [qlik, sesion] = await Promise.all([
      dependencias.resolverQlik(c),
      dependencias.resolverSesion(c),
    ]);
    const flujo = (await qlik.listarFlujos()).find(
      (item) => item.id === entrada.flujoId,
    );
    if (!flujo) {
      return c.json(
        {
          exito: false,
          error: { mensaje: "Dataflow no encontrado", codigo: "NO_ENCONTRADO" },
        },
        404,
      );
    }
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    if (politica?.restringida && !politica.puedeVer(flujo.spaceId)) {
      return responderEspacioNoAutorizado(c);
    }
    if (!dependencias.consultarConexionesDestino) {
      throw new Error("Consulta de destinos no configurada");
    }
    const preflight = new PreflightAutomatizacion(
      qlik,
      {
        listar: async (organizacionId) =>
          (await dependencias.consultarConexionesOrigen(organizacionId)).map(
            (item) => ({
              id: item.id ?? "00000000-0000-4000-8000-000000000000",
              tipo: item.tipo,
              nombre: item.nombre,
              estado: item.estado ?? "sin_probar",
              probadaEn: item.probadaEn ?? null,
              mensajeError: item.mensajeError ?? null,
            }),
          ),
      },
      { listar: dependencias.consultarConexionesDestino },
    );
    return responderExito(
      c,
      await preflight.ejecutar({
        organizacionId: sesion.organizacionId,
        flujoId: flujo.id,
        flujoNombre: flujo.name,
      }),
    );
  });
}
