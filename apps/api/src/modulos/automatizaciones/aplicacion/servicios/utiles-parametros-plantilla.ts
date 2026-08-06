import { ErrorAplicacion } from "../../../../nucleo/errores/error-aplicacion.js";

export function validarTablaDestino(tablaId: string | undefined): string {
  const valor = tablaId?.trim() ?? "";
  if (!valor) {
    throw new ErrorAplicacion(
      "TABLA_DESTINO_REQUERIDA",
      "Tabla destino es requerida",
      422,
    );
  }
  return valor;
}

export function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export function numero(valor: unknown, predeterminado: number): number {
  return typeof valor === "number" && Number.isFinite(valor)
    ? valor
    : predeterminado;
}
