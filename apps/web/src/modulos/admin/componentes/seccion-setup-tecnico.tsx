import { Icon } from "@/compartido/componentes/ui/icon";
import { obtenerConexionesDestino } from "@/modulos/automatizaciones/publico";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { TenantQlik } from "../api";
import { SetupTecnicoAcordeon } from "./setup-tecnico-acordeon";
import { SetupTecnicoDestinos } from "./setup-tecnico-destinos";
import { SetupTecnicoPlantilla } from "./setup-tecnico-plantilla";
import { SetupTecnicoQlik } from "./setup-tecnico-qlik";

interface Props {
  tenant: { id: string };
  tenantsQlik: TenantQlik[];
  onCrearQlik: (params: { host: string; nombre?: string }) => void;
  onEliminarQlik: (id: string) => void;
  onHacerPrincipal: (id: string) => void;
  crear: { isPending: boolean };
  eliminar: { isPending: boolean };
  hacerPrincipal: { isPending: boolean };
}

export function SeccionSetupTecnico({
  tenant,
  tenantsQlik,
  onCrearQlik,
  onEliminarQlik,
  onHacerPrincipal,
  crear,
  eliminar,
  hacerPrincipal,
}: Props) {
  const tieneQlik = tenantsQlik.length > 0;
  const tienePlantilla = tenantsQlik.some((t) => !!t.automatizacionBaseIdQlik);
  const { data: conexionesDestino = [] } = useQuery({
    queryKey: ["destinos-conexiones"],
    queryFn: obtenerConexionesDestino,
    retry: false,
  });
  const tieneDestino =
    conexionesDestino.length > 0 || tenantsQlik.some((t) => !!t.impalaHost);

  const primerPasoAbierto = !tieneQlik
    ? 0
    : !tienePlantilla
      ? 1
      : !tieneDestino
        ? 2
        : -1;
  const [pasoAbierto, setPasoAbierto] = useState<number>(primerPasoAbierto);

  const toggle = (i: number) => setPasoAbierto((prev) => (prev === i ? -1 : i));

  const pasos = [
    {
      titulo: "Conexión Qlik Cloud",
      descripcionCorta:
        "Vincula al menos un entorno Qlik Cloud a esta organización.",
      listo: tieneQlik,
      resumen: tieneQlik ? (
        <p className="text-xs text-ink-500 truncate">
          {tenantsQlik.length === 1
            ? tenantsQlik[0].nombre || tenantsQlik[0].host
            : `${tenantsQlik.length} entornos conectados`}
        </p>
      ) : null,
      contenido: (
        <SetupTecnicoQlik
          tenantsQlik={tenantsQlik}
          onCrearQlik={onCrearQlik}
          onEliminarQlik={onEliminarQlik}
          onHacerPrincipal={onHacerPrincipal}
          crear={crear}
          eliminar={eliminar}
          hacerPrincipal={hacerPrincipal}
        />
      ),
    },
    {
      titulo: "Plantilla base",
      descripcionCorta:
        "Designa la automatización de Qlik que servirá como molde para crear nuevas automatizaciones.",
      listo: tienePlantilla,
      resumen: tienePlantilla ? (
        <p className="text-xs text-ink-500 truncate">
          {
            tenantsQlik.find((t) => t.automatizacionBaseNombre)
              ?.automatizacionBaseNombre
          }
        </p>
      ) : null,
      contenido: tieneQlik ? (
        <SetupTecnicoPlantilla
          organizacionId={tenant.id}
          tenantsQlik={tenantsQlik}
        />
      ) : (
        <p className="text-sm text-ink-400 py-2">
          Primero conecta un entorno Qlik Cloud en el paso anterior.
        </p>
      ),
    },
    {
      titulo: "Conexiones de destino",
      descripcionCorta:
        "Agrega PostgreSQL, BigQuery, SFTP o Impala para seleccionar recursos de destino.",
      listo: tieneDestino,
      resumen: tieneDestino ? (
        <p className="text-xs text-ink-500 font-mono truncate">
          {conexionesDestino.map((destino) => destino.nombre).join(", ") ||
            "Destino heredado"}
        </p>
      ) : null,
      contenido: tieneQlik ? (
        <SetupTecnicoDestinos
          organizacionId={tenant.id}
          tenantsQlik={tenantsQlik}
        />
      ) : (
        <p className="text-sm text-ink-400 py-2">
          Primero conecta un entorno Qlik Cloud en el paso 1.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {tieneQlik && tienePlantilla && tieneDestino ? (
        <div className="flex items-center gap-3 border-l-4 border-brand-600 bg-brand-50 px-4 py-3 mb-4">
          <Icon name="check" size="md" className="text-brand-700" />
          <div>
            <p className="text-sm font-semibold text-brand-900">
              Configuración técnica completa
            </p>
            <p className="text-xs text-brand-700">
              Los usuarios pueden crear automatizaciones en este entorno.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Completa los{" "}
              {3 -
                [tieneQlik, tienePlantilla, tieneDestino].filter(Boolean)
                  .length}{" "}
              pasos pendientes
            </p>
            <p className="text-xs text-amber-700">
              Los usuarios no podrán crear automatizaciones hasta que todo esté
              configurado.
            </p>
          </div>
        </div>
      )}

      {pasos.map((paso, i) => (
        <SetupTecnicoAcordeon
          key={paso.titulo}
          numero={i + 1}
          titulo={paso.titulo}
          descripcionCorta={paso.descripcionCorta}
          listo={paso.listo}
          expandido={pasoAbierto === i}
          onToggle={() => toggle(i)}
          resumen={paso.resumen}
        >
          {paso.contenido}
        </SetupTecnicoAcordeon>
      ))}
    </div>
  );
}
