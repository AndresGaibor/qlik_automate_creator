import { describe, expect, test } from "bun:test";
import {
  construirCatalogoConexionesSpark,
  parsearScriptQlik,
} from "./generador-catalogo-spark.js";

describe("Parser y Generador de Catálogos Spark", () => {
  const scriptEjemplo = `
///$tab Main
LIB CONNECT TO [Bancolombia prueba:Postgres_BanColombia_Prueba];

SELECT
    "venta_id",
    "fecha_venta"
FROM "demo_dataflow"."ventas_2025";

SELECT
    "venta_id"
FROM "demo_dataflow"."ventas_2026";

SELECT * FROM "demo_dataflow"."clientes";

STORE [Filtro 1_REJECT]
INTO [lib://Bancolombia prueba:SFTP//upload/ventas_rechazadas.csv] (txt);

STORE [Filtro 2_CURATED]
INTO [lib://Bancolombia prueba:SFTP//upload/ventas_curadas.csv] (txt);
  `;

  test("debe parsear correctamente tablas JDBC y salidas SFTP", () => {
    const descubierto = parsearScriptQlik(scriptEjemplo);

    expect(descubierto.conexionesJdbc).toHaveLength(1);
    expect(descubierto.conexionesJdbc[0].nombre).toBe(
      "Bancolombia prueba:Postgres_BanColombia_Prueba",
    );
    expect(descubierto.conexionesJdbc[0].allowlist).toEqual([
      {
        esquema: "demo_dataflow",
        tabla: "ventas_2025",
        campos: ["venta_id", "fecha_venta"],
      },
      {
        esquema: "demo_dataflow",
        tabla: "ventas_2026",
        campos: ["venta_id"],
      },
      { esquema: "demo_dataflow", tabla: "clientes", campos: [] },
    ]);

    expect(descubierto.conexionesSftp).toHaveLength(1);
    expect(descubierto.conexionesSftp[0].nombre).toBe(
      "Bancolombia prueba:SFTP",
    );
    expect(descubierto.conexionesSftp[0].allowlist).toEqual([
      { esquema: "", tabla: "ventas_rechazadas.csv", campos: [] },
      { esquema: "", tabla: "ventas_curadas.csv", campos: [] },
    ]);
  });

  test("debe construir la estructura final en formato exacto para Spark", () => {
    const descubierto = parsearScriptQlik(scriptEjemplo);
    const catalogo = construirCatalogoConexionesSpark(descubierto, []);

    expect(catalogo.version).toBe(1);
    expect(catalogo.descripcion).toBe(
      "Dataflow Bancolombia ejecutado por Spark",
    );
    expect(catalogo.jdbc[0].nombre).toBe(
      "Bancolombia prueba:Postgres_BanColombia_Prueba",
    );
    expect(catalogo.jdbc[0].driver).toBe("org.postgresql.Driver");
    expect(catalogo.sftp[0].nombre).toBe("Bancolombia prueba:SFTP");
    expect(catalogo.sftp[0].host).toBe("__SFTP_HOST__");
  });

  test("debe combinar los datos técnicos del catálogo por nombre", () => {
    const descubierto = parsearScriptQlik(scriptEjemplo);
    const catalogo = construirCatalogoConexionesSpark(descubierto, [
      {
        tipo: "jdbc",
        nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
        config: {
          url: "jdbc:postgresql://origen:5432/bancolombia",
          driver: "org.postgresql.Driver",
          secreto_nombre: "POSTGRES_BANCOLOMBIA",
          propiedades: { fetchsize: "10000" },
        },
      },
      {
        tipo: "sftp",
        nombre: "Bancolombia prueba:SFTP",
        config: {
          host: "sftp.bancolombia.test",
          puerto: 22,
          usuario: "sftpqlik",
          secreto_clave_privada_nombre: "SFTP_PRIVATE_KEY_B64",
        },
      },
    ]);

    expect(catalogo.jdbc[0]).toMatchObject({
      nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
      url: "jdbc:postgresql://origen:5432/bancolombia",
      secreto_nombre: "POSTGRES_BANCOLOMBIA",
    });
    expect(catalogo.jdbc[0].allowlist[0]).toEqual({
      esquema: "demo_dataflow",
      tabla: "ventas_2025",
      campos: ["venta_id", "fecha_venta"],
    });
    expect(catalogo.sftp[0]).toMatchObject({
      nombre: "Bancolombia prueba:SFTP",
      host: "sftp.bancolombia.test",
      secreto_clave_privada_nombre: "SFTP_PRIVATE_KEY_B64",
    });
  });
});
