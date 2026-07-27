import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { crearMiddlewareLimiteSolicitudes } from "./limite-solicitudes.js";

describe("límite de solicitudes", () => {
  it("bloquea el exceso por ruta y cliente sensible", async () => {
    const app = new Hono();
    app.use(
      "*",
      crearMiddlewareLimiteSolicitudes([
        {
          ruta: "/api/auth/qlik/iniciar",
          maximo: 2,
          ventanaMs: 60_000,
        },
      ]),
    );
    app.get("/api/auth/qlik/iniciar", (c) => c.json({ exito: true }));

    const opciones = { headers: { "cf-connecting-ip": "203.0.113.10" } };
    await app.request("/api/auth/qlik/iniciar", opciones);
    await app.request("/api/auth/qlik/iniciar", opciones);
    const respuesta = await app.request("/api/auth/qlik/iniciar", opciones);

    expect(respuesta.status).toBe(429);
    expect(respuesta.headers.get("retry-after")).toBe("60");
    expect((await respuesta.json()).error.codigo).toBe(
      "LIMITE_SOLICITUDES_EXCEDIDO",
    );
  });
});
