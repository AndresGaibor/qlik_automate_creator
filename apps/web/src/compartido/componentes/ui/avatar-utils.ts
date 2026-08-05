/** Iniciales a partir de un nombre: primera + última palabra, sin duplicados. */
export function inicialesDe(nombre: string): string {
  const partes = nombre.split(/\s+/).filter(Boolean);
  return [partes[0], partes.at(-1)]
    .filter((p, i, lista) => p && (i === 0 || p !== lista[0]))
    .map((p) => p?.[0]?.toUpperCase())
    .join("");
}
