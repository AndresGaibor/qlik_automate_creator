import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = import.meta.dirname;
const seccion = join(directorio, "seccion-configurar-destinos-tenant.tsx");

function contarLineasUtiles(contenido: string): number {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de destinos por tenant", () => {
  it("la sección principal solo coordina resumen y formulario", async () => {
    const contenido = await readFile(seccion, "utf8");

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(100);
    expect(contenido).not.toContain("useMutation");
    expect(contenido).not.toContain("<input");
    expect(contenido).not.toContain("<select");
  });

  it("separa modelo, hook, resumen, formulario y campos", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "modelo-destino-tenant.ts",
        "use-destino-tenant.ts",
        "resumen-destinos-tenant.tsx",
        "formulario-destino-tenant.tsx",
        "campos-destino-tenant.tsx",
      ]),
    );
  });
});
