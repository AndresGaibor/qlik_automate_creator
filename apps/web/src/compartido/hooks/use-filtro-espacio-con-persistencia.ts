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
export function useFiltroEspacioConPersistencia(
  tenantId?: string,
  opciones: { habilitado?: boolean } = {},
) {
  const habilitado = opciones.habilitado ?? true;
  const tenantInicial = useRef(tenantId);
  const [espacioId, setEspacioId] = useState(() =>
    habilitado ? obtenerEspacioInicial(tenantId) : "",
  );

  useEffect(() => {
    if (!habilitado) {
      persistirEspacio("", tenantId);
      setEspacioId("");
      return;
    }
    if (tenantInicial.current === tenantId) return;
    tenantInicial.current = tenantId;
    setEspacioId(obtenerEspacioInicial(tenantId, false));
  }, [habilitado, tenantId]);

  useEffect(() => {
    if (!habilitado) return;
    const sincronizar = () => setEspacioId(obtenerEspacioInicial(tenantId));
    window.addEventListener("popstate", sincronizar);
    return () => window.removeEventListener("popstate", sincronizar);
  }, [habilitado, tenantId]);

  const establecerEspacioId = useCallback(
    (valor: string) => {
      if (!habilitado) {
        setEspacioId("");
        persistirEspacio("", tenantId);
        return;
      }
      setEspacioId(valor);
      persistirEspacio(valor, tenantId);
    },
    [habilitado, tenantId],
  );

  return { espacioId, establecerEspacioId };
}
