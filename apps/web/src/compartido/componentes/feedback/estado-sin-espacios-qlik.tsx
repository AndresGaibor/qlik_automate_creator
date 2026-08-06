import { Icon } from "@/compartido/componentes/ui/icon";

export function EstadoSinEspaciosQlik() {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center shadow-card">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-amber-100 text-amber-700">
        <Icon name="shield" size="md" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">
        No tienes espacios de Qlik Cloud habilitados
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-600">
        Solicita al administrador que autorice los espacios necesarios para ver
        Dataflows y automatizaciones.
      </p>
    </section>
  );
}
