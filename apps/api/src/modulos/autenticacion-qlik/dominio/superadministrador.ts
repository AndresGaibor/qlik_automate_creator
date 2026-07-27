export function normalizarCorreosSuperadministrador(
  correos?: string,
): string[] {
  return (correos ?? "")
    .split(",")
    .map((correo) => correo.trim().toLowerCase())
    .filter(Boolean);
}

export function esCorreoSuperadministradorHeredado(
  correo: string | null | undefined,
  correosHeredados?: string,
): boolean {
  if (!correo) return false;
  const normalizado = correo.trim().toLowerCase();
  return normalizarCorreosSuperadministrador(correosHeredados).includes(
    normalizado,
  );
}

export function resolverEsSuperadministrador(entrada: {
  persistido: boolean;
  correo: string | null | undefined;
  correosHeredados?: string;
}): boolean {
  return (
    entrada.persistido ||
    esCorreoSuperadministradorHeredado(entrada.correo, entrada.correosHeredados)
  );
}
