import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const directorio = import.meta.dir;
const rutaApp = join(directorio, "../../app.ts");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim().length > 0)
    .length;
}

describe("composition root", () => {
  it("app.ts solo delega la construcción de la aplicación", async () => {
    const contenido = await Bun.file(rutaApp).text();

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(40);
    expect(contenido).toContain("./plataforma/composicion/publico.js");
    expect(contenido).not.toMatch(/\.route\(|\.use\(/);
    expect(contenido).not.toMatch(
      /new\s+(Repositorio|Cliente|Gestionar|Probar)/,
    );
    expect(contenido).not.toContain("plataforma/persistencia");
  });

  it("la composición se reparte en archivos con una responsabilidad acotada", async () => {
    const archivos = (await readdir(directorio))
      .filter((archivo) => archivo.endsWith(".ts"))
      .filter((archivo) => !archivo.endsWith(".test.ts"));

    expect(archivos.length).toBeGreaterThanOrEqual(4);
    for (const archivo of archivos) {
      const contenido = await Bun.file(join(directorio, archivo)).text();
      expect(
        contarLineasUtiles(contenido),
        `${archivo} concentra demasiadas responsabilidades`,
      ).toBeLessThanOrEqual(280);
    }
  });
});
