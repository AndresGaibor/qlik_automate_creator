import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type {
  ConexionDestino,
  RecursoDestino,
} from "@/modulos/automatizaciones/api";
import type { ResumenFlujo } from "@qlik/contratos";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import { Link } from "@tanstack/react-router";
import type { FormEvent, ReactNode } from "react";
import { ResumenNuevaAutomatizacion } from "./resumen-nueva-automatizacion";

interface Props {
  flujoId: string;
  setFlujoId: (v: string) => void;
  tablaId: string;
  setTablaId: (v: string) => void;
  nombre: string;
  setNombre: (v: string) => void;
  flujos: ResumenFlujo[];
  tablas: RecursoDestino[];
  etiquetaDestino: string;
  automatizaciones?: ResumenAutomatizacion[];
  espacioId?: string;
  isLoadingFlujos: boolean;
  isLoadingTablas: boolean;
  onCrear: () => void;
  isCreating: boolean;
  puedeCrear: boolean;
  modoActivo: 1 | 2;
  plantillaEfectivaNombre: string | null;
  destinoId: string | undefined;
  setDestinoId: (v: string) => void;
  conexiones: ConexionDestino[];
  requiereDestino: boolean;
}

export function FormularioCrearAutomatizacion(props: Props) {
  const {
    flujoId,
    setFlujoId,
    tablaId,
    setTablaId,
    nombre,
    setNombre,
    flujos,
    tablas,
    automatizaciones = [],
    espacioId,
    isLoadingFlujos,
    isLoadingTablas,
    onCrear,
    isCreating,
    modoActivo,
    plantillaEfectivaNombre,
    destinoId,
    setDestinoId,
    conexiones,
    requiereDestino,
    etiquetaDestino,
  } = props;

  const flujoSeleccionado = flujos.find((item) => item.id === flujoId);
  const conexionSeleccionada = conexiones.find((item) => item.id === destinoId);
  const recursoSeleccionado = tablas.find(
    (item) => item.id === tablaId || item.nombre === tablaId,
  );

  const opcionesConexiones = conexiones.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    espacioNombre: item.tipo.toUpperCase(),
  }));
  const opcionesFlujos = flujos.map((flujo) => {
    const vinculada = automatizaciones.find(
      (auto) =>
        auto.nombre.toLowerCase().includes(flujo.nombre.toLowerCase()) ||
        auto.nombre.includes(flujo.id),
    );
    return {
      id: flujo.id,
      nombre: flujo.nombre,
      espacioNombre: flujo.espacioNombre || "Espacio personal",
      badgeAviso: vinculada
        ? `Ya se usa en "${vinculada.nombre.slice(0, 25)}"`
        : undefined,
    };
  });
  const opcionesTablas = tablas.map((tabla) => ({
    id: tabla.nombre,
    nombre: tabla.nombre,
    espacioNombre: tabla.espacioDeNombres || etiquetaDestino,
  }));

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    onCrear();
  }

  const destinoBloqueado =
    !flujoId || (requiereDestino && !destinoId) || isLoadingTablas;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav
        aria-label="Ruta de navegación"
        className="flex items-center gap-2 text-sm"
      >
        <Link
          to="/automatizaciones"
          className="font-medium text-ink-500 hover:text-ink-900"
        >
          Automatizaciones
        </Link>
        <Icon name="chev" size="sm" className="rotate-180 text-ink-300" />
        <span className="font-medium text-ink-800">Nueva</span>
      </nav>

      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink-900">
          Crear automatización
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-500">
          Conecta un Dataflow con su destino. La plataforma clonará la plantilla
          y preparará la automatización en Qlik Cloud.
        </p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <form
          id="form-nueva-automatizacion"
          onSubmit={enviar}
          className="space-y-3"
        >
          <Paso
            numero={1}
            titulo="Elige el origen"
            descripcion="Selecciona el Dataflow que produce los datos."
            completo={Boolean(flujoId)}
          >
            <SelectBuscable
              etiqueta="Dataflow de origen"
              placeholder="Elige un Dataflow de Qlik Cloud..."
              searchPlaceholder="Busca por nombre o espacio…"
              emptyText="No encontramos Dataflows disponibles."
              opciones={opcionesFlujos}
              valorSeleccionado={flujoId}
              onSeleccionar={setFlujoId}
              cargando={isLoadingFlujos}
            />
            {espacioId && (
              <p className="mt-2 text-xs text-ink-500">
                Espacio filtrado: <span className="font-mono">{espacioId}</span>
              </p>
            )}
          </Paso>

          <Paso
            numero={2}
            titulo="Define el destino"
            descripcion="Indica dónde debe quedar disponible el resultado."
            completo={Boolean(tablaId && (!requiereDestino || destinoId))}
            bloqueado={!flujoId}
          >
            {requiereDestino && (
              <div className="mb-4">
                <SelectBuscable
                  etiqueta="Conexión destino (obligatorio en Modo 2)"
                  placeholder="Elige una conexión..."
                  searchPlaceholder="Busca por nombre…"
                  emptyText="No hay conexiones destino disponibles."
                  opciones={opcionesConexiones}
                  valorSeleccionado={destinoId ?? ""}
                  onSeleccionar={setDestinoId}
                  disabled={!flujoId}
                  disabledText="Selecciona primero un Dataflow"
                />
              </div>
            )}
            <SelectBuscable
              etiqueta={`Recurso destino (${etiquetaDestino})`}
              placeholder="Elige dónde guardar el resultado..."
              searchPlaceholder="Busca por nombre…"
              emptyText="No hay recursos disponibles en esta conexión."
              opciones={opcionesTablas}
              valorSeleccionado={tablaId}
              onSeleccionar={setTablaId}
              cargando={isLoadingTablas}
              disabled={destinoBloqueado}
              disabledText={
                !flujoId
                  ? "Selecciona primero un Dataflow"
                  : "Selecciona primero la conexión destino"
              }
            />
            {!flujoId && (
              <p className="mt-2 text-xs text-amber-700">
                Selecciona primero un Dataflow para continuar.
              </p>
            )}
            {requiereDestino && !destinoId && (
              <p className="mt-2 text-xs text-amber-700">
                El modo 2 requiere seleccionar una conexión destino y una tabla.
              </p>
            )}
          </Paso>

          <Paso
            numero={3}
            titulo="Identifica la automatización"
            descripcion="Usa un nombre fácil de reconocer en Qlik Cloud."
            completo={Boolean(nombre.trim())}
            bloqueado={!flujoId || !tablaId}
          >
            <label
              htmlFor="nombre-automatizacion"
              className="block text-sm font-semibold text-ink-900"
            >
              Nombre de la automatización
            </label>
            <input
              id="nombre-automatizacion"
              type="text"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              disabled={!flujoId || !tablaId}
              placeholder="Ej. Ventas diarias hacia tabla_ventas"
              className="mt-1.5 w-full rounded-md border border-line-200 bg-surface px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-app disabled:text-ink-400"
              required
            />
            <p className="mt-2 text-xs text-ink-500">
              Se sugiere automáticamente al elegir el origen y el destino.
            </p>
          </Paso>
        </form>

        <aside aria-label="Resumen de creación" className="xl:sticky xl:top-24">
          <ResumenNuevaAutomatizacion
            flujoNombre={flujoSeleccionado?.nombre ?? ""}
            conexionNombre={
              conexionSeleccionada?.nombre ||
              (!requiereDestino ? etiquetaDestino : "")
            }
            recursoNombre={recursoSeleccionado?.nombre ?? tablaId}
            nombre={nombre}
            modoActivo={modoActivo}
            plantillaNombre={plantillaEfectivaNombre}
            requiereDestino={requiereDestino}
            isCreating={isCreating}
            onCrear={onCrear}
          />
          <Link to="/automatizaciones" className="mt-3 block">
            <Button
              type="button"
              variant="ghost"
              disabled={isCreating}
              className="w-full"
            >
              Cancelar y volver
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Paso({
  numero,
  titulo,
  descripcion,
  completo,
  bloqueado = false,
  children,
}: {
  numero: number;
  titulo: string;
  descripcion: string;
  completo: boolean;
  bloqueado?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border bg-surface shadow-card transition ${
        completo
          ? "border-brand-200"
          : bloqueado
            ? "border-line-200 opacity-75"
            : "border-line-200"
      }`}
    >
      <div className="flex items-start gap-3 border-b border-line-200 bg-app/30 px-4 py-3">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
            completo
              ? "bg-brand-600 text-white"
              : bloqueado
                ? "bg-line-200 text-ink-500"
                : "bg-brand-50 text-brand-700"
          }`}
        >
          {completo ? <Icon name="check" size="sm" /> : numero}
        </span>
        <div>
          <h2 className="font-display text-base font-semibold text-ink-900">
            {titulo}
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">{descripcion}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
