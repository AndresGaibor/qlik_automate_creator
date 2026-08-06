import { describe, expect, it } from "vitest";
import { crearMetadataDataflow } from "./modelo-visor-flujo";

describe("crearMetadataDataflow", () => {
  it("adapta el resumen de flujo al JSON técnico mostrado", () => {
    expect(
      crearMetadataDataflow({
        id: "flujo-1",
        nombre: "Ventas",
        espacioId: "espacio-1",
        espacioNombre: "Operaciones",
        modificadoEn: "2026-08-06T10:00:00Z",
      }),
    ).toEqual({
      id: "flujo-1",
      name: "Ventas",
      resourceType: "app",
      resourceSubType: "qix-df",
      spaceId: "espacio-1",
      spaceName: "Operaciones",
      updatedAt: "2026-08-06T10:00:00Z",
      engine: "QIX Data Pipeline Engine",
    });
  });

  it("normaliza los campos opcionales", () => {
    const metadata = crearMetadataDataflow({
      id: "flujo-2",
      nombre: "Demo",
      espacioNombre: "",
    });
    expect(metadata.spaceId).toBeNull();
    expect(metadata.spaceName).toBe("Personal");
    expect(metadata.updatedAt).toBeNull();
  });
});
