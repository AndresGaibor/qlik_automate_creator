import { describe, expect, it } from "bun:test";
import { construirSecretosModo1 } from "./construir-secretos-modo-1.js";

describe("construirSecretosModo1", () => {
  it("conserva JDBC y codifica PEM SFTP exactamente una vez", () => {
    const pem = "-----BEGIN OPENSSH PRIVATE KEY-----";
    const resultado = construirSecretosModo1(
      [
        { tipo: "jdbc", referencia: "JDBC_VENTAS", valor: "lector:clave" },
        { tipo: "sftp", referencia: "SFTP_SALIDA_B64", valor: pem },
      ],
      {
        referencia: "POSTGRES_DESTINO_DEMO",
        usuario: "writer",
        password: "clave-destino",
      },
    );

    expect(resultado).toEqual({
      JDBC_VENTAS: "lector:clave",
      SFTP_SALIDA_B64: Buffer.from(pem, "utf8").toString("base64"),
      POSTGRES_DESTINO_DEMO: "writer:clave-destino",
    });
  });
});
