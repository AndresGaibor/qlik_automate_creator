import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const modulos = [
  "inicio",
  "setup",
  "autenticacion",
  "flujos",
  "automatizaciones",
  "tablas",
  "admin",
] as const;

async function leerRutas(modulo: (typeof modulos)[number]) {
  return readFile(
    join(process.cwd(), "src/modulos", modulo, "rutas.tsx"),
    "utf8",
  );
}

describe("carga diferida de páginas", () => {
  it("las definiciones de rutas no importan páginas de forma estática", async () => {
    for (const modulo of modulos) {
      const contenido = await leerRutas(modulo);
      expect(contenido, modulo).not.toMatch(
        /import\s+[^;]+from\s+["'][^"']*pagina-[^"']+["']/,
      );
      expect(contenido, modulo).toContain("lazyRouteComponent");
    }
  });

  it("la ruta de configuración pertenece al módulo administrativo", async () => {
    const admin = await leerRutas("admin");
    const tablas = await leerRutas("tablas");

    expect(admin).toContain('path: "/configuracion"');
    expect(tablas).not.toContain('path: "/configuracion"');
    expect(tablas).not.toContain("../admin/");
  });
});
