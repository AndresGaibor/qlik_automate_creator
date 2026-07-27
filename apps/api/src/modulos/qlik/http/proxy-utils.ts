import { esquemaIdQlik } from "@qlik/contratos/qlik";
import type { Context } from "hono";
import { type ZodType, z } from "zod";
import { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import { ReenviarSolicitudQlik } from "../aplicacion/casos-de-uso/reenviar-solicitud-qlik.js";
import type {
  MetodoHttpQlik,
  PuertoQlik,
  SolicitudQlik,
} from "../aplicacion/puertos/puerto-qlik.js";

export type ResolverClienteQlik = (c: Context) => Promise<PuertoQlik>;

export interface OpcionesReenvio {
  metodo: MetodoHttpQlik;
  rutaQlik: string | ((c: Context) => string);
  esquemaConsulta?: ZodType;
  esquemaCuerpo?: ZodType;
  cuerpoOpcional?: boolean;
}

export const esquemaConsultaLibreQlik = z.record(
  z.string().trim().min(1).max(128),
  z.string().max(8000),
);

export async function reenviar(
  c: Context,
  resolverCliente: ResolverClienteQlik,
  opciones: OpcionesReenvio,
) {
  const consultaValidada = (
    opciones.esquemaConsulta ?? esquemaConsultaLibreQlik
  ).parse(c.req.query()) as Record<string, unknown>;
  const consulta =
    Object.keys(consultaValidada).length > 0
      ? aParametrosConsulta(consultaValidada)
      : undefined;

  let cuerpo: unknown;
  if (opciones.esquemaCuerpo) {
    const recibido = await leerJson(c, opciones.cuerpoOpcional ?? false);
    cuerpo = opciones.esquemaCuerpo.parse(recibido);
  }

  const rutaQlik =
    typeof opciones.rutaQlik === "function"
      ? opciones.rutaQlik(c)
      : opciones.rutaQlik;
  const solicitud: SolicitudQlik = {
    metodo: opciones.metodo,
    ruta: rutaQlik,
    consulta,
    ...(cuerpo !== undefined ? { cuerpo } : {}),
  };

  const cliente = await resolverCliente(c);
  const respuesta = await new ReenviarSolicitudQlik(cliente).ejecutar(
    solicitud,
  );
  return crearRespuestaProxy(respuesta);
}

export function id(c: Context, nombre: string): string {
  return encodeURIComponent(esquemaIdQlik.parse(c.req.param(nombre)));
}

export function rutaAutomatizacion(c: Context): string {
  return `/api/workflows/automations/${id(c, "id")}`;
}

export function rutaEjecucion(c: Context): string {
  return `${rutaAutomatizacion(c)}/runs/${id(c, "runId")}`;
}

export function rutaConexion(c: Context): string {
  return `/api/workflows/automation-connections/${id(c, "id")}`;
}

export function rutaEspacio(c: Context): string {
  return `/api/v1/spaces/${id(c, "spaceId")}`;
}

export async function leerJson(
  c: Context,
  opcional: boolean,
): Promise<unknown> {
  const texto = await c.req.text();
  if (!texto.trim()) {
    if (opcional) return undefined;
    throw new ErrorAplicacion(
      "JSON_REQUERIDO",
      "Se requiere un cuerpo JSON",
      400,
    );
  }
  try {
    return JSON.parse(texto);
  } catch {
    throw new ErrorAplicacion(
      "JSON_INVALIDO",
      "El cuerpo no contiene JSON válido",
      400,
    );
  }
}

export function aParametrosConsulta(
  valores: Record<string, unknown>,
): URLSearchParams {
  const parametros = new URLSearchParams();
  for (const [clave, valor] of Object.entries(valores)) {
    if (valor === undefined || valor === null || valor === "") continue;
    if (Array.isArray(valor)) {
      for (const item of valor) parametros.append(clave, String(item));
    } else {
      parametros.set(clave, String(valor));
    }
  }
  return parametros;
}

export function crearRespuestaProxy(respuesta: {
  estado: number;
  encabezados: Headers;
  cuerpo: ReadableStream<Uint8Array> | null;
}): Response {
  const encabezados = new Headers();
  for (const nombre of [
    "content-type",
    "content-disposition",
    "location",
    "etag",
    "last-modified",
    "retry-after",
    "x-qlik-trace-id",
  ]) {
    const valor = respuesta.encabezados.get(nombre);
    if (valor) encabezados.set(nombre, valor);
  }

  return new Response(respuesta.cuerpo, {
    status: respuesta.estado,
    headers: encabezados,
  });
}
