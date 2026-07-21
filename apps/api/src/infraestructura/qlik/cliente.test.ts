import { describe, expect, it, beforeEach, vi } from "bun:test";
import { ClienteQlik } from "./cliente.js";
import type {
  EspacioQlik,
  FlujoQlik,
  AutomatizacionQlik,
  EjecucionQlik,
} from "./tipos.js";

const MOCK_HOST = "test.qlik.com";
const MOCK_TOKEN = "test-token";

describe("ClienteQlik", () => {
  let cliente: ClienteQlik;

  beforeEach(() => {
    cliente = new ClienteQlik(MOCK_HOST, MOCK_TOKEN);
  });

  describe("listarEspacios", () => {
    it("returns espacios from API", async () => {
      const mockEspacios: EspacioQlik[] = [
        {
          id: "esp-1",
          name: "Espacio Compartido",
          type: "shared",
          owner: { id: "usr-1", name: "Juan Perez" },
          createdDate: "2024-01-01T00:00:00Z",
          modifiedDate: "2024-01-02T00:00:00Z",
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockEspacios }),
      }) as unknown as typeof fetch;

      const result = await cliente.listarEspacios();

      expect(result).toEqual(mockEspacios);
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/v1/spaces`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${MOCK_TOKEN}`,
          }),
        }),
      );
    });

    it("throws error when API fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      }) as unknown as typeof fetch;

      await expect(cliente.listarEspacios()).rejects.toThrow(
        "Qlik API error: 401 Unauthorized",
      );
    });
  });

  describe("listarFlujos", () => {
    it("returns flujos from API", async () => {
      const mockFlujos: FlujoQlik[] = [
        {
          id: "flujo-1",
          name: "Flujo ETL",
          spaceId: "esp-1",
          owner: { id: "usr-1", name: "Juan Perez" },
          createdDate: "2024-01-01T00:00:00Z",
          modifiedDate: "2024-01-02T00:00:00Z",
          artifact: { id: "art-1", name: "Artifact" },
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockFlujos }),
      }) as unknown as typeof fetch;

      const result = await cliente.listarFlujos();

      expect(result).toEqual(mockFlujos);
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/v1/dataflows`,
        expect.any(Object),
      );
    });

    it("passes spaceId filter when provided", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      }) as unknown as typeof fetch;

      await cliente.listarFlujos("esp-1");

      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/v1/dataflows?spaceId=esp-1`,
        expect.any(Object),
      );
    });
  });

  describe("listarAutomatizaciones", () => {
    it("returns automations from API", async () => {
      const mockAutomatizaciones: AutomatizacionQlik[] = [
        {
          id: "auto-1",
          name: "Mi Automatizacion",
          spaceId: "esp-1",
          owner: { id: "usr-1", name: "Juan Perez" },
          isEnabled: true,
          triggerType: "manual",
          createdDate: "2024-01-01T00:00:00Z",
          modifiedDate: "2024-01-02T00:00:00Z",
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockAutomatizaciones }),
      }) as unknown as typeof fetch;

      const result = await cliente.listarAutomatizaciones();

      expect(result).toEqual(mockAutomatizaciones);
    });

    it("passes filter params when provided", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      }) as unknown as typeof fetch;

      await cliente.listarAutomatizaciones({
        spaceId: "esp-1",
        ownerId: "usr-1",
        name: "Test",
      });

      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations?spaceId=esp-1&ownerId=usr-1&name=Test`,
        expect.any(Object),
      );
    });
  });

  describe("obtenerAutomatizacion", () => {
    it("returns automation by id", async () => {
      const mockAutomatizacion: AutomatizacionQlik = {
        id: "auto-1",
        name: "Mi Automatizacion",
        owner: { id: "usr-1", name: "Juan Perez" },
        isEnabled: true,
        triggerType: "manual",
        createdDate: "2024-01-01T00:00:00Z",
        modifiedDate: "2024-01-02T00:00:00Z",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockAutomatizacion }),
      }) as unknown as typeof fetch;

      const result = await cliente.obtenerAutomatizacion("auto-1");

      expect(result).toEqual(mockAutomatizacion);
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1`,
        expect.any(Object),
      );
    });
  });

  describe("listarEjecuciones", () => {
    it("returns executions for automation", async () => {
      const mockEjecuciones: EjecucionQlik[] = [
        {
          id: "run-1",
          automationId: "auto-1",
          status: "completed",
          startTime: "2024-01-01T00:00:00Z",
          endTime: "2024-01-01T00:01:00Z",
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockEjecuciones }),
      }) as unknown as typeof fetch;

      const result = await cliente.listarEjecuciones("auto-1");

      expect(result).toEqual(mockEjecuciones);
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1/runs?limit=10`,
        expect.any(Object),
      );
    });

    it("uses custom limit when provided", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      }) as unknown as typeof fetch;

      await cliente.listarEjecuciones("auto-1", { limit: 50 });

      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1/runs?limit=50`,
        expect.any(Object),
      );
    });
  });

  describe("crearAutomatizacion", () => {
    it("creates automation with correct payload", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { id: "new-auto-1" } }),
      }) as unknown as typeof fetch;

      const result = await cliente.crearAutomatizacion("Nueva Auto", "esp-1", "flujo-1");

      expect(result).toEqual({ id: "new-auto-1" });
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            name: "Nueva Auto",
            spaceId: "esp-1",
            trigger: { type: "manual" },
            actions: [{ type: "executeDataFlow", dataFlowId: "flujo-1" }],
          }),
        }),
      );
    });
  });

  describe("ejecutarAutomatizacion", () => {
    it("triggers automation execution", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { runId: "run-123" } }),
      }) as unknown as typeof fetch;

      const result = await cliente.ejecutarAutomatizacion("auto-1");

      expect(result).toEqual({ runId: "run-123" });
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1/runs`,
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
