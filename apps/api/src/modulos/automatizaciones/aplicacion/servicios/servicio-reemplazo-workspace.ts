export function aplicarReemplazosEnWorkspace(
  workspace: Record<string, unknown>,
  reemplazos: Array<{ ruta: string; valor: unknown }>,
): void {
  for (const reemplazo of reemplazos) {
    reemplazarValorExistente(workspace, reemplazo.ruta, reemplazo.valor);
  }
}

export function reemplazarValorExistente(
  raiz: Record<string, unknown>,
  ruta: string,
  valor: unknown,
): void {
  const segmentos = ruta
    .slice(1)
    .split("/")
    .map((segmento) => segmento.replace(/~1/g, "/").replace(/~0/g, "~"));
  let actual: unknown = raiz;
  for (const segmento of segmentos.slice(0, -1)) {
    if (!actual || typeof actual !== "object" || !(segmento in actual)) {
      throw new Error(
        `La ruta ${ruta} no existe en el workspace de la plantilla`,
      );
    }
    actual = (actual as Record<string, unknown>)[segmento];
  }
  const ultimo = segmentos.at(-1);
  if (!ultimo || !actual || typeof actual !== "object" || !(ultimo in actual)) {
    throw new Error(
      `La ruta ${ruta} no existe en el workspace de la plantilla`,
    );
  }
  (actual as Record<string, unknown>)[ultimo] = valor;
}
