import { Hono } from "hono";
import type { ResolverClienteQlik } from "./proxy-utils.js";
import { crearRutasAutomationConnections } from "./rutas-automation-connections.js";
import { crearRutasAutomations } from "./rutas-automations.js";
import { crearRutasSpaces } from "./rutas-spaces.js";
import { crearRutasUsers } from "./rutas-users.js";

export function crearRutasProxyQlik(resolverCliente: ResolverClienteQlik) {
  const rutas = new Hono();

  rutas.route("/", crearRutasAutomations(resolverCliente));
  rutas.route("/", crearRutasAutomationConnections(resolverCliente));
  rutas.route("/", crearRutasSpaces(resolverCliente));
  rutas.route("/", crearRutasUsers(resolverCliente));

  return rutas;
}
