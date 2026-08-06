import {
  esquemaCrearDesdePlantilla,
  esquemaEntradaCrearModo1,
} from "@qlik/contratos/automatizaciones";
import { esquemaIdQlik } from "@qlik/contratos/qlik";
import { type Context, Hono } from "hono";
import { z } from "zod";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { ErrorAplicacion } from "../../../nucleo/errores/error-aplicacion.js";
import type { PuertoOutbox } from "../../../nucleo/eventos/puerto-outbox.js";
import { leerJson } from "../../../nucleo/http/leer-json.js";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import type { PuertoIdempotencia } from "../../../nucleo/idempotencia/puerto-idempotencia.js";
import { obtenerContextoSolicitud } from "../../../plataforma/contexto/contexto-solicitud.js";
import type { FabricaDestino } from "../../destinos/publico.js";
import type { ServicioQlik } from "../../qlik/publico.js";
import { ConsultarPanelAutomatizaciones } from "../aplicacion/casos-de-uso/consultar-panel.js";
import { CrearAutomatizacionDesdePlantilla } from "../aplicacion/casos-de-uso/crear-desde-plantilla.js";
import { EjecutarAutomatizacion } from "../aplicacion/casos-de-uso/ejecutar-automatizacion.js";
import { PreflightAutomatizacion } from "../aplicacion/casos-de-uso/preflight-automatizacion.js";
import type { PuertoBloqueoEjecucion } from "../aplicacion/puertos/puerto-bloqueo-ejecucion.js";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";
import { prepararParametrosPlantilla } from "../aplicacion/servicios/preparar-parametros-plantilla.js";

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
  consultarConexionesOrigen(organizacionId: string): Promise<
    Array<{
      id?: string;
      tipo: string;
      nombre: string;
      config: Record<string, unknown>;
      estado?: "sin_probar" | "disponible" | "error";
      probadaEn?: Date | null;
      mensajeError?: string | null;
    }>
  >;
  consultarConexionesDestino?: (organizacionId: string) => Promise<
    Array<{
      id: string;
      tipo: string;
      nombre: string;
      estado: "activo" | "error" | "desconectado";
      probadaEn: Date | null;
      mensajeError: string | null;
    }>
  >;
  consultarConexionDestino(
    destinoId: string,
    organizacionId: string,
  ): Promise<{ tipo: string; config: Record<string, unknown> } | null>;
  crearClienteDestino?: FabricaDestino;
  probarConexionOrigen?: (
    organizacionId: string,
    conexionId: string,
  ) => Promise<unknown>;
  leerSecretoOrigen?: (
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ) => Promise<string | null>;
  obtenerConexionDestinoConSecreto?: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<{
    id: string;
    tipo: string;
    nombre: string;
    estado: "activo" | "error" | "desconectado";
    probadaEn: Date | null;
    mensajeError: string | null;
    config: Record<string, unknown>;
    secreto: { nombre: string; valor: string } | null;
  } | null>;
  probarConexionDestino?: (
    organizacionId: string,
    destinoId: string,
  ) => Promise<unknown>;
  bloqueos: PuertoBloqueoEjecucion;
  idempotencia: PuertoIdempotencia;
  outbox: PuertoOutbox;
  auditoria: PuertoAuditoria;
  resolverPoliticaEspacios?: (c: Context) => Promise<{
    restringida: boolean;
    configurada: boolean;
    espaciosPermitidosIds: string[];
    permitirRecursosSinEspacio: boolean;
    puedeVer(espacioId?: string | null): boolean;
  }>;
}

function responderEspacioNoAutorizado(c: Context) {
  return c.json(
    {
      exito: false,
      error: {
        mensaje: "No tienes acceso a este recurso",
        codigo: "ESPACIO_NO_AUTORIZADO",
      },
    },
    403,
  );
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

  async function obtenerAutomatizacionAutorizada(c: Context, id: string) {
    const qlik = await dependencias.resolverQlik(c);
    const automatizacion = await qlik.obtenerAutomatizacion(id);
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    return {
      qlik,
      automatizacion,
      autorizada:
        !politica?.restringida || politica.puedeVer(automatizacion.spaceId),
    };
  }

  rutas.get("/", async (c) => {
    const qlik = await dependencias.resolverQlik(c);
    const espacioId = c.req.query("espacioId")?.trim() || undefined;
    const q =
      c.req.query("q")?.trim() || c.req.query("busqueda")?.trim() || undefined;

    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    if (espacioId && politica?.restringida && !politica.puedeVer(espacioId)) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje: "No tienes acceso a este espacio de Qlik Cloud",
            codigo: "ESPACIO_NO_AUTORIZADO",
          },
        },
        403,
      );
    }

    let lista = await new ConsultarPanelAutomatizaciones(qlik).listar(
      espacioId,
    );
    if (politica?.restringida) {
      lista = lista.filter((auto) => politica.puedeVer(auto.espacioId));
    }
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
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    const espacios = await new ConsultarPanelAutomatizaciones(
      qlik,
    ).listarEspacios();
    return responderExito(
      c,
      politica?.restringida
        ? espacios.filter((espacio) => politica.puedeVer(espacio.id))
        : espacios,
    );
  });

  /** Devuelve la configuración de automatización efectiva del tenant */
  rutas.get("/configuracion-tenant", async (c) => {
    const sesion = await dependencias.resolverSesion(c);
    const [tenant, { modoAutomatizacionActivo }, politicaEspacios] =
      await Promise.all([
        dependencias.consultaTenant.obtenerTenant(sesion.tenantId),
        dependencias.obtenerModoGlobal(),
        dependencias.resolverPoliticaEspacios
          ? dependencias.resolverPoliticaEspacios(c)
          : Promise.resolve(null),
      ]);
    const plantilla = plantillaEfectivaDelModo(
      tenant,
      modoAutomatizacionActivo,
    );
    const contexto = obtenerContextoSolicitud(c);
    const puedeAdministrarConexiones = Boolean(
      contexto.esSuperadmin || contexto.roles?.includes("admin"),
    );
    return responderExito(c, {
      modoAutomatizacionActivo,
      plantillaEfectivaIdQlik: plantilla?.id ?? null,
      plantillaEfectivaNombre: plantilla?.nombre ?? null,
      configurada: plantilla !== null,
      puedeAdministrarConexiones,
      accesoEspacios: {
        restringido: politicaEspacios?.restringida ?? false,
        configurado: politicaEspacios?.configurada ?? true,
        cerrado:
          Boolean(politicaEspacios?.restringida) &&
          (politicaEspacios?.espaciosPermitidosIds.length ?? 0) === 0 &&
          !politicaEspacios?.permitirRecursosSinEspacio,
        cantidadEspacios: politicaEspacios?.espaciosPermitidosIds.length ?? 0,
        permitirRecursosSinEspacio:
          politicaEspacios?.permitirRecursosSinEspacio ?? false,
      },
    });
  });

  rutas.post("/preflight", async (c) => {
    const entrada = z
      .object({ flujoId: z.string().trim().min(1) })
      .parse(await leerJson(c));
    const [qlik, sesion] = await Promise.all([
      dependencias.resolverQlik(c),
      dependencias.resolverSesion(c),
    ]);
    const flujo = (await qlik.listarFlujos()).find(
      (item) => item.id === entrada.flujoId,
    );
    if (!flujo) {
      return c.json(
        {
          exito: false,
          error: { mensaje: "Dataflow no encontrado", codigo: "NO_ENCONTRADO" },
        },
        404,
      );
    }
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    if (politica?.restringida && !politica.puedeVer(flujo.spaceId)) {
      return responderEspacioNoAutorizado(c);
    }
    if (!dependencias.consultarConexionesDestino) {
      throw new Error("Consulta de destinos no configurada");
    }
    const preflight = new PreflightAutomatizacion(
      qlik,
      {
        listar: async (organizacionId) =>
          (await dependencias.consultarConexionesOrigen(organizacionId)).map(
            (item) => ({
              id: item.id ?? "00000000-0000-4000-8000-000000000000",
              tipo: item.tipo,
              nombre: item.nombre,
              estado: item.estado ?? "sin_probar",
              probadaEn: item.probadaEn ?? null,
              mensajeError: item.mensajeError ?? null,
            }),
          ),
      },
      { listar: dependencias.consultarConexionesDestino },
    );
    return responderExito(
      c,
      await preflight.ejecutar({
        organizacionId: sesion.organizacionId,
        flujoId: flujo.id,
        flujoNombre: flujo.name,
      }),
    );
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
    const flujoId = (cuerpoObj as Record<string, unknown>).flujoId as
      | string
      | undefined;

    if (!flujoId) {
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

    const politicaCreacion = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    if (politicaCreacion?.restringida) {
      const flujo = (await qlik.listarFlujos()).find(
        (item) => item.id === flujoId,
      );
      if (!flujo || !politicaCreacion.puedeVer(flujo.spaceId)) {
        return responderEspacioNoAutorizado(c);
      }
    }

    const entradaPublicaModo1 =
      modo === 1
        ? esquemaEntradaCrearModo1.parse({
            ...cuerpoObj,
            ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
          })
        : null;

    const parametros = await prepararParametrosPlantilla(
      {
        qlik,
        consultarConexionesOrigen: dependencias.consultarConexionesOrigen,
        consultarConexionDestino: dependencias.consultarConexionDestino,
        crearCliente: dependencias.crearClienteDestino,
        probarConexionOrigen: dependencias.probarConexionOrigen,
        leerSecretoOrigen: dependencias.leerSecretoOrigen,
        obtenerConexionDestinoConSecreto:
          dependencias.obtenerConexionDestinoConSecreto,
        probarConexionDestino: dependencias.probarConexionDestino,
      },
      {
        modo,
        organizacionId: sesion.organizacionId,
        flujoId,
        tablaId:
          modo === 2
            ? ((cuerpoObj as Record<string, unknown>).tablaId as
                | string
                | undefined)
            : undefined,
        destinoId:
          entradaPublicaModo1?.destinoId ??
          ((cuerpoObj as Record<string, unknown>).destinoId as
            | string
            | undefined),
      },
    );

    const entrada = esquemaCrearDesdePlantilla.parse(
      modo === 1
        ? {
            ...entradaPublicaModo1,
            plantillaIdQlik: plantilla.id,
            reemplazosWorkspace: [],
            ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
          }
        : {
            ...cuerpoObj,
            plantillaIdQlik: plantilla.id,
            ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
          },
    );

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
    const { qlik, automatizacion, autorizada } =
      await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
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
    const { qlik, autorizada } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
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
    const {
      qlik,
      automatizacion: original,
      autorizada,
    } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    const politica = dependencias.resolverPoliticaEspacios
      ? await dependencias.resolverPoliticaEspacios(c)
      : null;
    if (
      cuerpo.espacioIdQlik &&
      politica?.restringida &&
      !politica.puedeVer(cuerpo.espacioIdQlik)
    ) {
      return responderEspacioNoAutorizado(c);
    }
    const nombreCopia = cuerpo.nombre?.trim() || `${original.name} (Copia)`;
    const copia = await qlik.copiarAutomatizacion(id, nombreCopia);
    if (cuerpo.espacioIdQlik) {
      await qlik.cambiarEspacioAutomatizacion(copia.id, cuerpo.espacioIdQlik);
    }
    return responderExito(c, { id: copia.id, nombre: nombreCopia }, 201);
  });

  rutas.get("/:id", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const { qlik, autorizada } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    return responderExito(
      c,
      await new ConsultarPanelAutomatizaciones(qlik).obtener(id),
    );
  });

  rutas.post("/:id/ejecuciones", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const [{ qlik, autorizada }, sesion] = await Promise.all([
      obtenerAutomatizacionAutorizada(c, id),
      dependencias.resolverSesion(c),
    ]);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    const resultado = await new EjecutarAutomatizacion(
      qlik,
      dependencias.bloqueos,
    ).ejecutar(sesion.tenantId, id);
    return responderExito(c, resultado, 201);
  });

  rutas.post("/:id/ejecuciones/:ejecucionId/detener", async (c) => {
    const id = esquemaIdQlik.parse(c.req.param("id"));
    const ejecucionId = esquemaIdQlik.parse(c.req.param("ejecucionId"));
    const { qlik, autorizada } = await obtenerAutomatizacionAutorizada(c, id);
    if (!autorizada) return responderEspacioNoAutorizado(c);
    await qlik.detenerEjecucion(id, ejecucionId);
    return responderExito(c, { detenida: true as const });
  });

  return rutas;
}
