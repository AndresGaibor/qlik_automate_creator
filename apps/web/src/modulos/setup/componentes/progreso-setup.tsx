import { PASOS_SETUP, type PasoSetup } from "../modelo-setup";

interface Props {
  paso: PasoSetup;
}

export function ProgresoSetup({ paso }: Props) {
  const pasoActual = PASOS_SETUP[paso - 1];
  return (
    <div
      aria-label={`Paso ${paso} de ${PASOS_SETUP.length}`}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-xs font-medium text-ink-600">
        <span>Progreso</span>
        <span>
          {paso} de {PASOS_SETUP.length}
        </span>
      </div>
      <div
        aria-valuemax={PASOS_SETUP.length}
        aria-valuemin={1}
        aria-valuenow={paso}
        aria-valuetext={`Paso ${paso} de ${PASOS_SETUP.length}: ${pasoActual.titulo}`}
        className="h-2 overflow-hidden rounded-sm bg-line-200"
        role="progressbar"
        tabIndex={0}
      >
        <div
          className="h-full bg-brand-600 transition-[width]"
          style={{ width: `${(paso / PASOS_SETUP.length) * 100}%` }}
        />
      </div>
      <ol
        className="grid grid-cols-3 gap-2"
        aria-label="Pasos de configuración"
      >
        {PASOS_SETUP.map((item) => (
          <li
            key={item.numero}
            aria-current={paso === item.numero ? "step" : undefined}
            className={paso === item.numero ? "text-ink-900" : "text-ink-500"}
          >
            <span className="block text-xs font-semibold">
              {item.numero}. {item.titulo}
            </span>
            <span className="hidden text-xs sm:block">{item.descripcion}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
