import type {
  AllowlistItem,
  RequisitoConexionDescubierto,
  ScriptDescubierto,
} from "./tipos-catalogo-spark.js";

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

  // El nombre entre corchetes identifica la conexión que usan los SELECT siguientes.
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

    // Un SELECT puede ocupar varias líneas; se acumula hasta encontrar FROM.
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

  // STORE puede ser multilínea, por eso se analiza sobre el script completo.
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

export function descubrirRequisitosConexion(
  script: string,
): RequisitoConexionDescubierto[] {
  const descubierto = parsearScriptQlik(script);
  return [
    ...descubierto.conexionesJdbc.map(({ nombre }) => ({
      tipo: "jdbc" as const,
      nombre,
    })),
    ...descubierto.conexionesSftp.map(({ nombre }) => ({
      tipo: "sftp" as const,
      nombre,
    })),
  ];
}
