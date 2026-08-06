import type { TenantQlik } from "@/modulos/admin/api";
import { FormularioDestinoTenant } from "./formulario-destino-tenant";
import { ResumenDestinosTenant } from "./resumen-destinos-tenant";
import { useDestinoTenant } from "./use-destino-tenant";

export function SeccionConfigurarDestinosTenant({
  organizacionId,
  tenantQlik,
  cantidadExistentes = 0,
}: {
  organizacionId: string;
  tenantQlik: TenantQlik;
  cantidadExistentes?: number;
}) {
  const destino = useDestinoTenant({
    organizacionId,
    tenantQlikId: tenantQlik.id,
    cantidadExistentes,
  });

  return (
    <div className="space-y-3">
      <ResumenDestinosTenant
        cantidad={cantidadExistentes}
        abierto={destino.formularioAbierto}
        onAlternar={destino.alternarFormulario}
      />
      {destino.formularioAbierto && (
        <FormularioDestinoTenant
          tipo={destino.tipo}
          nombre={destino.nombre}
          config={destino.config}
          cantidadExistentes={cantidadExistentes}
          habilitado={destino.habilitado}
          guardando={destino.guardando}
          onNombre={destino.setNombre}
          onTipo={destino.seleccionarTipo}
          onCambiar={destino.cambiarCampo}
          onCancelar={destino.cerrarFormulario}
          onGuardar={destino.guardar}
        />
      )}
    </div>
  );
}
