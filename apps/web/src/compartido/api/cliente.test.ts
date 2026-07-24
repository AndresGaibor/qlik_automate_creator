/// <reference types="vitest" />
/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClienteApi, ErrorClienteApi } from "./cliente";

const fetchOriginal = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = fetchOriginal;
  vi.restoreAllMocks();
});

describe("ClienteApi", () => {
  it("desenvuelve el contrato exitoso y agrega parámetros", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ exito: true, datos: [{ id: "1" }] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    ) as unknown as typeof fetch;

    const cliente = new ClienteApi("/api");
    const datos = await cliente.get<Array<{ id: string }>>("/prueba", {
      parametros: { pagina: 1, activo: true },
    });

    expect(datos).toEqual([{ id: "1" }]);
    const url = String(
      (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0]?.[0],
    );
    expect(url).toContain("pagina=1");
    expect(url).toContain("activo=true");
  });

  it("convierte el contrato de error en ErrorClienteApi", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            exito: false,
            error: { codigo: "VALIDACION", mensaje: "Solicitud inválida" },
          }),
          { status: 400, headers: { "content-type": "application/json" } },
        ),
    ) as unknown as typeof fetch;

    const cliente = new ClienteApi("/api");
    const error = await cliente.get("/prueba").catch((causa) => causa);

    expect(error).toBeInstanceOf(ErrorClienteApi);
    if (!(error instanceof ErrorClienteApi)) {
      throw new Error("Se esperaba ErrorClienteApi");
    }
    expect(error.estado).toBe(400);
    expect(error.codigo).toBe("VALIDACION");
    expect(error.message).toBe("Solicitud inválida");
  });

  it("envía JSON e Idempotency-Key", async () => {
    globalThis.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ exito: true, datos: { id: "nueva" } }), {
          status: 201,
          headers: { "content-type": "application/json" },
        }),
    ) as unknown as typeof fetch;

    const cliente = new ClienteApi("/api");
    await cliente.post(
      "/automatizaciones/desde-plantilla",
      { nombre: "Nueva" },
      {
        headers: { "Idempotency-Key": "clave-12345678" },
      },
    );

    const opciones = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0]?.[1] as RequestInit;
    expect(opciones.method).toBe("POST");
    expect(opciones.headers).toMatchObject({
      "Content-Type": "application/json",
      "Idempotency-Key": "clave-12345678",
    });
    expect(JSON.parse(String(opciones.body))).toEqual({ nombre: "Nueva" });
  });
});
