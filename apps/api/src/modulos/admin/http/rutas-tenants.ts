import {
  esquemaActualizarTenant,
  esquemaCrearTenant,
} from "@qlik/contratos/admin";
import { type Context, Hono } from "hono";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import { actualizarTenant } from "../aplicacion/casos-de-uso/actualizar-tenant.js";
import { crearTenant } from "../aplicacion/casos-de-uso/crear-tenant.js";
import { eliminarTenant } from "../aplicacion/casos-de-uso/eliminar-tenant.js";
import { listarTenants } from "../aplicacion/casos-de-uso/listar-tenants.js";
import { obtenerDetalleTenant } from "../aplicacion/casos-de-uso/obtener-detalle-tenant.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  exigirAccesoOrganizacion,
  responderErrorAdmin,
  servicioAdmin,
} from "./rutas-comunes.js";

export interface DependenciasRutasTenants {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

export function crearRutasTenants({
  repositorio,
  resolverContexto,
}: DependenciasRutasTenants) {
  const rutas = new Hono();

  rutas.get("/tenants", async (c) => {
    try {
      const contexto = await resolverContexto(c);

      if (!servicioAdmin.puedeListar(contexto)) {
        return responderError(
          c,
          "No tienes permisos para listar tenants",
          403,
          { codigo: "NO_AUTORIZADO" },
        );
      }

      const tenants = await listarTenants(repositorio);
      return responderExito(c, tenants);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.post("/tenants", async (c) => {
    try {
      const contexto = await resolverContexto(c);

      if (!servicioAdmin.puedeCrear(contexto)) {
        return responderError(c, "No tienes permisos para crear tenants", 403, {
          codigo: "NO_AUTORIZADO",
        });
      }

      const cuerpo = await c.req.json();
      const entrada = esquemaCrearTenant.parse(cuerpo);
      const tenant = await crearTenant(repositorio, entrada);
      return responderExito(c, tenant, 201);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.get("/tenants/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const tenant = await obtenerDetalleTenant(repositorio, id);
      if (!tenant) {
        return responderError(c, "Tenant no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, tenant);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.patch("/tenants/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const cuerpo = await c.req.json();
      const entrada = esquemaActualizarTenant.parse(cuerpo);

      const tenant = await actualizarTenant(repositorio, id, entrada);
      if (!tenant) {
        return responderError(c, "Tenant no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, tenant);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.delete("/tenants/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      if (!servicioAdmin.puedeEliminar(contexto, id)) {
        return responderError(
          c,
          "No tienes permisos para eliminar este tenant",
          403,
          { codigo: "NO_AUTORIZADO" },
        );
      }

      const resultado = await eliminarTenant(repositorio, id);
      if (!resultado.eliminado) {
        return responderError(c, "Tenant no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  return rutas;
}
