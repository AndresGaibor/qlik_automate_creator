/// <reference types="vitest" />
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClienteApi } from "./cliente";

globalThis.window = {
  location: { origin: "http://localhost" },
} as unknown as Window;

describe("ClienteApi", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("get", () => {
    it("should make a GET request to the correct endpoint", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true, data: [{ id: "1" }] }),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const api = new ClienteApi("/api");
      const result = await api.get("/test");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test"),
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual([{ id: "1" }]);
    });

    it("should throw error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ success: false, error: "Not found" }),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const api = new ClienteApi("/api");

      await expect(api.get("/test")).rejects.toThrow("Not found");
    });

    it("should include query params in the URL", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const api = new ClienteApi("/api");
      await api.get("/test", { params: { page: 1, limit: 10 } });

      const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(url).toContain("page=1");
      expect(url).toContain("limit=10");
    });
  });

  describe("post", () => {
    it("should make a POST request with JSON body", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: "1" } }),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const api = new ClienteApi("/api");
      const result = await api.post("/test", { name: "test" });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
      expect(result).toEqual({ id: "1" });
    });
  });

  describe("delete", () => {
    it("should make a DELETE request", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true, data: null }),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const api = new ClienteApi("/api");
      await api.delete("/test/1");

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test/1"),
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });
});
