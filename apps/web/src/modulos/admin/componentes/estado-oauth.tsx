import type { ConfiguracionOauthQlik } from "../api";

export function EstadoOauth({
  configuracion,
  cargando,
}: {
  configuracion?: ConfiguracionOauthQlik;
  cargando: boolean;
}) {
  if (cargando) {
    return (
      <span className="rounded-full border border-line-200 bg-surface px-2.5 py-1 text-xs text-ink-500">
        Consultando…
      </span>
    );
  }

  const origen = configuracion?.origen ?? "sin_configurar";
  const estado = configuracion?.estado;
  const estilos =
    estado === "verificada"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : estado === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : origen === "entorno_global"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-line-200 bg-surface text-ink-600";
  const texto =
    estado === "verificada"
      ? "Verificada"
      : estado === "error"
        ? "Con error"
        : estado === "pendiente"
          ? "Pendiente de verificar"
          : estado === "desactivada"
            ? "Desactivada"
            : origen === "entorno_global"
              ? "Configuración heredada"
              : "Sin configurar";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${estilos}`}
    >
      {texto}
    </span>
  );
}
