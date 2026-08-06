import { describe, expect, it } from "vitest";
import {
  buscarAutomatizacionVinculada,
  construirMetadataDataflow,
  urlCatalogoConexiones,
} from "./modelo-detalle-flujo";

const flujo = {
  id: "flujo-123",
  nombre: "Ventas Diarias",
  espacioId: "espacio-1",
  espacioNombre: "Finanzas",
  modificadoEn: "2026-08-06T12:00:00.000Z",
};

describe("modelo del detalle de flujo", () => {
  it("vincula por id o nombre sin distinguir mayúsculas", () => {
    const automatizaciones = [
      { id: "a1", nombre: "Carga VENTAS DIARIAS" },
      { id: "a2", nombre: "flujo-999" },
    ];

    expect(buscarAutomatizacionVinculada(automatizaciones, flujo)).toEqual(
      automatizaciones[0],
    );
  });

  it("construye metadata estable del Dataflow", () => {
    expect(construirMetadataDataflow(flujo)).toEqual({
      id: "flujo-123",
      name: "Ventas Diarias",
      resourceType: "app",
      resourceSubType: "qix-df",
      spaceId: "espacio-1",
      spaceName: "Finanzas",
      updatedAt: "2026-08-06T12:00:00.000Z",
      engine: "QIX Data Pipeline Engine",
    });
  });

  it("genera filtros solo para conexiones JDBC y SFTP reconocidas", () => {
    expect(
      urlCatalogoConexiones([
        'Base de Datos / JDBC: "ventas"',
        'Servidor SFTP: "archivos"',
        "otra referencia",
      ]),
    ).toBe("/configuracion?conexion=jdbc%3Aventas&conexion=sftp%3Aarchivos");
  });
});
