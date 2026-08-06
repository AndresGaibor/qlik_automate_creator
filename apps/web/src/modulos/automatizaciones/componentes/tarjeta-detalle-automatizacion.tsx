import type {
  DetalleAutomatizacion,
  EjecucionResumen,
} from "@/modulos/automatizaciones/api";
import { AccionesDetalleAutomatizacion } from "./acciones-detalle-automatizacion";
import { CabeceraDetalleAutomatizacion } from "./cabecera-detalle-automatizacion";
import { MetadatosDetalleAutomatizacion } from "./metadatos-detalle-automatizacion";
import { construirPresentacionDetalleAutomatizacion } from "./modelo-detalle-automatizacion";
import { UltimaEjecucionAutomatizacion } from "./ultima-ejecucion-automatizacion";

interface Props {
  automatizacion: DetalleAutomatizacion["automatizacion"];
  ejecutandoActiva: EjecucionResumen | undefined;
  ultimaEjecucion: EjecucionResumen | undefined;
  urlQlik: string | null;
  onEjecutar: () => void;
  onDetener: (runId: string) => void;
  onClonar: () => void;
  mutationEjecutar: { mutate: () => void; isPending: boolean };
  mutationDetener: { mutate: (runId: string) => void; isPending: boolean };
  mostrarWorkspace?: boolean;
}

export function TarjetaDetalleAutomatizacion({
  automatizacion,
  ejecutandoActiva,
  ultimaEjecucion,
  urlQlik,
  onEjecutar,
  onDetener,
  onClonar,
  mutationEjecutar,
  mutationDetener,
  mostrarWorkspace = true,
}: Props) {
  const presentacion = construirPresentacionDetalleAutomatizacion(
    automatizacion,
    ultimaEjecucion,
    mutationEjecutar.isPending,
  );
  return (
    <section className="overflow-visible rounded-xl border border-line-200 bg-surface shadow-card">
      <CabeceraDetalleAutomatizacion
        espacioNombre={automatizacion.espacioNombre}
        enEjecucion={presentacion.enEjecucion}
        estado={presentacion.estado}
        acciones={
          <AccionesDetalleAutomatizacion
            automatizacion={automatizacion}
            enEjecucion={presentacion.enEjecucion}
            ejecutandoActiva={ejecutandoActiva}
            urlQlik={urlQlik}
            onEjecutar={onEjecutar}
            onDetener={onDetener}
            onClonar={onClonar}
            deteniendo={mutationDetener.isPending}
            mostrarWorkspace={mostrarWorkspace}
          />
        }
      />
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <UltimaEjecucionAutomatizacion
          ejecucion={ultimaEjecucion}
          presentacion={presentacion.ultimaPresentada}
          mensajeError={presentacion.mensajeError}
        />
        <MetadatosDetalleAutomatizacion automatizacion={automatizacion} />
      </div>
    </section>
  );
}
