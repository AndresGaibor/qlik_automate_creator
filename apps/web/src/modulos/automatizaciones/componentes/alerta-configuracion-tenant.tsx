import { Button } from "@/compartido/componentes/ui/button";
import type { ConfiguracionTenant } from "@/modulos/automatizaciones/api";

interface Props {
  configTenant: ConfiguracionTenant | undefined;
  onVolver: () => void;
}

export function AlertaConfiguracionTenant({ onVolver }: Props) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-3xl">⚠️</span>
        <div>
          <h3 className="font-semibold text-amber-900 text-base">
            Automatización base no configurada
          </h3>
          <p className="text-sm text-amber-800 mt-0.5">
            El tenant no tiene configurada una{" "}
            <strong>automatización base (plantilla)</strong>. Sin ella no se
            pueden crear nuevas automatizaciones.
          </p>
        </div>
      </div>
      <div className="flex gap-3 mt-1">
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          ⚙️ Ir a Administración
        </a>
        <Button variant="outline" onClick={onVolver}>
          ← Volver
        </Button>
      </div>
    </div>
  );
}
