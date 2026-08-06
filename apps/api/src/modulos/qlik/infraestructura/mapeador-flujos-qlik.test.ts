import { describe, expect, it } from "bun:test";
import { mapearItemsAFlujos } from "./mapeador-flujos-qlik.js";

describe("mapearItemsAFlujos", () => {
  it("conserva únicamente Dataflows y normaliza sus campos", () => {
    const flujos = mapearItemsAFlujos({
      data: [
        {
          id: "item-1",
          resourceId: "flujo-1",
          resourceSubType: "qix-df",
          name: "Ventas",
          spaceId: "espacio-1",
          ownerId: "usuario-1",
          resourceCreatedAt: "2026-08-01T10:00:00Z",
        },
        {
          id: "app-1",
          resourceSubType: "qix-app",
          name: "Aplicación común",
        },
      ],
    });

    expect(flujos).toEqual([
      {
        id: "flujo-1",
        name: "Ventas",
        spaceId: "espacio-1",
        ownerId: "usuario-1",
        createdAt: "2026-08-01T10:00:00Z",
        updatedAt: undefined,
      },
    ]);
  });

  it("reconoce Dataflows por atributos de uso", () => {
    expect(
      mapearItemsAFlujos({
        data: [
          {
            id: "flujo-custom",
            name: "Preparación",
            resourceCustomAttributes: { usage: "DATAFLOW_PREP" },
          },
          {
            id: "flujo-attributes",
            name: "Preparación 2",
            resourceAttributes: { usage: "DATAFLOW_PREP" },
          },
        ],
      }),
    ).toHaveLength(2);
  });

  it("devuelve una lista vacía ante respuestas incompatibles", () => {
    expect(mapearItemsAFlujos(null)).toEqual([]);
    expect(mapearItemsAFlujos({ data: "invalida" })).toEqual([]);
  });
});
