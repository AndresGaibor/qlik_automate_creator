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
    const servicio = new ServicioAutenticacionQlik((tenantResuelto) => {
      hosts.push(tenantResuelto.host);
      return { cliente: oauthFalso(), origen: "entorno_global" as const };
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
      () => ({ cliente: oauthFalso(), origen: "entorno_global" as const }),
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

  it("conserva la configuración OAuth del tenant y la marca verificada", async () => {
    const configuracionesUsadas: Array<string | undefined> = [];
    const verificadas: string[] = [];
    const repositorio = {
      obtenerTenantPorHost: async () => tenant,
      obtenerTenantPorId: async () => tenant,
      guardarAcceso: async () => ({ tokenSesion: "sesion" }),
    } as unknown as RepositorioAutenticacion;
    const servicio = new ServicioAutenticacionQlik(
      (_tenant, configuracionId) => {
        configuracionesUsadas.push(configuracionId);
        return {
          cliente: oauthFalso(),
          configuracionId: "oauth-tenant-1",
          origen: "tenant" as const,
        };
      },
      repositorio,
      {
        marcarVerificada: async (id) => {
          verificadas.push(id);
        },
        marcarError: async () => undefined,
      },
    );

    const inicio = await servicio.iniciar(tenant.host);
    await servicio.completar({
      tenantQlikId: tenant.id,
      configuracionOauthId: inicio.configuracionOauthId,
      codigo: "codigo",
      verificador: "verificador",
      ip: "127.0.0.1",
      agenteUsuario: "prueba",
    });

    expect(inicio.configuracionOauthId).toBe("oauth-tenant-1");
    expect(configuracionesUsadas).toEqual([undefined, "oauth-tenant-1"]);
    expect(verificadas).toEqual(["oauth-tenant-1"]);
  });

  it("inicia OAuth resolviendo el tenant a partir del correo del usuario", async () => {
    const repositorio = {
      obtenerTenantPorCorreoUsuario: async (correo: string) =>
        correo === "usuario@empresa.com" ? tenant : null,
      obtenerTenantPorHost: async (host: string) =>
        host === tenant.host ? tenant : null,
    } as RepositorioAutenticacion;

    const servicio = new ServicioAutenticacionQlik(
      () => ({ cliente: oauthFalso(), origen: "entorno_global" as const }),
      repositorio,
    );

    const resultado = await servicio.iniciarPorCorreo("usuario@empresa.com");

    expect(resultado.tenantQlikId).toBe(tenant.id);
    expect(resultado.url).toContain(
      "https://empresa.eu.qlikcloud.com/oauth/authorize",
    );
  });
});
