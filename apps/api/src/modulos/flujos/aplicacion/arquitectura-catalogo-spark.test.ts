import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const directorio = join(
  process.cwd(),
  "apps/api/src/modulos/flujos/aplicacion",
);
const fachada = join(directorio, "generador-catalogo-spark.ts");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura del catálogo Spark", () => {
  it("el generador público solo expone la fachada", async () => {
    const contenido = await Bun.file(fachada).text();

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(30);
    expect(contenido).not.toContain("script.split");
    expect(contenido).not.toContain("new Map");
  });

  it("separa contratos, parsing y construcción", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "tipos-catalogo-spark.ts",
        "parser-script-qlik.ts",
        "constructor-catalogo-spark.ts",
      ]),
    );
  });
});
