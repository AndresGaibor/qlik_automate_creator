import { Icon } from "@/compartido/componentes/ui/icon";
import { Link } from "@tanstack/react-router";

export function EncabezadoNuevaAutomatizacion() {
  return (
    <>
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-2 text-sm"
      >
        <Link
          to="/automatizaciones"
          className="font-medium text-ink-500 hover:text-ink-900"
        >
          Automatizaciones
        </Link>
        <Icon name="chev" size="sm" className="rotate-180 text-ink-300" />
        <span className="font-medium text-ink-800">Nueva</span>
      </nav>
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          Crear automatización
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-500">
          Conecta un Dataflow con su destino. La plataforma clonará la plantilla
          y preparará la automatización en Qlik Cloud.
        </p>
      </div>
    </>
  );
}
