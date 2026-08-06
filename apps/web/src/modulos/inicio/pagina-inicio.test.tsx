import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import React, { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { VistaProvider, useVistaUsuarioFinal } from "@/app/contexto-vista";
import { PaginaInicio } from "./pagina-inicio";

const mocks = vi.hoisted(() => ({
  obtenerSesion: vi.fn(),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) =>
    React.createElement("a", { href: to }, children),
}));

vi.mock("@/modulos/autenticacion/api", () => ({
  obtenerSesion: mocks.obtenerSesion,
}));
vi.mock("@tanstack/react-router", () => ({
  Link: mocks.Link,
}));

const sesionAdmin = {
  usuario: { nombre: "Ana Admin", avatarUrl: null },
  esSuperadmin: true,
  tenantActivoId: "ten-1",
  tenantsDisponibles: [
    { id: "ten-1", nombre: "Tenant Demo", host: "demo.us.qlikcloud.com" },
  ],
  membresias: [{ rol: "admin" }],
};

function ConModo({
  activo,
  children,
}: {
  activo: boolean;
  children: ReactNode;
}) {
  const { setModoUsuarioFinal } = useVistaUsuarioFinal();
  useEffect(() => {
    setModoUsuarioFinal(activo);
  }, [activo, setModoUsuarioFinal]);
  return <>{children}</>;
}

function renderizar(activo: boolean) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <VistaProvider>
        <ConModo activo={activo}>
          <PaginaInicio />
        </ConModo>
      </VistaProvider>
    </QueryClientProvider>,
  );
}

describe("PaginaInicio", () => {
  it("admin sin modo usuario final ve badge Administrador y la card de plataforma", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    renderizar(false);

    await waitFor(() => {
      expect(screen.getByText("Tenant Demo")).toBeInTheDocument();
    });
    expect(screen.getByText("Administrador")).toBeInTheDocument();
    expect(
      screen.getByText("Configuración de la plataforma"),
    ).toBeInTheDocument();
  });

  it("admin con modo usuario final ve badge Usuario final y oculta la card", async () => {
    mocks.obtenerSesion.mockResolvedValue(sesionAdmin);
    renderizar(true);

    await waitFor(() => {
      expect(screen.getByText("Tenant Demo")).toBeInTheDocument();
    });
    expect(screen.getByText("Usuario final")).toBeInTheDocument();
    expect(
      screen.queryByText("Configuración de la plataforma"),
    ).not.toBeInTheDocument();
  });
});
