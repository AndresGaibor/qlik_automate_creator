import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { crearManejadorErrores } from "../../../plataforma/errores/manejador-http.js";
import type { Registrador } from "../../../plataforma/observabilidad/registrador.js";
import { crearRutasDestinos } from "./rutas.js";
import type { PuertoCatalogoDestinos } from "../aplicacion/puertos/puerto-catalogo-destinos.js";

const registrador: Registrador = {
  info: () => undefined,
  advertencia: () => undefined,
  error: () => undefined,
};

function crearAppConManejador(
  resolver: Parameters<typeof crearRutasDestinos>[0],
) {
  const app = new Hono();
  app.onError(crearManejadorErrores(registrador));
  app.route("/", crearRutasDestinos(resolver));
  return app;
}

function catalogoFake(
  opciones: {
    listarBasesDatos?: () => Promise<string[]>;
    listarTablas?: (baseDatos: string) => Promise<string[]>;
  } = {},
): PuertoCatalogoDestinos {
  return {
    listarBasesDatos: opciones.listarBasesDatos ?? (async () => ["default"]),
    listarTablas: opciones.listarTablas ?? (async () => ["ventas", "clientes"]),
    obtenerEsquemaTabla: async () => ({
      baseDatos: "default",
      tabla: "ventas",
      columnas: [{ nombre: "id", tipo: "INT" }],
      especificacionEsquema: "CREATE TABLE default.ventas (id INT)",
    }),
    listarFlujosDatos: async () => [],
    obtenerFlujoDatos: async () => ({
      id: "flujo-1",
      nombre: "Flujo",
    }),
  };
}

describe("rutas heredadas de destinos", () => {
  it("no expone el 500 interno: devuelve 502 con el mensaje real cuando el tenant no tiene Impala configurado", async () => {
    const app = crearAppConManejador(async () => {
      throw new Error(
        "El tenant no tiene configurado un servidor Impala. Configúralo en la sección de administración.",
      );
    });
    const respuesta = await app.request("/bases-datos/default/tablas");
    const cuerpo = await respuesta.json();
    expect(respuesta.status).toBe(502);
    expect(cuerpo.exito).toBe(false);
    expect(cuerpo.error.codigo).toBe("CATALOGO_DESTINOS");
    expect(cuerpo.error.mensaje).toContain(
      "no tiene configurado un servidor Impala",
    );
  });

  it("devuelve 502 con el mensaje real cuando la conexión a Impala falla", async () => {
    const app = crearAppConManejador(
      catalogoFake({
        listarTablas: async () => {
          throw new Error("Could not connect to 10.0.1.50:21050");
        },
      }),
    );
    const respuesta = await app.request("/bases-datos/default/tablas");
    const cuerpo = await respuesta.json();
    expect(respuesta.status).toBe(502);
    expect(cuerpo.error.codigo).toBe("CATALOGO_DESTINOS");
    expect(cuerpo.error.mensaje).toContain("10.0.1.50");
  });

  it("lista las tablas cuando el catálogo responde", async () => {
    const app = crearAppConManejador(catalogoFake());
    const respuesta = await app.request("/bases-datos/default/tablas");
    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.exito).toBe(true);
    expect(cuerpo.datos.map((t: { nombre: string }) => t.nombre)).toEqual([
      "ventas",
      "clientes",
    ]);
  });

  it("rechaza identificadores inválidos con 400 antes de tocar el catálogo", async () => {
    const app = crearAppConManejador(catalogoFake());
    const respuesta = await app.request("/bases-datos/default%3Bdrop/tablas");
    expect(respuesta.status).toBe(400);
    const cuerpo = await respuesta.json();
    expect(cuerpo.exito).toBe(false);
  });

  it("devuelve 502 con mensaje real en el detalle de tabla cuando el catálogo falla", async () => {
    const app = crearAppConManejador(async () => {
      throw new Error("Tenant no encontrado");
    });
    const respuesta = await app.request(
      "/bases-datos/default/tablas/ventas/detalle",
    );
    const cuerpo = await respuesta.json();
    expect(respuesta.status).toBe(502);
    expect(cuerpo.error.codigo).toBe("CATALOGO_DESTINOS");
    expect(cuerpo.error.mensaje).toBe("Tenant no encontrado");
  });
});
