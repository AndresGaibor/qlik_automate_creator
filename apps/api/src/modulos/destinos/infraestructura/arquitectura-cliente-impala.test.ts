import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";

const directorio = new URL(".", import.meta.url);
const cliente = new URL("./cliente-impala-directo.ts", import.meta.url);

function contarLineasUtiles(contenido: string) {
  return contenido
    .split("\n")
    .filter((linea) => linea.trim() && !linea.trim().startsWith("//")).length;
}

describe("arquitectura del cliente Impala", () => {
  it("el cliente adapta el puerto sin implementar Thrift ni parsing", async () => {
    const contenido = await Bun.file(cliente).text();
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(115);
    expect(contenido).not.toContain('require("hive-driver")');
    expect(contenido).not.toContain("rowSet.columns");
    expect(contenido).not.toContain("new hive.HiveClient");
  });

  it("separa configuración, ejecución, resultados y esquema", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "configuracion-impala.ts",
        "ejecutor-hive-impala.ts",
        "modelo-resultados-hive.ts",
        "modelo-esquema-impala.ts",
      ]),
    );
  });
});
