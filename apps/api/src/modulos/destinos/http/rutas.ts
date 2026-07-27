import { type Context, Hono } from "hono";
import { z } from "zod";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import { ConsultarDestinos } from "../aplicacion/casos-de-uso/consultar-destinos.js";
import type { PuertoCatalogoDestinos } from "../aplicacion/puertos/puerto-catalogo-destinos.js";

const parametroNombre = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z_][A-Za-z0-9_]*$/, "Identificador de Impala inválido");

export type ResolverCatalogoDestinos =
  | PuertoCatalogoDestinos
  | ((c: Context) => Promise<PuertoCatalogoDestinos>);

interface CatalogoConConsulta extends PuertoCatalogoDestinos {
  ejecutarConsulta(consulta: string): Promise<unknown[]>;
}

function tieneConsulta(
  catalogo: PuertoCatalogoDestinos,
): catalogo is CatalogoConConsulta {
  return (
    "ejecutarConsulta" in catalogo &&
    typeof catalogo.ejecutarConsulta === "function"
  );
}

async function obtenerCatalogo(
  resolver: ResolverCatalogoDestinos,
  c: Context,
): Promise<PuertoCatalogoDestinos> {
  if (typeof resolver === "function") {
    return await resolver(c);
  }
  return resolver;
}

export function crearRutasDestinos(resolver: ResolverCatalogoDestinos) {
  const rutas = new Hono();

  rutas.get("/bases-datos", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    return responderExito(
      c,
      await new ConsultarDestinos(catalogo).listarBasesDatos(),
    );
  });

  rutas.get("/bases-datos/:baseDatos/tablas", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    const baseDatos = parametroNombre.parse(c.req.param("baseDatos"));
    const nombres = await new ConsultarDestinos(catalogo).listarTablas(
      baseDatos,
    );
    return responderExito(
      c,
      nombres.map((nombre) => ({ nombre })),
    );
  });

  rutas.get("/bases-datos/:baseDatos/tablas/:tabla/columnas", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    const baseDatos = parametroNombre.parse(c.req.param("baseDatos"));
    const tabla = parametroNombre.parse(c.req.param("tabla"));
    return responderExito(
      c,
      await new ConsultarDestinos(catalogo).obtenerEsquemaTabla(
        baseDatos,
        tabla,
      ),
    );
  });

  rutas.get("/bases-datos/:baseDatos/tablas/:tabla/detalle", async (c) => {
    const catalogo = await obtenerCatalogo(resolver, c);
    const baseDatos = parametroNombre.parse(c.req.param("baseDatos"));
    const tabla = parametroNombre.parse(c.req.param("tabla"));

    const esquema = await new ConsultarDestinos(catalogo).obtenerEsquemaTabla(
      baseDatos,
      tabla,
    );

    // Conteo estimado/real de filas
    let totalFilas = 0;
    try {
      if (tieneConsulta(catalogo)) {
        const res = await catalogo.ejecutarConsulta(
          `SELECT COUNT(*) FROM \`${baseDatos}\`.\`${tabla}\``,
        );
        totalFilas = res[0] ? Number(res[0]) : 0;
      }
    } catch {
      totalFilas = 0;
    }

    return responderExito(c, {
      ...esquema,
      totalFilas,
      actualizadoEn: new Date().toISOString(),
    });
  });

  return rutas;
}
