export interface ProbadorConexionOrigen {
  probarPostgres(entrada: {
    url: string;
    usuario: string;
    clave: string;
  }): Promise<void>;
  probarSftp(entrada: {
    host: string;
    puerto: number;
    usuario: string;
    llavePrivada: string;
  }): Promise<void>;
}
