import { describe, expect, it, vi } from "bun:test";
import type { PuertoQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
import type { ParametrosPlantilla } from "./preparar-parametros-plantilla.js";
import { copiarAutomatizacion } from "./servicio-copia-automatizacion.js";
import type { CrearDesdePlantilla } from "@qlik/contratos/automatizaciones";

type EntradaExtendida = CrearDesdePlantilla & {
  parametros?: ParametrosPlantilla;
  reemplazosWorkspace?: Array<{ ruta: string; valor: unknown }>;
};

function crearMockQlik(mocks?: {
  copiarAutomatizacion?: PuertoQlik["copiarAutomatizacion"];
  obtenerAutomatizacion?: PuertoQlik["obtenerAutomatizacion"];
  actualizarAutomatizacion?: PuertoQlik["actualizarAutomatizacion"];
  eliminarAutomatizacion?: PuertoQlik["eliminarAutomatizacion"];
  cambiarEspacioAutomatizacion?: PuertoQlik["cambiarEspacioAutomatizacion"];
  cambiarPropietarioAutomatizacion?: PuertoQlik["cambiarPropietarioAutomatizacion"];
}) {
  return {
    copiarAutomatizacion:
      mocks?.copiarAutomatizacion ?? vi.fn(async () => ({ id: "copia-id-1" })),
    obtenerAutomatizacion:
      mocks?.obtenerAutomatizacion ??
      vi.fn(async () => ({
        id: "copia-id-1",
        name: "Copia",
        schedules: [],
        workspace: { blocks: [], variables: [] },
        description: "",
        maxConcurrentRuns: 1,
      })),
    actualizarAutomatizacion:
      mocks?.actualizarAutomatizacion ??
      vi.fn(async (_id: string, def: unknown) => ({
        id: "copia-id-1",
        ...(def as Record<string, unknown>),
      })),
    eliminarAutomatizacion:
      mocks?.eliminarAutomatizacion ?? vi.fn(async () => undefined),
    cambiarEspacioAutomatizacion:
      mocks?.cambiarEspacioAutomatizacion ?? vi.fn(async () => undefined),
    cambiarPropietarioAutomatizacion:
      mocks?.cambiarPropietarioAutomatizacion ??
      vi.fn(async () => undefined),
  } as unknown as PuertoQlik;
}

describe("copiarAutomatizacion", () => {
  it("retorna id, nombre y plantillaIdQlik sin error en exito", async () => {
    const qlik = crearMockQlik();

    const resultado = await copiarAutomatizacion(qlik, {
      nombre: "Automatizacion Nueva",
      plantillaIdQlik: "plantilla-1",
    } as CrearDesdePlantilla);

    expect(resultado.id).toBe("copia-id-1");
    expect(resultado.nombre).toBe("Automatizacion Nueva");
    expect(resultado.plantillaIdQlik).toBe("plantilla-1");
    expect(resultado.error).toBeUndefined();
  });

  it("llama a cambiarEspacioAutomatizacion cuando espacioIdQlik esta presente", async () => {
    const qlik = crearMockQlik();

    await copiarAutomatizacion(qlik, {
      nombre: "Nueva",
      plantillaIdQlik: "plantilla-1",
      espacioIdQlik: "espacio-1",
    } as CrearDesdePlantilla);

    expect(qlik.cambiarEspacioAutomatizacion).toHaveBeenCalledWith(
      "copia-id-1",
      "espacio-1",
    );
  });

  it("llama a cambiarPropietarioAutomatizacion cuando propietarioIdQlik presente", async () => {
    const qlik = crearMockQlik();

    await copiarAutomatizacion(qlik, {
      nombre: "Nueva",
      plantillaIdQlik: "plantilla-1",
      propietarioIdQlik: "propietario-1",
    } as CrearDesdePlantilla);

    expect(qlik.cambiarPropietarioAutomatizacion).toHaveBeenCalledWith(
      "copia-id-1",
      "propietario-1",
    );
  });

  it("aplica parametros al clon si se proporcionan", async () => {
    let capturedWorkspace: Record<string, unknown> | undefined;
    const automatizacionClon = {
      id: "copia-id-1",
      name: "Copia",
      schedules: [],
      workspace: {
        variables: [
          { name: "DataflowId", value: "" },
          { name: "DataflowScriptContenido", value: "" },
          { name: "ConexionesContenido", value: "" },
          { name: "EjecucionId", value: "" },
          { name: "TablaDestino", value: "" },
        ],
        blocks: [],
      },
      description: "",
      maxConcurrentRuns: 1,
    };
    const qlik = crearMockQlik({
      obtenerAutomatizacion: vi.fn(async () => automatizacionClon),
      actualizarAutomatizacion: vi.fn(async (_id: string, def: unknown) => {
        capturedWorkspace = (def as Record<string, unknown>)?.workspace as Record<string, unknown>;
        return { id: "copia-id-1", ...(def as Record<string, unknown>) };
      }) as unknown as PuertoQlik["actualizarAutomatizacion"],
    });

    const params: ParametrosPlantilla = {
      modo: 1,
      DataflowId: "flujo-x",
      DataflowScriptContenido: "script-x",
      ConexionesContenido: "{}",
      EjecucionId: "ejec-x",
      TablaDestino: "tabla-x",
    };

    const resultado = await copiarAutomatizacion(qlik, {
      nombre: "Nueva",
      plantillaIdQlik: "plantilla-1",
      parametros: params,
    } as unknown as EntradaExtendida);

    expect(qlik.actualizarAutomatizacion).toHaveBeenCalled();
    expect(capturedWorkspace).toBeDefined();
    const vars = (capturedWorkspace?.variables as Array<{ name: string; value: string }>) ?? [];
    expect(vars.length).toBeGreaterThan(0);
    const dataflowVar = vars.find((v) => v.name === "DataflowId");
    expect(dataflowVar?.value).toBe("flujo-x");
    expect(resultado.error).toBeUndefined();
  });

  it("valida el workspace de la plantilla ANTES de copiar cuando se proporcionan parametros", async () => {
    const plantillaWorkspace = {
      variables: [
        { name: "DataflowId", value: "" },
        { name: "DataflowScriptContenido", value: "" },
        { name: "ConexionesContenido", value: "" },
        { name: "EjecucionId", value: "" },
        { name: "TablaDestino", value: "" },
      ],
      blocks: [],
    };
    const plantillaAutomatizacion = {
      id: "plantilla-1",
      name: "Plantilla",
      schedules: [],
      workspace: plantillaWorkspace,
      description: "",
      maxConcurrentRuns: 1,
    };
    const qlik = crearMockQlik({
      obtenerAutomatizacion: vi.fn(async (id: string) => {
        if (id === "plantilla-1") return plantillaAutomatizacion;
        return {
          id: "copia-id-1",
          name: "Copia",
          schedules: [],
          workspace: { blocks: [], variables: [] },
          description: "",
          maxConcurrentRuns: 1,
        };
      }),
    });

    const params: ParametrosPlantilla = {
      modo: 1,
      DataflowId: "flujo-x",
      DataflowScriptContenido: "script-x",
      ConexionesContenido: "{}",
      EjecucionId: "ejec-x",
      TablaDestino: "tabla-x",
    };

    await copiarAutomatizacion(qlik, {
      nombre: "Nueva",
      plantillaIdQlik: "plantilla-1",
      parametros: params,
    } as unknown as EntradaExtendida);

    expect(qlik.obtenerAutomatizacion).toHaveBeenCalledWith("plantilla-1");
    expect(qlik.copiarAutomatizacion).toHaveBeenCalledWith(
      "plantilla-1",
      "Nueva",
    );
  });

  it("elimina el clon y propaga el error cuando actualizarAutomatizacion falla", async () => {
    const automatizacionClon = {
      id: "copia-id-1",
      name: "Copia",
      schedules: [],
      workspace: {
        variables: [
          { name: "DataflowId", value: "" },
          { name: "DataflowScriptContenido", value: "" },
          { name: "ConexionesContenido", value: "" },
          { name: "EjecucionId", value: "" },
          { name: "TablaDestino", value: "" },
        ],
        blocks: [],
      },
      description: "",
      maxConcurrentRuns: 1,
    };
    const errorActualizacion = new Error("Error al actualizar workspace");
    const qlik = crearMockQlik({
      obtenerAutomatizacion: vi.fn(async () => automatizacionClon),
      actualizarAutomatizacion: vi.fn(async () => {
        throw errorActualizacion;
      }),
    });

    const params: ParametrosPlantilla = {
      modo: 1,
      DataflowId: "flujo-x",
      DataflowScriptContenido: "script-x",
      ConexionesContenido: "{}",
      EjecucionId: "ejec-x",
      TablaDestino: "tabla-x",
    };

    const resultado = await copiarAutomatizacion(qlik, {
      nombre: "Nueva",
      plantillaIdQlik: "plantilla-1",
      parametros: params,
    } as unknown as EntradaExtendida);

    expect(qlik.eliminarAutomatizacion).toHaveBeenCalledWith("copia-id-1");
    expect(resultado.error).toBe(errorActualizacion);
  });

  it("aplica reemplazosWorkspace explícitos junto con parametros", async () => {
    const automatizacionClon = {
      id: "copia-id-1",
      name: "Copia",
      schedules: [],
      workspace: {
        variables: [
          { name: "DataflowId", value: "" },
          { name: "DataflowScriptContenido", value: "" },
          { name: "ConexionesContenido", value: "" },
          { name: "EjecucionId", value: "" },
          { name: "TablaDestino", value: "" },
        ],
        blocks: [
          {
            name: "customBlock",
            type: "SomeBlock",
            settings: { table: "original" },
          },
        ],
      },
      description: "",
      maxConcurrentRuns: 1,
    };
    const qlik = crearMockQlik({
      obtenerAutomatizacion: vi.fn(async () => automatizacionClon),
      actualizarAutomatizacion: vi.fn(async () => automatizacionClon),
    });

    const params: ParametrosPlantilla = {
      modo: 1,
      DataflowId: "flujo-x",
      DataflowScriptContenido: "script-x",
      ConexionesContenido: "{}",
      EjecucionId: "ejec-x",
      TablaDestino: "tabla-x",
    };

    await copiarAutomatizacion(
      qlik,
      {
        nombre: "Nueva",
        plantillaIdQlik: "plantilla-1",
        parametros: params,
        reemplazosWorkspace: [
          { ruta: "/blocks/0/settings/table", valor: "ventas" },
        ],
      } as unknown as EntradaExtendida,
    );

    expect(qlik.actualizarAutomatizacion).toHaveBeenCalledWith(
      "copia-id-1",
      expect.objectContaining({
        workspace: expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({ settings: { table: "ventas" } }),
          ]),
        }),
      }),
    );
  });
});
