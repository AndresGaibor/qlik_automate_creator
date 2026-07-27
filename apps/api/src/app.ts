import { esquemaSesionPublica } from "@qlik/contratos/autenticacion";
import { eq } from "drizzle-orm";
import { type Context, Hono } from "hono";
import { getCookie } from "hono/cookie";
import { RepositorioAdministracionPostgres } from "./modulos/admin/infraestructura/publico.js";
import {
  type ContextoSesion,
  type RepositorioAdministracion,
  type ResolverContextoAdmin,
  crearRutasAdmin,
} from "./modulos/admin/publico.js";
import {
  ClienteOAuthQlik,
  RepositorioAutenticacionPostgres,
  RepositorioConfiguracionOAuthPostgres,
} from "./modulos/autenticacion-qlik/infraestructura/publico.js";
import {
  type RepositorioAutenticacion,
  ServicioAutenticacionQlik,
  crearRutasAutenticacionQlik,
} from "./modulos/autenticacion-qlik/publico.js";
import { ConsultaTenantQlikPostgres } from "./modulos/automatizaciones/infraestructura/consulta-tenant-qlik-postgres.js";
import { BloqueoEjecucionPostgres } from "./modulos/automatizaciones/infraestructura/publico.js";
import { crearRutasPanelAutomatizaciones } from "./modulos/automatizaciones/publico.js";
import { ClienteImpalaDirecto } from "./modulos/destinos/infraestructura/publico.js";
import {
  type PuertoCatalogoDestinos,
  crearRutasDestinos,
} from "./modulos/destinos/publico.js";
import { ConsultaFlujosQlik } from "./modulos/flujos/infraestructura/publico.js";
import { crearRutasFlujos } from "./modulos/flujos/publico.js";
import { ClienteHttpQlik } from "./modulos/qlik/infraestructura/publico.js";
import {
  type ServicioQlik,
  crearRutasProxyQlik,
} from "./modulos/qlik/publico.js";
import { ConfiguracionAppPostgres } from "./modulos/setup/infraestructura/configuracion-app-postgres.js";
import { crearRutasSetup } from "./modulos/setup/publico.js";
import type { PuertoAuditoria } from "./nucleo/auditoria/puerto-auditoria.js";
import { ErrorNoAutorizado } from "./nucleo/errores/error-aplicacion.js";
import type { PuertoOutbox } from "./nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "./nucleo/idempotencia/puerto-idempotencia.js";
import { generarUuid } from "./nucleo/valores/generar-uuid.js";
import { ejecutarBootstrap } from "./plataforma/bootstrap/bootstrap.js";
import { RepositorioBootstrapPostgres } from "./plataforma/bootstrap/repositorio-bootstrap-postgres.js";
import type { ConfiguracionAplicacion } from "./plataforma/configuracion/entorno.js";
import {
  type ContextoSolicitudAutenticado,
  construirContextoSolicitud,
} from "./plataforma/contexto/contexto-solicitud.js";
import { crearManejadorErrores } from "./plataforma/errores/manejador-http.js";
import { crearMiddlewareCabecerasSeguridad } from "./plataforma/http/middlewares/cabeceras-seguridad.js";
import { crearMiddlewareCors } from "./plataforma/http/middlewares/cors.js";
import { crearMiddlewareLimiteSolicitudes } from "./plataforma/http/middlewares/limite-solicitudes.js";
import { crearMiddlewareObservabilidad } from "./plataforma/http/middlewares/observabilidad.js";
import { crearMiddlewareOrigenCsrf } from "./plataforma/http/middlewares/origen-csrf.js";
import {
  responderError,
  responderExito,
} from "./plataforma/http/respuestas.js";
import {
  type Registrador,
  registradorConsola,
} from "./plataforma/observabilidad/registrador.js";
import { AuditoriaPostgres } from "./plataforma/persistencia/auditoria-postgres.js";
import { db, dbHolder } from "./plataforma/persistencia/conexion.js";
import { appConfig, tenantsQlik } from "./plataforma/persistencia/esquema.js";
import { IdempotenciaPostgres } from "./plataforma/persistencia/idempotencia-postgres.js";
import { OutboxPostgres } from "./plataforma/persistencia/outbox-postgres.js";
import { leerSecretoCifrado } from "./plataforma/seguridad/secreto-cifrado.js";
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

export async function crearAplicacion(
  dependencias: DependenciasAplicacion = {},
): Promise<Hono> {
  const configuracion = dependencias.configuracion;
  const registrador = dependencias.registrador ?? registradorConsola;

  await servicioCifrado.inicializarConDb({
    async guardar(clave, valor) {
      await db
        .insert(appConfig)
        .values({ clave, valor: valor as Record<string, unknown> })
        .onConflictDoUpdate({
          target: appConfig.clave,
          set: {
            valor: valor as Record<string, unknown>,
            actualizadoEn: new Date(),
          },
        });
    },
    async obtener(clave) {
      const fila = await db.query.appConfig.findFirst({
        where: (tc, { eq }) => eq(tc.clave, clave),
      });
      return fila?.valor ?? null;
    },
  });

  const repositorioAutenticacion =
    dependencias.repositorioAutenticacion ??
    new RepositorioAutenticacionPostgres(
      db,
      servicioCifrado,
      configuracion?.SUPERADMINMAIL,
    );
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
        password: leerSecretoCifrado(
          servicioCifrado,
          tenant.impalaPasswordCifrada,
        ),
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
    new RepositorioAdministracionPostgres(db, servicioCifrado);
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
        usuarioId: contexto.usuarioId,
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
  const redirectUriOAuth =
    configuracion?.QLIK_REDIRECT_URI ??
    process.env.QLIK_REDIRECT_URI ??
    "http://localhost:3000/api/auth/qlik/callback";
  const scopesOAuthHeredados = (
    configuracion?.QLIK_OAUTH_SCOPES ??
    process.env.QLIK_OAUTH_SCOPES ??
    ""
  )
    .split(/\s+/)
    .filter(Boolean);

  aplicacion.use("*", await crearMiddlewareCors(db, frontendUrl));
  aplicacion.use("*", crearMiddlewareCabecerasSeguridad(produccion));
  aplicacion.use("*", crearMiddlewareObservabilidad(registrador));
  aplicacion.use("*", crearMiddlewareOrigenCsrf(frontendUrl));
  aplicacion.use(
    "*",
    crearMiddlewareLimiteSolicitudes([
      {
        ruta: "/api/auth/qlik/iniciar",
        metodos: ["GET"],
        maximo: 10,
        ventanaMs: 60_000,
      },
      {
        ruta: "/api/auth/qlik/iniciar-por-correo",
        metodos: ["GET"],
        maximo: 10,
        ventanaMs: 60_000,
      },
      {
        ruta: "/api/auth/qlik/callback",
        metodos: ["GET"],
        maximo: 20,
        ventanaMs: 60_000,
      },
      {
        ruta: "/api/setup/complete",
        metodos: ["POST"],
        maximo: 5,
        ventanaMs: 60_000,
      },
    ]),
  );

  aplicacion.get("/api/salud", (c) =>
    responderExito(c, {
      estado: "ok",
      fecha: new Date().toISOString(),
      arquitectura: "monolito-modular",
    }),
  );

  const repoOAuthSetup = new RepositorioConfiguracionOAuthPostgres(
    db,
    servicioCifrado,
    {},
  );

  aplicacion.route(
    "/api/setup",
    crearRutasSetup(
      new ConfiguracionAppPostgres(db),
      async (entrada) => {
        const resultado = await ejecutarBootstrap(
          new RepositorioBootstrapPostgres(dbHolder.client),
          entrada,
        );
        return {
          organizacionId: resultado.organizacionId,
          tenantQlikId: resultado.tenantQlikId,
          superadminId: resultado.superadministradorId,
        };
      },
      repoOAuthSetup.guardarOAuthInicial.bind(repoOAuthSetup),
    ),
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
      resolverQlik,
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
      redirectUri: redirectUriOAuth,
      configuracionHeredada: {
        clienteId: configuracion?.QLIK_CLIENT_ID ?? process.env.QLIK_CLIENT_ID,
        tieneSecreto: Boolean(
          configuracion?.QLIK_CLIENT_SECRET ?? process.env.QLIK_CLIENT_SECRET,
        ),
        scopes: scopesOAuthHeredados,
      },
      auditoria,
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
          configuracion?.QLIK_REDIRECT_URI ??
            exigirEntorno("QLIK_REDIRECT_URI"),
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
      solicitudId: (c.get("solicitudId") as string) ?? generarUuid(),
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
