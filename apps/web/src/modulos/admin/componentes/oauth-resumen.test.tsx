import { act } from "react";
import { type Root, createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { ResumenOauth } from "./resumen-oauth";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
});

test("resume una conexión OAuth verificada y ofrece acciones claras", () => {
  const editar = vi.fn();
  const verificar = vi.fn();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root?.render(
      <ResumenOauth
        tenant={{
          id: "q1",
          organizacionId: "org",
          tenantIdQlik: "tenant",
          host: "empresa.qlikcloud.com",
          nombre: "Producción",
          estado: "activo",
          esPrincipal: true,
          tieneDestinoApiKey: false,
          destinoApiKeyMascara: null,
          tieneImpalaPassword: false,
          impalaPasswordMascara: null,
          creadoEn: "2026-07-25",
        }}
        configuracion={{
          tenantQlikId: "q1",
          clienteId: "client-id",
          secretoMascara: "••••437c",
          scopes: ["automations", "spaces:read"],
          estado: "verificada",
          origen: "tenant",
          verificadaEn: "2026-07-31T15:00:00Z",
          ultimoError: null,
          actualizadoEn: "2026-07-31T15:00:00Z",
          redirectUri: "http://localhost:3000/callback",
        }}
        verificando={false}
        onEditar={editar}
        onVerificar={verificar}
      />,
    ),
  );

  expect(container.textContent).toContain("2 autorizados");
  expect(container.textContent).not.toContain("Scopes OAuth");
  const botones = Array.from(container.querySelectorAll("button"));
  act(() =>
    botones.find((boton) => boton.textContent?.includes("Editar"))?.click(),
  );
  act(() =>
    botones
      .find((boton) => boton.textContent?.includes("Volver a verificar"))
      ?.click(),
  );
  expect(editar).toHaveBeenCalledOnce();
  expect(verificar).toHaveBeenCalledOnce();
});
