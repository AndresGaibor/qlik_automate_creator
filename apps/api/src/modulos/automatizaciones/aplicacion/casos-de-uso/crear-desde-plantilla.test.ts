import { describe, expect, it, vi } from "bun:test";
import type { PuertoAuditoria } from "../../../../nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "../../../../nucleo/eventos/puerto-outbox.js";
import type {
  PuertoIdempotencia,
  RegistroIdempotencia,
} from "../../../../nucleo/idempotencia/puerto-idempotencia.js";
import type { ServicioQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
import type { ParametrosPlantilla } from "../servicios/preparar-parametros-plantilla.js";
import { CrearAutomatizacionDesdePlantilla } from "./crear-desde-plantilla.js";

function crearQlik() {
  return {
    copiarAutomatizacion: vi.fn(async () => ({ id: "copia-1" })),
    cambiarEspacioAutomatizacion: vi.fn(async () => undefined),
    cambiarPropietarioAutomatizacion: vi.fn(async () => undefined),
    obtenerAutomatizacion: vi.fn(async () => ({
      id: "copia-1",
      name: "Nueva",
      schedules: [],
      workspace: { blocks: [{ settings: { table: "origen" } }] },
      description: "Plantilla",
      maxConcurrentRuns: 1,
    })),
    actualizarAutomatizacion: vi.fn(
      async (_id: string, definicion: unknown) => ({
        id: "copia-1",
        name: "Nueva",
        ...(definicion as Record<string, unknown>),
      }),
    ),
    eliminarAutomatizacion: vi.fn(async () => undefined),
  } as unknown as ServicioQlik;
}

function crearIdempotencia() {
  const registros = new Map<string, RegistroIdempotencia>();
  const claveRegistro = (
    organizacionId: string,
    alcance: string,
    clave: string,
  ) => `${organizacionId}:${alcance}:${clave}`;

  const puerto: PuertoIdempotencia = {
    async iniciar(registro) {
      const indice = claveRegistro(
        registro.organizacionId,
        registro.alcance,
        registro.clave,
      );
      if (registros.has(indice)) return "existente";
      registros.set(indice, { ...registro, estado: "procesando" });
      return "iniciada";
    },
    async obtener(organizacionId, alcance, clave) {
      return (
        registros.get(claveRegistro(organizacionId, alcance, clave)) ?? null
      );
    },
    async completar(organizacionId, alcance, clave, estadoHttp, respuesta) {
      const indice = claveRegistro(organizacionId, alcance, clave);
      const actual = registros.get(indice);
      if (actual) {
        registros.set(indice, {
          ...actual,
          estado: "completada",
          estadoHttp,
          respuesta,
        });
      }
    },
    async fallar(organizacionId, alcance, clave, estadoHttp, respuesta) {
      const indice = claveRegistro(organizacionId, alcance, clave);
      const actual = registros.get(indice);
      if (actual) {
        registros.set(indice, {
          ...actual,
          estado: "fallida",
          estadoHttp,
          respuesta,
        });
      }
    },
  };

  return { puerto, registros };
}

function crearOutbox() {
  const guardar = vi.fn(async () => undefined);
  return {
    puerto: {
      guardar,
      listarPendientes: async () => [],
      marcarPublicado: async () => undefined,
      registrarFallo: async () => undefined,
    } satisfies PuertoOutbox,
    guardar,
  };
}

function crearAuditoria() {
  const registrar = vi.fn(async () => undefined);
  return {
    puerto: { registrar } satisfies PuertoAuditoria,
    registrar,
  };
}

const contexto = {
  tenantId: "tenant-1",
  organizacionId: "organizacion-1",
  usuarioId: "usuario-1",
  idSolicitud: "solicitud-1",
};

describe("CrearAutomatizacionDesdePlantilla", () => {
  it("copia, reubica y reemplaza únicamente rutas existentes", async () => {
    const qlik = crearQlik();
    const idempotencia = crearIdempotencia();
    const outbox = crearOutbox();
    const auditoria = crearAuditoria();
    const caso = new CrearAutomatizacionDesdePlantilla(
      qlik,
      idempotencia.puerto,
      outbox.puerto,
      auditoria.puerto,
    );

    const resultado = await caso.ejecutar(
      {
        nombre: "Nueva",
        plantillaIdQlik: "plantilla-1",
        espacioIdQlik: "espacio-1",
        propietarioIdQlik: "propietario-1",
        reemplazosWorkspace: [
          { ruta: "/blocks/0/settings/table", valor: "ventas" },
        ],
        claveIdempotencia: "clave-idempotente-1",
      },
      contexto,
    );

    expect(resultado).toEqual({
      id: "copia-1",
      nombre: "Nueva",
      plantillaIdQlik: "plantilla-1",
      modoPlantilla: 1,
    });
    expect(qlik.cambiarEspacioAutomatizacion).toHaveBeenCalledWith(
      "copia-1",
      "espacio-1",
    );
    expect(qlik.cambiarPropietarioAutomatizacion).toHaveBeenCalledWith(
      "copia-1",
      "propietario-1",
    );
    expect(qlik.actualizarAutomatizacion).toHaveBeenCalledWith(
      "copia-1",
      expect.objectContaining({
        workspace: { blocks: [{ settings: { table: "ventas" } }] },
      }),
    );
    expect(outbox.guardar).toHaveBeenCalledTimes(1);
    expect(auditoria.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ resultado: "exito", entidadId: "copia-1" }),
    );
  });

  it("devuelve la respuesta guardada al repetir la misma clave", async () => {
    const qlik = crearQlik();
    const idempotencia = crearIdempotencia();
    const outbox = crearOutbox();
    const auditoria = crearAuditoria();
    const caso = new CrearAutomatizacionDesdePlantilla(
      qlik,
      idempotencia.puerto,
      outbox.puerto,
      auditoria.puerto,
    );
    const entrada = {
      nombre: "Nueva",
      plantillaIdQlik: "plantilla-1",
      reemplazosWorkspace: [],
      claveIdempotencia: "clave-idempotente-2",
    };

    const primero = await caso.ejecutar(entrada, contexto);
    const segundo = await caso.ejecutar(entrada, contexto);

    expect(segundo).toEqual(primero);
    expect(qlik.copiarAutomatizacion).toHaveBeenCalledTimes(1);
  });

  it("elimina la copia cuando un reemplazo no existe", async () => {
    const qlik = crearQlik();
    const idempotencia = crearIdempotencia();
    const outbox = crearOutbox();
    const auditoria = crearAuditoria();
    const caso = new CrearAutomatizacionDesdePlantilla(
      qlik,
      idempotencia.puerto,
      outbox.puerto,
      auditoria.puerto,
    );

    await expect(
      caso.ejecutar(
        {
          nombre: "Nueva",
          plantillaIdQlik: "plantilla-1",
          reemplazosWorkspace: [{ ruta: "/blocks/9/value", valor: "x" }],
          claveIdempotencia: "clave-idempotente-3",
        },
        contexto,
      ),
    ).rejects.toThrow("no existe");

    expect(qlik.eliminarAutomatizacion).toHaveBeenCalledWith("copia-1");
    expect(auditoria.registrar).toHaveBeenCalledWith(
      expect.objectContaining({ resultado: "error", entidadId: "copia-1" }),
    );
  });

  it("ejecutar con modo 2 incluye modoPlantilla 2 y pasa parametros a copiarAutomatizacion", async () => {
    const mockQlik = {
      copiarAutomatizacion: vi.fn(async () => ({ id: "copia-m2" })),
      cambiarEspacioAutomatizacion: vi.fn(async () => undefined),
      cambiarPropietarioAutomatizacion: vi.fn(async () => undefined),
      obtenerAutomatizacion: vi.fn(async () => ({
        id: "copia-m2",
        name: "Nueva Modo 2",
        schedules: [],
        workspace: {
          variables: [
            { name: "DataflowId", value: "" },
            { name: "RutasSftpContenido", value: "" },
            { name: "EsquemaTablaDestino", value: "" },
            { name: "EjecucionId", value: "" },
            { name: "TablaDestino", value: "" },
          ],
          blocks: [],
        },
        description: "",
        maxConcurrentRuns: 1,
      })),
      actualizarAutomatizacion: vi.fn(async () => ({})),
      eliminarAutomatizacion: vi.fn(async () => undefined),
    } as unknown as ServicioQlik;

    const idempotencia = crearIdempotencia();
    const outbox = crearOutbox();
    const auditoria = crearAuditoria();
    const caso = new CrearAutomatizacionDesdePlantilla(
      mockQlik,
      idempotencia.puerto,
      outbox.puerto,
      auditoria.puerto,
    );

    const parametros: ParametrosPlantilla = {
      modo: 2,
      DataflowId: "flujo-2",
      RutasSftpContenido: '[{"ruta":"/data"}]',
      EsquemaTablaDestino: '{"columnas":["a","b"]}',
      EjecucionId: "ejec-2",
      TablaDestino: "tabla-2",
    };

    const resultado = await caso.ejecutar(
      {
        nombre: "Nueva Modo 2",
        plantillaIdQlik: "plantilla-m2",
        flujoId: "flujo-2",
        tablaId: "tabla-2",
        destinoId: "destino-2",
        reemplazosWorkspace: [],
      },
      contexto,
      { parametros, modoPlantilla: 2 },
    );

    expect(resultado.modoPlantilla).toBe(2);
    expect(mockQlik.copiarAutomatizacion).toHaveBeenCalled();
    expect(outbox.guardar).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          datos: expect.objectContaining({ modoPlantilla: 2 }),
        }),
      ]),
    );
    expect(auditoria.registrar).toHaveBeenCalledWith(
      expect.objectContaining({
        datosNuevos: expect.objectContaining({ modoPlantilla: 2 }),
      }),
    );
  });

  it("limita secretos al workspace y no los filtra a respuesta, outbox o auditoría", async () => {
    const qlik = crearQlik();
    qlik.obtenerAutomatizacion = vi.fn(async () => ({
      id: "copia-1",
      name: "Nueva",
      schedules: [],
      workspace: {
        variables: [
          { name: "Appid", value: "" },
          { name: "DFScript", value: "" },
          { name: "ConexionJSON", value: "" },
          { name: "BaseDestinoJSON", value: "" },
          { name: "SECRETOSJSON", value: "" },
        ],
        blocks: [],
      },
      description: "Plantilla",
      maxConcurrentRuns: 1,
    }));
    const idempotencia = crearIdempotencia();
    const outbox = crearOutbox();
    const auditoria = crearAuditoria();
    const caso = new CrearAutomatizacionDesdePlantilla(
      qlik,
      idempotencia.puerto,
      outbox.puerto,
      auditoria.puerto,
    );
    const secreto = "CLAVE_SUPER_SECRETA";
    const pem = "-----BEGIN OPENSSH PRIVATE KEY-----";
    const parametros: ParametrosPlantilla = {
      modo: 1,
      Appid: "flujo-1",
      DFScript: "LOAD *;",
      ConexionJSON: "[]",
      BaseDestinoJSON: "{}",
      SECRETOSJSON: JSON.stringify({ JDBC: secreto, SFTP: pem }),
    };

    const resultado = await caso.ejecutar(
      {
        nombre: "Nueva",
        plantillaIdQlik: "plantilla-1",
        flujoId: "flujo-1",
        destinoId: "destino-1",
        reemplazosWorkspace: [],
      },
      contexto,
      { parametros, modoPlantilla: 1 },
    );

    const actualizarAutomatizacion =
      qlik.actualizarAutomatizacion as ReturnType<typeof vi.fn>;
    const actualizacion = JSON.stringify(
      actualizarAutomatizacion.mock.calls[0]?.[1],
    );
    expect(actualizacion).toContain(secreto);
    expect(actualizacion).toContain(pem);
    for (const frontera of [
      resultado,
      outbox.guardar.mock.calls,
      auditoria.registrar.mock.calls,
    ]) {
      const serializada = JSON.stringify(frontera);
      expect(serializada).not.toContain(secreto);
      expect(serializada).not.toContain(pem);
      expect(serializada).not.toContain("postgres://writer:clave@");
    }
  });
});
