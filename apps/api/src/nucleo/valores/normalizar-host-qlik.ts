export function normalizarHostQlik(host: string): string {
  const valor = /^https?:\/\//i.test(host) ? host : `https://${host}`;
  const url = new URL(valor);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search !== "" ||
    url.hash !== ""
  ) {
    throw new Error("El host Qlik debe ser HTTPS y no contener ruta");
  }
  return url.host.toLowerCase();
}
