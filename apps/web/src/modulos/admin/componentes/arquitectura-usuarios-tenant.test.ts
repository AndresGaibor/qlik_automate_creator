import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = import.meta.dirname;
const seccion = join(directorio, "seccion-usuarios.tsx");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de usuarios por tenant", () => {
  it("la sección principal solo coordina vistas y diálogos", async () => {
    const contenido = await readFile(seccion, "utf8");
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(100);
    expect(contenido).not.toContain("useState");
    expect(contenido).not.toContain("<table");
    expect(contenido).not.toContain("function SelectorRol");
  });

  it("separa confirmaciones, cabecera, selector y lista", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "use-confirmacion-usuario.ts",
        "cabecera-usuarios-tenant.tsx",
        "selector-rol-usuario.tsx",
        "lista-usuarios-tenant.tsx",
        "tipos-usuarios-tenant.ts",
      ]),
    );
  });
});
