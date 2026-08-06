import { esquemaIdQlik } from "@qlik/contratos/qlik";
import type { Hono } from "hono";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { EjecutarAutomatizacion } from "../aplicacion/casos-de-uso/ejecutar-automatizacion.js";
import {
  type ObtenerAutomatizacionAutorizada,
  responderEspacioNoAutorizado,
} from "./autorizacion-panel.js";
import type { DependenciasRutasPanel } from "./tipos-rutas-panel.js";

export function registrarRutasComandosPanel(
  rutas: Hono,
  dependencias: DependenciasRutasPanel,
  obtenerAutomatizacionAutorizada: ObtenerAutomatizacionAutorizada,
) {
  rutas.put("/:id/workspace", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const cuerpo = (await c.req.json()) as {
      workspace: Record<string, unknown>;
    };
    if (
      !cuerpo ||
      typeof cuerpo.workspace !== "object" ||
      cuerpo.workspace === null
    ) {
      return c.json(
        {
          exito: false,
          error: { mensaje: "El workspace debe ser un objeto JSON válido" },
        },
        400,
      );
    }
    const { qlik, autorizada } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    const actualizada = await qlik.actualizarAutomatizacion(id, {
      workspace: cuerpo.workspace,
    });
    return responderExito(c, {
      id: actualizada.id,
      nombre: actualizada.name,
      workspace: actualizada.workspace ?? {},
    });
  });

  rutas.post("/:id/clonar", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const cuerpo = (await c.req.json().catch(() => ({}))) as {
      nombre?: string;
      espacioIdQlik?: string;
    };
    const {
      qlik,
      automatizacion: original,
      autorizada,
    } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    if (
      cuerpo.espacioIdQlik &&
      politica?.restringida &&
      !politica.puedeVer(cuerpo.espacioIdQlik)
    ) {
      return responderEspacioNoAutorizado(c);
    }
    const nombreCopia = cuerpo.nombre?.trim() || `${original.name} (Copia)`;
    const copia = await qlik.copiarAutomatizacion(id, nombreCopia);
    if (cuerpo.espacioIdQlik) {
      await qlik.cambiarEspacioAutomatizacion(copia.id, cuerpo.espacioIdQlik);
    }
    return responderExito(c, { id: copia.id, nombre: nombreCopia }, 201);
  });

  rutas.post("/:id/ejecuciones", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const [{ qlik, autorizada }, sesion] = await Promise.all([
      obtenerAutomatizacionAutorizada(c, id),
      dependencias.resolverSesion(c),
    ]);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    const resultado = await new EjecutarAutomatizacion(
      qlik,
      dependencias.bloqueos,
    ).ejecutar(sesion.tenantId, id);
    return responderExito(c, resultado, 201);
  });

  rutas.post("/:id/ejecuciones/:ejecucionId/detener", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const ejecucionId = esquemaIdQlik.parse(c.req.param("ejecucionId"));
    const { qlik, autorizada } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    await qlik.detenerEjecucion(id, ejecucionId);
    return responderExito(c, { detenida: true as const });
  });
}
