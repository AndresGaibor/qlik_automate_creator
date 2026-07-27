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
  type TablaImpala,
  obtenerAutomatizaciones,
  obtenerTablasImpala,
} from "@/modulos/automatizaciones/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export interface DetalleTablaImpala {
  baseDatos: string;
  tabla: string;
  totalFilas: number;
  columnas: Array<{ nombre: string; tipo: string }>;
  actualizadoEn: string;
}

export function PaginaTablasDestino() {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const [tablaSeleccionada, setTablaSeleccionada] = useState<string | null>(
    null,
  );
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

  // 1. Obtener tablas de Impala
  const {
    data: tablas = [],
    isLoading: cargandoTablas,
    isError,
    error,
  } = useQuery<TablaImpala[]>({
    queryKey: ["impala-tablas"],
    queryFn: obtenerTablasImpala,
    retry: false,
  });

  // 2. Obtener automatizaciones vinculadas
  const { data: automatizaciones = [] } = useQuery({
    queryKey: ["automatizaciones"],
    queryFn: obtenerAutomatizaciones,
  });

  // 3. Obtener esquema y metadatos de la tabla seleccionada
  const { data: detalleTabla, isLoading: cargandoDetalle } =
    useQuery<DetalleTablaImpala>({
      queryKey: ["impala-tabla-detalle", tablaSeleccionada],
      queryFn: () => {
        if (!tablaSeleccionada) throw new Error("Selecciona una tabla");
        return clienteApi.get<DetalleTablaImpala>(
          `/destinos/bases-datos/default/tablas/${encodeURIComponent(tablaSeleccionada)}/detalle`,
        );
      },
      enabled: Boolean(tablaSeleccionada),
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

  const tablasFiltradas = tablas.filter((t) =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  if (cargandoTablas) {
    return (
      <EstadoCarga mensaje="Conectando a Impala y cargando catálogo de tablas..." />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Lista de Tablas */}
        <div className="space-y-4 lg:col-span-1">
          <div className="relative">
            <Icon
              name="search"
              size="sm"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar un reporte…"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {tablasFiltradas.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-xl bg-white">
                No se encontraron reportes.
              </div>
            ) : (
              tablasFiltradas.map((t) => {
                const seleccionada = tablaSeleccionada === t.nombre;
                const autoVinculada = automatizaciones.find((a) =>
                  a.nombre.toLowerCase().includes(t.nombre.toLowerCase()),
                );

                return (
                  <button
                    type="button"
                    key={t.nombre}
                    onClick={() => setTablaSeleccionada(t.nombre)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      seleccionada
                        ? "border-brand-500 bg-brand-50/50 shadow-sm ring-1 ring-brand-200"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Icon
                          name="db"
                          size="sm"
                          className={
                            seleccionada ? "text-brand-600" : "text-slate-400"
                          }
                        />
                        <span className="font-semibold text-xs text-slate-900 truncate">
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
                      <p className="text-[10px] text-emerald-700 font-medium mt-1 truncate">
                        Conectado a: "{autoVinculada.nombre}"
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Panel Derecho: Detalle, Esquema de Columnas y Auditoría */}
        <div className="lg:col-span-2 space-y-5">
          {!tablaSeleccionada ? (
            <Card className="border-slate-200 bg-white p-12 text-center text-slate-400">
              <Icon
                name="db"
                size="lg"
                className="mx-auto text-slate-300 mb-2"
              />
              <p className="text-sm font-medium text-slate-600">
                Selecciona un reporte para explorar sus detalles
              </p>
              <p className="text-xs text-slate-400 mt-1">
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
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-brand-50 rounded-xl border border-brand-100 text-brand-600">
                        <Icon name="db" size="md" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900 font-mono">
                          {detalleTabla?.baseDatos || "default"}.
                          {tablaSeleccionada}
                        </CardTitle>
                        <p className="text-xs text-slate-500 font-medium">
                          Tabla destino en Impala
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
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
                        className="text-xs gap-1"
                      >
                        <Icon name="edit" size="sm" />
                        {esAdmin
                          ? "Editar reporte"
                          : "Editar (Requiere Administrador)"}
                      </Button>

                      <Link
                        to="/automatizaciones/nueva"
                        search={{ flujoId: "", tablaId: tablaSeleccionada }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
                      >
                        <Icon name="zap" size="sm" />
                        Usar en automatización
                      </Link>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Cantidad de registros
                      </span>
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {detalleTabla?.totalFilas !== undefined
                          ? detalleTabla.totalFilas.toLocaleString()
                          : "—"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Cantidad de campos
                      </span>
                      <span className="text-sm font-bold text-indigo-700 font-mono">
                        {detalleTabla?.columnas.length || 0} campos
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
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

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Última actualización
                      </span>
                      <span className="text-xs font-mono text-slate-700">
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
        </div>
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
