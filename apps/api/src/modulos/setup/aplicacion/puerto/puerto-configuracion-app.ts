export interface ConfiguracionSetup {
  completado: boolean;
  organizacionNombre?: string;
  qlikOAuth?: {
    clientId: string;
    scopes: string[];
  };
}

export interface PuertoConfiguracionApp {
  obtener(clave: string): Promise<unknown | null>;
  guardar(clave: string, valor: unknown): Promise<void>;
  obtenerConfiguracionSetup(): Promise<ConfiguracionSetup>;
  marcarSetupCompleto(): Promise<void>;
  estaConfigurado(): Promise<boolean>;
  ejecutarSiPendiente<T>(tarea: () => Promise<T>): Promise<T | undefined>;
}
