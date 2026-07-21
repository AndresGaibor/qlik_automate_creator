import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const files = [
  "package.json",
  "tsconfig.base.json",
  "biome.json",
  ".env.example",
  "Dockerfile",
  "compose.yaml",
] as const;

describe("Task 1.1: Configurar raíz del monorepo", () => {
  test("todos los archivos de raíz existen", () => {
    for (const file of files) {
      const path = resolve(ROOT, file);
      expect(existsSync(path), `debe existir ${file}`).toBe(true);
    }
  });

  test("package.json tiene name, private y workspaces correctos", () => {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
    expect(pkg.name).toBe("qlik-automatizaciones");
    expect(pkg.private).toBe(true);
    expect(pkg.workspaces).toEqual(["apps/*", "packages/*"]);
  });

  test("package.json tiene scripts requeridos", () => {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
    expect(pkg.scripts).toHaveProperty("dev");
    expect(pkg.scripts).toHaveProperty("dev:api");
    expect(pkg.scripts).toHaveProperty("build");
    expect(pkg.scripts).toHaveProperty("test");
    expect(pkg.scripts).toHaveProperty("lint");
    expect(pkg.scripts).toHaveProperty("lint:fix");
  });

  test("package.json tiene devDependencies correctas", () => {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
    expect(pkg.devDependencies).toHaveProperty("@biomejs/biome");
    expect(pkg.devDependencies).toHaveProperty("typescript");
  });

  test("tsconfig.base.json tiene compilerOptions requeridos", () => {
    const tsconfig = JSON.parse(
      readFileSync(resolve(ROOT, "tsconfig.base.json"), "utf-8")
    );
    expect(tsconfig.compilerOptions.target).toBe("ES2022");
    expect(tsconfig.compilerOptions.module).toBe("ESNext");
    expect(tsconfig.compilerOptions.moduleResolution).toBe("bundler");
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  test("biome.json tiene linter y formatter habilitados", () => {
    const biome = JSON.parse(readFileSync(resolve(ROOT, "biome.json"), "utf-8"));
    expect(biome.linter.enabled).toBe(true);
    expect(biome.formatter.enabled).toBe(true);
    expect(biome.organizeImports.enabled).toBe(true);
  });

  test(".env.example contiene variables de entorno requeridas", () => {
    const env = readFileSync(resolve(ROOT, ".env.example"), "utf-8");
    expect(env).toContain("DATABASE_URL");
    expect(env).toContain("QLIK_CLIENT_ID");
    expect(env).toContain("QLIK_CLIENT_SECRET");
    expect(env).toContain("CIFRADO_CLAVE_PRINCIPAL");
  });

  test("Dockerfile usa oven/bun y copia apps", () => {
    const dockerfile = readFileSync(resolve(ROOT, "Dockerfile"), "utf-8");
    expect(dockerfile).toContain("oven/bun");
    expect(dockerfile).toContain("apps/api");
    expect(dockerfile).toContain("apps/web");
    expect(dockerfile).toContain("packages");
  });

  test("compose.yaml define servicio postgres", () => {
    const compose = readFileSync(resolve(ROOT, "compose.yaml"), "utf-8");
    expect(compose).toContain("postgres:17-alpine");
    expect(compose).toContain("qlik_automatizaciones");
    expect(compose).toContain("postgres_datos");
  });
});
