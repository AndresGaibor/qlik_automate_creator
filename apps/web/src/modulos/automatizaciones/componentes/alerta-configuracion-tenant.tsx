import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { ConfiguracionTenant } from "@/modulos/automatizaciones/api";

interface Props {
  configTenant: ConfiguracionTenant | undefined;
  onVolver: () => void;
}

export function AlertaConfiguracionTenant({ configTenant, onVolver }: Props) {
  const modoActivo = configTenant?.modoAutomatizacionActivo ?? 1;
  const esModo2 = modoActivo === 2;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Icon name="gear" size="md" className="text-amber-700" />
        <div>
          <h3 className="font-semibold text-amber-900 text-base">
            Falta configurar la plantilla {esModo2 ? "del Modo 2" : "base"}
          </h3>
          <p className="text-sm text-amber-800 mt-0.5">
            Para poder crear automatizaciones, el administrador primero debe
            configurar la plantilla del{" "}
            <strong>
              {esModo2
                ? "Modo 2 — Dataflow → SFTP → Talend"
                : "Modo 1 — Dataflow Spark/Python"}
            </strong>{" "}
            en <strong>Configuración → Plantilla base</strong>.
          </p>
        </div>
      </div>
      <div className="flex gap-3 mt-1">
        <a
          href="/configuracion#plantilla"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
        >
          Ir a Configuración
        </a>
        <Button variant="outline" onClick={onVolver}>
          Volver
        </Button>
      </div>
    </div>
  );
}
