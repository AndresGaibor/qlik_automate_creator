import type {
  CrearDesdePlantilla,
  ResultadoCrearDesdePlantilla,
} from "@qlik/contratos/automatizaciones";
import type { PuertoAuditoria } from "../../../../nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "../../../../nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "../../../../nucleo/idempotencia/puerto-idempotencia.js";
import {
  ErrorAplicacion,
  ErrorConflicto,
} from "../../../../nucleo/errores/error-aplicacion.js";
import type { PuertoQlik } from "../../../qlik/publico.js";

export interface ContextoCreacionAutomatizacion {
  tenantId: string;
  organizacionId: string;
  usuarioId: string;
  idSolicitud?: string;
  ip?: string;
  agenteUsuario?: string;
}

export class CrearAutomatizacionDesdePlantilla {
  constructor(
    private readonly qlik: PuertoQlik,
    private readonly idempotencia: PuertoIdempotencia,
    private readonly outbox: PuertoOutbox,
    private readonly auditoria: PuertoAuditoria,
  ) {}

  async ejecutar(
    entrada: CrearDesdePlantilla,
    contexto: ContextoCreacionAutomatizacion,
  ): Promise<ResultadoCrearDesdePlantilla> {
    const alcance = "automatizaciones.crear-desde-plantilla";
    const hashSolicitud = await hashCanonico(entrada);
    const clave = entrada.claveIdempotencia;

    if (clave) {
      const existente = await this.idempotencia.obtener(
        contexto.organizacionId,
        alcance,
        clave,
      );
      if (existente) {
        if (existente.hashSolicitud !== hashSolicitud) {
          throw new ErrorConflicto(
            "La clave de idempotencia ya fue usada con otra solicitud",
          );
        }
        if (existente.estado === "completada") {
          return existente.respuesta as ResultadoCrearDesdePlantilla;
        }
        throw new ErrorConflicto(
          "La solicitud con esta clave todavía está en curso o falló",
        );
      }
      const inicio = await this.idempotencia.iniciar(
        {
          organizacionId: contexto.organizacionId,
          alcance,
          clave,
          hashSolicitud,
        },
        new Date(Date.now() + 24 * 60 * 60 * 1000),
      );
      if (inicio === "existente") {
        const concurrente = await this.idempotencia.obtener(
          contexto.organizacionId,
          alcance,
          clave,
        );
        if (concurrente?.hashSolicitud !== hashSolicitud) {
          throw new ErrorConflicto(
            "La clave de idempotencia ya fue usada con otra solicitud",
          );
        }
        if (concurrente?.estado === "completada") {
          return concurrente.respuesta as ResultadoCrearDesdePlantilla;
        }
        throw new ErrorConflicto(
          "La solicitud con esta clave ya está siendo procesada",
        );
      }
    }

    let copiaId: string | undefined;
    try {
      const copia = await this.qlik.copiarAutomatizacion(
        entrada.plantillaIdQlik,
        entrada.nombre,
      );
      copiaId = copia.id;

      if (entrada.espacioIdQlik) {
        await this.qlik.cambiarEspacioAutomatizacion(
          copia.id,
          entrada.espacioIdQlik,
        );
      }
      if (entrada.reemplazosWorkspace.length > 0) {
        await this.aplicarReemplazos(copia.id, entrada.reemplazosWorkspace);
      }
      // Cambiar el propietario al final: Qlik puede retirar al usuario actual
      // el acceso necesario para leer/actualizar el workspace de la copia.
      if (entrada.propietarioIdQlik) {
        await this.qlik.cambiarPropietarioAutomatizacion(
          copia.id,
          entrada.propietarioIdQlik,
        );
      }

      const resultado: ResultadoCrearDesdePlantilla = {
        id: copia.id,
        nombre: entrada.nombre,
        plantillaIdQlik: entrada.plantillaIdQlik,
      };

      await Promise.all([
        this.outbox.guardar([
          {
            id: crypto.randomUUID(),
            tipo: "automatizaciones.automatizacion-creada-desde-plantilla.v1",
            agregadoTipo: "automatizacion-qlik",
            agregadoId: copia.id,
            version: 1,
            ocurridoEn: new Date(),
            datos: resultado,
            metadatos: {
              tenantId: contexto.tenantId,
              organizacionId: contexto.organizacionId,
              usuarioId: contexto.usuarioId,
            },
          },
        ]),
        this.auditoria.registrar({
          organizacionId: contexto.organizacionId,
          usuarioId: contexto.usuarioId,
          accion: "automatizacion.crear-desde-plantilla",
          entidadTipo: "automatizacion-qlik",
          entidadId: copia.id,
          resultado: "exito",
          datosNuevos: resultado,
          idSolicitud: contexto.idSolicitud,
          ip: contexto.ip,
          agenteUsuario: contexto.agenteUsuario,
        }),
      ]);

      if (clave) {
        await this.idempotencia.completar(
          contexto.organizacionId,
          alcance,
          clave,
          201,
          resultado,
        );
      }
      return resultado;
    } catch (error) {
      if (copiaId) {
        await this.qlik.eliminarAutomatizacion(copiaId).catch(() => undefined);
      }
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      await this.auditoria
        .registrar({
          organizacionId: contexto.organizacionId,
          usuarioId: contexto.usuarioId,
          accion: "automatizacion.crear-desde-plantilla",
          entidadTipo: "automatizacion-qlik",
          entidadId: copiaId,
          resultado: "error",
          mensajeError: mensaje,
          idSolicitud: contexto.idSolicitud,
          ip: contexto.ip,
          agenteUsuario: contexto.agenteUsuario,
        })
        .catch(() => undefined);
      if (clave) {
        await this.idempotencia
          .fallar(
            contexto.organizacionId,
            alcance,
            clave,
            estadoHttpDelError(error),
            { mensaje },
          )
          .catch(() => undefined);
      }
      throw error;
    }
  }

  private async aplicarReemplazos(
    automatizacionId: string,
    reemplazos: CrearDesdePlantilla["reemplazosWorkspace"],
  ): Promise<void> {
    const automatizacion =
      await this.qlik.obtenerAutomatizacion(automatizacionId);
    const workspace = structuredClone(automatizacion.workspace ?? {});
    for (const reemplazo of reemplazos) {
      reemplazarValorExistente(workspace, reemplazo.ruta, reemplazo.valor);
    }
    await this.qlik.actualizarAutomatizacion(automatizacionId, {
      name: automatizacion.name,
      schedules: automatizacion.schedules ?? [],
      workspace,
      description: automatizacion.description ?? "",
      maxConcurrentRuns: automatizacion.maxConcurrentRuns ?? 1,
    });
  }
}

function estadoHttpDelError(error: unknown): number {
  if (error instanceof ErrorAplicacion) return error.estadoHttp;
  if (
    error instanceof Error &&
    "estadoHttp" in error &&
    typeof (error as { estadoHttp?: unknown }).estadoHttp === "number"
  ) {
    return (error as { estadoHttp: number }).estadoHttp;
  }
  return 500;
}

function reemplazarValorExistente(
  raiz: Record<string, unknown>,
  ruta: string,
  valor: unknown,
): void {
  const segmentos = ruta
    .slice(1)
    .split("/")
    .map((segmento) => segmento.replace(/~1/g, "/").replace(/~0/g, "~"));
  let actual: unknown = raiz;
  for (const segmento of segmentos.slice(0, -1)) {
    if (!actual || typeof actual !== "object" || !(segmento in actual)) {
      throw new Error(
        `La ruta ${ruta} no existe en el workspace de la plantilla`,
      );
    }
    actual = (actual as Record<string, unknown>)[segmento];
  }
  const ultimo = segmentos.at(-1);
  if (!ultimo || !actual || typeof actual !== "object" || !(ultimo in actual)) {
    throw new Error(
      `La ruta ${ruta} no existe en el workspace de la plantilla`,
    );
  }
  (actual as Record<string, unknown>)[ultimo] = valor;
}

async function hashCanonico(valor: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(ordenar(valor)));
  const resumen = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(resumen), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function ordenar(valor: unknown): unknown {
  if (Array.isArray(valor)) return valor.map(ordenar);
  if (valor && typeof valor === "object") {
    return Object.fromEntries(
      Object.entries(valor as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([clave, contenido]) => [clave, ordenar(contenido)]),
    );
  }
  return valor;
}
