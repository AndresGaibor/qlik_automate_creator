import { Icon } from "@/compartido/componentes/ui/icon";
import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import {
  type BloqueWorkspace,
  obtenerTipoBadge,
  presentarValorEntrada,
} from "./modelo-workspace";

interface Props {
  bloque: BloqueWorkspace;
  datosRaw?: Record<string, unknown>;
  indice: number;
  seleccionado: boolean;
  ultimo: boolean;
  onAlternar(): void;
}

export function TarjetaBloqueWorkspace({
  bloque,
  datosRaw,
  indice,
  seleccionado,
  ultimo,
  onAlternar,
}: Props) {
  const badge = obtenerTipoBadge(bloque.type);

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`w-full rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
          seleccionado
            ? "border-brand-500 ring-2 ring-brand-100 shadow-md"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white shadow-sm">
              {indice + 1}
            </span>
            <div>
              <h4 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
                {bloque.title}
                {bloque.disabled && (
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-normal text-slate-600">
                    Deshabilitado
                  </span>
                )}
              </h4>
              {bloque.comment && (
                <p className="mt-0.5 text-xs italic text-slate-500">
                  Comentario: "{bloque.comment}"
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.bg}`}
            >
              <Icon name={badge.icon} size="sm" />
              {badge.label}
            </span>
            <button
              type="button"
              onClick={onAlternar}
              className="ml-1 rounded-lg border border-transparent px-2.5 py-1 text-xs font-medium text-brand-600 transition-colors hover:border-brand-100 hover:bg-brand-50 hover:text-brand-800"
            >
              {seleccionado ? "Ocultar JSON" : "Ver JSON"}
            </button>
          </div>
        </div>

        <div className="space-y-3 p-4">
          {bloque.inputs.length > 0 ? (
            <div className="space-y-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Parámetros y Entradas ({bloque.inputs.length})
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {bloque.inputs.map((input) => {
                  const valor = presentarValorEntrada(input.value);
                  return (
                    <div
                      key={input.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-2.5 text-xs"
                    >
                      <span className="block text-[11px] font-medium text-slate-500">
                        {input.label}:
                      </span>
                      <span className="mt-0.5 truncate break-all font-mono font-semibold text-slate-800">
                        {valor.vacio ? (
                          <span className="italic text-slate-400">
                            {valor.texto}
                          </span>
                        ) : (
                          valor.texto
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-xs italic text-slate-400">
              Sin parámetros de entrada adicionales.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
            <span>ID: {bloque.id}</span>
            {bloque.nextBlockId && (
              <span className="rounded-md border border-brand-100 bg-brand-50 px-2 py-0.5 font-semibold text-brand-600">
                Conectado a {bloque.nextBlockId.substring(0, 8)}…
              </span>
            )}
          </div>
        </div>

        {seleccionado && datosRaw && (
          <div className="rounded-b-2xl border-t border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2 text-xs text-slate-600">
              <span className="font-mono font-semibold text-brand-700">
                ESQUEMA JSON DEL BLOQUE [{bloque.title}]
              </span>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify(datosRaw, null, 2),
                  )
                }
                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-100 hover:text-slate-900"
              >
                Copiar Bloque
              </button>
            </div>
            <VisorJsonInteractivo data={datosRaw} />
          </div>
        )}
      </div>

      {!ultimo && (
        <div className="flex flex-col items-center py-2">
          <div className="h-6 w-0.5 bg-brand-300" />
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-brand-200 bg-brand-100 text-[10px] text-brand-700 shadow-sm">
            Ver detalles
          </div>
          <div className="h-2 w-0.5 bg-brand-300" />
        </div>
      )}
    </div>
  );
}
