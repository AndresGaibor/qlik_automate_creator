import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import type { TenantQlik } from "@/modulos/admin/api";
import {
  CabeceraBloqueConfiguracion,
  EstadoConfiguracionTecnica,
} from "./componentes-configuracion-tecnica";
import type { ResumenConfiguracionTecnica } from "./modelo-configuracion-tecnica";
import { SeccionConfigurarAutomatizacionBase } from "./seccion-configurar-automatizacion-base";
import { SeccionConfigurarDestinosTenant } from "./seccion-configurar-destinos-tenant";

export function EditorConfiguracionTecnica({
  organizacionId,
  tenantQlik,
  cantidadDestinos,
  resumen,
  onCerrar,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
  cantidadDestinos: number;
  resumen: ResumenConfiguracionTecnica;
  onCerrar: () => void;
}) {
  return (
    <article className="rounded-xl border border-line-200 bg-surface">
      <div className="flex flex-col gap-3 rounded-t-xl border-b border-line-200 bg-app/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
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
          <EstadoConfiguracionTecnica listo={resumen.lista} />
        </div>
        {resumen.lista && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1.5"
            onClick={onCerrar}
          >
            <Icon name="x" size="sm" />
            Cerrar edición
          </Button>
        )}
      </div>

      {!resumen.lista && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
          Completa los elementos pendientes para habilitar la creación de
          automatizaciones.
        </div>
      )}

      <div className="space-y-4 rounded-b-xl bg-app/15 p-4 sm:p-5">
        <BloqueConfiguracion
          numero="1"
          titulo="Plantillas por modo"
          lista={resumen.tienePlantilla}
          descripcion="Elige el molde específico para procesos Spark/Python y para procesos SFTP/Talend."
        >
          <SeccionConfigurarAutomatizacionBase
            organizacionId={organizacionId}
            tenantQlik={tenantQlik}
          />
        </BloqueConfiguracion>
        <BloqueConfiguracion
          numero="2"
          titulo="Conexiones de destino"
          lista={resumen.tieneDestino}
          descripcion="Administra los recursos donde las automatizaciones escribirán sus resultados."
        >
          <SeccionConfigurarDestinosTenant
            organizacionId={organizacionId}
            tenantQlik={tenantQlik}
            cantidadExistentes={cantidadDestinos}
          />
        </BloqueConfiguracion>
      </div>
    </article>
  );
}

function BloqueConfiguracion({
  numero,
  titulo,
  lista,
  descripcion,
  children,
}: {
  numero: string;
  titulo: string;
  lista: boolean;
  descripcion: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line-200 bg-surface">
      <div className="rounded-t-xl border-b border-line-200 bg-app/30 px-4 py-3 sm:px-5">
        <CabeceraBloqueConfiguracion
          numero={numero}
          titulo={titulo}
          lista={lista}
          descripcion={descripcion}
        />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
