import { and, eq } from "drizzle-orm";
import type {
  PuertoIdempotencia,
  RegistroIdempotencia,
} from "../../nucleo/idempotencia/puerto-idempotencia.js";
import { db } from "./conexion.js";
import { solicitudesIdempotentes } from "./esquema.js";

export class IdempotenciaPostgres implements PuertoIdempotencia {
  async iniciar(
    registro: Omit<RegistroIdempotencia, "estado">,
    expiraEn: Date,
  ): Promise<"iniciada" | "existente"> {
    const filas = await db
      .insert(solicitudesIdempotentes)
      .values({ ...registro, estado: "procesando", expiraEn })
      .onConflictDoNothing()
      .returning({ id: solicitudesIdempotentes.id });
    return filas.length > 0 ? "iniciada" : "existente";
  }

  async obtener(organizacionId: string, alcance: string, clave: string) {
    const fila = await db.query.solicitudesIdempotentes.findFirst({
      where: and(
        eq(solicitudesIdempotentes.organizacionId, organizacionId),
        eq(solicitudesIdempotentes.alcance, alcance),
        eq(solicitudesIdempotentes.clave, clave),
      ),
    });
    return fila
      ? {
          organizacionId: fila.organizacionId,
          alcance: fila.alcance,
          clave: fila.clave,
          hashSolicitud: fila.hashSolicitud,
          estado: fila.estado as RegistroIdempotencia["estado"],
          ...(fila.estadoHttp !== null ? { estadoHttp: fila.estadoHttp } : {}),
          ...(fila.respuesta !== null ? { respuesta: fila.respuesta } : {}),
        }
      : null;
  }

  completar(
    organizacionId: string,
    alcance: string,
    clave: string,
    estadoHttp: number,
    respuesta: unknown,
  ) {
    return this.finalizar(
      organizacionId,
      alcance,
      clave,
      "completada",
      estadoHttp,
      respuesta,
    );
  }

  fallar(
    organizacionId: string,
    alcance: string,
    clave: string,
    estadoHttp: number,
    respuesta: unknown,
  ) {
    return this.finalizar(
      organizacionId,
      alcance,
      clave,
      "fallida",
      estadoHttp,
      respuesta,
    );
  }

  private async finalizar(
    organizacionId: string,
    alcance: string,
    clave: string,
    estado: "completada" | "fallida",
    estadoHttp: number,
    respuesta: unknown,
  ): Promise<void> {
    await db
      .update(solicitudesIdempotentes)
      .set({ estado, estadoHttp, respuesta, actualizadoEn: new Date() })
      .where(
        and(
          eq(solicitudesIdempotentes.organizacionId, organizacionId),
          eq(solicitudesIdempotentes.alcance, alcance),
          eq(solicitudesIdempotentes.clave, clave),
        ),
      );
  }
}
