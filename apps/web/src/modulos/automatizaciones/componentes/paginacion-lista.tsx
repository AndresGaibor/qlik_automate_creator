import { Button } from "@/compartido/componentes/ui/button";

interface Props {
  paginaActual: number;
  totalPaginas: number;
  onIrPagina: (p: number) => void;
  inicio: number;
  total: number;
}

export function PaginacionLista({
  paginaActual,
  totalPaginas,
  onIrPagina,
  inicio,
  total,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-line-200 bg-surface px-4 py-3 text-sm text-ink-500 sm:flex-row">
      <span>
        Mostrando{" "}
        <span className="font-semibold text-ink-900">{inicio + 1}</span> -{" "}
        <span className="font-semibold text-ink-900">
          {Math.min(inicio + 10, total)}
        </span>{" "}
        de <span className="font-semibold text-ink-900">{total}</span>{" "}
        automatizaciones
      </span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={paginaActual === 1}
          onClick={() => onIrPagina(paginaActual - 1)}
          className="text-xs"
        >
          Anterior
        </Button>
        <span className="text-xs font-semibold text-ink-700">
          Página {paginaActual} de {totalPaginas}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={paginaActual === totalPaginas}
          onClick={() => onIrPagina(paginaActual + 1)}
          className="text-xs"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
