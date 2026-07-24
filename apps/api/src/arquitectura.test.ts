import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

async function archivosTypeScript(ruta: string): Promise<string[]> {
  const entradas = await readdir(ruta, { withFileTypes: true });
  const resultados: string[] = [];
  for (const entrada of entradas) {
    const path = join(ruta, entrada.name);
    if (entrada.isDirectory())
      resultados.push(...(await archivosTypeScript(path)));
    else if (entrada.name.endsWith(".ts")) resultados.push(path);
  }
  return resultados;
}

describe("límites arquitectónicos", () => {
  it("admin/http no construye adaptadores de infraestructura", async () => {
    const raiz = join(import.meta.dir, "modulos/admin/http");
    const archivos = await archivosTypeScript(raiz);
    const violaciones: string[] = [];
    for (const archivo of archivos) {
      const contenido = await Bun.file(archivo).text();
      if (/from ["\'][^"\']*infraestructura/.test(contenido)) {
        violaciones.push(archivo.replace(`${import.meta.dir}/`, ""));
      }
    }
    expect(violaciones).toEqual([]);
  });

  it("admin/aplicacion no depende de plataforma, Drizzle ni infraestructura", async () => {
    const raiz = join(import.meta.dir, "modulos/admin/aplicacion");
    const archivos = await archivosTypeScript(raiz);
    const violaciones: string[] = [];
    for (const archivo of archivos) {
      const contenido = await Bun.file(archivo).text();
      if (
        /from ["'][^"']*(plataforma|infraestructura)|from ["']drizzle-orm/.test(
          contenido,
        )
      ) {
        violaciones.push(archivo.replace(`${import.meta.dir}/`, ""));
      }
    }
    expect(violaciones).toEqual([]);
  });
});
