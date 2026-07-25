import { Icon } from "@/compartido/componentes/ui/icon";
import { useEffect, useRef, useState } from "react";

export interface OpcionSelect {
  id: string;
  nombre: string;
  tipo?: string;
  espacioNombre?: string;
}

interface SelectBuscableProps {
  opciones: OpcionSelect[];
  valorSeleccionado: string;
  onSeleccionar: (valor: string) => void;
  cargando?: boolean;
  error?: boolean;
  placeholder?: string;
  etiqueta?: string;
  /** Placeholder del input de búsqueda interno */
  searchPlaceholder?: string;
  /** Texto cuando no hay resultados */
  emptyText?: string;
  /** Si se muestra la opción "Todos / Limpiar" al inicio de la lista */
  allowClear?: boolean;
}

export function SelectBuscable({
  opciones,
  valorSeleccionado,
  onSeleccionar,
  cargando = false,
  error = false,
  placeholder = "Todos los espacios",
  etiqueta = "Filtrar por espacio",
  searchPlaceholder = "Buscar por nombre...",
  emptyText,
  allowClear = false,
}: SelectBuscableProps) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(event.target as Node)
      ) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const opcionActual = opciones.find((o) => o.id === valorSeleccionado);

  const opcionesFiltradas = opciones.filter(
    (o) =>
      (o.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      ((o.tipo ?? "").toLowerCase().includes(busqueda.toLowerCase())) ||
      ((o.espacioNombre ?? "").toLowerCase().includes(busqueda.toLowerCase())),
  );

  const textoVacio = emptyText ?? `No se encontraron resultados para "${busqueda}"`;

  return (
    <div className="relative w-full" ref={contenedorRef}>
      {etiqueta && (
        <label className="block text-sm font-semibold text-ink-900 mb-1.5">
          {etiqueta}
        </label>
      )}

      {/* Botón Principal del Select */}
      <div
        onClick={() => !cargando && setAbierto(!abierto)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md border bg-surface cursor-pointer shadow-card text-sm transition-all duration-150 ease-soft ${
          abierto
            ? "border-brand-600 ring-2 ring-brand-100 shadow-panel"
            : "border-line-200 hover:border-line-300"
        } ${cargando ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          <Icon name="cloud" size="sm" className="text-obj-600 shrink-0" />
          {cargando ? (
            <span className="text-ink-400 font-normal">Cargando...</span>
          ) : opcionActual ? (
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="font-semibold text-ink-900 truncate">
                {opcionActual.nombre}
              </span>
              {opcionActual.tipo && (
                <span className="text-xs bg-obj-50 text-obj-600 px-2 py-0.5 rounded font-mono font-medium shrink-0">
                  {opcionActual.tipo}
                </span>
              )}
              {opcionActual.espacioNombre && !opcionActual.tipo && (
                <span className="text-xs text-ink-400 shrink-0">
                  {opcionActual.espacioNombre}
                </span>
              )}
            </div>
          ) : (
            <span className="text-ink-400 font-normal">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2 shrink-0">
          {valorSeleccionado && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSeleccionar("");
                setBusqueda("");
              }}
              className="text-ink-400 hover:text-ink-900 p-1 rounded hover:bg-hover transition-colors"
              title="Limpiar selección"
            >
              <Icon name="x" size="sm" />
            </button>
          )}
          <Icon name="chev" size="sm" className={`text-ink-400 transition-transform duration-150 ${abierto ? "-rotate-90" : "rotate-90"}`} />
        </div>
      </div>

      {/* Menú Desplegable Buscable */}
      {abierto && (
        <div className="absolute z-50 mt-1.5 w-full bg-surface border border-line-200 rounded-lg shadow-panel overflow-hidden animate-in fade-in duration-100">
          {/* Input de Búsqueda */}
          <div className="p-2 border-b border-line-200 bg-app/50 relative">
            <Icon name="search" size="sm" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              autoFocus
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-line-200 rounded-md bg-surface text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
            />
          </div>

          {/* Lista de Opciones */}
          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
            {/* Opción "Todos / Limpiar" sólo si allowClear=true */}
            {allowClear && (
              <div
                onClick={() => {
                  onSeleccionar("");
                  setAbierto(false);
                  setBusqueda("");
                }}
                className={`px-3 py-2 text-sm flex items-center justify-between rounded-md cursor-pointer transition-colors ${
                  !valorSeleccionado ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-700 hover:bg-hover"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon name="cloud" size="sm" className="text-ink-400" />
                  {placeholder}
                </span>
                {!valorSeleccionado && <Icon name="check" size="sm" className="text-brand-600" />}
              </div>
            )}

            {opcionesFiltradas.length > 0 ? (
              opcionesFiltradas.map((opcion) => {
                const esSeleccionado = opcion.id === valorSeleccionado;
                return (
                  <div
                    key={opcion.id}
                    onClick={() => {
                      onSeleccionar(opcion.id);
                      setAbierto(false);
                      setBusqueda("");
                    }}
                    className={`px-3 py-2 text-sm flex items-center justify-between rounded-md cursor-pointer transition-colors ${
                      esSeleccionado ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-700 hover:bg-hover hover:text-ink-900"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{opcion.nombre}</span>
                        {opcion.tipo && (
                          <span className="text-xs bg-obj-50 text-obj-600 px-1.5 py-0.5 rounded font-mono font-medium shrink-0">
                            {opcion.tipo}
                          </span>
                        )}
                      </div>
                      {opcion.espacioNombre && (
                        <span className="text-xs text-ink-400 truncate">{opcion.espacioNombre}</span>
                      )}
                    </div>
                    {esSeleccionado && (
                      <Icon name="check" size="sm" className="text-brand-600 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-xs text-center text-ink-400">
                {textoVacio}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <span className="mt-1 block text-xs text-danger-600">
          No se pudieron cargar las opciones.
        </span>
      )}
    </div>
  );
}
