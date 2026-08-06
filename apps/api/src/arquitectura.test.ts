import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";

const RAIZ_MODULOS = join(import.meta.dir, "modulos");
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
  return relative(import.meta.dir, archivo)
    .split(sep)
    .join("/");
}

async function buscar(
  filtroRuta: (ruta: string) => boolean,
  patron: RegExp,
): Promise<string[]> {
  const violaciones: string[] = [];

  for (const archivo of await archivosProduccion(RAIZ_MODULOS)) {
    const ruta = rutaRelativa(archivo);
    if (!filtroRuta(ruta)) continue;
    const contenido = await Bun.file(archivo).text();
    if (patron.test(contenido)) violaciones.push(ruta);
  }

  return violaciones.sort();
}

function moduloDeRuta(ruta: string): string | null {
  const partes = ruta.split("/");
  return partes[0] === "modulos" ? (partes[1] ?? null) : null;
}

function importacionesModulo(contenido: string): string[] {
  return [...contenido.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (coincidencia) => coincidencia[1],
  );
}
async function buscarImportacionesInternasEntreModulos(): Promise<string[]> {
  const violaciones: string[] = [];

  for (const archivo of await archivosProduccion(RAIZ_MODULOS)) {
    const ruta = rutaRelativa(archivo);
    const moduloOrigen = moduloDeRuta(ruta);
    if (!moduloOrigen) continue;
    const contenido = await Bun.file(archivo).text();

    for (const importacion of importacionesModulo(contenido)) {
      if (!importacion.startsWith(".")) continue;
      const destino = resolve(dirname(archivo), importacion);
      const rutaDestino = relative(import.meta.dir, destino)
        .split(sep)
        .join("/");
      const moduloDestino = moduloDeRuta(rutaDestino);
      if (!moduloDestino || moduloDestino === moduloOrigen) continue;
      if (rutaDestino === `modulos/${moduloDestino}/publico.js`) continue;
      if (rutaDestino === `modulos/${moduloDestino}/publico`) continue;
      violaciones.push(`${ruta} -> ${rutaDestino}`);
    }
  }

  return violaciones.sort();
}

describe("límites arquitectónicos", () => {
  it("HTTP no depende de Drizzle, persistencia ni adaptadores concretos", async () => {
    const violaciones = await buscar(
      (ruta) => ruta.includes("/http/"),
      /from\s+["'][^"']*(drizzle-orm|plataforma\/persistencia|\/infraestructura\/)/,
    );
    expect(violaciones).toEqual([]);
  });

  it("aplicación no depende de HTTP, Hono, Drizzle ni infraestructura", async () => {
    const violaciones = await buscar(
      (ruta) => ruta.includes("/aplicacion/"),
      /from\s+["'][^"']*(hono|drizzle-orm|\/http\/|\/infraestructura\/|plataforma\/persistencia)/,
    );
    expect(violaciones).toEqual([]);
  });

  it("dominio no depende de capas externas", async () => {
    const violaciones = await buscar(
      (ruta) => ruta.includes("/dominio/"),
      /from\s+["'][^"']*(hono|react|drizzle-orm|\/aplicacion\/|\/http\/|\/infraestructura\/|\/plataforma\/)/,
    );
    expect(violaciones).toEqual([]);
  });

  it("los módulos consumen otros módulos mediante publico.ts", async () => {
    expect(await buscarImportacionesInternasEntreModulos()).toEqual([]);
  });
});
