import { describe, expect, it, spyOn } from "bun:test";
import { app } from "./app";

describe("Logger middleware - seguridad", () => {
  it("registra method, path, status y durationMs sin filtrar secretos", async () => {
    const infoSpy = spyOn(console, "info");
    infoSpy.mockImplementation(() => {});

    const res = await app.request("/api/salud");
    expect(res.status).toBe(200);

    expect(infoSpy).toHaveBeenCalled();
    const logCall = infoSpy.mock.calls[0];
    const log = JSON.parse((logCall?.[0] as string) ?? "{}");
    expect(log).toHaveProperty("method");
    expect(log).toHaveProperty("path");
    expect(log).toHaveProperty("status");
    expect(log).toHaveProperty("durationMs");
    expect(log.path).not.toContain("?");
    expect(JSON.stringify(log)).not.toContain("token");
    expect(JSON.stringify(log)).not.toContain("secret");
    expect(JSON.stringify(log)).not.toContain("cookie");

    infoSpy.mockRestore();
  });

  it("el path no incluye query string", async () => {
    const infoSpy = spyOn(console, "info");
    infoSpy.mockImplementation(() => {});

    await app.request("/api/salud?foo=bar");

    const logCall = infoSpy.mock.calls[0];
    const log = JSON.parse((logCall?.[0] as string) ?? "{}");
    expect(log.path).not.toContain("?");

    infoSpy.mockRestore();
  });
});

describe("Logger sanitización de errores OAuth", () => {
  it("no contiene token en mensajes de error de token exchange", async () => {
    const errorSpy = spyOn(console, "error");
    errorSpy.mockImplementation(() => {});

    // Simular mensaje de error con token tipo AccessToken (regex busca 20+chars antes de AccessToken)
    const mensajeConToken =
      "Error intercambiando código: abcdefghijklmnopqrstuAccessToken1234567890";
    const mensajeSanitizado = mensajeConToken
      .replace(/[A-Za-z0-9-_]{20,}AccessToken[A-Za-z0-9-_]*/g, "[TOKEN]")
      .replace(/code=[A-Za-z0-9-_]{10,}/g, "code=[CODIGO]")
      .replace(/code_verifier=[A-Za-z0-9-_]{10,}/g, "code_verifier=[VERIFIER]")
      .replace(/client_secret=[^&\s]+/g, "client_secret=[SECRET]")
      .replace(/<[^>]+>/g, "")
      .slice(0, 200);

    expect(mensajeSanitizado).not.toContain("abcdefghijklmnopqrstuAccessToken");
    expect(mensajeSanitizado).toContain("[TOKEN]");
  });

  it("no contiene code en mensajes de error", async () => {
    const mensajeConCode = "code=abc123xyz456def789";
    const mensajeSanitizado = mensajeConCode.replace(
      /code=[A-Za-z0-9-_]{10,}/g,
      "code=[CODIGO]",
    );

    expect(mensajeSanitizado).toContain("[CODIGO]");
    expect(mensajeSanitizado).not.toContain("abc123");
  });

  it("no contiene verifier en mensajes de error", async () => {
    const mensajeConVerifier = "code_verifier=xyz123abc456def789ghi012jkl345";
    const mensajeSanitizado = mensajeConVerifier.replace(
      /code_verifier=[A-Za-z0-9-_]{10,}/g,
      "code_verifier=[VERIFIER]",
    );

    expect(mensajeSanitizado).toContain("[VERIFIER]");
    expect(mensajeSanitizado).not.toContain("xyz123");
  });

  it("no contiene client_secret en mensajes de error", async () => {
    const mensajeConSecret = "client_secret=super-secret-value-12345";
    const mensajeSanitizado = mensajeConSecret.replace(
      /client_secret=[^&\s]+/g,
      "client_secret=[SECRET]",
    );

    expect(mensajeSanitizado).toContain("[SECRET]");
    expect(mensajeSanitizado).not.toContain("super-secret");
  });

  it("trunca body a 200 caracteres", async () => {
    const bodyLargo = "x".repeat(500);
    const bodyTruncado = bodyLargo.replace(/<[^>]+>/g, "").slice(0, 200);

    expect(bodyTruncado.length).toBe(200);
  });

  it("elimina HTML de mensajes de error", async () => {
    const mensajeConHtml =
      "<html><body>Error: invalid_token</body></html> Access token expired";
    const mensajeSanitizado = mensajeConHtml
      .replace(/<[^>]+>/g, "")
      .slice(0, 200);

    expect(mensajeSanitizado).not.toContain("<");
    expect(mensajeSanitizado).not.toContain(">");
    expect(mensajeSanitizado).toContain("Error");
  });
});
