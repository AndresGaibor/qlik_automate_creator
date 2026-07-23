import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
import { app } from "../../app";
import {
  membresiasOrganizacion,
  organizaciones,
  tenantsQlik,
} from "../../infraestructura/base-datos/esquema.js";

// Mock de global.fetch para simular respuestas OAuth
const mockFetch = vi.fn();

global.fetch = mockFetch;

// ─── Helpers para construir la cadena de Drizzle mock ───────────────────────

function crearMockReturning(resultado: unknown[]) {
  return { returning: vi.fn().mockResolvedValue(resultado) };
}

// ─── Mock de base de datos ──────────────────────────────────────────────────

const mockFindTenants = vi.fn().mockResolvedValue(null);
const mockFindUsuarios = vi.fn().mockResolvedValue(null);
const mockFindIdentidades = vi.fn().mockResolvedValue(null);
const mockFindCredenciales = vi.fn().mockResolvedValue(null);
const mockFindSesiones = vi.fn().mockResolvedValue(null);
const mockFindMembresias = vi.fn().mockResolvedValue(null);

// Registro de todas las llamadas a db.insert(tabla).values(data)
interface InsertCall {
  tabla: unknown;
  datos: Record<string, unknown>;
}
const insertCalls: InsertCall[] = [];

const mockInsert = vi.fn().mockImplementation((tabla: unknown) => {
  return {
    values: vi.fn().mockImplementation((datos: Record<string, unknown>) => {
      insertCalls.push({ tabla, datos });
      return crearMockReturning([{ id: `mock-${insertCalls.length}` }]);
    }),
  };
});

const mockUpdate = vi.fn().mockReturnValue({
  set: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(undefined),
  }),
});

vi.mock("../../infraestructura/base-datos/conexion.js", () => ({
  db: {
    query: {
      tenantsQlik: { findFirst: mockFindTenants },
      usuarios: { findFirst: mockFindUsuarios },
      identidadesQlik: { findFirst: mockFindIdentidades },
      credencialesQlik: { findFirst: mockFindCredenciales },
      sesionesUsuario: { findFirst: mockFindSesiones },
      membresiasOrganizacion: { findFirst: mockFindMembresias },
    },
    insert: mockInsert,
    update: mockUpdate,
  },
}));

// Mock del servicio de cifrado
vi.mock("../../infraestructura/cifrado/servicio.js", () => ({
  servicioCifrado: {
    cifrar: vi.fn().mockReturnValue("token_cifrado_mock"),
  },
}));

// NO mockear qlik-oauth.js - usar la clase real

describe("OAuth Callback - Errores seguros", () => {
  const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

  beforeEach(() => {
    vi.clearAllMocks();
    insertCalls.length = 0;
    mockFindMembresias.mockResolvedValue(null);

    // Configurar fetch mock por defecto para OAuth token exchange
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          access_token: "access_token_mock",
          refresh_token: "refresh_token_mock",
          expires_in: 3600,
          scope: "user_default offline_access",
        }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("callback exitoso debe redirigir a FRONTEND_URL/ (no /)", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "access_token_mock",
            refresh_token: "refresh_token_mock",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: "user-123",
            name: "Test User",
            email: "test@example.com",
          }),
      });

    const res = await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=estado_mock",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    expect(res.status).toBe(302);
    const location = res.headers.get("Location");
    expect(location).toBe(`${FRONTEND_URL}/`);
  });

  it("callback exitoso: cuando tenant NO existe, crea organización con nombre estable", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "access_token_mock",
            refresh_token: "refresh_token_mock",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: "user-123",
            name: "Test User",
            email: "test@example.com",
          }),
      });

    await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=estado_mock",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    const insertOrganizacion = insertCalls.find(
      (c) => c.tabla === organizaciones,
    );
    expect(insertOrganizacion).toBeDefined();
    expect(insertOrganizacion?.datos?.nombre).toBe(
      "Qlik - l676lvg3emfvcq2.us.qlikcloud.com",
    );
  });

  it("callback exitoso: cuando tenant NO existe, inserta tenant con organizacionId", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "access_token_mock",
            refresh_token: "refresh_token_mock",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: "user-123",
            name: "Test User",
            email: "test@example.com",
          }),
      });

    await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=estado_mock",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    const insertTenant = insertCalls.find((c) => c.tabla === tenantsQlik);
    expect(insertTenant).toBeDefined();
    expect(insertTenant?.datos?.organizacionId).toBeDefined();
    expect(typeof insertTenant?.datos?.organizacionId).toBe("string");

    // La organización se creó antes que el tenant
    const insertOrganizacion = insertCalls.find(
      (c) => c.tabla === organizaciones,
    );
    expect(insertOrganizacion).toBeDefined();
  });

  it("callback exitoso: crea membresía usuario-organización con rol 'usuario'", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "access_token_mock",
            refresh_token: "refresh_token_mock",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: "user-123",
            name: "Test User",
            email: "test@example.com",
          }),
      });

    await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=estado_mock",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    const insertMembresia = insertCalls.find(
      (c) => c.tabla === membresiasOrganizacion,
    );
    expect(insertMembresia).toBeDefined();
    expect(insertMembresia?.datos?.rol).toBe("usuario");
    expect(insertMembresia?.datos?.organizacionId).toBeDefined();
    expect(insertMembresia?.datos?.usuarioId).toBeDefined();
  });

  it("callback exitoso: cuando tenant EXISTE, usa su organizacionId sin crear otra organización", async () => {
    const orgExistenteId = "org-existente-uuid-1234";
    mockFindTenants.mockResolvedValue({
      id: "tenant-existente",
      organizacionId: orgExistenteId,
      host: "l676lvg3emfvcq2.us.qlikcloud.com",
    });

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "access_token_mock",
            refresh_token: "refresh_token_mock",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            id: "user-123",
            name: "Test User",
            email: "test@example.com",
          }),
      });

    await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=estado_mock",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    // NO debe crear organización ni insertar tenant
    const insertOrganizacion = insertCalls.find(
      (c) => c.tabla === organizaciones,
    );
    expect(insertOrganizacion).toBeUndefined();

    const insertTenant = insertCalls.find((c) => c.tabla === tenantsQlik);
    expect(insertTenant).toBeUndefined();

    // SÍ debe crear membresía usando la organizacionId del tenant existente
    const insertMembresia = insertCalls.find(
      (c) => c.tabla === membresiasOrganizacion,
    );
    expect(insertMembresia).toBeDefined();
    expect(insertMembresia?.datos?.organizacionId).toBe(orgExistenteId);
  });

  it("error 401/identity debe usar codigo identity_scope_error", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "access_token_mock",
            refresh_token: "refresh_token_mock",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      })
      .mockRejectedValueOnce(new Error("401 Unauthorized: /api/v1/users/me"));

    const res = await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=estado_mock",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    expect(res.status).toBe(302);
    const location = res.headers.get("Location");
    expect(location).toContain("oauth_error=identity_scope_error");
    expect(location).not.toContain("401");
    expect(location).not.toContain("users/me");
  });

  it("error genérico debe usar codigo login_failed", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "access_token_mock",
            refresh_token: "refresh_token_mock",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      })
      .mockRejectedValueOnce(new Error("Database connection failed"));

    const res = await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=estado_mock",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    expect(res.status).toBe(302);
    const location = res.headers.get("Location");
    expect(location).toContain("oauth_error=login_failed");
    expect(location).not.toContain("Database");
    expect(location).not.toContain("connection");
  });

  it("RED: state inválido debe devolver JSON 400 (no redirección)", async () => {
    const res = await app.request(
      "/api/auth/qlik/callback?code=code_mock&state=wrong_state",
      {
        headers: {
          Cookie: "oauth_estado=estado_mock; oauth_verifier=verifier_mock",
        },
      },
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("OAuth state inválido");
  });
});
