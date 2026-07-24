import { esquemaSesionPublica } from "@qlik/contratos/autenticacion";
import { type Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import {
  type ContextoSesion,
  type RepositorioAdministracion,
  RepositorioAdministracionPostgres,
  type ResolverContextoAdmin,
  crearRutasAdmin,
} from "./modulos/admin/publico.js";
import {
  ClienteOAuthQlik,
  type RepositorioAutenticacion,
  RepositorioAutenticacionPostgres,
  ServicioAutenticacionQlik,
  crearRutasAutenticacionQlik,
} from "./modulos/autenticacion-qlik/publico.js";
import {
  BloqueoEjecucionPostgres,
  crearRutasPanelAutomatizaciones,
} from "./modulos/automatizaciones/publico.js";
import {
  ClienteDestinos,
  type PuertoCatalogoDestinos,
  crearRutasDestinos,
} from "./modulos/destinos/publico.js";
import {
  ConsultaFlujosQlik,
  crearRutasFlujos,
} from "./modulos/flujos/publico.js";
import {
  ClienteHttpQlik,
  type ServicioQlik,
  crearRutasProxyQlik,
} from "./modulos/qlik/publico.js";
import type { PuertoAuditoria } from "./nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "./nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "./nucleo/idempotencia/puerto-idempotencia.js";
import type { ConfiguracionAplicacion } from "./plataforma/configuracion/entorno.js";
import { ErrorNoAutorizado } from "./plataforma/errores/error-aplicacion.js";
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
import { IdempotenciaPostgres } from "./plataforma/persistencia/idempotencia-postgres.js";
import { OutboxPostgres } from "./plataforma/persistencia/outbox-postgres.js";

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
    new RepositorioAutenticacionPostgres(configuracion?.SUPERADMINMAIL);
  const servicioAutenticacion =
    dependencias.servicioAutenticacion ??
    crearServicioAutenticacionDiferido(repositorioAutenticacion, configuracion);
  const resolverSesion =
    dependencias.resolverSesion ??
    crearResolverSesionPredeterminado(repositorioAutenticacion);
  const resolverQlik =
    dependencias.resolverQlik ??
    crearResolverQlikPredeterminado(repositorioAutenticacion);
  const catalogoDestinos =
    dependencias.catalogoDestinos ?? crearCatalogoDestinosDiferido();
  const idempotencia = dependencias.idempotencia ?? new IdempotenciaPostgres();
  const outbox = dependencias.outbox ?? new OutboxPostgres();
  const auditoria = dependencias.auditoria ?? new AuditoriaPostgres();
  const repositorioAdministracion =
    dependencias.repositorioAdministracion ??
    new RepositorioAdministracionPostgres();
  const resolverContextoAdmin =
    dependencias.resolverContextoAdmin ??
    crearResolverContextoAdminPredeterminado(repositorioAutenticacion);

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
      bloqueos: new BloqueoEjecucionPostgres(),
      idempotencia,
      outbox,
      auditoria,
    }),
  );
  aplicacion.route("/api/destinos", crearRutasDestinos(catalogoDestinos));
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

function crearCatalogoDestinosDiferido(): PuertoCatalogoDestinos {
  const crear = () =>
    new ClienteDestinos(
      exigirEntorno("REMOTE_API_URL"),
      exigirEntorno("REMOTE_API_KEY"),
    );

  return {
    listarBasesDatos: () => crear().listarBasesDatos(),
    listarTablas: (baseDatos) => crear().listarTablas(baseDatos),
    obtenerEsquemaTabla: (baseDatos, tabla) =>
      crear().obtenerEsquemaTabla(baseDatos, tabla),
    listarFlujosDatos: () => crear().listarFlujosDatos(),
    obtenerFlujoDatos: (id) => crear().obtenerFlujoDatos(id),
  };
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

function crearResolverContextoAdminPredeterminado(
  repositorio: RepositorioAutenticacion,
): ResolverContextoAdmin {
  return async (c: Context): Promise<ContextoSesion> => {
    const token = getCookie(c, "sesion_usuario");
    if (!token) throw new Error("No hay sesión");
    const sesion = await repositorio.consultarSesion(token);
    if (!sesion) throw new Error("Sesión inválida");
    const sesionParseada = esquemaSesionPublica.parse(sesion);
    return {
      esSuperadmin: sesionParseada.esSuperadmin,
      membresias: sesionParseada.membresias,
    };
  };
}

function crearResolverSesionPredeterminado(
  repositorio: RepositorioAutenticacion,
) {
  return async (c: Context) => {
    const token = getCookie(c, "sesion_usuario");
    const sesion = token ? await repositorio.obtenerInfoSesion(token) : null;
    if (!sesion) throw new ErrorNoAutorizado();
    return {
      tenantId: sesion.tenantId,
      usuarioId: sesion.usuarioId,
      organizacionId: sesion.organizacionId,
    };
  };
}

function crearResolverQlikPredeterminado(
  repositorio: RepositorioAutenticacion,
) {
  return async (c: Context): Promise<ServicioQlik> => {
    const token = getCookie(c, "sesion_usuario");
    const sesion = token ? await repositorio.obtenerInfoSesion(token) : null;
    if (!sesion) throw new ErrorNoAutorizado();
    const credenciales = await repositorio.obtenerCredenciales(sesion);
    if (!credenciales) {
      throw new ErrorNoAutorizado(
        "Credenciales Qlik no disponibles o expiradas",
      );
    }
    return new ClienteHttpQlik(credenciales.host, credenciales.token);
  };
}

function exigirEntorno(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}`);
  return valor;
}
