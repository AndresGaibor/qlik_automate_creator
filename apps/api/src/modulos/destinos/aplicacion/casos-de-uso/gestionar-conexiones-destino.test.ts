import { describe, expect, it } from "bun:test";
import type {
  ConexionDestino,
  EntradaConexionDestino,
  RepositorioConexionesDestino,
} from "../puertos/repositorio-conexiones-destino.js";
import { GestionarConexionesDestino } from "./gestionar-conexiones-destino.js";

class RepositorioFalso implements RepositorioConexionesDestino {
  conexiones: ConexionDestino[] = [];

  async listarPorOrganizacion(organizacionId: string) {
    return this.conexiones.filter(
      (conexion) => conexion.organizacionId === organizacionId,
    );
  }

  async obtener(organizacionId: string, id: string) {
    return (
      this.conexiones.find(
        (conexion) =>
          conexion.organizacionId === organizacionId && conexion.id === id,
      ) ?? null
    );
  }

  async crear(entrada: EntradaConexionDestino) {
    const conexion = crearConexion("destino-1", entrada);
    this.conexiones.push(conexion);
    return conexion;
  }

  async actualizar(
    organizacionId: string,
    id: string,
    cambios: Partial<ConexionDestino>,
  ) {
    const conexion = await this.obtener(organizacionId, id);
    if (!conexion) return false;
    Object.assign(conexion, cambios);
    return true;
  }

  async eliminar(organizacionId: string, id: string) {
    const cantidad = this.conexiones.length;
    this.conexiones = this.conexiones.filter(
      (conexion) =>
        conexion.organizacionId !== organizacionId || conexion.id !== id,
    );
    return this.conexiones.length < cantidad;
  }
}

function crearConexion(
  id: string,
  entrada: EntradaConexionDestino,
): ConexionDestino {
  return {
    id,
    organizacionId: entrada.organizacionId,
    tipo: entrada.tipo,
    nombre: entrada.nombre,
    estado: "activo",
    mensajeError: null,
    config: entrada.config,
    secretoRefs: entrada.secretoRefs,
  };
}

describe("GestionarConexionesDestino", () => {
  it("lista únicamente conexiones de la organización", async () => {
    const repositorio = new RepositorioFalso();
    repositorio.conexiones.push(
      crearConexion("destino-1", {
        organizacionId: "org-1",
        tipo: "postgres",
        nombre: "Ventas",
        config: {},
        secretoRefs: {},
      }),
      crearConexion("destino-2", {
        organizacionId: "org-2",
        tipo: "bigquery",
        nombre: "Finanzas",
        config: {},
        secretoRefs: {},
      }),
    );
    const gestor = new GestionarConexionesDestino(repositorio);

    const conexiones = await gestor.listar("org-1");

    expect(conexiones.map((conexion) => conexion.id)).toEqual(["destino-1"]);
  });

  it("permite una consulta opcional sin convertir ausencia en excepción", async () => {
    const gestor = new GestionarConexionesDestino(new RepositorioFalso());

    await expect(gestor.buscar("org-1", "inexistente")).resolves.toBeNull();
  });

  it("rechaza consultar una conexión de otra organización", async () => {
    const repositorio = new RepositorioFalso();
    repositorio.conexiones.push(
      crearConexion("destino-1", {
        organizacionId: "org-1",
        tipo: "postgres",
        nombre: "Ventas",
        config: {},
        secretoRefs: {},
      }),
    );
    const gestor = new GestionarConexionesDestino(repositorio);

    expect(gestor.obtener("org-2", "destino-1")).rejects.toMatchObject({
      codigo: "DESTINO_NO_ENCONTRADO",
      estadoHttp: 404,
    });
  });

  it("crea y actualiza una conexión dentro de su organización", async () => {
    const repositorio = new RepositorioFalso();
    const gestor = new GestionarConexionesDestino(repositorio);

    const creada = await gestor.crear({
      organizacionId: "org-1",
      tipo: "postgres",
      nombre: "Ventas",
      config: { host: "db" },
      secretoRefs: {},
    });
    await gestor.actualizar("org-1", creada.id, {
      nombre: "Ventas producción",
      estado: "desconectado",
    });

    expect(await gestor.obtener("org-1", creada.id)).toMatchObject({
      nombre: "Ventas producción",
      estado: "desconectado",
    });
  });

  it("elimina solo cuando la conexión pertenece a la organización", async () => {
    const repositorio = new RepositorioFalso();
    repositorio.conexiones.push(
      crearConexion("destino-1", {
        organizacionId: "org-1",
        tipo: "postgres",
        nombre: "Ventas",
        config: {},
        secretoRefs: {},
      }),
    );
    const gestor = new GestionarConexionesDestino(repositorio);

    expect(gestor.eliminar("org-2", "destino-1")).rejects.toMatchObject({
      codigo: "DESTINO_NO_ENCONTRADO",
    });
    await expect(
      gestor.eliminar("org-1", "destino-1"),
    ).resolves.toBeUndefined();
  });
});
