import { type Context, Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { GestionarConexionesDestino } from "../aplicacion/casos-de-uso/gestionar-conexiones-destino.js";
import type { FabricaDestino } from "../aplicacion/puertos/fabrica-destino.js";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type {
  CambiosConexionDestino,
  ConexionDestino,
} from "../aplicacion/puertos/repositorio-conexiones-destino.js";

const esquemaCrearDestino = z.object({
  tipo: z.enum(["impala", "postgres", "bigquery", "sftp"]),
  nombre: z.string().min(1).max(255),
  config: z.record(z.unknown()),
});

const esquemaActualizarDestino = z.object({
  nombre: z.string().min(1).max(255).optional(),
  config: z.record(z.unknown()).optional(),
  estado: z.enum(["activo", "error", "desconectado"]).optional(),
});

export interface DependenciasRutasDestinosGenericas {
  resolverOrganizacion(c: Context): Promise<string>;
  gestor: GestionarConexionesDestino;
  crearCliente: FabricaDestino;
}

export function crearRutasDestinosGenericas(
  dependencias: DependenciasRutasDestinosGenericas,
) {
  const rutas = new Hono();

  rutas.get("/", async (c) => {
    const organizacionId = await dependencias.resolverOrganizacion(c);
    const conexiones = await dependencias.gestor.listar(organizacionId);
    return responderExito(
      c,
      conexiones.map(
        ({ id, tipo, nombre, estado, mensajeError, probadaEn }) => ({
          id,
          tipo,
          nombre,
          estado,
          mensajeError,
          probadaEn: probadaEn?.toISOString() ?? null,
        }),
      ),
    );
  });

  rutas.post("/", async (c) => {
    const organizacionId = await dependencias.resolverOrganizacion(c);
    const entrada = esquemaCrearDestino.parse(await c.req.json());
    const creada = await dependencias.gestor.crear({
      organizacionId,
      ...entrada,
      secretoRefs: {},
    });
    return responderExito(c, { id: creada.id }, 201);
  });

  rutas.get("/:id", async (c) => {
    const conexion = await obtenerConexion(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const { id, tipo, nombre, estado, mensajeError, probadaEn } = conexion;
    return responderExito(c, {
      id,
      tipo,
      nombre,
      estado,
      mensajeError,
      probadaEn: probadaEn?.toISOString() ?? null,
    });
  });

  rutas.put("/:id", async (c) => {
    const organizacionId = await dependencias.resolverOrganizacion(c);
    const cambios = esquemaActualizarDestino.parse(await c.req.json());
    return ejecutar(c, async () => {
      await dependencias.gestor.actualizar(
        organizacionId,
        c.req.param("id"),
        cambios,
      );
      return { actualizado: true as const };
    });
  });

  rutas.delete("/:id", async (c) => {
    const organizacionId = await dependencias.resolverOrganizacion(c);
    return ejecutar(c, async () => {
      await dependencias.gestor.eliminar(organizacionId, c.req.param("id"));
      return { eliminado: true as const };
    });
  });

  rutas.post("/:id/probar", async (c) => {
    const conexion = await obtenerConexionInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarCliente(c, dependencias.crearCliente, conexion);
    if (cliente instanceof Response) return cliente;
    return probarConexion(c, dependencias, conexion, cliente);
  });

  rutas.get("/:id/capacidades", async (c) => {
    const conexion = await obtenerConexionInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarCliente(c, dependencias.crearCliente, conexion);
    if (cliente instanceof Response) return cliente;
    return responderExito(c, cliente.obtenerCapacidades());
  });

  rutas.get("/:id/recursos", async (c) => {
    const conexion = await obtenerConexionInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarCliente(c, dependencias.crearCliente, conexion);
    if (cliente instanceof Response) return cliente;
    try {
      return responderExito(c, await cliente.listarRecursos());
    } catch (error) {
      return responderDestinoNoDisponible(c, error);
    }
  });

  rutas.get("/:id/recursos/:recursoId", async (c) => {
    const conexion = await obtenerConexionInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarCliente(c, dependencias.crearCliente, conexion);
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

  return rutas;
}

async function obtenerConexion(
  c: Context,
  dependencias: DependenciasRutasDestinosGenericas,
): Promise<ConexionDestino | Response> {
  const organizacionId = await dependencias.resolverOrganizacion(c);
  const id = c.req.param("id");
  if (!id) {
    return responderError(c, "Falta el identificador del destino", 400, {
      codigo: "DESTINO_ID_REQUERIDO",
    });
  }
  try {
    return await dependencias.gestor.obtener(organizacionId, id);
  } catch (error) {
    return responderErrorAplicacion(c, error);
  }
}

async function obtenerConexionInterna(
  c: Context,
  dependencias: DependenciasRutasDestinosGenericas,
): Promise<ConexionDestino | Response> {
  const organizacionId = await dependencias.resolverOrganizacion(c);
  const id = c.req.param("id");
  if (!id) {
    return responderError(c, "Falta el identificador del destino", 400, {
      codigo: "DESTINO_ID_REQUERIDO",
    });
  }
  try {
    const conexion = await dependencias.gestor.obtenerConSecreto(
      organizacionId,
      id,
    );
    return {
      ...conexion,
      config: conexion.secreto
        ? { ...conexion.config, password: conexion.secreto.valor }
        : conexion.config,
    };
  } catch (error) {
    return responderErrorAplicacion(c, error);
  }
}

function fabricarCliente(
  c: Context,
  crearCliente: FabricaDestino,
  conexion: ConexionDestino,
): PuertoDestino | Response {
  try {
    return crearCliente({ tipo: conexion.tipo, config: conexion.config });
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

async function probarConexion(
  c: Context,
  dependencias: DependenciasRutasDestinosGenericas,
  conexion: ConexionDestino,
  cliente: PuertoDestino,
) {
  const organizacionId = await dependencias.resolverOrganizacion(c);
  try {
    await cliente.probar();
    const probadaEn = new Date();
    const capacidades = cliente.obtenerCapacidades();
    await dependencias.gestor.actualizar(organizacionId, conexion.id, {
      estado: "activo",
      mensajeError: null,
      probadaEn,
    });
    return responderExito(c, {
      exitoso: true,
      mensaje: "Conexión exitosa",
      probadaEn: probadaEn.toISOString(),
      capacidades,
    });
  } catch {
    const mensaje =
      conexion.tipo === "postgres"
        ? "No se pudo conectar con el destino PostgreSQL"
        : "No se pudo conectar con el destino";
    await dependencias.gestor.actualizar(organizacionId, conexion.id, {
      estado: "error",
      mensajeError: mensaje,
      probadaEn: new Date(),
    });
    return responderExito(c, { exitoso: false, mensaje });
  }
}

function responderDestinoNoDisponible(c: Context, error: unknown) {
  return responderError(
    c,
    error instanceof Error ? error.message : "El destino no está disponible",
    502,
    { codigo: "DESTINO_NO_DISPONIBLE" },
  );
}

async function ejecutar<T>(c: Context, operacion: () => Promise<T>) {
  try {
    return responderExito(c, await operacion());
  } catch (error) {
    return responderErrorAplicacion(c, error);
  }
}

function responderErrorAplicacion(c: Context, error: unknown): Response {
  if (!(error instanceof ErrorAplicacion)) throw error;
  return responderError(
    c,
    error.message,
    error.estadoHttp as ContentfulStatusCode,
    { codigo: error.codigo, detalles: error.detalles },
  );
}
