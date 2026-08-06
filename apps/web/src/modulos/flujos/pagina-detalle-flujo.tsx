import { EstadoAccesoRecursoQlik } from "@/compartido/componentes/feedback/estado-acceso-recurso-qlik";
import { EstadoError } from "@/compartido/componentes/feedback/estado-error";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { DetalleFlujoEncabezado } from "./detalle-flujo-encabezado";
import { DetalleFlujoNavegacion } from "./detalle-flujo-navegacion";
import { DetalleFlujoPanelAutomatizacion } from "./detalle-flujo-panel-automatizacion";
import { DetalleFlujoPanelMetadata } from "./detalle-flujo-panel-metadata";
import { DetalleFlujoPanelScript } from "./detalle-flujo-panel-script";
import { DetalleFlujoPanelSpark } from "./detalle-flujo-panel-spark";
import type { PestanaDetalleFlujo } from "./modelo-detalle-flujo";
import { useDetalleFlujo } from "./use-detalle-flujo";

export function PaginaDetalleFlujo() {
  const { id } = useParams({ from: "/flujos/$id" });
  const [pestana, setPestana] = useState<PestanaDetalleFlujo>("script");
  const detalle = useDetalleFlujo(id);

  if (detalle.cargandoFlujos) {
    return <EstadoCarga mensaje="Cargando información del flujo de datos..." />;
  }
  if (detalle.accesoDenegado) return <EstadoAccesoRecursoQlik />;
  if (detalle.errorFlujos || !detalle.flujo) {
    return (
      <EstadoError
        mensaje={
          !detalle.flujo
            ? `No se encontró el flujo de datos con ID "${id}".`
            : "Error al recuperar información del flujo."
        }
      />
    );
  }

  const flujo = detalle.flujo;
  return (
    <PageLayout>
      <DetalleFlujoEncabezado
        flujo={flujo}
        urlQlikCloud={detalle.urlQlikCloud}
        automatizacionVinculada={detalle.automatizacionVinculada}
      />
      <DetalleFlujoNavegacion
        activa={pestana}
        tieneAutomatizacion={Boolean(detalle.automatizacionVinculada)}
        onCambiar={setPestana}
      />
      <div className="space-y-6">
        {pestana === "script" && (
          <DetalleFlujoPanelScript
            datos={detalle.datosScript}
            cargando={detalle.cargandoScript}
            conError={detalle.errorScript}
          />
        )}
        {pestana === "spark" && (
          <DetalleFlujoPanelSpark
            datos={detalle.datosSpark}
            cargando={detalle.cargandoSpark}
          />
        )}
        {pestana === "metadata" && detalle.metadata && (
          <DetalleFlujoPanelMetadata
            flujo={flujo}
            metadata={detalle.metadata}
          />
        )}
        {pestana === "automatizaciones" && (
          <DetalleFlujoPanelAutomatizacion
            flujo={flujo}
            automatizacion={detalle.automatizacionVinculada}
          />
        )}
      </div>
    </PageLayout>
  );
}
