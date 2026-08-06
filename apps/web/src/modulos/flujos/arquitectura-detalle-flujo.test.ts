import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = join(process.cwd(), "src/modulos/flujos");
const pagina = join(directorio, "pagina-detalle-flujo.tsx");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de detalle de flujo", () => {
  it("la página coordina datos y paneles sin implementar cada pestaña", async () => {
    const contenido = await readFile(pagina, "utf8");

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(180);
    expect(contenido).not.toContain("navigator.clipboard");
    expect(contenido).not.toContain("<pre");
    expect(contenido).not.toContain("<details");
  });

  it("separa modelo, consultas, navegación y paneles", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "modelo-detalle-flujo.ts",
        "use-detalle-flujo.ts",
        "detalle-flujo-encabezado.tsx",
        "detalle-flujo-navegacion.tsx",
        "detalle-flujo-panel-script.tsx",
        "detalle-flujo-panel-spark.tsx",
        "detalle-flujo-panel-metadata.tsx",
        "detalle-flujo-panel-automatizacion.tsx",
      ]),
    );
  });
});
