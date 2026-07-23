/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import { act } from "react";
import type React from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EstadoError } from "@/componentes/feedback/estado-error";
import {
  NotificacionesProvider,
  useNotificaciones,
} from "@/componentes/feedback/notificaciones";

// --- Test Setup ---

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot> | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (root) {
    act(() => {
      if (!root) throw new Error("Root not found");
      root.unmount();
    });
  }
  document.body.removeChild(container);
});

// --- Test Utilities ---

function renderWithProviders(children: ReactNode) {
  act(() => {
    root = createRoot(container);
    root.render(<NotificacionesProvider>{children}</NotificacionesProvider>);
  });
}

function renderSimple(element: React.ReactElement) {
  act(() => {
    root = createRoot(container);
    root.render(element);
  });
}

// --- Trigger Component ---

function TriggerError() {
  const { mostrarError } = useNotificaciones();
  return (
    <button type="button" onClick={() => mostrarError("No se pudo cargar")}>
      Mostrar error
    </button>
  );
}

// --- Tests ---

describe("feedback system", () => {
  it("muestra un toast accesible y permite cerrarlo", async () => {
    renderWithProviders(<TriggerError />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const button = container.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    expect(button?.textContent).toBe("Mostrar error");

    await act(async () => {
      if (!button) throw new Error("Button not found");
      button.click();
    });

    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).not.toBeNull();
    expect(alertEl?.textContent).toContain("No se pudo cargar");

    const cerrarBtn = alertEl?.querySelector(
      "button",
    ) as HTMLButtonElement | null;
    expect(cerrarBtn).not.toBeNull();
    expect(cerrarBtn?.textContent).toBe("×");

    await act(async () => {
      if (!cerrarBtn) throw new Error("Cerrar button not found");
      cerrarBtn.click();
    });

    const alertAfterClose = container.querySelector('[role="alert"]');
    expect(alertAfterClose).toBeNull();
  });

  it("muestra error inline y reintenta", async () => {
    const reintentar = vi.fn();

    renderSimple(
      <EstadoError mensaje="Sesión requerida" onReintentar={reintentar} />,
    );
    await act(async () => {});

    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).not.toBeNull();
    expect(alertEl?.textContent).toContain("Sesión requerida");

    const reintentarBtn = alertEl?.querySelector(
      "button",
    ) as HTMLButtonElement | null;
    expect(reintentarBtn).not.toBeNull();
    expect(reintentarBtn?.textContent).toBe("Reintentar");

    await act(async () => {
      if (!reintentarBtn) throw new Error("Reintentar button not found");
      reintentarBtn.click();
    });

    expect(reintentar).toHaveBeenCalledOnce();
  });

  it("auto-cierra toast después de 5000 ms con fake timers", async () => {
    vi.useFakeTimers();

    renderWithProviders(<TriggerError />);
    await act(async () => {});

    const button = container.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement | null;
    expect(button).not.toBeNull();

    await act(async () => {
      if (!button) throw new Error("Button not found");
      button.click();
    });

    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).not.toBeNull();
    expect(alertEl?.textContent).toContain("No se pudo cargar");

    // Avanzar el tiempo 5000ms
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    const alertAfterAutoClose = container.querySelector('[role="alert"]');
    expect(alertAfterAutoClose).toBeNull();

    vi.useRealTimers();
  });

  it("limpia timeouts al desmontar provider (cleanup on unmount)", async () => {
    const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

    renderWithProviders(<TriggerError />);
    await act(async () => {});

    const button = container.querySelector(
      'button[type="button"]',
    ) as HTMLButtonElement | null;
    expect(button).not.toBeNull();

    // Mostrar varios toasts
    await act(async () => {
      if (!button) throw new Error("Button not found");
      button.click();
    });
    await act(async () => {
      if (!button) throw new Error("Button not found");
      button.click();
    });

    const alerts = container.querySelectorAll('[role="alert"]');
    expect(alerts.length).toBe(2);

    // Desmontar el provider
    await act(async () => {
      if (!root) throw new Error("Root not found");
      root.unmount();
    });

    // Verificar que se llamaron clearTimeout para cada toast
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it("EstadoError no muestra botón Reintentar si no recibe onReintentar", async () => {
    renderSimple(<EstadoError mensaje="Error sin reintento" />);
    await act(async () => {});

    const alertEl = container.querySelector('[role="alert"]');
    expect(alertEl).not.toBeNull();
    expect(alertEl?.textContent).toContain("Error sin reintento");

    const reintentarBtn = alertEl?.querySelector("button");
    expect(reintentarBtn).toBeNull();
  });
});
