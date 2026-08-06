import { esquemaIdQlik } from "@qlik/contratos/qlik";
import type { Hono } from "hono";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { obtenerContextoSolicitud } from "../../../plataforma/contexto/contexto-solicitud.js";
import { ConsultarPanelAutomatizaciones } from "../aplicacion/casos-de-uso/consultar-panel.js";
import {
  type ObtenerAutomatizacionAutorizada,
  responderEspacioNoAutorizado,
} from "./autorizacion-panel.js";
import { plantillaEfectivaDelModo } from "./plantilla-efectiva.js";
import type { DependenciasRutasPanel } from "./tipos-rutas-panel.js";

export function registrarRutasConsultaPanel(
  rutas: Hono,
  dependencias: DependenciasRutasPanel,
  obtenerAutomatizacionAutorizada: ObtenerAutomatizacionAutorizada,
) {
  rutas.get("/", async (c) => {
    const qlik = await dependencias.resolverQlik(c);
    const espacioId = c.req.query("espacioId")?.trim() || undefined;
    const q =
      c.req.query("q")?.trim() || c.req.query("busqueda")?.trim() || undefined;
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;

    if (espacioId && politica?.restringida && !politica.puedeVer(espacioId)) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje: "No tienes acceso a este espacio de Qlik Cloud",
            codigo: "ESPACIO_NO_AUTORIZADO",
          },
        },
        403,
      );
    }

    let lista = await new ConsultarPanelAutomatizaciones(qlik).listar(
      espacioId,
    );
    if (politica?.restringida) {
      lista = lista.filter((auto) => politica.puedeVer(auto.espacioId));
    }
    if (q) {
      const consulta = q.toLowerCase();
      lista = lista.filter((auto) =>
        auto.nombre.toLowerCase().includes(consulta),
      );
    }
    return responderExito(c, lista);
  });

  rutas.get("/espacios", async (c) => {
    const qlik = await dependencias.resolverQlik(c);
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    const espacios = await new ConsultarPanelAutomatizaciones(
      qlik,
    ).listarEspacios();
    return responderExito(
      c,
      politica?.restringida
        ? espacios.filter((espacio) => politica.puedeVer(espacio.id))
        : espacios,
    );
  });

  rutas.get("/configuracion-tenant", async (c) => {
    const sesion = await dependencias.resolverSesion(c);
    const [tenant, { modoAutomatizacionActivo }, politicaEspacios] =
      await Promise.all([
        dependencias.consultaTenant.obtenerTenant(sesion.tenantId),
        dependencias.obtenerModoGlobal(),
        dependencias.resolverPoliticaEspacios
          ? dependencias.resolverPoliticaEspacios(c)
          : Promise.resolve(null),
      ]);
    const plantilla = plantillaEfectivaDelModo(
      tenant,
      modoAutomatizacionActivo,
    );
    const contexto = obtenerContextoSolicitud(c);
    const puedeAdministrarConexiones = Boolean(
      contexto.esSuperadmin || contexto.roles?.includes("admin"),
    );
    return responderExito(c, {
      modoAutomatizacionActivo,
      plantillaEfectivaIdQlik: plantilla?.id ?? null,
      plantillaEfectivaNombre: plantilla?.nombre ?? null,
      configurada: plantilla !== null,
      puedeAdministrarConexiones,
      accesoEspacios: {
        restringido: politicaEspacios?.restringida ?? false,
        configurado: politicaEspacios?.configurada ?? true,
        cerrado:
          Boolean(politicaEspacios?.restringida) &&
          (politicaEspacios?.espaciosPermitidosIds.length ?? 0) === 0 &&
          !politicaEspacios?.permitirRecursosSinEspacio,
        cantidadEspacios: politicaEspacios?.espaciosPermitidosIds.length ?? 0,
        permitirRecursosSinEspacio:
          politicaEspacios?.permitirRecursosSinEspacio ?? false,
      },
    });
  });

  rutas.get("/:id/workspace", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const { automatizacion, autorizada } =
      await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    return responderExito(c, {
      id: automatizacion.id,
      nombre: automatizacion.name,
      workspace: automatizacion.workspace ?? {},
      schedules: automatizacion.schedules ?? [],
    });
  });

  rutas.get("/:id", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const { qlik, autorizada } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    return responderExito(
      c,
      await new ConsultarPanelAutomatizaciones(qlik).obtener(id),
    );
  });
}
