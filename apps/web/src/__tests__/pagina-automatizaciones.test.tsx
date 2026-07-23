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
    // Use fake timers to advance past first toast's auto-close
    vi.useFakeTimers();

    // First fetch fails
    fetchMock.mockResolvedValue(
      createErrorResponse(401, "Sesión requerida") as unknown as Response,
    );

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(document.body.textContent).toContain("Sesión requerida");

    // Let first toast auto-close (5000ms) so it doesn't overlap with second
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    // After auto-close: only EstadoError remains (1 alert)
    const alertasAfterAutoClose = container.querySelectorAll('[role="alert"]');
    expect(alertasAfterAutoClose.length).toBe(1); // only EstadoError

    // Click reintentar - second fetch also fails with SAME message
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

    // Verify fetch was called at least twice (initial + retry)
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Verify second toast appeared (EstadoError + toast2 = 2)
    const alertasDespues = container.querySelectorAll('[role="alert"]');
    expect(alertasDespues.length).toBe(2); // EstadoError + toast2
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

    // Click reintentar - second fetch fails with DIFFERENT message
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
    // json() rejects - network error or malformed response
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
    // API returns { success: false } without error field
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

  it("renderiza automatizaciones con payload real de Qlik", async () => {
    const automatizacionesQlik = [
      {
        id: "auto-1",
        name: "Sync diario",
        spaceId: "space-abc",
        owner: { id: "usr-1", name: "Juan Pérez" },
        isEnabled: true,
        state: "Activa",
        triggerType: "scheduled",
        lastExecution: {
          id: "run-1",
          status: "completed",
          startTime: "2026-07-01T10:00:00Z",
        },
        createdDate: "2026-06-01T08:00:00Z",
        modifiedDate: "2026-06-15T09:00:00Z",
      },
      {
        id: "auto-2",
        name: "Backup semanal",
        isEnabled: false,
        triggerType: "manual",
        createdDate: "2026-05-01T08:00:00Z",
        modifiedDate: "2026-05-01T08:00:00Z",
      },
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({ success: true, data: automatizacionesQlik }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Nombres de automatizaciones
    expect(document.body.textContent).toContain("Sync diario");
    expect(document.body.textContent).toContain("Backup semanal");

    // Estados derivados: state tiene prioridad, luego isEnabled
    expect(document.body.textContent).toContain("Estado: Activa");
    expect(document.body.textContent).toContain("Estado: Inactiva");

    // Disparadores derivados de triggerType
    expect(document.body.textContent).toContain("Disparador: scheduled");
    expect(document.body.textContent).toContain("Disparador: manual");

    // Propietario (solo presente en la primera)
    expect(document.body.textContent).toContain("Juan Pérez");

    // Última ejecución (solo presente en la primera)
    expect(document.body.textContent).toContain("Última ejecución:");
    expect(document.body.textContent).toContain("completed");

    // Botones de acción
    const botones = container.querySelectorAll("button");
    const textos = Array.from(botones).map((b) => b.textContent);
    expect(textos.filter((t) => t?.includes("Ejecutar")).length).toBe(2);
    expect(textos.filter((t) => t?.includes("Editar")).length).toBe(2);
  });

  it("muestra 'Manual' como disparador cuando triggerType, trigger y runMode son undefined", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-sin-trigger",
              name: "Sin triggers",
              isEnabled: true,
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Disparador: Manual");
  });

  it("muestra 'Manual' cuando triggerType es string vacío", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-empty",
              name: "Trigger vacío",
              isEnabled: true,
              triggerType: "",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Disparador: Manual");
  });

  it("deriva disparador desde trigger.type cuando triggerType no existe", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-trigger-obj",
              name: "Con trigger object",
              isEnabled: true,
              trigger: { type: "event" },
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Disparador: event");
  });

  it("deriva disparador desde runMode cuando triggerType y trigger no existen", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-runmode",
              name: "Con runMode",
              isEnabled: true,
              runMode: "nonblocking",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Disparador: nonblocking");
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

    // No debe haber tarjetas con automatizaciones
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

  it("usa lastRunStatus como fallback cuando isEnabled no está en el payload", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-running",
              name: "En proceso",
              lastRunStatus: "running",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
            {
              id: "auto-failed",
              name: "Con error",
              lastRunStatus: "failed",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
            {
              id: "auto-pending",
              name: "En cola",
              lastRunStatus: "pending",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
            {
              id: "auto-success",
              name: "Completada",
              lastRunStatus: "success",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Estado: En ejecución");
    expect(document.body.textContent).toContain("Estado: Error");
    expect(document.body.textContent).toContain("Estado: En espera");
    expect(document.body.textContent).toContain("Estado: Activa");
  });

  it("muestra Desconocido cuando no hay state, isEnabled ni lastRunStatus válido", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-unknown",
              name: "Sin datos de estado",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Estado: Desconocido");
  });

  it("muestra el valor de state directamente cuando está presente", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-state",
              name: "Con state explícito",
              state: "Pausada",
              isEnabled: true,
              lastRunStatus: "completed",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // state tiene prioridad sobre isEnabled y lastRunStatus
    expect(document.body.textContent).toContain("Estado: Pausada");
  });

  it("fallback a isEnabled cuando state es string vacío", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-empty-state",
              name: "State vacío",
              state: "   ",
              isEnabled: false,
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Estado: Inactiva");
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
              spaceId: "space-abc",
              owner: { id: "usr-1", name: "Juan Pérez" },
              isEnabled: true,
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-15T09:00:00Z",
            },
          ],
        }),
    } as unknown as Response);

    renderWithProviders(<PaginaAutomatizaciones />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Espacio: space-abc");
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
              isEnabled: true,
              ejecucionActiva: true,
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
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

  it("deshabilita el botón ejecutar cuando state indica ejecución en curso", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          success: true,
          data: [
            {
              id: "auto-1",
              name: "Corriendo",
              isEnabled: true,
              state: "running",
              createdDate: "2026-06-01T08:00:00Z",
              modifiedDate: "2026-06-01T08:00:00Z",
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
});
