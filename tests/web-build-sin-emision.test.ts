import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { join } from "node:path";

const raiz = join(import.meta.dir, "..");
const web = join(raiz, "apps/web");

async function leerJson(ruta: string) {
  return JSON.parse(await Bun.file(ruta).text()) as Record<string, unknown>;
}

describe("build del frontend sin archivos emitidos", () => {
  it("typecheck y build validan TypeScript con noEmit", async () => {
    const paquete = await leerJson(join(web, "package.json"));
    const scripts = paquete.scripts as Record<string, string>;
    const tsconfig = await leerJson(join(web, "tsconfig.json"));
    const tsconfigNode = await leerJson(join(web, "tsconfig.node.json"));
    const opcionesNode = tsconfigNode.compilerOptions as Record<
      string,
      unknown
    >;

    expect(scripts.typecheck).not.toContain("tsc -b");
    expect(scripts.typecheck).toContain("--noEmit");
    expect(scripts.build).toContain("bun run typecheck");
    expect(tsconfig).not.toHaveProperty("references");
    expect(opcionesNode.noEmit).toBe(true);
    expect(opcionesNode.composite).not.toBe(true);
  });

  it("no versiona salidas generadas junto a vite.config.ts", () => {
    for (const nombre of [
      "vite.config.js",
      "vite.config.d.ts",
      "tsconfig.tsbuildinfo",
      "tsconfig.node.tsbuildinfo",
    ]) {
      expect(existsSync(join(web, nombre)), nombre).toBe(false);
    }
  });
});
