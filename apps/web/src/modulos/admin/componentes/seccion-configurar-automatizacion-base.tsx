import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type { TenantQlik } from "@/modulos/admin/api";
import {
  listarAutomatizacionesParaAdmin,
  configurarPlantillaAutomatizacionTenant,
} from "@/modulos/admin/api";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  organizacionId: string;
  tenantQlik: TenantQlik;
}

const ETIQUETA_MODO_1 = "Plantilla Modo 1 — Dataflow Spark/Python";
const ETIQUETA_MODO_2 = "Plantilla Modo 2 — Dataflow → SFTP → Talend";

export function SeccionConfigurarAutomatizacionBase({
  organizacionId,
  tenantQlik,
}: Props) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [modo1IdSeleccionado, setModo1IdSeleccionado] = useState(
    tenantQlik.automatizacionPlantillaModo1IdQlik ||
      tenantQlik.automatizacionBaseIdQlik ||
      "",
  );
  const [modo2IdSeleccionado, setModo2IdSeleccionado] = useState(
    tenantQlik.automatizacionPlantillaModo2IdQlik || "",
  );

  const { data: automatizaciones = [], isLoading } = useQuery<
    ResumenAutomatizacion[]
  >({
    queryKey: ["automatizaciones-admin-list", tenantQlik.id],
    queryFn: listarAutomatizacionesParaAdmin,
  });

  const guardar = useMutation({
    mutationFn: ({
      modo,
      auto,
    }: {
      modo: 1 | 2;
      auto: ResumenAutomatizacion;
    }) =>
      configurarPlantillaAutomatizacionTenant(
        organizacionId,
        tenantQlik.id,
        modo,
        auto.id,
        auto.nombre,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito("Plantilla del tenant configurada");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const handleSeleccionar = (modo: 1 | 2, id: string) => {
    if (modo === 1) {
      setModo1IdSeleccionado(id);
    } else {
      setModo2IdSeleccionado(id);
    }
    const auto = automatizaciones.find((a) => a.id === id);
    if (auto) {
      guardar.mutate({ modo, auto });
    }
  };

  const opciones = automatizaciones.map((a) => ({
    id: a.id,
    nombre: `${a.nombre} (ID: ${a.id.slice(0, 8)}…)`,
    espacioNombre: a.espacioNombre || "Personal",
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs text-ink-500">
          Cada modo define cómo se clona y ejecuta la automatización. El{' '}
          <strong>Modo 1</strong> clona el script del Dataflow y el catálogo
          Spark. El <strong>Modo 2</strong> exige conexión destino y tabla, e
          inyecta rutas SFTP y esquema.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SelectBuscable
          etiqueta={ETIQUETA_MODO_1}
          placeholder="Busca y selecciona la plantilla Modo 1…"
          searchPlaceholder="Escribe el nombre para filtrar…"
          emptyText="No encontramos automatizaciones. Asegúrate de estar conectado al entorno correcto."
          opciones={opciones}
          valorSeleccionado={modo1IdSeleccionado}
          onSeleccionar={(id) => handleSeleccionar(1, id)}
          cargando={isLoading}
        />
        <SelectBuscable
          etiqueta={ETIQUETA_MODO_2}
          placeholder="Busca y selecciona la plantilla Modo 2…"
          searchPlaceholder="Escribe el nombre para filtrar…"
          emptyText="No encontramos automatizaciones. Asegúrate de estar conectado al entorno correcto."
          opciones={opciones}
          valorSeleccionado={modo2IdSeleccionado}
          onSeleccionar={(id) => handleSeleccionar(2, id)}
          cargando={isLoading}
        />
      </div>
    </div>
  );
}
