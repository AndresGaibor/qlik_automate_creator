import type { Context, Hono } from "hono";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type { ConexionDestino } from "../aplicacion/puertos/repositorio-conexiones-destino.js";
import {
  fabricarClienteDestino,
  obtenerConexionDestinoInterna,
} from "./acceso-destino-http.js";
import {
  esquemaActualizarDestino,
  esquemaCrearDestino,
} from "./esquemas-destinos-genericos.js";
import { ejecutarDestino } from "./respuestas-destinos-http.js";
import type { DependenciasRutasDestinosGenericas } from "./tipos-rutas-destinos-genericos.js";

export function registrarRutasComandoDestinos(
  rutas: Hono,
  dependencias: DependenciasRutasDestinosGenericas,
) {
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

  rutas.put("/:id", async (c) => {
    const organizacionId = await dependencias.resolverOrganizacion(c);
    const cambios = esquemaActualizarDestino.parse(await c.req.json());
    return ejecutarDestino(c, async () => {
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
    return ejecutarDestino(c, async () => {
      await dependencias.gestor.eliminar(organizacionId, c.req.param("id"));
      return { eliminado: true as const };
    });
  });

  rutas.post("/:id/probar", async (c) => {
    const conexion = await obtenerConexionDestinoInterna(c, dependencias);
    if (conexion instanceof Response) return conexion;
    const cliente = fabricarClienteDestino(c, dependencias, conexion);
    if (cliente instanceof Response) return cliente;
    return probarConexionDestino(c, dependencias, conexion, cliente);
  });
}

async function probarConexionDestino(
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
