import { type Context, Hono } from "hono";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { ListarFlujos } from "../aplicacion/casos-de-uso/listar-flujos.js";
import type { PuertoConsultaFlujos } from "../aplicacion/puertos/puerto-consulta-flujos.js";

export function crearRutasFlujos(
  resolverConsulta: (c: Context) => Promise<PuertoConsultaFlujos>,
  resolverQlik?: (
    c: Context,
  ) => Promise<import("../../qlik/publico.js").ServicioQlik>,
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

  return rutas;
}
