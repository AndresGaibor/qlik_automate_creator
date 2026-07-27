import { esquemaCrearTenantQlik } from "@qlik/contratos/admin";
import { Hono } from "hono";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import { generarUuid } from "../../../nucleo/valores/generar-uuid.js";
import {
  crearTenantQlik,
  eliminarTenantQlik,
  listarTenantsQlik,
  marcarTenantQlikPrincipal,
} from "../aplicacion/casos-de-uso/gestionar-tenants-qlik.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  exigirAccesoOrganizacion,
  obtenerParametroRequerido,
  responderErrorAdmin,
} from "./rutas-comunes.js";

export interface DependenciasRutasTenantsQlik {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

export function crearRutasTenantsQlik({
  repositorio,
  resolverContexto,
}: DependenciasRutasTenantsQlik) {
  const rutas = new Hono();

  rutas.get("/organizaciones/:id/tenants-qlik", async (c) => {
    try {
      const organizacionId = obtenerParametroRequerido(c, "id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);
      const tenants = await listarTenantsQlik(repositorio, organizacionId);
      return responderExito(
        c,
        tenants.map((tenant) => ({
          ...tenant,
          creadoEn: tenant.creadoEn.toISOString(),
        })),
      );
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.post("/organizaciones/:id/tenants-qlik", async (c) => {
    try {
      const organizacionId = obtenerParametroRequerido(c, "id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);
      const entrada = esquemaCrearTenantQlik.parse(await c.req.json());
      const tenant = await crearTenantQlik(repositorio, {
        organizacionId,
        tenantIdQlik: entrada.tenantIdQlik ?? generarUuid(),
        host: entrada.host,
        nombre: entrada.nombre,
      });
      if (!tenant) {
        return responderError(c, "Organización no encontrada", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }
      return responderExito(
        c,
        { ...tenant, creadoEn: tenant.creadoEn.toISOString() },
        201,
      );
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.put(
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/principal",
    async (c) => {
      try {
        const organizacionId = obtenerParametroRequerido(c, "id");
        const tenantQlikId = obtenerParametroRequerido(c, "tenantQlikId");
        const contexto = await resolverContexto(c);
        exigirAccesoOrganizacion(contexto, organizacionId);
        const tenant = await marcarTenantQlikPrincipal(
          repositorio,
          organizacionId,
          tenantQlikId,
        );
        if (!tenant) {
          return responderError(c, "Tenant Qlik no encontrado", 404, {
            codigo: "NO_ENCONTRADO",
          });
        }
        return responderExito(c, {
          ...tenant,
          creadoEn: tenant.creadoEn.toISOString(),
        });
      } catch (error) {
        return responderErrorAdmin(c, error);
      }
    },
  );

  rutas.delete("/organizaciones/:id/tenants-qlik/:tenantQlikId", async (c) => {
    try {
      const organizacionId = obtenerParametroRequerido(c, "id");
      const tenantQlikId = obtenerParametroRequerido(c, "tenantQlikId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);
      const resultado = await eliminarTenantQlik(
        repositorio,
        organizacionId,
        tenantQlikId,
      );
      if (resultado === "NO_ENCONTRADO") {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }
      if (resultado === "REQUIERE_REEMPLAZO") {
        return responderError(
          c,
          "Designa otro tenant principal antes de eliminar este tenant",
          409,
          { codigo: "TENANT_PRINCIPAL_REQUIERE_REEMPLAZO" },
        );
      }
      return responderExito(c, { eliminado: true });
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  return rutas;
}
