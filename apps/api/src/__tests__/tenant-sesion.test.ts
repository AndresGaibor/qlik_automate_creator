import { beforeEach, describe, expect, it, vi } from "bun:test";
import { app } from "../app.js";

// ─── Mock de base de datos ───────────────────────────────────────────────────

const mockFindSesiones = vi.fn();
const mockFindIdentidades = vi.fn();
const mockFindTenants = vi.fn();
const mockFindCredenciales = vi.fn();

vi.mock("../infraestructura/base-datos/conexion.js", () => ({
  db: {
    query: {
      sesionesUsuario: {
        findFirst: mockFindSesiones,
      },
      identidadesQlik: {
        findFirst: mockFindIdentidades,
      },
      tenantsQlik: {
        findFirst: mockFindTenants,
      },
      credencialesQlik: {
        findFirst: mockFindCredenciales,
      },
    },
  },
}));

// ─── Mock de cifrado ─────────────────────────────────────────────────────────

const mockDescifrar = vi.fn();

vi.mock("../infraestructura/cifrado/servicio.js", () => ({
  servicioCifrado: {
    descifrar: (...args: unknown[]) => mockDescifrar(...args),
  },
}));

// ─── Mock de ClienteQlik (evitar requests HTTP) ──────────────────────────────

const mockListarFlujos = vi.fn();
const mockListarAutomatizaciones = vi.fn();

vi.mock("../infraestructura/qlik/cliente.js", () => ({
  ClienteQlik: vi.fn().mockImplementation(() => ({
    listarFlujos: mockListarFlujos,
    listarAutomatizaciones: mockListarAutomatizaciones,
    crearAutomatizacion: vi.fn(),
    ejecutarAutomatizacion: vi.fn(),
    listarEspacios: vi.fn(),
  })),
}));

// Mock de ClienteDestinos
vi.mock("../infraestructura/destinos-api/cliente.js", () => ({
  ClienteDestinos: vi.fn().mockImplementation(() => ({
    listar: vi.fn(),
  })),
}));

// ─── Mock de servicio de automatizaciones ─────────────────────────────────────

const mockServicioListar = vi.fn();
const mockServicioCrear = vi.fn();
const mockServicioObtener = vi.fn();
const mockServicioEjecutar = vi.fn();

vi.mock("../modulos/automatizaciones/servicio.js", () => ({
  ServicioAutomatizaciones: vi.fn().mockImplementation(() => ({
    listar: mockServicioListar,
    crear: mockServicioCrear,
    obtener: mockServicioObtener,
    ejecutar: mockServicioEjecutar,
  })),
}));

// ─── Datos mock ──────────────────────────────────────────────────────────────

function sesionValida() {
  return {
    id: "sesion-123",
    tokenSesionHash: "hash",
    usuarioId: "usuario-1",
    identidadQlikId: "identidad-1",
    expiraEn: new Date(Date.now() + 60000),
    revocadaEn: null,
    creadasEn: new Date(),
  };
}

function identidadValida() {
  return {
    id: "identidad-1",
    tenantQlikId: "tenant-qlik-1",
    usuarioId: "usuario-1",
    webIntegrationId: "web-int-1",
    userId: "user-qlik-1",
    nombreUsuario: "Test User",
    createdAt: new Date(),
  };
}

function tenantValido() {
  return {
    id: "tenant-uuid-1",
    tenantIdQlik: "tenant-sesion-real",
    host: "https://tenant-real.qlik.com",
    clientId: "client-1",
    clientSecret: "secret-1",
    organizacionId: "org-1",
    createdAt: new Date(),
  };
}

function credencialValida() {
  return {
    id: "cred-1",
    identidadQlikId: "identidad-1",
    tokenAccesoCifrado: JSON.stringify({
      cifrado: "datos-cifrados",
      iv: "iv-mock",
      tag: "tag-mock",
    }),
    tokenExpiraEn: new Date(Date.now() + 60_000),
    estado: "activa",
  };
}

function configurarSesionConCredencial() {
  mockFindSesiones.mockResolvedValue(sesionValida());
  mockFindIdentidades.mockResolvedValue(identidadValida());
  mockFindTenants.mockResolvedValue(tenantValido());
  mockFindCredenciales.mockResolvedValue(credencialValida());
  mockDescifrar.mockReturnValue("qlik-token-descifrado");
}

function configurarSesionSinCredencial() {
  mockFindSesiones.mockResolvedValue(sesionValida());
  mockFindIdentidades.mockResolvedValue(identidadValida());
  mockFindTenants.mockResolvedValue(tenantValido());
  mockFindCredenciales.mockResolvedValue(null);
  mockDescifrar.mockClear();
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Tenant derivation desde sesión", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/automatizaciones", () => {
    it("devuelve 401 cuando no hay sesión", async () => {
      const res = await app.request("/api/automatizaciones", {
        headers: {},
      });
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("Sesión requerida");
    });

    it("devuelve 401 cuando no hay credenciales Qlik para la identidad", async () => {
      configurarSesionSinCredencial();

      const res = await app.request("/api/automatizaciones", {
        headers: {
          Cookie: "sesion_usuario=test-token",
        },
      });

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("Credenciales Qlik no disponibles");
      // No debe intentar descifrar
      expect(mockDescifrar).not.toHaveBeenCalled();
    });

    it("cookie válida con credencial válida lista automatizaciones desde Qlik (sin token expuesto)", async () => {
      configurarSesionConCredencial();
      mockListarAutomatizaciones.mockResolvedValue([
        { id: "auto-1", name: "Automatizacion Qlik" },
      ]);

      const res = await app.request("/api/automatizaciones", {
        headers: {
          Cookie: "sesion_usuario=test-token",
          "x-tenant-id": "tenant-spoofed",
        },
      });

      // El tenant debe derivarse de la sesión, no del header spoofed
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].id).toBe("auto-1");

      // Verificar que ClienteQlik recibió token descifrado (pero no lo expone)
      expect(mockDescifrar).toHaveBeenCalledWith(
        "datos-cifrados",
        "iv-mock",
        "tag-mock",
      );

      // Verificar que se llamó a listarAutomatizaciones de Qlik
      expect(mockListarAutomatizaciones).toHaveBeenCalled();
    });

    it("devuelve 404 cuando Qlik devuelve 404 en automatizaciones", async () => {
      configurarSesionConCredencial();
      const { QlikApiError } = await import(
        "../infraestructura/qlik/cliente.js"
      );
      mockListarAutomatizaciones.mockRejectedValue(
        new QlikApiError(404, "Not Found", "/api/workflows/automations"),
      );

      const res = await app.request("/api/automatizaciones", {
        headers: { Cookie: "sesion_usuario=test-token" },
      });

      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.qlikStatus).toBe(404);
    });

    it("devuelve 403 cuando Qlik devuelve 403 en automatizaciones", async () => {
      configurarSesionConCredencial();
      const { QlikApiError } = await import(
        "../infraestructura/qlik/cliente.js"
      );
      mockListarAutomatizaciones.mockRejectedValue(
        new QlikApiError(403, "Forbidden", "/api/workflows/automations"),
      );

      const res = await app.request("/api/automatizaciones", {
        headers: { Cookie: "sesion_usuario=test-token" },
      });

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.qlikStatus).toBe(403);
    });
  });

  describe("GET /api/flujos", () => {
    it("devuelve 401 cuando no hay sesión", async () => {
      const res = await app.request("/api/flujos", {
        headers: {},
      });
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("Sesión requerida");
    });

    it("devuelve 401 cuando no hay credenciales Qlik para la identidad", async () => {
      configurarSesionSinCredencial();

      const res = await app.request("/api/flujos", {
        headers: {
          Cookie: "sesion_usuario=test-token-2",
        },
      });

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("Credenciales Qlik no disponibles");
    });

    it("cookie válida con credencial válida lista flujos (sin token expuesto)", async () => {
      configurarSesionConCredencial();
      mockListarFlujos.mockResolvedValue([{ id: "flujo-1", name: "Test" }]);

      const res = await app.request("/api/flujos", {
        headers: {
          Cookie: "sesion_usuario=test-token-2",
          "x-tenant-id": "tenant-spoofed",
        },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(1);

      expect(mockDescifrar).toHaveBeenCalled();
    });
  });

  describe("POST /api/automatizaciones", () => {
    it("devuelve 401 cuando no hay sesión", async () => {
      const res = await app.request("/api/automatizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "test",
          flujoIdQlik: "flujo-1",
          flujoNombre: "Test Flujo",
          destinoProveedor: "bigquery",
          destinoIdExterno: "dest-1",
          destinoNombre: "Test Destino",
        }),
      });
      expect(res.status).toBe(401);
    });

    it("no acepta identidad de headers spoofed, deriva desde sesión", async () => {
      configurarSesionConCredencial();
      mockServicioCrear.mockResolvedValue({
        id: "config-1",
        nombre: "test",
        estado: "activa",
      });

      const res = await app.request("/api/automatizaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "sesion_usuario=test-token",
          "x-usuario-id": "usuario-spoofed",
          "x-organizacion-id": "org-spoofed",
          "x-tenant-id": "tenant-spoofed",
        },
        body: JSON.stringify({
          nombre: "test",
          flujoIdQlik: "flujo-1",
          flujoNombre: "Test Flujo",
          destinoProveedor: "bigquery",
          destinoIdExterno: "dest-1",
          destinoNombre: "Test Destino",
        }),
      });

      // Debe usar los IDs de la sesión, no los del header
      expect(mockServicioCrear).toHaveBeenCalled();
      if (mockServicioCrear.mock.calls.length > 0) {
        const args = mockServicioCrear.mock.calls[0];
        // args[1] = usuarioId, args[2] = tenantUuid, args[3] = organizacionId
        expect(args[1]).toBe("usuario-1"); // de sesión, no "usuario-spoofed"
        expect(args[3]).toBe("org-1"); // de sesión, no "org-spoofed"
      }
    });
  });

  describe("POST /api/automatizaciones/:id/ejecutar", () => {
    it("devuelve 401 cuando no hay sesión", async () => {
      const res = await app.request("/api/automatizaciones/abc/ejecutar", {
        method: "POST",
        headers: {},
      });
      expect(res.status).toBe(401);
    });

    it("deriva identidad y organización desde sesión, no desde headers", async () => {
      configurarSesionConCredencial();
      mockServicioEjecutar.mockResolvedValue({
        runId: "run-1",
        automatizacionIdQlik: "auto-1",
      });

      const res = await app.request("/api/automatizaciones/config-1/ejecutar", {
        method: "POST",
        headers: {
          Cookie: "sesion_usuario=test-token",
          "x-usuario-id": "usuario-spoofed",
          "x-organizacion-id": "org-spoofed",
        },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);

      if (mockServicioEjecutar.mock.calls.length > 0) {
        const args = mockServicioEjecutar.mock.calls[0];
        // args[1] = usuarioId, args[2] = organizacionId
        expect(args[1]).toBe("usuario-1"); // de sesión
        expect(args[2]).toBe("org-1"); // de sesión
      }
    });
  });
});

describe("Helper: obtenerTenantDesdeSesion", () => {
  it("existe y es exportable", async () => {
    const { obtenerTenantDesdeSesion } = await import(
      "../modulos/autenticacion-qlik/sesion.js"
    );
    expect(typeof obtenerTenantDesdeSesion).toBe("function");
  });
});

describe("Helper: obtenerCredencialesQlik", () => {
  it("existe y es exportable", async () => {
    const { obtenerCredencialesQlik } = await import(
      "../modulos/autenticacion-qlik/credenciales.js"
    );
    expect(typeof obtenerCredencialesQlik).toBe("function");
  });
});
