import { Icon } from "@/compartido/componentes/ui/icon";
import type { VariableResumenWorkspace } from "./modelo-workspace";
import { WorkspaceValor } from "./workspace-valor";

export function WorkspaceVariableCard({
  variable,
}: { variable: VariableResumenWorkspace }) {
  return (
    <div className="flex items-start gap-3 px-4 py-2.5 border-b border-line-100 last:border-b-0">
      <Icon name="db" size="sm" className="text-obj-600 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-ink-900">
          {variable.nombre}
        </div>
        <div className="mt-0.5">
          <WorkspaceValor valor={variable.valor} />
        </div>
      </div>
    </div>
  );
}
