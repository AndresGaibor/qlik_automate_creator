import { describe, expect, it } from "bun:test";
import { PreflightAutomatizacion } from "./preflight-automatizacion.js";

const SCRIPT = `
LIB CONNECT TO [Ventas DB];
SQL SELECT * FROM public.ventas;
STORE ventas INTO [lib://Salida SFTP/ventas.csv];
`;

const SCRIPT_BANCOLOMBIA = `
LIB CONNECT TO [Bancolombia prueba:Postgres_BanColombia_Prueba];
SQL SELECT * FROM public.ventas;
STORE ventas INTO [lib://Bancolombia prueba:SFTP/ventas.csv];
`;

describe("PreflightAutomatizacion", () => {
  it("asocia por tipo y nombre y lista solo destinos Postgres", async () => {
    const preflight = new PreflightAutomatizacion(
      { obtenerScriptApp: async () => ({ script: SCRIPT }) },
      {
        listar: async () => [
          {
            id: "11111111-1111-4111-8111-111111111111",
            tipo: "jdbc",
            nombre: "Ventas DB",
            estado: "disponible",
            probadaEn: new Date("2026-08-06T12:00:00.000Z"),
            mensajeError: null,
          },
          {
            id: "22222222-2222-4222-8222-222222222222",
            tipo: "sftp",
            nombre: "Salida SFTP",
            estado: "error",
            probadaEn: new Date("2026-08-06T12:00:00.000Z"),
            mensajeError: "No disponible",
          },
        ],
      },
      {
        listar: async () => [
          {
            id: "33333333-3333-4333-8333-333333333333",
            tipo: "postgres",
            nombre: "Destino PG",
            estado: "activo",
            probadaEn: new Date("2026-08-06T12:00:00.000Z"),
            mensajeError: null,
          },
          {
            id: "44444444-4444-4444-8444-444444444444",
            tipo: "impala",
            nombre: "Impala",
            estado: "activo",
            probadaEn: null,
            mensajeError: null,
          },
        ],
      },
    );

    const resultado = await preflight.ejecutar({
      organizacionId: "org-1",
      flujoId: "flujo-1",
      flujoNombre: "Ventas",
    });

    expect(resultado.conexionesRequeridas).toEqual([
      expect.objectContaining({ tipo: "jdbc", estado: "disponible" }),
      expect.objectContaining({ tipo: "sftp", estado: "error" }),
    ]);
    expect(resultado.destinosPostgres).toHaveLength(1);
    expect(JSON.stringify(resultado)).not.toMatch(
      /password|PRIVATE KEY|usuario:clave/,
    );
  });

  it("marca como incompleta una conexión registrada sin secreto", async () => {
    const preflight = new PreflightAutomatizacion(
      { obtenerScriptApp: async () => ({ script: SCRIPT }) },
      {
        listar: async () => [
          {
            id: "11111111-1111-4111-8111-111111111111",
            tipo: "jdbc",
            nombre: "Ventas DB",
            estado: "error" as const,
            secretoConfigurado: false,
            probadaEn: new Date("2026-08-06T12:00:00.000Z"),
            mensajeError: "No se pudo conectar con el origen configurado",
          },
        ],
      },
      { listar: async () => [] },
    );

    const resultado = await preflight.ejecutar({
      organizacionId: "org-1",
      flujoId: "flujo-1",
      flujoNombre: "Ventas",
    });

    expect(resultado.conexionesRequeridas[0]).toMatchObject({
      estado: "incompleta",
      conexionId: "11111111-1111-4111-8111-111111111111",
      probadaEn: null,
      mensaje: "Falta configurar la credencial segura",
    });
  });

  it("expone estados, fecha y aislamiento organizacional sin filtrar configuración", async () => {
    const origenes = {
      listar: async (organizacionId: string) =>
        organizacionId === "org-bancolombia"
          ? [
              {
                id: "11111111-1111-4111-8111-111111111111",
                tipo: "jdbc",
                nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
                estado: "sin_probar" as const,
                probadaEn: null,
                mensajeError: null,
              },
              {
                id: "22222222-2222-4222-8222-222222222222",
                tipo: "sftp",
                nombre: "Bancolombia prueba:SFTP",
                estado: "error" as const,
                probadaEn: new Date("2026-08-06T12:00:00.000Z"),
                mensajeError: "No fue posible abrir la conexión SFTP",
              },
            ]
          : [
              {
                id: "99999999-9999-4999-8999-999999999999",
                tipo: "jdbc",
                nombre: "Otra organización:Postgres_BanColombia_Prueba",
                estado: "disponible" as const,
                probadaEn: new Date("2026-08-06T12:00:00.000Z"),
                mensajeError: null,
              },
            ],
    };
    const preflight = new PreflightAutomatizacion(
      { obtenerScriptApp: async () => ({ script: SCRIPT_BANCOLOMBIA }) },
      origenes,
      { listar: async () => [] },
    );

    const resultado = await preflight.ejecutar({
      organizacionId: "org-bancolombia",
      flujoId: "flujo-1",
      flujoNombre: "Bancolombia",
    });
    const resultadoOtraOrganizacion = await preflight.ejecutar({
      organizacionId: "org-otra",
      flujoId: "flujo-1",
      flujoNombre: "Bancolombia",
    });
    const resultadoMismoNombre = await preflight.ejecutar({
      organizacionId: "org-bancolombia",
      flujoId: "flujo-1",
      flujoNombre: "Bancolombia",
    });

    expect(resultado.conexionesRequeridas).toEqual([
      expect.objectContaining({
        tipo: "jdbc",
        nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
        estado: "sin_probar",
        conexionId: "11111111-1111-4111-8111-111111111111",
        probadaEn: null,
      }),
      expect.objectContaining({
        tipo: "sftp",
        nombre: "Bancolombia prueba:SFTP",
        estado: "error",
        conexionId: "22222222-2222-4222-8222-222222222222",
        probadaEn: "2026-08-06T12:00:00.000Z",
        mensaje: "No fue posible abrir la conexión SFTP",
      }),
    ]);
    expect(resultadoOtraOrganizacion.conexionesRequeridas[0]).toMatchObject({
      estado: "faltante",
      conexionId: null,
      probadaEn: null,
    });
    expect(resultadoMismoNombre.conexionesRequeridas).toEqual([
      expect.objectContaining({
        tipo: "jdbc",
        conexionId: "11111111-1111-4111-8111-111111111111",
      }),
      expect.objectContaining({
        tipo: "sftp",
        conexionId: "22222222-2222-4222-8222-222222222222",
      }),
    ]);
    expect(JSON.stringify(resultado)).not.toMatch(
      /password|PRIVATE KEY|usuario:clave|jdbc:postgresql:\/\//,
    );
  });
});
