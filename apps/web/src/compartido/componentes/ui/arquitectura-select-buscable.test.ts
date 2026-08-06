import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = import.meta.dirname;
const componente = join(directorio, "select-buscable.tsx");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura del select buscable", () => {
  it("el componente principal coordina disparador y lista", async () => {
    const contenido = await readFile(componente, "utf8");
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(170);
    expect(contenido).not.toContain("opciones.filter");
    expect(contenido).not.toContain("opcionesFiltradas.map");
  });

  it("separa modelo, hook y lista de opciones", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "modelo-select-buscable.ts",
        "use-select-buscable.ts",
        "lista-select-buscable.tsx",
      ]),
    );
  });
});
