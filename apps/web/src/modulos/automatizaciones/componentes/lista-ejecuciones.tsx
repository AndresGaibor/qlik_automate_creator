import { Card, CardContent, CardHeader, CardTitle } from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type { EjecucionResumen } from "@/modulos/automatizaciones/api";

interface Props {
  ejecuciones: EjecucionResumen[];
}

export function ListaEjecuciones({ ejecuciones }: Props) {
  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg font-semibold text-ink-900">
            Historial de Ejecuciones
          </CardTitle>
          <span className="text-xs text-ink-400 font-mono">
            {ejecuciones.length} {ejecuciones.length === 1 ? "ejecución" : "ejecuciones"} registradas
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!ejecuciones || ejecuciones.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink-400">
            Esta automatización aún no ha sido ejecutada. Haz clic en «Ejecutar ahora» para iniciarla.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-line-200 bg-app/60 text-ink-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">ID de ejecución</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold">Inicio</th>
                  <th className="py-3 px-4 font-semibold">Fin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-200">
                {ejecuciones.map((ejecucion: EjecucionResumen) => {
                  const finalizado = ejecucion.estado === "finished" || ejecucion.estado === "completed";
                  const fallido = ejecucion.estado === "failed" || ejecucion.estado === "error";
                  const enCurso = ejecucion.estado === "running" || ejecucion.estado === "queued";

                  return (
                    <tr key={ejecucion.id} className="hover:bg-hover transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-ink-700 font-medium">
                        {ejecucion.id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            finalizado
                              ? "bg-brand-50 text-brand-700"
                              : fallido
                                ? "bg-red-50 text-danger-600"
                                : enCurso
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-ink-100 text-ink-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              finalizado
                                ? "bg-brand-600"
                                : fallido
                                  ? "bg-danger-600"
                                  : enCurso
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-ink-400"
                            }`}
                          />
                          {ejecucion.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-ink-700">
                        {formatearFechaYHora(ejecucion.iniciadoEn)}
                      </td>
                      <td className="py-3 px-4 text-xs text-ink-700 font-mono">
                        {ejecucion.finalizadoEn
                          ? formatearFechaYHora(ejecucion.finalizadoEn)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
