import type { Hono } from "hono";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import {
  fabricarClienteDestino,
  obtenerConexionDestino,
  obtenerConexionDestinoInterna,
} from "./acceso-destino-http.js";
import { presentarConexionDestino } from "./modelo-destino-http.js";
import { responderDestinoNoDisponible } from "./respuestas-destinos-http.js";
import type { DependenciasRutasDestinosGenericas } from "./tipos-rutas-destinos-genericos.js";

export function registrarRutasConsultaDestinos(
  rutas: Hono,
  dependencias: DependenciasRutasDestinosGenericas,
) {
  rutas.get("/", async (c) => {
    const organizacionId = await dependencias.resolverOrganizacion(c);
    const conexiones = await dependencias.gestor.listar(organizacionId);
    return responderExito(c, conexiones.map(presentarConexionDestino));
  });

  rutas.get("/:id", async (c) => {
    const conexion = await obtenerConexionDestino(c, dependencias);
    if (conexion instanceof Response) return conexion;
    return responderExito(c, presentarConexionDestino(conexion));
  });

  rutas.get("/:id/capacidades", async (c) => {
    const conexion = await obtenerConexionDestinoInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarClienteDestino(c, dependencias, conexion);
    if (cliente instanceof Response) return cliente;
    return responderExito(c, cliente.obtenerCapacidades());
  });

  rutas.get("/:id/recursos", async (c) => {
    const conexion = await obtenerConexionDestinoInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarClienteDestino(c, dependencias, conexion);
    if (cliente instanceof Response) return cliente;
    try {
      return responderExito(c, await cliente.listarRecursos());
    } catch (error) {
      return responderDestinoNoDisponible(c, error);
    }
  });

  rutas.get("/:id/recursos/:recursoId", async (c) => {
    const conexion = await obtenerConexionDestinoInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarClienteDestino(c, dependencias, conexion);
    if (cliente instanceof Response) return cliente;
    try {
      return responderExito(
        c,
        await cliente.obtenerRecurso(c.req.param("recursoId")),
      );
    } catch (error) {
      return responderDestinoNoDisponible(c, error);
    }
  });
}
