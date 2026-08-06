import { describe, expect, it } from "vitest";
import { construirResumenConfiguracionTecnica } from "./modelo-configuracion-tecnica";

const tenant = {
  host: "https://empresa.us.qlikcloud.com/",
  nombre: "Producción",
  automatizacionPlantillaModo1IdQlik: "m1",
  automatizacionPlantillaModo1Nombre: "Spark principal",
  automatizacionPlantillaModo2IdQlik: null,
  automatizacionPlantillaModo2Nombre: null,
  automatizacionBaseIdQlik: null,
  automatizacionBaseNombre: null,
  impalaHost: null,
};

describe("modelo de configuración técnica", () => {
  it("resume plantillas, entorno y destinos", () => {
    expect(construirResumenConfiguracionTecnica(tenant, 2)).toEqual({
      nombreEntorno: "Producción",
      hostVisible: "empresa.us.qlikcloud.com",
      tienePlantilla: true,
      tieneDestino: true,
      lista: true,
      plantillaModo1: "Spark principal",
      plantillaModo2: "Sin configurar",
      cantidadVisible: "2 conexiones",
    });
  });

  it("usa Impala heredado cuando no existen destinos genéricos", () => {
    expect(
      construirResumenConfiguracionTecnica(
        { ...tenant, impalaHost: "impala.local" },
        0,
      ),
    ).toMatchObject({
      tieneDestino: true,
      cantidadVisible: "Impala configurado",
    });
  });
});
