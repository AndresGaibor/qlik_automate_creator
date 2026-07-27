import { esquemaCrearDesdePlantilla } from "@qlik/contratos/automatizaciones";
import { esquemaIdQlik } from "@qlik/contratos/qlik";
import { type Context, Hono } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "../../../nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "../../../nucleo/idempotencia/puerto-idempotencia.js";
import { obtenerContextoSolicitud } from "../../../plataforma/contexto/contexto-solicitud.js";
import { leerJson } from "../../../nucleo/http/leer-json.js";
import { responderExito } from "../../../nucleo/http/respuestas.js";
import type { ServicioQlik } from "../../qlik/publico.js";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";
import { ConsultarPanelAutomatizaciones } from "../aplicacion/casos-de-uso/consultar-panel.js";
import { CrearAutomatizacionDesdePlantilla } from "../aplicacion/casos-de-uso/crear-desde-plantilla.js";
import { EjecutarAutomatizacion } from "../aplicacion/casos-de-uso/ejecutar-automatizacion.js";
import type { PuertoBloqueoEjecucion } from "../aplicacion/puertos/puerto-bloqueo-ejecucion.js";

interface ContextoSesion {
  tenantId: string;
  usuarioId: string;
  organizacionId: string;
}

export interface DependenciasRutasPanel {
  resolverQlik(c: Context): Promise<ServicioQlik>;
  resolverSesion(c: Context): Promise<ContextoSesion>;
  consultaTenant: PuertoConsultaTenantQlik;
  bloqueos: PuertoBloqueoEjecucion;
  idempotencia: PuertoIdempotencia;
  outbox: PuertoOutbox;
  auditoria: PuertoAuditoria;
}

export function crearRutasPanelAutomatizaciones(
  dependencias: DependenciasRutasPanel,
) {
  const rutas = new Hono();

  rutas.get("/", async (c) => {
    const qlik = await dependencias.resolverQlik(c);
    const espacioId = c.req.query("espacioId")?.trim() || undefined;
    const q =
      c.req.query("q")?.trim() ||
      c.req.query("busqueda")?.trim() ||
      undefined;

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

  /** Devuelve la configuración de automatización base del tenant activo */
  rutas.get("/configuracion-tenant", async (c) => {
    const sesion = await dependencias.resolverSesion(c);
    const tenant = await dependencias.consultaTenant.obtenerTenant(sesion.tenantId);
    return responderExito(c, {
      automatizacionBaseIdQlik: tenant?.automatizacionBaseIdQlik ?? null,
      automatizacionBaseNombre: tenant?.automatizacionBaseNombre ?? null,
    });
  });

  // Debe declararse antes de /:id para evitar que "desde-plantilla" sea un id.
  rutas.post("/desde-plantilla", async (c) => {
    const cuerpo = await leerJson(c);
    const claveEncabezado = c.req.header("idempotency-key")?.trim();

    const [qlik, sesion] = await Promise.all([
      dependencias.resolverQlik(c),
      dependencias.resolverSesion(c),
    ]);

    // ── Resolver plantilla base desde el tenant ──────────────────────────────
    const tenant = await dependencias.consultaTenant.obtenerTenant(sesion.tenantId);

    if (!tenant?.automatizacionBaseIdQlik) {
      return c.json(
        {
          exito: false,
          error: {
            mensaje:
              "El tenant no tiene configurada una automatización base. Configúrala en Administración → Tenants.",
            codigo: "SIN_AUTOMATIZACION_BASE",
          },
        },
        422,
      );
    }

    const cuerpoObj =
      typeof cuerpo === "object" && cuerpo !== null ? cuerpo : {};

    const entrada = esquemaCrearDesdePlantilla.parse({
      ...cuerpoObj,
      // El backend inyecta la plantilla real; lo que mande el cliente se ignora
      plantillaIdQlik: tenant.automatizacionBaseIdQlik,
      ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
    });

    const contextoSolicitud = obtenerContextoSolicitud(c);
    const resultado = await new CrearAutomatizacionDesdePlantilla(
      qlik,
      dependencias.idempotencia,
      dependencias.outbox,
      dependencias.auditoria,
    ).ejecutar(entrada, {
      ...sesion,
      idSolicitud: contextoSolicitud.idSolicitud,
      ip: contextoSolicitud.ip,
      agenteUsuario: contextoSolicitud.agenteUsuario,
    });
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
    const cuerpo = (await c.req.json()) as { workspace: Record<string, unknown> };
    if (!cuerpo || typeof cuerpo.workspace !== "object" || cuerpo.workspace === null) {
      return c.json({ exito: false, error: { mensaje: "El workspace debe ser un objeto JSON válido" } }, 400);
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
