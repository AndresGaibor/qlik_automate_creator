export class ErrorAplicacion extends Error {
  constructor(
    public readonly codigo: string,
    mensaje: string,
    public readonly estadoHttp = 400,
    public readonly detalles?: unknown,
  ) {
    super(mensaje);
    this.name = "ErrorAplicacion";
  }
}

export class ErrorNoAutorizado extends ErrorAplicacion {
  constructor(mensaje = "Sesión requerida") {
    super("NO_AUTORIZADO", mensaje, 401);
  }
}

export class ErrorNoEncontrado extends ErrorAplicacion {
  constructor(mensaje = "Recurso no encontrado") {
    super("NO_ENCONTRADO", mensaje, 404);
  }
}

export class ErrorConflicto extends ErrorAplicacion {
  constructor(mensaje: string, detalles?: unknown) {
    super("CONFLICTO", mensaje, 409, detalles);
  }
}
