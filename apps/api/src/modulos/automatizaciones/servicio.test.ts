import { beforeEach, describe, expect, it, vi } from "bun:test";
import type { ClienteDestinos } from "../../../infraestructura/destinos-api/cliente.js";
import type { ClienteQlik } from "../../../infraestructura/qlik/cliente.js";
import type { CrearAutomatizacionInput } from "./servicio.js";

const mockDb = {
  insert: vi.fn().mockReturnValue({
    values: vi.fn().mockReturnValue({
      returning: vi.fn().mockResolvedValue([{ id: "config-id" }]),
    }),
  }),
  select: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([{ id: "config-id", nombre: "Test" }]),
    }),
  }),
  update: vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([{ id: "config-id" }]),
    }),
  }),
  query: {
    configuracionesAutomatizacion: {
      findMany: vi.fn().mockResolvedValue([
        { id: "config-1", nombre: "Automatizacion 1" },
        { id: "config-2", nombre: "Automatizacion 2" },
      ]),
    },
  },
};

vi.mock("../../../infraestructura/base-datos/conexion.js", () => ({
  get db() {
    return mockDb;
  },
}));

vi.mock("../../../infraestructura/base-datos/esquema.js", () => ({
  get configuracionesAutomatizacion() {
    return {};
  },
  get programacionesAutomatizacion() {
    return {};
  },
  get auditoriaEventos() {
    return {};
  },
}));

const mockClienteQlik = {
  listarFlujos: vi
    .fn()
    .mockResolvedValue([{ id: "flujo-1", name: "Flujo Test" }]),
  crearAutomatizacion: vi.fn().mockResolvedValue({ id: "aut-qlik-123" }),
  ejecutarAutomatizacion: vi.fn().mockResolvedValue({ runId: "run-123" }),
} as unknown as ClienteQlik;

const mockClienteDestinos = {
  listarDatabases: vi.fn().mockResolvedValue(["db1", "db2"]),
} as unknown as ClienteDestinos;

describe("ServicioAutomatizaciones", () => {
  let servicio: ServicioAutomatizaciones;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { ServicioAutomatizaciones: Servicio } = await import(
      "./servicio.js"
    );
    servicio = new Servicio(mockClienteQlik, mockClienteDestinos);
  });

  describe("crear", () => {
    it("crea automatizacion con datos validos", async () => {
      const input: CrearAutomatizacionInput = {
        nombre: "Mi Automatizacion",
        flujoIdQlik: "flujo-1",
        flujoNombre: "Flujo Test",
        flujoEspacioId: "espacio-1",
        destinoProveedor: "impala",
        destinoIdExterno: "db1.tabla1",
        destinoNombre: "Tabla 1",
      };

      const resultado = await servicio.crear(
        input,
        "usuario-1",
        "tenant-1",
        "org-1",
      );

      expect(resultado).toBeDefined();
      expect(mockClienteQlik.crearAutomatizacion).toHaveBeenCalled();
    });
  });

  describe("listar", () => {
    it("lista configuraciones por tenant", async () => {
      const resultados = await servicio.listar("tenant-1");
      expect(resultados).toHaveLength(2);
    });
  });

  describe("obtener", () => {
    it("obtiene configuracion por id", async () => {
      const resultado = await servicio.obtener("config-id");
      expect(resultado).toBeDefined();
      expect(resultado?.id).toBe("config-id");
    });
  });

  describe("ejecutar", () => {
    it("ejecuta automatizacion y devuelve runId", async () => {
      mockClienteQlik.ejecutarAutomatizacion = vi.fn().mockResolvedValue({
        runId: "run-ejec-456",
      });

      mockDb.select = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: "config-id",
              nombre: "Test",
              automatizacionIdQlik: "aut-qlik-123",
            },
          ]),
        }),
      });

      const resultado = await servicio.ejecutar(
        "config-id",
        "usuario-1",
        "org-1",
      );

      expect(resultado.runId).toBe("run-ejec-456");
      expect(mockClienteQlik.ejecutarAutomatizacion).toHaveBeenCalledWith(
        "aut-qlik-123",
      );
    });

    it("lanza error si no existe configuracion", async () => {
      mockDb.select = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(
        servicio.ejecutar("no-existe", "usuario-1", "org-1"),
      ).rejects.toThrow("Configuración no encontrada");
    });

    it("lanza error si no tiene automatizacionIdQlik", async () => {
      mockDb.select = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([
            {
              id: "config-id",
              automatizacionIdQlik: null,
            },
          ]),
        }),
      });

      await expect(
        servicio.ejecutar("config-id", "usuario-1", "org-1"),
      ).rejects.toThrow("La automatización no tiene ID de Qlik");
    });
  });
});
