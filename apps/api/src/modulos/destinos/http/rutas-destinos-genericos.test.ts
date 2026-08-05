import { describe, expect, it } from "bun:test";
import { crearRutasDestinosGenericas } from "./rutas-destinos-genericos.js";
import type { PuertoDestino } from "../aplicacion/puertos/puerto-destino.js";
import type {
  DetalleRecursoDestino,
  RecursoDestino,
} from "../dominio/tipos-destino.js";

interface ConexionFake {
  id: string;
  tipo: string;
  nombre: string;
  estado: string;
  mensajeError: string | null;
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
    tipo: "impala",
    nombre: "Impala principal",
    estado: "activo",
    mensajeError: null,
    config: { host: "localhost" },
    secretoRefs: {},
  },
) {
  return crearRutasDestinosGenericas(
    async () => (conexion ? [conexion] : []),
    async () => ({ id: "conn-1" }),
    async () => undefined,
    async () => undefined,
    async (_c, id) => (conexion && conexion.id === id ? conexion : null),
    async () => "org-1",
    () => fabricarCliente(),
  );
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
          throw new Error("Access Denied: Permission bigquery.tables.list denied");
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
});
