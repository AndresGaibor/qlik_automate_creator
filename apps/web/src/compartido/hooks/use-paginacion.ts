import { useCallback, useEffect, useState } from "react";

const ELEMENTOS_POR_PAGINA = 10;

export function usePaginacion<T>(lista: T[]) {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(
    1,
    Math.ceil(lista.length / ELEMENTOS_POR_PAGINA),
  );
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * ELEMENTOS_POR_PAGINA;
  const items = lista.slice(inicio, inicio + ELEMENTOS_POR_PAGINA);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  const irPagina = useCallback(
    (p: number) => setPagina(Math.max(1, Math.min(p, totalPaginas))),
    [totalPaginas],
  );
  const reset = useCallback(() => setPagina(1), []);

  return {
    paginaActual: paginaSegura,
    totalPaginas,
    elementosPagina: items,
    irPagina,
    reset,
  };
}
