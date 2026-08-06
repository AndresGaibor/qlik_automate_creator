import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { CamposCatalogoJdbc } from "./campos-catalogo-jdbc";
import { CamposCatalogoSftp } from "./campos-catalogo-sftp";
import {
  type ConexionOrigen,
  ETIQUETA_TIPO,
  type EstadoFormularioOrigen,
} from "./modelo-catalogo-origen";

interface Props {
  estado: EstadoFormularioOrigen;
  conexiones: ConexionOrigen[];
  duplicada: boolean;
  guardando: boolean;
  actualizar: <K extends keyof EstadoFormularioOrigen>(
    campo: K,
    valor: EstadoFormularioOrigen[K],
  ) => void;
  onGuardar: () => void;
}

export function FormularioCatalogoOrigen({
  estado,
  conexiones,
  duplicada,
  guardando,
  actualizar,
  onGuardar,
}: Props) {
  const conexionEditando = conexiones.find(
    (conexion) => conexion.id === estado.conexionEditandoId,
  );

  return (
    <form
      className="space-y-4 rounded-xl border border-line-200 bg-surface p-5 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault();
        onGuardar();
      }}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-ink-900">
          Configurar conexión
        </h2>
        <span className="text-xs text-ink-500">
          Puedes reutilizarla en todos los Dataflows de la organización.
        </span>
      </div>
      {estado.nombre ? (
        <>
          <div className="rounded-md border border-line-200 bg-app/40 px-3 py-2">
            <span className="block text-xs font-semibold text-ink-700">
              Conexión detectada en el Dataflow
            </span>
            <span className="mt-1 block break-all text-sm font-medium text-ink-900">
              {estado.nombre}
            </span>
            <span className="mt-1 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-800">
              {ETIQUETA_TIPO[estado.tipo]}
            </span>
          </div>
          {duplicada && (
            <p className="text-xs font-medium text-brand-700">
              Esta conexión ya está registrada. Selecciona Editar para
              actualizarla.
            </p>
          )}
          {estado.tipo === "jdbc" ? (
            <CamposCatalogoJdbc
              estado={estado}
              conexionEditando={conexionEditando}
              actualizar={actualizar}
            />
          ) : (
            <CamposCatalogoSftp
              estado={estado}
              conexionEditando={conexionEditando}
              actualizar={actualizar}
            />
          )}
          <Button
            type="submit"
            disabled={guardando || duplicada}
            className="w-full gap-1.5"
          >
            <Icon name="plus" size="sm" />
            {guardando
              ? "Guardando..."
              : estado.conexionEditandoId
                ? "Guardar cambios"
                : duplicada
                  ? "Conexión ya registrada"
                  : "Guardar conexión"}
          </Button>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-line-300 bg-app/30 px-4 py-5 text-sm text-ink-600">
          Regresa a un Dataflow y selecciona una conexión detectada para
          configurarla. Así el nombre siempre coincidirá con Qlik.
        </div>
      )}
    </form>
  );
}
