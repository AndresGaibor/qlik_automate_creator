export interface AllowlistItem {
  esquema: string;
  tabla: string;
  campos: string[];
}

export interface CatalogoConexionJdbc {
  tipo: "jdbc";
  nombre: string;
  url: string;
  driver: string;
  secreto_nombre: string;
  allowlist: AllowlistItem[];
  propiedades?: Record<string, string>;
}

export interface CatalogoConexionSftp {
  tipo: "sftp";
  nombre: string;
  host: string;
  puerto: number;
  usuario: string;
  secreto_clave_privada_nombre: string;
  ruta_base: string;
  allowlist: AllowlistItem[];
}

export interface CatalogoConexionLocal {
  tipo: "local";
  nombre: string;
  ruta_base: string;
  allowlist: AllowlistItem[];
}

export interface EstructuraConexionesSpark {
  version: number;
  descripcion: string;
  jdbc: CatalogoConexionJdbc[];
  locales: CatalogoConexionLocal[];
  sftp: CatalogoConexionSftp[];
}

export interface RequisitoConexionDescubierto {
  tipo: "jdbc" | "sftp";
  nombre: string;
}

export interface ScriptDescubierto {
  conexionesJdbc: Array<{
    nombre: string;
    allowlist: AllowlistItem[];
  }>;
  conexionesSftp: Array<{
    nombre: string;
    rutaBase: string;
    allowlist: AllowlistItem[];
  }>;
  conexionesLocales: Array<{
    nombre: string;
    rutaBase: string;
    allowlist: AllowlistItem[];
  }>;
}
