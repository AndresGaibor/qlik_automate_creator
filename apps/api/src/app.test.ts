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
    const app = crearAplicacion({ registrador: crearRegistradorPrueba() });
    const respuesta = await app.request("/api/salud");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(200);
    expect(cuerpo.exito).toBe(true);
    expect(cuerpo.datos.estado).toBe("ok");
    expect(cuerpo.datos.arquitectura).toBe("monolito-modular");
    expect(cuerpo.datos.fecha).toBeDefined();
  });

  it("normaliza rutas inexistentes", async () => {
    const app = crearAplicacion({ registrador: crearRegistradorPrueba() });
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

  it("mapea errores no controlados sin exponer detalles", async () => {
    const app = crearAplicacion({ registrador: crearRegistradorPrueba() });
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
    const app = crearAplicacion({
      registrador: crearRegistradorPrueba(),
      resolverContextoAdmin: async () => ({
        esSuperadmin: true,
        membresias: [],
      }),
      repositorioAdministracion: {
        listarOrganizaciones: async () => [],
        obtenerOrganizacion: async () => null,
        crearOrganizacion: async () => ({ id: "1", nombre: "t", estado: "activa", creadoEn: new Date() }),
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
          creadoEn: new Date(),
        }),
        eliminarTenantQlik: async () => "ELIMINADO",
        configurarDestinoTenant: async () => null,
        configurarImpalaTenant: async () => null,
      },
    });

    const res1 = await app.request(
      "/api/admin/tenants/org1/qlik/t1/automatizacion-base",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automatizacionBaseIdQlik: "auto1", automatizacionBaseNombre: "Base Auto" }),
      },
    );
    expect(res1.status).toBe(200);

    const res2 = await app.request(
      "/api/admin/organizaciones/org1/tenants-qlik/t1/automatizacion-base",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ automatizacionBaseIdQlik: "auto1", automatizacionBaseNombre: "Base Auto" }),
      },
    );
    expect(res2.status).toBe(200);
  });
});
