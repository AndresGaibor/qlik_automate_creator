export interface RegistroIdempotencia {
  organizacionId: string;
  alcance: string;
  clave: string;
  hashSolicitud: string;
  estado: "procesando" | "completada" | "fallida";
  estadoHttp?: number;
  respuesta?: unknown;
}

export interface PuertoIdempotencia {
  iniciar(
    registro: Omit<RegistroIdempotencia, "estado">,
    expiraEn: Date,
  ): Promise<"iniciada" | "existente">;
  obtener(
    organizacionId: string,
    alcance: string,
    clave: string,
  ): Promise<RegistroIdempotencia | null>;
  completar(
    organizacionId: string,
    alcance: string,
    clave: string,
    estadoHttp: number,
    respuesta: unknown,
  ): Promise<void>;
  fallar(
    organizacionId: string,
    alcance: string,
    clave: string,
    estadoHttp: number,
    respuesta: unknown,
  ): Promise<void>;
}
