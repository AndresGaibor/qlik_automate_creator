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
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {etiqueta}
      </label>

      {/* Botón Principal del Select */}
      <div
        onClick={() => !cargando && setAbierto(!abierto)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-white cursor-pointer shadow-sm text-sm transition ${
          abierto
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-gray-300 hover:border-gray-400"
        } ${cargando ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2 truncate min-w-0">
          <span className="text-gray-400 shrink-0">🔍</span>
          {cargando ? (
            <span className="text-gray-400 font-normal">Cargando...</span>
          ) : opcionActual ? (
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className="font-semibold text-gray-900 truncate">
                {opcionActual.nombre}
              </span>
              {opcionActual.tipo && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono shrink-0">
                  {opcionActual.tipo}
                </span>
              )}
              {opcionActual.espacioNombre && !opcionActual.tipo && (
                <span className="text-xs text-gray-400 shrink-0">
                  {opcionActual.espacioNombre}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {valorSeleccionado && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSeleccionar("");
                setBusqueda("");
              }}
              className="text-gray-400 hover:text-gray-600 text-xs p-1 rounded-full hover:bg-gray-100"
              title="Limpiar selección"
            >
              ✕
            </button>
          )}
          <span className="text-gray-400 text-xs">{abierto ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Menú Desplegable Buscable */}
      {abierto && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in duration-100">
          {/* Input de Búsqueda */}
          <div className="p-2 border-b bg-gray-50">
            <input
              type="text"
              autoFocus
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>

          {/* Lista de Opciones */}
          <div className="max-h-64 overflow-y-auto py-1 divide-y divide-gray-50">
            {/* Opción "Todos / Limpiar" sólo si allowClear=true */}
            {allowClear && (
              <div
                onClick={() => {
                  onSeleccionar("");
                  setAbierto(false);
                  setBusqueda("");
                }}
                className={`px-3 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-blue-50 transition ${
                  !valorSeleccionado ? "bg-blue-50/70 font-semibold text-blue-900" : "text-gray-700"
                }`}
              >
                <span>🌐 {placeholder}</span>
                {!valorSeleccionado && <span className="text-blue-600 text-xs">✓</span>}
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
                    className={`px-3 py-2.5 text-sm flex items-center justify-between cursor-pointer hover:bg-blue-50 transition ${
                      esSeleccionado ? "bg-blue-50/70 font-semibold text-blue-900" : "text-gray-700"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{opcion.nombre}</span>
                        {opcion.tipo && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono shrink-0">
                            {opcion.tipo}
                          </span>
                        )}
                      </div>
                      {opcion.espacioNombre && (
                        <span className="text-xs text-gray-400 truncate">{opcion.espacioNombre}</span>
                      )}
                    </div>
                    {esSeleccionado && (
                      <span className="text-blue-600 font-bold text-xs shrink-0 ml-2">✓</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-xs text-center text-gray-400">
                {textoVacio}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <span className="mt-1 block text-xs text-red-600">
          No se pudieron cargar las opciones.
        </span>
      )}
    </div>
  );
}

