import { describe, expect, it } from "vitest";
import {
  construirEntradaConexion,
  crearEstadoDesdeConexion,
  crearEstadoFormularioInicial,
  obtenerConexionesSugeridas,
} from "./modelo-catalogo-origen";

describe("modelo del catálogo de orígenes", () => {
  it("construye el payload JDBC con secretoValor", () => {
    expect(
      construirEntradaConexion({
        ...crearEstadoFormularioInicial(),
        tipo: "jdbc",
        nombre: "Nueva JDBC",
        servidorJdbc: "db.internal",
        puertoJdbc: 5433,
        baseDatosJdbc: "ventas",
        valorSecretoJdbc: "lector:clave",
      }),
    ).toEqual({
      tipo: "jdbc",
      nombre: "Nueva JDBC",
      config: {
        url: "jdbc:postgresql://db.internal:5433/ventas",
        driver: "org.postgresql.Driver",
        secreto_nombre: "JDBC_NUEVA_JDBC",
        propiedades: { fetchsize: "10000" },
        secretoValor: "lector:clave",
      },
    });
  });

  it("construye el payload SFTP con clave privada", () => {
    expect(
      construirEntradaConexion({
        ...crearEstadoFormularioInicial(),
        tipo: "sftp",
        nombre: "Carga SFTP",
        host: "sftp.internal",
        puerto: 2222,
        usuario: "qlik",
        rutaBase: "/upload",
        valorSecretoClavePrivada: "PEM",
      }),
    ).toMatchObject({
      tipo: "sftp",
      config: {
        secreto_clave_privada_nombre: "SFTP_PRIVATE_KEY_CARGA_SFTP",
        secretoClavePrivadaValor: "PEM",
      },
    });
  });

  it("parsea una conexión JDBC al editar", () => {
    expect(
      crearEstadoDesdeConexion({
        id: "c1",
        tipo: "jdbc",
        nombre: "Ventas",
        config: { url: "jdbc:postgresql://db.local:5434/demo" },
      }),
    ).toMatchObject({
      conexionEditandoId: "c1",
      servidorJdbc: "db.local",
      puertoJdbc: 5434,
      baseDatosJdbc: "demo",
    });
  });

  it("deduplica sugerencias válidas de la URL", () => {
    expect(
      obtenerConexionesSugeridas(
        "?conexion=jdbc%3AVentas&conexion=jdbc%3AVentas&conexion=sftp%3AArchivos",
      ),
    ).toEqual([
      { tipo: "jdbc", nombre: "Ventas" },
      { tipo: "sftp", nombre: "Archivos" },
    ]);
  });
});
