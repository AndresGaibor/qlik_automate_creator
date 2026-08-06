import { esquemaCrearDesdePlantilla } from "@qlik/contratos/automatizaciones";
import { esquemaIdQlik } from "@qlik/contratos/qlik";
import { type Context, Hono } from "hono";
import type { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "../../../nucleo/eventos/puerto-outbox.js";
import { leerJson } from "../../../nucleo/http/leer-json.js";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import type { PuertoIdempotencia } from "../../../nucleo/idempotencia/puerto-idempotencia.js";
import { obtenerContextoSolicitud } from "../../../plataforma/contexto/contexto-solicitud.js";
import type { ServicioQlik } from "../../qlik/publico.js";
import { prepararParametrosPlantilla } from "../aplicacion/servicios/preparar-parametros-plantilla.js";
import { ConsultarPanelAutomatizaciones } from "../aplicacion/casos-de-uso/consultar-panel.js";
import { CrearAutomatizacionDesdePlantilla } from "../aplicacion/casos-de-uso/crear-desde-plantilla.js";
import { EjecutarAutomatizacion } from "../aplicacion/casos-de-uso/ejecutar-automatizacion.js";
import type { PuertoBloqueoEjecucion } from "../aplicacion/puertos/puerto-bloqueo-ejecucion.js";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";

type ModoPlantilla = 1 | 2;

interface ContextoSesion {
  tenantId: string;
  usuarioId: string;
  organizacionId: string;
}

export interface DependenciasRutasPanel {
  resolverQlik(c: Context): Promise<ServicioQlik>;
  resolverSesion(c: Context): Promise<ContextoSesion>;
  consultaTenant: PuertoConsultaTenantQlik;
  obtenerModoGlobal(): Promise<{ modoAutomatizacionActivo: ModoPlantilla }>;
  consultarConexionesOrigen(
    organizacionId: string,
  ): Promise<Array<{ tipo: string; nombre: string; config: Record<string, unknown> }>>;
  consultarConexionDestino(
    destinoId: string,
    organizacionId: string,
  ): Promise<{ tipo: string; config: Record<string, unknown> } | null>;
  bloqueos: PuertoBloqueoEjecucion;
  idempotencia: PuertoIdempotencia;
  outbox: PuertoOutbox;
  auditoria: PuertoAuditoria;
}

function plantillaEfectivaDelModo(
  tenant: Awaited<ReturnType<PuertoConsultaTenantQlik["obtenerTenant"]>>,
  modo: ModoPlantilla,
): { id: string; nombre: string | null } | null {
  if (modo === 1) {
    const id =
      tenant?.automatizacionPlantillaModo1IdQlik ??
      tenant?.automatizacionBaseIdQlik ??
      null;
    const nombre =
      tenant?.automatizacionPlantillaModo1Nombre ??
      tenant?.automatizacionBaseNombre ??
      null;
    if (!id) return null;
    return { id, nombre };
  }
  const id = tenant?.automatizacionPlantillaModo2IdQlik ?? null;
  if (!id) return null;
  return { id, nombre: tenant?.automatizacionPlantillaModo2Nombre ?? null };
}

export function crearRutasPanelAutomatizaciones(
  dependencias: DependenciasRutasPanel,
) {
  const rutas = new Hono();

  rutas.get("/", async (c) => {
    const qlik = await dependencias.resolverQlik(c);
    const espacioId = c.req.query("espacioId")?.trim() || undefined;
    const q =
      c.req.query("q")?.trim() || c.req.query("busqueda")?.trim() || undefined;

    let lista = await new ConsultarPanelAutomatizaciones(qlik).listar(
      espacioId,
    );
    if (q) {
      const qLower = q.toLowerCase();
      lista = lista.filter((auto) =>
        auto.nombre.toLowerCase().includes(qLower),
      );
    }

    return responderExito(c, lista);
  });

  rutas.get("/espacios", async (c) => {
    const qlik = await dependencias.resolverQlik(c);
    return responderExito(
      c,
      await new ConsultarPanelAutomatizaciones(qlik).listarEspacios(),
    );
  });

  /** Devuelve la configuración de automatización efectiva del tenant */
  rutas.get("/configuracion-tenant", async (c) => {
    const sesion = await dependencias.resolverSesion(c);
    const [tenant, { modoAutomatizacionActivo }] = await Promise.all([
      dependencias.consultaTenant.obtenerTenant(sesion.tenantId),
      dependencias.obtenerModoGlobal(),
    ]);
    const plantilla = plantillaEfectivaDelModo(tenant, modoAutomatizacionActivo);
    return responderExito(c, {
      modoAutomatizacionActivo,
      plantillaEfectivaIdQlik: plantilla?.id ?? null,
      plantillaEfectivaNombre: plantilla?.nombre ?? null,
      configurada: plantilla !== null,
    });
  });

  rutas.post("/desde-plantilla", async (c) => {
    const cuerpo = await leerJson(c);
    const claveEncabezado = c.req.header("idempotency-key")?.trim();

    const [qlik, sesion] = await Promise.all([
      dependencias.resolverQlik(c),
      dependencias.resolverSesion(c),
    ]);

    const { modoAutomatizacionActivo } = await dependencias.obtenerModoGlobal();
    const modo: ModoPlantilla = modoAutomatizacionActivo;

    const tenant = await dependencias.consultaTenant.obtenerTenant(
      sesion.tenantId,
    );
    const plantilla = plantillaEfectivaDelModo(tenant, modo);

    if (!plantilla) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje: `El modo ${modo} no tiene plantilla configurada. Configúrala en Administración → Plantilla de Automatización.`,
            codigo: "SIN_PLANTILLA_MODO_ACTIVO",
          },
        },
        422,
      );
    }

    if (modo === 2) {
      const cuerpoObj =
        typeof cuerpo === "object" && cuerpo !== null ? cuerpo : {};
      if (!(cuerpoObj as Record<string, unknown>).destinoId) {
        return c.json(
          {
            exito: false,
            error: {
              mensaje:
                "El destino de datos es obligatorio para el modo 2. Selecciona una conexión destino.",
              codigo: "DESTINO_REQUERIDO_MODO_2",
            },
          },
          422,
        );
      }
    }

    const cuerpoObj =
      typeof cuerpo === "object" && cuerpo !== null ? cuerpo : {};

    if (!(cuerpoObj as Record<string, unknown>).flujoId) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje:
              "El flujo (Dataflow) es obligatorio para preparar la automatización.",
            codigo: "FLUJO_REQUERIDO",
          },
        },
        422,
      );
    }

    const parametros = await prepararParametrosPlantilla(
      {
        qlik,
        consultarConexionesOrigen: dependencias.consultarConexionesOrigen,
        consultarConexionDestino: dependencias.consultarConexionDestino,
      },
      {
        modo,
        organizacionId: sesion.organizacionId,
        flujoId: (cuerpoObj as Record<string, unknown>).flujoId as string,
        tablaId: (cuerpoObj as Record<string, unknown>).tablaId as string | undefined,
        destinoId: (cuerpoObj as Record<string, unknown>).destinoId as string | undefined,
      },
    );

    const entrada = esquemaCrearDesdePlantilla.parse({
      ...cuerpoObj,
      plantillaIdQlik: plantilla.id,
      ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
    });

    const contextoSolicitud = obtenerContextoSolicitud(c);
    const resultado = await new CrearAutomatizacionDesdePlantilla(
      qlik,
      dependencias.idempotencia,
      dependencias.outbox,
      dependencias.auditoria,
    ).ejecutar(
      entrada,
      {
        ...sesion,
        idSolicitud: contextoSolicitud.idSolicitud,
        ip: contextoSolicitud.ip,
        agenteUsuario: contextoSolicitud.agenteUsuario,
      },
      { parametros, modoPlantilla: modo },
    );
    return responderExito(c, resultado, 201);
  });

  rutas.get("/:id/workspace", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const qlik = await dependencias.resolverQlik(c);
    const automatizacion = await qlik.obtenerAutomatizacion(id);
    return responderExito(c, {
      id: automatizacion.id,
      nombre: automatizacion.name,
      workspace: automatizacion.workspace ?? {},
      schedules: automatizacion.schedules ?? [],
    });
  });

  rutas.put("/:id/workspace", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const cuerpo = (await c.req.json()) as {
      workspace: Record<string, unknown>;
    };
    if (
      !cuerpo ||
      typeof cuerpo.workspace !== "object" ||
      cuerpo.workspace === null
    ) {
      return c.json(
        {
          exito: false,
          error: { mensaje: "El workspace debe ser un objeto JSON válido" },
        },
        400,
      );
    }
    const qlik = await dependencias.resolverQlik(c);
    const actualizada = await qlik.actualizarAutomatizacion(id, {
      workspace: cuerpo.workspace,
    });
    return responderExito(c, {
      id: actualizada.id,
      nombre: actualizada.name,
      workspace: actualizada.workspace ?? {},
    });
  });

  rutas.post("/:id/clonar", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const cuerpo = (await c.req.json().catch(() => ({}))) as {
      nombre?: string;
      espacioIdQlik?: string;
    };
    const qlik = await dependencias.resolverQlik(c);
    const original = await qlik.obtenerAutomatizacion(id);
    const nombreCopia = cuerpo.nombre?.trim() || `${original.name} (Copia)`;
    const copia = await qlik.copiarAutomatizacion(id, nombreCopia);
    if (cuerpo.espacioIdQlik) {
      await qlik.cambiarEspacioAutomatizacion(copia.id, cuerpo.espacioIdQlik);
    }
    return responderExito(c, { id: copia.id, nombre: nombreCopia }, 201);
  });

  rutas.get("/:id", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const qlik = await dependencias.resolverQlik(c);
    return responderExito(
      c,
      await new ConsultarPanelAutomatizaciones(qlik).obtener(id),
    );
  });

  rutas.post("/:id/ejecuciones", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const [qlik, sesion] = await Promise.all([
      dependencias.resolverQlik(c),
      dependencias.resolverSesion(c),
    ]);
    const resultado = await new EjecutarAutomatizacion(
      qlik,
      dependencias.bloqueos,
    ).ejecutar(sesion.tenantId, id);
    return responderExito(c, resultado, 201);
  });

  rutas.post("/:id/ejecuciones/:ejecucionId/detener", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const ejecucionId = esquemaIdQlik.parse(c.req.param("ejecucionId"));
    const qlik = await dependencias.resolverQlik(c);
    await qlik.detenerEjecucion(id, ejecucionId);
    return responderExito(c, { detenida: true as const });
  });

  return rutas;
}
