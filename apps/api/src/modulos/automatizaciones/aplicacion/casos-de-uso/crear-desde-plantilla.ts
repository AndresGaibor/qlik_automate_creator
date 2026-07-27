import type {
  CrearDesdePlantilla,
  ResultadoCrearDesdePlantilla,
} from "@qlik/contratos/automatizaciones";
import type { PuertoAuditoria } from "../../../../nucleo/auditoria/puerto-auditoria.js";
import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";
import type { PuertoOutbox } from "../../../../nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "../../../../nucleo/idempotencia/puerto-idempotencia.js";
import { generarUuid } from "../../../../nucleo/valores/generar-uuid.js";
import type { PuertoQlik } from "../../../qlik/aplicacion/puertos/puerto-qlik.js";
import { copiarAutomatizacion } from "../servicios/servicio-copia-automatizacion.js";
import {
  completarIdempotencia,
  fallarIdempotencia,
  verificarIdempotencia,
} from "../servicios/servicio-idempotencia.js";
import { hashCanonico } from "../servicios/utilidades-automatizacion.js";

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
      const { esNuevo, resultadoPrevio } = await verificarIdempotencia(
        this.idempotencia,
        {
          organizacionId: contexto.organizacionId,
          alcance,
          clave,
          hashSolicitud,
        },
      );
      if (!esNuevo && resultadoPrevio) {
        return resultadoPrevio;
      }
    }

    let copiaId: string | undefined;
    const resultadoCopia = await copiarAutomatizacion(this.qlik, entrada);
    copiaId = resultadoCopia.id;

    if (resultadoCopia.error) {
      await this.qlik.eliminarAutomatizacion(copiaId).catch(() => undefined);
      const mensaje =
        resultadoCopia.error instanceof Error
          ? resultadoCopia.error.message
          : "Error desconocido";
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
        await fallarIdempotencia(
          this.idempotencia,
          { organizacionId: contexto.organizacionId, alcance, clave },
          estadoHttpDelError(resultadoCopia.error),
          { mensaje },
        ).catch(() => undefined);
      }
      throw resultadoCopia.error;
    }

    const resultado: ResultadoCrearDesdePlantilla = {
      id: resultadoCopia.id,
      nombre: resultadoCopia.nombre,
      plantillaIdQlik: resultadoCopia.plantillaIdQlik,
    };

    try {
      await Promise.all([
        this.outbox.guardar([
          {
            id: generarUuid(),
            tipo: "automatizaciones.automatizacion-creada-desde-plantilla.v1",
            agregadoTipo: "automatizacion-qlik",
            agregadoId: resultado.id,
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
          entidadId: resultado.id,
          resultado: "exito",
          datosNuevos: resultado,
          idSolicitud: contexto.idSolicitud,
          ip: contexto.ip,
          agenteUsuario: contexto.agenteUsuario,
        }),
      ]);

      if (clave) {
        await completarIdempotencia(
          this.idempotencia,
          { organizacionId: contexto.organizacionId, alcance, clave },
          201,
          resultado,
        );
      }
      return resultado;
    } catch (error) {
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
        await fallarIdempotencia(
          this.idempotencia,
          { organizacionId: contexto.organizacionId, alcance, clave },
          estadoHttpDelError(error),
          { mensaje },
        ).catch(() => undefined);
      }
      throw error;
    }
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
