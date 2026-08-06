export type TipoConexionOrigen = "jdbc" | "sftp";

export interface ConexionSugerida {
  tipo: TipoConexionOrigen;
  nombre: string;
}

export interface ConexionOrigen {
  id: string;
  tipo: TipoConexionOrigen;
  nombre: string;
  config: Record<string, unknown>;
  secretoConfigurado?: boolean;
}

export interface EstadoFormularioOrigen {
  tipo: TipoConexionOrigen;
  nombre: string;
  servidorJdbc: string;
  puertoJdbc: number;
  baseDatosJdbc: string;
  host: string;
  puerto: number;
  usuario: string;
  rutaBase: string;
  conexionEditandoId: string | null;
  valorSecretoJdbc: string;
  valorSecretoClavePrivada: string;
}

export const ETIQUETA_TIPO: Record<TipoConexionOrigen, string> = {
  jdbc: "Base de datos PostgreSQL",
  sftp: "Servidor SFTP",
};

export function crearEstadoFormularioInicial(): EstadoFormularioOrigen {
  return {
    tipo: "jdbc",
    nombre: "",
    servidorJdbc: "",
    puertoJdbc: 5432,
    baseDatosJdbc: "",
    host: "",
    puerto: 22,
    usuario: "",
    rutaBase: "/upload",
    conexionEditandoId: null,
    valorSecretoJdbc: "",
    valorSecretoClavePrivada: "",
  };
}

export function obtenerConexionesSugeridas(search: string): ConexionSugerida[] {
  const parametros = new URLSearchParams(search);
  const sugerencias = new Map<string, ConexionSugerida>();
  for (const valor of parametros.getAll("conexion")) {
    const separador = valor.indexOf(":");
    const tipo = valor.slice(0, separador);
    const nombre = valor.slice(separador + 1).trim();
    if ((tipo !== "jdbc" && tipo !== "sftp") || !nombre) continue;
    sugerencias.set(`${tipo}:${nombre}`, { tipo, nombre });
  }
  return Array.from(sugerencias.values());
}

export function construirEntradaConexion(estado: EstadoFormularioOrigen) {
  const nombre = estado.nombre.trim();
  if (estado.tipo === "jdbc") {
    return {
      tipo: estado.tipo,
      nombre,
      config: {
        url: `jdbc:postgresql://${estado.servidorJdbc.trim()}:${estado.puertoJdbc}/${estado.baseDatosJdbc.trim()}`,
        driver: "org.postgresql.Driver",
        secreto_nombre: crearNombreSecreto(nombre, "JDBC"),
        propiedades: { fetchsize: "10000" },
        ...(estado.valorSecretoJdbc.trim()
          ? { secretoValor: estado.valorSecretoJdbc.trim() }
          : {}),
      },
    };
  }
  return {
    tipo: estado.tipo,
    nombre,
    config: {
      host: estado.host.trim(),
      puerto: estado.puerto,
      usuario: estado.usuario.trim(),
      secreto_clave_privada_nombre: crearNombreSecreto(
        nombre,
        "SFTP_PRIVATE_KEY",
      ),
      ruta_base: estado.rutaBase.trim(),
      ...(estado.valorSecretoClavePrivada.trim()
        ? {
            secretoClavePrivadaValor: estado.valorSecretoClavePrivada.trim(),
          }
        : {}),
    },
  };
}

export function crearEstadoDesdeConexion(
  conexion: ConexionOrigen,
): EstadoFormularioOrigen {
  const base = {
    ...crearEstadoFormularioInicial(),
    tipo: conexion.tipo,
    nombre: conexion.nombre,
    conexionEditandoId: conexion.id,
  };
  if (conexion.tipo === "jdbc") {
    const url = String(conexion.config.url ?? "");
    const coincidencia = url.match(
      /^jdbc:postgresql:\/\/([^:/]+)(?::(\d+))?\/(.+)$/,
    );
    return {
      ...base,
      servidorJdbc: coincidencia?.[1] ?? "",
      puertoJdbc: Number(coincidencia?.[2]) || 5432,
      baseDatosJdbc: coincidencia?.[3] ?? "",
    };
  }
  return {
    ...base,
    host: String(conexion.config.host ?? ""),
    puerto: Number(conexion.config.puerto) || 22,
    usuario: String(conexion.config.usuario ?? ""),
    rutaBase: String(conexion.config.ruta_base ?? "/upload"),
  };
}

export function conexionYaRegistrada(
  conexiones: ConexionOrigen[],
  estado: Pick<EstadoFormularioOrigen, "nombre" | "conexionEditandoId">,
): boolean {
  return conexiones.some(
    (conexion) =>
      conexion.id !== estado.conexionEditandoId &&
      conexion.nombre === estado.nombre.trim(),
  );
}

export function filtrarSugerenciasPendientes(
  sugerencias: ConexionSugerida[],
  conexiones: ConexionOrigen[],
): ConexionSugerida[] {
  return sugerencias.filter(
    (sugerencia) =>
      !conexiones.some((conexion) => conexion.nombre === sugerencia.nombre),
  );
}

function crearNombreSecreto(nombre: string, prefijo: string): string {
  const identificador = nombre
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `${prefijo}_${identificador}`;
}
