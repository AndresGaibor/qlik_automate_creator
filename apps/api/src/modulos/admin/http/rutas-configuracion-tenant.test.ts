import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { ErrorNoAutorizado } from "../../../nucleo/errores/error-aplicacion.js";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import type { ResolverContextoAdmin } from "./rutas-comunes.js";
import { crearRutasConfiguracionTenant } from "./rutas-configuracion-tenant.js";

function crearApp(repositorio: Partial<RepositorioAdministracion>) {
  const app = new Hono();
  const contextoAdmin: ResolverContextoAdmin = async () => ({
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
  app.route(
    "/api/admin",
    crearRutasConfiguracionTenant({
      repositorio: repositorio as RepositorioAdministracion,
      resolverContexto: contextoAdmin,
    }),
  );
  return app;
}

function crearAppConContexto(
  repositorio: Partial<RepositorioAdministracion>,
  contexto: ResolverContextoAdmin,
) {
  const app = new Hono();
  app.route(
    "/api/admin",
    crearRutasConfiguracionTenant({
      repositorio: repositorio as RepositorioAdministracion,
      resolverContexto: contexto,
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

  it("traduce violaciones de unicidad de la BD a un mensaje amigable", async () => {
    const errorBd = new Error(
      'Failed query: insert into "conexiones_destino" ... params: ...',
    );
    Object.assign(errorBd, { code: "23505" });

    const app = crearApp({
      configurarImpalaTenant: async () => {
        throw errorBd;
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
    expect(cuerpo.error.codigo).toBe("ERROR_BASE_DATOS");
    expect(cuerpo.error.mensaje).toBe(
      "Ya existe una conexión con ese nombre para este tipo y organización.",
    );
    expect(JSON.stringify(cuerpo)).not.toContain("Failed query");
  });

  it("traduce la falta de disponibilidad de la BD a un mensaje amigable", async () => {
    const errorBd = new Error("Failed query: connect ECONNREFUSED");
    Object.assign(errorBd, { code: "ECONNREFUSED" });

    const app = crearApp({
      configurarImpalaTenant: async () => {
        throw errorBd;
      },
    });

    const respuesta = await app.request(rutaImpala, {
      method: "PUT",
      body: JSON.stringify(cuerpoValido),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(500);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.codigo).toBe("ERROR_BASE_DATOS");
    expect(cuerpo.error.mensaje).toBe(
      "La base de datos no está disponible. Inténtalo de nuevo.",
    );
  });
});

const rutaAutomatizacionBase =
  "/api/admin/organizaciones/org-1/tenants-qlik/tq-1/automatizacion-base";

describe("rutas-configuracion-tenant · automatizacion-base por modo", () => {
  it("actualiza plantilla modo 2 y devuelve automatizacionPlantillaModo2IdQlik", async () => {
    const app = crearApp({
      configurarPlantillaAutomatizacion: async () => ({
        id: "tq-1",
        organizacionId: "org-1",
        tenantIdQlik: "tq-1",
        host: "qlik.example.com",
        nombre: null,
        estado: "activo",
        esPrincipal: true,
        automatizacionBaseIdQlik: null,
        automatizacionBaseNombre: null,
        automatizacionPlantillaModo1IdQlik: null,
        automatizacionPlantillaModo1Nombre: null,
        automatizacionPlantillaModo2IdQlik: "plantilla-2",
        automatizacionPlantillaModo2Nombre: null,
        destinoApiUrl: null,
        tieneDestinoApiKey: false,
        destinoApiKeyMascara: null,
        destinoBaseDatos: null,
        impalaHost: null,
        impalaPort: null,
        impalaAuthMechanism: null,
        impalaUser: null,
        tieneImpalaPassword: false,
        impalaPasswordMascara: null,
        impalaDatabase: null,
        creadoEn: new Date(),
      }),
    });

    const respuesta = await app.request(rutaAutomatizacionBase, {
      method: "PUT",
      body: JSON.stringify({
        modo: 2,
        automatizacionBaseIdQlik: "plantilla-2",
      }),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos.automatizacionPlantillaModo2IdQlik).toBe("plantilla-2");
  });

  it("actualiza plantilla modo 1 y devuelve automatizacionPlantillaModo1IdQlik", async () => {
    const app = crearApp({
      configurarPlantillaAutomatizacion: async () => ({
        id: "tq-1",
        organizacionId: "org-1",
        tenantIdQlik: "tq-1",
        host: "qlik.example.com",
        nombre: null,
        estado: "activo",
        esPrincipal: true,
        automatizacionBaseIdQlik: null,
        automatizacionBaseNombre: null,
        automatizacionPlantillaModo1IdQlik: "plantilla-1",
        automatizacionPlantillaModo1Nombre: "Mi Automatizacion Modo 1",
        automatizacionPlantillaModo2IdQlik: null,
        automatizacionPlantillaModo2Nombre: null,
        destinoApiUrl: null,
        tieneDestinoApiKey: false,
        destinoApiKeyMascara: null,
        destinoBaseDatos: null,
        impalaHost: null,
        impalaPort: null,
        impalaAuthMechanism: null,
        impalaUser: null,
        tieneImpalaPassword: false,
        impalaPasswordMascara: null,
        impalaDatabase: null,
        creadoEn: new Date(),
      }),
    });

    const respuesta = await app.request(rutaAutomatizacionBase, {
      method: "PUT",
      body: JSON.stringify({
        modo: 1,
        automatizacionBaseIdQlik: "plantilla-1",
        automatizacionBaseNombre: "Mi Automatizacion Modo 1",
      }),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos.automatizacionPlantillaModo1IdQlik).toBe("plantilla-1");
    expect(cuerpo.datos.automatizacionPlantillaModo1Nombre).toBe(
      "Mi Automatizacion Modo 1",
    );
  });

  it("devuelve 400 cuando modo no es 1 ni 2", async () => {
    const app = crearApp({
      configurarAutomatizacionBase: async () => null,
    });

    const respuesta = await app.request(rutaAutomatizacionBase, {
      method: "PUT",
      body: JSON.stringify({
        modo: 3,
        automatizacionBaseIdQlik: "plantilla-3",
      }),
      headers: { "content-type": "application/json" },
    });

    expect(respuesta.status).toBe(400);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.codigo).toBe("DATOS_INVALIDOS");
  });
});
