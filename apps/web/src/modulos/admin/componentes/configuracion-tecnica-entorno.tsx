import type { TenantQlik } from "@/modulos/admin/api";
import { useState } from "react";
import { EditorConfiguracionTecnica } from "./editor-configuracion-tecnica";
import { construirResumenConfiguracionTecnica } from "./modelo-configuracion-tecnica";
import { ResumenConfiguracionTecnica } from "./resumen-configuracion-tecnica";

export function ConfiguracionTecnicaEntorno({
  organizacionId,
  tenantQlik,
  cantidadDestinos,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
  cantidadDestinos: number;
}) {
  const [forzarEdicion, setForzarEdicion] = useState(false);
  const resumen = construirResumenConfiguracionTecnica(
    tenantQlik,
    cantidadDestinos,
  );

  if (resumen.lista && !forzarEdicion) {
    return (
      <ResumenConfiguracionTecnica
        resumen={resumen}
        onEditar={() => setForzarEdicion(true)}
      />
    );
  }

  return (
    <EditorConfiguracionTecnica
      organizacionId={organizacionId}
      tenantQlik={tenantQlik}
      cantidadDestinos={cantidadDestinos}
      resumen={resumen}
      onCerrar={() => setForzarEdicion(false)}
    />
  );
}
