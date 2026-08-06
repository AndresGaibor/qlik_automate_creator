import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = join(process.cwd(), "src/modulos/origenes");
const pagina = join(directorio, "pagina-catalogo-origen.tsx");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura del catálogo de orígenes", () => {
  it("la página coordina consultas y secciones", async () => {
    const contenido = await readFile(pagina, "utf8");

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(180);
    expect(contenido).not.toContain("<input");
    expect(contenido).not.toContain("<textarea");
    expect(contenido).not.toContain("clienteApi.");
  });

  it("separa modelo, API, formulario, sugerencias y listado", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "modelo-catalogo-origen.ts",
        "api-catalogo-origen.ts",
        "use-formulario-catalogo-origen.ts",
        "formulario-catalogo-origen.tsx",
        "sugerencias-catalogo-origen.tsx",
        "lista-conexiones-origen.tsx",
      ]),
    );
  });
});
