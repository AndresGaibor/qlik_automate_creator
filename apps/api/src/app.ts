import { esquemaSesionPublica } from "@qlik/contratos/autenticacion";
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
import {
  ClienteImpalaDirecto,
  ConsultaConfiguracionImpalaPostgres,
  RepositorioConexionesDestinoPostgres,
  crearClienteDestino,
} from "./modulos/destinos/infraestructura/publico.js";
import {
  GestionarConexionesDestino,
  type PuertoCatalogoDestinos,
  crearRutasDestinos,
  crearRutasDestinosGenericas,
} from "./modulos/destinos/publico.js";
import { RepositorioEspaciosVisiblesPostgres } from "./modulos/espacios-visibles/infraestructura/repositorio-espacios-visibles-postgres.js";
import { crearPoliticaEspacios } from "./modulos/espacios-visibles/publico.js";
import { ConsultaFlujosQlik } from "./modulos/flujos/infraestructura/publico.js";
import { crearRutasFlujos } from "./modulos/flujos/publico.js";
import {
  ProbadorConexionOrigenReal,
  RepositorioConexionesOrigenPostgres,
} from "./modulos/origenes/infraestructura/publico.js";
import {
  GestionarConexionesOrigen,
  ProbarConexionOrigen,
  crearRutasConexionesOrigen,
} from "./modulos/origenes/publico.js";
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

export async function crearAplicacion(
  dependencias: DependenciasAplicacion = {},
): Promise<Hono> {
  const configuracion = dependencias.configuracion;
  const registrador = dependencias.registrador ?? registradorConsola;
  const configuracionApp = new ConfiguracionAppPostgres(db);
  const frontendUrlGuardado =
    await obtenerFrontendUrlGuardado(configuracionApp);
  const frontendUrl =
    frontendUrlGuardado ??
    configuracion?.FRONTEND_URL ??
    process.env.FRONTEND_URL ??
    "http://localhost:5173";
  const produccion =
    (configuracion?.NODE_ENV ?? process.env.NODE_ENV) === "production";
  const redirectUriConfigurado =
    process.env.QLIK_REDIRECT_URI ?? configuracion?.QLIK_REDIRECT_URI;
  const redirectUriOAuth = frontendUrlGuardado
    ? new URL("/api/auth/qlik/callback", frontendUrl).toString()
    : (redirectUriConfigurado ??
      "http://localhost:3000/api/auth/qlik/callback");

  await servicioCifrado.inicializarConDb(configuracionApp);

  const repositorioAutenticacion =
    dependencias.repositorioAutenticacion ??
    new RepositorioAutenticacionPostgres(
      db,
      servicioCifrado,
      configuracion?.SUPERADMINMAIL,
    );
  const servicioAutenticacion =
    dependencias.servicioAutenticacion ??
    crearServicioAutenticacionDiferido(
      repositorioAutenticacion,
      configuracion,
      redirectUriOAuth,
    );
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
        esSuperadmin: contexto.esSuperadmin,
        roles: contexto.roles,
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

  const consultaConfiguracionImpala = new ConsultaConfiguracionImpalaPostgres(
    db,
    servicioCifrado,
  );
  const resolverCatalogoDestinos = async (
    c: Context,
  ): Promise<PuertoCatalogoDestinos> => {
    if (dependencias.catalogoDestinos) return dependencias.catalogoDestinos;

    const contexto = await resolverContextoSolicitud(c);
    const configuracionImpala = await consultaConfiguracionImpala.obtener(
      contexto.tenantQlikId,
    );
    if (!configuracionImpala) {
      throw new Error(
        "El tenant no tiene configurado un servidor Impala. Configúralo en la sección de administración.",
      );
    }
    return new ClienteImpalaDirecto(configuracionImpala);
  };

  const repositorioEspaciosVisibles = new RepositorioEspaciosVisiblesPostgres(
    db,
  );
  const resolverPoliticaEspacios = async (c: Context) => {
    const contexto = await resolverContextoSolicitud(c);
    const configuracion = await repositorioEspaciosVisibles.obtener(
      contexto.tenantQlikId,
    );
    return crearPoliticaEspacios(configuracion, {
      esAdministrador:
        contexto.esSuperadmin || contexto.roles.includes("admin"),
      forzarVistaUsuarioFinal: c.req.header("x-vista-usuario-final") === "1",
    });
  };

  const idempotencia = dependencias.idempotencia ?? new IdempotenciaPostgres();
  const outbox = dependencias.outbox ?? new OutboxPostgres();
  const auditoria = dependencias.auditoria ?? new AuditoriaPostgres();
  const repositorioConexionesOrigen = new RepositorioConexionesOrigenPostgres(
    db,
    servicioCifrado,
  );
  const gestorConexionesOrigen = new GestionarConexionesOrigen(
    repositorioConexionesOrigen,
    auditoria,
  );
  const probarConexionOrigen = new ProbarConexionOrigen(
    repositorioConexionesOrigen,
    new ProbadorConexionOrigenReal(),
  );
  const consultaConexionesOrigen = {
    async listarPorOrganizacion(organizacionId: string) {
      return (await gestorConexionesOrigen.listar(organizacionId)).map(
        ({
          id,
          tipo,
          nombre,
          config,
          estado,
          probadaEn,
          mensajeError,
          secretoConfigurado,
        }) => ({
          id,
          tipo,
          nombre,
          config,
          estado,
          probadaEn,
          mensajeError,
          secretoConfigurado,
        }),
      );
    },
  };
  const repositorioConexionesDestino = new RepositorioConexionesDestinoPostgres(
    db,
    servicioCifrado,
  );
  const gestorConexionesDestino = new GestionarConexionesDestino(
    repositorioConexionesDestino,
  );
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
  aplicacion.use("*", crearMiddlewareOrigenCsrf(db));
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
      configuracionApp,
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
      resolverSesion,
      resolverPoliticaEspacios,
      consultaConexionesOrigen,
    ),
  );
  aplicacion.route(
    "/api/conexiones-origen",
    crearRutasConexionesOrigen({
      resolverSesion,
      gestor: gestorConexionesOrigen,
      probarConexion: probarConexionOrigen,
    }),
  );
  aplicacion.route(
    "/api/automatizaciones",
    crearRutasPanelAutomatizaciones({
      resolverQlik,
      resolverSesion,
      consultaTenant: new ConsultaTenantQlikPostgres(),
      obtenerModoGlobal:
        repositorioAdministracion.obtenerModoAutomatizacionGlobal.bind(
          repositorioAdministracion,
        ),
      consultarConexionesOrigen:
        consultaConexionesOrigen.listarPorOrganizacion.bind(
          consultaConexionesOrigen,
        ),
      consultarConexionesDestino: async (organizacionId) =>
        (await gestorConexionesDestino.listar(organizacionId)).map(
          ({ id, tipo, nombre, estado, probadaEn, mensajeError }) => ({
            id,
            tipo,
            nombre,
            estado,
            probadaEn,
            mensajeError,
          }),
        ),
      probarConexionOrigen: (organizacionId, conexionId) =>
        probarConexionOrigen.ejecutar(organizacionId, conexionId),
      leerSecretoOrigen: (organizacionId, conexionId, nombre) =>
        repositorioConexionesOrigen.leerSecreto(
          organizacionId,
          conexionId,
          nombre,
        ),
      obtenerConexionDestinoConSecreto: async (destinoId, organizacionId) => {
        try {
          return await gestorConexionesDestino.obtenerConSecreto(
            organizacionId,
            destinoId,
          );
        } catch {
          return null;
        }
      },
      probarConexionDestino: async (organizacionId, destinoId) => {
        const conexion = await gestorConexionesDestino.obtenerConSecreto(
          organizacionId,
          destinoId,
        );
        const cliente = crearClienteDestino({
          tipo: conexion.tipo,
          config: conexion.secreto
            ? { ...conexion.config, password: conexion.secreto.valor }
            : conexion.config,
        });
        await cliente.probar();
        await gestorConexionesDestino.actualizar(organizacionId, destinoId, {
          estado: "activo",
          mensajeError: null,
          probadaEn: new Date(),
        });
      },
      consultarConexionDestino: async (destinoId, organizacionId) => {
        const conexion = await gestorConexionesDestino.buscar(
          organizacionId,
          destinoId,
        );
        return conexion
          ? { tipo: conexion.tipo, config: conexion.config }
          : null;
      },
      crearClienteDestino,
      bloqueos: new BloqueoEjecucionPostgres(db),
      idempotencia,
      outbox,
      auditoria,
      resolverPoliticaEspacios,
    }),
  );
  aplicacion.route(
    "/api/destinos",
    crearRutasDestinos(resolverCatalogoDestinos),
  );
  aplicacion.route(
    "/api/destinos/conexiones",
    crearRutasDestinosGenericas({
      resolverOrganizacion: async (c: Context) =>
        (await resolverSesion(c)).organizacionId,
      gestor: gestorConexionesDestino,
      crearCliente: crearClienteDestino,
    }),
  );
  aplicacion.route("/api/qlik", crearRutasProxyQlik(resolverQlik));
  aplicacion.route(
    "/api/admin",
    crearRutasAdmin({
      repositorio: repositorioAdministracion,
      resolverContexto: resolverContextoAdmin,
      guardarConexionDestino: async (entrada) => {
        if (
          !["impala", "postgres", "bigquery", "sftp"].includes(entrada.tipo)
        ) {
          throw new Error("Tipo de destino no soportado");
        }
        const conexion = await gestorConexionesDestino.guardarParaTenant({
          ...entrada,
          tipo: entrada.tipo as "impala" | "postgres" | "bigquery" | "sftp",
          secretoRefs: {},
        });
        return { id: conexion.id };
      },
      redirectUri: redirectUriOAuth,
      configuracionHeredada: {
        clienteId: configuracion?.QLIK_CLIENT_ID ?? process.env.QLIK_CLIENT_ID,
        tieneSecreto: Boolean(
          configuracion?.QLIK_CLIENT_SECRET ?? process.env.QLIK_CLIENT_SECRET,
        ),
        scopes: scopesOAuthHeredados,
      },
      auditoria,
      repositorioEspacios: repositorioEspaciosVisibles,
      resolverQlik,
      resolverSesion,
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

async function obtenerFrontendUrlGuardado(
  configuracionApp: Pick<ConfiguracionAppPostgres, "obtener">,
): Promise<string | null> {
  try {
    const valor = await configuracionApp.obtener("frontend_url");
    if (typeof valor !== "object" || valor === null) return null;
    const url = (valor as Record<string, unknown>).valor;
    if (typeof url !== "string") return null;
    return new URL(url).toString();
  } catch {
    return null;
  }
}

function crearServicioAutenticacionDiferido(
  repositorio: RepositorioAutenticacion,
  configuracion?: ConfiguracionAplicacion,
  redirectUriOAuth?: string,
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
          redirectUriOAuth ??
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
