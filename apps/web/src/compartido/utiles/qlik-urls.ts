export function normalizarHostQlikUrl(host: string): string {
  return host.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function construirUrlCrearFlujoQlik(
  host: string,
  espacioId?: string,
): string {
  const hostClean = normalizarHostQlikUrl(host);
  const base = `https://${hostClean}/analytics/prepare?resourceTypes=script%2Cdataset%2Cdataflow%2Ctablerecipe`;
  return espacioId?.trim()
    ? `${base}&space_filter=${encodeURIComponent(espacioId.trim())}`
    : base;
}

export function construirUrlVerFlujoQlik(
  host: string,
  flujoId: string,
  espacioId?: string,
): string {
  const hostClean = normalizarHostQlikUrl(host);
  const base = `https://${hostClean}/dataflow/${encodeURIComponent(
    flujoId,
  )}/overview/summary?resourceTypes=script%2Cdataset%2Cdataflow%2Ctablerecipe`;
  return espacioId?.trim()
    ? `${base}&space_filter=${encodeURIComponent(espacioId.trim())}`
    : base;
}

export function construirUrlVerAutomatizacionQlik(
  host: string,
  automatizacionId: string,
  modo: "edit" | "history" = "edit",
): string {
  const hostClean = normalizarHostQlikUrl(host);
  return `https://${hostClean}/analytics/automations/editor/${encodeURIComponent(
    automatizacionId,
  )}/${modo}`;
}
