import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type ResumenFlujo, obtenerScriptFlujo } from "../api";
import { VistaMetadataFlujo } from "./vista-metadata-flujo";
import { VistaScriptFlujo } from "./vista-script-flujo";

interface Props {
  flujo: ResumenFlujo;
}

type PestanaVisorFlujo = "script" | "metadata";

export function VisorScriptFlujoModal({ flujo }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [pestana, setPestana] = useState<PestanaVisorFlujo>("script");
  const script = useQuery({
    queryKey: ["flujo-script", flujo.id],
    queryFn: () => obtenerScriptFlujo(flujo.id),
    enabled: abierto,
    staleTime: 60 * 1000,
  });

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setAbierto(true)}
        className="gap-1.5 border-line-300 text-xs hover:bg-app"
      >
        <Icon name="edit" size="sm" className="text-brand-600" />
        Ver Script / Definición
      </Button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-line-200 bg-surface shadow-2xl">
            <EncabezadoVisor
              flujo={flujo}
              pestana={pestana}
              onCambiarPestana={setPestana}
              onCerrar={() => setAbierto(false)}
            />

            <div className="flex-1 overflow-y-auto bg-slate-50/70 p-6">
              {pestana === "script" ? (
                <VistaScriptFlujo
                  flujoId={flujo.id}
                  datos={script.data}
                  cargando={script.isLoading}
                  error={script.isError ? script.error : null}
                />
              ) : (
                <VistaMetadataFlujo flujo={flujo} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EncabezadoVisor({
  flujo,
  pestana,
  onCambiarPestana,
  onCerrar,
}: {
  flujo: ResumenFlujo;
  pestana: PestanaVisorFlujo;
  onCambiarPestana(pestana: PestanaVisorFlujo): void;
  onCerrar(): void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line-200 bg-app/50 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-2.5 text-brand-600">
          <Icon name="cloud" size="md" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink-900">
            Script de Carga / Dataflow
          </h3>
          <p className="font-mono text-xs text-ink-500">
            {flujo.nombre} (ID: {flujo.id})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-lg bg-line-200/60 p-1 text-xs">
          <BotonPestana
            activa={pestana === "script"}
            onClick={() => onCambiarPestana("script")}
          >
            Script de Carga (QVS/QIX)
          </BotonPestana>
          <BotonPestana
            activa={pestana === "metadata"}
            onClick={() => onCambiarPestana("metadata")}
          >
            Metadatos JSON
          </BotonPestana>
        </div>
        <button
          type="button"
          aria-label="Cerrar visor de script"
          onClick={onCerrar}
          className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-line-200/50 hover:text-ink-900"
        >
          <Icon name="x" size="md" />
        </button>
      </div>
    </div>
  );
}

function BotonPestana({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick(): void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1 font-medium transition-all ${
        activa
          ? "bg-surface text-ink-900 shadow-sm"
          : "text-ink-500 hover:text-ink-900"
      }`}
    >
      {children}
    </button>
  );
}
