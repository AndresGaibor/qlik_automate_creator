import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";

export function ResumenDestinosTenant({
  cantidad,
  abierto,
  onAlternar,
}: {
  cantidad: number;
  abierto: boolean;
  onAlternar: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line-200 bg-app/25 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-obj-50 text-obj-700">
          <Icon name="db" size="sm" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900">
            {cantidad}{" "}
            {cantidad === 1 ? "destino configurado" : "destinos configurados"}
          </p>
          <p className="mt-0.5 text-xs text-ink-500">
            PostgreSQL, SFTP e Impala pueden reutilizarse en nuevos procesos.
          </p>
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant={abierto ? "ghost" : "outline"}
        aria-expanded={abierto}
        className="shrink-0 gap-1.5"
        onClick={onAlternar}
      >
        <Icon name={abierto ? "x" : "plus"} size="sm" />
        {abierto
          ? "Cerrar formulario"
          : cantidad > 0
            ? "Agregar otro destino"
            : "Agregar destino"}
      </Button>
    </div>
  );
}
