import type {
  ConexionDestino,
  RecursoDestino,
} from "@/modulos/automatizaciones/api";
import type { ResumenFlujo } from "@qlik/contratos";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import type { FormEvent } from "react";
import { EncabezadoNuevaAutomatizacion } from "./encabezado-nueva-automatizacion";
import {
  construirOpcionesConexiones,
  construirOpcionesFlujos,
  construirOpcionesTablas,
  resolverSeleccionFormulario,
} from "./modelo-formulario-crear-automatizacion";
import { PasosNuevaAutomatizacion } from "./pasos-nueva-automatizacion";
import { ResumenLateralNuevaAutomatizacion } from "./resumen-lateral-nueva-automatizacion";

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

export function FormularioCrearAutomatizacion({
  automatizaciones = [],
  ...props
}: Props) {
  const opcionesFlujos = construirOpcionesFlujos(
    props.flujos,
    automatizaciones,
  );
  const opcionesConexiones = construirOpcionesConexiones(props.conexiones);
  const opcionesTablas = construirOpcionesTablas(
    props.tablas,
    props.etiquetaDestino,
  );
  const seleccion = resolverSeleccionFormulario({
    flujoId: props.flujoId,
    tablaId: props.tablaId,
    destinoId: props.destinoId,
    flujos: props.flujos,
    tablas: props.tablas,
    conexiones: props.conexiones,
    requiereDestino: props.requiereDestino,
    isLoadingTablas: props.isLoadingTablas,
  });

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    props.onCrear();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <EncabezadoNuevaAutomatizacion />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <form
          id="form-nueva-automatizacion"
          onSubmit={enviar}
          className="space-y-3"
        >
          <PasosNuevaAutomatizacion
            flujoId={props.flujoId}
            tablaId={props.tablaId}
            nombre={props.nombre}
            destinoId={props.destinoId}
            espacioId={props.espacioId}
            opcionesFlujos={opcionesFlujos}
            opcionesConexiones={opcionesConexiones}
            opcionesTablas={opcionesTablas}
            etiquetaDestino={props.etiquetaDestino}
            requiereDestino={props.requiereDestino}
            isLoadingFlujos={props.isLoadingFlujos}
            isLoadingTablas={props.isLoadingTablas}
            destinoBloqueado={seleccion.destinoBloqueado}
            onFlujo={props.setFlujoId}
            onTabla={props.setTablaId}
            onNombre={props.setNombre}
            onDestino={props.setDestinoId}
          />
        </form>
        <ResumenLateralNuevaAutomatizacion
          flujoNombre={seleccion.flujoNombre}
          conexionNombre={
            seleccion.conexionNombre ||
            (!props.requiereDestino ? props.etiquetaDestino : "")
          }
          recursoNombre={seleccion.recursoNombre}
          nombre={props.nombre}
          modoActivo={props.modoActivo}
          plantillaNombre={props.plantillaEfectivaNombre}
          requiereDestino={props.requiereDestino}
          isCreating={props.isCreating}
          onCrear={props.onCrear}
        />
      </div>
    </div>
  );
}
