import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = join(
  process.cwd(),
  "src/modulos/automatizaciones/componentes",
);
const visor = join(directorio, "visor-workspace.tsx");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura del visor de workspace", () => {
  it("el visor coordina modelo y secciones", async () => {
    const contenido = await readFile(visor, "utf8");

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(180);
    expect(contenido).not.toContain("function ValorCelda");
    expect(contenido).not.toContain("function BloqueCard");
    expect(contenido).not.toContain("JSON.stringify");
  });

  it("separa valores, bloques, variables y referencias", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "workspace-valor.tsx",
        "workspace-bloque-card.tsx",
        "workspace-variable-card.tsx",
        "workspace-referencias.tsx",
      ]),
    );
  });
});
