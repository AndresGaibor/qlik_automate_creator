import { describe, expect, it } from "bun:test";
import { readdir } from "node:fs/promises";

const directorio = new URL(".", import.meta.url);
const fachada = new URL("./rutas-destinos-genericos.ts", import.meta.url);

function contarLineasUtiles(contenido: string) {
  return contenido
    .split("\n")
    .filter((linea) => linea.trim() && !linea.trim().startsWith("//")).length;
}

describe("arquitectura de rutas genéricas de destinos", () => {
  it("la fachada solo compone consultas y comandos", async () => {
    const contenido = await Bun.file(fachada).text();
    expect(contarLineasUtiles(contenido)).toBeLessThanOrEqual(65);
    expect(contenido).not.toContain("z.object");
    expect(contenido).not.toContain("async function obtenerConexion");
    expect(contenido).not.toContain("async function probarConexion");
  });

  it("separa contratos, acceso, consultas, comandos y errores", async () => {
    const archivos = await readdir(directorio);
    expect(archivos).toEqual(
      expect.arrayContaining([
        "tipos-rutas-destinos-genericos.ts",
        "esquemas-destinos-genericos.ts",
        "modelo-destino-http.ts",
        "acceso-destino-http.ts",
        "registrar-rutas-consulta-destinos.ts",
        "registrar-rutas-comando-destinos.ts",
        "respuestas-destinos-http.ts",
      ]),
    );
  });
});
