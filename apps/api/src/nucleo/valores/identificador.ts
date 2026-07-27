import { ErrorDominio } from "../errores/error-dominio.js";
import { generarUuid } from "./generar-uuid.js";

export class Identificador {
  private constructor(public readonly valor: string) {}

  static crear(valor: string): Identificador {
    const normalizado = valor.trim();
    if (!normalizado) {
      throw new ErrorDominio(
        "IDENTIFICADOR_VACIO",
        "El identificador es obligatorio",
      );
    }
    return new Identificador(normalizado);
  }

  static nuevo(): Identificador {
    return new Identificador(generarUuid());
  }

  toString(): string {
    return this.valor;
  }
}
