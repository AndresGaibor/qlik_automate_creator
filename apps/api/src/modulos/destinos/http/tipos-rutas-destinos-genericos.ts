import type { Context } from "hono";
import type { GestionarConexionesDestino } from "../aplicacion/casos-de-uso/gestionar-conexiones-destino.js";
import type { FabricaDestino } from "../aplicacion/puertos/fabrica-destino.js";

export interface DependenciasRutasDestinosGenericas {
  resolverOrganizacion(c: Context): Promise<string>;
  gestor: GestionarConexionesDestino;
  crearCliente: FabricaDestino;
}
