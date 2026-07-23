import { beforeEach, describe, expect, it, vi } from "bun:test";
import { Hono } from "hono";
import { QlikApiError } from "../../infraestructura/qlik/cliente.js";

// ─── Mock dependencias ─────────────────────────────────────────────────────

vi.mock("../autenticacion-qlik/sesion.js", () => ({
  obtenerTenantDesdeSesion: vi.fn(),
}));

vi.mock("../autenticacion-qlik/credenciales.js", () => ({
  obtenerCredencialesQlik: vi.fn(),
}));

vi.mock("../../infraestructura/qlik/cliente.js", () => {
  return {
    ClienteQlik: vi.fn().mockImplementation(() => ({})),
    QlikApiError: QlikApiError,
  };
});

vi.mock("../../infraestructura/base-datos/conexion.js", () => ({
  db: {
    transaction: vi.fn(),
  },
}));

import {
  ClienteQlik,
  QlikApiError as QlikApiErrorCls,
} from "../../infraestructura/qlik/cliente.js";
import { obtenerTenantDesdeSesion } from "../autenticacion-qlik/sesion.js";
import { obtenerCredencialesQlik } from "../autenticacion-qlik/credenciales.js";
import { db } from "../../infraestructura/base-datos/conexion.js";
import { qlikAutomatizacionesRouter } from "./rutas.js";

const mockObtenerTenant = obtenerTenantDesdeSesion as unknown as ReturnType<
  typeof vi.fn
>;
const mockObtenerCredenciales =
  obtenerCredencialesQlik as unknown as ReturnType<typeof vi.fn>;
const MockClienteQlik = ClienteQlik as unknown as ReturnType<typeof vi.fn>;
const mockDbTransaction = (
  db as unknown as { transaction: ReturnType<typeof vi.fn> }
).transaction;

const SesionValida = {
  sesionId: "s-1",
  usuarioId: "u-1",
  identidadQlikId: "iq-1",
  tenantId: "t-1",
  tenantHost: "test.qlik.com",
  organizacionId: "org-1",
  tenantUuid: "t-uuid",
};

const CredencialesValidas = {
  host: "test.qlik.com",
  token: "fake-token",
};

const MockEspacios = [
  {
    id: "esp-1",
    name: "Espacio Compartido",
    type: "shared" as const,
    owner: { id: "usr-1", name: "Juan Perez" },
    createdDate: "2024-01-01T00:00:00Z",
    modifiedDate: "2024-01-02T00:00:00Z",
  },
  {
    id: "esp-2",
    name: "Espacio Personal",
    type: "personal" as const,
    owner: { id: "usr-2", name: "Maria Garcia" },
    createdDate: "2024-02-01T00:00:00Z",
    modifiedDate: "2024-02-02T00:00:00Z",
  },
];

const MockAutomatizaciones = [
  {
    id: "auto-1",
    name: "Sync Diario",
    spaceId: "esp-1",
    owner: { id: "usr-1", name: "Juan Perez" },
    isEnabled: true,
    triggerType: "scheduled",
    lastExecution: {
      id: "run-10",
      status: "completed",
      startTime: "2024-06-01T10:00:00Z",
      endTime: "2024-06-01T10:01:00Z",
    },
    createdDate: "2024-01-01T00:00:00Z",
    modifiedDate: "2024-05-01T00:00:00Z",
  },
  {
    id: "auto-2",
    name: "Backup Nocturno",
    spaceId: "esp-2",
    owner: { id: "usr-2", name: "Maria Garcia" },
    isEnabled: false,
    triggerType: "manual",
    createdDate: "2024-03-01T00:00:00Z",
    modifiedDate: "2024-04-01T00:00:00Z",
  },
];

function crearClienteMock(overrides: Record<string, unknown> = {}) {
  const defaults = {
    listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
    listarAutomatizaciones: vi.fn().mockResolvedValue(MockAutomatizaciones),
    obtenerAutomatizacion: vi.fn(),
    listarEjecuciones: vi.fn().mockResolvedValue([]),
    ejecutarAutomatizacion: vi.fn().mockResolvedValue({ runId: "run-new" }),
    detenerEjecucion: vi.fn().mockResolvedValue(undefined),
    obtenerUsuario: vi.fn().mockImplementation((id: string) =>
      Promise.resolve({ id, name: `Usuario ${id}` }),
    ),
    obtenerEspacio: vi.fn().mockImplementation((id: string) =>
      Promise.resolve({ id, name: `Espacio ${id}` }),
    ),
  };
  const cliente = { ...defaults, ...overrides };
  MockClienteQlik.mockImplementation(() => cliente);
  return cliente;
}

function configurarSesion() {
  mockObtenerTenant.mockResolvedValue(SesionValida);
  mockObtenerCredenciales.mockResolvedValue(CredencialesValidas);
}

/**
 * Configura el mock de db.transaction para que el advisory lock se adquiera
 * y la transacción ejecute el callback normalmente.
 */
function mockTransaccionLockAdquirido() {
  mockDbTransaction.mockImplementation(
    async (fn: (tx: { execute: ReturnType<typeof vi.fn> }) => Promise<unknown>) => {
      const tx = {
        execute: vi.fn().mockResolvedValue([{ adquirido: true }]),
      };
      return fn(tx);
    },
  );
}

/**
 * Configura el mock de db.transaction para que el advisory lock NO se adquiera.
 * El callback retorna { tipo: "lock_en_uso" } inmediatamente.
 */
function mockTransaccionLockNoAdquirido() {
  mockDbTransaction.mockImplementation(
    async (fn: (tx: { execute: ReturnType<typeof vi.fn> }) => Promise<unknown>) => {
      const tx = {
        execute: vi.fn().mockResolvedValue([{ adquirido: false }]),
      };
      return fn(tx);
    },
  );
}

const app = new Hono();
app.route("/api/qlik/automatizaciones", qlikAutomatizacionesRouter);

// ─── GET / ─────────────────────────────────────────────────────────────────

describe("GET /api/qlik/automatizaciones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 401 si no hay sesión", async () => {
    mockObtenerTenant.mockResolvedValue(null);

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Sesión requerida");
  });

  it("devuelve 401 si no hay credenciales Qlik", async () => {
    mockObtenerTenant.mockResolvedValue(SesionValida);
    mockObtenerCredenciales.mockResolvedValue(null);

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Credenciales Qlik no disponibles");
  });

  it("devuelve automatizaciones enriquecidas con espacioNombre, ownerNombre y campos calculados", async () => {
    configurarSesion();
    crearClienteMock();

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(2);

    const first = body.data[0];
    expect(first.id).toBe("auto-1");
    expect(first.name).toBe("Sync Diario");
    expect(first.espacioNombre).toBe("Espacio Compartido");
    expect(first.ownerNombre).toBe("Juan Perez");
    expect(first.isEnabled).toBe(true);
    expect(first.triggerType).toBe("scheduled");
    expect(first.creadoEn).toBe("2024-01-01T00:00:00Z");
    expect(first.modificadoEn).toBe("2024-05-01T00:00:00Z");
    // ejecucionActiva: lastExecution status is "completed" => false
    expect(first.ejecucionActiva).toBe(false);
    // puedeEjecutar: isEnabled && !ejecucionActiva
    expect(first.puedeEjecutar).toBe(true);
  });

  it("marca ejecucionActiva=true y puedeEjecutar=false cuando la última ejecución está corriendo", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          ...MockAutomatizaciones[0],
          lastExecution: {
            id: "run-active",
            status: "running",
            startTime: "2024-06-01T12:00:00Z",
          },
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].ejecucionActiva).toBe(true);
    expect(body.data[0].puedeEjecutar).toBe(false);
  });

  it("marca ejecucionActiva=true cuando status es 'queued'", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          ...MockAutomatizaciones[0],
          lastExecution: {
            id: "run-queued",
            status: "queued",
            startTime: "2024-06-01T12:00:00Z",
          },
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].ejecucionActiva).toBe(true);
  });

  it("marca ejecucionActiva=true cuando status es 'started'", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          ...MockAutomatizaciones[0],
          lastExecution: {
            id: "run-started",
            status: "started",
            startTime: "2024-06-01T12:00:00Z",
          },
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].ejecucionActiva).toBe(true);
  });

  it("devuelve espacioNombre con el spaceId cuando el espacio no está en el mapa de espacios", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          ...MockAutomatizaciones[0],
          spaceId: "esp-inexistente",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].espacioNombre).toBe("esp-inexistente");
  });

  it("resuelve ownerNombre desde la API cuando la automatización tiene ownerId (schema real Qlik)", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-real-1",
          name: "Sync Real",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-real-1",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-06-01T00:00:00Z",
        },
      ]),
      obtenerUsuario: vi.fn().mockImplementation((id: string) =>
        Promise.resolve({ id, name: "Carlos Resuelto" }),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].ownerNombre).toBe("Carlos Resuelto");
  });

  it("usa owner.name legacy cuando ambos owner.name y ownerId están presentes", async () => {
    configurarSesion();
    crearClienteMock();

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    // MockAutomatizaciones[0] tiene owner: { name: "Juan Perez" }
    expect(body.data[0].ownerNombre).toBe("Juan Perez");
  });

  it("no rompe cuando obtenerUsuario falla (Promise.allSettled gracefully)", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-fail-user",
          name: "Auto Fail",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-fail",
        },
      ]),
      obtenerUsuario: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/users/usr-fail"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    // Fallback al ownerId cuando la resolución falla
    expect(body.data[0].ownerNombre).toBe("usr-fail");
  });

  it("deduplica ownerId al resolver usuarios (no llama obtenerUsuario dos veces para el mismo ID)", async () => {
    configurarSesion();
    const obtenerUsuarioMock = vi.fn().mockImplementation((id: string) =>
      Promise.resolve({ id, name: `User ${id}` }),
    );
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-a",
          name: "Auto A",
          state: "available",
          ownerId: "usr-shared",
        },
        {
          id: "auto-b",
          name: "Auto B",
          state: "available",
          ownerId: "usr-shared",
        },
      ]),
      obtenerUsuario: obtenerUsuarioMock,
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    // Solo debe llamar una vez para usr-shared (deduplicado)
    expect(obtenerUsuarioMock).toHaveBeenCalledTimes(1);
    expect(obtenerUsuarioMock).toHaveBeenCalledWith("usr-shared");
  });

  it("devuelve 404 cuando Qlik devuelve 404", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/v1/spaces"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(404);
  });

  it("devuelve 403 cuando Qlik devuelve 403", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/spaces"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(403);
  });

  it("devuelve 502 cuando Qlik devuelve error de servidor", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(500, "Internal Server Error", "/api/v1/spaces"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(500);
  });
});

// ─── GET /:id ──────────────────────────────────────────────────────────────

describe("GET /api/qlik/automatizaciones/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 401 si no hay sesión", async () => {
    mockObtenerTenant.mockResolvedValue(null);

    const res = await app.request("/api/qlik/automatizaciones/auto-1");
    expect(res.status).toBe(401);
  });

  it("devuelve detalle de automatización con ejecuciones recientes", async () => {
    configurarSesion();
    const mockDetalle = {
      id: "auto-1",
      name: "Sync Diario",
      spaceId: "esp-1",
      owner: { id: "usr-1", name: "Juan Perez" },
      isEnabled: true,
      triggerType: "scheduled",
      createdDate: "2024-01-01T00:00:00Z",
      modifiedDate: "2024-05-01T00:00:00Z",
    };
    const mockRuns = [
      {
        id: "run-1",
        automationId: "auto-1",
        status: "completed" as const,
        startTime: "2024-06-01T10:00:00Z",
        endTime: "2024-06-01T10:01:00Z",
      },
      {
        id: "run-2",
        automationId: "auto-1",
        status: "failed" as const,
        startTime: "2024-06-02T10:00:00Z",
        endTime: "2024-06-02T10:00:30Z",
        error: "Timeout",
      },
    ];

    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockResolvedValue(mockDetalle),
      listarEjecuciones: vi.fn().mockResolvedValue(mockRuns),
      listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    const data = body.data;
    expect(data.automatizacion.id).toBe("auto-1");
    expect(data.automatizacion.name).toBe("Sync Diario");
    expect(data.automatizacion.espacioNombre).toBe("Espacio Compartido");
    expect(data.automatizacion.ownerNombre).toBe("Juan Perez");
    expect(data.ejecuciones).toHaveLength(2);
    expect(data.ejecuciones[0].id).toBe("run-1");
    expect(data.ejecuciones[0].status).toBe("completed");
  });

  it("devuelve 404 cuando la automatización no existe en Qlik", async () => {
    configurarSesion();
    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/workflows/automations/auto-999"),
      ),
      listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-999");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(404);
  });

  it("resuelve ownerNombre en el detalle cuando la automatización tiene ownerId", async () => {
    configurarSesion();
    const mockDetalle = {
      id: "auto-real-detail",
      name: "Auto Real Detail",
      spaceId: "esp-1",
      state: "available",
      ownerId: "usr-2",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
    };

    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockResolvedValue(mockDetalle),
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
      obtenerUsuario: vi.fn().mockImplementation((id: string) =>
        Promise.resolve({ id, name: "Maria Resuelta" }),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-real-detail");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.automatizacion.ownerNombre).toBe("Maria Resuelta");
  });

  it("no rompe el detalle cuando obtenerUsuario falla", async () => {
    configurarSesion();
    const mockDetalle = {
      id: "auto-fail",
      name: "Auto Fail",
      spaceId: "esp-1",
      state: "available",
      ownerId: "usr-fail",
    };

    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockResolvedValue(mockDetalle),
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
      obtenerUsuario: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/users/usr-fail"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-fail");
    expect(res.status).toBe(200);
    const body = await res.json();
    // Fallback al ownerId cuando la resolución falla
    expect(body.data.automatizacion.ownerNombre).toBe("usr-fail");
  });
});

// ─── GET /:id/runs ─────────────────────────────────────────────────────────

describe("GET /api/qlik/automatizaciones/:id/runs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve ejecuciones de una automatización", async () => {
    configurarSesion();
    const mockRuns = [
      {
        id: "run-1",
        automationId: "auto-1",
        status: "completed" as const,
        startTime: "2024-06-01T10:00:00Z",
        endTime: "2024-06-01T10:01:00Z",
      },
    ];

    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue(mockRuns),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/runs");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].id).toBe("run-1");
  });

  it("devuelve 404 cuando Qlik devuelve 404 para la automatización", async () => {
    configurarSesion();
    crearClienteMock({
      listarEjecuciones: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/workflows/automations/auto-999/runs"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-999/runs");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(404);
  });

  it("devuelve 401 si no hay sesión", async () => {
    mockObtenerTenant.mockResolvedValue(null);

    const res = await app.request("/api/qlik/automatizaciones/auto-1/runs");
    expect(res.status).toBe(401);
  });
});

// ─── POST /:id/run ─────────────────────────────────────────────────────────

describe("POST /api/qlik/automatizaciones/:id/run", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 401 si no hay sesión", async () => {
    mockObtenerTenant.mockResolvedValue(null);

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });
    expect(res.status).toBe(401);
  });

  it("devuelve 409 cuando la última ejecución está activa (running)", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    const mockRuns = [
      {
        id: "run-active",
        automationId: "auto-1",
        status: "running" as const,
        startTime: "2024-06-01T12:00:00Z",
      },
    ];

    const cliente = crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue(mockRuns),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("ya está en ejecución");
    expect(body.runIdActivo).toBe("run-active");
    // No debe llamar a ejecutarAutomatizacion
    expect(cliente.ejecutarAutomatizacion).not.toHaveBeenCalled();
  });

  it("devuelve 409 cuando la última ejecución está en queued", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    const mockRuns = [
      {
        id: "run-queued",
        automationId: "auto-1",
        status: "queued" as const,
        startTime: "2024-06-01T12:00:00Z",
      },
    ];

    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue(mockRuns),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.runIdActivo).toBe("run-queued");
  });

  it("devuelve 409 cuando la última ejecución está en started", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    const mockRuns = [
      {
        id: "run-started",
        automationId: "auto-1",
        status: "started" as const,
        startTime: "2024-06-01T12:00:00Z",
      },
    ];

    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue(mockRuns),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.runIdActivo).toBe("run-started");
  });

  it("devuelve 409 cuando la última ejecución está en pending", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    const mockRuns = [
      {
        id: "run-pending",
        automationId: "auto-1",
        status: "pending" as const,
        startTime: "2024-06-01T12:00:00Z",
      },
    ];

    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue(mockRuns),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.runIdActivo).toBe("run-pending");
  });

  it("ejecuta la automatización cuando no hay ejecución activa", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    const cliente = crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([
        {
          id: "run-old",
          automationId: "auto-1",
          status: "completed" as const,
          startTime: "2024-05-01T10:00:00Z",
          endTime: "2024-05-01T10:01:00Z",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.runId).toBe("run-new");
    expect(cliente.ejecutarAutomatizacion).toHaveBeenCalledWith("auto-1");
  });

  it("ejecuta cuando no hay ejecuciones previas", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    const cliente = crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([]),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(200);
    expect(cliente.ejecutarAutomatizacion).toHaveBeenCalledWith("auto-1");
  });

  it("devuelve error de Qlik cuando la ejecución falla", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      ejecutarAutomatizacion: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/workflows/automations/auto-1/runs"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(403);
  });

  it("usa sort=desc al consultar ejecuciones para decidir estado activo", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    const cliente = crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([]),
    });

    await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(cliente.listarEjecuciones).toHaveBeenCalledWith("auto-1", {
      limit: 1,
      sort: "desc",
    });
  });

  it("bloqueo concurrente devuelve 409 cuando el advisory lock ya está tomado", async () => {
    configurarSesion();

    // Primera solicitud: adquiere el lock y ejecutarAutomatizacion tarda
    let resolvePrimera: (() => void) | undefined;
    const promesaLenta = new Promise<{ runId: string }>((resolve) => {
      resolvePrimera = () => resolve({ runId: "run-c-1" });
    });

    const cliente = crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      ejecutarAutomatizacion: vi.fn().mockImplementation(() => promesaLenta),
    });

    // Primera request: advisory lock adquirido
    mockDbTransaction.mockImplementationOnce(
      async (fn: (tx: { execute: ReturnType<typeof vi.fn> }) => Promise<unknown>) => {
        const tx = {
          execute: vi.fn().mockResolvedValueOnce([{ adquirido: true }]),
        };
        return fn(tx);
      },
    );

    const primeraPromise = app.request(
      "/api/qlik/automatizaciones/auto-1/run",
      { method: "POST" },
    );

    // Dar tiempo para que la primera request entre y adquiera el lock
    await new Promise((r) => setTimeout(r, 10));

    // Segunda solicitud: advisory lock no disponible (simula otro proceso)
    mockDbTransaction.mockImplementationOnce(
      async (fn: (tx: { execute: ReturnType<typeof vi.fn> }) => Promise<unknown>) => {
        const tx = {
          execute: vi.fn().mockResolvedValueOnce([{ adquirido: false }]),
        };
        return fn(tx);
      },
    );

    const segundaRes = await app.request(
      "/api/qlik/automatizaciones/auto-1/run",
      { method: "POST" },
    );

    expect(segundaRes.status).toBe(409);
    const body = await segundaRes.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("ejecución en curso");

    // Liberar la primera para que termine limpiamente
    if (resolvePrimera) resolvePrimera();
    const primeraRes = await primeraPromise;
    expect(primeraRes.status).toBe(200);

    // Verificar que ejecutarAutomatizacion solo se llamó una vez (en la primera request)
    expect(cliente.ejecutarAutomatizacion).toHaveBeenCalledTimes(1);
  });

  it("error no-Qlik no expone mensajes internos al cliente", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();

    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      ejecutarAutomatizacion: vi.fn().mockRejectedValue(
        new Error("Cannot read property 'x' of undefined"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Error interno del servidor");
    // No debe exponer el mensaje original del error
    expect(body.error).not.toContain("Cannot read property");
  });

  it("usa pg_try_advisory_xact_lock con hashtext sobre la clave tenantId:automationId", async () => {
    configurarSesion();
    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([]),
    });

    mockTransaccionLockAdquirido();

    await app.request("/api/qlik/automatizaciones/auto-1/run", {
      method: "POST",
    });

    // Verificar que db.transaction fue llamado
    expect(mockDbTransaction).toHaveBeenCalledTimes(1);

    // Verificar que se ejecuta SQL dentro de la transacción (el advisory lock)
    const fnTransaccion = mockDbTransaction.mock.calls[0][0];
    const txMock = {
      execute: vi.fn().mockResolvedValue([{ adquirido: true }]),
    };
    await fnTransaccion(txMock);

    // La transacción debe ejecutar exactamente una consulta SQL (el advisory lock)
    expect(txMock.execute).toHaveBeenCalledTimes(1);

    // El argumento es un objeto SQL de drizzle con queryChunks que contiene
    // las partes del template literal (pg_try_advisory_xact_lock, hashtext)
    const sqlQuery = txMock.execute.mock.calls[0][0];
    expect(sqlQuery).toBeDefined();
    expect(sqlQuery.queryChunks).toBeDefined();

    // Serializar chunks a string para verificar el contenido SQL
    const sqlTexto = sqlQuery.queryChunks
      .map((chunk: unknown) =>
        typeof chunk === "string"
          ? chunk
          : typeof chunk === "object" && chunk !== null && "value" in chunk
            ? String((chunk as { value: unknown }).value)
            : "",
      )
      .join("");

    expect(sqlTexto).toContain("pg_try_advisory_xact_lock");
    expect(sqlTexto).toContain("hashtext");
  });
});

// ─── POST /:id/runs/:runId/stop ────────────────────────────────────────────

describe("POST /api/qlik/automatizaciones/:id/runs/:runId/stop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve 401 si no hay sesión", async () => {
    mockObtenerTenant.mockResolvedValue(null);

    const res = await app.request(
      "/api/qlik/automatizaciones/auto-1/runs/run-1/stop",
      { method: "POST" },
    );
    expect(res.status).toBe(401);
  });

  it("detiene la ejecución indicada", async () => {
    configurarSesion();
    const cliente = crearClienteMock();

    const res = await app.request(
      "/api/qlik/automatizaciones/auto-1/runs/run-1/stop",
      { method: "POST" },
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(cliente.detenerEjecucion).toHaveBeenCalledWith("auto-1", "run-1");
  });

  it("devuelve error de Qlik cuando stop falla", async () => {
    configurarSesion();
    crearClienteMock({
      detenerEjecucion: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/workflows/automations/auto-1/runs/run-999"),
      ),
    });

    const res = await app.request(
      "/api/qlik/automatizaciones/auto-1/runs/run-999/stop",
      { method: "POST" },
    );

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(404);
  });
});
