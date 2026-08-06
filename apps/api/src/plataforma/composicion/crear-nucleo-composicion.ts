import type { Context } from "hono";
import { RepositorioAdministracionPostgres } from "../../modulos/admin/infraestructura/publico.js";
import { RepositorioAutenticacionPostgres } from "../../modulos/autenticacion-qlik/infraestructura/publico.js";
import { ConsultaConfiguracionImpalaPostgres } from "../../modulos/destinos/infraestructura/publico.js";
import { ClienteImpalaDirecto } from "../../modulos/destinos/infraestructura/publico.js";
import { RepositorioConexionesDestinoPostgres } from "../../modulos/destinos/infraestructura/publico.js";
import {
  GestionarConexionesDestino,
  type PuertoCatalogoDestinos,
} from "../../modulos/destinos/publico.js";
import { RepositorioEspaciosVisiblesPostgres } from "../../modulos/espacios-visibles/infraestructura/repositorio-espacios-visibles-postgres.js";
import { crearPoliticaEspacios } from "../../modulos/espacios-visibles/publico.js";
import {
  ProbadorConexionOrigenReal,
  RepositorioConexionesOrigenPostgres,
} from "../../modulos/origenes/infraestructura/publico.js";
import {
  GestionarConexionesOrigen,
  ProbarConexionOrigen,
} from "../../modulos/origenes/publico.js";
import { ConfiguracionAppPostgres } from "../../modulos/setup/infraestructura/configuracion-app-postgres.js";
import { registradorConsola } from "../observabilidad/registrador.js";
import { AuditoriaPostgres } from "../persistencia/auditoria-postgres.js";
import { db } from "../persistencia/conexion.js";
import { IdempotenciaPostgres } from "../persistencia/idempotencia-postgres.js";
import { OutboxPostgres } from "../persistencia/outbox-postgres.js";
import { servicioCifrado } from "../seguridad/servicio-cifrado.js";
import {
  crearResolverContextoAdmin,
  crearResolverContextoSolicitud,
  crearResolverQlik,
  crearResolverSesion,
  crearServicioAutenticacionDiferido,
} from "./autenticacion-composicion.js";
import { resolverConfiguracionRuntime } from "./configuracion-runtime.js";
import type { DependenciasAplicacion } from "./tipos.js";

export async function crearNucleoComposicion(
  dependencias: DependenciasAplicacion,
) {
  const configuracion = dependencias.configuracion;
  const registrador = dependencias.registrador ?? registradorConsola;
  const configuracionApp = new ConfiguracionAppPostgres(db);
  const runtime = await resolverConfiguracionRuntime(
    configuracionApp,
    configuracion,
  );

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
      runtime.redirectUriOAuth,
    );
  const resolverContextoSolicitud = crearResolverContextoSolicitud(
    repositorioAutenticacion,
  );
  const resolverSesion =
    dependencias.resolverSesion ??
    crearResolverSesion(resolverContextoSolicitud);
  const resolverQlik =
    dependencias.resolverQlik ??
    crearResolverQlik(resolverContextoSolicitud, repositorioAutenticacion);

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
    const configuracionEspacios = await repositorioEspaciosVisibles.obtener(
      contexto.tenantQlikId,
    );
    return crearPoliticaEspacios(configuracionEspacios, {
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
        ({ id, tipo, nombre, config, estado, probadaEn, mensajeError }) => ({
          id,
          tipo,
          nombre,
          config,
          estado,
          probadaEn,
          mensajeError,
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
    crearResolverContextoAdmin(
      resolverContextoSolicitud,
      repositorioAutenticacion,
    );

  return {
    auditoria,
    configuracion,
    configuracionApp,
    gestorConexionesDestino,
    gestorConexionesOrigen,
    idempotencia,
    outbox,
    probarConexionOrigen,
    registrador,
    repositorioAdministracion,
    repositorioConexionesOrigen,
    repositorioEspaciosVisibles,
    resolverCatalogoDestinos,
    resolverContextoAdmin,
    resolverPoliticaEspacios,
    resolverQlik,
    resolverSesion,
    runtime,
    servicioAutenticacion,
    consultaConexionesOrigen,
  };
}
