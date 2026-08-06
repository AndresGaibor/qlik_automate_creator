import { type ConexionSugerida, ETIQUETA_TIPO } from "./modelo-catalogo-origen";

interface Props {
  sugerencias: ConexionSugerida[];
  onSeleccionar: (sugerencia: ConexionSugerida) => void;
}

export function SugerenciasCatalogoOrigen({
  sugerencias,
  onSeleccionar,
}: Props) {
  if (sugerencias.length === 0) return null;
  return (
    <section className="rounded-xl border border-brand-200 bg-brand-50 p-4">
      <h2 className="text-sm font-semibold text-brand-900">
        Conexiones detectadas en el Dataflow
      </h2>
      <p className="mt-1 text-xs text-brand-700">
        Selecciona una para usar su nombre exacto en el catálogo.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {sugerencias.map((sugerencia) => (
          <button
            key={`${sugerencia.tipo}:${sugerencia.nombre}`}
            type="button"
            onClick={() => onSeleccionar(sugerencia)}
            className="max-w-full rounded-md border border-brand-300 bg-surface px-3 py-2 text-left text-xs font-medium text-brand-900 transition-colors hover:bg-brand-100"
          >
            <span className="mr-1.5 rounded bg-brand-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-brand-800">
              {ETIQUETA_TIPO[sugerencia.tipo]}
            </span>
            <span className="break-all">{sugerencia.nombre}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
