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
import { PaginaFlujos } from "@/modulos/flujos/pagina-flujos";

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

describe("PaginaFlujos", () => {
  it("muestra error inline y ofrece reintento al fallar la carga", async () => {
    fetchMock.mockResolvedValue(
      createErrorResponse(401, "Sesión requerida") as unknown as Response,
    );

    renderWithProviders(<PaginaFlujos />);

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

    renderWithProviders(<PaginaFlujos />);

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

    renderWithProviders(<PaginaFlujos />);

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

    renderWithProviders(<PaginaFlujos />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Error al cargar flujos");
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

    renderWithProviders(<PaginaFlujos />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(document.body.textContent).toContain("Error al cargar flujos");
    expect(
      document.querySelector('button[data-accion="reintentar"]'),
    ).not.toBeNull();
  });
});
