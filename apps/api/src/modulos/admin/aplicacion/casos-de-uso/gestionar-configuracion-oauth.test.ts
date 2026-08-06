import { describe, expect, it } from "bun:test";
import type { PuertoAuditoria } from "../../../../nucleo/auditoria/puerto-auditoria.js";
import type { RepositorioAdministracion } from "../puertos/repositorio-administracion.js";
import { GestionarConfiguracionOauth } from "./gestionar-configuracion-oauth.js";

const configuracion = {
  tenantQlikId: "tenant-1",
  clienteId: "cliente-1",
  secretoMascara: "••••abcd",
  scopes: ["user_default"],
  estado: "pendiente" as const,
  origen: "tenant" as const,
  verificadaEn: null,
  ultimoError: null,
  actualizadoEn: new Date("2026-08-06T10:00:00Z"),
};

function crearGestor({
  configuracionActual = configuracion,
  esEliminable = true,
}: {
  configuracionActual?: typeof configuracion | null;
  esEliminable?: boolean;
} = {}) {
  const eventos: unknown[] = [];
  const repositorio = {
    obtenerConfiguracionOAuth: async () => configuracionActual,
    guardarConfiguracionOAuth: async () => configuracion,
    eliminarConfiguracionOAuth: async () => esEliminable,
  } as unknown as RepositorioAdministracion;
  const auditoria: PuertoAuditoria = {
    registrar: async (evento) => {
      eventos.push(evento);
    },
  };
  return {
    eventos,
    gestor: new GestionarConfiguracionOauth(repositorio, auditoria, {
      redirectUri: "https://app.ejemplo.com/api/auth/qlik/callback",
      configuracionHeredada: {
        clienteId: "cliente-global",
        tieneSecreto: true,
        scopes: ["user_default"],
      },
    }),
  };
}

describe("GestionarConfiguracionOauth", () => {
  it("usa la configuración global cuando el tenant no tiene fila propia", async () => {
    const { gestor } = crearGestor({ configuracionActual: null });

    await expect(gestor.obtener("org-1", "tenant-1")).resolves.toMatchObject({
      tenantQlikId: "tenant-1",
      clienteId: "cliente-global",
      secretoMascara: "••••••••",
      origen: "entorno_global",
      redirectUri: "https://app.ejemplo.com/api/auth/qlik/callback",
    });
  });

  it("guarda, serializa y audita sin exponer el secreto", async () => {
    const { gestor, eventos } = crearGestor();

    const resultado = await gestor.guardar({
      organizacionId: "org-1",
      tenantQlikId: "tenant-1",
      usuarioId: "usuario-1",
      entrada: {
        clienteId: "cliente-1",
        clienteSecreto: "secreto-privado",
        scopes: ["user_default"],
      },
      ip: "127.0.0.1",
      agenteUsuario: "prueba",
    });

    expect(resultado.actualizadoEn).toBe("2026-08-06T10:00:00.000Z");
    expect(eventos).toHaveLength(1);
    expect(JSON.stringify(eventos)).not.toContain("secreto-privado");
  });

  it("reserva la eliminación para superadministradores", async () => {
    const { gestor } = crearGestor();

    await expect(
      gestor.eliminar({
        organizacionId: "org-1",
        tenantQlikId: "tenant-1",
        usuarioId: "usuario-1",
        esSuperadmin: false,
        ip: "127.0.0.1",
      }),
    ).rejects.toMatchObject({ codigo: "NO_AUTORIZADO", estadoHttp: 403 });
  });
});
