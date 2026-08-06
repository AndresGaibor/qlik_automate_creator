import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { DatoResumenConfiguracion } from "./componentes-configuracion-tecnica";
import type { ResumenConfiguracionTecnica as ResumenConfiguracionTecnicaModelo } from "./modelo-configuracion-tecnica";

export function ResumenConfiguracionTecnica({
  resumen,
  onEditar,
}: {
  resumen: ResumenConfiguracionTecnicaModelo;
  onEditar: () => void;
}) {
  return (
    <article className="rounded-xl border border-line-200 bg-app/20 p-4 sm:p-5">
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.8fr)_auto] xl:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Icon name="robot" size="sm" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">
                {resumen.nombreEntorno}
              </p>
              <p className="truncate font-mono text-xs text-ink-500">
                {resumen.hostVisible}
              </p>
            </div>
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
            <Icon name="check" size="sm" />
            Listo para crear automatizaciones
          </span>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-3">
          <DatoResumenConfiguracion
            etiqueta="Modo 1 · Spark/Python"
            valor={resumen.plantillaModo1}
            configurado={resumen.plantillaModo1 !== "Sin configurar"}
          />
          <DatoResumenConfiguracion
            etiqueta="Modo 2 · SFTP/Talend"
            valor={resumen.plantillaModo2}
            configurado={resumen.plantillaModo2 !== "Sin configurar"}
          />
          <DatoResumenConfiguracion
            etiqueta="Destinos"
            valor={resumen.cantidadVisible}
            configurado={resumen.tieneDestino}
          />
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="w-full shrink-0 gap-1.5 xl:w-auto"
          onClick={onEditar}
        >
          <Icon name="edit" size="sm" />
          Gestionar plantillas y destinos
        </Button>
      </div>
    </article>
  );
}
