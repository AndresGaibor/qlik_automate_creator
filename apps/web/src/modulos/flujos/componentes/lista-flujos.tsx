import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { Pagination } from "@/compartido/componentes/ui/pagination";
import { construirUrlVerFlujoQlik } from "@/compartido/utiles/qlik-urls";
import type { ResumenFlujo } from "@/modulos/flujos/api";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import { Link } from "@tanstack/react-router";
import { VisorScriptFlujoModal } from "./visor-script-flujo-modal";

interface Props {
  flujos: ResumenFlujo[];
  automatizaciones?: ResumenAutomatizacion[];
  targetHost?: string;
  espacioId: string;
  paginaActual: number;
  totalPaginas: number;
  onPageChange: (page: number) => void;
  total: number;
  hayFiltros: boolean;
}

export function ListaFlujos({
  flujos,
  automatizaciones = [],
  targetHost,
  espacioId,
  paginaActual,
  totalPaginas,
  onPageChange,
  total,
  hayFiltros,
}: Props) {
  const inicio = (paginaActual - 1) * 10;

  if (flujos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-500 font-medium mb-1">
          {hayFiltros
            ? "No encontramos flujos con esos filtros"
            : "Aún no hay flujos de datos disponibles"}
        </p>
        <p className="text-xs text-gray-400">
          {hayFiltros
            ? "Cambia el espacio o la búsqueda para intentar de nuevo."
            : "Cuando existan Dataflows en Qlik Cloud aparecerán aquí."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {flujos.map((flujo) => {
          // Buscar si existe alguna automatización vinculada a este flujo (coincidencia de id o por el nombre del flujo)
          const automatizacionVinculada = automatizaciones.find(
            (auto) =>
              auto.nombre.toLowerCase().includes(flujo.nombre.toLowerCase()) ||
              auto.nombre.includes(flujo.id),
          );

          return (
            <Card
              key={flujo.id}
              className="hover:shadow-md transition border-gray-200"
            >
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Link
                    to="/flujos/$id"
                    params={{ id: flujo.id }}
                    className="hover:text-brand-600 hover:underline"
                  >
                    {flujo.nombre}
                  </Link>
                  {automatizacionVinculada && (
                    <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-sans">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      🟢 Ya tiene una automatización en Qlik Automate
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="text-gray-400">Tipo:</span>{" "}
                      <span className="font-semibold text-gray-800">
                        Dataflow de Qlik
                      </span>
                    </p>
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
                    <VisorScriptFlujoModal flujo={flujo} />

                    {targetHost && (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5"
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
                          <Icon name="ext" size="sm" />
                          Ver en Qlik Cloud ↗
                        </a>
                      </Button>
                    )}

                    {automatizacionVinculada ? (
                      <Button
                        asChild
                        size="sm"
                        className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Link
                          to="/automatizaciones/$id"
                          params={{ id: automatizacionVinculada.id }}
                        >
                          <Icon name="zap" size="sm" />
                          Ver automatización creada
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        className="text-xs gap-1.5 bg-brand-600 hover:bg-brand-700 text-white"
                      >
                        <Link
                          to="/automatizaciones/nueva"
                          search={{
                            flujoId: flujo.id,
                            ...(espacioId ? { espacioId } : {}),
                          }}
                        >
                          <Icon name="zap" size="sm" />
                          Crear automatización en Qlik Automate
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg border shadow-sm gap-4 text-sm text-gray-600">
        <span>
          Mostrando{" "}
          <span className="font-semibold text-gray-900">{inicio + 1}</span> -{" "}
          <span className="font-semibold text-gray-900">
            {Math.min(inicio + 10, total)}
          </span>{" "}
          de <span className="font-semibold text-gray-900">{total}</span> flujos
          de datos
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
