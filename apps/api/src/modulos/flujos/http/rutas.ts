import { type Context, Hono } from "hono";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { db } from "../../../plataforma/persistencia/conexion.js";
import { conexionesOrigen } from "../../../plataforma/persistencia/esquema.js";
import { ListarFlujos } from "../aplicacion/casos-de-uso/listar-flujos.js";
import {
  construirCatalogoConexionesSpark,
  parsearScriptQlik,
} from "../aplicacion/generador-catalogo-spark.js";
import type { PuertoConsultaFlujos } from "../aplicacion/puertos/puerto-consulta-flujos.js";

export function crearRutasFlujos(
  resolverConsulta: (c: Context) => Promise<PuertoConsultaFlujos>,
  resolverQlik?: (
    c: Context,
  ) => Promise<import("../../qlik/publico.js").ServicioQlik>,
  resolverSesion?: (c: Context) => Promise<{ organizacionId: string }>,
) {
  const rutas = new Hono();
  rutas.get("/", async (c) => {
    const consulta = await resolverConsulta(c);
    const espacioId = c.req.query("espacioId")?.trim() || undefined;
    const q =
      c.req.query("q")?.trim() || c.req.query("busqueda")?.trim() || undefined;

    let lista = await new ListarFlujos(consulta).ejecutar(espacioId);
    if (q) {
      const qLower = q.toLowerCase();
      lista = lista.filter((flujo) =>
        flujo.nombre.toLowerCase().includes(qLower),
      );
    }

    return responderExito(c, lista);
  });

  rutas.get("/:id/script", async (c) => {
    if (!resolverQlik) {
      return c.json(
        {
          exito: false,
          error: { mensaje: "Cliente Qlik no configurado para flujos" },
        },
        500,
      );
    }
    const id = c.req.param("id");
    const qlik = await resolverQlik(c);
    try {
      const resultadoScript = await qlik.obtenerScriptApp(id, "current");
      return responderExito(c, {
        id,
        script: resultadoScript.script,
        versionMessage: resultadoScript.versionMessage ?? null,
      });
    } catch (err: unknown) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje:
              err instanceof Error
                ? err.message
                : "No se pudo recuperar el script del Dataflow desde Qlik Cloud",
          },
        },
        404,
      );
    }
  });

  rutas.get("/:id/catalogo-spark", async (c) => {
    if (!resolverQlik) {
      return c.json(
        {
          exito: false,
          error: { mensaje: "Cliente Qlik no configurado para flujos" },
        },
        500,
      );
    }
    const id = c.req.param("id");
    const qlik = await resolverQlik(c);
    try {
      const resultadoScript = await qlik.obtenerScriptApp(id, "current");
      const descubierto = parsearScriptQlik(resultadoScript.script);

      const sesion = resolverSesion ? await resolverSesion(c) : null;
      const conexionesBD = sesion
        ? await db.query.conexionesOrigen.findMany({
            where: (tabla, { eq }) =>
              eq(tabla.organizacionId, sesion.organizacionId),
          })
        : [];
      const configuracionesCatalogos = conexionesBD.map((conn) => ({
        tipo: conn.tipo,
        nombre: conn.nombre,
        config: (conn.config as Record<string, unknown>) || {},
      }));

      const catalogoSpark = construirCatalogoConexionesSpark(
        descubierto,
        configuracionesCatalogos,
      );

      // Identificar conexiones que faltan por configurar datos técnicos (url, host, etc.)
      const conexionesFaltantes: string[] = [];
      for (const j of catalogoSpark.jdbc) {
        if (!j.url) {
          conexionesFaltantes.push(`Base de Datos / JDBC: "${j.nombre}"`);
        }
      }
      for (const s of catalogoSpark.sftp) {
        if (s.host === "__SFTP_HOST__") {
          conexionesFaltantes.push(`Servidor SFTP: "${s.nombre}"`);
        }
      }

      return responderExito(c, {
        id,
        catalogoJson: catalogoSpark,
        scriptOriginal: resultadoScript.script,
        conexionesFaltantes,
      });
    } catch (err: unknown) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje:
              err instanceof Error
                ? err.message
                : "Error al generar el catálogo Spark",
          },
        },
        500,
      );
    }
  });

  return rutas;
}
