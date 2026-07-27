import { useCallback, useEffect, useRef, useState } from "react";

const CLAVE_FILTRO_URL = "espacioId";
const CLAVE_STORAGE = "qlik_filtro_espacio_id";

function claveStorage(tenantId?: string) {
  return `${CLAVE_STORAGE}:${tenantId ?? "sin-tenant"}`;
}

function obtenerEspacioInicial(tenantId?: string, usarUrl = true): string {
  if (typeof window === "undefined") return "";
  const paramUrl = usarUrl
    ? new URLSearchParams(window.location.search).get(CLAVE_FILTRO_URL)
    : null;
  if (paramUrl) return paramUrl;
  return localStorage.getItem(claveStorage(tenantId)) ?? "";
}

function persistirEspacio(espacioId: string, tenantId?: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (espacioId) {
    url.searchParams.set(CLAVE_FILTRO_URL, espacioId);
    localStorage.setItem(claveStorage(tenantId), espacioId);
  } else {
    url.searchParams.delete(CLAVE_FILTRO_URL);
    localStorage.removeItem(claveStorage(tenantId));
  }
  window.history.replaceState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

/** El filtro es propio del tenant: un espacio de otro entorno nunca se reutiliza. */
export function useFiltroEspacioConPersistencia(tenantId?: string) {
  const tenantInicial = useRef(tenantId);
  const [espacioId, setEspacioId] = useState(() =>
    obtenerEspacioInicial(tenantId),
  );

  useEffect(() => {
    if (tenantInicial.current === tenantId) return;
    tenantInicial.current = tenantId;
    setEspacioId(obtenerEspacioInicial(tenantId, false));
  }, [tenantId]);

  useEffect(() => {
    const sincronizar = () => setEspacioId(obtenerEspacioInicial(tenantId));
    window.addEventListener("popstate", sincronizar);
    return () => window.removeEventListener("popstate", sincronizar);
  }, [tenantId]);

  const establecerEspacioId = useCallback(
    (valor: string) => {
      setEspacioId(valor);
      persistirEspacio(valor, tenantId);
    },
    [tenantId],
  );

  return { espacioId, establecerEspacioId };
}
