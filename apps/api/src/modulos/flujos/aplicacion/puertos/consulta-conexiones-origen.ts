export interface ConfiguracionConexionOrigen {
  tipo: string;
  nombre: string;
  config: Record<string, unknown>;
}

export interface ConsultaConexionesOrigen {
  listarPorOrganizacion(
    organizacionId: string,
  ): Promise<ConfiguracionConexionOrigen[]>;
}
