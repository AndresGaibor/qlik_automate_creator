import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NotificacionesProvider } from "@/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const routerPath = join(import.meta.dirname, "./pagina-login.tsx");
const contenidoPaginaLogin = readFileSync(routerPath, "utf-8");

describe("PaginaLogin OAuth Error Handling", () => {
  describe("Manejo de oauth_error en URL", () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // Mock window.location con search
      Object.defineProperty(window, "location", {
        value: {
          search: "?oauth_error=identity_scope_error",
          replace: vi.fn(),
        },
        writable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, "location", {
        value: originalLocation,
        writable: true,
      });
      vi.restoreAllMocks();
    });

    it("RED: debe mostrar toast cuando oauth_error está en URL", async () => {
      const { PaginaLogin } = await import("./pagina-login");
      const container = document.createElement("div");
      document.body.appendChild(container);

      const clienteQuery = new QueryClient();
      let root: ReturnType<typeof createRoot> | null = null;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <PaginaLogin />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {});

      // Verificar que el toast se mostró
      expect(document.body.textContent).toContain(
        "No se pudo obtener tu identidad",
      );
      expect(document.body.textContent).toContain("Verifica los scopes");

      act(() => {
        if (!root) throw new Error("Root not found");
        root.unmount();
      });
      document.body.removeChild(container);
    });

    it("RED: debe limpiar oauth_error de la URL con history.replaceState", async () => {
      // Capturar la URL que se pasa a replaceState
      let replacedUrl = "";
      const originalReplaceState = window.history.replaceState.bind(
        window.history,
      );
      window.history.replaceState = (
        _state: unknown,
        _title: string,
        url?: string | URL | null,
      ) => {
        if (url) {
          replacedUrl = url.toString();
        }
        return originalReplaceState(_state, _title, url);
      };

      const { PaginaLogin } = await import("./pagina-login");
      const container = document.createElement("div");
      document.body.appendChild(container);

      const clienteQuery = new QueryClient();
      let root: ReturnType<typeof createRoot> | null = null;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <PaginaLogin />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {});

      // Verificar que se limpió el oauth_error de la URL
      expect(replacedUrl).not.toContain("oauth_error");

      // Restaurar
      window.history.replaceState = originalReplaceState;

      act(() => {
        if (!root) throw new Error("Root not found");
        root.unmount();
      });
      document.body.removeChild(container);
    });

    it("RED: debe sanitizar el mensaje y no mostrar valores raw fuera del toast", async () => {
      // Intentar inyectar script malicioso
      Object.defineProperty(window, "location", {
        value: {
          search: "?oauth_error=<script>alert('xss')</script>",
          replace: vi.fn(),
        },
        writable: true,
      });

      const { PaginaLogin } = await import("./pagina-login");
      const container = document.createElement("div");
      document.body.appendChild(container);

      const clienteQuery = new QueryClient();
      let root: ReturnType<typeof createRoot> | null = null;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <PaginaLogin />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {});

      // El toast debe mostrar el mensaje fijo, no el valor raw
      // No debe haber HTML sin escapar en el DOM
      const alertElements = container.querySelectorAll("[role='alert']");
      for (const alertEl of alertElements) {
        expect(alertEl.innerHTML).not.toContain("<script>");
      }

      act(() => {
        if (!root) throw new Error("Root not found");
        root.unmount();
      });
      document.body.removeChild(container);
    });
  });

  describe("Verificación de código fuente", () => {
    it("pagina-login.tsx debe usar useNotificaciones para mostrar errores", () => {
      const usaUseNotificaciones =
        contenidoPaginaLogin.includes("useNotificaciones");
      expect(usaUseNotificaciones).toBe(true);
    });

    it("pagina-login.tsx debe usar window.location.search para leer oauth_error", () => {
      const usaLocationSearch = contenidoPaginaLogin.includes(
        "window.location.search",
      );
      expect(usaLocationSearch).toBe(true);
    });

    it("pagina-login.tsx debe usar history.replaceState para limpiar URL", () => {
      const usaReplaceState = contenidoPaginaLogin.includes(
        "history.replaceState",
      );
      expect(usaReplaceState).toBe(true);
    });

    it("pagina-login.tsx debe tener ancla con href=/api/auth/qlik/iniciar", () => {
      const tieneAnchor = contenidoPaginaLogin.includes(
        'href="/api/auth/qlik/iniciar"',
      );
      expect(tieneAnchor).toBe(true);
    });
  });

  describe("Inicio OAuth con ancla nativa", () => {
    it("debe tener un enlace anchor con href exacto /api/auth/qlik/iniciar", async () => {
      const { PaginaLogin } = await import("./pagina-login");
      const container = document.createElement("div");
      document.body.appendChild(container);

      const clienteQuery = new QueryClient();

      act(() => {
        createRoot(container).render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <PaginaLogin />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {});

      const anchor = container.querySelector(
        'a[href="/api/auth/qlik/iniciar"]',
      );
      expect(anchor).not.toBeNull();
      expect(anchor?.textContent).toBe("Iniciar sesión");

      document.body.removeChild(container);
    });
  });

  describe("Feedback visual OAuth inline", () => {
    it("debe mostrar bloque inline con role=alert cuando hay oauth_error", async () => {
      Object.defineProperty(window, "location", {
        value: {
          search: "?oauth_error=identity_scope_error",
          replace: vi.fn(),
        },
        writable: true,
      });

      const { PaginaLogin } = await import("./pagina-login");
      const container = document.createElement("div");
      document.body.appendChild(container);

      const clienteQuery = new QueryClient();

      act(() => {
        createRoot(container).render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <PaginaLogin />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {});

      // Verificar bloque inline con role="alert"
      const alertBlock = container.querySelector('[role="alert"]');
      expect(alertBlock).not.toBeNull();
      expect(alertBlock?.textContent).toContain(
        "No se pudo obtener tu identidad",
      );
      expect(alertBlock?.textContent).toContain("Verifica los scopes");

      document.body.removeChild(container);
    });
  });
});
