import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = join(process.cwd(), "src/modulos/admin/componentes");
const coordinador = join(directorio, "seccion-setup-tecnico.tsx");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim().length > 0)
    .length;
}

describe("arquitectura del setup técnico", () => {
  it("la sección principal solo coordina pasos y estado", async () => {
    const contenido = await readFile(coordinador, "utf8");

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(180);
    expect(contenido).not.toContain("function PasoQlikCloud");
    expect(contenido).not.toContain("function PasoPlantillaBase");
    expect(contenido).not.toContain("function ImpalaPorEntorno");
    expect(contenido).not.toContain("useMutation");
  });

  it("cada paso vive en un componente con responsabilidad propia", async () => {
    const archivos = (await readdir(directorio)).filter((archivo) =>
      /^setup-tecnico-.*\.tsx$/.test(archivo),
    );

    expect(archivos).toEqual(
      expect.arrayContaining([
        "setup-tecnico-acordeon.tsx",
        "setup-tecnico-qlik.tsx",
        "setup-tecnico-plantilla.tsx",
        "setup-tecnico-destinos.tsx",
      ]),
    );
    for (const archivo of archivos) {
      const contenido = await readFile(join(directorio, archivo), "utf8");
      expect(
        contarLineasUtiles(contenido),
        `${archivo} concentra demasiada presentación`,
      ).toBeLessThanOrEqual(240);
    }
  });
});
