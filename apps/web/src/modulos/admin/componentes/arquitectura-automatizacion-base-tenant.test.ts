import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = import.meta.dirname;
const seccion = join(directorio, "seccion-automatizacion-base-tenant.tsx");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de plantilla y destinos por tenant", () => {
  it("la sección principal solo consulta y coordina entornos", async () => {
    const contenido = await readFile(seccion, "utf8");
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(75);
    expect(contenido).not.toContain("useState");
    expect(contenido).not.toContain("function ConfiguracionTecnicaPorEntorno");
  });

  it("separa modelo, resumen y editor del entorno", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "modelo-configuracion-tecnica.ts",
        "configuracion-tecnica-entorno.tsx",
        "resumen-configuracion-tecnica.tsx",
        "editor-configuracion-tecnica.tsx",
      ]),
    );
  });
});
