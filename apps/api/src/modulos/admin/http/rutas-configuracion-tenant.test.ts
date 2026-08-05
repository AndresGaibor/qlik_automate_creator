import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { ErrorNoAutorizado } from "../../../nucleo/errores/error-aplicacion.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import { crearRutasConfiguracionTenant } from "./rutas-configuracion-tenant.js";

function crearApp(repositorio: Partial<RepositorioAdministracion>) {
  const app = new Hono();
  app.route(
    "/api/admin",
    crearRutasConfiguracionTenant({
      repositorio: repositorio as RepositorioAdministracion,
      resolverContexto: async () => ({
        esSuperadmin: true,
        usuarioId: "usuario-1",
        membresias: [
          {
            organizacionId: "org-1",
            organizacionNombre: "Empresa",
            rol: "admin",
          },
        ],
      }),
    }),
  );
  return app;
}

const rutaImpala = "/api/admin/organizaciones/org-1/tenants-qlik/tq-1/impala";

const cuerpoValido = {
  impalaHost: "impala.ejemplo.test",
  impalaPort: 21050,
  impalaAuthMechanism: "NOSASL",
  impalaDatabase: "default",
};

describe("rutas-configuracion-tenant · impala", () => {
  it("expone el mensaje real de un ErrorNoAutorizado del repositorio como 401", async () => {
    const app = crearApp({
      configurarImpalaTenant: async () => {
        throw new ErrorNoAutorizado("Sesión inválida o expirada");
      },
    });

    const respuesta = await app.request(rutaImpala, {
      method: "PUT",
      body: JSON.stringify(cuerpoValido),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(401);
    const cuerpo = await respuesta.json();
    expect(cuerpo.exito).toBe(false);
    expect(cuerpo.error.mensaje).toBe("Sesión inválida o expirada");
    expect(cuerpo.error.codigo).toBe("NO_AUTORIZADO");
  });

  it("expone el mensaje real de un error no mapeado como 500 (sin 'Error interno' genérico)", async () => {
    const app = crearApp({
      configurarImpalaTenant: async () => {
        throw new Error("Fallo de red hacia la base de datos");
      },
    });

    const respuesta = await app.request(rutaImpala, {
      method: "PUT",
      body: JSON.stringify(cuerpoValido),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(500);
    const cuerpo = await respuesta.json();
    expect(cuerpo.exito).toBe(false);
    expect(cuerpo.error.mensaje).toBe("Fallo de red hacia la base de datos");
    expect(cuerpo.error.codigo).toBe("ERROR_INTERNO");
  });

  it("sigue mapeando errores de permisos como 403", async () => {
    const app = crearApp({
      configurarImpalaTenant: async () => {
        throw new Error("No tienes permisos para acceder a este tenant");
      },
    });

    const respuesta = await app.request(rutaImpala, {
      method: "PUT",
      body: JSON.stringify(cuerpoValido),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(403);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.mensaje).toBe(
      "No tienes permisos para acceder a este tenant",
    );
  });

  it("mantiene el 400 DATOS_INVALIDOS ante un cuerpo inválido", async () => {
    const app = crearApp({
      configurarImpalaTenant: async () => null,
    });

    const respuesta = await app.request(rutaImpala, {
      method: "PUT",
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(400);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.codigo).toBe("DATOS_INVALIDOS");
  });
});
