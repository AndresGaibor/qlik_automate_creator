import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = join(process.cwd(), "src/app");
const layout = join(directorio, "layout-principal.tsx");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura del layout principal", () => {
  it("el layout solo coordina acceso, cabecera y contenido", async () => {
    const contenido = await readFile(layout, "utf8");

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(120);
    expect(contenido).not.toContain("useMutation");
    expect(contenido).not.toContain("useQuery");
    expect(contenido).not.toContain("<header");
  });

  it("separa hook, navegación, cabecera y estados", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "use-layout-principal.ts",
        "navegacion-layout.tsx",
        "cabecera-layout.tsx",
        "estados-layout.tsx",
      ]),
    );
  });
});
