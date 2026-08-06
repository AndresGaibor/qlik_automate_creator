import { Hono } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  type OpcionesConfiguracionOAuth,
  crearRutasConfiguracionOAuth,
} from "./rutas-configuracion-oauth.js";
import { crearRutasConfiguracionPlataforma } from "./rutas-configuracion-plataforma.js";
import { crearRutasConfiguracionTenant } from "./rutas-configuracion-tenant.js";
import { crearRutasEspaciosVisibles } from "./rutas-espacios-visibles.js";
import { crearRutasSuperadmins } from "./rutas-superadmins.js";
import { crearRutasTenantsQlik } from "./rutas-tenants-qlik.js";
import { crearRutasTenants } from "./rutas-tenants.js";
import { crearRutasUsuarios } from "./rutas-usuarios.js";

export type { ResolverContextoAdmin };

export interface DependenciasRutasAdmin extends OpcionesConfiguracionOAuth {
  resolverQlik: Parameters<
    typeof crearRutasEspaciosVisibles
  >[0]["resolverQlik"];
  resolverSesion: Parameters<
    typeof crearRutasEspaciosVisibles
  >[0]["resolverSesion"];
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
  auditoria: PuertoAuditoria;
  repositorioEspacios: Parameters<
    typeof crearRutasEspaciosVisibles
  >[0]["repositorio"];
  guardarConexionDestino?: Parameters<
    typeof crearRutasConfiguracionTenant
  >[0]["guardarConexionDestino"];
}

export function crearRutasAdmin({
  repositorio,
  resolverContexto,
  redirectUri,
  configuracionHeredada,
  auditoria,
  guardarConexionDestino,
  resolverQlik,
  resolverSesion,
  repositorioEspacios,
}: DependenciasRutasAdmin) {
  const rutas = new Hono();

  rutas.route("/", crearRutasTenants({ repositorio, resolverContexto }));
  rutas.route("/", crearRutasUsuarios({ repositorio, resolverContexto }));
  rutas.route("/", crearRutasTenantsQlik({ repositorio, resolverContexto }));
  rutas.route(
    "/",
    crearRutasConfiguracionTenant({
      repositorio,
      resolverContexto,
      guardarConexionDestino,
    }),
  );
  rutas.route(
    "/",
    crearRutasEspaciosVisibles({
      resolverContexto,
      resolverQlik,
      resolverSesion,
      auditoria,
      repositorio: repositorioEspacios,
      existeTenantQlik: async (organizacionId, tenantQlikId) =>
        (await repositorio.listarTenantsQlik(organizacionId)).some(
          (tenant) => tenant.id === tenantQlikId,
        ),
    }),
  );
  rutas.route(
    "/",
    crearRutasConfiguracionOAuth({
      repositorio,
      resolverContexto,
      redirectUri,
      configuracionHeredada,
      auditoria,
    }),
  );
  rutas.route("/", crearRutasSuperadmins({ repositorio, resolverContexto }));
  rutas.route(
    "/",
    crearRutasConfiguracionPlataforma({ repositorio, resolverContexto }),
  );

  return rutas;
}
