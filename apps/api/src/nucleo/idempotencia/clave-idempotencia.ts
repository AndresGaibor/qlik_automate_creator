import { ErrorDominio } from "../errores/error-dominio.js";

export class ClaveIdempotencia {
  private constructor(public readonly valor: string) {}

  static crear(valor: string): ClaveIdempotencia {
    const normalizado = valor.trim();
    if (normalizado.length < 8 || normalizado.length > 255) {
      throw new ErrorDominio(
        "CLAVE_IDEMPOTENCIA_INVALIDA",
        "La clave de idempotencia debe tener entre 8 y 255 caracteres",
      );
    }
    return new ClaveIdempotencia(normalizado);
  }
}
