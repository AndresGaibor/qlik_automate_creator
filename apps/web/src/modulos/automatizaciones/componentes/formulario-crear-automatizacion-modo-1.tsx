import { Button } from "@/compartido/componentes/ui/button";
import type { ResumenFlujo } from "@qlik/contratos";
import type { ConexionDestino, PreflightAutomatizacion } from "../api";
import { FormularioConexionOrigen } from "./formulario-conexion-origen";
import { FormularioPostgresDestino } from "./formulario-postgres-destino";
import { TarjetaConexionOrigenGuardada } from "./tarjeta-conexion-origen-guardada";

interface Props {
  flujos: ResumenFlujo[];
  flujoId: string;
  onFlujoChange(id: string): void;
  preflight?: PreflightAutomatizacion;
  cargandoPreflight: boolean;
  conexiones: ConexionDestino[];
  destinoId?: string;
  onDestinoChange(id: string): void;
  nombre: string;
  onNombreChange(nombre: string): void;
  confirmacion: boolean;
  onConfirmacionChange(valor: boolean): void;
  onConexionGuardada(): void;
  onDestinoGuardado(id: string): void;
  puedeAdministrarConexiones: boolean;
  conexionProbandoId?: string;
  onProbarConexion(id: string): void;
  onCrear(): void;
  creando: boolean;
}

function Paso({
  numero,
  titulo,
  children,
}: {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line-200 bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
          {numero}
        </span>
        <h2 className="font-display text-lg font-semibold text-ink-900">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function FormularioCrearAutomatizacionModo1(props: Props) {
  const postgres = props.conexiones.filter(
    (conexion) => conexion.tipo === "postgres",
  );
  const destino = props.preflight?.destinosPostgres.find(
    (item) => item.id === props.destinoId,
  );
  const origenesListos = Boolean(
    props.preflight?.conexionesRequeridas.every(
      (item) => item.estado === "disponible",
    ),
  );
  const destinoListo = Boolean(
    destino?.estado === "activo" && destino.probadoEn,
  );
  const puedeCrear = Boolean(
    props.flujoId &&
      origenesListos &&
      destinoListo &&
      props.nombre.trim() &&
      props.confirmacion,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink-900">
          Crear automatización · Modo 1
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Verifica las conexiones del Dataflow y selecciona una base PostgreSQL
          antes de clonar la plantilla.
        </p>
      </header>

      <Paso numero={1} titulo="Selecciona el Dataflow">
        <label className="block text-sm font-semibold text-ink-800">
          Dataflow de origen
          <select
            value={props.flujoId}
            onChange={(event) => props.onFlujoChange(event.target.value)}
            className="mt-2 w-full rounded-md border border-line-200 bg-surface px-3 py-2.5 text-sm"
          >
            <option value="">Selecciona un Dataflow…</option>
            {props.flujos.map((flujo) => (
              <option key={flujo.id} value={flujo.id}>
                {flujo.nombre}
              </option>
            ))}
          </select>
        </label>
      </Paso>

      <Paso numero={2} titulo="Verifica las conexiones de origen">
        {!props.flujoId ? (
          <p className="text-sm text-ink-500">
            Selecciona primero un Dataflow.
          </p>
        ) : props.cargandoPreflight ? (
          <p className="text-sm text-ink-500">Analizando conexiones…</p>
        ) : props.preflight?.conexionesRequeridas.length ? (
          <div className="space-y-3">
            {props.preflight.conexionesRequeridas.map((requisito) => (
              <div key={`${requisito.tipo}:${requisito.nombre}`}>
                {requisito.estado === "faltante" ? (
                  <FormularioConexionOrigen
                    requisito={{
                      tipo: requisito.tipo,
                      nombre: requisito.nombre,
                    }}
                    onGuardada={props.onConexionGuardada}
                  />
                ) : (
                  <TarjetaConexionOrigenGuardada
                    requisito={requisito}
                    puedeAdministrar={props.puedeAdministrarConexiones}
                    probando={props.conexionProbandoId === requisito.conexionId}
                    onProbar={props.onProbarConexion}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-700">
            El Dataflow no requiere conexiones externas adicionales.
          </p>
        )}
      </Paso>

      <Paso numero={3} titulo="Selecciona la base destino PostgreSQL">
        <label className="block text-sm font-semibold text-ink-800">
          Base destino PostgreSQL
          <select
            value={props.destinoId ?? ""}
            onChange={(event) => props.onDestinoChange(event.target.value)}
            className="mt-2 w-full rounded-md border border-line-200 bg-surface px-3 py-2.5 text-sm"
          >
            <option value="">Selecciona un destino probado…</option>
            {postgres.map((conexion) => (
              <option key={conexion.id} value={conexion.id}>
                {conexion.nombre}
              </option>
            ))}
          </select>
        </label>
        {props.destinoId && !destinoListo && (
          <p className="mt-2 text-xs text-amber-700">
            La conexión seleccionada todavía no tiene una prueba exitosa.
          </p>
        )}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-brand-700">
            Crear una nueva base PostgreSQL
          </summary>
          <div className="mt-3">
            <FormularioPostgresDestino onGuardada={props.onDestinoGuardado} />
          </div>
        </details>
      </Paso>

      <Paso numero={4} titulo="Confirma y crea la automatización">
        <label className="block text-sm font-semibold text-ink-800">
          Nombre de la automatización
          <input
            value={props.nombre}
            onChange={(event) => props.onNombreChange(event.target.value)}
            className="mt-2 w-full rounded-md border border-line-200 bg-surface px-3 py-2.5 text-sm"
          />
        </label>
        <label className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <input
            type="checkbox"
            checked={props.confirmacion}
            onChange={(event) =>
              props.onConfirmacionChange(event.target.checked)
            }
            className="mt-0.5"
          />
          <span>
            Este demo guardara credenciales en la variable SECRETOSJSON del
            workspace de Qlik. Los usuarios con permiso de edicion podran
            verlas.
          </span>
        </label>
        <Button
          type="button"
          onClick={props.onCrear}
          disabled={!puedeCrear || props.creando}
          className="mt-4 w-full"
        >
          {props.creando ? "Creando…" : "Crear automatización"}
        </Button>
      </Paso>
    </div>
  );
}
