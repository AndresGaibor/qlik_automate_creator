import { Icon } from "@/compartido/componentes/ui/icon";

export function EstadoAccesoRecursoQlik() {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-center shadow-card">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-red-100 text-danger-600">
        <Icon name="shield" size="md" />
      </div>
      <h1 className="mt-4 font-display text-xl font-semibold text-ink-900">
        No tienes acceso a este recurso
      </h1>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-ink-600">
        El recurso pertenece a un espacio de Qlik Cloud que no está autorizado
        para tu cuenta.
      </p>
    </section>
  );
}
