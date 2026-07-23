/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { NotificacionesProvider } from "@/componentes/feedback/notificaciones";
import { PaginaAutomatizaciones } from "@/modulos/automatizaciones/pagina-automatizaciones";

// --- Test Setup ---

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot> | null = null;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  if (root) {
    const rootRef = root;
    act(() => {
      rootRef.unmount();
    });
  }
  document.body.removeChild(container);
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

// --- Test Utilities ---

function renderWithProviders(children: ReactNode) {
  const clienteQuery = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  act(() => {
    root = createRoot(container);
    root.render(
      <QueryClientProvider client={clienteQuery}>
        <NotificacionesProvider>{children}</NotificacionesProvider>
      </QueryClientProvider>,
    );
  });
}

function createErrorResponse(status: number, errorMessage: string) {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({ success: false, error: errorMessage }),
  };
}

// --- Tests ---

describe("PaginaAutomatizaciones", () => {
  it("muestra error inline y ofrece reintento al fallar la carga", async () => {
    fetchMock.mockResolvedValue(
      createErrorResponse(401, "Sesión requerida") as unknown as Response,
    );

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Sesión requerida");
    expect(
      document.querySelector('button[data-accion="reintentar"]'),
    ).not.toBeNull();
  });

  it("llama a fetch al hacer clic en Reintentar y muestra un segundo toast real (no dedup por mensaje)", async () => {
    vi.useFakeTimers();

    fetchMock.mockResolvedValue(
      createErrorResponse(401, "Sesión requerida") as unknown as Response,
    );

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(document.body.textContent).toContain("Sesión requerida");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    const alertasAfterAutoClose = container.querySelectorAll('[role="alert"]');
    expect(alertasAfterAutoClose.length).toBe(1);

    fetchMock.mockResolvedValue(
      createErrorResponse(401, "Sesión requerida") as unknown as Response,
    );

    const reintentarBtn = document.querySelector(
      'button[data-accion="reintentar"]',
    ) as HTMLButtonElement;
    await act(async () => {
      reintentarBtn.click();
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const alertasDespues = container.querySelectorAll('[role="alert"]');
    expect(alertasDespues.length).toBe(2);
  });

  it("muestra toast para errores con mensajes distintos", async () => {
    fetchMock.mockResolvedValue(
      createErrorResponse(401, "Sesión requerida") as unknown as Response,
    );

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Sesión requerida");

    fetchMock.mockResolvedValue(
      createErrorResponse(
        500,
        "Error interno del servidor",
      ) as unknown as Response,
    );

    const reintentarBtn = document.querySelector(
      'button[data-accion="reintentar"]',
    ) as HTMLButtonElement;
    await act(async () => {
      reintentarBtn.click();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Error interno del servidor");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("usa fallback estable cuando json() es rechazado", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 0,
      json: () => Promise.reject(new Error("Failed to parse JSON")),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain(
      "Error al cargar automatizaciones",
    );
    expect(
      document.querySelector('button[data-accion="reintentar"]'),
    ).not.toBeNull();
  });

  it("usa fallback estable cuando success:false sin campo error", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: false }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain(
      "Error al cargar automatizaciones",
    );
    expect(
      document.querySelector('button[data-accion="reintentar"]'),
    ).not.toBeNull();
  });

  it("renderiza automatizaciones con payload real del backend", async () => {
    const payload = [
      {
        id: "auto-1",
        name: "Sync diario",
        spaceId: "space-abc",
        espacioNombre: "Espacio Producción",
        ownerNombre: "Juan Pérez",
        isEnabled: true,
        triggerType: "scheduled",
        ejecucionActiva: false,
        puedeEjecutar: true,
        creadoEn: "2026-06-01T08:00:00Z",
        modificadoEn: "2026-06-15T09:00:00Z",
      },
      {
        id: "auto-2",
        name: "Backup semanal",
        espacioNombre: "Sin espacio",
        ownerNombre: "Admin",
        isEnabled: false,
        triggerType: "manual",
        ejecucionActiva: false,
        puedeEjecutar: false,
        creadoEn: "2026-05-01T08:00:00Z",
        modificadoEn: "2026-05-01T08:00:00Z",
      },
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: payload }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Nombres
    expect(document.body.textContent).toContain("Sync diario");
    expect(document.body.textContent).toContain("Backup semanal");

    // Estados derivados
    expect(document.body.textContent).toContain("Estado: Activa");
    expect(document.body.textContent).toContain("Estado: Inactiva");

    // Disparadores
    expect(document.body.textContent).toContain("Disparador: scheduled");
    expect(document.body.textContent).toContain("Disparador: manual");

    // Espacios con nombre (no ID)
    expect(document.body.textContent).toContain("Espacio: Espacio Producción");
    expect(document.body.textContent).toContain("Espacio: Sin espacio");

    // Propietarios
    expect(document.body.textContent).toContain("Propietario: Juan Pérez");
    expect(document.body.textContent).toContain("Propietario: Admin");

    // Fechas
    expect(document.body.textContent).toContain("Creado:");
    expect(document.body.textContent).toContain("Modificado:");

    // Botones de acción
    const botones = container.querySelectorAll("button");
    const textos = Array.from(botones).map((b) => b.textContent);
    expect(textos.filter((t) => t?.includes("Ejecutar")).length).toBe(2);
    expect(textos.filter((t) => t?.includes("Editar")).length).toBe(2);
  });

  it("muestra espacio, fechas y enlace a detalle en cada tarjeta", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-1",
              name: "Sync diario",
              espacioNombre: "Espacio Producción",
              ownerNombre: "Juan Pérez",
              isEnabled: true,
              triggerType: "scheduled",
              ejecucionActiva: false,
              puedeEjecutar: true,
              creadoEn: "2026-06-01T08:00:00Z",
              modificadoEn: "2026-06-15T09:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Espacio: Espacio Producción");
    expect(document.body.textContent).toContain("Juan Pérez");
    expect(document.body.textContent).toContain("Creado:");
    expect(document.body.textContent).toContain("Modificado:");

    const enlaceDetalle = container.querySelector(
      'a[href="/automatizaciones/auto-1"]',
    );
    expect(enlaceDetalle).not.toBeNull();
  });

  it("deshabilita el botón ejecutar cuando ejecucionActiva es true", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-1",
              name: "Sync activo",
              espacioNombre: "Espacio A",
              ownerNombre: "Test",
              isEnabled: true,
              triggerType: "scheduled",
              ejecucionActiva: true,
              puedeEjecutar: false,
              creadoEn: "2026-06-01T08:00:00Z",
              modificadoEn: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const botonEjecutar = container.querySelector(
      'button[data-accion="ejecutar"]',
    ) as HTMLButtonElement;
    expect(botonEjecutar).not.toBeNull();
    expect(botonEjecutar.disabled).toBe(true);
    expect(botonEjecutar.textContent).toContain("En ejecución");
  });

  it("deshabilita el botón ejecutar cuando puedeEjecutar es false", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-1",
              name: "Inhabilitada",
              espacioNombre: "Espacio A",
              ownerNombre: "Test",
              isEnabled: false,
              triggerType: "manual",
              ejecucionActiva: false,
              puedeEjecutar: false,
              creadoEn: "2026-06-01T08:00:00Z",
              modificadoEn: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const botonEjecutar = container.querySelector(
      'button[data-accion="ejecutar"]',
    ) as HTMLButtonElement;
    expect(botonEjecutar).not.toBeNull();
    expect(botonEjecutar.disabled).toBe(true);
  });

  it("muestra empty state cuando la API devuelve data vacía", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: [] }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain(
      "No hay automatizaciones para mostrar.",
    );
    expect(document.body.textContent).toContain("Automatizaciones");
    expect(container.querySelector("[data-accion='reintentar']")).toBeNull();
  });

  it("muestra empty state cuando data es undefined en la respuesta", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain(
      "No hay automatizaciones para mostrar.",
    );
  });

  it("muestra fallback seguro para fechas vacías o inválidas", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-bad-dates",
              name: "Fechas rotas",
              espacioNombre: "Espacio X",
              ownerNombre: "Test",
              isEnabled: true,
              triggerType: "manual",
              ejecucionActiva: false,
              puedeEjecutar: true,
              creadoEn: "",
              modificadoEn: "not-a-date",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Fechas inválidas deben mostrar "—" en vez de "Invalid Date"
    expect(document.body.textContent).not.toContain("Invalid Date");
    expect(document.body.textContent).toContain("Fechas rotas");
  });

  it("no muestra spaceId como espacio cuando existe espacioNombre", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-1",
              name: "Con espacio",
              spaceId: "sp-12345",
              espacioNombre: "Mi Espacio",
              ownerNombre: "Test",
              isEnabled: true,
              triggerType: "manual",
              ejecucionActiva: false,
              puedeEjecutar: true,
              creadoEn: "2026-06-01T08:00:00Z",
              modificadoEn: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Espacio: Mi Espacio");
    expect(document.body.textContent).not.toContain("sp-12345");
  });
});
