import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { Link } from "@tanstack/react-router";
import type { DetalleRecursoDestino } from "../api";
import {
  explicarTipoDato,
  nombreCompletoRecurso,
} from "../modelo-presentacion";

export interface DetalleReporteProps {
  recursoId: string | null;
  detalle?: DetalleRecursoDestino;
  cargando: boolean;
}

export function DetalleReporte({
  recursoId,
  detalle,
  cargando,
}: DetalleReporteProps) {
  if (!recursoId) return <EstadoSinSeleccion />;
  if (cargando) return <EstadoCargandoDetalle />;
  if (!detalle) return <EstadoDetalleNoDisponible />;

  return (
    <section aria-live="polite" className="min-w-0 space-y-5">
      <Card className="border-line-200 bg-surface shadow-card">
        <CardHeader className="border-b border-line-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600">
                <Icon name="db" size="md" />
              </div>
              <div className="min-w-0">
                <CardTitle className="truncate font-mono text-lg text-ink-900">
                  {nombreCompletoRecurso(detalle)}
                </CardTitle>
                <p className="mt-1 text-sm text-ink-500">
                  Recurso de datos disponible para automatizaciones
                </p>
              </div>
            </div>
            <Link
              to="/automatizaciones/nueva"
              search={{ flujoId: "", tablaId: recursoId }}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              <Icon name="zap" size="sm" />
              Usar en automatización
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metrica
              etiqueta="Registros"
              valor={
                detalle.totalFilas === undefined
                  ? "No disponible"
                  : detalle.totalFilas.toLocaleString("es-EC")
              }
            />
            <Metrica
              etiqueta="Campos"
              valor={`${detalle.columnas?.length ?? 0}`}
            />
            <Metrica
              etiqueta="Actualizado"
              valor={formatearFecha(detalle.actualizadoEn)}
            />
          </div>

          <div className="rounded-lg border border-info-200 bg-info-50 p-3 text-sm text-info-900">
            <strong>Vista de solo lectura.</strong> Esta pantalla refleja los
            metadatos que devuelve el destino. No crea, edita ni aprueba tablas.
          </div>
        </CardContent>
      </Card>

      <TablaColumnas columnas={detalle.columnas ?? []} />
    </section>
  );
}

function Metrica({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-lg border border-line-200 bg-surface-subtle p-3">
      <span className="block text-xs font-medium text-ink-500">{etiqueta}</span>
      <span className="mt-1 block text-lg font-semibold text-ink-900">
        {valor}
      </span>
    </div>
  );
}

function TablaColumnas({
  columnas,
}: {
  columnas: Array<{ nombre: string; tipo: string }>;
}) {
  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-100">
        <CardTitle className="flex items-center gap-2 text-sm text-ink-900">
          <Icon name="grid" size="sm" className="text-brand-600" />
          Campos del reporte ({columnas.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {columnas.length === 0 ? (
          <p className="p-5 text-sm text-ink-500">
            El destino no devolvió información de columnas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line-200 bg-surface-subtle text-ink-500">
                <tr>
                  <th className="px-4 py-2.5">Campo</th>
                  <th className="px-4 py-2.5">Tipo técnico</th>
                  <th className="px-4 py-2.5">Significado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-100">
                {columnas.map((columna) => (
                  <tr key={columna.nombre}>
                    <td className="px-4 py-2.5 font-mono font-medium text-ink-900">
                      {columna.nombre}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-brand-700">
                      {columna.tipo}
                    </td>
                    <td className="px-4 py-2.5 text-ink-500">
                      {explicarTipoDato(columna.tipo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EstadoSinSeleccion() {
  return (
    <Card className="flex min-h-[310px] flex-col items-center justify-center border-line-200 bg-surface px-6 py-12 text-center shadow-card">
      <Icon name="db" size="lg" className="text-ink-300" />
      <p className="mt-4 text-base font-semibold text-ink-700">
        Selecciona un reporte para consultar sus metadatos
      </p>
      <p className="mt-2 max-w-md text-sm text-ink-500">
        La vista muestra únicamente información entregada por el destino.
      </p>
    </Card>
  );
}

function EstadoCargandoDetalle() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-line-200 bg-surface text-sm text-ink-500">
      Cargando metadatos del reporte…
    </div>
  );
}

function EstadoDetalleNoDisponible() {
  return (
    <div className="rounded-lg border border-warning-200 bg-warning-50 p-5 text-sm text-warning-900">
      El destino no devolvió el detalle de este reporte.
    </div>
  );
}

function formatearFecha(valor: string): string {
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime())
    ? "No disponible"
    : fecha.toLocaleString("es-EC", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}
