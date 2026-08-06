import { describe, expect, it } from "bun:test";
import { crearAplicacion } from "./app.js";
import type { Registrador } from "./plataforma/observabilidad/registrador.js";

function crearRegistradorPrueba(): Registrador {
  return {
    info: () => undefined,
    advertencia: () => undefined,
    error: () => undefined,
  };
}

describe("API", () => {
  it("expone el estado de salud con el contrato común", async () => {
    const app = await crearAplicacion({
      registrador: crearRegistradorPrueba(),
    });
    const respuesta = await app.request("/api/salud");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(200);
    expect(cuerpo.exito).toBe(true);
    expect(cuerpo.datos.estado).toBe("ok");
    expect(cuerpo.datos.arquitectura).toBe("monolito-modular");
    expect(cuerpo.datos.fecha).toBeDefined();
  });

  it("normaliza rutas inexistentes", async () => {
    const app = await crearAplicacion({
      registrador: crearRegistradorPrueba(),
    });
    const respuesta = await app.request("/api/inexistente");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(404);
    expect(cuerpo).toMatchObject({
      exito: false,
      error: {
        codigo: "RUTA_NO_ENCONTRADA",
        mensaje: "Ruta no encontrada",
      },
    });
  });

  it("aplica cabeceras defensivas a las respuestas", async () => {
    const app = await crearAplicacion({
      registrador: crearRegistradorPrueba(),
      configuracion: {
        NODE_ENV: "production",
        PORT: 3000,
        FRONTEND_URL: "https://app.example.com",
        DATABASE_URL: "postgres://usuario:clave@localhost:5432/app",
        QLIK_REDIRECT_URI: "https://api.example.com/api/auth/qlik/callback",
        QLIK_OAUTH_TIMEOUT_MS: 10_000,
      },
    });

    const respuesta = await app.request("/api/salud");

    expect(respuesta.headers.get("x-content-type-options")).toBe("nosniff");
    expect(respuesta.headers.get("x-frame-options")).toBe("DENY");
    expect(respuesta.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(respuesta.headers.get("strict-transport-security")).toContain(
      "max-age=",
    );
  });

  it("rechaza mutaciones sin Origin o con Origin ajeno al frontend", async () => {
    const app = await crearAplicacion({
      registrador: crearRegistradorPrueba(),
    });

    const sinOrigen = await app.request("/api/auth/qlik/cerrar-sesion", {
      method: "POST",
    });
    const origenAjeno = await app.request("/api/auth/qlik/cerrar-sesion", {
      method: "POST",
      headers: { Origin: "https://evil.example" },
    });

    expect(sinOrigen.status).toBe(403);
    expect(origenAjeno.status).toBe(403);
  });

  it("permite mutaciones del FRONTEND_URL", async () => {
    const app = await crearAplicacion({
      registrador: crearRegistradorPrueba(),
    });

    const respuesta = await app.request("/api/auth/qlik/cerrar-sesion", {
      method: "POST",
      headers: { Origin: "http://localhost:5173" },
    });

    expect(respuesta.status).toBe(200);
  });

  it("mapea errores no controlados sin exponer detalles", async () => {
    const app = await crearAplicacion({
      registrador: crearRegistradorPrueba(),
    });
    app.get("/api/__prueba-error", () => {
      throw new Error("secreto interno");
    });

    const respuesta = await app.request("/api/__prueba-error");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(500);
    expect(cuerpo.exito).toBe(false);
    expect(cuerpo.error.codigo).toBe("INTERNO");
    expect(cuerpo.error.mensaje).toBe("Error interno del servidor");
    expect(JSON.stringify(cuerpo)).not.toContain("secreto interno");
  });

  it("permite invocar las rutas PUT de automatización base en admin", async () => {
    const app = await crearAplicacion({
      registrador: crearRegistradorPrueba(),
      resolverContextoAdmin: async () => ({
        esSuperadmin: true,
        membresias: [],
      }),
      repositorioAdministracion: {
        listarOrganizaciones: async () => [],
        obtenerOrganizacion: async () => null,
        crearOrganizacion: async () => ({
          id: "1",
          nombre: "t",
          estado: "activa",
          creadoEn: new Date(),
        }),
        actualizarOrganizacion: async () => null,
        eliminarOrganizacion: async () => true,
        listarUsuarios: async () => [],
        agregarUsuario: async () => null,
        actualizarRolUsuario: async () => null,
        eliminarUsuario: async () => true,
        listarTenantsQlik: async () => [],
        crearTenantQlik: async () => null,
        marcarTenantQlikPrincipal: async () => null,
        configurarAutomatizacionBase: async () => ({
          id: "t1",
          organizacionId: "org1",
          tenantIdQlik: "q1",
          host: "test.qlikcloud.com",
          nombre: "test",
          estado: "activo",
          esPrincipal: true,
          automatizacionBaseIdQlik: "auto1",
          automatizacionBaseNombre: "Base Auto",
          automatizacionPlantillaModo1IdQlik: null,
          automatizacionPlantillaModo1Nombre: null,
          automatizacionPlantillaModo2IdQlik: null,
          automatizacionPlantillaModo2Nombre: null,
          tieneDestinoApiKey: false,
          destinoApiKeyMascara: null,
          tieneImpalaPassword: false,
          impalaPasswordMascara: null,
          creadoEn: new Date(),
        }),
        configurarPlantillaAutomatizacion: async () => ({
          id: "t1",
          organizacionId: "org1",
          tenantIdQlik: "q1",
          host: "test.qlikcloud.com",
          nombre: "test",
          estado: "activo",
          esPrincipal: true,
          automatizacionBaseIdQlik: null,
          automatizacionBaseNombre: null,
          automatizacionPlantillaModo1IdQlik: "auto1",
          automatizacionPlantillaModo1Nombre: "Base Auto",
          automatizacionPlantillaModo2IdQlik: null,
          automatizacionPlantillaModo2Nombre: null,
          tieneDestinoApiKey: false,
          destinoApiKeyMascara: null,
          tieneImpalaPassword: false,
          impalaPasswordMascara: null,
          creadoEn: new Date(),
        }),
        obtenerModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 1,
        }),
        actualizarModoAutomatizacionGlobal: async () => ({
          modoAutomatizacionActivo: 1,
        }),
        eliminarTenantQlik: async () => "ELIMINADO",
        configurarDestinoTenant: async () => null,
        configurarImpalaTenant: async () => null,
        obtenerConfiguracionOAuth: async () => null,
        guardarConfiguracionOAuth: async () => null,
        eliminarConfiguracionOAuth: async () => false,
        listarSuperadmins: async () => [],
        agregarSuperadmin: async () => ({
          id: "1",
          nombre: "Admin",
          correo: "a@b.com",
          esSuperadmin: true,
          estado: "activo",
          creadoEn: new Date(),
        }),
        eliminarSuperadmin: async () => ({ exito: true }),
      },
    });

    const res1 = await app.request(
      "/api/admin/tenants/org1/qlik/t1/automatizacion-base",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5173",
        },
        body: JSON.stringify({
          modo: 1,
          automatizacionBaseIdQlik: "auto1",
          automatizacionBaseNombre: "Base Auto",
        }),
      },
    );
    expect(res1.status).toBe(200);

    const res2 = await app.request(
      "/api/admin/organizaciones/org1/tenants-qlik/t1/automatizacion-base",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5173",
        },
        body: JSON.stringify({
          modo: 1,
          automatizacionBaseIdQlik: "auto1",
          automatizacionBaseNombre: "Base Auto",
        }),
      },
    );
    expect(res2.status).toBe(200);
  });
});
