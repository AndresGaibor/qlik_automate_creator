import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeccionConexionImpala } from "./seccion-conexion-impala";

vi.mock("./seccion-configurar-impala-tenant", () => ({
  SeccionConfigurarImpalaTenant: () => <div>Formulario Impala</div>,
}));

describe("SeccionConexionImpala", () => {
  it("muestra un resumen cuando ya está conectada y edita bajo demanda", () => {
    render(
      <SeccionConexionImpala
        organizacionId="org-1"
        tenantsQlik={[
          {
            id: "q1",
            organizacionId: "org-1",
            tenantIdQlik: "tenant-1",
            host: "empresa.us.qlikcloud.com",
            nombre: "Producción",
            estado: "activo",
            esPrincipal: true,
            tieneDestinoApiKey: false,
            destinoApiKeyMascara: null,
            tieneImpalaPassword: false,
            impalaPasswordMascara: null,
            impalaHost: "impala.local",
            impalaPort: 21050,
            impalaDatabase: "default",
            creadoEn: "2026-08-05",
          },
        ]}
      />,
    );

    expect(screen.getByText("impala.local:21050")).toBeInTheDocument();
    expect(screen.queryByText("Formulario Impala")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /editar conexión/i }));
    expect(screen.getByText("Formulario Impala")).toBeInTheDocument();
  });
});
