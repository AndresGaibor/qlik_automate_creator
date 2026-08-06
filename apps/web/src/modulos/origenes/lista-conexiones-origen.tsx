import { Button } from "@/compartido/componentes/ui/button";
import type { ConexionOrigen } from "./modelo-catalogo-origen";

interface Props {
  conexiones: ConexionOrigen[];
  cargando: boolean;
  eliminando: boolean;
  onEditar: (conexion: ConexionOrigen) => void;
  onEliminar: (id: string) => void;
}

export function ListaConexionesOrigen({
  conexiones,
  cargando,
  eliminando,
  onEditar,
  onEliminar,
}: Props) {
  return (
    <section className="min-w-0 rounded-xl border border-line-200 bg-surface p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-ink-900">
        Conexiones registradas
      </h2>
      {cargando ? (
        <p className="text-sm text-ink-500">Cargando catálogo...</p>
      ) : conexiones.length ? (
        <div className="space-y-3">
          {conexiones.map((conexion) => (
            <div
              key={conexion.id}
              id={`conexion-origen-${conexion.id}`}
              data-testid={`conexion-origen-${conexion.id}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-line-200 bg-app/30 p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-sm text-ink-900">
                  {conexion.nombre}
                </p>
                <p className="mt-1 break-all font-mono text-xs text-ink-500">
                  {conexion.tipo === "jdbc"
                    ? `Base de datos PostgreSQL: ${String(conexion.config.url)}`
                    : `Servidor SFTP: ${String(conexion.config.usuario)}@${String(conexion.config.host)}:${String(conexion.config.puerto)}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditar(conexion)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={eliminando}
                  onClick={() => onEliminar(conexion.id)}
                  className="text-danger-600 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-500">
          Aún no hay conexiones. Vuelve desde un Dataflow para elegir una
          conexión detectada automáticamente.
        </p>
      )}
    </section>
  );
}
