import { esquemaConfigurarOauthQlik } from "@qlik/contratos/admin";
import { type Context, Hono } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type {
  ConfiguracionOauthAdministrable,
  RepositorioAdministracion,
} from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  exigirAccesoOrganizacion,
  responderErrorAdmin,
} from "./rutas-comunes.js";

export interface OpcionesConfiguracionOAuth {
  redirectUri: string;
  configuracionHeredada: {
    clienteId?: string;
    tieneSecreto: boolean;
    scopes: string[];
  };
}

export interface DependenciasRutasConfiguracionOAuth
  extends OpcionesConfiguracionOAuth {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
  auditoria: PuertoAuditoria;
}

export function crearRutasConfiguracionOAuth(
  dependencias: DependenciasRutasConfiguracionOAuth,
) {
  const rutas = new Hono();
  const ruta = "/organizaciones/:id/tenants-qlik/:tenantQlikId/oauth";
  rutas.get(ruta, async (c) => {
    try {
      const organizacionId = c.req.param("id");
      const tenantQlikId = c.req.param("tenantQlikId");
      const contexto = await dependencias.resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);
      const configuracion =
        await dependencias.repositorio.obtenerConfiguracionOAuth(
          organizacionId,
          tenantQlikId,
        );
      if (configuracion) {
        return responderExito(
          c,
          serializar(configuracion, dependencias.redirectUri),
        );
      }
      return responderExito(
        c,
        resumenSinFila(
          tenantQlikId,
          dependencias.redirectUri,
          dependencias.configuracionHeredada,
        ),
      );
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.put(ruta, async (c) => {
    try {
      const organizacionId = c.req.param("id");
      const tenantQlikId = c.req.param("tenantQlikId");
      const contexto = await dependencias.resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);
      const entrada = esquemaConfigurarOauthQlik.parse(await c.req.json());
      const anterior = await dependencias.repositorio.obtenerConfiguracionOAuth(
        organizacionId,
        tenantQlikId,
      );
      const guardada = await dependencias.repositorio.guardarConfiguracionOAuth(
        organizacionId,
        tenantQlikId,
        { ...entrada, usuarioId: contexto.usuarioId },
      );
      if (!guardada) {
        return responderError(c, "Tenant Qlik no encontrado", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }
      await dependencias.auditoria
        .registrar({
          organizacionId,
          usuarioId: contexto.usuarioId,
          accion: "oauth.configurar",
          entidadTipo: "configuracion-oauth-qlik",
          entidadId: tenantQlikId,
          resultado: "exito",
          datosAnteriores: anterior ? resumirAuditoria(anterior) : undefined,
          datosNuevos: resumirAuditoria(guardada),
          ip: obtenerIp(c),
          agenteUsuario: c.req.header("user-agent"),
        })
        .catch(() => undefined);
      return responderExito(c, serializar(guardada, dependencias.redirectUri));
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Debes ingresar el secreto OAuth inicial"
      ) {
        return responderError(c, error.message, 400, {
          codigo: "SECRETO_OAUTH_REQUERIDO",
        });
      }
      return responderErrorAdmin(c, error);
    }
  });

  rutas.delete(ruta, async (c) => {
    try {
      const organizacionId = c.req.param("id");
      const tenantQlikId = c.req.param("tenantQlikId");
      const contexto = await dependencias.resolverContexto(c);
      exigirAccesoOrganizacion(contexto, organizacionId);
      if (!contexto.esSuperadmin) {
        return responderError(
          c,
          "Solo un superadministrador puede eliminar OAuth",
          403,
          { codigo: "NO_AUTORIZADO" },
        );
      }
      const eliminado =
        await dependencias.repositorio.eliminarConfiguracionOAuth(
          organizacionId,
          tenantQlikId,
        );
      if (!eliminado) {
        return responderError(c, "Configuración OAuth no encontrada", 404, {
          codigo: "NO_ENCONTRADO",
        });
      }
      await dependencias.auditoria
        .registrar({
          organizacionId,
          usuarioId: contexto.usuarioId,
          accion: "oauth.eliminar",
          entidadTipo: "configuracion-oauth-qlik",
          entidadId: tenantQlikId,
          resultado: "exito",
          ip: obtenerIp(c),
          agenteUsuario: c.req.header("user-agent"),
        })
        .catch(() => undefined);
      return responderExito(c, { eliminado: true });
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  return rutas;
}

function serializar(
  configuracion: ConfiguracionOauthAdministrable,
  redirectUri: string,
) {
  return {
    ...configuracion,
    verificadaEn: configuracion.verificadaEn?.toISOString() ?? null,
    actualizadoEn: configuracion.actualizadoEn.toISOString(),
    redirectUri,
  };
}

function resumenSinFila(
  tenantQlikId: string,
  redirectUri: string,
  heredada: OpcionesConfiguracionOAuth["configuracionHeredada"],
) {
  const clienteIdHeredado = heredada.clienteId ?? null;
  const usaHeredada = Boolean(clienteIdHeredado && heredada.tieneSecreto);
  return {
    tenantQlikId,
    clienteId: usaHeredada ? clienteIdHeredado : null,
    secretoMascara: usaHeredada ? "••••••••" : null,
    scopes: usaHeredada ? heredada.scopes : [],
    estado: null,
    origen: usaHeredada
      ? ("entorno_global" as const)
      : ("sin_configurar" as const),
    verificadaEn: null,
    ultimoError: null,
    actualizadoEn: null,
    redirectUri,
  };
}

function resumirAuditoria(configuracion: ConfiguracionOauthAdministrable) {
  return {
    tenantQlikId: configuracion.tenantQlikId,
    clienteId: configuracion.clienteId,
    scopes: configuracion.scopes,
    estado: configuracion.estado,
    origen: configuracion.origen,
  };
}

function obtenerIp(c: Context): string {
  return (
    c.req.header("cf-connecting-ip") ??
    c.req.header("x-forwarded-for") ??
    "desconocida"
  );
}
