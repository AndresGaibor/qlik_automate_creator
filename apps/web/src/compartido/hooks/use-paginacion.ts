import { useState } from "react";

const ELEMENTOS_POR_PAGINA = 10;

export function usePaginacion<T>(lista: T[]) {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(lista.length / ELEMENTOS_POR_PAGINA));
  const inicio = (pagina - 1) * ELEMENTOS_POR_PAGINA;
  const items = lista.slice(inicio, inicio + ELEMENTOS_POR_PAGINA);

  const irPagina = (p: number) => setPagina(Math.max(1, Math.min(p, totalPaginas)));
  const reset = () => setPagina(1);

  return {
    paginaActual: pagina,
    totalPaginas,
    elementosPagina: items,
    irPagina,
    reset,
  };
}
