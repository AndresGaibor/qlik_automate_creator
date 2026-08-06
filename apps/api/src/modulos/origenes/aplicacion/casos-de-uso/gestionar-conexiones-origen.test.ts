import { describe, expect, it, vi } from "bun:test";
import type { PuertoAuditoria } from "../../../../nucleo/auditoria/puerto-auditoria.js";
import type {
  ConexionOrigen,
  EntradaConexionOrigen,
  RepositorioConexionesOrigen,
} from "../puertos/repositorio-conexiones-origen.js";
import { GestionarConexionesOrigen } from "./gestionar-conexiones-origen.js";

class RepositorioFalso implements RepositorioConexionesOrigen {
  conexiones: ConexionOrigen[] = [];
  secretoRecibido?: string;
  secretoLeido: string | null = null;
  secretosConfigurados = new Set<string>();
  busquedasTipoNombre: Array<[string, string, string]> = [];

  async listar(organizacionId: string) {
    return this.conexiones.filter(
      (conexion) => conexion.organizacionId === organizacionId,
    );
  }

  async buscarPorNombre(organizacionId: string, nombre: string) {
    return (
      this.conexiones.find(
        (conexion) =>
          conexion.organizacionId === organizacionId &&
          conexion.nombre === nombre,
      ) ?? null
    );
  }

  async buscarPorTipoYNombre(
    organizacionId: string,
    tipo: "jdbc" | "sftp",
    nombre: string,
  ) {
    this.busquedasTipoNombre.push([organizacionId, tipo, nombre]);
    return (
      this.conexiones.find(
        (conexion) =>
          conexion.organizacionId === organizacionId &&
          conexion.tipo === tipo &&
          conexion.nombre === nombre,
      ) ?? null
    );
  }

  async existeSecreto(
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ) {
    const conexion = await this.buscarPorId(organizacionId, conexionId);
    return Boolean(
      conexion && this.secretosConfigurados.has(`${conexionId}:${nombre}`),
    );
  }

  async leerSecreto() {
    return this.secretoLeido;
  }

  async registrarPrueba() {
    return true;
  }

  async buscarPorId(organizacionId: string, id: string) {
    return (
      this.conexiones.find(
        (conexion) =>
          conexion.organizacionId === organizacionId && conexion.id === id,
      ) ?? null
    );
  }

  async crear(organizacionId: string, entrada: EntradaConexionOrigen) {
    this.secretoRecibido = entrada.secreto?.valor;
    const conexion = crearConexion("conexion-1", organizacionId, entrada);
    this.conexiones.push(conexion);
    return conexion;
  }

  async actualizar(
    organizacionId: string,
    id: string,
    entrada: EntradaConexionOrigen,
  ) {
    const indice = this.conexiones.findIndex(
      (conexion) =>
        conexion.organizacionId === organizacionId && conexion.id === id,
    );
    if (indice < 0) return null;
    const actualizada = crearConexion(id, organizacionId, entrada);
    this.conexiones[indice] = actualizada;
    return actualizada;
  }

  async eliminar(organizacionId: string, id: string) {
    const cantidadAnterior = this.conexiones.length;
    this.conexiones = this.conexiones.filter(
      (conexion) =>
        conexion.organizacionId !== organizacionId || conexion.id !== id,
    );
    return this.conexiones.length < cantidadAnterior;
  }
}

function crearConexion(
  id: string,
  organizacionId: string,
  entrada: EntradaConexionOrigen,
): ConexionOrigen {
  return {
    id,
    organizacionId,
    tipo: entrada.tipo,
    nombre: entrada.nombre,
    config: entrada.config,
    creadoEn: new Date("2026-08-06T10:00:00-05:00"),
    estado: "sin_probar",
    probadaEn: null,
    mensajeError: null,
    actualizadoEn: new Date("2026-08-06T10:00:00-05:00"),
  };
}

function crearAuditoria(): PuertoAuditoria {
  return { registrar: vi.fn(async () => undefined) };
}

describe("GestionarConexionesOrigen", () => {
  it("elimina secretos embebidos al listar conexiones", async () => {
    const repositorio = new RepositorioFalso();
    repositorio.conexiones.push({
      id: "conexion-1",
      organizacionId: "org-1",
      tipo: "jdbc",
      nombre: "Ventas",
      config: {
        url: "jdbc:postgresql://localhost/ventas",
        secreto_nombre: "JDBC_VENTAS",
        secretoValor: "usuario:clave",
      },
      estado: "sin_probar",
      probadaEn: null,
      mensajeError: null,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    const [conexion] = await gestor.listar("org-1");

    expect(conexion.config).not.toHaveProperty("secretoValor");
    expect(JSON.stringify(conexion)).not.toContain("usuario:clave");
  });

  it("informa si la credencial segura realmente está almacenada", async () => {
    const repositorio = new RepositorioFalso();
    repositorio.conexiones.push({
      id: "conexion-1",
      organizacionId: "org-1",
      tipo: "jdbc",
      nombre: "Ventas",
      config: {
        url: "jdbc:postgresql://localhost/ventas",
        secreto_nombre: "JDBC_VENTAS",
      },
      estado: "sin_probar",
      probadaEn: null,
      mensajeError: null,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    expect((await gestor.listar("org-1"))[0]).toMatchObject({
      secretoConfigurado: false,
    });

    repositorio.secretosConfigurados.add("conexion-1:JDBC_VENTAS");
    expect((await gestor.listar("org-1"))[0]).toMatchObject({
      secretoConfigurado: true,
    });
  });

  it("rechaza nombres repetidos dentro de la organización", async () => {
    const repositorio = new RepositorioFalso();
    const entrada: EntradaConexionOrigen = {
      tipo: "jdbc",
      nombre: "Ventas",
      config: { url: "jdbc:postgresql://localhost/ventas" },
    };
    repositorio.conexiones.push(crearConexion("existente", "org-1", entrada));
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    expect(gestor.crear("org-1", entrada)).rejects.toMatchObject({
      codigo: "CONEXION_EXISTENTE",
      estadoHttp: 409,
    });
  });

  it("entrega el secreto nuevo al repositorio sin devolverlo", async () => {
    const repositorio = new RepositorioFalso();
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    const creada = await gestor.crear("org-1", {
      tipo: "jdbc",
      nombre: "Ventas",
      config: { url: "jdbc:postgresql://localhost/ventas" },
      secreto: { nombre: "JDBC_VENTAS", valor: "usuario:clave" },
    });

    expect(repositorio.secretoRecibido).toBe("usuario:clave");
    expect(JSON.stringify(creada)).not.toContain("usuario:clave");
  });

  it("rechaza actualizar una conexión inexistente", async () => {
    const repositorio = new RepositorioFalso();
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    expect(
      gestor.actualizar("org-1", "inexistente", {
        tipo: "jdbc",
        nombre: "Ventas",
        config: { url: "jdbc:postgresql://localhost/ventas" },
      }),
    ).rejects.toMatchObject({ codigo: "NO_ENCONTRADA", estadoHttp: 404 });
  });

  it("elimina solo conexiones de la organización indicada", async () => {
    const repositorio = new RepositorioFalso();
    repositorio.conexiones.push(
      crearConexion("conexion-1", "org-1", {
        tipo: "jdbc",
        nombre: "Ventas",
        config: {},
      }),
    );
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    expect(await gestor.eliminar("org-2", "conexion-1")).toBe(false);
    expect(await gestor.eliminar("org-1", "conexion-1")).toBe(true);
  });

  it("permite el mismo nombre para tipos diferentes", async () => {
    const repositorio = new RepositorioFalso();
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    await gestor.crear("org-1", {
      tipo: "jdbc",
      nombre: "Compartida",
      config: {},
    });
    await gestor.crear("org-1", {
      tipo: "sftp",
      nombre: "Compartida",
      config: {},
    });

    expect(repositorio.busquedasTipoNombre).toEqual([
      ["org-1", "jdbc", "Compartida"],
      ["org-1", "sftp", "Compartida"],
    ]);
  });

  it("lee solo el secreto solicitado dentro de la organizacion", async () => {
    const repositorio = new RepositorioFalso();
    repositorio.secretoLeido = "usuario:clave";
    const gestor = new GestionarConexionesOrigen(repositorio, crearAuditoria());

    const valor = await gestor.leerSecretoInterno(
      "org-1",
      "conexion-1",
      "JDBC_VENTAS",
    );

    expect(valor).toBe("usuario:clave");
  });
});
