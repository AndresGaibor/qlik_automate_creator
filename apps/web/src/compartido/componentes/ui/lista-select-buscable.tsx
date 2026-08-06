import { Icon } from "@/compartido/componentes/ui/icon";
import type { KeyboardEvent, RefObject } from "react";
import {
  type OpcionSelect,
  filtrarOpcionesSelect,
  textoSinResultados,
} from "./modelo-select-buscable";

export function ListaSelectBuscable({
  opciones,
  valorSeleccionado,
  busqueda,
  listaId,
  etiqueta,
  placeholder,
  searchPlaceholder,
  emptyText,
  allowClear,
  busquedaRef,
  onBusqueda,
  onSeleccionar,
  onKeyDownBusqueda,
  onKeyDownOpcion,
}: {
  opciones: OpcionSelect[];
  valorSeleccionado: string;
  busqueda: string;
  listaId: string;
  etiqueta: string;
  placeholder: string;
  searchPlaceholder: string;
  emptyText?: string;
  allowClear: boolean;
  busquedaRef: RefObject<HTMLInputElement>;
  onBusqueda: (valor: string) => void;
  onSeleccionar: (valor: string) => void;
  onKeyDownBusqueda: (evento: KeyboardEvent<HTMLInputElement>) => void;
  onKeyDownOpcion: (
    evento: KeyboardEvent<HTMLButtonElement>,
    valor: string,
  ) => void;
}) {
  const filtradas = filtrarOpcionesSelect(opciones, busqueda);
  return (
    <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-line-200 bg-surface shadow-panel animate-in fade-in duration-100">
      <div className="relative border-b border-line-200 bg-app/50 p-2">
        <Icon
          name="search"
          size="sm"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type="text"
          ref={busquedaRef}
          value={busqueda}
          onChange={(evento) => onBusqueda(evento.target.value)}
          placeholder={searchPlaceholder}
          aria-label={`Buscar en ${etiqueta || placeholder}`}
          aria-controls={listaId}
          onKeyDown={onKeyDownBusqueda}
          className="w-full rounded-md border border-line-200 bg-surface py-1.5 pl-8 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        />
      </div>

      <div
        id={listaId}
        // biome-ignore lint/a11y/useSemanticElements: listbox personalizado con búsqueda integrada
        role="listbox"
        tabIndex={-1}
        aria-label={etiqueta || placeholder}
        className="max-h-60 space-y-0.5 overflow-y-auto p-1"
      >
        {allowClear && (
          <OpcionLista
            valor=""
            seleccionada={!valorSeleccionado}
            onSeleccionar={onSeleccionar}
            onKeyDown={onKeyDownOpcion}
          >
            <span className="flex items-center gap-2">
              <Icon name="cloud" size="sm" className="text-ink-400" />
              {placeholder}
            </span>
          </OpcionLista>
        )}

        {filtradas.length > 0 ? (
          filtradas.map((opcion) => (
            <OpcionLista
              key={opcion.id}
              valor={opcion.id}
              seleccionada={opcion.id === valorSeleccionado}
              onSeleccionar={onSeleccionar}
              onKeyDown={onKeyDownOpcion}
            >
              <ContenidoOpcion opcion={opcion} />
            </OpcionLista>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-xs text-ink-400">
            {textoSinResultados(busqueda, emptyText)}
          </div>
        )}
      </div>
    </div>
  );
}

function OpcionLista({
  valor,
  seleccionada,
  onSeleccionar,
  onKeyDown,
  children,
}: {
  valor: string;
  seleccionada: boolean;
  onSeleccionar: (valor: string) => void;
  onKeyDown: (evento: KeyboardEvent<HTMLButtonElement>, valor: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // biome-ignore lint/a11y/useSemanticElements: opción interactiva de un listbox personalizado
      role="option"
      aria-selected={seleccionada}
      data-opcion-select
      onClick={() => onSeleccionar(valor)}
      onKeyDown={(evento) => onKeyDown(evento, valor)}
      className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
        seleccionada
          ? "bg-brand-50 font-semibold text-brand-700"
          : "text-ink-700 hover:bg-hover hover:text-ink-900"
      }`}
    >
      {children}
      {seleccionada && (
        <Icon name="check" size="sm" className="ml-2 shrink-0 text-brand-600" />
      )}
    </button>
  );
}

function ContenidoOpcion({ opcion }: { opcion: OpcionSelect }) {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-center gap-2 truncate">
        <span className="truncate">{opcion.nombre}</span>
        {opcion.badgeAviso && (
          <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            Aviso: {opcion.badgeAviso}
          </span>
        )}
        {opcion.tipo && (
          <span className="shrink-0 rounded bg-obj-50 px-1.5 py-0.5 font-mono text-xs font-medium text-obj-600">
            {opcion.tipo}
          </span>
        )}
      </div>
      {opcion.espacioNombre && (
        <span className="truncate text-xs text-ink-400">
          {opcion.espacioNombre}
        </span>
      )}
    </div>
  );
}
