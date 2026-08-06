import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import { procesarBloquesWorkspace } from "./modelo-workspace";
import { TarjetaBloqueWorkspace } from "./tarjeta-bloque-workspace";

interface Props {
  workspace: Record<string, unknown>;
}

export function VistaBloquesWorkspace({ workspace }: Props) {
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<string | null>(
    null,
  );
  const [copiado, setCopiado] = useState(false);
  const { bloques, bloquesRaw } = procesarBloquesWorkspace(workspace);

  const copiarWorkspace = () => {
    navigator.clipboard.writeText(JSON.stringify(workspace, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500 shadow-sm">
        <span className="flex items-center gap-2 font-medium text-slate-700">
          <Icon name="flow" size="sm" className="text-brand-600" />
          Secuencia ejecutable de bloques conectados
        </span>
        <button
          type="button"
          onClick={copiarWorkspace}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          <Icon name="copy" size="sm" />
          {copiado ? "¡Copiado!" : "Copiar JSON Workspace"}
        </button>
      </div>

      {bloques.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No se encontraron bloques explícitos en este workspace o el script
          está vacío.
        </div>
      ) : (
        <div className="relative space-y-0">
          {bloques.map((bloque, indice) => {
            const seleccionado = bloqueSeleccionado === bloque.id;
            return (
              <TarjetaBloqueWorkspace
                key={bloque.id || indice}
                bloque={bloque}
                datosRaw={bloquesRaw.find(
                  (item) => String(item.id) === bloque.id,
                )}
                indice={indice}
                seleccionado={seleccionado}
                ultimo={indice === bloques.length - 1}
                onAlternar={() =>
                  setBloqueSeleccionado(seleccionado ? null : bloque.id)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
