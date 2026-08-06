import type { EsquemaTablaDestino } from "../dominio/modelos.js";

export function construirEsquemaTablaImpala(
  baseDatos: string,
  tabla: string,
  filas: string[][],
): EsquemaTablaDestino {
  const columnas = filas
    .map((partes) => ({
      nombre: partes[0]?.trim() ?? "",
      tipo: partes[1]?.trim() ?? "",
    }))
    .filter(
      (columna) =>
        columna.nombre && columna.tipo && !columna.nombre.startsWith("#"),
    );
  return {
    baseDatos,
    tabla,
    columnas,
    especificacionEsquema: columnas
      .map((columna) => `${columna.nombre}:${columna.tipo}`)
      .join("|"),
  };
}
