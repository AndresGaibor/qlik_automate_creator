import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";

interface Props {
  busquedaTemp: string;
  setBusquedaTemp: (v: string) => void;
  buscar: (e: React.FormEvent) => void;
  limpiar: () => void;
  espacios: { id: string; nombre: string }[];
  errorEspacios?: boolean;
  espacioFiltrado?: string;
  onEspacioChange: (id: string) => void;
}

export function BarraFiltrosFlujos({
  busquedaTemp,
  setBusquedaTemp,
  buscar,
  limpiar,
  espacios,
  errorEspacios,
  espacioFiltrado,
  onEspacioChange,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <SelectBuscable
        etiqueta="Filtrar por espacio de Qlik Cloud"
        placeholder="Todos los espacios"
        searchPlaceholder="Escribe el nombre del espacio…"
        emptyText="No encontramos ese espacio. Intenta con otro nombre."
        allowClear
        opciones={espacios}
        error={errorEspacios}
        valorSeleccionado={espacioFiltrado ?? ""}
        onSeleccionar={onEspacioChange}
      />

      <form onSubmit={buscar}>
        <label
          htmlFor="buscar-flujos"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Buscar Dataflow por nombre...
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="buscar-flujos"
              type="text"
              value={busquedaTemp}
              onChange={(e) => setBusquedaTemp(e.target.value)}
              placeholder="Ej: Ventas, Clientes, BanColombia…"
              className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none shadow-sm"
            />
            {busquedaTemp && (
              <button
                type="button"
                onClick={limpiar}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <Icon name="x" size="sm" />
              </button>
            )}
          </div>
          <Button type="submit" size="sm" className="text-xs px-4 gap-1.5">
            <Icon name="search" size="sm" />
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
}
