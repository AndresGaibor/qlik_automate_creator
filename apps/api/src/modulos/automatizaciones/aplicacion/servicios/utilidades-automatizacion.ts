import crypto from "node:crypto";

export async function hashCanonico(valor: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(ordenar(valor)));
  const resumen = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(resumen), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function ordenar(valor: unknown): unknown {
  if (Array.isArray(valor)) return valor.map(ordenar);
  if (valor && typeof valor === "object") {
    return Object.fromEntries(
      Object.entries(valor as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([clave, contenido]) => [clave, ordenar(contenido)]),
    );
  }
  return valor;
}
