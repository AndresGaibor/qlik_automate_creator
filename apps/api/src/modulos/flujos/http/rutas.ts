import { type Context, Hono } from "hono";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { ListarFlujos } from "../aplicacion/casos-de-uso/listar-flujos.js";
import type { PuertoConsultaFlujos } from "../aplicacion/puertos/puerto-consulta-flujos.js";

export function crearRutasFlujos(
  resolverConsulta: (c: Context) => Promise<PuertoConsultaFlujos>,
) {
  const rutas = new Hono();
  rutas.get("/", async (c) => {
    const consulta = await resolverConsulta(c);
    const espacioId = c.req.query("espacioId")?.trim() || undefined;
    const q =
      c.req.query("q")?.trim() ||
      c.req.query("busqueda")?.trim() ||
      undefined;

    let lista = await new ListarFlujos(consulta).ejecutar(espacioId);
    if (q) {
      const qLower = q.toLowerCase();
      lista = lista.filter((flujo) =>
        flujo.nombre.toLowerCase().includes(qLower),
      );
    }

    return responderExito(c, lista);
  });
  return rutas;
}
