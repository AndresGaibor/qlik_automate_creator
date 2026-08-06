import { describe, expect, it } from "vitest";
import { crearResumenConfiguracion } from "./utiles-estado-configuracion";

describe("crearResumenConfiguracion", () => {
  it("resume las ocho secciones de Qlik Automate con espacios e Impala", () => {
    const resumen = crearResumenConfiguracion({
      empresaActiva: true,
      cantidadUsuarios: 2,
      qlik: { conectado: true, host: "empresa.us.qlikcloud.com" },
      oauth: { estado: "verificada" },
      plantilla: { configurada: true, nombre: "Plantilla principal" },
      impala: { conectada: true, host: "impala.local" },
    });

    expect(resumen.map((item) => item.id)).toEqual([
      "general",
      "qlik",
      "espacios",
      "oauth",
      "plantilla",
      "impala",
      "origenes",
      "usuarios",
    ]);
    expect(resumen.find((item) => item.id === "impala")).toMatchObject({
      etiqueta: "Impala",
      estado: "Conectada",
      completo: true,
    });
  });
});
