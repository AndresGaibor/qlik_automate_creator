import { Icon } from "@/compartido/componentes/ui/icon";
import { ListaSelectBuscable } from "./lista-select-buscable";
import type { OpcionSelect } from "./modelo-select-buscable";
import { useSelectBuscable } from "./use-select-buscable";

export type { OpcionSelect } from "./modelo-select-buscable";

interface SelectBuscableProps {
  opciones: OpcionSelect[];
  valorSeleccionado: string;
  onSeleccionar: (valor: string) => void;
  cargando?: boolean;
  error?: boolean;
  placeholder?: string;
  etiqueta?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  allowClear?: boolean;
  disabled?: boolean;
  disabledText?: string;
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
  disabled = false,
  disabledText,
}: SelectBuscableProps) {
  const control = useSelectBuscable(onSeleccionar);
  const opcionActual = opciones.find(
    (opcion) => opcion.id === valorSeleccionado,
  );
  const inactivo = cargando || disabled;

  return (
    <div className="relative w-full" ref={control.contenedorRef}>
      {etiqueta && (
        <label
          htmlFor={control.disparadorId}
          className="mb-1.5 block text-sm font-semibold text-ink-900"
        >
          {etiqueta}
        </label>
      )}
      <button
        id={control.disparadorId}
        ref={control.disparadorRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={control.abierto}
        aria-controls={control.listaId}
        aria-label={etiqueta || placeholder}
        disabled={inactivo}
        onClick={() =>
          control.abierto ? control.cerrar() : control.alternar()
        }
        onKeyDown={(evento) => {
          if (["ArrowDown", "Enter", " "].includes(evento.key)) {
            evento.preventDefault();
            control.abrir();
          } else if (evento.key === "Escape" && control.abierto) {
            evento.preventDefault();
            control.cerrar();
          }
        }}
        className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-surface px-3.5 py-2.5 text-sm shadow-card transition-all duration-150 ease-soft ${
          control.abierto
            ? "border-brand-600 shadow-panel ring-2 ring-brand-100"
            : "border-line-200 hover:border-line-300"
        } ${inactivo ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <ContenidoDisparador
          opcion={opcionActual}
          cargando={cargando}
          disabled={disabled}
          disabledText={disabledText}
          placeholder={placeholder}
        />
        <Icon
          name="chev"
          size="sm"
          className={`ml-2 shrink-0 text-ink-400 transition-transform duration-150 ${
            control.abierto ? "-rotate-90" : "rotate-90"
          }`}
        />
      </button>

      {control.abierto && (
        <ListaSelectBuscable
          opciones={opciones}
          valorSeleccionado={valorSeleccionado}
          busqueda={control.busqueda}
          listaId={control.listaId}
          etiqueta={etiqueta}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          allowClear={allowClear}
          busquedaRef={control.busquedaRef}
          onBusqueda={control.setBusqueda}
          onSeleccionar={control.seleccionar}
          onKeyDownBusqueda={control.onKeyDownBusqueda}
          onKeyDownOpcion={control.onKeyDownOpcion}
        />
      )}

      {error && (
        <span className="mt-1 block text-xs text-danger-600">
          No se pudieron cargar las opciones.
        </span>
      )}
    </div>
  );
}

function ContenidoDisparador({
  opcion,
  cargando,
  disabled,
  disabledText,
  placeholder,
}: {
  opcion?: OpcionSelect;
  cargando: boolean;
  disabled: boolean;
  disabledText?: string;
  placeholder: string;
}) {
  if (cargando || disabled || !opcion) {
    return (
      <span className="flex min-w-0 items-center gap-2.5 truncate font-normal text-ink-400">
        <Icon name="cloud" size="sm" className="shrink-0 text-obj-600" />
        {cargando
          ? "Cargando..."
          : disabled
            ? disabledText || placeholder
            : placeholder}
      </span>
    );
  }
  return (
    <span className="flex min-w-0 items-center gap-2.5 truncate">
      <Icon name="cloud" size="sm" className="shrink-0 text-obj-600" />
      <span className="truncate font-semibold text-ink-900">
        {opcion.nombre}
      </span>
      {opcion.tipo ? (
        <span className="shrink-0 rounded bg-obj-50 px-2 py-0.5 font-mono text-xs font-medium text-obj-600">
          {opcion.tipo}
        </span>
      ) : opcion.espacioNombre ? (
        <span className="shrink-0 text-xs text-ink-400">
          {opcion.espacioNombre}
        </span>
      ) : null}
    </span>
  );
}
