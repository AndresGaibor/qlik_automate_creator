import {
  type ConfiguracionEspaciosVisibles,
  type GuardarEspaciosVisibles,
  type ResultadoGuardarEspaciosVisibles,
  esquemaGuardarEspaciosVisibles,
} from "@qlik/contratos/admin";
import { type Context, Hono } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import { obtenerContextoSolicitud } from "../../../plataforma/contexto/contexto-solicitud.js";
import type { ServicioQlik } from "../../qlik/publico.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  exigirAccesoOrganizacion,
  obtenerParametroRequerido,
  responderErrorAdmin,
} from "./rutas-comunes.js";

export interface RepositorioEspaciosVisiblesAdmin {
  obtener(tenantQlikId: string): Promise<ConfiguracionEspaciosVisibles>;
  reemplazar(
    tenantQlikId: string,
    entrada: GuardarEspaciosVisibles,
    usuarioId?: string,
  ): Promise<ResultadoGuardarEspaciosVisibles>;
  listarCatalogo(tenantQlikId: string): Promise<
    Array<{
      espacioIdQlik: string;
      nombre: string;
      tipo: string | null;
      eliminadoEn: Date | null;
    }>
  >;
  sincronizarCatalogo(
    tenantQlikId: string,
    espacios: Array<{ id: string; nombre: string; tipo: string }>,
  ): Promise<void>;
}

interface Dependencias {
  resolverContexto: ResolverContextoAdmin;
  resolverQlik(c: Context): Promise<ServicioQlik>;
  resolverSesion(c: Context): Promise<{ tenantId: string }>;
  auditoria: PuertoAuditoria;
  repositorio: RepositorioEspaciosVisiblesAdmin;
  existeTenantQlik(
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<boolean>;
}

export function crearRutasEspaciosVisibles(deps: Dependencias) {
  const rutas = new Hono();
  const repositorio = deps.repositorio;
  const base =
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/espacios-visibles";

  async function validar(c: Context) {
    const organizacionId = obtenerParametroRequerido(c, "id");
    const tenantQlikId = obtenerParametroRequerido(c, "tenantQlikId");
    const contexto = await deps.resolverContexto(c);
    exigirAccesoOrganizacion(contexto, organizacionId);
    if (!(await deps.existeTenantQlik(organizacionId, tenantQlikId))) {
      return null;
    }
    return { organizacionId, tenantQlikId, contexto };
  }

  rutas.get(base, async (c) => {
    try {
      const acceso = await validar(c);
      if (!acceso)
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      const [configuracion, catalogo] = await Promise.all([
        repositorio.obtener(acceso.tenantQlikId),
        repositorio.listarCatalogo(acceso.tenantQlikId),
      ]);
      const mapa = new Map(catalogo.map((item) => [item.espacioIdQlik, item]));
      const ids = new Set([
        ...mapa.keys(),
        ...configuracion.espaciosPermitidosIds,
      ]);
      const espacios = [...ids]
        .map((id) => {
          const item = mapa.get(id);
          return {
            id,
            nombre: item?.nombre ?? id,
            tipo: item?.tipo ?? "desconocido",
            disponible: Boolean(item && !item.eliminadoEn),
            seleccionado: configuracion.espaciosPermitidosIds.includes(id),
          };
        })
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      return responderExito(c, { configuracion, espacios });
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.put(base, async (c) => {
    try {
      const acceso = await validar(c);
      if (!acceso)
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      const entrada = esquemaGuardarEspaciosVisibles.parse(await c.req.json());
      const anterior = await repositorio.obtener(acceso.tenantQlikId);
      const resultado = await repositorio.reemplazar(
        acceso.tenantQlikId,
        entrada,
        acceso.contexto.usuarioId,
      );
      const solicitud = obtenerContextoSolicitud(c);
      await deps.auditoria.registrar({
        organizacionId: acceso.organizacionId,
        usuarioId: acceso.contexto.usuarioId,
        accion: "espacios_visibles.actualizar",
        entidadTipo: "tenant_qlik",
        entidadId: acceso.tenantQlikId,
        resultado: "exito",
        datosAnteriores: anterior,
        datosNuevos: resultado.configuracion,
        idSolicitud: solicitud.idSolicitud,
      });
      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.post(`${base}/sincronizar`, async (c) => {
    try {
      const acceso = await validar(c);
      if (!acceso)
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      const sesion = await deps.resolverSesion(c);
      if (sesion.tenantId !== acceso.tenantQlikId) {
        return responderError(
          c,
          "Activa este entorno Qlik para sincronizar sus espacios",
          409,
          {
            codigo: "TENANT_QLIK_NO_ACTIVO",
          },
        );
      }
      const qlik = await deps.resolverQlik(c);
      const espacios = await qlik.listarEspacios({ limit: 100, sort: "+name" });
      await repositorio.sincronizarCatalogo(
        acceso.tenantQlikId,
        espacios.map((item) => ({
          id: item.id,
          nombre: item.name,
          tipo: item.type ?? "compartido",
        })),
      );
      return responderExito(c, { sincronizados: espacios.length });
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  return rutas;
}
