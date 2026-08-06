import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const directorio = import.meta.dir;
const fachada = join(directorio, "repositorio-administracion-postgres.ts");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura del repositorio de administración", () => {
  it("la clase principal solo actúa como fachada", async () => {
    const contenido = await Bun.file(fachada).text();

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(260);
    expect(contenido).not.toContain('from "drizzle-orm"');
    expect(contenido).not.toContain("plataforma/persistencia/esquema");
  });

  it("separa configuración global y superadministradores", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "consulta-configuracion-plataforma-postgres.ts",
        "consulta-superadmin-postgres.ts",
      ]),
    );
  });
});
