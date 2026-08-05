import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import { crearRutasConfiguracionPlataforma } from "./rutas-configuracion-plataforma.js";

function crearApp(
  repositorio: Partial<RepositorioAdministracion>,
  contextoOverride?: ResolverContextoAdmin,
) {
  const app = new Hono();
  let contextoAdmin: ResolverContextoAdmin;
  if (contextoOverride) {
    contextoAdmin = contextoOverride;
  } else {
    contextoAdmin = async () => ({
      esSuperadmin: true,
      usuarioId: "usuario-1",
      membresias: [
        {
          organizacionId: "org-1",
          organizacionNombre: "Empresa",
          rol: "admin",
        },
      ],
    });
  }
  app.route(
    "/api/admin",
    crearRutasConfiguracionPlataforma({
      repositorio: repositorio as RepositorioAdministracion,
      resolverContexto: contextoAdmin,
    }),
  );
  return app;
}

const rutaModoAutomatizacion =
  "/api/admin/configuracion-plataforma/modo-automatizacion";

describe("rutas-configuracion-plataforma · modo-automatizacion", () => {
  it("GET devuelve modoAutomatizacionActivo: 1 por defecto", async () => {
    const app = crearApp({
      obtenerModoAutomatizacionGlobal: async () => ({
        modoAutomatizacionActivo: 1 as const,
      }),
    });

    const respuesta = await app.request(rutaModoAutomatizacion);
    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos.modoAutomatizacionActivo).toBe(1);
  });

  it("PUT actualiza modo de 1 a 2", async () => {
    const app = crearApp({
      obtenerModoAutomatizacionGlobal: async () => ({
        modoAutomatizacionActivo: 1 as const,
      }),
      actualizarModoAutomatizacionGlobal: async () => ({
        modoAutomatizacionActivo: 2 as const,
      }),
    });

    const respuesta = await app.request(rutaModoAutomatizacion, {
      method: "PUT",
      body: JSON.stringify({ modoAutomatizacionActivo: 2 }),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos.modoAutomatizacionActivo).toBe(2);
  });

  it("PUT con modo invalido devuelve 400", async () => {
    const app = crearApp({
      obtenerModoAutomatizacionGlobal: async () => ({
        modoAutomatizacionActivo: 1 as const,
      }),
      actualizarModoAutomatizacionGlobal: async () => ({
        modoAutomatizacionActivo: 2 as const,
      }),
    });

    const putInvalido = await app.request(rutaModoAutomatizacion, {
      method: "PUT",
      body: JSON.stringify({ modoAutomatizacionActivo: 3 }),
      headers: { "content-type": "application/json" },
    });

    expect(putInvalido.status).toBe(400);
    const cuerpo = await putInvalido.json();
    expect(cuerpo.error.codigo).toBe("DATOS_INVALIDOS");
  });

  it("usuario sin rol admin recibe 403", async () => {
    const contextoUsuario: ResolverContextoAdmin = async () => ({
      esSuperadmin: false,
      usuarioId: "usuario-2",
      membresias: [
        {
          organizacionId: "org-1",
          organizacionNombre: "Empresa",
          rol: "usuario",
        },
      ],
    });

    const app = crearApp(
      {
        obtenerModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 1 as const,
        }),
        actualizarModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 2 as const,
        }),
      },
      contextoUsuario,
    );

    const respuesta = await app.request(rutaModoAutomatizacion, {
      method: "PUT",
      body: JSON.stringify({ modoAutomatizacionActivo: 2 }),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(403);
  });

  it("superadmin sin membresias puede cambiar modo", async () => {
    const contextoSuperadmin: ResolverContextoAdmin = async () => ({
      esSuperadmin: true,
      usuarioId: "superadmin-1",
      membresias: [],
    });

    const app = crearApp(
      {
        obtenerModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 1 as const,
        }),
        actualizarModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 2 as const,
        }),
      },
      contextoSuperadmin,
    );

    const respuesta = await app.request(rutaModoAutomatizacion, {
      method: "PUT",
      body: JSON.stringify({ modoAutomatizacionActivo: 2 }),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(200);
  });

  it("admin con membresia puede cambiar modo", async () => {
    const contextoAdmin: ResolverContextoAdmin = async () => ({
      esSuperadmin: false,
      usuarioId: "admin-1",
      membresias: [
        {
          organizacionId: "org-1",
          organizacionNombre: "Empresa",
          rol: "admin",
        },
      ],
    });

    const app = crearApp(
      {
        obtenerModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 1 as const,
        }),
        actualizarModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 2 as const,
        }),
      },
      contextoAdmin,
    );

    const respuesta = await app.request(rutaModoAutomatizacion, {
      method: "PUT",
      body: JSON.stringify({ modoAutomatizacionActivo: 2 }),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos.modoAutomatizacionActivo).toBe(2);
  });
});
