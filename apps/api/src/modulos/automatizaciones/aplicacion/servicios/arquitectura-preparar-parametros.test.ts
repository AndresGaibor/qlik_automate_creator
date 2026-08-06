import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const directorio = join(
  process.cwd(),
  "apps/api/src/modulos/automatizaciones/aplicacion/servicios",
);
const coordinador = join(directorio, "preparar-parametros-plantilla.ts");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de preparación de parámetros", () => {
  it("el coordinador solo despacha por modo", async () => {
    const contenido = await Bun.file(coordinador).text();

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(50);
    expect(contenido).not.toContain("new ErrorAplicacion");
    expect(contenido).not.toContain("parsearScriptQlik");
    expect(contenido).not.toContain("construirSecretosModo1");
  });

  it("separa contratos, modos y resolución de conexiones", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "tipos-parametros-plantilla.ts",
        "utiles-parametros-plantilla.ts",
        "resolver-origenes-modo-1.ts",
        "resolver-destino-postgres-modo-1.ts",
        "preparar-parametros-modo-1.ts",
        "preparar-parametros-modo-2.ts",
      ]),
    );
  });
});
