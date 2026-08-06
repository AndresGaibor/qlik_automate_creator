interface EntornoQlikPresentable {
  nombre?: string | null;
  host: string;
  esPrincipal?: boolean;
}

export function normalizarHostQlik(valor: string): string {
  return valor
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

export function urlEntornoQlik(host: string): string {
  return `https://${normalizarHostQlik(host)}`;
}

export function nombreVisibleEntornoQlik({
  nombre,
  host,
  esPrincipal,
}: EntornoQlikPresentable): string {
  const limpio = nombre?.trim();
  const pareceUrl = Boolean(limpio && /^https?:\/\//i.test(limpio));
  const repiteHost = Boolean(
    limpio && normalizarHostQlik(limpio) === normalizarHostQlik(host),
  );

  if (limpio && !pareceUrl && !repiteHost) return limpio;
  return esPrincipal ? "Entorno principal" : "Entorno Qlik";
}
