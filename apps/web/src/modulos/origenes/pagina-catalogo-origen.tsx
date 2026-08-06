import { clienteApi } from "@/compartido/api/cliente";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SeccionModoGlobalAutomatizacion } from "./componentes/seccion-modo-global-automatizacion";

type TipoConexionOrigen = "jdbc" | "sftp";

const ETIQUETA_TIPO: Record<TipoConexionOrigen, string> = {
  jdbc: "Base de datos PostgreSQL",
  sftp: "Servidor SFTP",
};

interface ConexionSugerida {
  tipo: TipoConexionOrigen;
  nombre: string;
}

interface ConexionOrigen {
  id: string;
  tipo: TipoConexionOrigen;
  nombre: string;
  config: Record<string, unknown>;
}

const claseCampo =
  "w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none";

function crearNombreSecreto(nombre: string, prefijo: string): string {
  const identificador = nombre
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `${prefijo}_${identificador}`;
}

function obtenerConexionesSugeridas(): ConexionSugerida[] {
  const parametros = new URLSearchParams(window.location.search);
  const sugerencias = new Map<string, ConexionSugerida>();

  for (const valor of parametros.getAll("conexion")) {
    const separador = valor.indexOf(":");
    const tipo = valor.slice(0, separador);
    const nombre = valor.slice(separador + 1).trim();
    if ((tipo !== "jdbc" && tipo !== "sftp") || !nombre) continue;
    sugerencias.set(`${tipo}:${nombre}`, { tipo, nombre });
  }

  return Array.from(sugerencias.values());
}

export function PaginaCatalogoOrigen({
  integrada = false,
}: { integrada?: boolean } = {}) {
  const { mostrarError, mostrarExito } = useNotificaciones();
  const queryClient = useQueryClient();
  const [tipo, setTipo] = useState<TipoConexionOrigen>("jdbc");
  const [nombre, setNombre] = useState("");
  const [servidorJdbc, setServidorJdbc] = useState("");
  const [puertoJdbc, setPuertoJdbc] = useState(5432);
  const [baseDatosJdbc, setBaseDatosJdbc] = useState("");
  const [host, setHost] = useState("");
  const [puerto, setPuerto] = useState(22);
  const [usuario, setUsuario] = useState("");
  const [rutaBase, setRutaBase] = useState("/upload");
  const [sugerencias] = useState(obtenerConexionesSugeridas);
  const [conexionEditandoId, setConexionEditandoId] = useState<string | null>(
    null,
  );
  const [valorSecretoJdbc, setValorSecretoJdbc] = useState("");
  const [valorSecretoClavePrivada, setValorSecretoClavePrivada] = useState("");
  const conexiones = useQuery({
    queryKey: ["conexiones-origen"],
    queryFn: () => clienteApi.get<ConexionOrigen[]>("/conexiones-origen"),
  });
  const guardar = useMutation({
    mutationFn: ({
      id,
      entrada,
    }: {
      id: string | null;
      entrada: Record<string, unknown>;
    }) =>
      id
        ? clienteApi.put<ConexionOrigen>(`/conexiones-origen/${id}`, entrada)
        : clienteApi.post<ConexionOrigen>("/conexiones-origen", entrada),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conexiones-origen"] });
      setConexionEditandoId(null);
      mostrarExito("Conexión guardada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });
  const eliminar = useMutation({
    mutationFn: (id: string) => clienteApi.delete(`/conexiones-origen/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conexiones-origen"] });
      mostrarExito("Conexión de origen eliminada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });
  const sugerenciasPendientes = sugerencias.filter(
    (sugerencia) =>
      !conexiones.data?.some(
        (conexion) => conexion.nombre === sugerencia.nombre,
      ),
  );
  const conexionYaRegistrada = Boolean(
    conexiones.data?.some(
      (conexion) =>
        conexion.id !== conexionEditandoId && conexion.nombre === nombre.trim(),
    ),
  );

  function guardarConexion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (conexionYaRegistrada) {
      mostrarError("Esta conexión ya está registrada");
      return;
    }
    const entrada =
      tipo === "jdbc"
        ? {
            tipo,
            nombre: nombre.trim(),
            config: {
              url: `jdbc:postgresql://${servidorJdbc.trim()}:${puertoJdbc}/${baseDatosJdbc.trim()}`,
              driver: "org.postgresql.Driver",
              secreto_nombre: crearNombreSecreto(nombre, "JDBC"),
              propiedades: { fetchsize: "10000" },
              ...(valorSecretoJdbc.trim()
                ? { secretoValor: valorSecretoJdbc.trim() }
                : {}),
            },
          }
        : {
            tipo,
            nombre: nombre.trim(),
            config: {
              host: host.trim(),
              puerto,
              usuario: usuario.trim(),
              secreto_clave_privada_nombre: crearNombreSecreto(
                nombre,
                "SFTP_PRIVATE_KEY",
              ),
              ruta_base: rutaBase.trim(),
              ...(valorSecretoClavePrivada.trim()
                ? {
                    secretoClavePrivadaValor: valorSecretoClavePrivada.trim(),
                  }
                : {}),
            },
          };
    guardar.mutate({ id: conexionEditandoId, entrada });
    setValorSecretoJdbc("");
    setValorSecretoClavePrivada("");
  }

  function seleccionarSugerencia(sugerencia: ConexionSugerida) {
    setConexionEditandoId(null);
    setTipo(sugerencia.tipo);
    setNombre(sugerencia.nombre);
  }

  function editarConexion(conexion: ConexionOrigen) {
    setConexionEditandoId(conexion.id);
    setTipo(conexion.tipo);
    setNombre(conexion.nombre);
    setValorSecretoJdbc("");
    setValorSecretoClavePrivada("");
    if (conexion.tipo === "jdbc") {
      const url = String(conexion.config.url ?? "");
      const coincidencia = url.match(
        /^jdbc:postgresql:\/\/([^:/]+)(?::(\d+))?\/(.+)$/,
      );
      setServidorJdbc(coincidencia?.[1] ?? "");
      setPuertoJdbc(Number(coincidencia?.[2]) || 5432);
      setBaseDatosJdbc(coincidencia?.[3] ?? "");
      return;
    }
    setHost(String(conexion.config.host ?? ""));
    setPuerto(Number(conexion.config.puerto) || 22);
    setUsuario(String(conexion.config.usuario ?? ""));
    setRutaBase(String(conexion.config.ruta_base ?? "/upload"));
  }

  return (
    <PageLayout>
      {!integrada && (
        <PageHeader
          title="Conexiones para automatizaciones"
          description="Selecciona una conexión detectada y completa dónde se encuentran los datos. La configuración técnica se prepara automáticamente."
        />
      )}
      <SeccionModoGlobalAutomatizacion />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-4">
          {sugerenciasPendientes.length > 0 && (
            <section className="rounded-xl border border-brand-200 bg-brand-50 p-4">
              <h2 className="text-sm font-semibold text-brand-900">
                Conexiones detectadas en el Dataflow
              </h2>
              <p className="mt-1 text-xs text-brand-700">
                Selecciona una para usar su nombre exacto en el catálogo.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sugerenciasPendientes.map((sugerencia) => (
                  <button
                    key={`${sugerencia.tipo}:${sugerencia.nombre}`}
                    type="button"
                    onClick={() => seleccionarSugerencia(sugerencia)}
                    className="max-w-full rounded-md border border-brand-300 bg-surface px-3 py-2 text-left text-xs font-medium text-brand-900 transition-colors hover:bg-brand-100"
                  >
                    <span className="mr-1.5 rounded bg-brand-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-brand-800">
                      {ETIQUETA_TIPO[sugerencia.tipo]}
                    </span>
                    <span className="break-all">{sugerencia.nombre}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
          <form
            className="space-y-4 rounded-xl border border-line-200 bg-surface p-5 shadow-sm"
            onSubmit={guardarConexion}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-ink-900">
                Configurar conexión
              </h2>
              <span className="text-xs text-ink-500">
                Puedes reutilizarla en todos los Dataflows de la organización.
              </span>
            </div>
            {nombre ? (
              <>
                <div className="rounded-md border border-line-200 bg-app/40 px-3 py-2">
                  <span className="block text-xs font-semibold text-ink-700">
                    Conexión detectada en el Dataflow
                  </span>
                  <span className="mt-1 block break-all text-sm font-medium text-ink-900">
                    {nombre}
                  </span>
                  <span className="mt-1 inline-block rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-800">
                    {ETIQUETA_TIPO[tipo]}
                  </span>
                </div>
                {conexionYaRegistrada && (
                  <p className="text-xs font-medium text-brand-700">
                    Esta conexión ya está registrada. Selecciona Editar para
                    actualizarla.
                  </p>
                )}
                {tipo === "jdbc" ? (
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
                          value={servidorJdbc}
                          onChange={(e) => setServidorJdbc(e.target.value)}
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
                          value={puertoJdbc}
                          onChange={(e) =>
                            setPuertoJdbc(Number(e.target.value))
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
                        value={baseDatosJdbc}
                        onChange={(e) => setBaseDatosJdbc(e.target.value)}
                        placeholder="ventas"
                        className={claseCampo}
                      />
                    </div>
                    {conexionEditandoId &&
                    (conexiones.data?.find((c) => c.id === conexionEditandoId)
                      ?.config?.secreto_nombre as string | undefined) ? (
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
                          value={valorSecretoJdbc}
                          onChange={(e) => setValorSecretoJdbc(e.target.value)}
                          placeholder="usuario:clave"
                          className={claseCampo}
                        />
                      </div>
                    )}
                  </>
                ) : (
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
                          value={host}
                          onChange={(e) => setHost(e.target.value)}
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
                          value={puerto}
                          onChange={(e) => setPuerto(Number(e.target.value))}
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
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
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
                        value={rutaBase}
                        onChange={(e) => setRutaBase(e.target.value)}
                        className={claseCampo}
                      />
                    </div>
                    {conexionEditandoId &&
                    (conexiones.data?.find((c) => c.id === conexionEditandoId)
                      ?.config?.secreto_clave_privada_nombre as
                      | string
                      | undefined) ? (
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
                          value={valorSecretoClavePrivada}
                          onChange={(e) =>
                            setValorSecretoClavePrivada(e.target.value)
                          }
                          placeholder="-----BEGIN OPENSSH PRIVATE KEY-----..."
                          className={`${claseCampo} min-h-[80px] resize-y font-mono text-xs`}
                          rows={3}
                        />
                      </div>
                    )}
                  </>
                )}
                <Button
                  type="submit"
                  disabled={guardar.isPending || conexionYaRegistrada}
                  className="w-full gap-1.5"
                >
                  <Icon name="plus" size="sm" />
                  {guardar.isPending
                    ? "Guardando..."
                    : conexionEditandoId
                      ? "Guardar cambios"
                      : conexionYaRegistrada
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
        </div>
        <section className="min-w-0 rounded-xl border border-line-200 bg-surface p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-ink-900">
            Conexiones registradas
          </h2>
          {conexiones.isLoading ? (
            <p className="text-sm text-ink-500">Cargando catálogo...</p>
          ) : conexiones.data?.length ? (
            <div className="space-y-3">
              {conexiones.data.map((conexion) => (
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
                      onClick={() => editarConexion(conexion)}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={eliminar.isPending}
                      onClick={() => eliminar.mutate(conexion.id)}
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
      </div>
    </PageLayout>
  );
}
