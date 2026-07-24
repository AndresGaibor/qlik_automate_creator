import {
  esquemaActualizarTenant,
  esquemaActualizarUsuario,
  esquemaAgregarUsuario,
  esquemaConfigurarAutomatizacionBase,
  esquemaConfigurarDestinoTenant,
  esquemaConfigurarImpalaTenant,
  esquemaCrearTenant,
  esquemaCrearTenantQlik,
} from "@qlik/contratos/admin";
import { type Context, Hono } from "hono";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import { actualizarTenant } from "../aplicacion/casos-de-uso/actualizar-tenant.js";
import { actualizarUsuario } from "../aplicacion/casos-de-uso/actualizar-usuario.js";
import { agregarUsuario } from "../aplicacion/casos-de-uso/agregar-usuario.js";
import { crearTenant } from "../aplicacion/casos-de-uso/crear-tenant.js";
import { eliminarTenant } from "../aplicacion/casos-de-uso/eliminar-tenant.js";
import { eliminarUsuario } from "../aplicacion/casos-de-uso/eliminar-usuario.js";
import {
  crearTenantQlik,
  eliminarTenantQlik,
  listarTenantsQlik,
  marcarTenantQlikPrincipal,
} from "../aplicacion/casos-de-uso/gestionar-tenants-qlik.js";
import { listarTenants } from "../aplicacion/casos-de-uso/listar-tenants.js";
import { obtenerDetalleTenant } from "../aplicacion/casos-de-uso/obtener-detalle-tenant.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import {
  type ContextoSesion,
  ServicioAdmin,
} from "../aplicacion/servicio-admin.js";

const servicioAdmin = new ServicioAdmin();

export type ResolverContextoAdmin = (c: Context) => Promise<ContextoSesion>;

export interface DependenciasRutasAdmin {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

function exigirAccesoOrganizacion(
  contexto: ContextoSesion,
  organizacionId: string,
): void {
  if (!servicioAdmin.puedeAcceder(contexto, organizacionId)) {
    throw new Error("No tienes permisos para acceder a este tenant");
  }
}

export function crearRutasAdmin({
  repositorio,
  resolverContexto,
}: DependenciasRutasAdmin) {
  const rutas = new Hono();

  rutas.get("/tenants", async (c) => {
    try {
      const contexto = await resolverContexto(c);

      if (!servicioAdmin.puedeListar(contexto)) {
        return responderError(
          c,
          "No tienes permisos para listar tenants",
          403,
          {
            codigo: "NO_AUTORIZADO",
          },
        );
      }

      const tenants = await listarTenants(repositorio);
      return responderExito(c, tenants);
    } catch (error) {
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      return responderError(c, "Error interno", 500);
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
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      if (error instanceof Error && error.message.includes("ZodError")) {
        return responderError(c, "Datos inválidos", 400, {
          codigo: "DATOS_INVALIDOS",
        });
      }
      return responderError(c, "Error interno", 500);
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
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      if (error instanceof Error && error.message.includes("permisos")) {
        return responderError(c, error.message, 403, {
          codigo: "NO_AUTORIZADO",
        });
      }
      return responderError(c, "Error interno", 500);
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
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      if (error instanceof Error && error.message.includes("permisos")) {
        return responderError(c, error.message, 403, {
          codigo: "NO_AUTORIZADO",
        });
      }
      return responderError(c, "Error interno", 500);
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
          {
            codigo: "NO_AUTORIZADO",
          },
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
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      if (error instanceof Error && error.message.includes("permisos")) {
        return responderError(c, error.message, 403, {
          codigo: "NO_AUTORIZADO",
        });
      }
      return responderError(c, "Error interno", 500);
    }
  });

  rutas.post("/tenants/:id/usuarios", async (c) => {
    try {
      const id = c.req.param("id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const cuerpo = await c.req.json();
      const entrada = esquemaAgregarUsuario.parse(cuerpo);

      const resultado = await agregarUsuario(repositorio, id, entrada);
      if (!resultado) {
        return responderError(c, "Tenant no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado, 201);
    } catch (error) {
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      if (error instanceof Error && error.message.includes("permisos")) {
        return responderError(c, error.message, 403, {
          codigo: "NO_AUTORIZADO",
        });
      }
      return responderError(c, "Error interno", 500);
    }
  });

  rutas.patch("/tenants/:id/usuarios/:usuarioId", async (c) => {
    try {
      const id = c.req.param("id");
      const usuarioId = c.req.param("usuarioId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const cuerpo = await c.req.json();
      const entrada = esquemaActualizarUsuario.parse(cuerpo);

      const resultado = await actualizarUsuario(
        repositorio,
        id,
        usuarioId,
        entrada,
      );
      if (!resultado) {
        return responderError(c, "Usuario no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      if (error instanceof Error && error.message.includes("permisos")) {
        return responderError(c, error.message, 403, {
          codigo: "NO_AUTORIZADO",
        });
      }
      return responderError(c, "Error interno", 500);
    }
  });

  rutas.delete("/tenants/:id/usuarios/:usuarioId", async (c) => {
    try {
      const id = c.req.param("id");
      const usuarioId = c.req.param("usuarioId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, id);

      const resultado = await eliminarUsuario(repositorio, id, usuarioId);
      if (!resultado.eliminado) {
        return responderError(c, "Usuario no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      if (error instanceof Error && error.message === "No hay sesión") {
        return responderError(c, "Sesión requerida", 401, {
          codigo: "SESION_REQUERIDA",
        });
      }
      if (error instanceof Error && error.message === "Sesión inválida") {
        return responderError(c, "Sesión inválida", 401, {
          codigo: "SESION_INVALIDA",
        });
      }
      if (error instanceof Error && error.message.includes("permisos")) {
        return responderError(c, error.message, 403, {
          codigo: "NO_AUTORIZADO",
        });
      }
      return responderError(c, "Error interno", 500);
    }
  });

  rutas.get("/organizaciones/:id/tenants-qlik", async (c) => {
    try {
      const organizacionId = c.req.param("id");
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
      const organizacionId = c.req.param("id");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);
      const entrada = esquemaCrearTenantQlik.parse(await c.req.json());
      const tenant = await crearTenantQlik(repositorio, {
        organizacionId,
        ...entrada,
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
        const organizacionId = c.req.param("id");
        const tenantQlikId = c.req.param("tenantQlikId");
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
      const organizacionId = c.req.param("id");
      const tenantQlikId = c.req.param("tenantQlikId");
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

  const handlerAutomatizacionBase = async (c: Context) => {
    try {
      const organizacionId = c.req.param("id");
      const tenantQlikId = c.req.param("tenantQlikId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);

      const cuerpo = await c.req.json();
      const entrada = esquemaConfigurarAutomatizacionBase.parse(cuerpo);

      const resultado = await repositorio.configurarAutomatizacionBase(
        organizacionId,
        tenantQlikId,
        entrada.automatizacionBaseIdQlik,
        entrada.automatizacionBaseNombre,
      );

      if (!resultado) {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  rutas.put(
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/automatizacion-base",
    handlerAutomatizacionBase,
  );
  rutas.put(
    "/tenants/:id/qlik/:tenantQlikId/automatizacion-base",
    handlerAutomatizacionBase,
  );

  const handlerDestino = async (c: Context) => {
    try {
      const organizacionId = c.req.param("id");
      const tenantQlikId = c.req.param("tenantQlikId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);

      const cuerpo = await c.req.json();
      const entrada = esquemaConfigurarDestinoTenant.parse(cuerpo);

      const resultado = await repositorio.configurarDestinoTenant(
        organizacionId,
        tenantQlikId,
        entrada.destinoApiUrl,
        entrada.destinoApiKey,
        entrada.destinoBaseDatos,
      );

      if (!resultado) {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  rutas.put(
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/destino",
    handlerDestino,
  );
  rutas.put(
    "/tenants/:id/qlik/:tenantQlikId/destino",
    handlerDestino,
  );

  const handlerImpala = async (c: Context) => {
    try {
      const organizacionId = c.req.param("id");
      const tenantQlikId = c.req.param("tenantQlikId");
      const contexto = await resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);

      const cuerpo = await c.req.json();
      const entrada = esquemaConfigurarImpalaTenant.parse(cuerpo);

      const resultado = await repositorio.configurarImpalaTenant(
        organizacionId,
        tenantQlikId,
        entrada,
      );

      if (!resultado) {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }

      return responderExito(c, resultado);
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  };

  rutas.put(
    "/organizaciones/:id/tenants-qlik/:tenantQlikId/impala",
    handlerImpala,
  );
  rutas.put(
    "/tenants/:id/qlik/:tenantQlikId/impala",
    handlerImpala,
  );

  return rutas;
}

function responderErrorAdmin(c: Context, error: unknown) {
  if (error instanceof Error && error.message === "No hay sesión") {
    return responderError(c, "Sesión requerida", 401, {
      codigo: "SESION_REQUERIDA",
    });
  }
  if (error instanceof Error && error.message === "Sesión inválida") {
    return responderError(c, "Sesión inválida", 401, {
      codigo: "SESION_INVALIDA",
    });
  }
  if (error instanceof Error && error.message.includes("permisos")) {
    return responderError(c, error.message, 403, { codigo: "NO_AUTORIZADO" });
  }
  if (error instanceof Error && error.name === "ZodError") {
    return responderError(c, "Datos inválidos", 400, {
      codigo: "DATOS_INVALIDOS",
    });
  }
  return responderError(c, "Error interno", 500);
}
