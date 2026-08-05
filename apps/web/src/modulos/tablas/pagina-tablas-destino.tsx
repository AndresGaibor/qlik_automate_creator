import { clienteApi } from "@/compartido/api/cliente";
import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import {
  type ConexionDestino,
  type RecursoDestino,
  type TipoDestino,
  obtenerAutomatizaciones,
  obtenerConexionesDestino,
  obtenerDetalleRecursoDestino,
  obtenerRecursosDestino,
  type TablaImpala,
  obtenerTablasImpala,
} from "@/modulos/automatizaciones/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export interface DetalleRecurso {
  baseDatos: string;
  tabla: string;
  totalFilas: number;
  columnas: Array<{ nombre: string; tipo: string }>;
  actualizadoEn: string;
}

type DetalleTablaImpala = DetalleRecurso;

const ETIQUETA_TIPO: Record<TipoDestino, string> = {
  impala: "Impala",
  postgres: "PostgreSQL",
  bigquery: "BigQuery",
  sftp: "SFTP",
};

export function PaginaTablasDestino() {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const [tablaSeleccionada, setTablaSeleccionada] = useState<string | null>(
    null,
  );
  const [conexionSeleccionada, setConexionSeleccionada] =
    useState<string | null>(null);
  const [modalCrearTabla, setModalCrearTabla] = useState(false);
  const [nombreNuevaTabla, setNombreNuevaTabla] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // 0. Obtener sesión de usuario para verificar si es Admin
  const { data: sesion } = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
  });

  const esAdmin =
    Boolean(sesion?.esSuperadmin) ||
    sesion?.membresias?.some((m) => m.rol === "admin") ||
    false;

  // La ruta heredada sigue siendo fallback mientras se migran las conexiones.
  const { data: conexiones = [], isLoading: cargandoConexiones } = useQuery<
    ConexionDestino[]
  >({
    queryKey: ["destinos-conexiones"],
    queryFn: obtenerConexionesDestino,
    retry: false,
  });

  const conexionActiva = conexiones.find((c) => c.id === conexionSeleccionada) ?? conexiones[0];

  const { data: recursosGenericos = [], isLoading: cargandoRecursos } =
    useQuery<RecursoDestino[]>({
      queryKey: ["destinos-recursos", conexionActiva?.id],
      queryFn: () => obtenerRecursosDestino(conexionActiva?.id ?? ""),
      enabled: Boolean(conexionActiva),
      retry: false,
    });

  // Fallback temporal para tenants que todavía solo tienen configuración Impala heredada.
  const {
    data: tablas = [],
    isLoading: cargandoTablas,
    isError,
    error,
  } = useQuery<TablaImpala[]>({
    queryKey: ["impala-tablas"],
    queryFn: obtenerTablasImpala,
    retry: false,
    enabled: !conexionActiva,
  });

  const recursos: RecursoDestino[] = conexionActiva
    ? recursosGenericos
    : tablas.map((tabla) => ({
        id: tabla.nombre,
        nombre: tabla.nombre,
        tipo: "tabla" as const,
        espacioDeNombres: "default",
        metadatos: {},
      }));

  // 2. Obtener automatizaciones vinculadas
  const { data: automatizaciones = [] } = useQuery({
    queryKey: ["automatizaciones"],
    queryFn: obtenerAutomatizaciones,
  });

  // 3. Obtener esquema y metadatos de la tabla seleccionada
  const { data: detalleTabla, isLoading: cargandoDetalle } =
    useQuery<DetalleTablaImpala>({
      queryKey: ["destino-recurso-detalle", conexionActiva?.id, tablaSeleccionada],
      queryFn: () => {
        if (!tablaSeleccionada) throw new Error("Selecciona una tabla");
        if (conexionActiva) {
          return obtenerDetalleRecursoDestino(conexionActiva.id, tablaSeleccionada).then(
            (recurso) => ({
              baseDatos: recurso.espacioDeNombres ?? conexionActiva.nombre,
              tabla: recurso.nombre,
              totalFilas: recurso.totalFilas ?? 0,
              columnas: recurso.columnas ?? [],
              actualizadoEn: recurso.actualizadoEn,
            }),
          );
        }
        return clienteApi.get<DetalleTablaImpala>(
          `/destinos/bases-datos/default/tablas/${encodeURIComponent(tablaSeleccionada)}/detalle`,
        );
      },
      enabled: Boolean(tablaSeleccionada) && (!conexionActiva || Boolean(conexionActiva.id)),
    });

  // Solicitud de Aprobación para Crear/Editar Tabla
  const mutationSolicitarCrear = useMutation({
    mutationFn: async (nombre: string) => {
      // Simula el flujo de control y solicitud de autorización para el Administrador
      return {
        solicitudId: crypto.randomUUID(),
        nombre,
        estado: "Pendiente_Aprobacion",
      };
    },
    onSuccess: (data) => {
      mostrarExito(
        `Solicitud de creación para la tabla "${data.nombre}" enviada a Aprobación del Administrador.`,
      );
      setModalCrearTabla(false);
      setNombreNuevaTabla("");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const tablasFiltradas = recursos.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  if (cargandoConexiones || cargandoRecursos || (!conexionActiva && cargandoTablas)) {
    return (
      <EstadoCarga mensaje="Conectando al catálogo de destinos..." />
    );
  }

  if (isError) {
    return (
      <EstadoError
        mensaje={
          (error as Error)?.message ||
          "Error al conectar con el catálogo de Impala"
        }
        onReintentar={() =>
          queryClient.invalidateQueries({ queryKey: ["impala-tablas"] })
        }
      />
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Resultados en Impala"
        description="Consulta las tablas destino donde llegan tus datos ya procesados desde Qlik Automate: cuántos registros hay, qué campos incluyen y quién hizo cambios."
        actions={
          <Button
            onClick={() => {
              if (esAdmin) {
                mostrarExito(
                  "Modo Administrador: Abriendo editor para nuevo reporte",
                );
              }
              setModalCrearTabla(true);
            }}
            className="gap-1.5 bg-brand-600 hover:bg-brand-700 text-white"
          >
            <Icon name="plus" size="sm" />
            {esAdmin ? "Crear nuevo reporte" : "Solicitar un nuevo reporte"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8">
        {/* Panel Izquierdo: Lista de Tablas */}
        <section
          aria-labelledby="lista-reportes"
          className="space-y-3 lg:sticky lg:top-24"
        >
          <div className="flex items-center justify-between px-1">
            <div>
              <h2
                id="lista-reportes"
                className="text-sm font-semibold text-slate-900"
              >
                Reportes disponibles
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {tablasFiltradas.length}{" "}
                {tablasFiltradas.length === 1 ? "reporte" : "reportes"}
              </p>
            </div>
            {conexiones.length > 0 ? (
              <select
                value={conexionActiva?.id ?? ""}
                onChange={(e) => {
                  setConexionSeleccionada(e.target.value);
                  setTablaSeleccionada(null);
                }}
                aria-label="Seleccionar conexión de destino"
                className="max-w-[150px] rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 outline-none"
              >
                {conexiones.map((conexion) => (
                  <option key={conexion.id} value={conexion.id}>
                    {conexion.nombre} · {ETIQUETA_TIPO[conexion.tipo]}
                  </option>
                ))}
              </select>
            ) : (
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                Impala heredado
              </span>
            )}
          </div>

          <label className="relative block">
            <Icon
              name="search"
              size="sm"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar un reporte…"
              aria-label="Buscar un reporte"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </label>

          <div className="max-h-[650px] space-y-2 overflow-y-auto pr-1">
            {tablasFiltradas.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-400">
                No se encontraron reportes.
              </div>
            ) : (
              tablasFiltradas.map((t) => {
                const seleccionada = tablaSeleccionada === t.id;
                const autoVinculada = automatizaciones.find((a) =>
                  a.nombre.toLowerCase().includes(t.nombre.toLowerCase()),
                );

                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setTablaSeleccionada(t.id)}
                    aria-pressed={seleccionada}
                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                      seleccionada
                        ? "border-brand-500 bg-brand-50/60 shadow-sm ring-4 ring-brand-100"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Icon
                          name="db"
                          size="sm"
                          className={
                            seleccionada
                              ? "text-brand-600"
                              : "text-slate-400 group-hover:text-brand-500"
                          }
                        />
                        <span className="truncate text-sm font-semibold text-slate-900">
                          {t.nombre}
                        </span>
                      </div>
                      {autoVinculada && (
                        <span
                          className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"
                          title="En automatización activa"
                        />
                      )}
                    </div>
                    {autoVinculada && (
                      <div className="mt-2 flex items-center gap-1.5 truncate text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span className="truncate">
                          Conectado a {autoVinculada.nombre}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Panel Derecho: Detalle, Esquema de Columnas y Auditoría */}
        <section aria-live="polite" className="min-w-0 space-y-5">
          {!tablaSeleccionada ? (
            <Card className="flex min-h-[310px] flex-col items-center justify-center border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                <Icon name="db" size="lg" className="text-slate-300" />
              </div>
              <p className="text-base font-semibold text-slate-700">
                Selecciona un reporte para explorar sus detalles
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Consulta cantidad de campos, número de registros, permisos e
                historial.
              </p>
            </Card>
          ) : cargandoDetalle ? (
            <div className="p-12 flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              <p className="text-xs text-slate-500 font-medium mt-3">
                Cargando información del reporte...
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Encabezado de la Tabla */}
              <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-brand-100 bg-brand-50 p-3 text-brand-600">
                        <Icon name="db" size="md" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate font-mono text-lg font-bold text-slate-900">
                          {detalleTabla?.baseDatos || "default"}.
                          {tablaSeleccionada}
                        </CardTitle>
                        <p className="mt-0.5 text-sm font-medium text-slate-500">
                          Tabla destino en Impala
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          mostrarExito(
                            esAdmin
                              ? `Modo Admin: Editando reporte ${tablaSeleccionada}`
                              : `Solicitud de edición enviada al Administrador para ${tablaSeleccionada}`,
                          )
                        }
                        className="gap-1 text-xs"
                      >
                        <Icon name="edit" size="sm" />
                        {esAdmin
                          ? "Editar reporte"
                          : "Editar (Requiere Administrador)"}
                      </Button>

                      <Link
                        to="/automatizaciones/nueva"
                        search={{ flujoId: "", tablaId: tablaSeleccionada }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
                      >
                        <Icon name="zap" size="sm" />
                        Usar en automatización
                      </Link>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Cantidad de registros
                      </span>
                      <span className="mt-1 block font-mono text-lg font-bold text-slate-900">
                        {detalleTabla?.totalFilas !== undefined
                          ? detalleTabla.totalFilas.toLocaleString()
                          : "—"}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Cantidad de campos
                      </span>
                      <span className="mt-1 block font-mono text-lg font-bold text-indigo-700">
                        {detalleTabla?.columnas.length || 0} campos
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Permisos de edición
                      </span>
                      {esAdmin ? (
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                          Tienes permiso para editar
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-0.5">
                          Solo un administrador puede editar esto
                        </span>
                      )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Última actualización
                      </span>
                      <span className="mt-1 block font-mono text-sm text-slate-700">
                        {detalleTabla?.actualizadoEn
                          ? new Date(
                              detalleTabla.actualizadoEn,
                            ).toLocaleTimeString()
                          : "—"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Esquema de Columnas */}
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Icon name="grid" size="sm" className="text-brand-600" />
                    Campos del reporte ({detalleTabla?.columnas.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">#</th>
                          <th className="px-4 py-2.5">Nombre Columna</th>
                          <th className="px-4 py-2.5">Tipo de Dato</th>
                          <th className="px-4 py-2.5">Propiedades</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {detalleTabla?.columnas.map((col, idx) => {
                          const tipoUpper = col.tipo.toUpperCase();
                          const explicacionTipo =
                            tipoUpper.includes("STRING") ||
                            tipoUpper.includes("VARCHAR")
                              ? " (Texto)"
                              : tipoUpper.includes("INT")
                                ? " (Número)"
                                : tipoUpper.includes("TIMESTAMP") ||
                                    tipoUpper.includes("DATE")
                                  ? " (Fecha y hora)"
                                  : tipoUpper.includes("DECIMAL") ||
                                      tipoUpper.includes("FLOAT") ||
                                      tipoUpper.includes("DOUBLE")
                                    ? " (Número con decimales)"
                                    : tipoUpper.includes("BOOL")
                                      ? " (Sí / No)"
                                      : "";

                          return (
                            <tr
                              key={col.nombre}
                              className="hover:bg-slate-50/60"
                            >
                              <td className="px-4 py-2.5 text-slate-400 font-sans">
                                {idx + 1}
                              </td>
                              <td className="px-4 py-2.5 font-semibold text-slate-900">
                                {col.nombre}
                              </td>
                              <td className="px-4 py-2.5 text-brand-600 font-bold">
                                {col.tipo}
                                <span className="font-sans font-normal text-slate-500 text-[11px]">
                                  {explicacionTipo}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-slate-500 font-sans text-[11px]">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                                  OPCIONAL
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Auditoría y Trazabilidad */}
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Icon name="shield" size="sm" className="text-brand-600" />
                    Historial de cambios y permisos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 flex items-start gap-2.5">
                    <Icon
                      name="zap"
                      size="sm"
                      className="text-amber-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="leading-relaxed font-medium text-[11px]">
                        Crear, editar o borrar un reporte necesita la aprobación
                        de un administrador. Todos los cambios quedan guardados
                        en un historial que no se puede modificar, para tu
                        seguridad.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-semibold text-slate-700">
                      Historial de cambios:
                    </h5>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-900">
                            Reporte creado
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            Por: Administrador Qlik · 24/07/2026 18:17:31
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Aprobado
                        </span>
                      </div>

                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-900">
                            Consulta de datos
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            Por: Usuario Activo · Hace un momento
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                          Permitida
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </div>

      {/* Modal Solicitar Crear Tabla */}
      {modalCrearTabla && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-slate-900 flex items-center gap-2">
                <Icon name="plus" size="sm" className="text-brand-600" />
                Solicitar Nueva Tabla Impala
              </h3>
              <button
                type="button"
                onClick={() => setModalCrearTabla(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="x" size="sm" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label
                htmlFor="nombre-nueva-tabla"
                className="block font-semibold text-slate-700"
              >
                Nombre de la nueva tabla:
              </label>
              <input
                id="nombre-nueva-tabla"
                type="text"
                value={nombreNuevaTabla}
                onChange={(e) => setNombreNuevaTabla(e.target.value)}
                placeholder="Ej. ventas_resumen_mensual"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-slate-500 leading-relaxed">
                ℹ️ Al enviar esta solicitud, se enviará una notificación de
                autorización al Administrador para su aprovisionamiento en
                Impala.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalCrearTabla(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                disabled={
                  !nombreNuevaTabla.trim() || mutationSolicitarCrear.isPending
                }
                onClick={() =>
                  mutationSolicitarCrear.mutate(nombreNuevaTabla.trim())
                }
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                Enviar a Autorización
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
