import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import type { RepositorioAdministracion } from "../aplicacion/puertos/repositorio-administracion.js";
import { crearRutasConfiguracionOAuth } from "./rutas-configuracion-oauth.js";

const resumen = {
  tenantQlikId: "tenant-q1",
  clienteId: "cliente-1",
  secretoMascara: "••••abcd",
  scopes: ["user_default", "offline_access"],
  estado: "pendiente" as const,
  origen: "tenant" as const,
  verificadaEn: null,
  ultimoError: null,
  actualizadoEn: new Date("2026-07-27T10:00:00Z"),
};

function repositorioPrueba() {
  return {
    obtenerConfiguracionOAuth: async () => resumen,
    guardarConfiguracionOAuth: async () => resumen,
    eliminarConfiguracionOAuth: async () => true,
  } as unknown as RepositorioAdministracion;
}

function crearApp(esSuperadmin: boolean, eventos: unknown[] = []) {
  const app = new Hono();
  app.route(
    "/api/admin",
    crearRutasConfiguracionOAuth({
      repositorio: repositorioPrueba(),
      resolverContexto: async () => ({
        esSuperadmin,
        usuarioId: "usuario-1",
        membresias: [
          {
            organizacionId: "org-1",
            organizacionNombre: "Empresa",
            rol: "admin",
          },
        ],
      }),
      redirectUri: "http://localhost:3000/api/auth/qlik/callback",
      configuracionHeredada: {
        clienteId: "cliente-global",
        tieneSecreto: true,
        scopes: ["user_default"],
      },
      auditoria: {
        registrar: async (evento) => {
          eventos.push(evento);
        },
      },
    }),
  );
  return app;
}

describe("configuración OAuth administrativa", () => {
  it("permite al admin guardar sin devolver el secreto", async () => {
    const eventos: unknown[] = [];
    const respuesta = await crearApp(false, eventos).request(
      "/api/admin/organizaciones/org-1/tenants-qlik/tenant-q1/oauth",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteId: "cliente-1",
          clienteSecreto: "secreto-super-privado-abcd",
          scopes: ["user_default", "offline_access"],
        }),
      },
    );
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(200);
    expect(cuerpo.datos.secretoMascara).toBe("••••abcd");
    expect(JSON.stringify(cuerpo)).not.toContain("secreto-super-privado");
    expect(cuerpo.datos.redirectUri).toBe(
      "http://localhost:3000/api/auth/qlik/callback",
    );
    expect(eventos).toHaveLength(1);
    expect(JSON.stringify(eventos[0])).toContain("oauth.configurar");
    expect(JSON.stringify(eventos[0])).not.toContain("secreto-super-privado");
  });

  it("impide que un admin elimine la configuración", async () => {
    const respuesta = await crearApp(false).request(
      "/api/admin/organizaciones/org-1/tenants-qlik/tenant-q1/oauth",
      { method: "DELETE" },
    );

    expect(respuesta.status).toBe(403);
  });

  it("permite al superadmin eliminar la configuración", async () => {
    const respuesta = await crearApp(true).request(
      "/api/admin/organizaciones/org-1/tenants-qlik/tenant-q1/oauth",
      { method: "DELETE" },
    );
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(200);
    expect(cuerpo.datos.eliminado).toBe(true);
  });
});
