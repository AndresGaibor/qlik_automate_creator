import { describe, expect, it, vi } from "bun:test";
import { Hono } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "../../../nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "../../../nucleo/idempotencia/puerto-idempotencia.js";
import type { ServicioQlik } from "../../qlik/publico.js";
import type { PuertoBloqueoEjecucion } from "../aplicacion/puertos/puerto-bloqueo-ejecucion.js";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";
import { crearRutasPanelAutomatizaciones } from "./rutas-panel.js";

interface ContextoSesion {
  tenantId: string;
  usuarioId: string;
  organizacionId: string;
}

interface ContextoSolicitudPrueba {
  idSolicitud: string;
  esSuperadmin: boolean;
  roles: Array<"admin" | "usuario">;
}

function crearIdempotencia() {
  const puerto: PuertoIdempotencia = {
    iniciar: vi.fn(async () => "iniciada" as const),
    obtener: vi.fn(async () => null),
    completar: vi.fn(async () => undefined),
    fallar: vi.fn(async () => undefined),
  };
  return puerto;
}

function crearOutbox() {
  const puerto: PuertoOutbox = {
    guardar: vi.fn(async () => undefined),
    listarPendientes: async () => [],
    marcarPublicado: async () => undefined,
    registrarFallo: async () => undefined,
  };
  return puerto;
}

function crearAuditoria() {
  const puerto: PuertoAuditoria = {
    registrar: vi.fn(async () => undefined),
  };
  return puerto;
}

function crearBloqueos(): PuertoBloqueoEjecucion {
  const mock = vi.fn(
    async <T>(
      _clave: string,
      _tarea: () => Promise<T>,
    ): Promise<T | undefined> => {
      return await _tarea();
    },
  );
  return { ejecutarExclusivo: mock } as unknown as PuertoBloqueoEjecucion;
}

const sesionBase: ContextoSesion = {
  tenantId: "tenant-1",
  usuarioId: "usuario-1",
  organizacionId: "org-1",
};

function crearApp(deps: {
  mockResolverQlik: () => Promise<ServicioQlik>;
  mockResolverSesion: () => Promise<ContextoSesion>;
  consultaTenant: PuertoConsultaTenantQlik;
  obtenerModoGlobal: () => Promise<{ modoAutomatizacionActivo: 1 | 2 }>;
  consultarConexionesOrigen: (
    organizacionId: string,
  ) => Promise<
    Array<{ tipo: string; nombre: string; config: Record<string, unknown> }>
  >;
  consultarConexionDestino: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<{ tipo: string; config: Record<string, unknown> } | null>;
  bloqueos: PuertoBloqueoEjecucion;
  idempotencia: PuertoIdempotencia;
  outbox: PuertoOutbox;
  auditoria: PuertoAuditoria;
  resolverPoliticaEspacios?: () => Promise<{
    restringida: boolean;
    configurada: boolean;
    espaciosPermitidosIds: string[];
    permitirRecursosSinEspacio: boolean;
    puedeVer(espacioId?: string | null): boolean;
  }>;
  contextoSolicitud?: ContextoSolicitudPrueba;
}) {
  const app = new Hono<{
    Variables: { contextoSolicitud: ContextoSolicitudPrueba };
  }>();
  app.use("*", async (c, next) => {
    c.set(
      "contextoSolicitud",
      deps.contextoSolicitud ?? {
        idSolicitud: "solicitud-test",
        esSuperadmin: false,
        roles: ["usuario"],
      },
    );
    await next();
  });

  app.route(
    "/api/automatizaciones",
    crearRutasPanelAutomatizaciones({
      resolverQlik: () => deps.mockResolverQlik(),
      resolverSesion: () => deps.mockResolverSesion(),
      consultaTenant: deps.consultaTenant,
      obtenerModoGlobal: deps.obtenerModoGlobal,
      consultarConexionesOrigen: deps.consultarConexionesOrigen,
      consultarConexionDestino: deps.consultarConexionDestino,
      bloqueos: deps.bloqueos,
      idempotencia: deps.idempotencia,
      outbox: deps.outbox,
      auditoria: deps.auditoria,
      resolverPoliticaEspacios: deps.resolverPoliticaEspacios
        ? deps.resolverPoliticaEspacios
        : undefined,
    }),
  );
  return app;
}

describe("rutas-panel · GET /configuracion-tenant", () => {
  it("devuelve plantilla efectiva del modo 2 y configurada=true", async () => {
    const app = crearApp({
      mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: "plantilla-modo1",
          automatizacionPlantillaModo1Nombre: "Plantilla Modo 1",
          automatizacionPlantillaModo2IdQlik: "plantilla-talend",
          automatizacionPlantillaModo2Nombre: "Talend SFTP",
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      },
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 2 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => null,
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
    });

    const respuesta = await app.request(
      "/api/automatizaciones/configuracion-tenant",
    );
    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos).toEqual({
      modoAutomatizacionActivo: 2,
      plantillaEfectivaIdQlik: "plantilla-talend",
      plantillaEfectivaNombre: "Talend SFTP",
      configurada: true,
      puedeAdministrarConexiones: false,
      accesoEspacios: {
        restringido: false,
        configurado: true,
        cerrado: false,
        cantidadEspacios: 0,
        permitirRecursosSinEspacio: false,
      },
    });
  });

  it("expone permisos administrativos desde el contexto autenticado", async () => {
    const crearConfiguracion = async (
      contextoSolicitud: ContextoSolicitudPrueba,
    ) => {
      const app = crearApp({
        mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
        mockResolverSesion: async () => sesionBase,
        consultaTenant: {
          obtenerTenant: vi.fn(async () => ({
            host: "empresa.us.qlikcloud.com",
            automatizacionBaseIdQlik: "base-1",
            automatizacionBaseNombre: "Base",
            automatizacionPlantillaModo1IdQlik: "plantilla-modo1",
            automatizacionPlantillaModo1Nombre: "Plantilla Modo 1",
            automatizacionPlantillaModo2IdQlik: null,
            automatizacionPlantillaModo2Nombre: null,
            destinoApiUrl: null,
            impalaHost: null,
            impalaPort: null,
          })),
        },
        obtenerModoGlobal: async () => ({
          modoAutomatizacionActivo: 1 as const,
        }),
        consultarConexionesOrigen: async () => [],
        consultarConexionDestino: async () => null,
        bloqueos: crearBloqueos(),
        idempotencia: crearIdempotencia(),
        outbox: crearOutbox(),
        auditoria: crearAuditoria(),
        contextoSolicitud,
      });
      const respuesta = await app.request(
        "/api/automatizaciones/configuracion-tenant",
      );
      return (await respuesta.json()).datos;
    };

    expect(
      await crearConfiguracion({
        idSolicitud: "solicitud-admin",
        esSuperadmin: false,
        roles: ["admin"],
      }),
    ).toMatchObject({ puedeAdministrarConexiones: true });
    expect(
      await crearConfiguracion({
        idSolicitud: "solicitud-usuario",
        esSuperadmin: false,
        roles: ["usuario"],
      }),
    ).toMatchObject({ puedeAdministrarConexiones: false });
    expect(
      await crearConfiguracion({
        idSolicitud: "solicitud-superadmin",
        esSuperadmin: true,
        roles: ["usuario"],
      }),
    ).toMatchObject({ puedeAdministrarConexiones: true });
  });

  it("devuelve plantilla modo 1 cuando modo global es 1", async () => {
    const app = crearApp({
      mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: "plantilla-modo1",
          automatizacionPlantillaModo1Nombre: "Plantilla Modo 1",
          automatizacionPlantillaModo2IdQlik: null,
          automatizacionPlantillaModo2Nombre: null,
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      },
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 1 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => null,
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
    });

    const respuesta = await app.request(
      "/api/automatizaciones/configuracion-tenant",
    );
    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos.modoAutomatizacionActivo).toBe(1);
    expect(cuerpo.datos.plantillaEfectivaIdQlik).toBe("plantilla-modo1");
    expect(cuerpo.datos.configurada).toBe(true);
  });

  it("devuelve configurada=false cuando no hay plantilla para el modo activo", async () => {
    const app = crearApp({
      mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: null,
          automatizacionPlantillaModo1Nombre: null,
          automatizacionPlantillaModo2IdQlik: null,
          automatizacionPlantillaModo2Nombre: null,
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      },
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 2 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => null,
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
    });

    const respuesta = await app.request(
      "/api/automatizaciones/configuracion-tenant",
    );
    expect(respuesta.status).toBe(200);
    const cuerpo = await respuesta.json();
    expect(cuerpo.datos.configurada).toBe(false);
    expect(cuerpo.datos.plantillaEfectivaIdQlik).toBe(null);
  });
});

describe("rutas-panel · POST /desde-plantilla", () => {
  it("crea automatizacion en modo 2 sin destinoId devuelve DESTINO_REQUERIDO_MODO_2 (el test completo con parametros en crear-desde-plantilla.test.ts)", async () => {
    const app = crearApp({
      mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: "plantilla-modo1",
          automatizacionPlantillaModo1Nombre: "Plantilla Modo 1",
          automatizacionPlantillaModo2IdQlik: "plantilla-talend",
          automatizacionPlantillaModo2Nombre: "Talend SFTP",
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      },
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 2 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => null,
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
    });

    const respuesta = await app.request(
      "/api/automatizaciones/desde-plantilla",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nueva",
          plantillaIdQlik: "plantilla-talend",
          flujoId: "flujo-1",
        }),
      },
    );

    expect(respuesta.status).toBe(422);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.codigo).toBe("DESTINO_REQUERIDO_MODO_2");
  });

  it("devuelve 422 SIN_PLANTILLA_MODO_ACTIVO cuando modo 2 activo sin plantilla modo 2", async () => {
    const app = crearApp({
      mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: "plantilla-modo1",
          automatizacionPlantillaModo1Nombre: "Plantilla Modo 1",
          automatizacionPlantillaModo2IdQlik: null,
          automatizacionPlantillaModo2Nombre: null,
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      },
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 2 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => null,
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
    });

    const respuesta = await app.request(
      "/api/automatizaciones/desde-plantilla",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nueva",
          plantillaIdQlik: "ignorado",
          flujoId: "flujo-1",
        }),
      },
    );

    expect(respuesta.status).toBe(422);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.codigo).toBe("SIN_PLANTILLA_MODO_ACTIVO");
  });

  it("devuelve 422 DESTINO_REQUERIDO_MODO_2 cuando modo 2 sin destinoId", async () => {
    const app = crearApp({
      mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: "plantilla-modo1",
          automatizacionPlantillaModo1Nombre: "Plantilla Modo 1",
          automatizacionPlantillaModo2IdQlik: "plantilla-talend",
          automatizacionPlantillaModo2Nombre: "Talend SFTP",
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      },
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 2 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => null,
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
    });

    const respuesta = await app.request(
      "/api/automatizaciones/desde-plantilla",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nueva",
          plantillaIdQlik: "plantilla-talend",
          flujoId: "flujo-1",
        }),
      },
    );

    expect(respuesta.status).toBe(422);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.codigo).toBe("DESTINO_REQUERIDO_MODO_2");
  });

  it("devuelve 422 FLUJO_REQUERIDO cuando falta flujoId", async () => {
    const app = crearApp({
      mockResolverQlik: async () => ({}) as unknown as ServicioQlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: "plantilla-modo1",
          automatizacionPlantillaModo1Nombre: "Plantilla Modo 1",
          automatizacionPlantillaModo2IdQlik: "plantilla-talend",
          automatizacionPlantillaModo2Nombre: "Talend SFTP",
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      },
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 2 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => ({
        tipo: "postgres",
        config: { host: "localhost" },
      }),
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
    });

    const respuesta = await app.request(
      "/api/automatizaciones/desde-plantilla",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nueva",
          plantillaIdQlik: "plantilla-talend",
          destinoId: "550e8400-e29b-41d4-a716-446655440000",
        }),
      },
    );

    expect(respuesta.status).toBe(422);
    const cuerpo = await respuesta.json();
    expect(cuerpo.error.codigo).toBe("FLUJO_REQUERIDO");
  });
});

describe("rutas-panel · autorización por espacios", () => {
  function politicaRestringida() {
    return Promise.resolve({
      restringida: true,
      configurada: true,
      espaciosPermitidosIds: ["space-allowed"],
      permitirRecursosSinEspacio: false,
      puedeVer: (espacioId?: string | null) => espacioId === "space-allowed",
    });
  }

  function dependenciasConQlik(qlik: ServicioQlik) {
    return {
      mockResolverQlik: async () => qlik,
      mockResolverSesion: async () => sesionBase,
      consultaTenant: {
        obtenerTenant: vi.fn(async () => ({
          host: "empresa.us.qlikcloud.com",
          automatizacionBaseIdQlik: "base-1",
          automatizacionBaseNombre: "Base",
          automatizacionPlantillaModo1IdQlik: "base-1",
          automatizacionPlantillaModo1Nombre: "Base",
          automatizacionPlantillaModo2IdQlik: null,
          automatizacionPlantillaModo2Nombre: null,
          destinoApiUrl: null,
          impalaHost: null,
          impalaPort: null,
        })),
      } as PuertoConsultaTenantQlik,
      obtenerModoGlobal: async () => ({ modoAutomatizacionActivo: 1 as const }),
      consultarConexionesOrigen: async () => [],
      consultarConexionDestino: async () => null,
      bloqueos: crearBloqueos(),
      idempotencia: crearIdempotencia(),
      outbox: crearOutbox(),
      auditoria: crearAuditoria(),
      resolverPoliticaEspacios: politicaRestringida,
    };
  }

  it("bloquea detalle, workspace y ejecución de automatización no autorizada", async () => {
    const ejecutarAutomatizacion = vi.fn(async () => ({ runId: "run-1" }));
    const listarEjecuciones = vi.fn(async () => []);
    const qlik = {
      obtenerAutomatizacion: vi.fn(async () => ({
        id: "automation-denied",
        name: "Oculta",
        spaceId: "space-denied",
      })),
      listarEjecuciones,
      ejecutarAutomatizacion,
    } as unknown as ServicioQlik;
    const app = crearApp(dependenciasConQlik(qlik));

    for (const [ruta, metodo, body] of [
      ["/api/automatizaciones/automation-denied", "GET", undefined],
      ["/api/automatizaciones/automation-denied/workspace", "GET", undefined],
      [
        "/api/automatizaciones/automation-denied/workspace",
        "PUT",
        JSON.stringify({ workspace: {} }),
      ],
      ["/api/automatizaciones/automation-denied/clonar", "POST", "{}"],
      [
        "/api/automatizaciones/automation-denied/ejecuciones",
        "POST",
        undefined,
      ],
      [
        "/api/automatizaciones/automation-denied/ejecuciones/run-1/detener",
        "POST",
        undefined,
      ],
    ] as const) {
      const respuesta = await app.request(ruta, {
        method: metodo,
        ...(body
          ? { headers: { "content-type": "application/json" }, body }
          : {}),
      });
      expect(respuesta.status).toBe(403);
      const cuerpo = await respuesta.json();
      expect(cuerpo.error.codigo).toBe("ESPACIO_NO_AUTORIZADO");
      expect(JSON.stringify(cuerpo)).not.toContain("Oculta");
    }

    expect(listarEjecuciones).not.toHaveBeenCalled();
    expect(ejecutarAutomatizacion).not.toHaveBeenCalled();
  });

  it("bloquea creación desde un Dataflow no autorizado antes de copiar la plantilla", async () => {
    const copiarAutomatizacion = vi.fn();
    const qlik = {
      listarFlujos: vi.fn(async () => [
        { id: "flow-denied", name: "Flujo oculto", spaceId: "space-denied" },
      ]),
      copiarAutomatizacion,
    } as unknown as ServicioQlik;
    const app = crearApp(dependenciasConQlik(qlik));

    const respuesta = await app.request(
      "/api/automatizaciones/desde-plantilla",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: "Nueva",
          flujoId: "flow-denied",
          tablaId: "tabla",
        }),
      },
    );

    expect(respuesta.status).toBe(403);
    expect(copiarAutomatizacion).not.toHaveBeenCalled();
  });

  it("bloquea clonar hacia un espacio destino no autorizado", async () => {
    const copiarAutomatizacion = vi.fn(async () => ({ id: "copy-1" }));
    const qlik = {
      obtenerAutomatizacion: vi.fn(async () => ({
        id: "automation-allowed",
        name: "Permitida",
        spaceId: "space-allowed",
      })),
      copiarAutomatizacion,
    } as unknown as ServicioQlik;
    const app = crearApp(dependenciasConQlik(qlik));

    const respuesta = await app.request(
      "/api/automatizaciones/automation-allowed/clonar",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ espacioIdQlik: "space-denied" }),
      },
    );

    expect(respuesta.status).toBe(403);
    expect(copiarAutomatizacion).not.toHaveBeenCalled();
  });
});
