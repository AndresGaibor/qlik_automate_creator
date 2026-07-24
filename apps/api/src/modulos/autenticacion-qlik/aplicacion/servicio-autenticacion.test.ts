import { describe, expect, it } from "bun:test";
import type { PuertoOAuthQlik } from "./puertos/puerto-oauth-qlik.js";
import type { RepositorioAutenticacion } from "./puertos/repositorio-autenticacion.js";
import { ServicioAutenticacionQlik } from "./servicio-autenticacion.js";

const tenant = {
  id: "tenant-interno",
  host: "empresa.eu.qlikcloud.com",
  estado: "activo" as const,
};

function oauthFalso(): PuertoOAuthQlik {
  return {
    generarEstado: () => "estado",
    generarVerificadorPkce: () => "verificador",
    generarDesafioPkce: async () => "desafio",
    obtenerUrlAutorizacion: () =>
      "https://empresa.eu.qlikcloud.com/oauth/authorize",
    intercambiarCodigo: async () => ({
      tokenAcceso: "token",
      expiraEnSegundos: 3600,
      scopes: ["user_default"],
    }),
    obtenerUsuario: async () => ({ id: "usuario-qlik" }),
  };
}

describe("ServicioAutenticacionQlik dinámico", () => {
  it("inicia OAuth usando únicamente un tenant registrado y activo", async () => {
    const repositorio = {
      obtenerTenantPorHost: async (host: string) =>
        host === tenant.host ? tenant : null,
    } as RepositorioAutenticacion;
    const hosts: string[] = [];
    const servicio = new ServicioAutenticacionQlik((host) => {
      hosts.push(host);
      return oauthFalso();
    }, repositorio);

    const resultado = await servicio.iniciar(tenant.host);

    expect(hosts).toEqual([tenant.host]);
    expect(resultado.tenantQlikId).toBe(tenant.id);
  });

  it("completa OAuth conservando el tenant interno seleccionado", async () => {
    let accesoGuardado: Record<string, unknown> | undefined;
    const repositorio = {
      obtenerTenantPorId: async () => tenant,
      guardarAcceso: async (datos: Record<string, unknown>) => {
        accesoGuardado = datos;
        return { tokenSesion: "sesion" };
      },
    } as unknown as RepositorioAutenticacion;
    const servicio = new ServicioAutenticacionQlik(
      () => oauthFalso(),
      repositorio,
    );

    await servicio.completar({
      tenantQlikId: tenant.id,
      codigo: "codigo",
      verificador: "verificador",
      ip: "127.0.0.1",
      agenteUsuario: "prueba",
    });

    expect(accesoGuardado?.tenantQlikId).toBe(tenant.id);
    expect(accesoGuardado?.hostTenant).toBe(tenant.host);
  });

  it("inicia OAuth resolviendo el tenant a partir del correo del usuario", async () => {
    const repositorio = {
      obtenerTenantPorCorreoUsuario: async (correo: string) =>
        correo === "usuario@empresa.com" ? tenant : null,
      obtenerTenantPorHost: async (host: string) =>
        host === tenant.host ? tenant : null,
    } as RepositorioAutenticacion;

    const servicio = new ServicioAutenticacionQlik(
      () => oauthFalso(),
      repositorio,
    );

    const resultado = await servicio.iniciarPorCorreo("usuario@empresa.com");

    expect(resultado.tenantQlikId).toBe(tenant.id);
    expect(resultado.url).toContain("https://empresa.eu.qlikcloud.com/oauth/authorize");
  });
});
