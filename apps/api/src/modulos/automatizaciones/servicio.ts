import { eq } from "drizzle-orm";
import { db } from "../../../infraestructura/base-datos/conexion.js";
import {
  auditoriaEventos,
  configuracionesAutomatizacion,
  programacionesAutomatizacion,
} from "../../../infraestructura/base-datos/esquema.js";
import type { ClienteDestinos } from "../../../infraestructura/destinos-api/cliente.js";
import type { ClienteQlik } from "../../../infraestructura/qlik/cliente.js";

export interface CrearAutomatizacionInput {
  nombre: string;
  flujoIdQlik: string;
  flujoNombre: string;
  flujoEspacioId?: string;
  destinoProveedor: string;
  destinoIdExterno: string;
  destinoNombre: string;
  programacion?: {
    tipo: "manual" | "intervalo" | "cron" | "qlik";
    expresionCron?: string;
    zonaHoraria?: string;
  };
  claveIdempotencia?: string;
}

export class ServicioAutomatizaciones {
  constructor(
    private clienteQlik: ClienteQlik,
    private clienteDestinos: ClienteDestinos,
  ) {}

  async crear(
    input: CrearAutomatizacionInput,
    usuarioId: string,
    tenantQlikId: string,
    organizacionId: string,
  ) {
    const [configCreando] = await db
      .insert(configuracionesAutomatizacion)
      .values({
        organizacionId,
        tenantQlikId,
        creadoPorUsuarioId: usuarioId,
        nombre: input.nombre,
        flujoIdQlik: input.flujoIdQlik,
        flujoNombreSnapshot: input.flujoNombre,
        flujoEspacioIdQlik: input.flujoEspacioId,
        destinoProveedor: input.destinoProveedor,
        destinoIdExterno: input.destinoIdExterno,
        destinoNombreSnapshot: input.destinoNombre,
        estado: "creando",
        claveIdempotencia: input.claveIdempotencia,
      })
      .returning();

    try {
      const flujos = await this.clienteQlik.listarFlujos(input.flujoEspacioId);
      const flujoValido = flujos.find((f) => f.id === input.flujoIdQlik);
      if (!flujoValido) {
        throw new Error(`Flujo ${input.flujoIdQlik} no encontrado en Qlik`);
      }

      const automatizacion = await this.clienteQlik.crearAutomatizacion(
        input.nombre,
        input.flujoEspacioId ?? "",
        input.flujoIdQlik,
      );

      await db
        .update(configuracionesAutomatizacion)
        .set({
          automatizacionIdQlik: automatizacion.id,
          automatizacionNombreSnapshot: input.nombre,
          estado: "activa",
          actualizadoEn: new Date(),
        })
        .where(eq(configuracionesAutomatizacion.id, configCreando.id));

      if (input.programacion) {
        await db.insert(programacionesAutomatizacion).values({
          configuracionId: configCreando.id,
          tipo: input.programacion.tipo,
          expresionCron: input.programacion.expresionCron,
          zonaHoraria: input.programacion.zonaHoraria ?? "America/Guayaquil",
        });
      }

      await db.insert(auditoriaEventos).values({
        organizacionId,
        usuarioId,
        accion: "automatizacion.crear",
        entidadTipo: "configuracionAutomatizacion",
        entidadId: configCreando.id,
        resultado: "exito",
        datosNuevos: { automatizacionIdQlik: automatizacion.id },
      });

      return this.obtener(configCreando.id);
    } catch (error) {
      await db
        .update(configuracionesAutomatizacion)
        .set({
          estado: "error",
          mensajeError:
            error instanceof Error ? error.message : "Error desconocido",
          actualizadoEn: new Date(),
        })
        .where(eq(configuracionesAutomatizacion.id, configCreando.id));

      await db.insert(auditoriaEventos).values({
        organizacionId,
        usuarioId,
        accion: "automatizacion.crear",
        entidadTipo: "configuracionAutomatizacion",
        entidadId: configCreando.id,
        resultado: "error",
        mensajeError:
          error instanceof Error ? error.message : "Error desconocido",
      });

      throw error;
    }
  }

  async listar(tenantQlikId: string) {
    return db.query.configuracionesAutomatizacion.findMany({
      where: eq(configuracionesAutomatizacion.tenantQlikId, tenantQlikId),
    });
  }

  async obtener(id: string) {
    const [config] = await db
      .select()
      .from(configuracionesAutomatizacion)
      .where(eq(configuracionesAutomatizacion.id, id));
    return config;
  }

  async ejecutar(id: string, usuarioId: string, organizacionId: string) {
    const config = await this.obtener(id);
    if (!config) {
      throw new Error("Configuración no encontrada");
    }

    if (!config.automatizacionIdQlik) {
      throw new Error("La automatización no tiene ID de Qlik");
    }

    const resultado = await this.clienteQlik.ejecutarAutomatizacion(
      config.automatizacionIdQlik,
    );

    await db.insert(auditoriaEventos).values({
      organizacionId,
      usuarioId,
      accion: "automatizacion.ejecutar",
      entidadTipo: "configuracionAutomatizacion",
      entidadId: id,
      resultado: "exito",
      datosNuevos: { runId: resultado.runId },
    });

    return {
      runId: resultado.runId,
      automatizacionIdQlik: config.automatizacionIdQlik,
    };
  }
}
