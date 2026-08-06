import type {
  ConexionOrigen,
  EstadoFormularioOrigen,
} from "./modelo-catalogo-origen";

const claseCampo =
  "w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none";

interface Props {
  estado: EstadoFormularioOrigen;
  conexionEditando?: ConexionOrigen;
  actualizar: <K extends keyof EstadoFormularioOrigen>(
    campo: K,
    valor: EstadoFormularioOrigen[K],
  ) => void;
}

export function CamposCatalogoJdbc({
  estado,
  conexionEditando,
  actualizar,
}: Props) {
  const tieneSecreto =
    conexionEditando?.secretoConfigurado ??
    Boolean(conexionEditando?.config.secreto_nombre);
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
        <div>
          <label
            htmlFor="servidor-jdbc"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Servidor
          </label>
          <input
            id="servidor-jdbc"
            required
            value={estado.servidorJdbc}
            onChange={(event) => actualizar("servidorJdbc", event.target.value)}
            placeholder="postgres.miempresa.com"
            className={claseCampo}
          />
        </div>
        <div>
          <label
            htmlFor="puerto-jdbc"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Puerto
          </label>
          <input
            id="puerto-jdbc"
            required
            type="number"
            value={estado.puertoJdbc}
            onChange={(event) =>
              actualizar("puertoJdbc", Number(event.target.value))
            }
            className={claseCampo}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="base-jdbc"
          className="mb-1.5 block text-xs font-semibold text-ink-700"
        >
          Base de datos
        </label>
        <input
          id="base-jdbc"
          required
          value={estado.baseDatosJdbc}
          onChange={(event) => actualizar("baseDatosJdbc", event.target.value)}
          placeholder="ventas"
          className={claseCampo}
        />
      </div>
      {tieneSecreto ? (
        <div className="rounded-md border border-line-200 bg-app/40 px-3 py-2">
          <span className="text-xs font-medium text-ink-600">
            Secreto configurado
          </span>
        </div>
      ) : (
        <div>
          <label
            htmlFor="secreto-jdbc"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Valor secreto (usuario:clave)
          </label>
          <input
            id="secreto-jdbc"
            required
            value={estado.valorSecretoJdbc}
            onChange={(event) =>
              actualizar("valorSecretoJdbc", event.target.value)
            }
            placeholder="usuario:clave"
            className={claseCampo}
          />
        </div>
      )}
    </>
  );
}
