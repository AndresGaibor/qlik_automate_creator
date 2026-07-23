/// <reference types="vitest" />
/**
 * @vitest-environment jsdom
 */
import { PaginaInicio } from "@/app/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>(
    "@tanstack/react-router",
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderPaginaInicio(usuario: { nombre?: string; avatarUrl?: string }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  });

  queryClient.setQueryData(["sesion"], {
    success: true,
    data: { usuario },
  });

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <PaginaInicio />
      </QueryClientProvider>,
    );
  });
  return { container, root };
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("PaginaInicio", () => {
  it("muestra el nombre completo de la sesión y su avatar", () => {
    const { container, root } = renderPaginaInicio({
      nombre: "María Fernanda López",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(container.textContent).toContain("María Fernanda López");
    const avatar = container.querySelector(
      'img[alt="Avatar de María Fernanda López"]',
    );
    expect(avatar?.getAttribute("src")).toBe("https://example.com/avatar.png");
    act(() => root.unmount());
  });

  it("usa iniciales accesibles cuando la sesión no tiene avatar", () => {
    const { container, root } = renderPaginaInicio({
      nombre: "María Fernanda López",
    });

    const fallback = container.querySelector(
      '[aria-label="Iniciales de María Fernanda López"]',
    );
    expect(fallback?.textContent).toBe("ML");
    expect(container.querySelector("img")).toBeNull();
    act(() => root.unmount());
  });

  it("usa un nombre y fallback seguros cuando faltan los datos del usuario", () => {
    const { container, root } = renderPaginaInicio({});

    expect(container.textContent).toContain("Usuario Qlik");
    const fallback = container.querySelector(
      '[aria-label="Iniciales de Usuario Qlik"]',
    );
    expect(fallback?.textContent).toBe("UQ");
    act(() => root.unmount());
  });
});
