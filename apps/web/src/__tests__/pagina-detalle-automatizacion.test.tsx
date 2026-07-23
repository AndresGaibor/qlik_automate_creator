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
import { PaginaDetalleAutomatizacion } from "@/modulos/automatizaciones/pagina-detalle-automatizacion";

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

function mockFetchPorUrl(respuestas: Array<{ pattern: string; body: unknown }>) {
  fetchMock.mockImplementation(async (url: string) => {
    const match = respuestas.find((r) => url.includes(r.pattern));
    if (!match)
      return {
        ok: false,
        status: 404,
        json: () =>
          Promise.resolve({ success: false, error: "Not found" }),
      };
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve(match.body),
    } as unknown as Response;
  });
}

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

// --- Tests ---

describe("PaginaDetalleAutomatizacion", () => {
  it("renderiza metadata de la automatización", async () => {
    mockFetchPorUrl([
      {
        pattern: "/runs",
        body: { success: true, data: [] },
      },
      {
        pattern: "/auto-1",
        body: {
          success: true,
          data: {
            id: "auto-1",
            name: "Sync diario",
            spaceId: "space-abc",
            owner: { id: "usr-1", name: "Juan Pérez" },
            isEnabled: true,
            state: "Activa",
            triggerType: "scheduled",
            createdDate: "2026-06-01T08:00:00Z",
            modifiedDate: "2026-06-15T09:00:00Z",
          },
        },
      },
    ]);

    renderWithProviders(<PaginaDetalleAutomatizacion id="auto-1" />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(document.body.textContent).toContain("Sync diario");
    expect(document.body.textContent).toContain("Juan Pérez");
    expect(document.body.textContent).toContain("scheduled");
    expect(document.body.textContent).toContain("Activa");
  });

  it("muestra lista de ejecuciones recientes", async () => {
    mockFetchPorUrl([
      {
        pattern: "/runs",
        body: {
          success: true,
          data: [
            {
              id: "run-1",
              status: "completed",
              startTime: "2026-07-01T10:00:00Z",
              endTime: "2026-07-01T10:05:00Z",
            },
            {
              id: "run-2",
              status: "failed",
              startTime: "2026-07-02T10:00:00Z",
            },
          ],
        },
      },
      {
        pattern: "/auto-1",
        body: {
          success: true,
          data: {
            id: "auto-1",
            name: "Sync diario",
            isEnabled: true,
            createdDate: "2026-06-01T08:00:00Z",
            modifiedDate: "2026-06-15T09:00:00Z",
          },
        },
      },
    ]);

    renderWithProviders(<PaginaDetalleAutomatizacion id="auto-1" />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(document.body.textContent).toContain("completed");
    expect(document.body.textContent).toContain("failed");
    expect(document.body.textContent).toContain("run-1");
    expect(document.body.textContent).toContain("run-2");
  });

  it("muestra empty state cuando no hay ejecuciones", async () => {
    mockFetchPorUrl([
      {
        pattern: "/runs",
        body: { success: true, data: [] },
      },
      {
        pattern: "/auto-1",
        body: {
          success: true,
          data: {
            id: "auto-1",
            name: "Sync diario",
            isEnabled: true,
            createdDate: "2026-06-01T08:00:00Z",
            modifiedDate: "2026-06-15T09:00:00Z",
          },
        },
      },
    ]);

    renderWithProviders(<PaginaDetalleAutomatizacion id="auto-1" />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(document.body.textContent).toContain("No hay ejecuciones recientes");
  });

  it("botón ejecutar disponible cuando no hay ejecución activa", async () => {
    mockFetchPorUrl([
      {
        pattern: "/runs",
        body: { success: true, data: [] },
      },
      {
        pattern: "/auto-1",
        body: {
          success: true,
          data: {
            id: "auto-1",
            name: "Sync diario",
            isEnabled: true,
            ejecucionActiva: false,
            createdDate: "2026-06-01T08:00:00Z",
            modifiedDate: "2026-06-15T09:00:00Z",
          },
        },
      },
    ]);

    renderWithProviders(<PaginaDetalleAutomatizacion id="auto-1" />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    const botonEjecutar = container.querySelector(
      'button[data-accion="ejecutar"]',
    ) as HTMLButtonElement;
    expect(botonEjecutar).not.toBeNull();
    expect(botonEjecutar.disabled).toBe(false);
  });

  it("botón ejecutar deshabilitado cuando ejecucionActiva es true", async () => {
    mockFetchPorUrl([
      {
        pattern: "/runs",
        body: { success: true, data: [] },
      },
      {
        pattern: "/auto-1",
        body: {
          success: true,
          data: {
            id: "auto-1",
            name: "Sync diario",
            isEnabled: true,
            ejecucionActiva: true,
            createdDate: "2026-06-01T08:00:00Z",
            modifiedDate: "2026-06-15T09:00:00Z",
          },
        },
      },
    ]);

    renderWithProviders(<PaginaDetalleAutomatizacion id="auto-1" />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    const botonEjecutar = container.querySelector(
      'button[data-accion="ejecutar"]',
    ) as HTMLButtonElement;
    expect(botonEjecutar).not.toBeNull();
    expect(botonEjecutar.disabled).toBe(true);
  });

  it("botón detener disponible cuando hay ejecución activa", async () => {
    mockFetchPorUrl([
      {
        pattern: "/runs",
        body: {
          success: true,
          data: [
            {
              id: "run-1",
              status: "running",
              startTime: "2026-07-01T10:00:00Z",
            },
          ],
        },
      },
      {
        pattern: "/auto-1",
        body: {
          success: true,
          data: {
            id: "auto-1",
            name: "Sync diario",
            isEnabled: true,
            ejecucionActiva: true,
            createdDate: "2026-06-01T08:00:00Z",
            modifiedDate: "2026-06-15T09:00:00Z",
          },
        },
      },
    ]);

    renderWithProviders(<PaginaDetalleAutomatizacion id="auto-1" />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    const botonDetener = container.querySelector(
      'button[data-accion="detener"]',
    ) as HTMLButtonElement;
    expect(botonDetener).not.toBeNull();
    expect(botonDetener.disabled).toBe(false);
  });
});
