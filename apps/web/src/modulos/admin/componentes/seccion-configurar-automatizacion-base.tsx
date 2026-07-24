import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TenantQlik } from "@/modulos/admin/api";
import { listarAutomatizacionesParaAdmin } from "@/modulos/admin/api";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import { useState } from "react";
import { configurarAutomatizacionBaseTenant } from "@/modulos/admin/api";

interface Props {
  organizacionId: string;
  tenantQlik: TenantQlik;
}

export function SeccionConfigurarAutomatizacionBase({
  organizacionId,
  tenantQlik,
}: Props) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [baseIdSeleccionado, setBaseIdSeleccionado] = useState(
    tenantQlik.automatizacionBaseIdQlik || "",
  );

  const { data: automatizaciones = [], isLoading } = useQuery<
    ResumenAutomatizacion[]
  >({
    queryKey: ["automatizaciones-admin-list", tenantQlik.id],
    queryFn: listarAutomatizacionesParaAdmin,
  });

  const guardarBase = useMutation({
    mutationFn: (auto: ResumenAutomatizacion) =>
      configurarAutomatizacionBaseTenant(
        organizacionId,
        tenantQlik.id,
        auto.id,
        auto.nombre,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito(
        "Automatización Base del Tenant configurada exitosamente",
      );
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const handleSeleccionar = (id: string) => {
    setBaseIdSeleccionado(id);
    const auto = automatizaciones.find((a) => a.id === id);
    if (auto) {
      guardarBase.mutate(auto);
    }
  };

  const opciones = automatizaciones.map((a) => ({
    id: a.id,
    nombre: `${a.nombre} (ID: ${a.id.slice(0, 8)}…)`,
    espacioNombre: a.espacioNombre || "Personal",
  }));

  return (
    <div className="pt-2 border-t mt-3">
      <SelectBuscable
        etiqueta="Designar o Cambiar Automatización Base"
        placeholder="Busca y selecciona la automatización plantilla..."
        opciones={opciones}
        valorSeleccionado={baseIdSeleccionado}
        onSeleccionar={handleSeleccionar}
        cargando={isLoading}
      />
    </div>
  );
}
