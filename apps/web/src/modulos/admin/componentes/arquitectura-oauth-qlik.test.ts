import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const directorio = join(process.cwd(), "src/modulos/admin/componentes");
const seccion = join(directorio, "seccion-oauth-qlik.tsx");

function contarLineasUtiles(contenido: string) {
  return contenido.split("\n").filter((linea) => linea.trim()).length;
}

describe("arquitectura de configuración OAuth Qlik", () => {
  it("la sección coordina callback y tarjetas", async () => {
    const contenido = await readFile(seccion, "utf8");

    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(110);
    expect(contenido).not.toContain("useMutation");
    expect(contenido).not.toContain("<input");
    expect(contenido).not.toContain("<textarea");
  });

  it("separa estado, formulario y flujo por tenant", async () => {
    const archivos = await readdir(directorio);

    expect(archivos).toEqual(
      expect.arrayContaining([
        "estado-oauth.tsx",
        "formulario-oauth-tenant.tsx",
        "tarjeta-oauth-tenant.tsx",
        "use-oauth-tenant.ts",
      ]),
    );
  });
});
