import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = import.meta.dirname;
const formulario = join(directorio, "formulario-crear-automatizacion.tsx");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura del formulario de creación", () => {
  it("el formulario principal solo coordina modelo y secciones", async () => {
    const contenido = await readFile(formulario, "utf8");
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(130);
    expect(contenido).not.toContain("<SelectBuscable");
    expect(contenido).not.toContain("function Paso");
  });

  it("separa modelo, encabezado, pasos y resumen lateral", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "modelo-formulario-crear-automatizacion.ts",
        "encabezado-nueva-automatizacion.tsx",
        "pasos-nueva-automatizacion.tsx",
        "resumen-lateral-nueva-automatizacion.tsx",
        "paso-formulario-automatizacion.tsx",
      ]),
    );
  });
});
