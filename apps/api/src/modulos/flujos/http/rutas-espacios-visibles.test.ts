import { describe, expect, it, vi } from "bun:test";
import { Hono } from "hono";
import type { ServicioQlik } from "../../qlik/publico.js";
import { crearRutasFlujos } from "./rutas.js";

describe("rutas flujos · autorización por espacios", () => {
  it("bloquea script y catálogo de un Dataflow no autorizado", async () => {
    const obtenerScriptApp = vi.fn(async () => ({ script: "LOAD *;" }));
    const qlik = { obtenerScriptApp } as unknown as ServicioQlik;
    const app = new Hono();
    app.route(
      "/api/flujos",
      crearRutasFlujos(
        async () => ({
          listar: async () => [
            {
              id: "flow-denied",
              nombre: "Oculto",
              espacioId: "space-denied",
              espacioNombre: "Restringido",
            },
          ],
        }),
        async () => qlik,
        async () => ({ organizacionId: "org-1" }),
        async () => ({
          restringida: true,
          puedeVer: (espacioId?: string | null) =>
            espacioId === "space-allowed",
        }),
      ),
    );

    for (const ruta of [
      "/api/flujos/flow-denied/script",
      "/api/flujos/flow-denied/catalogo-spark",
    ]) {
      const respuesta = await app.request(ruta);
      expect(respuesta.status).toBe(403);
      const cuerpo = await respuesta.json();
      expect(cuerpo.error.codigo).toBe("ESPACIO_NO_AUTORIZADO");
      expect(JSON.stringify(cuerpo)).not.toContain("Oculto");
    }

    expect(obtenerScriptApp).not.toHaveBeenCalled();
  });

  it("usa la consulta inyectada para completar el catálogo Spark", async () => {
    const qlik = {
      obtenerScriptApp: vi.fn(async () => ({
        script: `LIB CONNECT TO [Ventas:Postgres];\nSELECT "id" FROM "public"."ventas";`,
      })),
    } as unknown as ServicioQlik;
    const listarPorOrganizacion = vi.fn(async () => [
      {
        tipo: "jdbc",
        nombre: "Ventas:Postgres",
        config: {
          url: "jdbc:postgresql://db/ventas",
          driver: "org.postgresql.Driver",
          secreto_nombre: "JDBC_VENTAS",
          propiedades: {},
        },
      },
    ]);
    const app = new Hono();
    app.route(
      "/api/flujos",
      crearRutasFlujos(
        async () => ({ listar: async () => [] }),
        async () => qlik,
        async () => ({ organizacionId: "org-1" }),
        undefined,
        { listarPorOrganizacion },
      ),
    );

    const respuesta = await app.request("/api/flujos/flow-1/catalogo-spark");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(200);
    expect(listarPorOrganizacion).toHaveBeenCalledWith("org-1");
    expect(cuerpo.datos.catalogoJson.jdbc[0].url).toBe(
      "jdbc:postgresql://db/ventas",
    );
  });
});
