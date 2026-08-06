import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";

const fachada = new URL("./esquema.ts", import.meta.url);
const directorio = new URL("./esquema/", import.meta.url);

function contarLineasUtiles(contenido: string) {
  return contenido
    .split("\n")
    .filter((linea) => linea.trim() && !linea.trim().startsWith("//")).length;
}

describe("arquitectura del esquema Drizzle", () => {
  it("esquema.ts solo conserva la fachada pública", async () => {
    const contenido = await Bun.file(fachada).text();
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(10);
    expect(contenido).not.toContain("pgTable(");
    expect(contenido).not.toContain("drizzle-orm/pg-core");
  });

  it("separa tablas por responsabilidad", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "identidad.ts",
        "automatizaciones.ts",
        "catalogo-qlik.ts",
        "conexiones.ts",
        "plataforma.ts",
      ]),
    );
  });
});
