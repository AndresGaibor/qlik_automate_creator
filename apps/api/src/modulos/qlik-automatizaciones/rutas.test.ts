import { afterEach, beforeEach, describe, expect, it, vi } from "bun:test";
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

  it("resuelve espacioNombre vía obtenerEspacio cuando el espacio no está en listarEspacios", async () => {
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
    // obtenerEspacio mock returns { id, name: "Espacio ${id}" }
    expect(body.data[0].espacioNombre).toBe("Espacio esp-inexistente");
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

  it("no rompe cuando obtenerUsuario resuelve sin name", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-empty-user",
          name: "Auto Empty User",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-empty",
        },
      ]),
      obtenerUsuario: vi.fn().mockResolvedValue({ id: "usr-empty" }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data[0].ownerNombre).toBe("usr-empty");
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
    // Debe solicitar fields=name,email,subject
    expect(obtenerUsuarioMock).toHaveBeenCalledWith("usr-shared", "name,email,subject");
  });

  it("resuelve espacioNombre con obtenerEspacio cuando listarEspacios no incluye el spaceId", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-orf",
          name: "Auto ORF",
          spaceId: "esp-orf",
          state: "available",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].espacioNombre).toBe("Espacio esp-orf");
  });

  it("no rompe cuando obtenerEspacio falla para un espacio faltante", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-fail-space",
          name: "Auto Fail Space",
          spaceId: "esp-fail",
          state: "available",
        },
      ]),
      listarEspacios: vi.fn().mockResolvedValue([]),
      obtenerEspacio: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/spaces/esp-fail"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    // Fallback al spaceId cuando tanto bulk como individual fallan
    expect(body.data[0].espacioNombre).toBe("esp-fail");
  });

  it("resuelve espacios con obtenerEspacio cuando listarEspacios falla", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(500, "Internal Server Error", "/api/v1/spaces"),
      ),
      obtenerEspacio: vi.fn().mockResolvedValue({
        id: "esp-orf2",
        name: "Espacio Individual",
      }),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-orf2",
          name: "Auto ORF2",
          spaceId: "esp-orf2",
          state: "available",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data[0].espacioNombre).toBe("Espacio Individual");
  });

  it("deduplica spaceId al resolver espacios (no llama obtenerEspacio dos veces para el mismo ID)", async () => {
    configurarSesion();
    const obtenerEspacioMock = vi.fn().mockImplementation((id: string) =>
      Promise.resolve({ id, name: `Espacio ${id}` }),
    );
    crearClienteMock({
      listarEspacios: vi.fn().mockResolvedValue([]),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-a",
          name: "Auto A",
          spaceId: "esp-shared",
          state: "available",
        },
        {
          id: "auto-b",
          name: "Auto B",
          spaceId: "esp-shared",
          state: "available",
        },
      ]),
      obtenerEspacio: obtenerEspacioMock,
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    // Solo debe llamar una vez para esp-shared (deduplicado)
    expect(obtenerEspacioMock).toHaveBeenCalledTimes(1);
    expect(obtenerEspacioMock).toHaveBeenCalledWith("esp-shared");
  });

  it("resuelve ownerNombre desde email cuando name no está disponible", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-email",
          name: "Auto Email",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-email",
        },
      ]),
      obtenerUsuario: vi.fn().mockResolvedValue({
        id: "usr-email",
        email: "juan@example.com",
      }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].ownerNombre).toBe("juan@example.com");
  });

  it("resuelve ownerNombre desde subject cuando name y email no están disponibles", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-subject",
          name: "Auto Subject",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-subject",
        },
      ]),
      obtenerUsuario: vi.fn().mockResolvedValue({
        id: "usr-subject",
        subject: "uid:usr-subject:subject",
      }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].ownerNombre).toBe("uid:usr-subject:subject");
  });

  it("prioriza name sobre email y subject en la resolución de usuario", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-priority",
          name: "Auto Priority",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-priority",
        },
      ]),
      obtenerUsuario: vi.fn().mockResolvedValue({
        id: "usr-priority",
        name: "Nombre Real",
        email: "nombre@example.com",
        subject: "uid:usr-priority:subject",
      }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    const body = await res.json();
    expect(body.data[0].ownerNombre).toBe("Nombre Real");
  });

  it("devuelve 404 cuando listarAutomatizaciones devuelve 404", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/workflows/automations"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(404);
  });

  it("devuelve 403 cuando listarAutomatizaciones devuelve 403", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/workflows/automations"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(403);
  });

  it("devuelve 502 cuando listarAutomatizaciones devuelve error de servidor", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(500, "Internal Server Error", "/api/workflows/automations"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.qlikStatus).toBe(500);
  });

  it("devuelve 200 con datos degradados cuando listarEspacios falla pero listarAutomatizaciones funciona", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/spaces"),
      ),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          ...MockAutomatizaciones[0],
          spaceId: "esp-1",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
    // Intenta resolver espacio individualmente
    expect(body.data[0].espacioNombre).toBe("Espacio esp-1");
  });

  it("devuelve 200 con ID fallback cuando obtenerUsuario devuelve 403 en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-403-u",
          name: "Auto 403 User",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-403",
        },
      ]),
      obtenerUsuario: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/users/usr-403"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Fallback al ownerId cuando la resolución falla por 403
    expect(body.data[0].ownerNombre).toBe("usr-403");
  });

  it("devuelve 200 con ID fallback cuando obtenerUsuario devuelve 404 en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-404-u",
          name: "Auto 404 User",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-404",
        },
      ]),
      obtenerUsuario: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/v1/users/usr-404"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Fallback al ownerId cuando la resolución falla por 404
    expect(body.data[0].ownerNombre).toBe("usr-404");
  });

  it("devuelve 200 con ID fallback cuando obtenerEspacio devuelve 403 en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockResolvedValue([]),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-403-s",
          name: "Auto 403 Space",
          spaceId: "esp-403",
          state: "available",
        },
      ]),
      obtenerEspacio: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/spaces/esp-403"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Fallback al spaceId cuando la resolución falla por 403
    expect(body.data[0].espacioNombre).toBe("esp-403");
  });

  it("devuelve 200 con ID fallback cuando obtenerEspacio devuelve 404 en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockResolvedValue([]),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-404-s",
          name: "Auto 404 Space",
          spaceId: "esp-404",
          state: "available",
        },
      ]),
      obtenerEspacio: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/v1/spaces/esp-404"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Fallback al spaceId cuando la resolución falla por 404
    expect(body.data[0].espacioNombre).toBe("esp-404");
  });

  it("devuelve 200 con ID fallback cuando obtenerUsuario resuelve con nombre vacio en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-empty-name",
          name: "Auto Empty Name",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-empty-name",
        },
      ]),
      obtenerUsuario: vi.fn().mockResolvedValue({ id: "usr-empty-name", name: "" }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Fallback al ownerId cuando name esta vacio
    expect(body.data[0].ownerNombre).toBe("usr-empty-name");
  });

  it("devuelve 200 con ID fallback cuando obtenerEspacio resuelve con nombre vacio en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockResolvedValue([]),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-empty-space-name",
          name: "Auto Empty Space Name",
          spaceId: "esp-empty",
          state: "available",
        },
      ]),
      obtenerEspacio: vi.fn().mockResolvedValue({ id: "esp-empty", name: "" }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Fallback al spaceId cuando name esta vacio
    expect(body.data[0].espacioNombre).toBe("esp-empty");
  });

  it("devuelve 200 con ID fallback cuando listarEspacios devuelve espacios con name: \"\"", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockResolvedValue([
        { id: "esp-blank", name: "", type: "shared" as const, owner: { id: "o1", name: "Owner" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
      ]),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-blank-list-space",
          name: "Auto Blank List Space",
          spaceId: "esp-blank",
          state: "available",
        },
      ]),
      obtenerEspacio: vi.fn().mockResolvedValue({ id: "esp-blank", name: "" }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Espacio con name "" no se almacena en mapa (ni bulk ni individual) → fallback a spaceId
    expect(body.data[0].espacioNombre).toBe("esp-blank");
  });

  it("devuelve 200 con ID fallback cuando listarEspacios devuelve espacios con name: \"   \" (whitespace)", async () => {
    configurarSesion();
    crearClienteMock({
      listarEspacios: vi.fn().mockResolvedValue([
        { id: "esp-blank-ws", name: "  \t\n  ", type: "shared" as const, owner: { id: "o1", name: "Owner" }, createdDate: "2024-01-01", modifiedDate: "2024-01-01" },
      ]),
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-blank-list-space-ws",
          name: "Auto Blank List Space WS",
          spaceId: "esp-blank-ws",
          state: "available",
        },
      ]),
      obtenerEspacio: vi.fn().mockResolvedValue({ id: "esp-blank-ws", name: "   " }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data[0].espacioNombre).toBe("esp-blank-ws");
  });

  it("devuelve 200 con ID fallback cuando owner.name legacy es \"\" en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-blank-owner-legacy",
          name: "Auto Blank Owner Legacy",
          spaceId: "esp-1",
          owner: { id: "usr-blank-legacy", name: "" },
          isEnabled: true,
          triggerType: "scheduled",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // owner.name "" → normalizado → undefined → fallback a ownerId
    expect(body.data[0].ownerNombre).toBe("usr-blank-legacy");
  });

  it("devuelve 200 con ID fallback cuando owner.name legacy es \"   \" (whitespace) en list", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-blank-owner-legacy-ws",
          name: "Auto Blank Owner Legacy WS",
          spaceId: "esp-1",
          owner: { id: "usr-blank-legacy-ws", name: "  \n" },
          isEnabled: true,
          triggerType: "scheduled",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data[0].ownerNombre).toBe("usr-blank-legacy-ws");
  });

  it("usa email cuando name es '   ' (whitespace) y email presente — no bloqueado por name", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-ws-name-email",
          name: "Auto WS Name Email",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-ws-name",
        },
      ]),
      obtenerUsuario: vi.fn().mockResolvedValue({
        id: "usr-ws-name",
        name: "  \t",
        email: "juan@example.com",
      }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // name whitespace → normalizado → undefined → cae a email
    expect(body.data[0].ownerNombre).toBe("juan@example.com");
  });

  it("usa subject cuando name y email son whitespace y subject presente", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-ws-name-no-email",
          name: "Auto WS Name No Email",
          spaceId: "esp-1",
          state: "available",
          ownerId: "usr-ws-no-email",
        },
      ]),
      obtenerUsuario: vi.fn().mockResolvedValue({
        id: "usr-ws-no-email",
        name: "  ",
        email: "",
        subject: "uid:usr-ws-no-email:subject",
      }),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data[0].ownerNombre).toBe("uid:usr-ws-no-email:subject");
  });

  it("cae a Sin propietario cuando owner.id es whitespace y no hay otro owner info", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-ws-owner-id",
          name: "Auto WS Owner ID",
          spaceId: "esp-1",
          owner: { id: "  ", name: "" },
          isEnabled: true,
          triggerType: "manual",
        },
      ]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // owner.name blank → undefined; owner.id whitespace → undefined → "Sin propietario"
    expect(body.data[0].ownerNombre).toBe("Sin propietario");
  });

  it("devuelve Sin espacio cuando spaceId es whitespace y no hay otro espacio info", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockResolvedValue([
        {
          id: "auto-ws-spaceid",
          name: "Auto WS SpaceId",
          spaceId: "  \t",
          state: "available",
          ownerId: "usr-1",
        },
      ]),
      listarEspacios: vi.fn().mockResolvedValue([]),
    });

    const res = await app.request("/api/qlik/automatizaciones");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // spaceId whitespace → normalizado → "Sin espacio"
    expect(body.data[0].espacioNombre).toBe("Sin espacio");
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

  it("devuelve 200 con ID fallback cuando obtenerUsuario devuelve 403 en detalle", async () => {
    configurarSesion();
    const mockDetalle = {
      id: "auto-403-detail",
      name: "Auto 403 Detail",
      spaceId: "esp-1",
      state: "available",
      ownerId: "usr-403-detail",
    };

    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockResolvedValue(mockDetalle),
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
      obtenerUsuario: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/users/usr-403-detail"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-403-detail");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.automatizacion.ownerNombre).toBe("usr-403-detail");
  });

  it("devuelve 200 con ID fallback cuando obtenerUsuario devuelve 404 en detalle", async () => {
    configurarSesion();
    const mockDetalle = {
      id: "auto-404-detail",
      name: "Auto 404 Detail",
      spaceId: "esp-1",
      state: "available",
      ownerId: "usr-404-detail",
    };

    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockResolvedValue(mockDetalle),
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
      obtenerUsuario: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/v1/users/usr-404-detail"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-404-detail");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.automatizacion.ownerNombre).toBe("usr-404-detail");
  });

  it("devuelve 200 con ID fallback cuando obtenerEspacio devuelve 403 en detalle", async () => {
    configurarSesion();
    const mockDetalle = {
      id: "auto-403-s-detail",
      name: "Auto 403 Space Detail",
      spaceId: "esp-403-detail",
      state: "available",
    };

    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockResolvedValue(mockDetalle),
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      listarEspacios: vi.fn().mockResolvedValue([]),
      obtenerEspacio: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/v1/spaces/esp-403-detail"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-403-s-detail");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.automatizacion.espacioNombre).toBe("esp-403-detail");
  });

  it("devuelve 200 con ID fallback cuando obtenerEspacio devuelve 404 en detalle", async () => {
    configurarSesion();
    const mockDetalle = {
      id: "auto-404-s-detail",
      name: "Auto 404 Space Detail",
      spaceId: "esp-404-detail",
      state: "available",
    };

    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockResolvedValue(mockDetalle),
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      listarEspacios: vi.fn().mockResolvedValue([]),
      obtenerEspacio: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/v1/spaces/esp-404-detail"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones/auto-404-s-detail");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.automatizacion.espacioNombre).toBe("esp-404-detail");
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

// ─── Logging contextual ────────────────────────────────────────────────────

describe("Logging contextual en errores", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  const JSON_PARSE_RE = /\{.*\}/;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("registra error de Qlik con ruta, metodo, qlikStatus y endpoint", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/workflows/automations"),
      ),
    });

    await app.request("/api/qlik/automatizaciones");

    expect(consoleErrorSpy).toHaveBeenCalled();
    const primerArg = consoleErrorSpy.mock.calls[0][0];
    expect(primerArg).toBe("Qlik API error:");

    const segundoArg = JSON.parse(consoleErrorSpy.mock.calls[0][1] as string);
    expect(segundoArg.ruta).toBe("/api/qlik/automatizaciones");
    expect(segundoArg.metodo).toBe("GET");
    expect(segundoArg.qlikStatus).toBe(403);
    expect(segundoArg.endpoint).toBe("/api/workflows/automations");
  });

  it("registra contexto adicional (automationId) en GET /:id", async () => {
    configurarSesion();
    crearClienteMock({
      obtenerAutomatizacion: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(404, "Not Found", "/api/workflows/automations/auto-X"),
      ),
      listarEspacios: vi.fn().mockResolvedValue(MockEspacios),
    });

    await app.request("/api/qlik/automatizaciones/auto-X");

    expect(consoleErrorSpy).toHaveBeenCalled();
    const segundoArg = JSON.parse(consoleErrorSpy.mock.calls[0][1] as string);
    expect(segundoArg.seccion).toBe("detalle");
    expect(segundoArg.automationId).toBe("auto-X");
    expect(segundoArg.qlikStatus).toBe(404);
  });

  it("registra error no-Qlik con stack trace sin exponerlo al cliente", async () => {
    configurarSesion();
    crearClienteMock({
      listarAutomatizaciones: vi.fn().mockRejectedValue(
        new Error("TypeError: cannot read property of undefined"),
      ),
    });

    const res = await app.request("/api/qlik/automatizaciones");

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Error interno del servidor");
    expect(body.error).not.toContain("TypeError");

    expect(consoleErrorSpy).toHaveBeenCalled();
    const primerArg = consoleErrorSpy.mock.calls[0][0];
    expect(primerArg).toBe("Error inesperado en rutas Qlik:");
    const segundoArg = JSON.parse(consoleErrorSpy.mock.calls[0][1] as string);
    expect(segundoArg.mensaje).toContain("TypeError");
    expect(segundoArg.stack).toBeDefined();
    expect(segundoArg.ruta).toBe("/api/qlik/automatizaciones");
  });

  it("registra seccion=ejecutar y automationId en POST /:id/run", async () => {
    configurarSesion();
    mockTransaccionLockAdquirido();
    crearClienteMock({
      listarEjecuciones: vi.fn().mockResolvedValue([]),
      ejecutarAutomatizacion: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(403, "Forbidden", "/api/workflows/automations/auto-R/runs"),
      ),
    });

    await app.request("/api/qlik/automatizaciones/auto-R/run", { method: "POST" });

    expect(consoleErrorSpy).toHaveBeenCalled();
    const segundoArg = JSON.parse(consoleErrorSpy.mock.calls[0][1] as string);
    expect(segundoArg.seccion).toBe("ejecutar");
    expect(segundoArg.automationId).toBe("auto-R");
  });

  it("registra seccion=detener con automationId y runId en POST /:id/runs/:runId/stop", async () => {
    configurarSesion();
    crearClienteMock({
      detenerEjecucion: vi.fn().mockRejectedValue(
        new QlikApiErrorCls(500, "Internal Server Error", "/api/workflows/automations/auto-S/runs/run-1/actions/stop"),
      ),
    });

    await app.request("/api/qlik/automatizaciones/auto-S/runs/run-1/stop", { method: "POST" });

    expect(consoleErrorSpy).toHaveBeenCalled();
    const segundoArg = JSON.parse(consoleErrorSpy.mock.calls[0][1] as string);
    expect(segundoArg.seccion).toBe("detener");
    expect(segundoArg.automationId).toBe("auto-S");
    expect(segundoArg.runId).toBe("run-1");
    expect(segundoArg.qlikStatus).toBe(500);
  });
});
