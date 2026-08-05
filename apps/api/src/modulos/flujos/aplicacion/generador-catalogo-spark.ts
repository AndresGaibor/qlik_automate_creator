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

export function parsearScriptQlik(script: string): ScriptDescubierto {
  const conexionesJdbcMap = new Map<string, Map<string, AllowlistItem>>();
  const conexionesSftpMap = new Map<
    string,
    { rutaBase: string; allowlist: Map<string, AllowlistItem> }
  >();
  const conexionesLocalesMap = new Map<
    string,
    { rutaBase: string; allowlist: Map<string, AllowlistItem> }
  >();

  // 1. Extraer LIB CONNECT TO [NombreConexion]
  let conexionJdbcActual = "";
  let bloqueSelect = "";

  // Normalizar saltos de línea para procesar bloques o líneas
  const lineas = script.split(/\r?\n/);

  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    const matchConnect = linea.match(/LIB\s+CONNECT\s+TO\s+\[([^\]]+)\]/i);
    if (matchConnect) {
      conexionJdbcActual = matchConnect[1].trim();
      if (!conexionesJdbcMap.has(conexionJdbcActual)) {
        conexionesJdbcMap.set(conexionJdbcActual, new Map());
      }
    }

    // 2. Extraer SELECT <campos> FROM "esquema"."tabla", incluso en varias líneas.
    if (conexionJdbcActual) {
      if (/^\s*(?:SQL\s+)?SELECT\b/i.test(linea)) {
        bloqueSelect = linea;
      } else if (bloqueSelect) {
        bloqueSelect += `\n${linea}`;
      }

      const matchSelectFrom = bloqueSelect.match(
        /SELECT\s+([\s\S]+?)\s+FROM\s+["`\[]?([^"`\].\s]+)["`\]]?\.["`\[]?([^"`\]\s;]+)["`\]]?/i,
      );
      if (matchSelectFrom) {
        const rawCampos = matchSelectFrom[1].replace(/\s+/g, " ").trim();
        const esquema = matchSelectFrom[2].trim();
        const tabla = matchSelectFrom[3].trim();
        const key = `${esquema}.${tabla}`;

        let campos: string[] = [];
        if (rawCampos !== "*") {
          campos = rawCampos
            .split(",")
            .map((c) =>
              c
                .trim()
                .replace(/^["`\[]/, "")
                .replace(/["`\]]$/, ""),
            )
            .filter((c) => c.length > 0 && !c.toUpperCase().startsWith("AS "));
        }

        const tablasMap = conexionesJdbcMap.get(conexionJdbcActual);
        if (!tablasMap) continue;
        if (!tablasMap.has(key)) {
          tablasMap.set(key, { esquema, tabla, campos });
        } else {
          // Si ya existe y trae campos explícitos, combinarlos
          const existente = tablasMap.get(key);
          if (existente && campos.length > 0) {
            const setCampos = new Set([...existente.campos, ...campos]);
            existente.campos = Array.from(setCampos);
          }
        }
        bloqueSelect = "";
      } else {
        // Soporte para FROM simple fuera de una sentencia SELECT.
        const matchFromOnly = linea.match(
          /FROM\s+["`\[]?([^"`\].\s]+)["`\]]?\.["`\[]?([^"`\]\s;]+)["`\]]?/i,
        );
        if (!bloqueSelect && matchFromOnly) {
          const esquema = matchFromOnly[1].trim();
          const tabla = matchFromOnly[2].trim();
          const key = `${esquema}.${tabla}`;
          const tablasMap = conexionesJdbcMap.get(conexionJdbcActual);
          if (!tablasMap) continue;
          if (!tablasMap.has(key)) {
            tablasMap.set(key, { esquema, tabla, campos: [] });
          }
        }
      }
    }
  }

  // 3. Extraer STORE ... INTO [lib://Conexion...] globalmente (soporta multilínea)
  const regexStoreGlobal =
    /STORE\s+[\s\S]*?\s+INTO\s+\[lib:\/\/([^/\]]+)(?:\/+([^\]]+))?\]/gi;
  let matchStore = regexStoreGlobal.exec(script);
  while (matchStore !== null) {
    const nombreConexion = matchStore[1].trim();
    const restPath = (matchStore[2] || "").trim();
    const partes = restPath.split("/").filter(Boolean);
    const archivo = partes.pop() || "";
    const rutaIntermedia =
      partes.length > 0 ? `/${partes.join("/")}` : "/upload";

    const esSftp =
      nombreConexion.toLowerCase().includes("sftp") ||
      nombreConexion.toLowerCase().includes("ssh");
    const targetMap = esSftp ? conexionesSftpMap : conexionesLocalesMap;

    let item = targetMap.get(nombreConexion);
    if (!item) {
      item = {
        rutaBase: rutaIntermedia,
        allowlist: new Map(),
      };
      targetMap.set(nombreConexion, item);
    }

    if (archivo && !item.allowlist.has(archivo)) {
      item.allowlist.set(archivo, {
        esquema: "",
        tabla: archivo,
        campos: [],
      });
    }
    matchStore = regexStoreGlobal.exec(script);
  }

  return {
    conexionesJdbc: Array.from(conexionesJdbcMap.entries()).map(
      ([nombre, tablasMap]) => ({
        nombre,
        allowlist: Array.from(tablasMap.values()),
      }),
    ),
    conexionesSftp: Array.from(conexionesSftpMap.entries()).map(
      ([nombre, info]) => ({
        nombre,
        rutaBase: info.rutaBase,
        allowlist: Array.from(info.allowlist.values()),
      }),
    ),
    conexionesLocales: Array.from(conexionesLocalesMap.entries()).map(
      ([nombre, info]) => ({
        nombre,
        rutaBase: info.rutaBase,
        allowlist: Array.from(info.allowlist.values()),
      }),
    ),
  };
}

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
    configuracionesCatalogos.map((c) => [c.nombre, c]),
  );

  const jdbc: CatalogoConexionJdbc[] = descubierto.conexionesJdbc.map((c) => {
    const configGuardada = catalogosMap.get(c.nombre)?.config || {};
    return {
      tipo: "jdbc",
      nombre: c.nombre,
      url: textoConfig(configGuardada, "url", ""),
      driver: textoConfig(configGuardada, "driver", "org.postgresql.Driver"),
      secreto_nombre: textoConfig(
        configGuardada,
        "secreto_nombre",
        "POSTGRES_BANCOLOMBIA",
      ),
      allowlist: c.allowlist,
      propiedades: propiedadesConfig(configGuardada),
    };
  });

  const sftp: CatalogoConexionSftp[] = descubierto.conexionesSftp.map((c) => {
    const configGuardada = catalogosMap.get(c.nombre)?.config || {};
    return {
      tipo: "sftp",
      nombre: c.nombre,
      host: textoConfig(configGuardada, "host", "__SFTP_HOST__"),
      puerto: Number(configGuardada.puerto) || 22,
      usuario: textoConfig(configGuardada, "usuario", "sftpqlik"),
      secreto_clave_privada_nombre: textoConfig(
        configGuardada,
        "secreto_clave_privada_nombre",
        "SFTP_PRIVATE_KEY_B64",
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
      const configGuardada = catalogosMap.get(c.nombre)?.config || {};
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
