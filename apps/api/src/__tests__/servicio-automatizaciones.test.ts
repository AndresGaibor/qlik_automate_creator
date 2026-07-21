import { describe, expect, it } from "bun:test";
import { app } from "../app";

describe("API Salud", () => {
  it("debe devolver ok con estado 200", async () => {
    const res = await app.fetch(new Request("http://localhost/api/salud"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.estado).toBe("ok");
  });

  it("debe devolver formato JSON", async () => {
    const res = await app.fetch(new Request("http://localhost/api/salud"));
    expect(res.headers.get("content-type")).toContain("application/json");
  });
});
