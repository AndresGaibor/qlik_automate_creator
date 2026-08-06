import type { Context } from "hono";
import { RepositorioConfiguracionOAuthPostgres } from "../../modulos/autenticacion-qlik/infraestructura/publico.js";
import { ConsultaTenantQlikPostgres } from "../../modulos/automatizaciones/infraestructura/consulta-tenant-qlik-postgres.js";
import { BloqueoEjecucionPostgres } from "../../modulos/automatizaciones/infraestructura/publico.js";
import { crearClienteDestino } from "../../modulos/destinos/infraestructura/publico.js";
import { ConsultaFlujosQlik } from "../../modulos/flujos/infraestructura/publico.js";
import { ejecutarBootstrap } from "../bootstrap/bootstrap.js";
import { RepositorioBootstrapPostgres } from "../bootstrap/repositorio-bootstrap-postgres.js";
import { crearMiddlewareCabecerasSeguridad } from "../http/middlewares/cabeceras-seguridad.js";
import { crearMiddlewareCors } from "../http/middlewares/cors.js";
import { crearMiddlewareLimiteSolicitudes } from "../http/middlewares/limite-solicitudes.js";
import { crearMiddlewareObservabilidad } from "../http/middlewares/observabilidad.js";
import { crearMiddlewareOrigenCsrf } from "../http/middlewares/origen-csrf.js";
import { db, dbHolder } from "../persistencia/conexion.js";
import { servicioCifrado } from "../seguridad/servicio-cifrado.js";
import type { crearNucleoComposicion } from "./crear-nucleo-composicion.js";

type NucleoComposicion = Awaited<ReturnType<typeof crearNucleoComposicion>>;

export async function crearDependenciasRutas(nucleo: NucleoComposicion) {
  const repoOAuthSetup = new RepositorioConfiguracionOAuthPostgres(
    db,
    servicioCifrado,
    {},
  );

  const middlewares = {
    cors: await crearMiddlewareCors(db, nucleo.runtime.frontendUrl),
    seguridad: crearMiddlewareCabecerasSeguridad(nucleo.runtime.produccion),
    observabilidad: crearMiddlewareObservabilidad(nucleo.registrador),
    csrf: crearMiddlewareOrigenCsrf(db),
    limiteSolicitudes: crearMiddlewareLimiteSolicitudes([
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
  };

  const setup = {
    configuracionApp: nucleo.configuracionApp,
    ejecutar: async (entrada: Parameters<typeof ejecutarBootstrap>[1]) => {
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
    guardarOAuthInicial:
      repoOAuthSetup.guardarOAuthInicial.bind(repoOAuthSetup),
  };

  const flujos = {
    resolverConsulta: async (c: Context) =>
      new ConsultaFlujosQlik(await nucleo.resolverQlik(c)),
    resolverQlik: nucleo.resolverQlik,
    resolverSesion: nucleo.resolverSesion,
    resolverPoliticaEspacios: nucleo.resolverPoliticaEspacios,
    consultaConexionesOrigen: nucleo.consultaConexionesOrigen,
  };

  const panel = {
    resolverQlik: nucleo.resolverQlik,
    resolverSesion: nucleo.resolverSesion,
    consultaTenant: new ConsultaTenantQlikPostgres(),
    obtenerModoGlobal:
      nucleo.repositorioAdministracion.obtenerModoAutomatizacionGlobal.bind(
        nucleo.repositorioAdministracion,
      ),
    consultarConexionesOrigen:
      nucleo.consultaConexionesOrigen.listarPorOrganizacion.bind(
        nucleo.consultaConexionesOrigen,
      ),
    consultarConexionesDestino: async (organizacionId: string) =>
      (await nucleo.gestorConexionesDestino.listar(organizacionId)).map(
        ({ id, tipo, nombre, estado, probadaEn, mensajeError }) => ({
          id,
          tipo,
          nombre,
          estado,
          probadaEn,
          mensajeError,
        }),
      ),
    probarConexionOrigen: (organizacionId: string, conexionId: string) =>
      nucleo.probarConexionOrigen.ejecutar(organizacionId, conexionId),
    leerSecretoOrigen: (
      organizacionId: string,
      conexionId: string,
      nombre: string,
    ) =>
      nucleo.repositorioConexionesOrigen.leerSecreto(
        organizacionId,
        conexionId,
        nombre,
      ),
    obtenerConexionDestinoConSecreto: async (
      destinoId: string,
      organizacionId: string,
    ) => {
      try {
        return await nucleo.gestorConexionesDestino.obtenerConSecreto(
          organizacionId,
          destinoId,
        );
      } catch {
        return null;
      }
    },
    probarConexionDestino: async (
      organizacionId: string,
      destinoId: string,
    ) => {
      const conexion = await nucleo.gestorConexionesDestino.obtenerConSecreto(
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
      await nucleo.gestorConexionesDestino.actualizar(
        organizacionId,
        destinoId,
        {
          estado: "activo",
          mensajeError: null,
          probadaEn: new Date(),
        },
      );
    },
    consultarConexionDestino: async (
      destinoId: string,
      organizacionId: string,
    ) => {
      const conexion = await nucleo.gestorConexionesDestino.buscar(
        organizacionId,
        destinoId,
      );
      return conexion ? { tipo: conexion.tipo, config: conexion.config } : null;
    },
    crearClienteDestino,
    bloqueos: new BloqueoEjecucionPostgres(db),
    idempotencia: nucleo.idempotencia,
    outbox: nucleo.outbox,
    auditoria: nucleo.auditoria,
    resolverPoliticaEspacios: nucleo.resolverPoliticaEspacios,
  };

  const destinosGenericos = {
    resolverOrganizacion: async (c: Context) =>
      (await nucleo.resolverSesion(c)).organizacionId,
    gestor: nucleo.gestorConexionesDestino,
    crearCliente: crearClienteDestino,
  };

  const admin = {
    repositorio: nucleo.repositorioAdministracion,
    resolverContexto: nucleo.resolverContextoAdmin,
    guardarConexionDestino: async (entrada: {
      organizacionId: string;
      tenantQlikId: string;
      tipo: string;
      nombre: string;
      config: Record<string, unknown>;
      secreto?: string;
    }) => {
      if (!["impala", "postgres", "bigquery", "sftp"].includes(entrada.tipo)) {
        throw new Error("Tipo de destino no soportado");
      }
      const conexion = await nucleo.gestorConexionesDestino.guardarParaTenant({
        ...entrada,
        tipo: entrada.tipo as "impala" | "postgres" | "bigquery" | "sftp",
        secretoRefs: {},
      });
      return { id: conexion.id };
    },
    redirectUri: nucleo.runtime.redirectUriOAuth,
    configuracionHeredada: nucleo.runtime.configuracionHeredada,
    auditoria: nucleo.auditoria,
    repositorioEspacios: nucleo.repositorioEspaciosVisibles,
    resolverQlik: nucleo.resolverQlik,
    resolverSesion: nucleo.resolverSesion,
  };

  return {
    admin,
    autenticacion: {
      servicio: nucleo.servicioAutenticacion,
      opciones: {
        frontendUrl: nucleo.runtime.frontendUrl,
        produccion: nucleo.runtime.produccion,
      },
    },
    destinosGenericos,
    flujos,
    middlewares,
    origenes: {
      resolverSesion: nucleo.resolverSesion,
      gestor: nucleo.gestorConexionesOrigen,
      probarConexion: nucleo.probarConexionOrigen,
    },
    panel,
    registrador: nucleo.registrador,
    resolverCatalogoDestinos: nucleo.resolverCatalogoDestinos,
    resolverQlik: nucleo.resolverQlik,
    setup,
  };
}
