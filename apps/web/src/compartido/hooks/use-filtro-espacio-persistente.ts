import { useCallback, useEffect, useState } from "react";

const CLAVE_FILTRO = "espacioId";

function leerEspacioIdDesdeUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(CLAVE_FILTRO) ?? "";
}

function escribirEspacioIdEnUrl(espacioId: string) {
  const url = new URL(window.location.href);
  if (espacioId) {
    url.searchParams.set(CLAVE_FILTRO, espacioId);
  } else {
    url.searchParams.delete(CLAVE_FILTRO);
  }
  window.history.replaceState(
    {},
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function useFiltroEspacioPersistente() {
  const [espacioId, setEspacioId] = useState(leerEspacioIdDesdeUrl);

  useEffect(() => {
    const sincronizar = () => setEspacioId(leerEspacioIdDesdeUrl());
    window.addEventListener("popstate", sincronizar);
    return () => window.removeEventListener("popstate", sincronizar);
  }, []);

  const establecerEspacioId = useCallback((valor: string) => {
    setEspacioId(valor);
    if (typeof window !== "undefined") {
      escribirEspacioIdEnUrl(valor);
    }
  }, []);

  return { espacioId, establecerEspacioId };
}
