import { beforeEach, describe, expect, it, vi } from "bun:test";
import { Hono } from "hono";
import { QlikApiError } from "../../infraestructura/qlik/cliente.js";
import { flujosRouter } from "./rutas.js";

// Mockear dependencias de DB/sesión
vi.mock("../autenticacion-qlik/sesion.js", () => ({
  obtenerTenantDesdeSesion: vi.fn(),
}));

vi.mock("../autenticacion-qlik/credenciales.js", () => ({
  obtenerCredencialesQlik: vi.fn(),
}));

// Mockear ClienteQlik para controlar la respuesta HTTP
vi.mock("../../infraestructura/qlik/cliente.js", () => {
  return {
    ClienteQlik: vi.fn().mockImplementation(() => ({
      listarFlujos: vi.fn(),
    })),
  };
});

import { obtenerTenantDesdeSesion } from "../autenticacion-qlik/sesion.js";
import { obtenerCredencialesQlik } from "../autenticacion-qlik/credenciales.js";
import { ClienteQlik } from "../../infraestructura/qlik/cliente.js";

const mockObtenerTenant = obtenerTenantDesdeSesion as unknown as ReturnType<
  typeof vi.fn
>;
const mockObtenerCredenciales =
  obtenerCredencialesQlik as unknown as ReturnType<typeof vi.fn>;
const MockClienteQlik = ClienteQlik as unknown as ReturnType<typeof vi.fn>;

const app = new Hono();
app.route("/api/flujos", flujosRouter);

describe("GET /api/flujos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 401 si no hay sesión", async () => {
    mockObtenerTenant.mockResolvedValue(null);

    const res = await app.request("/api/flujos");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Sesión requerida");
  });

  it("devuelve 401 si no hay credenciales Qlik", async () => {
    mockObtenerTenant.mockResolvedValue({
      sesionId: "s-1",
      usuarioId: "u-1",
      identidadQlikId: "iq-1",
      tenantId: "t-1",
      tenantHost: "test.qlik.com",
      organizacionId: "org-1",
      tenantUuid: "t-uuid",
    });
    mockObtenerCredenciales.mockResolvedValue(null);

    const res = await app.request("/api/flujos");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Credenciales Qlik no disponibles");
  });

  it("llama a di-projects (no dataflows) y devuelve flujos", async () => {
    mockObtenerTenant.mockResolvedValue({
      sesionId: "s-1",
      usuarioId: "u-1",
      identidadQlikId: "iq-1",
      tenantId: "t-1",
      tenantHost: "test.qlik.com",
      organizacionId: "org-1",
      tenantUuid: "t-uuid",
    });
    mockObtenerCredenciales.mockResolvedValue({
      host: "test.qlik.com",
      token: "fake-token",
    });

    const mockFlujos = [
      {
        id: "flujo-1",
        name: "Flujo ETL",
        spaceId: "esp-1",
        owner: { id: "usr-1", name: "Juan" },
        createdDate: "2024-01-01T00:00:00Z",
        modifiedDate: "2024-01-02T00:00:00Z",
        artifact: { id: "art-1", name: "Artifact" },
      },
    ];

    MockClienteQlik.mockImplementation(() => ({
      listarFlujos: vi.fn().mockResolvedValue(mockFlujos),
    }) as unknown as InstanceType<typeof ClienteQlik>);

    const res = await app.request("/api/flujos");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual(mockFlujos);

    // Verificar que se construyó ClienteQlik con las credenciales correctas
    expect(MockClienteQlik).toHaveBeenCalledWith("test.qlik.com", "fake-token");
  });

  it("devuelve 400 con error cuando Qlik falla con error genérico", async () => {
    mockObtenerTenant.mockResolvedValue({
      sesionId: "s-1",
      usuarioId: "u-1",
      identidadQlikId: "iq-1",
      tenantId: "t-1",
      tenantHost: "test.qlik.com",
      organizacionId: "org-1",
      tenantUuid: "t-uuid",
    });
    mockObtenerCredenciales.mockResolvedValue({
      host: "test.qlik.com",
      token: "fake-token",
    });

    MockClienteQlik.mockImplementation(() => ({
      listarFlujos: vi.fn().mockRejectedValue(
        new Error("Error inesperado"),
      ),
    }) as unknown as InstanceType<typeof ClienteQlik>);

    const res = await app.request("/api/flujos");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Error inesperado");
  });

  it("devuelve 404 cuando Qlik devuelve 404 (recurso no encontrado)", async () => {
    mockObtenerTenant.mockResolvedValue({
      sesionId: "s-1",
      usuarioId: "u-1",
      identidadQlikId: "iq-1",
      tenantId: "t-1",
      tenantHost: "test.qlik.com",
      organizacionId: "org-1",
      tenantUuid: "t-uuid",
    });
    mockObtenerCredenciales.mockResolvedValue({
      host: "test.qlik.com",
      token: "fake-token",
    });

    MockClienteQlik.mockImplementation(() => ({
      listarFlujos: vi.fn().mockRejectedValue(
        new QlikApiError(404, "Not Found", "/api/v1/di-projects"),
      ),
    }) as unknown as InstanceType<typeof ClienteQlik>);

    const res = await app.request("/api/flujos");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(404);
    expect(body.error).toContain("Data Integration");
  });

  it("devuelve 403 cuando Qlik devuelve 403 (permisos insuficientes)", async () => {
    mockObtenerTenant.mockResolvedValue({
      sesionId: "s-1",
      usuarioId: "u-1",
      identidadQlikId: "iq-1",
      tenantId: "t-1",
      tenantHost: "test.qlik.com",
      organizacionId: "org-1",
      tenantUuid: "t-uuid",
    });
    mockObtenerCredenciales.mockResolvedValue({
      host: "test.qlik.com",
      token: "fake-token",
    });

    MockClienteQlik.mockImplementation(() => ({
      listarFlujos: vi.fn().mockRejectedValue(
        new QlikApiError(403, "Forbidden", "/api/v1/di-projects"),
      ),
    }) as unknown as InstanceType<typeof ClienteQlik>);

    const res = await app.request("/api/flujos");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(403);
    expect(body.error).toContain("Permisos insuficientes");
  });

  it("devuelve 502 cuando Qlik devuelve error de servidor (5xx)", async () => {
    mockObtenerTenant.mockResolvedValue({
      sesionId: "s-1",
      usuarioId: "u-1",
      identidadQlikId: "iq-1",
      tenantId: "t-1",
      tenantHost: "test.qlik.com",
      organizacionId: "org-1",
      tenantUuid: "t-uuid",
    });
    mockObtenerCredenciales.mockResolvedValue({
      host: "test.qlik.com",
      token: "fake-token",
    });

    MockClienteQlik.mockImplementation(() => ({
      listarFlujos: vi.fn().mockRejectedValue(
        new QlikApiError(500, "Internal Server Error", "/api/v1/di-projects"),
      ),
    }) as unknown as InstanceType<typeof ClienteQlik>);

    const res = await app.request("/api/flujos");
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(500);
  });

  it("pasa espacioId como query param al listarFlujos", async () => {
    mockObtenerTenant.mockResolvedValue({
      sesionId: "s-1",
      usuarioId: "u-1",
      identidadQlikId: "iq-1",
      tenantId: "t-1",
      tenantHost: "test.qlik.com",
      organizacionId: "org-1",
      tenantUuid: "t-uuid",
    });
    mockObtenerCredenciales.mockResolvedValue({
      host: "test.qlik.com",
      token: "fake-token",
    });

    const mockListarFlujos = vi.fn().mockResolvedValue([]);

    MockClienteQlik.mockImplementation(() => ({
      listarFlujos: mockListarFlujos,
    }) as unknown as InstanceType<typeof ClienteQlik>);

    const res = await app.request("/api/flujos?espacioId=esp-1");
    expect(res.status).toBe(200);
    expect(mockListarFlujos).toHaveBeenCalledWith("esp-1");
  });
});
