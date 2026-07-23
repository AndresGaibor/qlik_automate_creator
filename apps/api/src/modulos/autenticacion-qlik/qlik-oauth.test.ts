import { beforeEach, describe, expect, it, vi } from "bun:test";
import { ClienteOAuthQlik } from "./qlik-oauth.js";

const MOCK_CLIENT_ID = "test-client-id";
const MOCK_CLIENT_SECRET = "test-client-secret";
const MOCK_REDIRECT_URI = "http://localhost:3000/api/auth/qlik/callback";
const MOCK_HOST = "test.qlikcloud.com";

describe("ClienteOAuthQlik", () => {
  let cliente: ClienteOAuthQlik;

  beforeEach(() => {
    cliente = new ClienteOAuthQlik(
      MOCK_CLIENT_ID,
      MOCK_CLIENT_SECRET,
      MOCK_REDIRECT_URI,
      MOCK_HOST,
    );
  });

  describe("obtenerUrlAutorizacion", () => {
    it("incluye scopes de identidad en la URL", () => {
      const url = cliente.obtenerUrlAutorizacion(
        "estado-test",
        "challenge-test",
      );
      const params = new URL(url).searchParams;
      const scope = params.get("scope");

      // Verificar que los scopes incluyen los necesarios para /api/v1/users/me
      expect(scope).toContain("identity.name:read");
      expect(scope).toContain("identity.email:read");
      expect(scope).toContain("identity.subject:read");
      expect(scope).toContain("identity.picture:read");
      expect(scope).toContain("offline_access");
      expect(scope).toContain("user_default");
    });

    it("no incluye openid porque Qlik no lo admite", () => {
      const url = cliente.obtenerUrlAutorizacion(
        "estado-test",
        "challenge-test",
      );
      const params = new URL(url).searchParams;
      const scope = params.get("scope");

      expect(scope).not.toContain("openid");
    });
  });

  describe("obtenerUsuario", () => {
    it("lanza error con status y cuerpo seguro cuando API retorna 401", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: () => Promise.resolve({ error: "invalid_token" }),
        text: () => Promise.resolve('{"error":"invalid_token"}'),
      }) as unknown as typeof fetch;

      await expect(cliente.obtenerUsuario("token-invalido")).rejects.toThrow();

      const error = await cliente
        .obtenerUsuario("token-invalido")
        .catch((e) => e);
      expect(error.message).toContain("401");
      expect(error.message).not.toContain("token-invalido");
      expect(error.message).not.toContain("Bearer");
    });

    it("lanza error con status y cuerpo seguro cuando API retorna 403", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: () =>
          Promise.resolve({ error: "insufficient_scope", scope: "openid" }),
        text: () =>
          Promise.resolve('{"error":"insufficient_scope","scope":"openid"}'),
      }) as unknown as typeof fetch;

      await expect(cliente.obtenerUsuario("token-sin-scope")).rejects.toThrow();

      const error = await cliente
        .obtenerUsuario("token-sin-scope")
        .catch((e) => e);
      expect(error.message).toContain("403");
      expect(error.message).toContain("insufficient_scope");
      expect(error.message).not.toContain("token-sin-scope");
    });

    it("devuelve usuario con datos correctos cuando API responde OK", async () => {
      const mockUsuario = {
        id: "usr-123",
        name: "Juan Perez",
        email: "juan@test.com",
        avatar: "https://avatar.url/pic.jpg",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockUsuario),
      }) as unknown as typeof fetch;

      const resultado = await cliente.obtenerUsuario("token-valido");

      expect(resultado).toEqual(mockUsuario);
      expect(resultado.id).toBe("usr-123");
      expect(resultado.name).toBe("Juan Perez");
      expect(resultado.email).toBe("juan@test.com");
      expect(resultado.avatar).toBe("https://avatar.url/pic.jpg");
    });
  });

  describe("intercambiaCodigoPorTokens", () => {
    it("no expone client_secret en errores de red", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve("invalid_grant"),
      }) as unknown as typeof fetch;

      try {
        await cliente.intercambiaCodigoPorTokens(
          "codigo-invalido",
          "verifier-test",
        );
      } catch (error) {
        expect((error as Error).message).not.toContain(MOCK_CLIENT_SECRET);
        expect((error as Error).message).not.toContain("test-client-secret");
      }
    });

    it("mapea snake_case de Qlik a camelCase (access_token → accessToken)", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "qlik-access-token-abc",
            refresh_token: "qlik-refresh-token-xyz",
            expires_in: 3600,
            scope: "user_default offline_access",
          }),
      }) as unknown as typeof fetch;

      const tokens = await cliente.intercambiaCodigoPorTokens(
        "codigo-valido",
        "verifier-valido",
      );

      expect(tokens.accessToken).toBe("qlik-access-token-abc");
      expect(tokens.refreshToken).toBe("qlik-refresh-token-xyz");
      expect(tokens.expiresIn).toBe(3600);
      expect(tokens.scope).toBe("user_default offline_access");
    });

    it("devuelve scope vacío cuando Qlik no retorna scope", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            access_token: "token-ok",
            expires_in: 1800,
          }),
      }) as unknown as typeof fetch;

      const tokens = await cliente.intercambiaCodigoPorTokens(
        "codigo",
        "verifier",
      );

      expect(tokens.accessToken).toBe("token-ok");
      expect(tokens.expiresIn).toBe(1800);
      expect(tokens.scope).toBe("");
    });

    it("lanza error seguro cuando access_token falta en la respuesta", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ expires_in: 3600 }),
      }) as unknown as typeof fetch;

      await expect(
        cliente.intercambiaCodigoPorTokens("codigo", "verifier"),
      ).rejects.toThrow("access_token");
    });

    it("lanza error seguro cuando expires_in falta en la respuesta", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ access_token: "token-ok" }),
      }) as unknown as typeof fetch;

      await expect(
        cliente.intercambiaCodigoPorTokens("codigo", "verifier"),
      ).rejects.toThrow("expires_in");
    });

    it("obtenerUsuario envía Bearer real (no undefined) cuando tokens se mapean correctamente", async () => {
      const mockFetch = vi.fn().mockImplementation(async (_url, opts) => {
        const authorization = (opts?.headers as Record<string, string>)
          ?.Authorization;
        // Token exchange: POST sin Authorization → 200 con snake_case
        if (!authorization) {
          return {
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                access_token: "qlik-real-token",
                refresh_token: "qlik-refresh",
                expires_in: 3600,
                scope: "user_default",
              }),
          };
        }
        // Users/me: GET con Bearer → 200 con usuario
        if (authorization === "Bearer qlik-real-token") {
          return {
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                id: "usr-1",
                name: "Test",
                email: "test@test.com",
              }),
          };
        }
        return {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
          text: () => Promise.resolve("invalid_token"),
        };
      });
      global.fetch = mockFetch;

      const tokens = await cliente.intercambiaCodigoPorTokens(
        "codigo",
        "verifier",
      );
      const usuario = await cliente.obtenerUsuario(tokens.accessToken);

      expect(usuario.id).toBe("usr-1");
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
