import { type Context, Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { GestionarConexionesOrigen } from "../aplicacion/casos-de-uso/gestionar-conexiones-origen.js";
import type { ProbarConexionOrigen } from "../aplicacion/casos-de-uso/probar-conexion-origen.js";
import type { EntradaConexionOrigen } from "../aplicacion/puertos/repositorio-conexiones-origen.js";

const esquemaConfigJdbc = z.object({
  url: z.string().trim().min(1),
  driver: z.string().trim().min(1),
  secreto_nombre: z.string().trim().min(1),
  propiedades: z.record(z.string()).default({}),
  secretoValor: z.string().max(2000).optional(),
});

const esquemaConfigSftp = z.object({
  host: z.string().trim().min(1),
  puerto: z.number().int().min(1).max(65535).default(22),
  usuario: z.string().trim().min(1),
  secreto_clave_privada_nombre: z.string().trim().min(1),
  ruta_base: z.string().trim().min(1).default("/upload"),
  secretoClavePrivadaValor: z.string().max(2000).optional(),
});

const esquemaConexionOrigenEntrada = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("jdbc"),
    nombre: z.string().trim().min(1).max(255),
    config: esquemaConfigJdbc,
  }),
  z.object({
    tipo: z.literal("sftp"),
    nombre: z.string().trim().min(1).max(255),
    config: esquemaConfigSftp,
  }),
]);

type ResolverSesion = (c: Context) => Promise<{
  organizacionId: string;
  usuarioId?: string;
}>;

export interface DepsRutasConexionesOrigen {
  resolverSesion: ResolverSesion;
  gestor: GestionarConexionesOrigen;
  probarConexion: ProbarConexionOrigen;
}

export function crearRutasConexionesOrigen(deps: DepsRutasConexionesOrigen) {
  const rutas = new Hono();

  rutas.get("/", async (c) => {
    const sesion = await deps.resolverSesion(c);
    return ejecutar(c, () => deps.gestor.listar(sesion.organizacionId));
  });

  rutas.post("/", async (c) => {
    const sesion = await deps.resolverSesion(c);
    const entrada = convertirEntrada(
      esquemaConexionOrigenEntrada.parse(await c.req.json()),
    );
    return ejecutar(c, () => deps.gestor.crear(sesion.organizacionId, entrada));
  });

  rutas.put("/:id", async (c) => {
    const sesion = await deps.resolverSesion(c);
    const entrada = convertirEntrada(
      esquemaConexionOrigenEntrada.parse(await c.req.json()),
    );
    return ejecutar(c, () =>
      deps.gestor.actualizar(sesion.organizacionId, c.req.param("id"), entrada),
    );
  });

  rutas.delete("/:id", async (c) => {
    const sesion = await deps.resolverSesion(c);
    return ejecutar(c, async () => ({
      eliminado: await deps.gestor.eliminar(
        sesion.organizacionId,
        c.req.param("id"),
      ),
    }));
  });

  rutas.post("/:id/probar", async (c) => {
    const sesion = await deps.resolverSesion(c);
    return ejecutar(c, () =>
      deps.probarConexion.ejecutar(sesion.organizacionId, c.req.param("id")),
    );
  });

  return rutas;
}

async function ejecutar<T>(c: Context, operacion: () => Promise<T>) {
  try {
    return responderExito(c, await operacion());
  } catch (error) {
    if (error instanceof ErrorAplicacion) {
      return responderError(
        c,
        error.message,
        error.estadoHttp as ContentfulStatusCode,
        { codigo: error.codigo, detalles: error.detalles },
      );
    }
    throw error;
  }
}

function convertirEntrada(
  entrada: z.infer<typeof esquemaConexionOrigenEntrada>,
): EntradaConexionOrigen {
  if (entrada.tipo === "jdbc") {
    const { secretoValor, ...config } = entrada.config;
    return {
      tipo: entrada.tipo,
      nombre: entrada.nombre,
      config,
      secreto: {
        nombre: config.secreto_nombre,
        ...(secretoValor ? { valor: secretoValor } : {}),
      },
    };
  }

  const { secretoClavePrivadaValor, ...config } = entrada.config;
  return {
    tipo: entrada.tipo,
    nombre: entrada.nombre,
    config,
    secreto: {
      nombre: config.secreto_clave_privada_nombre,
      ...(secretoClavePrivadaValor ? { valor: secretoClavePrivadaValor } : {}),
    },
  };
}
