import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  type EspacioConfigurable,
  type GuardarEspaciosVisibles,
  guardarEspaciosVisibles,
  obtenerEspaciosVisibles,
  sincronizarEspaciosVisibles,
} from "../api";

interface PresentacionProps {
  espacios: EspacioConfigurable[];
  permitirRecursosSinEspacio: boolean;
  guardando: boolean;
  sincronizando: boolean;
  onGuardar: (entrada: GuardarEspaciosVisibles) => void;
  onSincronizar: () => void;
}

export function SeccionEspaciosVisiblesPresentacion({
  espacios,
  permitirRecursosSinEspacio,
  guardando,
  sincronizando,
  onGuardar,
  onSincronizar,
}: PresentacionProps) {
  const [busqueda, setBusqueda] = useState("");
  const [seleccionados, setSeleccionados] = useState(() =>
    espacios.filter((item) => item.seleccionado).map((item) => item.id),
  );
  const [permitirSinEspacio, setPermitirSinEspacio] = useState(
    permitirRecursosSinEspacio,
  );

  useEffect(() => {
    setSeleccionados(
      espacios.filter((item) => item.seleccionado).map((item) => item.id),
    );
    setPermitirSinEspacio(permitirRecursosSinEspacio);
  }, [espacios, permitirRecursosSinEspacio]);

  const visibles = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return espacios;
    return espacios.filter((item) =>
      `${item.nombre} ${item.tipo}`.toLowerCase().includes(termino),
    );
  }, [busqueda, espacios]);

  const alternar = (id: string) => {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((item) => item !== id)
        : [...actuales, id],
    );
  };

  return (
    <section className="overflow-hidden rounded-xl border border-line-200 bg-surface shadow-card">
      <div className="flex flex-col gap-3 border-b border-line-200 bg-app/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <Icon name="cloud" className="text-brand-600" />
            Espacios visibles
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Elige qué espacios de Qlik Cloud pueden consultar los usuarios
            finales.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={sincronizando}
          onClick={onSincronizar}
        >
          {sincronizando ? "Actualizando…" : "Actualizar desde Qlik Cloud"}
        </Button>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="buscar-espacios"
              className="text-xs font-semibold text-ink-700"
            >
              Buscar espacios
            </label>
            <input
              id="buscar-espacios"
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Ventas, Finanzas, Producción…"
              className="mt-1 h-10 w-full rounded-md border border-line-200 bg-surface px-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <p className="shrink-0 text-sm font-semibold text-ink-800">
            {seleccionados.length} de {espacios.length} espacios habilitados
          </p>
        </div>

        {espacios.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line-300 bg-app/30 p-6 text-center">
            <p className="text-sm font-semibold text-ink-700">
              No hay espacios sincronizados
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Actualiza el catálogo desde Qlik Cloud para comenzar.
            </p>
          </div>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {visibles.map((espacio) => (
              <label
                key={espacio.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-line-200 p-3 transition hover:bg-hover"
              >
                <input
                  type="checkbox"
                  aria-label={espacio.nombre}
                  checked={seleccionados.includes(espacio.id)}
                  onChange={() => alternar(espacio.id)}
                  className="h-4 w-4 accent-brand-600"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink-900">
                    {espacio.nombre}
                  </span>
                  <span className="text-xs text-ink-500">{espacio.tipo}</span>
                </span>
                {!espacio.disponible && (
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-800">
                    Ya no disponible
                  </span>
                )}
              </label>
            ))}
          </div>
        )}

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line-200 bg-app/40 p-4">
          <input
            type="checkbox"
            checked={permitirSinEspacio}
            onChange={(event) => setPermitirSinEspacio(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-brand-600"
          />
          <span>
            <span className="block text-sm font-semibold text-ink-900">
              Permitir recursos personales o sin espacio
            </span>
            <span className="mt-1 block text-xs text-ink-500">
              Incluye Dataflows y automatizaciones que Qlik no asocia a un
              espacio compartido.
            </span>
          </span>
        </label>

        <div className="flex justify-end">
          <Button
            type="button"
            disabled={guardando}
            onClick={() =>
              onGuardar({
                espaciosPermitidosIds: seleccionados,
                permitirRecursosSinEspacio: permitirSinEspacio,
              })
            }
          >
            {guardando ? "Guardando…" : "Guardar espacios visibles"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export function SeccionEspaciosVisibles({
  organizacionId,
  tenantQlikId,
}: {
  organizacionId: string;
  tenantQlikId: string;
}) {
  const queryClient = useQueryClient();
  const [mensajeEstado, setMensajeEstado] = useState<string | null>(null);
  const clave = ["admin-espacios-visibles", organizacionId, tenantQlikId];
  const consulta = useQuery({
    queryKey: clave,
    queryFn: () => obtenerEspaciosVisibles(organizacionId, tenantQlikId),
    retry: false,
  });
  const guardar = useMutation({
    mutationFn: (entrada: GuardarEspaciosVisibles) =>
      guardarEspaciosVisibles(organizacionId, tenantQlikId, entrada),
    onSuccess: async () => {
      setMensajeEstado("Espacios visibles guardados");
      await queryClient.invalidateQueries({ queryKey: clave });
    },
    onError: (error: Error) => setMensajeEstado(error.message),
  });
  const sincronizar = useMutation({
    mutationFn: () => sincronizarEspaciosVisibles(organizacionId, tenantQlikId),
    onSuccess: async () => {
      setMensajeEstado("Espacios actualizados desde Qlik Cloud");
      await queryClient.invalidateQueries({ queryKey: clave });
    },
    onError: (error: Error) => setMensajeEstado(error.message),
  });

  if (consulta.isLoading) {
    return (
      <div className="rounded-xl border border-line-200 bg-surface p-6 text-sm text-ink-500">
        Cargando espacios de Qlik Cloud…
      </div>
    );
  }
  if (consulta.isError || !consulta.data) {
    return (
      <div className="rounded-xl border border-danger-200 bg-red-50 p-6 text-sm text-danger-600">
        No se pudo cargar la configuración de espacios.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {mensajeEstado && (
        <output className="block rounded-md border border-line-200 bg-app px-3 py-2 text-xs text-ink-600">
          {mensajeEstado}
        </output>
      )}
      <SeccionEspaciosVisiblesPresentacion
        espacios={consulta.data.espacios}
        permitirRecursosSinEspacio={
          consulta.data.configuracion.permitirRecursosSinEspacio
        }
        guardando={guardar.isPending}
        sincronizando={sincronizar.isPending}
        onGuardar={(entrada) => guardar.mutate(entrada)}
        onSincronizar={() => sincronizar.mutate()}
      />
    </div>
  );
}
