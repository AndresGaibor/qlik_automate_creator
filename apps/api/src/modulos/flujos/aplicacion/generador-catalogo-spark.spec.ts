import { describe, expect, test } from "bun:test";
import {
  construirCatalogoConexionesSpark,
  descubrirRequisitosConexion,
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
    expect(catalogo.jdbc[0].driver).toBe("");
    expect(catalogo.jdbc[0].secreto_nombre).toBe("");
    expect(catalogo.sftp[0].nombre).toBe("Bancolombia prueba:SFTP");
    expect(catalogo.sftp[0].host).toBe("");
    expect(catalogo.sftp[0].usuario).toBe("");
    expect(catalogo.sftp[0].secreto_clave_privada_nombre).toBe("");
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

  test("el catálogo solo incluye secreto_nombre, nunca el valor cifrado ni el texto plano", () => {
    const descubierto = parsearScriptQlik(scriptEjemplo);
    const catalogo = construirCatalogoConexionesSpark(descubierto, [
      {
        tipo: "jdbc",
        nombre: "Bancolombia prueba:Postgres_BanColombia_Prueba",
        config: {
          url: "jdbc:postgresql://origen:5432/bancolombia",
          driver: "org.postgresql.Driver",
          secreto_nombre: "POSTGRES_BANCOLOMBIA",
          secretoValor: "usuario:clave",
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
          secretoClavePrivadaValor: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t...",
        },
      },
    ]);

    expect(catalogo.jdbc[0]).toHaveProperty(
      "secreto_nombre",
      "POSTGRES_BANCOLOMBIA",
    );
    expect(catalogo.jdbc[0]).not.toHaveProperty("secretoValor");
    expect(JSON.stringify(catalogo.jdbc[0])).not.toContain("usuario:clave");

    expect(catalogo.sftp[0]).toHaveProperty(
      "secreto_clave_privada_nombre",
      "SFTP_PRIVATE_KEY_B64",
    );
    expect(catalogo.sftp[0]).not.toHaveProperty("secretoClavePrivadaValor");
    expect(JSON.stringify(catalogo.sftp[0])).not.toContain(
      "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0t",
    );
  });

  test("distingue conexiones JDBC y SFTP con el mismo nombre", () => {
    const descubierto = {
      conexionesJdbc: [{ nombre: "Compartida", allowlist: [] }],
      conexionesSftp: [
        { nombre: "Compartida", rutaBase: "/upload", allowlist: [] },
      ],
      conexionesLocales: [],
    };
    const catalogo = construirCatalogoConexionesSpark(descubierto, [
      {
        tipo: "jdbc",
        nombre: "Compartida",
        config: {
          url: "jdbc:postgresql://db/demo",
          driver: "org.postgresql.Driver",
          secreto_nombre: "JDBC_COMPARTIDA",
        },
      },
      {
        tipo: "sftp",
        nombre: "Compartida",
        config: {
          host: "sftp.internal",
          puerto: 22,
          usuario: "demo",
          secreto_clave_privada_nombre: "SFTP_COMPARTIDA_B64",
          ruta_base: "/upload",
        },
      },
    ]);

    expect(catalogo.jdbc[0].url).toContain("jdbc:postgresql");
    expect(catalogo.sftp[0].host).toBe("sftp.internal");
  });

  test("devuelve todos los requisitos una sola vez y conserva mayusculas", () => {
    const requisitos = descubrirRequisitosConexion(`
      LIB CONNECT TO [Ventas DB];
      SQL SELECT * FROM public.ventas;
      STORE ventas INTO [lib://Salida SFTP/ventas.csv];
      STORE ventas INTO [lib://Salida SFTP/ventas_2.csv];
    `);

    expect(requisitos).toEqual([
      { tipo: "jdbc", nombre: "Ventas DB" },
      { tipo: "sftp", nombre: "Salida SFTP" },
    ]);
  });
});
