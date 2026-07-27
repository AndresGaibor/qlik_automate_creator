import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type { TenantQlik } from "@/modulos/admin/api";
import { listarAutomatizacionesParaAdmin } from "@/modulos/admin/api";
import { configurarAutomatizacionBaseTenant } from "@/modulos/admin/api";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
      mostrarExito("Plantilla base del tenant configurada");
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
    <div>
      <SelectBuscable
        placeholder="Busca y selecciona la automatización plantilla…"
        searchPlaceholder="Escribe el nombre para filtrar…"
        emptyText="No encontramos automatizaciones. Asegúrate de estar conectado al entorno correcto."
        opciones={opciones}
        valorSeleccionado={baseIdSeleccionado}
        onSeleccionar={handleSeleccionar}
        cargando={isLoading}
      />
    </div>
  );
}
