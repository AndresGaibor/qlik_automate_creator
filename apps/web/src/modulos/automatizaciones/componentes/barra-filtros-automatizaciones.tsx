import { Button } from "@/compartido/componentes/ui/button";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import { sufijoBusqueda } from "@/compartido/utiles/automatizaciones";

interface Props {
  busquedaTemp: string;
  setBusquedaTemp: (v: string) => void;
  buscar: (e: React.FormEvent) => void;
  limpiar: () => void;
  espacios: { id: string; nombre: string }[];
  espacioFiltrado?: string;
  onEspacioChange: (id: string) => void;
  onNueva: () => void;
}

export function BarraFiltrosAutomatizaciones({
  busquedaTemp,
  setBusquedaTemp,
  buscar,
  limpiar,
  espacios,
  espacioFiltrado,
  onEspacioChange,
  onNueva,
}: Props) {
  const busqueda = sufijoBusqueda(espacioFiltrado);

  return (
    <>
      <PageHeader
        title="Automatizaciones de Qlik"
        description="Crea, administra, busca y ejecuta las automatizaciones que orquestan tus tareas Impala/Dataflow."
        actions={
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
            <a href={`/automatizaciones/nueva${busqueda}`}>
              + Nueva Automatización
            </a>
          </Button>
        }
      />

      <div className="bg-white p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <SelectBuscable
          etiqueta="Filtrar por Espacio de Qlik Cloud"
          placeholder="Todos los Espacios"
          searchPlaceholder="Buscar espacio por nombre..."
          emptyText="No se encontraron espacios con ese nombre"
          allowClear
          opciones={espacios}
          valorSeleccionado={espacioFiltrado ?? ""}
          onSeleccionar={onEspacioChange}
        />

        <form onSubmit={buscar}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar Automatización por Nombre
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={busquedaTemp}
                onChange={(e) => setBusquedaTemp(e.target.value)}
                placeholder="Escribe el nombre de la automatización..."
                className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none shadow-sm"
              />
              {busquedaTemp && (
                <button
                  type="button"
                  onClick={limpiar}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
            >
              🔍 Buscar
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
