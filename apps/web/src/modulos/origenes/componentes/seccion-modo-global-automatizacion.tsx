import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import {
  obtenerModoGlobalAutomatizacion,
  guardarModoGlobalAutomatizacion,
} from "@/modulos/admin/api";
import type { ModoPlantilla } from "@/modulos/admin/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const MODO_1_LABEL = "Modo 1 — Dataflow Spark/Python";
const MODO_2_LABEL = "Modo 2 — Dataflow → SFTP → Talend";

export function SeccionModoGlobalAutomatizacion() {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["modo-global-automatizacion"],
    queryFn: obtenerModoGlobalAutomatizacion,
  });

  const guardar = useMutation({
    mutationFn: (modo: ModoPlantilla) =>
      guardarModoGlobalAutomatizacion(modo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modo-global-automatizacion"] });
      mostrarExito("Modo global actualizado");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const modoActivo: ModoPlantilla = data?.modoAutomatizacionActivo ?? 1;

  const handleCambiarModo = (modo: ModoPlantilla) => {
    if (modo === modoActivo) return;
    const confirmado = window.confirm(
      "Este cambio afecta SOLO automatizaciones NUEVAS de todos los tenants y NO modifica los clones existentes.",
    );
    if (confirmado) {
      guardar.mutate(modo);
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-xl border border-line-200 bg-surface p-5 shadow-sm">
        <p className="text-sm text-ink-500">Cargando modo global…</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-line-200 bg-surface p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-ink-900">
        Modo de automatización global
      </h2>
      <p className="mb-4 text-xs text-ink-500">
        Este cambio afecta SOLO automatizaciones NUEVAS de todos los tenants y NO
        modifica los clones existentes.
      </p>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="modo-global"
            value={1}
            checked={modoActivo === 1}
            onChange={() => handleCambiarModo(1)}
            className="h-4 w-4 text-brand-600 border-line-300 focus:ring-brand-500"
          />
          <span className="text-sm font-medium text-ink-800">
            {MODO_1_LABEL}
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="modo-global"
            value={2}
            checked={modoActivo === 2}
            onChange={() => handleCambiarModo(2)}
            className="h-4 w-4 text-brand-600 border-line-300 focus:ring-brand-500"
          />
          <span className="text-sm font-medium text-ink-800">
            {MODO_2_LABEL}
          </span>
        </label>
      </div>
    </section>
  );
}
