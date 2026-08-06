import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const directorio = import.meta.dir;
const coordinador = join(directorio, "rutas-panel.ts");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim().length > 0)
    .length;
}

describe("arquitectura HTTP del panel de automatizaciones", () => {
  it("rutas-panel.ts coordina registradores sin implementar endpoints", async () => {
    const contenido = await Bun.file(coordinador).text();

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(90);
    expect(contenido).not.toMatch(/rutas\.(get|post|put|delete|patch)\(/);
    expect(contenido).not.toContain("prepararParametrosPlantilla");
    expect(contenido).not.toContain("CrearAutomatizacionDesdePlantilla");
  });

  it("separa contratos, autorización, consultas, creación y comandos", async () => {
    const archivos = (await readdir(directorio)).filter((archivo) =>
      /^(tipos|autorizacion|plantilla|registrar)-.*\.ts$/.test(archivo),
    );

    expect(archivos).toEqual(
      expect.arrayContaining([
        "tipos-rutas-panel.ts",
        "autorizacion-panel.ts",
        "plantilla-efectiva.ts",
        "registrar-rutas-consulta-panel.ts",
        "registrar-ruta-crear-desde-plantilla.ts",
        "registrar-rutas-comandos-panel.ts",
      ]),
    );

    for (const archivo of archivos) {
      const contenido = await Bun.file(join(directorio, archivo)).text();
      expect(
        contarLineasUtiles(contenido),
        `${archivo} concentra demasiadas responsabilidades`,
      ).toBeLessThanOrEqual(260);
    }
  });
});
