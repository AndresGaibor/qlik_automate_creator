import { useCallback, useEffect, useState } from "react";

const CLAVE_FILTRO_URL = "espacioId";
const CLAVE_STORAGE = "qlik_filtro_espacio_id";

function obtenerEspacioInicial(): string {
  if (typeof window === "undefined") return "";
  const paramUrl = new URLSearchParams(window.location.search).get(CLAVE_FILTRO_URL);
  if (paramUrl) return paramUrl;
  return localStorage.getItem(CLAVE_STORAGE) ?? "";
}

function persistirEspacio(espacioId: string) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (espacioId) {
    url.searchParams.set(CLAVE_FILTRO_URL, espacioId);
    localStorage.setItem(CLAVE_STORAGE, espacioId);
  } else {
    url.searchParams.delete(CLAVE_FILTRO_URL);
    localStorage.removeItem(CLAVE_STORAGE);
  }
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

export function useFiltroEspacioConPersistencia() {
  const [espacioId, setEspacioId] = useState(obtenerEspacioInicial);

  useEffect(() => {
    if (espacioId && typeof window !== "undefined") {
      persistirEspacio(espacioId);
    }
  }, [espacioId]);

  useEffect(() => {
    const sincronizar = () => setEspacioId(obtenerEspacioInicial());
    window.addEventListener("popstate", sincronizar);
    return () => window.removeEventListener("popstate", sincronizar);
  }, []);

  const establecerEspacioId = useCallback((valor: string) => {
    setEspacioId(valor);
    persistirEspacio(valor);
  }, []);

  return { espacioId, establecerEspacioId };
}
