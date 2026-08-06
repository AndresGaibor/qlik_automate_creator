import { describe, expect, it, vi } from "bun:test";
import { ClientePostgres } from "./cliente-postgres.js";

function crearClienteConSql(sql: unknown): ClientePostgres {
  const cliente = Object.create(ClientePostgres.prototype) as ClientePostgres;
  Object.assign(cliente, { sql });
  return cliente;
}

describe("ClientePostgres.probar", () => {
  it("ejecuta SELECT 1 y cierra la conexión", async () => {
    const ejecutar = vi.fn(async (_partes: TemplateStringsArray) => [
      { ok: 1 },
    ]);
    const end = vi.fn(async () => undefined);
    const sql = Object.assign(ejecutar, { end });
    const cliente = crearClienteConSql(sql);

    await cliente.probar();

    expect(ejecutar).toHaveBeenCalledTimes(1);
    expect(String(ejecutar.mock.calls[0]?.[0]?.[0])).toContain(
      "SELECT 1 AS ok",
    );
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("cierra la conexión cuando SELECT 1 falla", async () => {
    const ejecutar = vi.fn(async (_partes: TemplateStringsArray) => {
      throw new Error("fallo de red");
    });
    const end = vi.fn(async () => undefined);
    const sql = Object.assign(ejecutar, { end });
    const cliente = crearClienteConSql(sql);

    await expect(cliente.probar()).rejects.toThrow("fallo de red");
    expect(end).toHaveBeenCalledTimes(1);
  });
});

describe("ClientePostgres catálogo", () => {
  it("declara capacidades de lectura y escritura", () => {
    const cliente = crearClienteConSql(vi.fn());
    expect(cliente.obtenerCapacidades()).toEqual({
      listarRecursos: true,
      esquema: true,
      conteoRegistros: true,
      vistaPrevia: true,
      escritura: true,
    });
  });

  it("lista tablas PostgreSQL como recursos", async () => {
    const ejecutar = vi.fn(async () => [
      { schema_name: "public", table_name: "ventas" },
    ]);
    const cliente = crearClienteConSql(ejecutar);

    await expect(cliente.listarRecursos()).resolves.toEqual([
      {
        id: "public.ventas",
        nombre: "ventas",
        tipo: "tabla",
        espacioDeNombres: "public",
        metadatos: {},
      },
    ]);
  });

  it("obtiene columnas y conteo de una tabla", async () => {
    const ejecutar = vi.fn(async () => [
      { column_name: "id", data_type: "integer" },
    ]);
    const unsafe = vi.fn(async () => [{ total: "12" }]);
    const sql = Object.assign(ejecutar, { unsafe });
    const cliente = crearClienteConSql(sql);

    const recurso = await cliente.obtenerRecurso("public.ventas");

    expect(recurso).toMatchObject({
      id: "public.ventas",
      nombre: "ventas",
      espacioDeNombres: "public",
      columnas: [{ nombre: "id", tipo: "integer" }],
      totalFilas: 12,
    });
    expect(unsafe).toHaveBeenCalledWith(
      'SELECT COUNT(*)::bigint AS total FROM "public"."ventas"',
    );
  });

  it("rechaza identificadores incompletos o inseguros", async () => {
    const ejecutar = vi.fn(async () => []);
    const unsafe = vi.fn(async () => []);
    const cliente = crearClienteConSql(Object.assign(ejecutar, { unsafe }));

    await expect(cliente.obtenerRecurso("ventas")).rejects.toThrow(
      "formato esquema.tabla",
    );
    await expect(cliente.obtenerRecurso("public.ventas;drop")).rejects.toThrow(
      "Identificador PostgreSQL inválido",
    );
    expect(unsafe).not.toHaveBeenCalled();
  });
});

describe("ClientePostgres validación", () => {
  it("rechaza host, base o usuario vacíos antes de conectar", () => {
    expect(
      () =>
        new ClientePostgres({
          host: " ",
          database: "demo",
          user: "demo",
          password: "x",
        }),
    ).toThrow("host de PostgreSQL");
    expect(
      () =>
        new ClientePostgres({
          host: "db",
          database: " ",
          user: "demo",
          password: "x",
        }),
    ).toThrow("base de datos de PostgreSQL");
    expect(
      () =>
        new ClientePostgres({
          host: "db",
          database: "demo",
          user: " ",
          password: "x",
        }),
    ).toThrow("usuario de PostgreSQL");
  });
});
