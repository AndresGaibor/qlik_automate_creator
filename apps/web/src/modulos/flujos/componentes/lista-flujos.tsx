import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Pagination } from "@/compartido/componentes/ui/pagination";
import { construirUrlVerFlujoQlik } from "@/compartido/utiles/qlik-urls";
import type { ResumenFlujo } from "@/modulos/flujos/api";

interface Props {
  flujos: ResumenFlujo[];
  onVer: (flujo: ResumenFlujo) => void;
  targetHost?: string;
  espacioId: string;
  paginaActual: number;
  totalPaginas: number;
  onPageChange: (page: number) => void;
}

export function ListaFlujos({
  flujos,
  onVer,
  targetHost,
  espacioId,
  paginaActual,
  totalPaginas,
  onPageChange,
}: Props) {
  const inicio = (paginaActual - 1) * 10;

  if (flujos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-500 font-medium mb-1">
          No hay flujos de datos disponibles.
        </p>
        <p className="text-xs text-gray-400">
          Prueba realizando otra búsqueda o cambiando el filtro de espacio.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {flujos.map((flujo) => (
          <Card
            key={flujo.id}
            className="hover:shadow-md transition border-gray-200"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">
                {flujo.nombre}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="text-gray-400">Espacio:</span>{" "}
                    <span className="font-semibold text-gray-800">
                      {flujo.espacioNombre || "Espacio Personal"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Última modificación:{" "}
                    {flujo.modificadoEn
                      ? new Date(flujo.modificadoEn).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {targetHost && (
                    <Button
                      asChild
                      variant="outline"
                      className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-medium"
                    >
                      <a
                        href={construirUrlVerFlujoQlik(
                          targetHost,
                          flujo.id,
                          espacioId,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        👁️ Ver en Qlik Cloud ↗
                      </a>
                    </Button>
                  )}
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium">
                    🚀 Crear Automatización desde este Flujo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg border shadow-sm gap-4 text-sm text-gray-600">
        <span>
          Mostrando <span className="font-semibold text-gray-900">{inicio + 1}</span> -{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(inicio + 10, flujos.length)}
          </span>{" "}
          de <span className="font-semibold text-gray-900">{flujos.length}</span> flujos de datos
        </span>
        <Pagination
          currentPage={paginaActual}
          totalPages={totalPaginas}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
