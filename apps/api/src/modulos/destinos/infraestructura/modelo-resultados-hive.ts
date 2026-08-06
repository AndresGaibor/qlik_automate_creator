interface ValorStringHive {
  value?: string;
}

interface ColumnaHive {
  stringVal?: {
    values?: string[];
    nulls?: Buffer | Uint8Array | string | null;
  };
}

interface FilaHive {
  colVals?: { stringVal?: ValorStringHive }[];
}

interface RowSetHive {
  columns?: ColumnaHive[];
  rows?: FilaHive[];
}

export function extraerColumna0Hive(data: unknown[]): string[] {
  const rowSet = obtenerRowSet(data);
  if (!rowSet) return [];
  if (rowSet.columns?.length) {
    const columna = rowSet.columns[0];
    const valores = columna.stringVal?.values ?? [];
    const nulos = normalizarBitmapNulos(columna.stringVal?.nulls);
    return valores.filter((_, indice) => !esNulo(nulos, indice));
  }
  return (
    rowSet.rows
      ?.map((fila) => fila.colVals?.[0]?.stringVal?.value ?? "")
      .filter(Boolean) ?? []
  );
}

export function extraerFilasHive(data: unknown[]): string[][] {
  const rowSet = obtenerRowSet(data);
  if (!rowSet) return [];
  if (rowSet.columns?.length) {
    const cantidadFilas = rowSet.columns[0]?.stringVal?.values?.length ?? 0;
    return Array.from({ length: cantidadFilas }, (_, indice) =>
      (rowSet.columns ?? []).map(
        (columna) => columna.stringVal?.values?.[indice] ?? "",
      ),
    );
  }
  return (
    rowSet.rows?.map((fila) =>
      (fila.colVals ?? []).map((columna) => columna.stringVal?.value ?? ""),
    ) ?? []
  );
}

function obtenerRowSet(data: unknown[]): RowSetHive | null {
  return data?.length ? (data[0] as RowSetHive) : null;
}

function normalizarBitmapNulos(
  valor: Buffer | Uint8Array | string | null | undefined,
): Uint8Array {
  if (!valor) return new Uint8Array(0);
  if (valor instanceof Uint8Array) return valor;
  if (Buffer.isBuffer(valor)) return new Uint8Array(valor);
  return Uint8Array.from(valor, (caracter) => caracter.charCodeAt(0));
}

function esNulo(bitmap: Uint8Array, indice: number): boolean {
  const byte = bitmap[Math.floor(indice / 8)] ?? 0;
  return Boolean(byte & (1 << (indice % 8)));
}
