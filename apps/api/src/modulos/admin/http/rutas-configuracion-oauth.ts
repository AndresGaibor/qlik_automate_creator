import { esquemaConfigurarOauthQlik } from "@qlik/contratos/admin";
import { type Context, Hono } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import {
  GestionarConfiguracionOauth,
  type OpcionesGestionConfiguracionOauth,
} from "../aplicacion/casos-de-uso/gestionar-configuracion-oauth.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  exigirAccesoOrganizacion,
  responderErrorAdmin,
} from "./rutas-comunes.js";

export type OpcionesConfiguracionOAuth = OpcionesGestionConfiguracionOauth;

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
  const gestor = new GestionarConfiguracionOauth(
    dependencias.repositorio,
    dependencias.auditoria,
    dependencias,
  );
  const ruta = "/organizaciones/:id/tenants-qlik/:tenantQlikId/oauth";

  rutas.get(ruta, async (c) => {
    try {
      const acceso = await resolverAcceso(c, dependencias);
      return responderExito(
        c,
        await gestor.obtener(acceso.organizacionId, acceso.tenantQlikId),
      );
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.put(ruta, async (c) => {
    try {
      const acceso = await resolverAcceso(c, dependencias);
      const entrada = esquemaConfigurarOauthQlik.parse(await c.req.json());
      return responderExito(
        c,
        await gestor.guardar({
          ...acceso,
          entrada,
          ip: obtenerIp(c),
          agenteUsuario: c.req.header("user-agent"),
        }),
      );
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  rutas.delete(ruta, async (c) => {
    try {
      const acceso = await resolverAcceso(c, dependencias);
      return responderExito(
        c,
        await gestor.eliminar({
          ...acceso,
          esSuperadmin: acceso.esSuperadmin,
          ip: obtenerIp(c),
          agenteUsuario: c.req.header("user-agent"),
        }),
      );
    } catch (error) {
      return responderErrorAdmin(c, error);
    }
  });

  return rutas;
}

async function resolverAcceso(
  c: Context,
  dependencias: DependenciasRutasConfiguracionOAuth,
) {
  const organizacionId = parametroRequerido(c, "id");
  const tenantQlikId = parametroRequerido(c, "tenantQlikId");
  const contexto = await dependencias.resolverContexto(c);
  exigirAccesoOrganizacion(contexto, organizacionId);
  return {
    organizacionId,
    tenantQlikId,
    usuarioId: contexto.usuarioId,
    esSuperadmin: contexto.esSuperadmin,
  };
}

function obtenerIp(c: Context): string {
  return (
    c.req.header("cf-connecting-ip") ??
    c.req.header("x-forwarded-for") ??
    "desconocida"
  );
}

function parametroRequerido(c: Context, nombre: string): string {
  const valor = c.req.param(nombre);
  if (!valor) {
    throw new ErrorAplicacion(
      "PARAMETRO_FALTANTE",
      `Falta el parámetro ${nombre}`,
      400,
    );
  }
  return valor;
}
