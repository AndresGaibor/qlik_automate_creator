import { beforeEach, describe, expect, it, vi } from "bun:test";
import type { InfoSesion } from "./sesion.js";

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFindCredenciales = vi.fn();

vi.mock("../../infraestructura/base-datos/conexion.js", () => ({
  db: {
    query: {
      credencialesQlik: {
        findFirst: mockFindCredenciales,
      },
    },
  },
}));

const mockDescifrar = vi.fn();

vi.mock("../../infraestructura/cifrado/servicio.js", () => ({
  servicioCifrado: {
    descifrar: (...args: unknown[]) => mockDescifrar(...args),
  },
}));

// ─── Datos base ──────────────────────────────────────────────────────────────

function sesionBase(): InfoSesion {
  return {
    sesionId: "sesion-1",
    usuarioId: "usuario-1",
    identidadQlikId: "identidad-1",
    tenantId: "tenant-qlik-1",
    tenantHost: "https://mi-tenant.qlik.com",
    organizacionId: "org-1",
    tenantUuid: "tenant-uuid-1",
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("obtenerCredencialesQlik", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve null cuando no existe credencial para la identidad", async () => {
    mockFindCredenciales.mockResolvedValue(null);

    const { obtenerCredencialesQlik } = await import("./credenciales.js");
    const resultado = await obtenerCredencialesQlik(sesionBase());

    expect(resultado).toBeNull();
  });

  it("devuelve null cuando la credencial está expirada", async () => {
    const tokenCifrado = JSON.stringify({
      cifrado: "abc123",
      iv: "iv123",
      tag: "tag123",
    });

    mockFindCredenciales.mockResolvedValue({
      id: "cred-1",
      identidadQlikId: "identidad-1",
      tokenAccesoCifrado: tokenCifrado,
      tokenExpiraEn: new Date("2020-01-01"), // expirada
      estado: "activa",
    });

    const { obtenerCredencialesQlik } = await import("./credenciales.js");
    const resultado = await obtenerCredencialesQlik(sesionBase());

    expect(resultado).toBeNull();
    // No debe intentar descifrar si está expirada
    expect(mockDescifrar).not.toHaveBeenCalled();
  });

  it("devuelve null cuando el estado no es 'activa'", async () => {
    const futuro = new Date(Date.now() + 60_000);
    const tokenCifrado = JSON.stringify({
      cifrado: "abc123",
      iv: "iv123",
      tag: "tag123",
    });

    mockFindCredenciales.mockResolvedValue({
      id: "cred-1",
      identidadQlikId: "identidad-1",
      tokenAccesoCifrado: tokenCifrado,
      tokenExpiraEn: futuro,
      estado: "revocada",
    });

    const { obtenerCredencialesQlik } = await import("./credenciales.js");
    const resultado = await obtenerCredencialesQlik(sesionBase());

    expect(resultado).toBeNull();
    expect(mockDescifrar).not.toHaveBeenCalled();
  });

  it("devuelve null cuando JSON.parse del token falla (datos corruptos)", async () => {
    const futuro = new Date(Date.now() + 60_000);

    mockFindCredenciales.mockResolvedValue({
      id: "cred-1",
      identidadQlikId: "identidad-1",
      tokenAccesoCifrado: "esto-no-es-json",
      tokenExpiraEn: futuro,
      estado: "activa",
    });

    const { obtenerCredencialesQlik } = await import("./credenciales.js");
    const resultado = await obtenerCredencialesQlik(sesionBase());

    expect(resultado).toBeNull();
    expect(mockDescifrar).not.toHaveBeenCalled();
  });

  it("devuelve null cuando descifrar lanza error (tag/iv corruptos)", async () => {
    const futuro = new Date(Date.now() + 60_000);
    const tokenCifrado = JSON.stringify({
      cifrado: "abc123",
      iv: "iv123",
      tag: "tag123",
    });

    mockFindCredenciales.mockResolvedValue({
      id: "cred-1",
      identidadQlikId: "identidad-1",
      tokenAccesoCifrado: tokenCifrado,
      tokenExpiraEn: futuro,
      estado: "activa",
    });
    mockDescifrar.mockImplementation(() => {
      throw new Error("Unsupported state or unsupported auth tag");
    });

    const { obtenerCredencialesQlik } = await import("./credenciales.js");
    const resultado = await obtenerCredencialesQlik(sesionBase());

    expect(resultado).toBeNull();
  });

  it("devuelve {host, token} cuando la credencial es válida y futura", async () => {
    const futuro = new Date(Date.now() + 60_000);
    const tokenCifrado = JSON.stringify({
      cifrado: "abc123",
      iv: "iv123",
      tag: "tag123",
    });

    mockFindCredenciales.mockResolvedValue({
      id: "cred-1",
      identidadQlikId: "identidad-1",
      tokenAccesoCifrado: tokenCifrado,
      tokenExpiraEn: futuro,
      estado: "activa",
    });
    mockDescifrar.mockReturnValue("qlik-token-plaintext-123");

    const { obtenerCredencialesQlik } = await import("./credenciales.js");
    const resultado = await obtenerCredencialesQlik(sesionBase());

    expect(resultado).not.toBeNull();
    expect(resultado?.host).toBe("https://mi-tenant.qlik.com");
    expect(resultado?.token).toBe("qlik-token-plaintext-123");

    // Debe descifrar una sola vez con los campos correctos
    expect(mockDescifrar).toHaveBeenCalledTimes(1);
    expect(mockDescifrar).toHaveBeenCalledWith("abc123", "iv123", "tag123");
  });

  it("no expone el token cifrado ni el resultado del descifrado en logs", async () => {
    const futuro = new Date(Date.now() + 60_000);
    const tokenCifrado = JSON.stringify({
      cifrado: "datos-secretos",
      iv: "iv-secreto",
      tag: "tag-secreto",
    });

    mockFindCredenciales.mockResolvedValue({
      id: "cred-1",
      identidadQlikId: "identidad-1",
      tokenAccesoCifrado: tokenCifrado,
      tokenExpiraEn: futuro,
      estado: "activa",
    });
    mockDescifrar.mockReturnValue("token-super-secreto");

    const { obtenerCredencialesQlik } = await import("./credenciales.js");
    const resultado = await obtenerCredencialesQlik(sesionBase());

    expect(resultado).not.toBeNull();
    // Verificar que el objeto retornado solo contiene host y token
    if (resultado) {
      const claves = Object.keys(resultado);
      expect(claves).toEqual(["host", "token"]);
      expect(claves).not.toContain("cifrado");
      expect(claves).not.toContain("iv");
      expect(claves).not.toContain("tag");
    }
  });
});
