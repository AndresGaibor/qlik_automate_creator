export function normalizarScopesOauth(texto: string): string[] {
  return Array.from(
    new Set(
      texto
        .split(/[\s,]+/)
        .map((scope) => scope.trim())
        .filter(Boolean),
    ),
  );
}

export function puedeGuardarOauth(entrada: {
  clienteId: string;
  scopes: string[];
  clienteSecreto: string;
  existeConfiguracionPropia: boolean;
}): boolean {
  return Boolean(
    entrada.clienteId.trim() &&
      entrada.scopes.length > 0 &&
      (entrada.existeConfiguracionPropia || entrada.clienteSecreto.length >= 8),
  );
}
