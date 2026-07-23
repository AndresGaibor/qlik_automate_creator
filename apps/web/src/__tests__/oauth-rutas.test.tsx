/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NotificacionesProvider } from "@/componentes/feedback/notificaciones";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock de los hooks de TanStack Router
const mockNavigate = vi.fn();
const mockLocation = { pathname: "/flujos" };
const MockOutlet = () => null;

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    Outlet: MockOutlet,
  };
});

// Usar ruta relativa desde el directorio del test
const routerPath = join(import.meta.dirname, "../app/router.tsx");
const contenidoRouter = readFileSync(routerPath, "utf-8");

describe("OAuth Integration", () => {
  describe("Verificación de URL de logout", () => {
    it("router.tsx usa /api/auth/qlik/cerrar-sesion (con /qlik)", () => {
      const usaUrlCorrecta = contenidoRouter.includes(
        '"/api/auth/qlik/cerrar-sesion"',
      );
      expect(usaUrlCorrecta).toBe(true);
    });

    it("router.tsx no usa /api/auth/cerrar-sesion (sin /qlik)", () => {
      const usaUrlIncorrecta = contenidoRouter.includes(
        '"/api/auth/cerrar-sesion"',
      );
      expect(usaUrlIncorrecta).toBe(false);
    });
  });

  describe("Verificación de protección de rutas", () => {
    it("router.tsx consulta /api/auth/qlik/sesion para verificar autenticación", () => {
      const haceVerificacionSesion = contenidoRouter.includes(
        "/api/auth/qlik/sesion",
      );
      expect(haceVerificacionSesion).toBe(true);
    });

    it("LayoutPrincipal verifica sesión antes de renderizar contenido protegido", () => {
      const tieneVerificacionSesion =
        contenidoRouter.includes("useQuery") &&
        contenidoRouter.includes("/sesion");

      expect(tieneVerificacionSesion).toBe(true);
    });

    it("LayoutPrincipal usa useEffect para navegación segura (evita redirect durante render)", () => {
      const usaUseEffect = contenidoRouter.includes("useEffect");
      const tieneNavigateEnEffect = contenidoRouter.includes(
        'navigate({ to: "/login" })',
      );

      expect(usaUseEffect).toBe(true);
      expect(tieneNavigateEnEffect).toBe(true);
    });

    it("LayoutPrincipal detecta si está en /login para evitar bucle de redirect", () => {
      const tieneDetencionLogin =
        contenidoRouter.includes('"/login"') &&
        contenidoRouter.includes("esLogin");

      expect(tieneDetencionLogin).toBe(true);
    });
  });

  describe("Logout con manejo de errores", () => {
    let container: HTMLDivElement;
    let root: ReturnType<typeof createRoot> | null = null;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
      mockLocation.pathname = "/flujos";
      mockNavigate.mockClear();
      fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
      if (root) {
        act(() => {
          if (!root) throw new Error("Root not found");
          root.unmount();
        });
      }
      document.body.removeChild(container);
      vi.unstubAllGlobals();
    });

    it("LayoutPrincipal tiene botón logout con data-accion='cerrar-sesion'", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Sesión exitosa
      fetchMock.mockResolvedValueOnce(
        new Response(JSON.stringify({ success: true, data: {} }), {
          status: 200,
        }),
      ) as unknown as typeof fetch;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      const boton = container.querySelector(
        'button[data-accion="cerrar-sesion"]',
      );
      expect(boton).not.toBeNull();
      vi.useRealTimers();
    });

    it("logout falla (500): muestra toast y NO navega a login", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Sesión exitosa + logout 500
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true, data: {} }), {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(
          new Response(null, { status: 500 }),
        ) as unknown as typeof fetch;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      const boton = container.querySelector(
        'button[data-accion="cerrar-sesion"]',
      );
      await act(async () => {
        boton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      expect(document.body.textContent).toContain("No se pudo cerrar sesión");
      expect(mockNavigate).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it("logout exitoso: navega a login y fetch incluye credentials:include", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Sesión exitosa + logout exitoso (debe retornar JSON con success:true)
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true, data: {} }), {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true }), { status: 200 }),
        ) as unknown as typeof fetch;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      const boton = container.querySelector(
        'button[data-accion="cerrar-sesion"]',
      );
      await act(async () => {
        boton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });

      // Verificar que logout fetch fue llamado con credentials: "include"
      const logoutCall = fetchMock.mock.calls[1];
      expect(logoutCall[1]).toBeDefined();
      expect((logoutCall[1] as RequestInit).credentials).toBe("include");
      vi.useRealTimers();
    });

    it("sesión 401: redirige a login sin mostrar toast", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Sesión 401 (no autorizada)
      fetchMock.mockResolvedValueOnce(
        new Response(null, { status: 401 }),
      ) as unknown as typeof fetch;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
      expect(document.body.textContent).not.toContain("No se pudo");
      expect(container.querySelector("header")).toBeNull();
      expect(container.textContent).not.toContain("Flujos");
      expect(container.textContent).not.toContain("Automatizaciones");
      vi.useRealTimers();
    });

    it("ruta login no muestra el shell ni navega a endpoints de sesión", async () => {
      mockLocation.pathname = "/login";
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      expect(container.querySelector("header")).toBeNull();
      expect(container.textContent).not.toContain("Flujos");
      expect(container.textContent).not.toContain("Automatizaciones");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sesión 500: muestra toast de error sin redirigir", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Sesión 500 (error del servidor)
      fetchMock.mockResolvedValueOnce(
        new Response(null, { status: 500 }),
      ) as unknown as typeof fetch;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      // Toast de error al verificar sesión
      expect(document.body.textContent).toContain("Error al verificar sesión");
      // No debe redirigir a login por error 500
      expect(mockNavigate).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it("sesión 200 success:false: muestra toast sin redirigir", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Sesión 200 pero con success:false (error de aplicación)
      fetchMock.mockResolvedValueOnce(
        new Response(
          JSON.stringify({ success: false, error: "Token inválido" }),
          {
            status: 200,
          },
        ),
      ) as unknown as typeof fetch;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      // Toast de error por success:false
      expect(document.body.textContent).toContain("Error al verificar sesión");
      // No debe redirigir a login
      expect(mockNavigate).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it("logout 200 success:false: muestra toast y NO navega", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Sesión exitosa + logout 200 success:false
      fetchMock
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ success: true, data: {} }), {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({ success: false, error: "No se pudo cerrar" }),
            {
              status: 200,
            },
          ),
        ) as unknown as typeof fetch;

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      const boton = container.querySelector(
        'button[data-accion="cerrar-sesion"]',
      );
      await act(async () => {
        boton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      expect(document.body.textContent).toContain("No se pudo cerrar sesión");
      expect(mockNavigate).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it("LayoutPrincipal muestra estado de carga mientras verifica sesión", async () => {
      vi.useFakeTimers();
      const { LayoutPrincipal } = await import("@/app/router");
      const clienteQuery = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      // Fetch nunca resuelve (simula loading)
      fetchMock.mockResolvedValueOnce(
        new Promise(() => {}) as unknown as typeof fetch,
      );

      act(() => {
        root = createRoot(container);
        root.render(
          <QueryClientProvider client={clienteQuery}>
            <NotificacionesProvider>
              <LayoutPrincipal />
            </NotificacionesProvider>
          </QueryClientProvider>,
        );
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });

      // Loading state visible
      expect(container.textContent).toContain("Verificando sesión");
      // Outlet (contenido protegido) no debe tener Flujos reales
      expect(container.textContent).not.toContain("Flujos");
      vi.useRealTimers();
    });
  });
});
