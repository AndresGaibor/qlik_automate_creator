const PATRON_IDENTIFICADOR_IMPALA = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function validarIdentificadorImpala(valor: string): string {
  const identificador = valor.trim();
  if (
    !identificador ||
    identificador.length > 128 ||
    !PATRON_IDENTIFICADOR_IMPALA.test(identificador)
  ) {
    throw new Error("Identificador de Impala inválido");
  }
  return identificador;
}
