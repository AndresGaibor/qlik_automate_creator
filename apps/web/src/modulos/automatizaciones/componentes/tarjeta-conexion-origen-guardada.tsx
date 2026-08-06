import { Button } from "@/compartido/componentes/ui/button";
import type { RequisitoConexionOrigen } from "@qlik/contratos/automatizaciones";

interface Props {
  requisito: RequisitoConexionOrigen;
  puedeAdministrar: boolean;
  probando: boolean;
  onProbar(id: string): void;
}

const ETIQUETA_TIPO = {
  jdbc: "Base de datos PostgreSQL",
  sftp: "Servidor SFTP",
} as const;

const ETIQUETA_ESTADO = {
  sin_probar: "Sin probar",
  disponible: "Disponible",
  error: "Con error",
  faltante: "No configurada",
} as const;

export function TarjetaConexionOrigenGuardada({
  requisito,
  puedeAdministrar,
  probando,
  onProbar,
}: Props) {
  const esError = requisito.estado === "error";
  const etiquetaAccion = esError
    ? "Volver a probar"
    : "Probar conexión guardada";
  const fecha = requisito.probadaEn
    ? new Intl.DateTimeFormat("es-EC", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(requisito.probadaEn))
    : "Nunca probada";
  const conexionId = requisito.conexionId;

  return (
    <section className="rounded-lg border border-line-200 bg-app/30 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Conexión guardada
          </p>
          <h3 className="mt-1 break-all text-sm font-semibold text-ink-900">
            {requisito.nombre}
          </h3>
          <p className="mt-1 text-xs text-ink-500">
            {ETIQUETA_TIPO[requisito.tipo]}
          </p>
        </div>
        <span
          className={
            requisito.estado === "disponible"
              ? "rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700"
              : requisito.estado === "error"
                ? "rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-danger-600"
                : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
          }
        >
          {ETIQUETA_ESTADO[requisito.estado]}
        </span>
      </div>

      <p className="mt-3 text-xs text-ink-500">Última prueba: {fecha}</p>
      {requisito.mensaje && (
        <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-xs text-danger-700">
          {requisito.mensaje}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={!conexionId || probando}
          onClick={() => {
            if (conexionId) onProbar(conexionId);
          }}
        >
          {probando ? "Probando…" : etiquetaAccion}
        </Button>
        {puedeAdministrar && conexionId && (
          <a
            href={`/configuracion#conexion-origen-${conexionId}`}
            className="text-sm font-semibold text-brand-700 hover:underline"
          >
            Editar en Configuración
          </a>
        )}
      </div>
    </section>
  );
}
