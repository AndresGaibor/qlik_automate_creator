interface Cifrador {
  cifrar(valor: string): { cifrado: string; iv: string; tag: string };
}

interface Descifrador {
  descifrar(cifrado: string, iv: string, tag: string): string;
}

interface PaqueteCifrado {
  cifrado: string;
  iv: string;
  tag: string;
}

export function cifrarSecretoParaPersistencia(
  cifrado: Cifrador,
  secreto: string,
): string {
  return JSON.stringify(cifrado.cifrar(secreto));
}

export function descifrarSecretoPersistido(
  cifrado: Descifrador,
  secretoPersistido: string,
): string {
  const paquete = JSON.parse(secretoPersistido) as Partial<PaqueteCifrado>;
  if (!paquete.cifrado || !paquete.iv || !paquete.tag) {
    throw new Error("El secreto cifrado almacenado no es válido");
  }
  return cifrado.descifrar(paquete.cifrado, paquete.iv, paquete.tag);
}

export function leerSecretoCifrado(
  cifrado: Descifrador,
  secretoPersistido: string | null | undefined,
): string | undefined {
  return secretoPersistido
    ? descifrarSecretoPersistido(cifrado, secretoPersistido)
    : undefined;
}
