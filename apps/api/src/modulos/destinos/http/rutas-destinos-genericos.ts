import { type Context, Hono } from "hono";
import { z } from "zod";
import { responderError, responderExito } from "../../../nucleo/http/respuestas.js";
import { crearClienteDestino } from "../aplicacion/fabrica-destinos.js";
import type { ConfigConexionDestino } from "../aplicacion/fabrica-destinos.js";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type { TipoDestino } from "../dominio/tipos-destino.js";

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

export function crearRutasDestinosGenericas(
  obtenerConexiones: (c: Context) => Promise<
    Array<{
      id: string;
      tipo: string;
      nombre: string;
      estado: string;
      mensajeError: string | null;
      config: Record<string, unknown>;
      secretoRefs: Record<string, unknown>;
    }>
  >,
  guardarConexion: (
    c: Context,
    conexion: {
      organizacionId: string;
      tipo: string;
      nombre: string;
      config: Record<string, unknown>;
      secretoRefs: Record<string, unknown>;
    },
  ) => Promise<{ id: string }>,
  actualizarConexion: (
    c: Context,
    id: string,
    cambios: {
      nombre?: string;
      config?: Record<string, unknown>;
      estado?: string;
      mensajeError?: string | null;
    },
  ) => Promise<void>,
  eliminarConexion: (c: Context, id: string) => Promise<void>,
  obtenerConexion: (
    c: Context,
    id: string,
  ) => Promise<{
    id: string;
    tipo: string;
    nombre: string;
    estado: string;
    mensajeError: string | null;
    config: Record<string, unknown>;
    secretoRefs: Record<string, unknown>;
  } | null>,
  resolverOrganizacion?: (c: Context) => Promise<string>,
  crearCliente?: (conexion: ConfigConexionDestino) => PuertoDestino,
) {
  const rutas = new Hono();

  const fabricarCliente = (
    c: Context,
    conn: { tipo: string; config: Record<string, unknown> },
  ): PuertoDestino | Response => {
    try {
      return (crearCliente ?? crearClienteDestino)({
        tipo: conn.tipo as TipoDestino,
        config: conn.config,
      });
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "Configuración de destino inválida";
      return responderError(c, mensaje, 400, {
        codigo: "CONFIGURACION_INVALIDA",
      });
    }
  };

  const listarRecursosDestino = async (
    c: Context,
    conn: { tipo: string; config: Record<string, unknown> },
  ) => {
    const cliente = fabricarCliente(c, conn);
    if (cliente instanceof Response) return cliente;
    try {
      const recursos = await cliente.listarRecursos();
      return responderExito(c, recursos);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "El destino no está disponible";
      return responderError(c, mensaje, 502, {
        codigo: "DESTINO_NO_DISPONIBLE",
      });
    }
  };

  const obtenerRecursoDestino = async (
    c: Context,
    conn: { tipo: string; config: Record<string, unknown> },
    recursoId: string,
  ) => {
    const cliente = fabricarCliente(c, conn);
    if (cliente instanceof Response) return cliente;
    try {
      const recurso = await cliente.obtenerRecurso(recursoId);
      return responderExito(c, recurso);
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : "El destino no está disponible";
      return responderError(c, mensaje, 502, {
        codigo: "DESTINO_NO_DISPONIBLE",
      });
    }
  };

  rutas.get("/", async (c) => {
    const conexiones = await obtenerConexiones(c);
    return responderExito(
      c,
      conexiones.map((conn) => ({
        id: conn.id,
        tipo: conn.tipo,
        nombre: conn.nombre,
        estado: conn.estado,
        mensajeError: conn.mensajeError,
      })),
    );
  });

  rutas.post("/", async (c) => {
    const body = await c.req.json();
    const entrada = esquemaCrearDestino.parse(body);
    const orgId = resolverOrganizacion
      ? await resolverOrganizacion(c)
      : c.req.header("x-organizacion-id");
    if (!orgId) {
      return c.json({ success: false, error: "No se encontró la organización" }, 401);
    }
    const result = await guardarConexion(c, {
      organizacionId: orgId,
      tipo: entrada.tipo,
      nombre: entrada.nombre,
      config: entrada.config,
      secretoRefs: {},
    });
    return responderExito(c, { id: result.id }, 201);
  });

  rutas.get("/:id", async (c) => {
    const id = c.req.param("id");
    const conn = await obtenerConexion(c, id);
    if (!conn) {
      return c.json({ success: false, error: "Conexión no encontrada" }, 404);
    }
    return responderExito(c, {
      id: conn.id,
      tipo: conn.tipo,
      nombre: conn.nombre,
      estado: conn.estado,
      mensajeError: conn.mensajeError,
    });
  });

  rutas.put("/:id", async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const entrada = esquemaActualizarDestino.parse(body);
    await actualizarConexion(c, id, {
      nombre: entrada.nombre,
      config: entrada.config,
      estado: entrada.estado,
    });
    return responderExito(c, { actualizado: true });
  });

  rutas.delete("/:id", async (c) => {
    const id = c.req.param("id");
    await eliminarConexion(c, id);
    return responderExito(c, { eliminado: true });
  });

  rutas.post("/:id/probar", async (c) => {
    const id = c.req.param("id");
    const conn = await obtenerConexion(c, id);
    if (!conn) {
      return c.json({ success: false, error: "Conexión no encontrada" }, 404);
    }
    const cliente = fabricarCliente(c, conn);
    if (cliente instanceof Response) return cliente;
    try {
      const capacidades = cliente.obtenerCapacidades();
      await actualizarConexion(c, id, {
        estado: "activo",
        mensajeError: null,
      });
      return responderExito(c, {
        exitoso: true,
        mensaje: "Conexión exitosa",
        capacidades,
      });
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "Error desconocido";
      await actualizarConexion(c, id, {
        estado: "error",
        mensajeError: mensaje,
      });
      return responderExito(c, { exitoso: false, mensaje });
    }
  });

  rutas.get("/:id/capacidades", async (c) => {
    const id = c.req.param("id");
    const conn = await obtenerConexion(c, id);
    if (!conn) {
      return c.json({ success: false, error: "Conexión no encontrada" }, 404);
    }
    const cliente = fabricarCliente(c, conn);
    if (cliente instanceof Response) return cliente;
    return responderExito(c, cliente.obtenerCapacidades());
  });

  rutas.get("/:id/recursos", async (c) => {
    const id = c.req.param("id");
    const conn = await obtenerConexion(c, id);
    if (!conn) {
      return c.json({ success: false, error: "Conexión no encontrada" }, 404);
    }
    return listarRecursosDestino(c, conn);
  });

  rutas.get("/:id/recursos/:recursoId", async (c) => {
    const id = c.req.param("id");
    const recursoId = c.req.param("recursoId");
    const conn = await obtenerConexion(c, id);
    if (!conn) {
      return c.json({ success: false, error: "Conexión no encontrada" }, 404);
    }
    return obtenerRecursoDestino(c, conn, recursoId);
  });

  return rutas;
}
