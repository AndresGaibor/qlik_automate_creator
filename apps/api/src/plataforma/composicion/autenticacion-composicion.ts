import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import {
  ClienteOAuthQlik,
  RepositorioConfiguracionOAuthPostgres,
} from "../../modulos/autenticacion-qlik/infraestructura/publico.js";
import {
  type RepositorioAutenticacion,
  ServicioAutenticacionQlik,
} from "../../modulos/autenticacion-qlik/publico.js";
import { ClienteHttpQlik } from "../../modulos/qlik/infraestructura/publico.js";
import type { ServicioQlik } from "../../modulos/qlik/publico.js";
import { ErrorNoAutorizado } from "../../nucleo/errores/error-aplicacion.js";
import { generarUuid } from "../../nucleo/valores/generar-uuid.js";
import type { ConfiguracionAplicacion } from "../configuracion/entorno.js";
import {
  type ContextoSolicitudAutenticado,
  construirContextoSolicitud,
} from "../contexto/contexto-solicitud.js";
import { db } from "../persistencia/conexion.js";
import { servicioCifrado } from "../seguridad/servicio-cifrado.js";

export function crearServicioAutenticacionDiferido(
  repositorio: RepositorioAutenticacion,
  configuracion: ConfiguracionAplicacion | undefined,
  redirectUriOAuth: string,
): ServicioAutenticacionQlik {
  const scopesHeredados = (
    configuracion?.QLIK_OAUTH_SCOPES ??
    process.env.QLIK_OAUTH_SCOPES ??
    ""
  )
    .split(/\s+/)
    .filter(Boolean);
  const configuracionesOAuth = new RepositorioConfiguracionOAuthPostgres(
    db,
    servicioCifrado,
    {
      clienteId: configuracion?.QLIK_CLIENT_ID ?? process.env.QLIK_CLIENT_ID,
      clienteSecreto:
        configuracion?.QLIK_CLIENT_SECRET ?? process.env.QLIK_CLIENT_SECRET,
      scopes: scopesHeredados,
    },
  );

  return new ServicioAutenticacionQlik(
    async (tenant, configuracionId) => {
      const credenciales = await configuracionesOAuth.obtenerParaTenant(
        tenant.id,
        configuracionId,
      );
      return {
        cliente: new ClienteOAuthQlik(
          credenciales.clienteId,
          credenciales.clienteSecreto,
          redirectUriOAuth,
          tenant.host,
          credenciales.scopes.length
            ? credenciales.scopes.join(" ")
            : undefined,
          undefined,
          configuracion?.QLIK_OAUTH_TIMEOUT_MS ??
            (Number(process.env.QLIK_OAUTH_TIMEOUT_MS) || 10_000),
        ),
        configuracionId: credenciales.configuracionId,
        origen: credenciales.origen,
      };
    },
    repositorio,
    configuracionesOAuth,
  );
}

export function crearResolverContextoSolicitud(
  repositorio: RepositorioAutenticacion,
) {
  const clave = "contextoSolicitud";
  return async (c: Context): Promise<ContextoSolicitudAutenticado> => {
    const existente = c.get(clave) as ContextoSolicitudAutenticado | undefined;
    if (existente) return existente;
    const token = getCookie(c, "sesion_usuario");
    if (!token) throw new ErrorNoAutorizado();
    const [info, publica] = await Promise.all([
      repositorio.obtenerInfoSesion(token),
      repositorio.consultarSesion(token),
    ]);
    if (!info || !publica) {
      throw new ErrorNoAutorizado("Sesión inválida o expirada");
    }
    const contexto = construirContextoSolicitud({
      solicitudId: (c.get("solicitudId") as string) ?? generarUuid(),
      sesion: info,
      sesionPublica: publica,
    });
    c.set(clave, contexto);
    return contexto;
  };
}

export function crearResolverSesion(
  resolverContexto: ReturnType<typeof crearResolverContextoSolicitud>,
) {
  return async (c: Context) => {
    const contexto = await resolverContexto(c);
    return {
      tenantId: contexto.tenantQlikId,
      usuarioId: contexto.usuarioId,
      organizacionId: contexto.organizacionId,
      esSuperadmin: contexto.esSuperadmin,
      roles: contexto.roles,
    };
  };
}

export function crearResolverQlik(
  resolverContexto: ReturnType<typeof crearResolverContextoSolicitud>,
  repositorio: RepositorioAutenticacion,
): (c: Context) => Promise<ServicioQlik> {
  return async (c) => {
    const contexto = await resolverContexto(c);
    const credenciales = await repositorio.obtenerCredenciales({
      sesionId: contexto.sesionId,
      usuarioId: contexto.usuarioId,
      identidadQlikId: contexto.identidadQlikId,
      tenantId: contexto.tenantQlikId,
      tenantHost: contexto.tenantHost,
      organizacionId: contexto.organizacionId,
    });
    if (!credenciales) {
      throw new ErrorNoAutorizado("El tenant activo requiere conexión Qlik");
    }
    return new ClienteHttpQlik(credenciales.host, credenciales.token);
  };
}

export function crearResolverContextoAdmin(
  resolverContexto: ReturnType<typeof crearResolverContextoSolicitud>,
  repositorio: RepositorioAutenticacion,
) {
  return async (c: Context) => {
    const contexto = await resolverContexto(c);
    const sesion = await repositorio.consultarSesion(
      getCookie(c, "sesion_usuario") ?? "",
    );
    if (!sesion) throw new Error("Sesión inválida");
    return {
      esSuperadmin: contexto.esSuperadmin ?? false,
      usuarioId: contexto.usuarioId,
      membresias: sesion.membresias,
    };
  };
}
