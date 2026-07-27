import { Hono } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import {
  type OpcionesConfiguracionOAuth,
  crearRutasConfiguracionOAuth,
} from "./rutas-configuracion-oauth.js";
import { crearRutasConfiguracionTenant } from "./rutas-configuracion-tenant.js";
import { crearRutasTenantsQlik } from "./rutas-tenants-qlik.js";
import { crearRutasTenants } from "./rutas-tenants.js";
import { crearRutasUsuarios } from "./rutas-usuarios.js";

export type { ResolverContextoAdmin };

export interface DependenciasRutasAdmin extends OpcionesConfiguracionOAuth {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
  auditoria: PuertoAuditoria;
}

export function crearRutasAdmin({
  repositorio,
  resolverContexto,
  redirectUri,
  configuracionHeredada,
  auditoria,
}: DependenciasRutasAdmin) {
  const rutas = new Hono();

  rutas.route("/", crearRutasTenants({ repositorio, resolverContexto }));
  rutas.route("/", crearRutasUsuarios({ repositorio, resolverContexto }));
  rutas.route("/", crearRutasTenantsQlik({ repositorio, resolverContexto }));
  rutas.route(
    "/",
    crearRutasConfiguracionTenant({ repositorio, resolverContexto }),
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

  return rutas;
}
