import { describe, expect, it } from "vitest";

interface Flujo {
  id: string;
  nombre: string;
  espacio: { id: string; nombre: string };
  modificadoEn: string;
  automatizacion?: {
    existe: boolean;
    id: string;
    nombre: string;
  };
}

describe("PaginaFlujos types", () => {
  it("debe tener la estructura correcta de Flujo", () => {
    const flujo: Flujo = {
      id: "1",
      nombre: "Test Flow",
      espacio: { id: "1", nombre: "Test Space" },
      modificadoEn: new Date().toISOString(),
    };

    expect(flujo.id).toBe("1");
    expect(flujo.nombre).toBe("Test Flow");
    expect(flujo.espacio.nombre).toBe("Test Space");
  });

  it("debe permitir automatizacion opcional", () => {
    const flujoSinAutomatizacion: Flujo = {
      id: "1",
      nombre: "Test Flow",
      espacio: { id: "1", nombre: "Test Space" },
      modificadoEn: new Date().toISOString(),
    };

    const flujoConAutomatizacion: Flujo = {
      id: "2",
      nombre: "Test Flow 2",
      espacio: { id: "1", nombre: "Test Space" },
      modificadoEn: new Date().toISOString(),
      automatizacion: {
        existe: true,
        id: "auto-1",
        nombre: "Mi Automatizacion",
      },
    };

    expect(flujoSinAutomatizacion.automatizacion).toBeUndefined();
    expect(flujoConAutomatizacion.automatizacion?.existe).toBe(true);
  });
});
