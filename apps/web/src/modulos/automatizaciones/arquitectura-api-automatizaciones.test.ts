import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = import.meta.dirname;
const fachada = join(directorio, "api.ts");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de la API de automatizaciones", () => {
  it("api.ts solo conserva la fachada pública", async () => {
    const contenido = await readFile(fachada, "utf8");
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(10);
    expect(contenido).not.toContain("clienteApi.");
    expect(contenido).not.toContain('const RUTA = "/automatizaciones"');
  });

  it("separa creación, operaciones, destinos y workspace", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "api-creacion-automatizacion.ts",
        "api-operaciones-automatizacion.ts",
        "api-destinos-automatizacion.ts",
        "api-workspace-automatizacion.ts",
      ]),
    );
  });
});
