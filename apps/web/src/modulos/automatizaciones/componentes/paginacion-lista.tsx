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
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg border shadow-sm gap-4 text-sm text-gray-600">
      <span>
        Mostrando{" "}
        <span className="font-semibold text-gray-900">{inicio + 1}</span> -{" "}
        <span className="font-semibold text-gray-900">
          {Math.min(inicio + 10, total)}
        </span>{" "}
        de <span className="font-semibold text-gray-900">{total}</span>{" "}
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
          ◀ Anterior
        </Button>
        <span className="font-semibold text-gray-800 text-xs">
          Página {paginaActual} de {totalPaginas}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={paginaActual === totalPaginas}
          onClick={() => onIrPagina(paginaActual + 1)}
          className="text-xs"
        >
          Siguiente ▶
        </Button>
      </div>
    </div>
  );
}
