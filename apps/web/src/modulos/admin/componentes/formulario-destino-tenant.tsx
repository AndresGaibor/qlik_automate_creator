import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { CamposDestinoTenant } from "./campos-destino-tenant";
import {
  type ConfiguracionDestino,
  TIPOS_DESTINO,
  type TipoDestino,
} from "./modelo-destino-tenant";

export function FormularioDestinoTenant({
  tipo,
  nombre,
  config,
  cantidadExistentes,
  habilitado,
  guardando,
  onNombre,
  onTipo,
  onCambiar,
  onCancelar,
  onGuardar,
}: {
  tipo: TipoDestino;
  nombre: string;
  config: ConfiguracionDestino;
  cantidadExistentes: number;
  habilitado: boolean;
  guardando: boolean;
  onNombre: (valor: string) => void;
  onTipo: (tipo: TipoDestino) => void;
  onCambiar: (campo: string, valor: string) => void;
  onCancelar: () => void;
  onGuardar: () => void;
}) {
  return (
    <div className="rounded-xl border border-line-200 bg-surface">
      <div className="rounded-t-xl border-b border-line-200 bg-app/30 px-4 py-3">
        <p className="text-sm font-semibold text-ink-900">
          Nueva conexión de destino
        </p>
        <p className="mt-0.5 text-xs text-ink-500">
          Usa un nombre reconocible para que los usuarios puedan elegirla sin
          conocer detalles técnicos.
        </p>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-12">
        <label className="block text-xs font-semibold text-ink-700 md:col-span-8">
          Nombre visible <span className="text-danger-600">*</span>
          <input
            value={nombre}
            onChange={(evento) => onNombre(evento.target.value)}
            placeholder="Nombre de la conexión, por ejemplo Producción"
            className="mt-1 h-10 w-full rounded-md border border-line-200 bg-surface px-3 text-sm font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />
        </label>

        <label className="block text-xs font-semibold text-ink-700 md:col-span-4">
          Tipo de destino
          <select
            value={tipo}
            onChange={(evento) => onTipo(evento.target.value as TipoDestino)}
            className="mt-1 h-10 w-full rounded-md border border-line-200 bg-surface px-3 text-sm font-normal outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            aria-label="Tipo de destino"
          >
            {TIPOS_DESTINO.map((opcion) => (
              <option
                key={opcion.id}
                value={opcion.id}
                disabled={opcion.deshabilitado}
              >
                {opcion.nombre}
              </option>
            ))}
          </select>
        </label>

        <CamposDestinoTenant
          tipo={tipo}
          config={config}
          onCambiar={onCambiar}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-line-200 bg-app/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-ink-500">
          Los campos marcados con * son obligatorios.
        </p>
        <div className="flex justify-end gap-2">
          {cantidadExistentes > 0 && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onCancelar}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            disabled={!habilitado || guardando}
            onClick={onGuardar}
            className="gap-1.5"
          >
            <Icon name="check" size="sm" />
            {guardando ? "Guardando…" : "Guardar destino"}
          </Button>
        </div>
      </div>
    </div>
  );
}
