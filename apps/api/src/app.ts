import { esquemaSesionPublica } from "@qlik/contratos/autenticacion";
import { eq } from "drizzle-orm";
import { type Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import {
  type ContextoSesion,
  type RepositorioAdministracion,
  type ResolverContextoAdmin,
  crearRutasAdmin,
} from "./modulos/admin/publico.js";
import { RepositorioAdministracionPostgres } from "./modulos/admin/infraestructura/publico.js";
import {
  type RepositorioAutenticacion,
  ServicioAutenticacionQlik,
  crearRutasAutenticacionQlik,
} from "./modulos/autenticacion-qlik/publico.js";
import {
  ClienteOAuthQlik,
  RepositorioAutenticacionPostgres,
} from "./modulos/autenticacion-qlik/infraestructura/publico.js";
import { crearRutasPanelAutomatizaciones } from "./modulos/automatizaciones/publico.js";
import { BloqueoEjecucionPostgres } from "./modulos/automatizaciones/infraestructura/publico.js";
import { ConsultaTenantQlikPostgres } from "./modulos/automatizaciones/infraestructura/consulta-tenant-qlik-postgres.js";
import {
  type PuertoCatalogoDestinos,
  crearRutasDestinos,
} from "./modulos/destinos/publico.js";
import {
  ClienteImpalaDirecto,
} from "./modulos/destinos/infraestructura/publico.js";
import { crearRutasFlujos } from "./modulos/flujos/publico.js";
import { ConsultaFlujosQlik } from "./modulos/flujos/infraestructura/publico.js";
import { type ServicioQlik, crearRutasProxyQlik } from "./modulos/qlik/publico.js";
import {
  ClienteHttpQlik,
} from "./modulos/qlik/infraestructura/publico.js";
import type { PuertoAuditoria } from "./nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "./nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "./nucleo/idempotencia/puerto-idempotencia.js";
import type { ConfiguracionAplicacion } from "./plataforma/configuracion/entorno.js";
import {
  type ContextoSolicitudAutenticado,
  construirContextoSolicitud,
} from "./plataforma/contexto/contexto-solicitud.js";
import { ErrorNoAutorizado } from "./nucleo/errores/error-aplicacion.js";
import { crearManejadorErrores } from "./plataforma/errores/manejador-http.js";
import { crearMiddlewareCors } from "./plataforma/http/middlewares/cors.js";
import { crearMiddlewareObservabilidad } from "./plataforma/http/middlewares/observabilidad.js";
import {
  responderError,
  responderExito,
} from "./plataforma/http/respuestas.js";
import {
  type Registrador,
  registradorConsola,
} from "./plataforma/observabilidad/registrador.js";
import { AuditoriaPostgres } from "./plataforma/persistencia/auditoria-postgres.js";
import { db } from "./plataforma/persistencia/conexion.js";
import { tenantsQlik } from "./plataforma/persistencia/esquema.js";
import { IdempotenciaPostgres } from "./plataforma/persistencia/idempotencia-postgres.js";
import { OutboxPostgres } from "./plataforma/persistencia/outbox-postgres.js";
import { servicioCifrado } from "./plataforma/seguridad/servicio-cifrado.js";

export interface DependenciasAplicacion {
  configuracion?: ConfiguracionAplicacion;
  registrador?: Registrador;
  repositorioAutenticacion?: RepositorioAutenticacion;
  servicioAutenticacion?: ServicioAutenticacionQlik;
  resolverQlik?: (c: Context) => Promise<ServicioQlik>;
  resolverSesion?: (c: Context) => Promise<{
    tenantId: string;
    usuarioId: string;
    organizacionId: string;
  }>;
  catalogoDestinos?: PuertoCatalogoDestinos;
  idempotencia?: PuertoIdempotencia;
  outbox?: PuertoOutbox;
  auditoria?: PuertoAuditoria;
  repositorioAdministracion?: RepositorioAdministracion;
  resolverContextoAdmin?: ResolverContextoAdmin;
}

export function crearAplicacion(
  dependencias: DependenciasAplicacion = {},
): Hono {
  const configuracion = dependencias.configuracion;
  const registrador = dependencias.registrador ?? registradorConsola;
  const repositorioAutenticacion =
    dependencias.repositorioAutenticacion ??
    new RepositorioAutenticacionPostgres(db, servicioCifrado, configuracion?.SUPERADMINMAIL);
  const servicioAutenticacion =
    dependencias.servicioAutenticacion ??
    crearServicioAutenticacionDiferido(repositorioAutenticacion, configuracion);
  const resolverContextoSolicitud = crearResolverContextoSolicitud(
    repositorioAutenticacion,
  );
  const resolverSesion =
    dependencias.resolverSesion ??
    (async (c) => {
      const contexto = await resolverContextoSolicitud(c);
      return {
        tenantId: contexto.tenantQlikId,
        usuarioId: contexto.usuarioId,
        organizacionId: contexto.organizacionId,
      };
    });
  const resolverQlik =
    dependencias.resolverQlik ??
    (async (c) => {
      const contexto = await resolverContextoSolicitud(c);
      const credenciales = await repositorioAutenticacion.obtenerCredenciales({
        sesionId: contexto.sesionId,
        usuarioId: contexto.usuarioId,
        identidadQlikId: contexto.identidadQlikId,
        tenantId: contexto.tenantQlikId,
        tenantHost: contexto.tenantHost,
        organizacionId: contexto.organizacionId,
      });
      if (!credenciales)
        throw new ErrorNoAutorizado("El tenant activo requiere conexión Qlik");
      return new ClienteHttpQlik(credenciales.host, credenciales.token);
    });

  const resolverCatalogoDestinos = async (
    c: Context,
  ): Promise<PuertoCatalogoDestinos> => {
    if (dependencias.catalogoDestinos) return dependencias.catalogoDestinos;

    const contexto = await resolverContextoSolicitud(c);
    const tenant = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, contexto.tenantQlikId),
    });

    if (!tenant) {
      throw new Error("Tenant no encontrado");
    }

    if (tenant.impalaHost) {
      return new ClienteImpalaDirecto({
        host: tenant.impalaHost,
        port: tenant.impalaPort ?? 21050,
        authMechanism: tenant.impalaAuthMechanism ?? "NOSASL",
        user: tenant.impalaUser ?? undefined,
        password: tenant.impalaPassword ?? undefined,
        database: tenant.impalaDatabase ?? "default",
      });
    }

    throw new Error(
      "El tenant no tiene configurado un servidor Impala. Configúralo en la sección de administración.",
    );
  };


  const idempotencia = dependencias.idempotencia ?? new IdempotenciaPostgres();
  const outbox = dependencias.outbox ?? new OutboxPostgres();
  const auditoria = dependencias.auditoria ?? new AuditoriaPostgres();
  const repositorioAdministracion =
    dependencias.repositorioAdministracion ??
    new RepositorioAdministracionPostgres(db);
  const resolverContextoAdmin =
    dependencias.resolverContextoAdmin ??
    (async (c) => {
      const contexto = await resolverContextoSolicitud(c);
      const sesion = await repositorioAutenticacion.consultarSesion(
        getCookie(c, "sesion_usuario") ?? "",
      );
      if (!sesion) throw new Error("Sesión inválida");
      return {
        esSuperadmin: contexto.esSuperadmin ?? false,
        membresias: sesion.membresias,
      };
    });

  const aplicacion = new Hono();
  const frontendUrl =
    configuracion?.FRONTEND_URL ??
    process.env.FRONTEND_URL ??
    "http://localhost:5173";
  const produccion =
    (configuracion?.NODE_ENV ?? process.env.NODE_ENV) === "production";

  aplicacion.use("*", crearMiddlewareCors(frontendUrl));
  aplicacion.use("*", crearMiddlewareObservabilidad(registrador));

  aplicacion.get("/api/salud", (c) =>
    responderExito(c, {
      estado: "ok",
      fecha: new Date().toISOString(),
      arquitectura: "monolito-modular",
    }),
  );

  // Composition root: único archivo que construye y conecta adaptadores.
  aplicacion.route(
    "/api/auth/qlik",
    crearRutasAutenticacionQlik(servicioAutenticacion, {
      frontendUrl,
      produccion,
    }),
  );
  aplicacion.route(
    "/api/flujos",
    crearRutasFlujos(
      async (c) => new ConsultaFlujosQlik(await resolverQlik(c)),
    ),
  );
  aplicacion.route(
    "/api/automatizaciones",
    crearRutasPanelAutomatizaciones({
      resolverQlik,
      resolverSesion,
      consultaTenant: new ConsultaTenantQlikPostgres(),
      bloqueos: new BloqueoEjecucionPostgres(db),
      idempotencia,
      outbox,
      auditoria,
    }),
  );
  aplicacion.route(
    "/api/destinos",
    crearRutasDestinos(resolverCatalogoDestinos),
  );
  aplicacion.route("/api/qlik", crearRutasProxyQlik(resolverQlik));
  aplicacion.route(
    "/api/admin",
    crearRutasAdmin({
      repositorio: repositorioAdministracion,
      resolverContexto: resolverContextoAdmin,
    }),
  );

  aplicacion.notFound((c) =>
    responderError(c, "Ruta no encontrada", 404, {
      codigo: "RUTA_NO_ENCONTRADA",
    }),
  );
  aplicacion.onError(crearManejadorErrores(registrador));

  return aplicacion;
}



function crearServicioAutenticacionDiferido(
  repositorio: RepositorioAutenticacion,
  configuracion?: ConfiguracionAplicacion,
): ServicioAutenticacionQlik {
  return new ServicioAutenticacionQlik(
    (hostTenant) =>
      new ClienteOAuthQlik(
        configuracion?.QLIK_CLIENT_ID ?? exigirEntorno("QLIK_CLIENT_ID"),
        configuracion?.QLIK_CLIENT_SECRET ??
          exigirEntorno("QLIK_CLIENT_SECRET"),
        configuracion?.QLIK_REDIRECT_URI ?? exigirEntorno("QLIK_REDIRECT_URI"),
        hostTenant,
        configuracion?.QLIK_OAUTH_SCOPES ?? process.env.QLIK_OAUTH_SCOPES,
      ),
    repositorio,
  );
}

function crearResolverContextoSolicitud(repositorio: RepositorioAutenticacion) {
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
    if (!info || !publica)
      throw new ErrorNoAutorizado("Sesión inválida o expirada");
    const contexto = construirContextoSolicitud({
      solicitudId: (c.get("solicitudId") as string) ?? crypto.randomUUID(),
      sesion: info,
      sesionPublica: publica,
    });
    c.set(clave, contexto);
    return contexto;
  };
}

function exigirEntorno(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}`);
  return valor;
}
