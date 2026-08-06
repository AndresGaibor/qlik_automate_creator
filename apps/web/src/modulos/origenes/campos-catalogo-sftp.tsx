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

export function CamposCatalogoSftp({
  estado,
  conexionEditando,
  actualizar,
}: Props) {
  const tieneSecreto =
    conexionEditando?.secretoConfigurado ??
    Boolean(conexionEditando?.config.secreto_clave_privada_nombre);
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="host-sftp"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Servidor
          </label>
          <input
            id="host-sftp"
            required
            value={estado.host}
            onChange={(event) => actualizar("host", event.target.value)}
            className={claseCampo}
          />
        </div>
        <div>
          <label
            htmlFor="puerto-sftp"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Puerto
          </label>
          <input
            id="puerto-sftp"
            required
            type="number"
            value={estado.puerto}
            onChange={(event) =>
              actualizar("puerto", Number(event.target.value))
            }
            className={claseCampo}
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="usuario-sftp"
          className="mb-1.5 block text-xs font-semibold text-ink-700"
        >
          Usuario
        </label>
        <input
          id="usuario-sftp"
          required
          value={estado.usuario}
          onChange={(event) => actualizar("usuario", event.target.value)}
          className={claseCampo}
        />
      </div>
      <div>
        <label
          htmlFor="ruta-sftp"
          className="mb-1.5 block text-xs font-semibold text-ink-700"
        >
          Carpeta de salida
        </label>
        <input
          id="ruta-sftp"
          required
          value={estado.rutaBase}
          onChange={(event) => actualizar("rutaBase", event.target.value)}
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
            htmlFor="secreto-sftp"
            className="mb-1.5 block text-xs font-semibold text-ink-700"
          >
            Llave privada (contenido PEM)
          </label>
          <textarea
            id="secreto-sftp"
            required
            value={estado.valorSecretoClavePrivada}
            onChange={(event) =>
              actualizar("valorSecretoClavePrivada", event.target.value)
            }
            placeholder="-----BEGIN OPENSSH PRIVATE KEY-----..."
            className={`${claseCampo} min-h-[80px] resize-y font-mono text-xs`}
            rows={3}
          />
        </div>
      )}
    </>
  );
}
