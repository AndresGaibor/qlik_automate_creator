import { describe, expect, it } from "vitest";
import {
  construirOpcionesFlujos,
  resolverSeleccionFormulario,
} from "./modelo-formulario-crear-automatizacion";

const flujo = {
  id: "flujo-1",
  nombre: "Ventas",
  espacioNombre: "Equipo",
};

const automatizacion = {
  id: "auto-1",
  nombre: "Carga Ventas diaria",
};

describe("modelo del formulario de creación", () => {
  it("marca Dataflows ya usados por una automatización", () => {
    expect(construirOpcionesFlujos([flujo], [automatizacion as never])).toEqual(
      [
        expect.objectContaining({
          id: "flujo-1",
          badgeAviso: 'Ya se usa en "Carga Ventas diaria"',
        }),
      ],
    );
  });

  it("resuelve selecciones y bloqueo del recurso", () => {
    expect(
      resolverSeleccionFormulario({
        flujoId: "flujo-1",
        tablaId: "tabla_ventas",
        destinoId: "destino-1",
        flujos: [flujo],
        tablas: [
          {
            id: "tabla-1",
            nombre: "tabla_ventas",
            tipo: "tabla",
            metadatos: {},
          },
        ],
        conexiones: [
          {
            id: "destino-1",
            nombre: "Producción",
            tipo: "postgres",
            estado: "activo",
          },
        ],
        requiereDestino: true,
        isLoadingTablas: false,
      }),
    ).toMatchObject({
      flujoNombre: "Ventas",
      conexionNombre: "Producción",
      recursoNombre: "tabla_ventas",
      destinoBloqueado: false,
    });
  });
});
