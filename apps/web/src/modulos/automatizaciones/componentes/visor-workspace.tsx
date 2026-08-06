import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import type { WorkspaceAutomatizacion } from "@/modulos/automatizaciones/api";
import {
  type ResumenFlujo,
  obtenerFlujosConFiltros,
} from "@/modulos/flujos/publico";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  construirReferenciaWorkspace,
  extraerBloquesResumen,
  extraerVariablesResumen,
} from "./modelo-workspace";
import { WorkspaceBloqueCard } from "./workspace-bloque-card";
import { WorkspaceReferencias } from "./workspace-referencias";
import { WorkspaceVariableCard } from "./workspace-variable-card";

export function VisorWorkspace({
  workspace,
}: { workspace: WorkspaceAutomatizacion }) {
  const [expandidoGlobal, setExpandidoGlobal] = useState(true);
  const bloques = extraerBloquesResumen(workspace.workspace);
  const variables = extraerVariablesResumen(workspace.workspace);
  const { data: flujos = [] } = useQuery<ResumenFlujo[]>({
    queryKey: ["flujos"],
    queryFn: () => obtenerFlujosConFiltros(),
    staleTime: 60 * 1000,
  });
  const referencia = construirReferenciaWorkspace(variables, flujos);

  if (bloques.length === 0 && variables.length === 0) {
    return <WorkspaceVacio />;
  }

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="font-display text-lg font-semibold text-ink-900">
              Estructura del Workspace
            </CardTitle>
            {bloques.length > 0 && (
              <Contador cantidad={bloques.length} singular="bloque" />
            )}
            {variables.length > 0 && (
              <Contador
                cantidad={variables.length}
                singular="variable"
                variables
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => setExpandidoGlobal(!expandidoGlobal)}
            className="text-xs text-ink-500 hover:text-ink-700 font-medium transition-colors"
          >
            {expandidoGlobal ? "Colapsar todos" : "Expandir todos"}
          </button>
        </div>
      </CardHeader>
      {expandidoGlobal && (
        <CardContent className="p-4 space-y-6">
          {referencia && <WorkspaceReferencias referencia={referencia} />}
          {bloques.length > 0 && (
            <section>
              <TituloSeccion>Bloques</TituloSeccion>
              <div className="space-y-2">
                {bloques.map((bloque) => (
                  <WorkspaceBloqueCard key={bloque.nombre} bloque={bloque} />
                ))}
              </div>
            </section>
          )}
          {variables.length > 0 && (
            <section>
              <TituloSeccion>Variables</TituloSeccion>
              <div className="rounded-lg border border-line-200 bg-app/40 overflow-hidden">
                {variables.map((variable) => (
                  <WorkspaceVariableCard
                    key={variable.nombre}
                    variable={variable}
                  />
                ))}
              </div>
            </section>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function WorkspaceVacio() {
  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="font-display text-lg font-semibold text-ink-900">
          Estructura del Workspace
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 text-center text-sm text-ink-400">
        No se encontraron bloques ni variables en el workspace de esta
        automatización.
      </CardContent>
    </Card>
  );
}

function Contador({
  cantidad,
  singular,
  variables = false,
}: {
  cantidad: number;
  singular: string;
  variables?: boolean;
}) {
  return (
    <span
      className={`text-xs font-mono rounded-full px-2 py-0.5 ${
        variables
          ? "text-ink-400 bg-obj-100 text-obj-700"
          : "text-ink-400 bg-ink-100"
      }`}
    >
      {cantidad} {cantidad === 1 ? singular : `${singular}s`}
    </span>
  );
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2 px-1">
      {children}
    </div>
  );
}
