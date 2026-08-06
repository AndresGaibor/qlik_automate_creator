import { describe, expect, it } from "bun:test";
import { esquemaConfiguracionTenant } from "./panel.js";
import {
  esquemaEntradaCrearModo1,
  esquemaPreflightAutomatizacion,
  esquemaRequisitoConexionOrigen,
} from "./preflight.js";

describe("contratos de preflight", () => {
  it("no admite secretos ni valores de plantilla en la entrada Modo 1", () => {
    const entrada = esquemaEntradaCrearModo1.parse({
      nombre: "Ventas demo",
      flujoId: "f16387d7-63af-484f-b267-f3856540dbe6",
      destinoId: "942b04fb-1bc0-49de-9708-8d189632cc08",
      SECRETOSJSON: "sensible",
      DFScript: "script cliente",
      tablaId: "public.ventas",
    });

    expect(entrada).toEqual({
      nombre: "Ventas demo",
      flujoId: "f16387d7-63af-484f-b267-f3856540dbe6",
      destinoId: "942b04fb-1bc0-49de-9708-8d189632cc08",
    });
  });

  it("valida un preflight sin configuracion sensible", () => {
    const resultado = esquemaPreflightAutomatizacion.parse({
      flujo: { id: "flujo-1", nombre: "Ventas" },
      conexionesRequeridas: [
        {
          tipo: "sftp",
          nombre: "Salida SFTP",
          estado: "faltante",
          conexionId: null,
          probadaEn: null,
          mensaje: null,
        },
      ],
      destinosPostgres: [],
    });

    expect(JSON.stringify(resultado)).not.toMatch(
      /password|privateKey|secretoValor/,
    );
  });

  it("acepta una conexión registrada sin credencial segura", () => {
    expect(
      esquemaRequisitoConexionOrigen.parse({
        tipo: "jdbc",
        nombre: "Ventas DB",
        estado: "incompleta",
        conexionId: "11111111-1111-4111-8111-111111111111",
        probadaEn: null,
        mensaje: "Falta configurar la credencial segura",
      }),
    ).toMatchObject({ estado: "incompleta" });
  });

  it("expone probadaEn en el requisito de conexion de origen", () => {
    expect(
      esquemaRequisitoConexionOrigen.parse({
        tipo: "jdbc",
        nombre: "Ventas DB",
        estado: "sin_probar",
        conexionId: "11111111-1111-4111-8111-111111111111",
        probadaEn: null,
        mensaje: null,
      }),
    ).toMatchObject({ probadaEn: null });
  });

  it("expone permisos de administracion de conexiones del tenant", () => {
    expect(
      esquemaConfiguracionTenant.parse({
        modoAutomatizacionActivo: 1,
        plantillaEfectivaIdQlik: "plantilla-1",
        plantillaEfectivaNombre: "Modo 1",
        configurada: true,
        puedeAdministrarConexiones: false,
      }),
    ).toMatchObject({ puedeAdministrarConexiones: false });
  });
});
