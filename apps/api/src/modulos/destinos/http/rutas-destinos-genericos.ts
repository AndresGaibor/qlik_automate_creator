import { type Context, Hono } from "hono";
import { z } from "zod";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { crearClienteDestino } from "../aplicacion/fabrica-destinos.js";
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
) {
  const rutas = new Hono();

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
    try {
      const cliente = crearClienteDestino({
        tipo: conn.tipo as TipoDestino,
        config: conn.config,
      });
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
    const cliente = crearClienteDestino({
      tipo: conn.tipo as TipoDestino,
      config: conn.config,
    });
    return responderExito(c, cliente.obtenerCapacidades());
  });

  rutas.get("/:id/recursos", async (c) => {
    const id = c.req.param("id");
    const conn = await obtenerConexion(c, id);
    if (!conn) {
      return c.json({ success: false, error: "Conexión no encontrada" }, 404);
    }
    const cliente = crearClienteDestino({
      tipo: conn.tipo as TipoDestino,
      config: conn.config,
    });
    const recursos = await cliente.listarRecursos();
    return responderExito(c, recursos);
  });

  rutas.get("/:id/recursos/:recursoId", async (c) => {
    const id = c.req.param("id");
    const recursoId = c.req.param("recursoId");
    const conn = await obtenerConexion(c, id);
    if (!conn) {
      return c.json({ success: false, error: "Conexión no encontrada" }, 404);
    }
    const cliente = crearClienteDestino({
      tipo: conn.tipo as TipoDestino,
      config: conn.config,
    });
    const recurso = await cliente.obtenerRecurso(recursoId);
    return responderExito(c, recurso);
  });

  return rutas;
}
