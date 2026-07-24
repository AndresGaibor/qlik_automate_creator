export interface PuertoBloqueoEjecucion {
  ejecutarExclusivo<T>(
    clave: string,
    tarea: () => Promise<T>,
  ): Promise<T | undefined>;
}
