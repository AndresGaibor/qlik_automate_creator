import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const RAIZ_SRC = dirname(fileURLToPath(import.meta.url));
const RAIZ_MODULOS = join(RAIZ_SRC, "modulos");
const ARCHIVO_PRODUCCION = /\.(ts|tsx)$/;
const ARCHIVO_PRUEBA = /\.(test|spec)\.(ts|tsx)$/;

async function archivosProduccion(ruta: string): Promise<string[]> {
  const entradas = await readdir(ruta, { withFileTypes: true });
  const resultados: string[] = [];

  for (const entrada of entradas) {
    const rutaEntrada = join(ruta, entrada.name);
    if (entrada.isDirectory()) {
      resultados.push(...(await archivosProduccion(rutaEntrada)));
      continue;
    }
    if (
      ARCHIVO_PRODUCCION.test(entrada.name) &&
      !ARCHIVO_PRUEBA.test(entrada.name)
    ) {
      resultados.push(rutaEntrada);
    }
  }

  return resultados;
}
function rutaRelativa(archivo: string): string {
  return relative(RAIZ_SRC, archivo).split(sep).join("/");
}

function moduloDeArchivo(ruta: string): string | null {
  const partes = ruta.split("/");
  return partes[0] === "modulos" ? (partes[1] ?? null) : null;
}

async function importacionesInternasEntreFeatures(): Promise<string[]> {
  const violaciones: string[] = [];

  for (const archivo of await archivosProduccion(RAIZ_SRC)) {
    const ruta = rutaRelativa(archivo);
    const moduloOrigen = moduloDeArchivo(ruta);
    const contenido = await readFile(archivo, "utf8");
    const importaciones = [
      ...contenido.matchAll(/from\s+["']@\/modulos\/([^/"']+)\/([^"']+)["']/g),
    ];

    for (const coincidencia of importaciones) {
      const moduloDestino = coincidencia[1];
      const subruta = coincidencia[2];
      if (moduloOrigen === moduloDestino) continue;
      if (subruta === "publico") continue;
      violaciones.push(`${ruta} -> ${moduloDestino}/${subruta}`);
    }
  }

  return violaciones.sort();
}
async function modulosSinApiPublica(): Promise<string[]> {
  const entradas = await readdir(RAIZ_MODULOS, { withFileTypes: true });
  const faltantes: string[] = [];

  for (const entrada of entradas) {
    if (!entrada.isDirectory()) continue;
    try {
      await access(join(RAIZ_MODULOS, entrada.name, "publico.ts"));
    } catch {
      faltantes.push(entrada.name);
    }
  }

  return faltantes.sort();
}

describe("límites arquitectónicos del frontend", () => {
  it("cada feature expone una API pública", async () => {
    expect(await modulosSinApiPublica()).toEqual([]);
  });

  it("una feature no importa archivos internos de otra feature", async () => {
    expect(await importacionesInternasEntreFeatures()).toEqual([]);
  });
});
