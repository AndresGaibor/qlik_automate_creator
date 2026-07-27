import { describe, expect, it, vi } from "bun:test";
import { ClienteOAuthQlik } from "./cliente-oauth-qlik.js";

describe("ClienteOAuthQlik", () => {
  it("genera autorización PKCE con scopes configurables", () => {
    const cliente = new ClienteOAuthQlik(
      "cliente",
      "secreto",
      "https://app.example.com/api/auth/qlik/callback",
      "tenant.eu.qlikcloud.com",
      "user_default automations spaces:read",
    );

    const url = new URL(cliente.obtenerUrlAutorizacion("estado", "desafio"));
    expect(url.pathname).toBe("/oauth/authorize");
    expect(url.searchParams.get("state")).toBe("estado");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("scope")).toBe(
      "user_default automations spaces:read",
    );
  });

  it("mapea la respuesta OAuth snake_case al dominio", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            access_token: "acceso",
            refresh_token: "refresco",
            expires_in: 3600,
            scope: "automations spaces:read",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
    );
    const cliente = new ClienteOAuthQlik(
      "cliente",
      "secreto",
      "https://app.example.com/api/auth/qlik/callback",
      "tenant.eu.qlikcloud.com",
      undefined,
      fetchFn as unknown as typeof fetch,
    );

    const tokens = await cliente.intercambiarCodigo("codigo", "verificador");

    expect(tokens).toEqual({
      tokenAcceso: "acceso",
      tokenRefresco: "refresco",
      expiraEnSegundos: 3600,
      scopes: ["automations", "spaces:read"],
    });
  });

  it("limita el tiempo de las llamadas a OAuth", async () => {
    let senal: AbortSignal | undefined;
    const cliente = new ClienteOAuthQlik(
      "cliente",
      "secreto",
      "https://app.example.com/api/auth/qlik/callback",
      "tenant.eu.qlikcloud.com",
      undefined,
      (async (_entrada, init) => {
        senal = init?.signal as AbortSignal;
        return new Response(
          JSON.stringify({ access_token: "acceso", expires_in: 3600 }),
          { status: 200 },
        );
      }) as typeof fetch,
      1_000,
    );

    await cliente.intercambiarCodigo("codigo", "verificador");

    expect(senal).toBeInstanceOf(AbortSignal);
  });
});
