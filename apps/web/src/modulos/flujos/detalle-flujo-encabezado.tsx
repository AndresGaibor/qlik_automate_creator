import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import type { ResumenAutomatizacion } from "@/modulos/automatizaciones/publico";
import { Link } from "@tanstack/react-router";
import type { ResumenFlujo } from "./api";

interface Props {
  flujo: ResumenFlujo;
  urlQlikCloud: string | null;
  automatizacionVinculada?: ResumenAutomatizacion;
}

export function DetalleFlujoEncabezado({
  flujo,
  urlQlikCloud,
  automatizacionVinculada,
}: Props) {
  return (
    <>
      <div>
        <Link
          to="/flujos"
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors font-medium mb-4"
        >
          <Icon name="chev" size="sm" className="rotate-180" />
          Volver a Dataflows de Qlik
        </Link>
      </div>
      <PageHeader
        title={flujo.nombre}
        description={`Dataflow de Qlik · Espacio ${flujo.espacioNombre || "Personal"}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {urlQlikCloud && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <a
                  href={urlQlikCloud}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="ext" size="sm" />
                  Ver en Qlik Cloud
                </a>
              </Button>
            )}
            <Button
              asChild
              size="sm"
              className={
                automatizacionVinculada
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                  : "bg-brand-600 hover:bg-brand-700 text-white gap-1.5"
              }
            >
              {automatizacionVinculada ? (
                <Link
                  to="/automatizaciones/$id"
                  params={{ id: automatizacionVinculada.id }}
                >
                  <Icon name="zap" size="sm" />
                  Ver automatización ya creada
                </Link>
              ) : (
                <Link
                  to="/automatizaciones/nueva"
                  search={{ flujoId: flujo.id }}
                >
                  <Icon name="zap" size="sm" />
                  Crear automatización en Qlik Automate
                </Link>
              )}
            </Button>
          </div>
        }
      />
    </>
  );
}
