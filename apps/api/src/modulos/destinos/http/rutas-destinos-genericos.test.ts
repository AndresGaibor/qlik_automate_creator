import { describe, expect, it, vi } from "bun:test";
import { GestionarConexionesDestino } from "../aplicacion/casos-de-uso/gestionar-conexiones-destino.js";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type { RepositorioConexionesDestino } from "../aplicacion/puertos/repositorio-conexiones-destino.js";
import type {
  DetalleRecursoDestino,
  RecursoDestino,
} from "../dominio/tipos-destino.js";
import { crearRutasDestinosGenericas } from "./rutas-destinos-genericos.js";

interface ConexionFake {
  id: string;
  organizacionId: string;
  tipo: "impala";
  nombre: string;
  estado: "activo" | "error" | "desconectado";
  mensajeError: string | null;
  probadaEn: Date | null;
  config: Record<string, unknown>;
  secretoRefs: Record<string, unknown>;
}

function clienteFake(
  opciones: {
    listarRecursos?: () => Promise<RecursoDestino[]>;
    obtenerRecurso?: (id: string) => Promise<DetalleRecursoDestino>;
  } = {},
): PuertoDestino {
  return {
    tipo: "impala",
    probar: async () => undefined,
    obtenerCapacidades: () => ({
      listarRecursos: true,
      esquema: true,
      conteoRegistros: true,
      vistaPrevia: false,
      escritura: false,
    }),
    listarRecursos:
      opciones.listarRecursos ??
      (async () => [
        { id: "bd.tabla", nombre: "tabla", tipo: "tabla", metadatos: {} },
      ]),
    obtenerRecurso:
      opciones.obtenerRecurso ??
      (async (id) => ({
        id,
        nombre: id,
        tipo: "tabla",
        metadatos: {},
        actualizadoEn: new Date().toISOString(),
      })),
  };
}

function crearApp(
  fabricarCliente: () => PuertoDestino,
  conexion: ConexionFake | null = {
    id: "conn-1",
    organizacionId: "org-1",
    tipo: "impala",
    nombre: "Impala principal",
    estado: "activo",
    mensajeError: null,
    probadaEn: null,
    config: { host: "localhost" },
    secretoRefs: {},
  },
) {
  const repositorio: RepositorioConexionesDestino = {
    listarPorOrganizacion: async () => (conexion ? [conexion] : []),
    obtener: async (_organizacionId, id) =>
      conexion && conexion.id === id ? conexion : null,
    crear: async (entrada) => ({
      ...(conexion ?? {
        id: "conn-1",
        estado: "activo",
        mensajeError: null,
        probadaEn: null,
      }),
      ...entrada,
    }),
    guardarParaTenant: async (entrada) => ({
      ...(conexion ?? {
        id: "conn-1",
        estado: "activo",
        mensajeError: null,
        probadaEn: null,
      }),
      ...entrada,
    }),
    obtenerConSecreto: async (_organizacionId, id) =>
      conexion && conexion.id === id ? { ...conexion, secreto: null } : null,
    actualizar: async () => Boolean(conexion),
    eliminar: async () => Boolean(conexion),
  };
  return crearRutasDestinosGenericas({
    resolverOrganizacion: async () => "org-1",
    gestor: new GestionarConexionesDestino(repositorio),
    crearCliente: () => fabricarCliente(),
  });
}

describe("rutas genéricas de destinos", () => {
  it("devuelve 404 cuando la conexión no existe", async () => {
    const app = crearApp(() => clienteFake(), null);
    const respuesta = await app.request("/conn-1/recursos");
    expect(respuesta.status).toBe(404);
  });

  it("lista los recursos cuando el destino responde", async () => {
    const app = crearApp(() => clienteFake());
    const respuesta = await app.request("/conn-1/recursos");
    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.exito).toBe(true);
    expect(cuerpo.datos).toHaveLength(1);
  });

  it("no expone el 500 interno: devuelve 400 con el mensaje real cuando la configuración es inválida", async () => {
    const app = crearApp(() => {
      throw new Error("El host de PostgreSQL es obligatorio");
    });
    const respuesta = await app.request("/conn-1/recursos");
    const cuerpo = await respuesta.json();
    expect(respuesta.status).toBe(400);
    expect(cuerpo.exito).toBe(false);
    expect(cuerpo.error.codigo).toBe("CONFIGURACION_INVALIDA");
    expect(cuerpo.error.mensaje).toContain("El host de PostgreSQL");
  });

  it("devuelve 502 con el mensaje real cuando el destino falla al listar recursos", async () => {
    const app = crearApp(() =>
      clienteFake({
        listarRecursos: async () => {
          throw new Error(
            "Access Denied: Permission bigquery.tables.list denied",
          );
        },
      }),
    );
    const respuesta = await app.request("/conn-1/recursos");
    const cuerpo = await respuesta.json();
    expect(respuesta.status).toBe(502);
    expect(cuerpo.exito).toBe(false);
    expect(cuerpo.error.codigo).toBe("DESTINO_NO_DISPONIBLE");
    expect(cuerpo.error.mensaje).toContain("bigquery.tables.list");
  });

  it("devuelve 502 cuando el destino falla al obtener un recurso", async () => {
    const app = crearApp(() =>
      clienteFake({
        obtenerRecurso: async () => {
          throw new Error("Tabla inexistente");
        },
      }),
    );
    const respuesta = await app.request("/conn-1/recursos/mi.tabla");
    const cuerpo = await respuesta.json();
    expect(respuesta.status).toBe(502);
    expect(cuerpo.error.codigo).toBe("DESTINO_NO_DISPONIBLE");
    expect(cuerpo.error.mensaje).toContain("Tabla inexistente");
  });
  it("POST /probar ejecuta conectividad y guarda la fecha", async () => {
    const probar = vi.fn(async () => undefined);
    const actualizar = vi.fn(async () => true);
    const conexion = {
      id: "destino-1",
      organizacionId: "org-1",
      tipo: "postgres" as const,
      nombre: "Postgres",
      estado: "desconectado" as const,
      mensajeError: null,
      probadaEn: null,
      config: { host: "db" },
      secretoRefs: {},
    };
    const repositorio: RepositorioConexionesDestino = {
      listarPorOrganizacion: async () => [conexion],
      obtener: async () => conexion,
      obtenerConSecreto: async () => ({ ...conexion, secreto: null }),
      crear: async () => conexion,
      guardarParaTenant: async () => conexion,
      actualizar,
      eliminar: async () => true,
    };
    const app = crearRutasDestinosGenericas({
      resolverOrganizacion: async () => "org-1",
      gestor: new GestionarConexionesDestino(repositorio),
      crearCliente: () => ({
        tipo: "postgres",
        probar,
        obtenerCapacidades: () => ({
          listarRecursos: true,
          esquema: true,
          conteoRegistros: true,
          vistaPrevia: true,
          escritura: true,
        }),
        listarRecursos: async () => [],
        obtenerRecurso: async () => {
          throw new Error("no usado");
        },
      }),
    });

    const respuesta = await app.request("/destino-1/probar", {
      method: "POST",
    });

    expect(respuesta.status).toBe(200);
    expect(probar).toHaveBeenCalledTimes(1);
    expect(actualizar).toHaveBeenCalledWith(
      "org-1",
      "destino-1",
      expect.objectContaining({
        estado: "activo",
        probadaEn: expect.any(Date),
      }),
    );
  });
});
