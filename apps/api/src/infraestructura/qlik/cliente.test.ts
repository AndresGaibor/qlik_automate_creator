import { beforeEach, describe, expect, it, vi } from "bun:test";
import { ClienteQlik, QlikApiError } from "./cliente.js";
import type {
  AutomatizacionQlik,
  EjecucionQlik,
  EspacioQlik,
  FlujoQlik,
} from "./tipos.js";
import type { UsuarioQlik } from "./tipos.js";

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

    it("throws QlikApiError with status code when API fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      }) as unknown as typeof fetch;

      try {
        await cliente.listarEspacios();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(401);
        expect((error as QlikApiError).endpoint).toBe("/api/v1/spaces");
        expect((error as QlikApiError).message).toContain("401");
      }
    });

    it("throws QlikApiError for 404 responses", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      }) as unknown as typeof fetch;

      try {
        await cliente.listarEspacios();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(404);
      }
    });

    it("throws QlikApiError for 403 responses", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      }) as unknown as typeof fetch;

      try {
        await cliente.listarEspacios();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(403);
      }
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
        `https://${MOCK_HOST}/api/v1/di-projects`,
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
        `https://${MOCK_HOST}/api/v1/di-projects?spaceId=esp-1`,
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
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations`,
        expect.any(Object),
      );
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

    it("throws QlikApiError when Qlik returns 403", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      }) as unknown as typeof fetch;

      try {
        await cliente.listarAutomatizaciones();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(403);
        expect((error as QlikApiError).endpoint).toBe(
          "/api/workflows/automations",
        );
      }
    });

    it("throws QlikApiError when Qlik returns 404", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      }) as unknown as typeof fetch;

      try {
        await cliente.listarAutomatizaciones();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(404);
      }
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
    it("returns executions for automation with default desc sort (-startTime)", async () => {
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
      // sort=desc se traduce a -startTime para el API real de Qlik
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1/runs?limit=10&sort=-startTime`,
        expect.any(Object),
      );
    });

    it("uses custom limit and sort when provided (asc → startTime)", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      }) as unknown as typeof fetch;

      await cliente.listarEjecuciones("auto-1", { limit: 50, sort: "asc" });

      // sort=asc se traduce a startTime para el API real de Qlik
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1/runs?limit=50&sort=startTime`,
        expect.any(Object),
      );
    });

    it("uses desc sort by default even with custom limit", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      }) as unknown as typeof fetch;

      await cliente.listarEjecuciones("auto-1", { limit: 1 });

      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1/runs?limit=1&sort=-startTime`,
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

      const result = await cliente.crearAutomatizacion(
        "Nueva Auto",
        "esp-1",
        "flujo-1",
      );

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

  describe("detenerEjecucion", () => {
    it("sends POST to /actions/stop to stop a running execution", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      }) as unknown as typeof fetch;

      await cliente.detenerEjecucion("auto-1", "run-456");

      // El API real usa POST /runs/{runId}/actions/stop
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/workflows/automations/auto-1/runs/run-456/actions/stop`,
        expect.objectContaining({ method: "POST" }),
      );
    });

    it("does not throw on 204 No Content response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
      }) as unknown as typeof fetch;

      await expect(
        cliente.detenerEjecucion("auto-1", "run-456"),
      ).resolves.toBeUndefined();
    });

    it("throws QlikApiError when stop fails", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      }) as unknown as typeof fetch;

      try {
        await cliente.detenerEjecucion("auto-1", "run-999");
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(404);
      }
    });
  });

  describe("obtenerEspacio", () => {
    it("returns space by id", async () => {
      const mockEspacio: EspacioQlik = {
        id: "esp-1",
        name: "Espacio Compartido",
        type: "shared",
        owner: { id: "usr-1", name: "Juan Perez" },
        createdDate: "2024-01-01T00:00:00Z",
        modifiedDate: "2024-01-02T00:00:00Z",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockEspacio }),
      }) as unknown as typeof fetch;

      const result = await cliente.obtenerEspacio("esp-1");

      expect(result).toEqual(mockEspacio);
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/v1/spaces/esp-1`,
        expect.any(Object),
      );
    });

    it("throws QlikApiError when space not found", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      }) as unknown as typeof fetch;

      try {
        await cliente.obtenerEspacio("esp-999");
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(404);
      }
    });
  });

  describe("obtenerUsuario", () => {
    it("returns user by id", async () => {
      const mockUsuario: UsuarioQlik = {
        id: "usr-1",
        name: "Juan Perez",
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockUsuario }),
      }) as unknown as typeof fetch;

      const result = await cliente.obtenerUsuario("usr-1");

      expect(result).toEqual(mockUsuario);
      expect(fetch).toHaveBeenCalledWith(
        `https://${MOCK_HOST}/api/v1/users/usr-1`,
        expect.any(Object),
      );
    });

    it("throws QlikApiError when user not found", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      }) as unknown as typeof fetch;

      try {
        await cliente.obtenerUsuario("usr-999");
        expect.unreachable("should have thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(QlikApiError);
        expect((error as QlikApiError).statusCode).toBe(404);
      }
    });
  });
});
