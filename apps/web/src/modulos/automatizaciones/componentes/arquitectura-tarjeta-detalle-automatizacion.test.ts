import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = resolve(
  process.cwd(),
  "src/modulos/automatizaciones/componentes",
);
const tarjeta = resolve(directorio, "tarjeta-detalle-automatizacion.tsx");

function contarLineasUtiles(contenido: string) {
  return contenido
    .split("\n")
    .filter((linea) => linea.trim() && !linea.trim().startsWith("//")).length;
}

describe("arquitectura de la tarjeta de automatización", () => {
  it("la tarjeta principal solo compone estado, acciones y detalle", async () => {
    const contenido = await readFile(tarjeta, "utf8");
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(85);
    expect(contenido).not.toContain("useState");
    expect(contenido).not.toContain('role="menu"');
    expect(contenido).not.toContain("calcularDuracion(");
  });

  it("separa modelo, cabecera, acciones, ejecución y metadatos", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "modelo-detalle-automatizacion.ts",
        "cabecera-detalle-automatizacion.tsx",
        "acciones-detalle-automatizacion.tsx",
        "ultima-ejecucion-automatizacion.tsx",
        "metadatos-detalle-automatizacion.tsx",
      ]),
    );
  });
});
