import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import { sufijoBusqueda } from "@/compartido/utiles/automatizaciones";

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

export function BarraFiltrosAutomatizaciones({
  busquedaTemp,
  setBusquedaTemp,
  buscar,
  limpiar,
  espacios,
  errorEspacios,
  espacioFiltrado,
  onEspacioChange,
}: Props) {
  const busqueda = sufijoBusqueda(espacioFiltrado);

  return (
    <>
      <PageHeader
        title="Automatizaciones de Qlik Automate"
        description="Crea procesos en Qlik Automate que actualizan tus datos automáticamente, sin que tengas que hacerlo tú cada vez."
        actions={
          <Button asChild font-medium>
            <a href={`/automatizaciones/nueva${busqueda}`}>
              Crear automatización
            </a>
          </Button>
        }
      />

      <div className="bg-white p-4 rounded-lg border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <SelectBuscable
          etiqueta="Filtrar por espacio"
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
            htmlFor="buscar-automatizaciones"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Buscar por nombre
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="buscar-automatizaciones"
                type="text"
                value={busquedaTemp}
                onChange={(e) => setBusquedaTemp(e.target.value)}
                placeholder="Ej: Auto - Ventas, Dataflow Clientes…"
                className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:border-brand-600 focus:outline-none shadow-sm"
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
    </>
  );
}
