import type { Context } from "hono";
import { responderError } from "../../../nucleo/http/respuestas.js";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type { ConexionDestino } from "../aplicacion/puertos/repositorio-conexiones-destino.js";
import { configurarConexionConSecreto } from "./modelo-destino-http.js";
import { responderErrorAplicacion } from "./respuestas-destinos-http.js";
import type { DependenciasRutasDestinosGenericas } from "./tipos-rutas-destinos-genericos.js";

export async function obtenerConexionDestino(
  c: Context,
  dependencias: DependenciasRutasDestinosGenericas,
): Promise<ConexionDestino | Response> {
  const organizacionId = await dependencias.resolverOrganizacion(c);
  const id = c.req.param("id");
  if (!id) return responderIdRequerido(c);
  try {
    return await dependencias.gestor.obtener(organizacionId, id);
  } catch (error) {
    return responderErrorAplicacion(c, error);
  }
}

export async function obtenerConexionDestinoInterna(
  c: Context,
  dependencias: DependenciasRutasDestinosGenericas,
): Promise<ConexionDestino | Response> {
  const organizacionId = await dependencias.resolverOrganizacion(c);
  const id = c.req.param("id");
  if (!id) return responderIdRequerido(c);
  try {
    const conexion = await dependencias.gestor.obtenerConSecreto(
      organizacionId,
      id,
    );
    return configurarConexionConSecreto(conexion);
  } catch (error) {
    return responderErrorAplicacion(c, error);
  }
}

export function fabricarClienteDestino(
  c: Context,
  dependencias: DependenciasRutasDestinosGenericas,
  conexion: ConexionDestino,
): PuertoDestino | Response {
  try {
    return dependencias.crearCliente({
      tipo: conexion.tipo,
      config: conexion.config,
    });
  } catch (error) {
    return responderError(
      c,
      error instanceof Error
        ? error.message
        : "Configuración de destino inválida",
      400,
      { codigo: "CONFIGURACION_INVALIDA" },
    );
  }
}

function responderIdRequerido(c: Context) {
  return responderError(c, "Falta el identificador del destino", 400, {
    codigo: "DESTINO_ID_REQUERIDO",
  });
}
