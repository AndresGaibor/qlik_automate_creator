import { type Context, Hono } from "hono";
import { responderExito } from "../../../plataforma/http/respuestas.js";
import { ListarFlujos } from "../aplicacion/casos-de-uso/listar-flujos.js";
import type { PuertoConsultaFlujos } from "../aplicacion/puertos/puerto-consulta-flujos.js";

export function crearRutasFlujos(
  resolverConsulta: (c: Context) => Promise<PuertoConsultaFlujos>,
) {
  const rutas = new Hono();
  rutas.get("/", async (c) => {
    const consulta = await resolverConsulta(c);
    const espacioId = c.req.query("espacioId")?.trim() || undefined;
    return responderExito(
      c,
      await new ListarFlujos(consulta).ejecutar(espacioId),
    );
  });
  return rutas;
}
