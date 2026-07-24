import { Hono } from "hono";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import { crearRutasTenants } from "./rutas-tenants.js";
import { crearRutasUsuarios } from "./rutas-usuarios.js";
import { crearRutasTenantsQlik } from "./rutas-tenants-qlik.js";
import { crearRutasConfiguracionTenant } from "./rutas-configuracion-tenant.js";

export type { ResolverContextoAdmin };

export interface DependenciasRutasAdmin {
  repositorio: RepositorioAdministracion;
  resolverContexto: ResolverContextoAdmin;
}

export function crearRutasAdmin({
  repositorio,
  resolverContexto,
}: DependenciasRutasAdmin) {
  const rutas = new Hono();

  rutas.route("/", crearRutasTenants({ repositorio, resolverContexto }));
  rutas.route("/", crearRutasUsuarios({ repositorio, resolverContexto }));
  rutas.route("/", crearRutasTenantsQlik({ repositorio, resolverContexto }));
  rutas.route("/", crearRutasConfiguracionTenant({ repositorio, resolverContexto }));

  return rutas;
}
