import type {
  CatalogoConexionJdbc,
  CatalogoConexionLocal,
  CatalogoConexionSftp,
  EstructuraConexionesSpark,
  ScriptDescubierto,
} from "./tipos-catalogo-spark.js";

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function textoConfig(
  config: Record<string, unknown>,
  clave: string,
  valorPredeterminado: string,
): string {
  const valor = config[clave];
  return typeof valor === "string" && valor.length > 0
    ? valor
    : valorPredeterminado;
}

function propiedadesConfig(
  config: Record<string, unknown>,
): Record<string, string> {
  const propiedades = config.propiedades;
  if (!esRegistro(propiedades)) return { fetchsize: "10000" };

  return Object.fromEntries(
    Object.entries(propiedades).filter(
      (entrada): entrada is [string, string] => typeof entrada[1] === "string",
    ),
  );
}

const claveConexion = (tipo: string, nombre: string) =>
  `${tipo}\u0000${nombre}`;

export function construirCatalogoConexionesSpark(
  descubierto: ScriptDescubierto,
  configuracionesCatalogos: Array<{
    tipo: string;
    nombre: string;
    config: Record<string, unknown>;
  }>,
  descripcion = "Dataflow Bancolombia ejecutado por Spark",
): EstructuraConexionesSpark {
  const catalogosMap = new Map(
    configuracionesCatalogos.map((c) => [claveConexion(c.tipo, c.nombre), c]),
  );

  const jdbc: CatalogoConexionJdbc[] = descubierto.conexionesJdbc.map((c) => {
    const configGuardada =
      catalogosMap.get(claveConexion("jdbc", c.nombre))?.config || {};
    return {
      tipo: "jdbc",
      nombre: c.nombre,
      url: textoConfig(configGuardada, "url", ""),
      driver: textoConfig(configGuardada, "driver", ""),
      secreto_nombre: textoConfig(configGuardada, "secreto_nombre", ""),
      allowlist: c.allowlist,
      propiedades: propiedadesConfig(configGuardada),
    };
  });

  const sftp: CatalogoConexionSftp[] = descubierto.conexionesSftp.map((c) => {
    const configGuardada =
      catalogosMap.get(claveConexion("sftp", c.nombre))?.config || {};
    return {
      tipo: "sftp",
      nombre: c.nombre,
      host: textoConfig(configGuardada, "host", ""),
      puerto: Number(configGuardada.puerto) || 22,
      usuario: textoConfig(configGuardada, "usuario", ""),
      secreto_clave_privada_nombre: textoConfig(
        configGuardada,
        "secreto_clave_privada_nombre",
        "",
      ),
      ruta_base: textoConfig(
        configGuardada,
        "ruta_base",
        c.rutaBase || "/upload",
      ),
      allowlist: c.allowlist,
    };
  });

  const locales: CatalogoConexionLocal[] = descubierto.conexionesLocales.map(
    (c) => {
      const configGuardada =
        catalogosMap.get(claveConexion("local", c.nombre))?.config || {};
      return {
        tipo: "local",
        nombre: c.nombre,
        ruta_base: textoConfig(configGuardada, "ruta_base", c.rutaBase || "/"),
        allowlist: c.allowlist,
      };
    },
  );

  return {
    version: 1,
    descripcion,
    jdbc,
    locales,
    sftp,
  };
}
