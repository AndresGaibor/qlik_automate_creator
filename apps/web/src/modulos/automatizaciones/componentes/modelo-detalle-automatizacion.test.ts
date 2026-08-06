import { describe, expect, it } from "vitest";
import { resolverEstadoGeneralAutomatizacion } from "./modelo-detalle-automatizacion";

const finalizada = {
  id: "run-1",
  estado: "finished",
  iniciadoEn: "2026-08-05T10:00:00.000Z",
  finalizadoEn: "2026-08-05T10:01:00.000Z",
};

describe("estado general de automatización", () => {
  it("prioriza la ejecución activa", () => {
    expect(resolverEstadoGeneralAutomatizacion(true, true, finalizada)).toEqual(
      { etiqueta: "Ejecutándose", tono: "progreso" },
    );
  });

  it("presenta inactivo antes de revisar el último resultado", () => {
    expect(
      resolverEstadoGeneralAutomatizacion(false, false, {
        ...finalizada,
        estado: "failed",
      }),
    ).toEqual({ etiqueta: "Inactivo", tono: "neutral" });
  });

  it("marca atención cuando la última ejecución falló", () => {
    expect(
      resolverEstadoGeneralAutomatizacion(true, false, {
        ...finalizada,
        estado: "failed",
      }),
    ).toEqual({ etiqueta: "Requiere atención", tono: "error" });
  });

  it("presenta disponible en el estado normal", () => {
    expect(
      resolverEstadoGeneralAutomatizacion(true, false, finalizada),
    ).toEqual({ etiqueta: "Disponible", tono: "exito" });
  });
});
