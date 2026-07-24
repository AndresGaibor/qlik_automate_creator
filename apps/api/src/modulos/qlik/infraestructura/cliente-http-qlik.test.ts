import { type Mock, describe, expect, it, vi } from "bun:test";
import { ClienteHttpQlik } from "./cliente-http-qlik.js";
import { ErrorApiQlik } from "./error-api-qlik.js";

function respuestaJson(datos: unknown, estado = 200): Response {
  return new Response(JSON.stringify(datos), {
    status: estado,
    headers: { "content-type": "application/json" },
  });
}

type FetchMock = Mock<
  (input: string | URL | Request, init?: RequestInit) => Promise<Response>
>;

describe("ClienteHttpQlik", () => {
  it("extrae data en endpoints paginados", async () => {
    const fetchFn: FetchMock = vi.fn(async () =>
      respuestaJson({
        data: [{ id: "espacio-1", name: "Operaciones", type: "shared" }],
      }),
    );
    const cliente = new ClienteHttpQlik(
      "tenant.eu.qlikcloud.com",
      "token",
      fetchFn as unknown as typeof fetch,
    );

    const espacios = await cliente.listarEspacios({ limit: 100 });

    expect(espacios).toHaveLength(1);
    expect(espacios[0]?.name).toBe("Operaciones");
    const llamada = fetchFn.mock.calls[0] as unknown[];
    const url = new URL(String(llamada[0]));
    expect(url.pathname).toBe("/api/v1/spaces");
    expect(url.searchParams.get("limit")).toBe("100");
  });

  it("conserva el recurso directo al consultar por id", async () => {
    const fetchFn: FetchMock = vi.fn(async () =>
      respuestaJson({
        id: "usuario-1",
        name: "Andres",
        email: "a@example.com",
      }),
    );
    const cliente = new ClienteHttpQlik(
      "https://tenant.eu.qlikcloud.com",
      "token",
      fetchFn as unknown as typeof fetch,
    );

    const usuario = await cliente.obtenerUsuario("usuario-1", "name,email");

    expect(usuario.name).toBe("Andres");
    const llamada = fetchFn.mock.calls[0] as unknown[];
    const url = new URL(String(llamada[0]));
    expect(url.searchParams.get("fields")).toBe("name,email");
  });

  it("ejecuta una automatización con context api", async () => {
    const fetchFn: FetchMock = vi.fn(async () =>
      respuestaJson({ id: "ejecucion-1" }, 201),
    );
    const cliente = new ClienteHttpQlik(
      "tenant.eu.qlikcloud.com",
      "token",
      fetchFn as unknown as typeof fetch,
    );

    await expect(
      cliente.ejecutarAutomatizacion("automatizacion-1"),
    ).resolves.toEqual({
      runId: "ejecucion-1",
    });
    const llamada = fetchFn.mock.calls[0] as unknown[];
    const opciones = llamada[1] as RequestInit;
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(String(opciones.body))).toEqual({ context: "api" });
  });

  it("propaga estado, cuerpo y trace id de Qlik", async () => {
    const fetchFn: FetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            traceId: "traza-qlik",
            errors: [{ title: "Forbidden" }],
          }),
          {
            status: 403,
            statusText: "Forbidden",
            headers: { "content-type": "application/json" },
          },
        ),
    );
    const cliente = new ClienteHttpQlik(
      "tenant.eu.qlikcloud.com",
      "token",
      fetchFn as unknown as typeof fetch,
    );

    const error = await cliente
      .listarAutomatizaciones()
      .catch((causa) => causa);

    expect(error).toBeInstanceOf(ErrorApiQlik);
    expect(error.estadoHttp).toBe(403);
    expect(error.trazaId).toBe("traza-qlik");
    expect(JSON.stringify(error.cuerpo)).toContain("Forbidden");
  });

  it("rechaza hosts no HTTPS", () => {
    expect(
      () => new ClienteHttpQlik("http://tenant.example.com", "token"),
    ).toThrow("HTTPS");
  });
});
