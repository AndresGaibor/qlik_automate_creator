import { describe, expect, it } from "bun:test";
import { app } from "./app";

app.get("/api/__test-error-handler", () => {
  throw new Error("error de prueba");
});

describe("API Salud", () => {
  it("GET /api/salud devuelve success true y estado ok", async () => {
    const res = await app.request("/api/salud");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.estado).toBe("ok");
    expect(body.data.fecha).toBeDefined();
  });

  it("GET /api/inexistente devuelve 404 con success false", async () => {
    const res = await app.request("/api/inexistente");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("No encontrado");
  });

  it("maneja errores internos sin romper el contexto de Hono", async () => {
    const res = await app.request("/api/__test-error-handler");
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      success: false,
      error: "Error interno",
    });
  });
});
