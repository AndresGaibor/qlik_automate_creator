import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/publico";
import type {
  DetalleRecursoDestino,
  DetalleTablaImpala,
  RecursoDestino,
  TablaImpala,
  TipoDestino,
} from "./api";

export const ETIQUETA_TIPO_DESTINO: Record<TipoDestino, string> = {
  impala: "Impala",
  postgres: "PostgreSQL",
  bigquery: "BigQuery",
  sftp: "SFTP",
};

export function adaptarTablaImpala(tabla: TablaImpala): RecursoDestino {
  return {
    id: tabla.nombre,
    nombre: tabla.nombre,
    tipo: "tabla",
    espacioDeNombres: "default",
    metadatos: {},
  };
}

export function adaptarDetalleTablaImpala(
  detalle: DetalleTablaImpala,
): DetalleRecursoDestino {
  return {
    id: detalle.tabla,
    nombre: detalle.tabla,
    tipo: "tabla",
    espacioDeNombres: detalle.baseDatos,
    metadatos: {},
    columnas: detalle.columnas,
    totalFilas: detalle.totalFilas,
    actualizadoEn: detalle.actualizadoEn,
  };
}

export function nombreCompletoRecurso(detalle: DetalleRecursoDestino): string {
  return detalle.espacioDeNombres
    ? `${detalle.espacioDeNombres}.${detalle.nombre}`
    : detalle.nombre;
}

export function buscarAutomatizacionVinculada(
  recurso: RecursoDestino,
  automatizaciones: ResumenAutomatizacion[],
): ResumenAutomatizacion | undefined {
  const nombre = recurso.nombre.toLocaleLowerCase("es");
  return automatizaciones.find((automatizacion) =>
    automatizacion.nombre.toLocaleLowerCase("es").includes(nombre),
  );
}

export function explicarTipoDato(tipo: string): string {
  const normalizado = tipo.toUpperCase();
  if (normalizado.includes("STRING") || normalizado.includes("VARCHAR")) {
    return "Texto";
  }
  if (normalizado.includes("TIMESTAMP") || normalizado.includes("DATE")) {
    return "Fecha y hora";
  }
  if (
    normalizado.includes("DECIMAL") ||
    normalizado.includes("FLOAT") ||
    normalizado.includes("DOUBLE")
  ) {
    return "Número con decimales";
  }
  if (normalizado.includes("INT")) return "Número entero";
  if (normalizado.includes("BOOL")) return "Sí o no";
  return "Tipo del origen";
}
