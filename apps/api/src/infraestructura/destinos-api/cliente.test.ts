import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { ClienteDestinos } from "./cliente.js";

const BASE_URL = "https://apiqd.andresgaibor.com";
const API_KEY = "clave-super-segura123";

function mockFetch(response: unknown, ok = true) {
  return (url: URL, init?: RequestInit) => {
    void url;
    void init;
    return Promise.resolve({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? "OK" : "Internal Server Error",
      json: () => Promise.resolve(response),
    }) as unknown as ReturnType<typeof fetch>;
  };
}

describe("ClienteDestinos", () => {
  let client: ClienteDestinos;

  beforeEach(() => {
    client = new ClienteDestinos(BASE_URL, API_KEY);
  });

  describe("listarDatabases", () => {
    it("devuelve lista de nombres de bases de datos", async () => {
      const mockResponse = {
        data: [{ name: "db_sales" }, { name: "db_marketing" }],
      };
      const fetchMock = mockFetch(mockResponse);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      const result = await client.listarDatabases();
      expect(result).toEqual(["db_sales", "db_marketing"]);
    });

    it("soporta respuesta sin wrapper data", async () => {
      const mockResponse = [{ name: "db_analytics" }];
      const fetchMock = mockFetch(mockResponse);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      const result = await client.listarDatabases();
      expect(result).toEqual(["db_analytics"]);
    });
  });

  describe("listarTablas", () => {
    it("devuelve lista de nombres de tablas", async () => {
      const mockResponse = {
        data: [{ name: "orders" }, { name: "customers" }],
      };
      const fetchMock = mockFetch(mockResponse);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      const result = await client.listarTablas("db_sales");
      expect(result).toEqual(["orders", "customers"]);
    });
  });

  describe("listarColumnas", () => {
    it("devuelve schema con columns y schemaSpec", async () => {
      const mockResponse = {
        data: {
          database: "db_sales",
          table: "orders",
          columns: [
            { name: "id", type: "bigint" },
            { name: "amount", type: "decimal" },
          ],
          schemaSpec: "db_sales.orders(id bigint, amount decimal)",
        },
      };
      const fetchMock = mockFetch(mockResponse);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      const result = await client.listarColumnas("db_sales", "orders");
      expect(result.database).toBe("db_sales");
      expect(result.table).toBe("orders");
      expect(result.columns).toHaveLength(2);
      expect(result.schemaSpec).toContain("db_sales.orders");
    });
  });

  describe("listarDataflows", () => {
    it("devuelve array de DataflowRecord", async () => {
      const mockResponse = {
        data: [
          {
            dataflow_id: "df_001",
            app_id: "app_123",
            dataflow_name: "Export Sales",
            description: "Exports sales data",
            target_type: "file",
            target_id: "target_1",
            target_label: "Sales File",
            filename: "sales_export",
            extension: "csv",
            format: "csv",
            treat_as_relative: true,
          },
        ],
      };
      const fetchMock = mockFetch(mockResponse);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      const result = await client.listarDataflows();
      expect(result).toHaveLength(1);
      expect(result[0].dataflow_id).toBe("df_001");
      expect(result[0].dataflow_name).toBe("Export Sales");
      expect(result[0].treat_as_relative).toBe(true);
    });

    it("valida esquema con zod", async () => {
      const mockResponse = {
        data: [{ dataflow_id: "df_bad" }],
      };
      const fetchMock = mockFetch(mockResponse);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      await expect(client.listarDataflows()).rejects.toThrow();
    });
  });

  describe("obtenerDataflow", () => {
    it("devuelve un DataflowRecord por id", async () => {
      const mockResponse = {
        data: {
          dataflow_id: "df_002",
          dataflow_name: "Import Inventory",
          description: "Imports inventory data",
          format: "json",
        },
      };
      const fetchMock = mockFetch(mockResponse);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      const result = await client.obtenerDataflow("df_002");
      expect(result.dataflow_id).toBe("df_002");
      expect(result.dataflow_name).toBe("Import Inventory");
    });
  });

  describe("manejo de errores", () => {
    it("lanza error cuando fetch falla", async () => {
      const fetchMock = mockFetch({ message: "Internal Server Error" }, false);

      Object.defineProperty(globalThis, "fetch", {
        value: fetchMock,
        writable: true,
      });

      await expect(client.listarDatabases()).rejects.toThrow(
        "Destinos API error: 500 Internal Server Error",
      );
    });
  });
});
