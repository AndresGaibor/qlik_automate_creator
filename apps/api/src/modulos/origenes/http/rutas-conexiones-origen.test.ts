import { describe, expect, it, vi } from "bun:test";
import { Hono } from "hono";
import { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import type { GestionarConexionesOrigen } from "../aplicacion/casos-de-uso/gestionar-conexiones-origen.js";
import type { ProbarConexionOrigen } from "../aplicacion/casos-de-uso/probar-conexion-origen.js";
import { crearRutasConexionesOrigen } from "./rutas-conexiones-origen.js";

function crearApp(organizacionId = "org-1") {
  const gestor = {
    listar: vi.fn(async () => [
      {
        id: "conexion-1",
        organizacionId: "org-1",
        tipo: "jdbc",
        nombre: "Ventas",
        config: { url: "jdbc:postgresql://db/demo" },
        estado: "sin_probar",
        probadaEn: null,
        mensajeError: null,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
      },
    ]),
    crear: vi.fn(async (_org: string, entrada: unknown) => entrada),
    actualizar: vi.fn(
      async (_org: string, _id: string, entrada: unknown) => entrada,
    ),
    eliminar: vi.fn(async () => true),
  } as unknown as GestionarConexionesOrigen;
  const probarConexion = {
    ejecutar: vi.fn(async (org: string) => {
      if (org !== "org-1") {
        throw new ErrorAplicacion(
          "NO_ENCONTRADA",
          "Conexión no encontrada",
          404,
        );
      }
      return {
        estado: "disponible" as const,
        probadaEn: "2026-08-06T12:00:00.000Z",
        mensaje: null,
      };
    }),
  } as unknown as ProbarConexionOrigen;
  const app = new Hono();
  app.route(
    "/api/conexiones-origen",
    crearRutasConexionesOrigen({
      resolverSesion: async () => ({ organizacionId }),
      gestor,
      probarConexion,
    }),
  );
  return { app, gestor, probarConexion };
}

describe("rutas-conexiones-origen", () => {
  it("lista conexiones sin secretos", async () => {
    const { app } = crearApp();
    const respuesta = await app.request("/api/conexiones-origen");
    expect(respuesta.status).toBe(200);
    expect(JSON.stringify(await respuesta.json())).not.toMatch(
      /secretoValor|privateKey|password/,
    );
  });

  it("acepta secretoValor JDBC con el nombre esperado por el backend", async () => {
    const { app, gestor } = crearApp();
    const respuesta = await app.request("/api/conexiones-origen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        tipo: "jdbc",
        nombre: "Ventas",
        config: {
          url: "jdbc:postgresql://db/demo",
          driver: "org.postgresql.Driver",
          secreto_nombre: "JDBC_VENTAS",
          secretoValor: "demo:clave",
        },
      }),
    });
    expect(respuesta.status).toBe(200);
    expect(gestor.crear).toHaveBeenCalledWith(
      "org-1",
      expect.objectContaining({
        secreto: { nombre: "JDBC_VENTAS", valor: "demo:clave" },
      }),
    );
  });

  it("prueba una conexion guardada sin aceptar ni devolver secretos", async () => {
    const { app, probarConexion } = crearApp();
    const respuesta = await app.request(
      "/api/conexiones-origen/conexion-1/probar",
      {
        method: "POST",
        headers: { Origin: "http://localhost:5173" },
      },
    );
    expect(respuesta.status).toBe(200);
    expect(probarConexion.ejecutar).toHaveBeenCalledWith("org-1", "conexion-1");
    expect(JSON.stringify(await respuesta.json())).not.toMatch(
      /password|PRIVATE KEY|usuario:clave|host interno/,
    );

    const { app: appOtraOrganizacion } = crearApp("org-2");
    const ajena = await appOtraOrganizacion.request(
      "/api/conexiones-origen/conexion-1/probar",
      {
        method: "POST",
        headers: { Origin: "http://localhost:5173" },
      },
    );
    expect(ajena.status).toBe(404);
  });

  it("ya no expone la revelacion masiva de secretos", async () => {
    const { app } = crearApp();
    const respuesta = await app.request(
      "/api/conexiones-origen/contexto-secretos",
      { method: "POST" },
    );
    expect(respuesta.status).toBe(404);
  });
});
