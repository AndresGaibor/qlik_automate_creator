import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = import.meta.dirname;
const fachada = join(directorio, "api.ts");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de la API administrativa", () => {
  it("api.ts solo conserva la fachada pública", async () => {
    const contenido = await readFile(fachada, "utf8");
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(55);
    expect(contenido).not.toContain("clienteApi.");
    expect(contenido).not.toContain('const RUTA = "/admin/tenants"');
  });

  it("separa clientes por dominio administrativo", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "api-organizaciones.ts",
        "api-tenants-qlik.ts",
        "api-configuracion-plataforma.ts",
        "api-oauth.ts",
        "api-superadmins.ts",
        "api-espacios-visibles.ts",
      ]),
    );
  });
});
